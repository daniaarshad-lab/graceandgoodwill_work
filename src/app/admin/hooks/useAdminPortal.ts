import { useState, useCallback } from "react";
import {
  CarerApplication,
  ClientRequest,
  Placement,
  AdminActivity,
} from "../types/admin.types";
import { mockApplications } from "../data/mockApplications";
import { mockClientRequests } from "../data/mockClientRequests";
import { mockPlacements } from "../data/mockPlacements";

export type AdminTabType =
  | "overview"
  | "carers"
  | "requests"
  | "matching"
  | "placements"
  | "emergency";

export function useAdminPortal() {
  // Tabs State
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");

  // Core Entity State
  const [carers, setCarers] = useState<CarerApplication[]>(mockApplications);
  const [requests, setRequests] = useState<ClientRequest[]>(mockClientRequests);
  const [placements, setPlacements] = useState<Placement[]>(mockPlacements);

  // Activities Log State
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

  // Action: Approve Carer Application
  const handleApproveCarer = useCallback(
    (carerId: string) => {
      setCarers((prev) =>
        prev.map((c) => {
          if (c.id === carerId) {
            logActivity(
              `Carer '${c.name}' has been Approved and DBS verified.`,
              "success",
            );
            return {
              ...c,
              status: "Approved",
              dbsStatus: "Verified",
              documents: c.documents.map((doc) => ({
                ...doc,
                status: "Verified",
              })),
            };
          }
          return c;
        }),
      );
      setSelectedCarerForApproval(null);
    },
    [logActivity],
  );

  // Action: Reject Carer Application
  const handleRejectCarer = useCallback(
    (carerId: string) => {
      setCarers((prev) =>
        prev.map((c) => {
          if (c.id === carerId) {
            logActivity(`Carer '${c.name}' has been Rejected.`, "error");
            return {
              ...c,
              status: "Rejected",
            };
          }
          return c;
        }),
      );
      setSelectedCarerForApproval(null);
    },
    [logActivity],
  );

  // Action: Create Match/Placement
  const handleCreatePlacement = useCallback(
    (requestId: string, carerId: string) => {
      const clientReq = requests.find((r) => r.id === requestId);
      const carerObj = carers.find((c) => c.id === carerId);

      if (!clientReq || !carerObj) return;

      // Create new Placement
      const newPlacement: Placement = {
        id: `place-${Date.now()}`,
        clientId: clientReq.id,
        clientName: clientReq.clientName,
        carerId: carerObj.id,
        carerName: carerObj.name,
        careType: clientReq.careType,
        location: clientReq.location,
        urgency: clientReq.urgency,
        status: "Matched",
        contactDetailsReleased: false, // Default is hidden
        startDate: clientReq.startDate,
        timeline: [
          {
            title: "Match Assigned",
            timestamp: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
            description: `Placement assigned to carer ${carerObj.name} by Admin override.`,
          },
        ],
      };

      // Update Client Request Status
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "Matched" } : r)),
      );

      // Add Placement
      setPlacements((prev) => [newPlacement, ...prev]);

      // Log Event
      logActivity(
        `Successfully matched ${carerObj.name} to client ${clientReq.clientName}.`,
        "success",
      );

      // Reset interaction state
      setSelectedRequestForMatching(null);
      setActiveTab("placements"); // Transition to tracking page
    },
    [requests, carers, logActivity],
  );

  // Action: Toggle Contact Details Release
  const handleToggleContactRelease = useCallback(
    (placementId: string) => {
      setPlacements((prev) =>
        prev.map((p) => {
          if (p.id === placementId) {
            const released = !p.contactDetailsReleased;
            logActivity(
              `Contact details sharing for ${p.clientName} and ${p.carerName} has been ${
                released ? "Released / Enabled" : "Revoked / Disabled"
              }.`,
              released ? "success" : "warning",
            );
            return {
              ...p,
              contactDetailsReleased: released,
              timeline: [
                ...p.timeline,
                {
                  title: released
                    ? "Contact Details Released"
                    : "Contact Details Revoked",
                  timestamp: new Date()
                    .toISOString()
                    .replace("T", " ")
                    .substring(0, 16),
                  description: released
                    ? "Admin approved contact detail sharing for direct communication."
                    : "Admin revoked contact details visibility.",
                },
              ],
            };
          }
          return p;
        }),
      );
    },
    [logActivity],
  );

  // Action: Override or Reassign Carer manually
  const handleOverridePlacementCarer = useCallback(
    (placementId: string, newCarerId: string) => {
      const newCarer = carers.find((c) => c.id === newCarerId);
      if (!newCarer) return;

      setPlacements((prev) =>
        prev.map((p) => {
          if (p.id === placementId) {
            logActivity(
              `Reassigned placement for ${p.clientName}: replaced ${p.carerName} with ${newCarer.name}.`,
              "warning",
            );
            return {
              ...p,
              carerId: newCarer.id,
              carerName: newCarer.name,
              timeline: [
                ...p.timeline,
                {
                  title: "Carer Reassigned (Override)",
                  timestamp: new Date()
                    .toISOString()
                    .replace("T", " ")
                    .substring(0, 16),
                  description: `Admin manually reassigned carer from ${p.carerName} to ${newCarer.name}.`,
                },
              ],
            };
          }
          return p;
        }),
      );

      setSelectedPlacementForReassign(null);
    },
    [carers, logActivity],
  );

  // Stats calculation
  const stats = {
    totalCarers: carers.length,
    pendingCarers: carers.filter((c) => c.status === "Pending").length,
    activePlacements: placements.filter(
      (p) => p.status === "Active" || p.status === "Matched",
    ).length,
    emergencyCases: requests.filter(
      (r) => r.status === "Emergency" || r.urgency === "Emergency",
    ).length,
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
  };
}
export type UseAdminPortalReturn = ReturnType<typeof useAdminPortal>;
