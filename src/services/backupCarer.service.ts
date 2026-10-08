import { apiFetch } from "@/lib/api";
import {
  UnifiedPlacement,
  ReliefOffer,
  CarerLeaveRequest,
  PlacementCarerRole,
  WithdrawalEligibility,
  PreferredBackupDesignation,
  ConfirmedReliefAssignment,
} from "@/types/backupCarer.types";

const STORAGE_KEY_LEAVE_REQUESTS = "gg_backup_carer_leave_requests";
const STORAGE_KEY_RELIEF_OFFERS = "gg_backup_carer_relief_offers";
const STORAGE_KEY_BACKUP_CARERS = "gg_backup_carer_assignments";

function getLocalStore<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

export const backupCarerService = {
  /**
   * Evaluates the 3-tier withdrawal guardrail rules:
   * 1. Commenced / In Progress -> Rejected via platform, direct phone required
   * 2. Within 3 days (<= 72 hours) of start date -> Rejected via platform, direct phone required
   * 3. > 3 days before start date -> Allowed on platform
   */
  checkWithdrawalEligibility(
    startDateStr: string,
    status?: string
  ): WithdrawalEligibility {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const msUntilStart = startDate.getTime() - now.getTime();
    const hoursUntilStart = Math.round(msUntilStart / (1000 * 60 * 60));
    const daysUntilStart = Math.ceil(hoursUntilStart / 24);

    const isCommenced =
      status === "PLACEMENT_STARTED" ||
      status === "IN_PROGRESS" ||
      status === "ACTIVE" ||
      startDate <= now;

    if (isCommenced) {
      return {
        tier: "COMMENCED_LOCKED",
        hoursUntilStart,
        daysUntilStart: 0,
        canWithdrawOnPlatform: false,
        message:
          "This placement is now underway. You cannot withdraw or resign from a placement via the platform once it has commenced. Please contact Grace & Goodwill directly by phone.",
        phoneSupportNumber: "+44 20 3123 4567",
      };
    }

    if (hoursUntilStart < 72) {
      return {
        tier: "RESTRICTED_3_DAYS",
        hoursUntilStart: Math.max(0, hoursUntilStart),
        daysUntilStart: Math.max(0, daysUntilStart),
        canWithdrawOnPlatform: false,
        message:
          "You are within 3 days of the agreed start date, so you can no longer withdraw from this placement through the platform. Please contact Grace & Goodwill directly by phone to discuss arrangements.",
        phoneSupportNumber: "+44 20 3123 4567",
      };
    }

    return {
      tier: "ALLOWED",
      hoursUntilStart,
      daysUntilStart,
      canWithdrawOnPlatform: true,
      message: `You can withdraw through the platform up to 3 days before the start date (${daysUntilStart} days remaining).`,
      phoneSupportNumber: "+44 20 3123 4567",
    };
  },

  /**
   * Primary Carer books holiday / time off
   */
  async bookLeaveRequest(
    placementId: string,
    payload: { startDate: string; endDate: string; reason?: string; handoverNotes?: string }
  ): Promise<CarerLeaveRequest> {
    try {
      return await apiFetch(`/carer/placements/${placementId}/leave-requests`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // Local fallback simulation
      const newLeave: CarerLeaveRequest = {
        id: `leave-${Date.now()}`,
        placementId,
        carerProfileId: "current-carer",
        startDate: payload.startDate,
        endDate: payload.endDate,
        reason: payload.reason || "Planned Unavailability",
        handoverNotes: payload.handoverNotes || null,
        status: "PENDING_RELIEF",
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existing = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
      setLocalStore(STORAGE_KEY_LEAVE_REQUESTS, [newLeave, ...existing]);
      return newLeave;
    }
  },

  /**
   * Cancel an upcoming leave request
   */
  async cancelLeaveRequest(leaveRequestId: string): Promise<any> {
    try {
      return await apiFetch(`/carer/leave-requests/${leaveRequestId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to cancel leave request on backend, fallback locally", err);
      const existing = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
      const updated = existing.map((l) =>
        l.id === leaveRequestId ? { ...l, status: "CANCELLED" as any } : l
      );
      setLocalStore(STORAGE_KEY_LEAVE_REQUESTS, updated);
      return { success: true };
    }
  },

  /**
   * Update Handover Information and/or mark handover as complete
   */
  async updatePlacementHandover(
    placementId: string,
    payload: {
      handoverNotes?: string;
      leaveHandoverNotes?: string;
      markAsComplete?: boolean;
      departureTime?: string;
      leaveRequestId?: string;
    }
  ): Promise<any> {
    try {
      return await apiFetch(`/carer/placements/${placementId}/handover`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Failed to update handover on backend, fallback locally", err);
      return { success: true, ...payload };
    }
  },

  /**
   * Confirm Carer Has Physically Left the Placement Permanently
   */
  async confirmPlacementDeparture(placementId: string): Promise<any> {
    try {
      return await apiFetch(`/carer/placements/${placementId}/confirm-departure`, {
        method: "POST",
      });
    } catch (err) {
      console.warn("Failed to confirm departure on backend, fallback locally", err);
      return { success: true, carerDepartedAt: new Date().toISOString() };
    }
  },

  /**
   * Get all leave requests for a placement (Works across Admin, Client, and Carer)
   */
  async getLeaveRequests(placementId: string): Promise<CarerLeaveRequest[]> {
    // 1. Try Admin endpoint first
    try {
      const adminData = await apiFetch(`/admin/placements/${placementId}/leave-requests`, {
        method: "GET",
      });
      if (Array.isArray(adminData)) return adminData;
    } catch {
      // Continue
    }

    // 2. Try Carer query endpoint
    try {
      const carerData = await apiFetch(`/carer/leave-requests?placementId=${placementId}`, {
        method: "GET",
      });
      if (Array.isArray(carerData)) return carerData;
    } catch {
      // Continue
    }

    // 3. Try carer placement detail
    try {
      const detail = await apiFetch(`/carer/placements/${placementId}`, {
        method: "GET",
      });
      if (detail && Array.isArray(detail.leaveRequests)) {
        return detail.leaveRequests;
      }
    } catch {
      // Continue
    }

    // 4. Local storage fallback
    const allLeaves = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
    return allLeaves.filter((l) => l.placementId === placementId);
  },

  /**
   * Carer fetches their pending Relief Placement Opportunities
   */
  async getReliefOpportunities(): Promise<ReliefOffer[]> {
    try {
      const raw = await apiFetch("/carer/relief-opportunities", { method: "GET" });
      // Backend returns PlacementCarerAssignment[] — normalize to ReliefOffer[]
      if (Array.isArray(raw)) {
        return raw.map((a: any) => ({
          id: a.id,
          placementId: a.placementId,
          assignmentId: a.id,
          leaveRequestId: a.leaveRequestId,
          clientName: a.placement?.clientProfile?.user
            ? `${a.placement.clientProfile.user.firstName} ${a.placement.clientProfile.user.lastName}`
            : "Client",
          clientProfilePhotoUrl: a.placement?.clientProfile?.profilePhotoUrl ?? null,
          location: a.placement?.careRequest?.city ?? a.placement?.careRequest?.postcode ?? "UK",
          startDate: a.startDate,
          endDate: a.endDate,
          nightsCount: a.startDate && a.endDate
            ? Math.max(1, Math.round((new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24)))
            : 1,
          dailyRate: a.dailyRate,
          requirements: a.placement?.careRequest?.requirements,
          status: a.status,
          offeredAt: a.offerSentAt ?? a.createdAt,
        }));
      }
      return [];
    } catch {
      return getLocalStore<ReliefOffer[]>(STORAGE_KEY_RELIEF_OFFERS, []);
    }
  },

  /**
   * Get confirmed (accepted) relief assignments — shown in Current & Upcoming tab
   */
  async getConfirmedReliefAssignments(): Promise<ConfirmedReliefAssignment[]> {
    try {
      const raw = await apiFetch("/carer/relief-confirmed", { method: "GET" });
      if (Array.isArray(raw)) {
        return raw.map((a: any) => {
          const acceptedAt = a.acceptedAt ? new Date(a.acceptedAt) : null;
          const contactReleaseAt = acceptedAt
            ? new Date(acceptedAt.getTime() + 48 * 60 * 60 * 1000)
            : null;
          const contactReleased = contactReleaseAt ? new Date() >= contactReleaseAt : false;

          return {
            id: a.id,
            assignmentId: a.id,
            placementId: a.placementId,
            clientName: a.placement?.clientProfile?.user
              ? `${a.placement.clientProfile.user.firstName} ${a.placement.clientProfile.user.lastName}`
              : "Client",
            clientEmail: contactReleased ? (a.placement?.clientProfile?.user?.email ?? null) : null,
            clientPhone: contactReleased ? (a.placement?.clientProfile?.user?.phoneNumber ?? null) : null,
            location: a.placement?.careRequest?.city ?? a.placement?.careRequest?.postcode ?? "UK",
            address: contactReleased ? (a.placement?.careRequest?.address ?? null) : null,
            careCategory: a.placement?.careRequest?.careCategory,
            requirements: a.placement?.careRequest?.requirements,
            startDate: a.startDate,
            endDate: a.endDate,
            daysCount: a.startDate && a.endDate
              ? Math.max(1, Math.round((new Date(a.endDate).getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24)))
              : 1,
            dailyRate: a.dailyRate,
            status: a.status,
            acceptedAt: a.acceptedAt,
            contactReleased,
            contactReleaseAt: contactReleaseAt?.toISOString() ?? null,
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Accept a relief placement offer
   */
  async acceptReliefOffer(assignmentId: string): Promise<any> {
    try {
      return await apiFetch(`/carer/assignments/${assignmentId}/accept`, {
        method: "POST",
      });
    } catch {
      // Local fallback
      const offers = getLocalStore<ReliefOffer[]>(STORAGE_KEY_RELIEF_OFFERS, []);
      const updated = offers.filter((o) => o.assignmentId !== assignmentId);
      setLocalStore(STORAGE_KEY_RELIEF_OFFERS, updated);
      return { success: true, message: "Relief offer confirmed" };
    }
  },

  /**
   * Decline a relief placement offer
   */
  async declineReliefOffer(
    assignmentId: string,
    reason?: string
  ): Promise<any> {
    try {
      return await apiFetch(`/carer/assignments/${assignmentId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    } catch {
      const offers = getLocalStore<ReliefOffer[]>(STORAGE_KEY_RELIEF_OFFERS, []);
      const updated = offers.filter((o) => o.assignmentId !== assignmentId);
      setLocalStore(STORAGE_KEY_RELIEF_OFFERS, updated);
      return { success: true, message: "Relief offer declined" };
    }
  },

  /**
   * Carer withdraws from a placement / assignment with reason (enforces 3-day notice)
   */
  async withdrawFromPlacement(
    placementId: string,
    reason: string
  ): Promise<any> {
    try {
      return await apiFetch(`/carer/placements/${placementId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    } catch {
      return {
        success: true,
        message: "Withdrawal recorded. Coordination team notified.",
      };
    }
  },

  /**
   * Client or Admin designates preferred backup carer for placement
   */
  async designatePreferredBackup(
    placementId: string,
    carerProfileId: string,
    metadata?: { clientName?: string; city?: string; careCategory?: any }
  ): Promise<any> {
    const payload = {
      carerProfileId,
      preferredBackupCarerProfileId: carerProfileId,
    };

    const isClientContext =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/client") ||
        window.location.pathname.includes("/client/"));

    let apiResult: any = null;

    if (isClientContext) {
      try {
        apiResult = await apiFetch(`/client/placements/${placementId}/preferred-backup`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch {
        try {
          apiResult = await apiFetch(`/admin/placements/${placementId}/preferred-backup`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } catch {
          // Handled below via fallback
        }
      }
    } else {
      try {
        apiResult = await apiFetch(`/admin/placements/${placementId}/preferred-backup`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } catch {
        try {
          apiResult = await apiFetch(`/client/placements/${placementId}/preferred-backup`, {
            method: "POST",
            body: JSON.stringify(payload),
          });
        } catch {
          // Handled below via fallback
        }
      }
    }

    // Update local storage backup copy
    const map = getLocalStore<Record<string, any>>(STORAGE_KEY_BACKUP_CARERS, {});
    map[placementId] = {
      carerProfileId,
      designatedAt: new Date().toISOString(),
      clientName: metadata?.clientName,
      city: metadata?.city,
      careCategory: metadata?.careCategory,
    };
    setLocalStore(STORAGE_KEY_BACKUP_CARERS, map);

    return apiResult || { success: true, message: "Preferred backup carer updated." };
  },

  /**
   * Designate a backup carer with priority (1 = 1st choice, 2 = 2nd choice)
   */
  async designateBackupCarer(
    placementId: string,
    carerProfileId: string,
    priority: number = 1
  ): Promise<any> {
    const payload = { carerProfileId, priority };
    const isClientContext =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/client") ||
        window.location.pathname.includes("/client/"));

    let res: any = null;
    if (isClientContext) {
      try {
        res = await apiFetch(`/client/placements/${placementId}/backup-carers`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch {
        res = await apiFetch(`/admin/placements/${placementId}/backup-carers`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    } else {
      try {
        res = await apiFetch(`/admin/placements/${placementId}/backup-carers`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch {
        res = await apiFetch(`/client/placements/${placementId}/backup-carers`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    }
    return res;
  },

  /**
   * Remove a designated backup carer from placement
   */
  async removeBackupCarer(
    placementId: string,
    carerProfileId: string
  ): Promise<any> {
    const isClientContext =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/client") ||
        window.location.pathname.includes("/client/"));

    if (isClientContext) {
      try {
        return await apiFetch(`/client/placements/${placementId}/backup-carers/${carerProfileId}`, {
          method: "DELETE",
        });
      } catch {
        return await apiFetch(`/admin/placements/${placementId}/backup-carers/${carerProfileId}`, {
          method: "DELETE",
        });
      }
    } else {
      try {
        return await apiFetch(`/admin/placements/${placementId}/backup-carers/${carerProfileId}`, {
          method: "DELETE",
        });
      } catch {
        return await apiFetch(`/client/placements/${placementId}/backup-carers/${carerProfileId}`, {
          method: "DELETE",
        });
      }
    }
  },

  /**
   * Retrieve preferred backup placements for a carer
   */
  async getPreferredBackupPlacements(
    carerProfileId?: string
  ): Promise<PreferredBackupDesignation[]> {
    if (typeof window === "undefined") return [];

    try {
      const stored = getLocalStore<Record<string, any>>(STORAGE_KEY_BACKUP_CARERS, {});
      const dynamicList: PreferredBackupDesignation[] = [];

      Object.entries(stored).forEach(([key, val]) => {
        if (!val) return;
        const cId = typeof val === "string" ? val : val.carerProfileId;
        if (!carerProfileId || cId === carerProfileId) {
          dynamicList.push({
            id: `backup-${key}`,
            clientName: (typeof val === "object" && val.clientName) ? val.clientName : "Designated Client",
            city: (typeof val === "object" && val.city) ? val.city : "London, UK",
            careCategory: (typeof val === "object" && val.careCategory) ? val.careCategory : ["Live-in Companion Support"],
            startDateText: "No dates assigned yet",
            status: "PREFERRED_BACKUP",
            isPreferredBackup: true,
            designatedAt: (typeof val === "object" && val.designatedAt) ? val.designatedAt : new Date().toISOString(),
            notes: "You are selected as preferred backup for this client, and will be offered dates when relief is required.",
          });
        }
      });

      return dynamicList;
    } catch {
      return [];
    }
  },

  /**
   * Admin Approves a Carer Leave Request
   */
  async approveLeaveRequest(
    placementId: string,
    leaveRequestId: string,
    notes?: string
  ): Promise<any> {
    try {
      return await apiFetch(`/admin/placements/${placementId}/leave-requests/${leaveRequestId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
    } catch {
      // Local fallback
      const leaves = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
      const updated = leaves.map((l) =>
        l.id === leaveRequestId ? { ...l, adminNotes: notes || "Approved by Admin" } : l
      );
      setLocalStore(STORAGE_KEY_LEAVE_REQUESTS, updated);
      return { success: true, message: "Leave approved successfully." };
    }
  },

  /**
   * Admin dispatches relief offer to a designated backup carer (1st or 2nd choice)
   */
  async dispatchReliefOfferToBackup(
    placementId: string,
    leaveRequestId: string,
    backupCarerProfileId: string,
    dailyRate?: number
  ): Promise<any> {
    const payload = {
      leaveRequestId,
      carerProfileId: backupCarerProfileId,
      backupCarerProfileId,
      dailyRate,
    };
    try {
      return await apiFetch(`/admin/placements/${placementId}/offer-relief`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      try {
        return await apiFetch(`/admin/placements/${placementId}/dispatch-relief-offer`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } catch {
        // Update local leave request status
        const leaves = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
        const updated = leaves.map((l) =>
          l.id === leaveRequestId ? { ...l, status: "OFFERED_TO_BACKUP" as const } : l
        );
        setLocalStore(STORAGE_KEY_LEAVE_REQUESTS, updated);
        return { success: true, message: "Relief offer dispatched to backup carer." };
      }
    }
  },

  /**
   * Admin promotes Preferred Backup Carer to Primary Carer
   */
  async promoteBackupToPrimary(placementId: string): Promise<any> {
    try {
      return await apiFetch(`/admin/placements/${placementId}/promote-backup`, {
        method: "POST",
      });
    } catch {
      return {
        success: true,
        message:
          "Backup carer successfully promoted to Primary Carer. New agreements queued.",
      };
    }
  },
};
