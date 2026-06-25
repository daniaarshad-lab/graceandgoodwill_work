import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  CarerApplication,
  ClientRequest,
  Placement,
  AdminActivity,
} from "../types/admin.types";
import { adminService } from "@/services/admin/admin.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import {
  fetchAdminCarers,
  fetchAdminCareRequests,
  fetchAdminClients,
  setCarersPage,
  setCarersStatus,
  setCarersLimit,
  setCareRequestsPage,
  setCareRequestsStatus,
  setCareRequestsLimit,
  setClientsPage,
  setClientsStatus,
  setClientsLimit,
} from "@/store/slices/adminSlice";

// Helper to map backend document category to frontend status with file URLs and IDs
// const getDocDetails = (docs: any[], category: string) => {
//   const doc = docs.find((d: any) => d.fileCategory === category);

//   const categoryNames: Record<string, string> = {
//     CRIMINAL_RECORD_CHECK: "DBS Certificate",
//     DRIVERS_LICENSE: "Driver's License",
//     DEMENTIA_SUPPORT: "Dementia Cert",
//     NURSES_REGISTRY: "Nurses Registry",
//   };

//   const name = categoryNames[category] || category;

//   if (!doc) {
//     return {
//       name,
//       status: "Missing" as const,
//     };
//   }

//   let status: "Uploaded" | "Missing" | "Verified" | "Rejected" = "Uploaded";
//   if (doc.status === "VERIFIED") status = "Verified";
//   else if (doc.status === "REJECTED") status = "Rejected";

//   return {
//     id: doc.id,
//     name,
//     status,
//     fileCategory: doc.fileCategory,
//     fileUrl: doc.fileUrl,
//   };
// };

// Helper to map backend client structures to ClientRegistry format
const mapBackendClients = (backendClients: any[]): any[] => {
  return backendClients.map((client: any) => {
    const profile = client.clientProfile || {};
    return {
      id: client.id,
      name: `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Registered Client",
      email: client.email || "No email listed",
      phone: client.phoneNumber || "No phone listed",
      status: client.status || "PENDING",
      createdAt: client.createdAt,
      
      address: profile.address || "No address listed",
      city: profile.city || "Unknown",
      postcode: profile.postcode || "",
      weeklyFee: profile.weeklyFee || 0,
      profileStatus: profile.status || "PENDING",
      adminMatching: profile.adminMatching || false,
      profileCreatedAt: profile.createdAt || client.createdAt,
    };
  });
};

// Helper to map backend carer structures to frontend CarerApplication format
const mapBackendCarers = (backendCarers: any[]): CarerApplication[] => {
  return backendCarers.map((user: any) => {
    const profile = user.carerProfile || {};
    const rawDocs = profile.documents || [];

    const categoryNames: Record<string, string> = {
      CRIMINAL_RECORD_CHECK: "DBS Certificate",
      DRIVERS_LICENSE: "Driver's License",
      DEMENTIA_SUPPORT: "Dementia Certificate",
      NURSES_REGISTRY: "Nurses Registry",
      PASSPORT: "Passport",
      RIGHT_TO_WORK: "Right to Work",
      PROOF_OF_ADDRESS: "Proof of Address",
      NATIONAL_INSURANCE: "National Insurance",
      PUBLIC_LIABILITY_INSURANCE: "Public Liability Insurance",
      BUSINESS_INSURANCE: "Business Insurance",
      PROFESSIONAL_INDEMNITY: "Professional Indemnity",
      MANDATORY_TRAINING: "Mandatory Training",
      SPECIALIST_TRAINING: "Specialist Training",
    };

    const documents = rawDocs.map((doc: any) => {
      const name = categoryNames[doc.fileCategory] || doc.fileName || doc.fileCategory || "Unnamed Document";
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
    });

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
    } else if (user.status === "PENDING") {
      status = "Pending";
    }

    // Map specialties checking both careSpecialties string/array and careTypes array
    let specialtiesList: string[] = [];
    if (profile.careSpecialties) {
      specialtiesList = Array.isArray(profile.careSpecialties)
        ? profile.careSpecialties
        : typeof profile.careSpecialties === "string"
          ? profile.careSpecialties
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];
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

// Helper to map backend direct careRequest structures to frontend ClientRequest format
const mapBackendCareRequests = (careRequests: any[]): ClientRequest[] => {
  return careRequests.map((req: any) => {
    const profile = req.clientProfile || {};
    const clientUser = profile.user || {};

    let status = req.status || "NEW_ENQUIRY";

    let urgency: "Standard" | "High" | "Emergency" = "Standard";
    if (req.isEmergency) {
      urgency = "Emergency";
    } else if (req.status === "MATCHING_CARERS") {
      urgency = "High";
    }

    return {
      id: req.id,
      clientProfileId: req.clientProfileId,
      clientName:
        `${clientUser.firstName || ""} ${clientUser.lastName || ""}`.trim() ||
        "Unknown Client",
      careType: req.careCategory || "General Care",
      location: req.city || profile.city || "London",
      urgency,
      startDate: req.startDate
        ? new Date(req.startDate).toISOString().split("T")[0]
        : "As soon as possible",
      notes:
        req.additionalNotes ||
        req.requirements ||
        "No additional notes provided.",
      status,
      email: clientUser.email || req.requestorEmail || "",
      phone: clientUser.phoneNumber || req.requestorPhone || "No phone listed",
    };
  });
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
        (i.careRequest?.clientProfileId === p.clientProfileId ||
          i.careRequestId === p.careRequestId),
    );
    const intro = careReq.introductions?.find(
      (i: any) => i.carerProfileId === p.carerProfileId,
    );
    const contactDetailsReleased = approvedIntroForClient
      ? true
      : intro
        ? intro.status === "APPROVED"
        : false;

    let status:
      | "Pending"
      | "Reviewing"
      | "Matched"
      | "Active"
      | "Completed"
      | "Emergency" = "Matched";
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
      timestamp: new Date(p.createdAt)
        .toISOString()
        .replace("T", " ")
        .substring(0, 16),
      description: `Admin assigned ${carerUser.firstName} ${carerUser.lastName} to ${clientUser.firstName} ${clientUser.lastName}.`,
    });

    if (contactDetailsReleased) {
      timeline.push({
        title: "Contacts Approved & Released",
        timestamp: new Date(p.updatedAt)
          .toISOString()
          .replace("T", " ")
          .substring(0, 16),
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
      startDate: p.startDate
        ? new Date(p.startDate).toISOString().split("T")[0]
        : "Pending",
      timeline,
    };
  });
};

export type AdminTabType =
  | "overview"
  | "carers"
  | "clients"
  | "requests"
  | "matching"
  | "placements"
  | "emergency"
  | "billing"
  | "enquiries";

export function useAdminPortal() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as AdminTabType;
  const [activeTab, setActiveTab] = useState<AdminTabType>(
    (tabParam && ["overview", "carers", "clients", "requests", "matching", "placements", "emergency", "billing", "enquiries"].includes(tabParam))
      ? tabParam
      : "overview"
  );

  const dispatch = useAppDispatch();
  const carersPagination = useAppSelector((state) => state.admin.carers);
  const requestsPagination = useAppSelector(
    (state) => state.admin.careRequests,
  );
  const clientsPagination = useAppSelector((state) => state.admin.clients);

  const carers = mapBackendCarers(carersPagination.items);
  const requests = mapBackendCareRequests(requestsPagination.items);
  const clients = mapBackendClients(clientsPagination.items);

  const [placements, setPlacements] = useState<Placement[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const [isLiveActive, setIsLiveActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalClientsCount, setTotalClientsCount] = useState(0);

  // States for lightweight counts to keep Overview stats correct
  const [totalCarersCount, setTotalCarersCount] = useState(0);
  const [pendingCarersCount, setPendingCarersCount] = useState(0);
  const [emergencyCasesCount, setEmergencyCasesCount] = useState(0);

  const prevCarersRef = useRef<CarerApplication[]>([]);
  const prevRequestsRef = useRef<ClientRequest[]>([]);
  const prevPlacementsRef = useRef<Placement[]>([]);
  const prevEnquiriesRef = useRef<any[]>([]);

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

  // Compare new carers with previous carers to log changes
  const checkCarersDiff = useCallback(
    (newCarers: CarerApplication[]) => {
      const prev = prevCarersRef.current;
      if (prev.length > 0) {
        newCarers.forEach((c) => {
          const old = prev.find((pc) => pc.id === c.id);
          if (!old) {
            logActivity(`New carer registered: ${c.name}`, "info");
          } else if (old.status !== c.status) {
            if (c.status === "Approved") {
              logActivity(
                `Carer application for ${c.name} was Approved.`,
                "success",
              );
            } else if (c.status === "Rejected") {
              logActivity(
                `Carer application for ${c.name} was Suspended/Rejected.`,
                "error",
              );
            }
          }
        });
      }
      prevCarersRef.current = newCarers;
    },
    [logActivity],
  );

  const checkRequestsDiff = useCallback(
    (newRequests: ClientRequest[]) => {
      const prev = prevRequestsRef.current;
      if (prev.length > 0) {
        newRequests.forEach((r) => {
          const old = prev.find((pr) => pr.id === r.id);
          if (!old) {
            logActivity(
              `New client care request received from ${r.clientName}`,
              "info",
            );
          } else if (old.status !== r.status) {
            logActivity(
              `Request for ${r.clientName} status changed to ${r.status}.`,
              "success",
            );
          }
        });
      }
      prevRequestsRef.current = newRequests;
    },
    [logActivity],
  );

  // Compare new carers/requests to log changes
  useEffect(() => {
    if (carers.length > 0) {
      checkCarersDiff(carers);
    }
  }, [carers, checkCarersDiff]);

  useEffect(() => {
    if (requests.length > 0) {
      checkRequestsDiff(requests);
    }
  }, [requests, checkRequestsDiff]);

  const checkPlacementsDiff = useCallback(
    (newPlacements: Placement[]) => {
      const prev = prevPlacementsRef.current;
      if (prev.length > 0) {
        newPlacements.forEach((p) => {
          const old = prev.find((pp) => pp.id === p.id);
          if (!old) {
            logActivity(
              `New placement match created: ${p.carerName} with ${p.clientName}.`,
              "success",
            );
          } else if (old.status !== p.status) {
            logActivity(
              `Placement for ${p.clientName} status changed to ${p.status}.`,
              "info",
            );
          }
        });
      }
      prevPlacementsRef.current = newPlacements;
    },
    [logActivity],
  );

  const checkEnquiriesDiff = useCallback(
    (newEnquiries: any[]) => {
      const prev = prevEnquiriesRef.current;
      if (prev.length > 0) {
        newEnquiries.forEach((e) => {
          const old = prev.find((pe) => pe.id === e.id);
          if (!old) {
            logActivity(
              `New support enquiry received from ${e.name}.`,
              "warning",
            );
          } else if (old.status !== e.status) {
            logActivity(
              `Enquiry from ${e.name} status updated to ${e.status}.`,
              "info",
            );
          }
        });
      }
      prevEnquiriesRef.current = newEnquiries;
    },
    [logActivity],
  );

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

  // Load total stats counters
  const loadStatsCounts = useCallback(async () => {
    try {
      const [allCarersRes, pendingCarersRes, emergencyRequestsRes, clientsRes] =
        await Promise.all([
          adminService.getCarers(1, 1, "ALL"),
          adminService.getCarers(1, 1, "PENDING"),
          adminService.getCareRequests(1, 1, "EMERGENCY"),
          adminService.getClients(1, 1, "ALL"),
        ]);
      setTotalCarersCount(allCarersRes.total || 0);
      setPendingCarersCount(pendingCarersRes.total || 0);
      setEmergencyCasesCount(emergencyRequestsRes.total || 0);
      setTotalClientsCount(clientsRes.total || 0);
    } catch (err) {
      console.error("Failed to load stats counts:", err);
    }
  }, []);

  // Load carers from backend API (paginated)
  const loadCarers = useCallback(() => {
    dispatch(
      fetchAdminCarers({
        page: carersPagination.page,
        limit: carersPagination.limit,
        status: carersPagination.status,
      }),
    );
  }, [
    dispatch,
    carersPagination.page,
    carersPagination.limit,
    carersPagination.status,
  ]);

  // Load client requests from backend API (paginated)
  const loadRequests = useCallback(() => {
    dispatch(
      fetchAdminCareRequests({
        page: requestsPagination.page,
        limit: requestsPagination.limit,
        status: requestsPagination.status,
      }),
    );
  }, [
    dispatch,
    requestsPagination.page,
    requestsPagination.limit,
    requestsPagination.status,
  ]);

  // Load placements from backend API
  const loadPlacements = useCallback(async () => {
    try {
      const data = await adminService.getPlacements();
      const mapped = mapBackendPlacements(data);
      checkPlacementsDiff(mapped);
      setPlacements(mapped);
    } catch (err: any) {
      console.error("Failed to load placements:", err.message);
      throw err;
    }
  }, [checkPlacementsDiff]);

  // Load enquiries from backend API
  const loadEnquiries = useCallback(async () => {
    try {
      const data = await adminService.getEnquiries();
      checkEnquiriesDiff(data);
      setEnquiries(data);
    } catch (err: any) {
      console.error("Failed to load enquiries:", err.message);
      throw err;
    }
  }, [checkEnquiriesDiff]);

  // Handle initial data loading for unpaginated components & counts
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          loadPlacements(),
          loadEnquiries(),
          loadStatsCounts(),
        ]);
      } catch (err: any) {
        console.error("Failed to load admin dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [loadPlacements, loadEnquiries, loadStatsCounts]);

  const loadClients = useCallback(() => {
    dispatch(
      fetchAdminClients({
        page: clientsPagination.page,
        limit: clientsPagination.limit,
        status: clientsPagination.status,
      }),
    );
  }, [
    dispatch,
    clientsPagination.page,
    clientsPagination.limit,
    clientsPagination.status,
  ]);

  // Refetch carers whenever page, limit, or status changes
  useEffect(() => {
    loadCarers();
  }, [loadCarers]);

  // Refetch requests whenever page, limit, or status changes
  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Refetch clients whenever page, limit, or status changes
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Action: Approve Carer Application
  const handleApproveCarer = useCallback(
    async (carerId: string) => {
      try {
        await adminService.updateCarerStatus(carerId, "APPROVED");
        logActivity(
          `Carer has been Approved and account activated.`,
          "success",
        );
        loadCarers();
        loadStatsCounts();
      } catch (err: any) {
        logActivity(`Failed to approve carer: ${err.message}`, "error");
      }
      setSelectedCarerForApproval(null);
    },
    [loadCarers, loadStatsCounts, logActivity],
  );

  // Action: Reject Carer Application
  const handleRejectCarer = useCallback(
    async (carerId: string) => {
      try {
        await adminService.updateCarerStatus(carerId, "SUSPENDED");
        logActivity(`Carer has been Suspended/Rejected.`, "error");
        loadCarers();
        loadStatsCounts();
      } catch (err: any) {
        logActivity(`Failed to reject carer: ${err.message}`, "error");
      }
      setSelectedCarerForApproval(null);
    },
    [loadCarers, loadStatsCounts, logActivity],
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

        loadRequests();
        await loadPlacements();
        loadStatsCounts();
      } catch (err: any) {
        logActivity(`Failed to create placement: ${err.message}`, "error");
      }
    },
    [
      requests,
      carers,
      logActivity,
      loadRequests,
      loadPlacements,
      loadStatsCounts,
    ],
  );

  const handleAssignCarerToCareRequest = useCallback(
    async (
      careRequestId: string,
      carerUserId: string,
      carerName: string,
      clientName: string,
    ) => {
      try {
        await adminService.assignCarerToCareRequest(careRequestId, carerUserId);
        logActivity(
          `Successfully matched carer ${carerName} to client request ${clientName}.`,
          "success",
        );
        setSelectedRequestForMatching(null);
        setActiveTab("placements");
        loadRequests();
        await loadPlacements();
        loadStatsCounts();
      } catch (err: any) {
        logActivity(`Failed to assign carer: ${err.message}`, "error");
        throw err;
      }
    },
    [
      logActivity,
      setSelectedRequestForMatching,
      setActiveTab,
      loadRequests,
      loadPlacements,
      loadStatsCounts,
    ],
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
          const intro =
            carerIntros.find(
              (i: any) =>
                i.careRequest?.clientProfileId === rawPlace.clientProfileId,
            ) ||
            rawPlace.careRequest?.introductions.find(
              (i: any) => i.carerProfileId === rawPlace.carerProfileId,
            );

          if (intro) {
            await adminService.updateIntroductionStatus(
              intro.id,
              released ? "APPROVED" : "PENDING",
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
        logActivity(
          `Failed to toggle contact release: ${err.message}`,
          "error",
        );
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
          newCarer.id,
        );

        toast.success(`Successfully reassigned carer to ${newCarer.name}`);
        logActivity(`Reassigned placement for ${newCarer.name}.`, "warning");

        setSelectedPlacementForReassign(null);
        await loadPlacements();
      } catch (err: any) {
        toast.error(err.message || "Failed to reassign placement carer");
        logActivity(
          `Failed to reassign placement carer: ${err.message}`,
          "error",
        );
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
        loadCarers();
        loadStatsCounts();
      } catch (err: any) {
        logActivity(
          `Failed to update document status: ${err.message}`,
          "error",
        );
      }
    },
    [loadCarers, loadStatsCounts, logActivity],
  );

  const loadEnquiryDetails = useCallback(
    async (id: string) => {
      try {
        const data = await adminService.getEnquiryDetails(id);
        setSelectedEnquiry(data);
        await loadEnquiries();
      } catch (err: any) {
        console.error("Failed to load enquiry details:", err.message);
      }
    },
    [loadEnquiries],
  );

  const handleRespondToEnquiry = useCallback(
    async (id: string, message: string) => {
      try {
        await adminService.respondToEnquiry(id, message);
        logActivity("Sent response to enquiry.", "success");
        await loadEnquiryDetails(id);
      } catch (err: any) {
        logActivity(`Failed to send response: ${err.message}`, "error");
      }
    },
    [loadEnquiryDetails, logActivity],
  );

  const handleUpdateEnquiryStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await adminService.updateEnquiryStatus(id, status);
        logActivity(`Updated enquiry status to ${status}.`, "success");
        await loadEnquiryDetails(id);
      } catch (err: any) {
        logActivity(`Failed to update status: ${err.message}`, "error");
      }
    },
    [loadEnquiryDetails, logActivity],
  );

  const stats = {
    totalCarers: totalCarersCount,
    pendingCarers: pendingCarersCount,
    totalClients: totalClientsCount,
    activePlacements: placements.filter(
      (p) => p.status === "Active" || p.status === "Matched",
    ).length,
    emergencyCases: emergencyCasesCount,
    unreadEnquiries: enquiries.filter((e) => !e.isRead).length,
  };

  return {
    activeTab,
    setActiveTab,
    carers,
    requests,
    clients,
    placements,
    activities,
    isLiveActive,
    setIsLiveActive,
    stats,
    loading,
    error,
    selectedCarerForApproval,
    setSelectedCarerForApproval,
    selectedRequestForMatching,
    setSelectedRequestForMatching,
    selectedPlacementForReassign,
    setSelectedPlacementForReassign,
    handleApproveCarer,
    handleRejectCarer,
    handleCreatePlacement,
    handleAssignCarerToCareRequest,
    handleToggleContactRelease,
    handleOverridePlacementCarer,
    handleUpdateDocumentStatus,
    enquiries,
    selectedEnquiry,
    setSelectedEnquiry,
    loadEnquiryDetails,
    handleRespondToEnquiry,
    handleUpdateEnquiryStatus,

    // Pagination helpers and states
    carersPagination,
    requestsPagination,
    clientsPagination,
    setCarersPage: (page: number) => dispatch(setCarersPage(page)),
    setCarersStatus: (status: string) => dispatch(setCarersStatus(status)),
    setCarersLimit: (limit: number) => dispatch(setCarersLimit(limit)),
    setRequestsPage: (page: number) => dispatch(setCareRequestsPage(page)),
    setRequestsStatus: (status: string) =>
      dispatch(setCareRequestsStatus(status)),
    setRequestsLimit: (limit: number) => dispatch(setCareRequestsLimit(limit)),
    setClientsPage: (page: number) => dispatch(setClientsPage(page)),
    setClientsStatus: (status: string) => dispatch(setClientsStatus(status)),
    setClientsLimit: (limit: number) => dispatch(setClientsLimit(limit)),
    refreshRequests: loadRequests,
    refreshPlacements: loadPlacements,
    loadStatsCounts,
  };
}
export type UseAdminPortalReturn = ReturnType<typeof useAdminPortal>;
