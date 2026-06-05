import { useState, useCallback, useEffect } from "react";
import {
  CarerApplication,
  ClientRequest,
  Placement,
  AdminActivity,
} from "../types/admin.types";
import { adminService } from "@/services/admin/admin.service";
import { Enquiry } from "@/app/(protected)/client/types/client-ui.types";

// Helper to map backend document category to frontend status with file URLs and IDs
const getDocDetails = (docs: any[], category: string) => {
  const doc = docs.find((d: any) => d.fileCategory === category);

  const categoryNames: Record<string, string> = {
    CRIMINAL_RECORD_CHECK: "DBS Certificate",
    DRIVERS_LICENSE: "Driver's License",
    DEMENTIA_SUPPORT: "Dementia Cert",
    NURSES_REGISTRY: "Nurses Registry",
  };

  const name = categoryNames[category] || category;

  if (!doc) {
    return {
      name,
      status: "Missing" as const,
    };
  }

  let status: "Uploaded" | "Missing" | "Verified" | "Rejected" = "Uploaded";
  if (doc.status === "VERIFIED") status = "Verified";
  else if (doc.status === "REJECTED") status = "Rejected";

  return {
    id: doc.id,
    name,
    status,
    fileCategory: doc.fileCategory,
    fileUrl: doc.fileUrl,
  };
};

// Helper to map backend carer structures to frontend CarerApplication format
const mapBackendCarers = (backendCarers: any[]): CarerApplication[] => {
  return backendCarers.map((user: any) => {
    const profile = user.carerProfile || {};
    const rawDocs = profile.documents || [];

    const documents = [
      getDocDetails(rawDocs, "CRIMINAL_RECORD_CHECK"),
      getDocDetails(rawDocs, "DRIVERS_LICENSE"),
      getDocDetails(rawDocs, "DEMENTIA_SUPPORT"),
      getDocDetails(rawDocs, "NURSES_REGISTRY"),
    ];

    let availabilityStr = "Not configured";
    if (profile.availability) {
      if (typeof profile.availability === "string") {
        availabilityStr = profile.availability;
      } else if (Array.isArray(profile.availability)) {
        const activeDays = profile.availability
          .filter((d: any) => d.enabled)
          .map((d: any) => {
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return dayNames[d.dayOfWeek] || `Day ${d.dayOfWeek}`;
          });
        if (activeDays.length > 0) {
          availabilityStr = `Active days: ${activeDays.join(", ")}`;
        }
      }
    }

    let dbsStatus: "Pending" | "Verified" | "Failed" = "Pending";
    const dbsDoc = rawDocs.find(
      (d: any) => d.fileCategory === "CRIMINAL_RECORD_CHECK",
    );
    if (dbsDoc) {
      if (dbsDoc.status === "VERIFIED") dbsStatus = "Verified";
      else if (dbsDoc.status === "REJECTED") dbsStatus = "Failed";
    }

    let status: "Pending" | "Approved" | "Rejected" = "Pending";
    if (user.status === "APPROVED" || user.status === "ACTIVE") {
      status = "Approved";
    } else if (user.status === "SUSPENDED") {
      status = "Rejected";
    }

    // Map specialties checking both careSpecialties string and careTypes array
    let specialtiesList: string[] = [];
    if (profile.careSpecialties) {
      specialtiesList = profile.careSpecialties
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (profile.careTypes && Array.isArray(profile.careTypes)) {
      specialtiesList = profile.careTypes;
    }

    return {
      id: user.id,
      carerProfileId: profile.id,
      name: `${user.firstName} ${user.lastName}`,
      experience:
        profile.experience ||
        (profile.experienceYears
          ? `${profile.experienceYears} Years`
          : "No experience listed"),
      city: profile.city || "Unknown",
      dbsStatus,
      specialties: specialtiesList,
      documents,
      availability: availabilityStr,
      status,
      email: user.email,
      phone: user.phoneNumber || "No phone listed",
    };
  });
};

// Helper to map backend client structures to frontend ClientRequest format
const mapBackendRequests = (backendClients: any[]): ClientRequest[] => {
  const requestsList: ClientRequest[] = [];

  backendClients.forEach((client: any) => {
    const profile = client.clientProfile || {};
    const careRequests = profile.careRequests || [];

    careRequests.forEach((req: any) => {
      let status: "Unmatched" | "Matched" | "Reviewing" | "Emergency" = "Unmatched";
      if (req.status === "MATCHED" || req.status === "PLACEMENT_CONFIRMED") {
        status = "Matched";
      } else if (req.isEmergency) {
        status = "Emergency";
      } else if (req.status === "UNDER_REVIEW") {
        status = "Reviewing";
      }

      let urgency: "Standard" | "High" | "Emergency" = "Standard";
      if (req.isEmergency) {
        urgency = "Emergency";
      } else if (req.status === "MATCHING_CARERS") {
        urgency = "High";
      }

      requestsList.push({
        id: req.id,
        clientProfileId: profile.id,
        clientName: `${client.firstName} ${client.lastName}`,
        careType: req.careCategory || "General Care",
        location: req.city || profile.city || "London",
        urgency,
        startDate: req.startDate ? new Date(req.startDate).toISOString().split('T')[0] : "As soon as possible",
        notes: req.additionalNotes || req.requirements || "No additional notes provided.",
        status,
        email: client.email || req.requestorEmail || "",
        phone: client.phoneNumber || req.requestorPhone || "No phone listed",
      });
    });
  });

  return requestsList;
};

// Helper to map backend placement structures to frontend Placement format
const mapBackendPlacements = (backendPlacements: any[]): Placement[] => {
  return backendPlacements.map((p: any) => {
    const carerUser = p.carerProfile?.user || {};
    const clientUser = p.clientProfile?.user || {};
    const careReq = p.careRequest || {};

    let urgency: "Standard" | "High" | "Emergency" = "Standard";
    if (careReq.isEmergency) {
      urgency = "Emergency";
    }

    const carerIntros = p.carerProfile?.introductions || [];
    const approvedIntroForClient = carerIntros.find(
      (i: any) =>
        i.status === "APPROVED" &&
        (i.careRequest?.clientProfileId === p.clientProfileId || i.careRequestId === p.careRequestId)
    );
    const intro = careReq.introductions?.find(
      (i: any) => i.carerProfileId === p.carerProfileId
    );
    const contactDetailsReleased = approvedIntroForClient
      ? true
      : (intro ? intro.status === "APPROVED" : false);

    let status: "Pending" | "Reviewing" | "Matched" | "Active" | "Completed" | "Emergency" = "Matched";
    if (p.status === "ACTIVE") {
      status = contactDetailsReleased ? "Active" : "Matched";
    } else if (p.status === "COMPLETED") {
      status = "Completed";
    } else if (p.status === "TERMINATED" || p.status === "CANCELLED") {
      status = "Completed";
    }

    const timeline = [];
    timeline.push({
      title: "Match Created",
      timestamp: new Date(p.createdAt).toISOString().replace("T", " ").substring(0, 16),
      description: `Admin assigned ${carerUser.firstName} ${carerUser.lastName} to ${clientUser.firstName} ${clientUser.lastName}.`,
    });

    if (contactDetailsReleased) {
      timeline.push({
        title: "Contacts Approved & Released",
        timestamp: new Date(p.updatedAt).toISOString().replace("T", " ").substring(0, 16),
        description: "Admin approved contact detail sharing.",
      });
    }

    return {
      id: p.id,
      clientId: p.clientProfileId,
      clientName: `${clientUser.firstName} ${clientUser.lastName}`,
      carerId: p.carerProfileId,
      carerName: `${carerUser.firstName} ${carerUser.lastName}`,
      careType: careReq.careCategory || "General Care",
      location: careReq.city || p.clientProfile?.city || "London",
      urgency,
      status,
      contactDetailsReleased,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : "Pending",
      timeline,
    };
  });
};

export type AdminTabType =
  | "overview"
  | "carers"
  | "requests"
  | "matching"
  | "placements"
  | "emergency"
  | "billing"
  | "enquiries";

export function useAdminPortal() {
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");

  const [carers, setCarers] = useState<CarerApplication[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const [activities, setActivities] = useState<AdminActivity[]>([
    {
      id: "act-1",
      timestamp: "2026-05-26 14:30",
      message: "System initialized. Seeded data loaded.",
      type: "info",
    },
    {
      id: "act-2",
      timestamp: "2026-05-26 15:15",
      message: "Client request for Winston Churchill was marked as 'Matched'.",
      type: "success",
    },
  ]);

  // Modal / Interaction State
  const [selectedCarerForApproval, setSelectedCarerForApproval] =
    useState<CarerApplication | null>(null);
  const [selectedRequestForMatching, setSelectedRequestForMatching] =
    useState<ClientRequest | null>(null);
  const [selectedPlacementForReassign, setSelectedPlacementForReassign] =
    useState<Placement | null>(null);

  // Helper to add activity logs
  const logActivity = useCallback(
    (
      message: string,
      type: "info" | "success" | "warning" | "error" = "info",
    ) => {
      const newActivity: AdminActivity = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        message,
        type,
      };
      setActivities((prev) => [newActivity, ...prev]);
    },
    [],
  );

  // Load carers from backend API
  const loadCarers = useCallback(async () => {
    try {
      const data = await adminService.getCarers();
      const mapped = mapBackendCarers(data);
      setCarers(mapped);
    } catch (err: any) {
      console.error("Failed to load carers:", err.message);
    }
  }, []);

  // Load client requests from backend API
  const loadRequests = useCallback(async () => {
    try {
      const data = await adminService.getClients();
      const mapped = mapBackendRequests(data);
      setRequests(mapped);
    } catch (err: any) {
      console.error("Failed to load client requests:", err.message);
    }
  }, []);

  // Load placements from backend API
  const loadPlacements = useCallback(async () => {
    try {
      const data = await adminService.getPlacements();
      const mapped = mapBackendPlacements(data);
      setPlacements(mapped);
    } catch (err: any) {
      console.error("Failed to load placements:", err.message);
    }
  }, []);

  // Load enquiries from backend API
  const loadEnquiries = useCallback(async () => {
    try {
      const data = await adminService.getEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      console.error("Failed to load enquiries:", err.message);
    }
  }, []);

  useEffect(() => {
    loadCarers();
    loadRequests();
    loadPlacements();
    loadEnquiries();
  }, [loadCarers, loadRequests, loadPlacements, loadEnquiries]);

  // Action: Approve Carer Application
  const handleApproveCarer = useCallback(
    async (carerId: string) => {
      try {
        await adminService.updateCarerStatus(carerId, "APPROVED");
        logActivity(
          `Carer has been Approved and account activated.`,
          "success",
        );
        await loadCarers();
      } catch (err: any) {
        logActivity(`Failed to approve carer: ${err.message}`, "error");
      }
      setSelectedCarerForApproval(null);
    },
    [loadCarers, logActivity],
  );

  // Action: Reject Carer Application
  const handleRejectCarer = useCallback(
    async (carerId: string) => {
      try {
        await adminService.updateCarerStatus(carerId, "SUSPENDED");
        logActivity(`Carer has been Suspended/Rejected.`, "error");
        await loadCarers();
      } catch (err: any) {
        logActivity(`Failed to reject carer: ${err.message}`, "error");
      }
      setSelectedCarerForApproval(null);
    },
    [loadCarers, logActivity],
  );

  const handleCreatePlacement = useCallback(
    async (requestId: string, carerId: string) => {
      const clientReq = requests.find((r) => r.id === requestId);
      const carerObj = carers.find((c) => c.id === carerId);

      if (!clientReq || !carerObj) return;

      try {
        await adminService.createPlacement({
          carerProfileId: carerObj.carerProfileId!,
          clientProfileId: clientReq.clientProfileId!,
          careRequestId: clientReq.id,
          hourlyRate: 15.0,
          startDate: clientReq.startDate || new Date().toISOString(),
        });

        logActivity(
          `Successfully matched ${carerObj.name} to client ${clientReq.clientName}.`,
          "success",
        );

        setSelectedRequestForMatching(null);
        setActiveTab("placements");

        await loadRequests();
        await loadPlacements();
      } catch (err: any) {
        logActivity(`Failed to create placement: ${err.message}`, "error");
      }
    },
    [requests, carers, logActivity, loadRequests, loadPlacements],
  );

  // Action: Toggle Contact Details Release
  const handleToggleContactRelease = useCallback(
    async (placementId: string) => {
      const place = placements.find((p) => p.id === placementId);
      if (!place) return;

      const released = !place.contactDetailsReleased;

      try {
        const rawPlacements = await adminService.getPlacements();
        const rawPlace = rawPlacements.find((rp) => rp.id === placementId);

        if (rawPlace) {
          const carerIntros = rawPlace.carerProfile?.introductions || [];
          const intro = carerIntros.find(
            (i: any) => i.careRequest?.clientProfileId === rawPlace.clientProfileId
          ) || rawPlace.careRequest?.introductions.find(
            (i: any) => i.carerProfileId === rawPlace.carerProfileId
          );

          if (intro) {
            await adminService.updateIntroductionStatus(
              intro.id,
              released ? "APPROVED" : "PENDING"
            );
          } else if (rawPlace.careRequestId) {
            await adminService.createDirectMatch({
              careRequestId: rawPlace.careRequestId,
              carerProfileId: rawPlace.carerProfileId,
            });
          }
        }

        logActivity(
          `Contact details sharing for ${place.clientName} and ${place.carerName} has been ${
            released ? "Released / Enabled" : "Revoked / Disabled"
          }.`,
          released ? "success" : "warning",
        );

        await loadPlacements();
      } catch (err: any) {
        logActivity(`Failed to toggle contact release: ${err.message}`, "error");
      }
    },
    [placements, logActivity, loadPlacements],
  );

  // Action: Override or Reassign Carer manually
  const handleOverridePlacementCarer = useCallback(
    async (placementId: string, newCarerId: string) => {
      const newCarer = carers.find((c) => c.id === newCarerId);
      if (!newCarer) return;

      try {
        await adminService.replaceCarerInPlacement(
          placementId,
          newCarer.carerProfileId!
        );

        logActivity(
          `Reassigned placement for ${newCarer.name}.`,
          "warning",
        );

        setSelectedPlacementForReassign(null);
        await loadPlacements();
      } catch (err: any) {
        logActivity(`Failed to reassign placement carer: ${err.message}`, "error");
      }
    },
    [carers, logActivity, loadPlacements],
  );

  const handleUpdateDocumentStatus = useCallback(
    async (docId: string, status: "VERIFIED" | "REJECTED") => {
      try {
        await adminService.updateDocumentStatus(docId, status);
        logActivity(
          `Document has been ${status === "VERIFIED" ? "Approved" : "Rejected"}.`,
          status === "VERIFIED" ? "success" : "warning",
        );
        await loadCarers();
      } catch (err: any) {
        logActivity(
          `Failed to update document status: ${err.message}`,
          "error",
        );
      }
    },
    [loadCarers, logActivity],
  );

  const loadEnquiryDetails = useCallback(async (id: string) => {
    try {
      const data = await adminService.getEnquiryDetails(id);
      setSelectedEnquiry(data);
      await loadEnquiries();
    } catch (err: any) {
      console.error("Failed to load enquiry details:", err.message);
    }
  }, [loadEnquiries]);

  const handleRespondToEnquiry = useCallback(async (id: string, message: string) => {
    try {
      await adminService.respondToEnquiry(id, message);
      logActivity("Sent response to enquiry.", "success");
      await loadEnquiryDetails(id);
    } catch (err: any) {
      logActivity(`Failed to send response: ${err.message}`, "error");
    }
  }, [loadEnquiryDetails, logActivity]);

  const handleUpdateEnquiryStatus = useCallback(async (id: string, status: string) => {
    try {
      await adminService.updateEnquiryStatus(id, status);
      logActivity(`Updated enquiry status to ${status}.`, "success");
      await loadEnquiryDetails(id);
    } catch (err: any) {
      logActivity(`Failed to update status: ${err.message}`, "error");
    }
  }, [loadEnquiryDetails, logActivity]);

  const stats = {
    totalCarers: carers.length,
    pendingCarers: carers.filter((c) => c.status === "Pending").length,
    activePlacements: placements.filter(
      (p) => p.status === "Active" || p.status === "Matched",
    ).length,
    emergencyCases: requests.filter(
      (r) => r.status === "Emergency" || r.urgency === "Emergency",
    ).length,
    unreadEnquiries: enquiries.filter((e) => !e.isRead).length,
  };

  return {
    activeTab,
    setActiveTab,
    carers,
    requests,
    placements,
    activities,
    stats,
    selectedCarerForApproval,
    setSelectedCarerForApproval,
    selectedRequestForMatching,
    setSelectedRequestForMatching,
    selectedPlacementForReassign,
    setSelectedPlacementForReassign,
    handleApproveCarer,
    handleRejectCarer,
    handleCreatePlacement,
    handleToggleContactRelease,
    handleOverridePlacementCarer,
    handleUpdateDocumentStatus,
    enquiries,
    selectedEnquiry,
    setSelectedEnquiry,
    loadEnquiryDetails,
    handleRespondToEnquiry,
    handleUpdateEnquiryStatus,
  };
}
export type UseAdminPortalReturn = ReturnType<typeof useAdminPortal>;
