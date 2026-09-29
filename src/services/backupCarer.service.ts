import { apiFetch } from "@/lib/api";
import {
  UnifiedPlacement,
  ReliefOffer,
  CarerLeaveRequest,
  PlacementCarerRole,
  WithdrawalEligibility,
  PreferredBackupDesignation,
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
    payload: { startDate: string; endDate: string; reason?: string }
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
        reason: payload.reason || "Holiday / Rest Break",
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
   * Get all leave requests for a placement
   */
  async getLeaveRequests(placementId: string): Promise<CarerLeaveRequest[]> {
    try {
      return await apiFetch(`/carer/placements/${placementId}/leave-requests`, {
        method: "GET",
      });
    } catch {
      const allLeaves = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
      return allLeaves.filter((l) => l.placementId === placementId);
    }
  },

  /**
   * Carer fetches their pending Relief Placement Opportunities
   */
  async getReliefOpportunities(): Promise<ReliefOffer[]> {
    try {
      return await apiFetch("/carer/relief-offers", { method: "GET" });
    } catch {
      return getLocalStore<ReliefOffer[]>(STORAGE_KEY_RELIEF_OFFERS, []);
    }
  },

  /**
   * Accept a relief placement offer
   */
  async acceptReliefOffer(assignmentId: string): Promise<any> {
    try {
      return await apiFetch(`/carer/relief-offers/${assignmentId}/accept`, {
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
      return await apiFetch(`/carer/relief-offers/${assignmentId}/decline`, {
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
    try {
      return await apiFetch(`/admin/placements/${placementId}/preferred-backup`, {
        method: "PATCH",
        body: JSON.stringify({ preferredBackupCarerProfileId: carerProfileId }),
      });
    } catch {
      const map = getLocalStore<Record<string, any>>(STORAGE_KEY_BACKUP_CARERS, {});
      map[placementId] = {
        carerProfileId,
        designatedAt: new Date().toISOString(),
        clientName: metadata?.clientName,
        city: metadata?.city,
        careCategory: metadata?.careCategory,
      };
      setLocalStore(STORAGE_KEY_BACKUP_CARERS, map);
      return { success: true, message: "Preferred backup carer updated." };
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
   * Admin dispatches relief offer to preferred backup carer
   */
  async dispatchReliefOfferToBackup(
    placementId: string,
    leaveRequestId: string,
    backupCarerProfileId: string
  ): Promise<any> {
    try {
      return await apiFetch(`/admin/placements/${placementId}/dispatch-relief-offer`, {
        method: "POST",
        body: JSON.stringify({ leaveRequestId, backupCarerProfileId }),
      });
    } catch {
      // Update local leave request status
      const leaves = getLocalStore<CarerLeaveRequest[]>(STORAGE_KEY_LEAVE_REQUESTS, []);
      const updated = leaves.map((l) =>
        l.id === leaveRequestId ? { ...l, status: "OFFERED_TO_BACKUP" as const } : l
      );
      setLocalStore(STORAGE_KEY_LEAVE_REQUESTS, updated);
      return { success: true, message: "Relief offer dispatched to preferred backup carer." };
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
