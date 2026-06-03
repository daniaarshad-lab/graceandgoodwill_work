"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminPortal, AdminTabType } from "./hooks/useAdminPortal";
import Button from "@/components/Button";

import dynamic from "next/dynamic";

const AdminOverview = dynamic(() => import("./components/AdminOverview"), {
  ssr: false,
});
const CarerApplications = dynamic(
  () => import("./components/CarerApplications"),
  { ssr: false },
);
const ClientRequests = dynamic(() => import("./components/ClientRequests"), {
  ssr: false,
});
const MatchingPanel = dynamic(() => import("./components/MatchingPanel"), {
  ssr: false,
});
const PlacementTracking = dynamic(
  () => import("./components/PlacementTracking"),
  { ssr: false },
);
const EmergencyCases = dynamic(() => import("./components/EmergencyCases"), {
  ssr: false,
});
const ApprovalModal = dynamic(() => import("./components/ApprovalModal"), {
  ssr: false,
});
const MatchAssignmentModal = dynamic(
  () => import("./components/MatchAssignmentModal"),
  { ssr: false },
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const portal = useAdminPortal();

  // Local state to track matching confirmation flow
  const [matchingRequest, setMatchingRequest] = useState<any | null>(null);
  const [matchingCarer, setMatchingCarer] = useState<any | null>(null);

  // Tab mapping names for readable labels
  const tabLabels: Record<AdminTabType, string> = {
    overview: "Dashboard Overview",
    carers: "Carer Applications",
    requests: "Client Requests",
    matching: "Matching Assistant",
    placements: "Tracking & Overrides",
    emergency: "Emergency Triage",
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        {/* --- PREMIUM PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/20">
                Administrative Control Panel
              </span>
              <h1 className="text-2xl tracking-tight text-gold-200 sm:text-3xl">
                Grace & Goodwill Admin Portal
              </h1>
              <p className="text-sm text-gold-100/50">
                Welcome, Admin {user?.firstName || "System Controller"} •
                Authorization Level: Tier 1
              </p>
            </div>

            <Button
              onClick={logout}
              variant="ghost-gold"
              size="sm"
              fullWidth={false}
              className="inline-flex items-center justify-center border border-gold-300/10 bg-navy-950/60 px-4 py-2.5 font-bold text-gold-200 hover:bg-navy-950 hover:border-gold-300/30"
            >
              Secure Logout ➔
            </Button>
          </div>
        </header>

        {/* --- NAVIGATION TABS BAR --- */}
        <nav className="flex flex-wrap gap-2 border-b border-gold-300/10 pb-4">
          {(Object.keys(tabLabels) as AdminTabType[]).map((tab) => {
            const isActive = portal.activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => portal.setActiveTab(tab)}
                className={`relative rounded-xl px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-gold text-navy-950 shadow-elegant"
                    : "bg-navy-900/50 text-gold-100/60 border border-gold-300/5 hover:text-gold hover:border-gold-300/20"
                }`}
              >
                {tabLabels[tab]}
                {tab === "emergency" && portal.stats.emergencyCases > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white animate-pulse">
                    {portal.stats.emergencyCases}
                  </span>
                )}
                {tab === "carers" && portal.stats.pendingCarers > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gold-600 px-1.5 py-0.5 text-[9px] font-black text-navy-950">
                    {portal.stats.pendingCarers}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* --- MAIN OPERATIONAL CONSOLES --- */}
        <div className="transition-all duration-300">
          {portal.activeTab === "overview" && (
            <AdminOverview
              stats={portal.stats}
              activities={portal.activities}
              setActiveTab={portal.setActiveTab}
            />
          )}

          {/* TAB 2: CARER APPLICATIONS */}
          {portal.activeTab === "carers" && (
            <CarerApplications
              carers={portal.carers}
              onReject={portal.handleRejectCarer}
              setSelectedCarerForApproval={portal.setSelectedCarerForApproval}
            />
          )}

          {/* TAB 3: CLIENT CARE REQUESTS */}
          {portal.activeTab === "requests" && (
            <ClientRequests
              requests={portal.requests}
              setSelectedRequestForMatching={
                portal.setSelectedRequestForMatching
              }
              setActiveTab={portal.setActiveTab}
            />
          )}

          {/* TAB 4: AUTOMATED MATCHING PANEL */}
          {portal.activeTab === "matching" && (
            <MatchingPanel
              requests={portal.requests}
              carers={portal.carers}
              selectedRequest={portal.selectedRequestForMatching}
              setSelectedRequest={portal.setSelectedRequestForMatching}
              onCreateMatch={(reqId, carerId) => {
                const req = portal.requests.find((r) => r.id === reqId);
                const car = portal.carers.find((c) => c.id === carerId);
                if (req && car) {
                  setMatchingRequest(req);
                  setMatchingCarer(car);
                }
              }}
            />
          )}

          {/* TAB 5: ACTIVE PLACEMENTS TRACKING */}
          {portal.activeTab === "placements" && (
            <PlacementTracking
              placements={portal.placements}
              carers={portal.carers}
              onToggleContactRelease={portal.handleToggleContactRelease}
              onReassignCarer={portal.handleOverridePlacementCarer}
            />
          )}

          {/* TAB 6: EMERGENCY CASES TRIAGE */}
          {portal.activeTab === "emergency" && (
            <EmergencyCases
              requests={portal.requests}
              carers={portal.carers}
              onCreateMatch={portal.handleCreatePlacement}
            />
          )}
        </div>
      </div>

      {/* --- CONFIRMATION DIALOG MODAL FOR CARER APPROVAL --- */}
      {portal.selectedCarerForApproval && (
        <ApprovalModal
          carer={portal.selectedCarerForApproval}
          onConfirm={portal.handleApproveCarer}
          onCancel={() => portal.setSelectedCarerForApproval(null)}
        />
      )}

      {/* --- CONFIRMATION DIALOG MODAL FOR MATCH CREATION --- */}
      {matchingRequest && matchingCarer && (
        <MatchAssignmentModal
          request={matchingRequest}
          carer={matchingCarer}
          onConfirm={(reqId, carerId) => {
            portal.handleCreatePlacement(reqId, carerId);
            setMatchingRequest(null);
            setMatchingCarer(null);
          }}
          onCancel={() => {
            setMatchingRequest(null);
            setMatchingCarer(null);
          }}
        />
      )}
    </main>
  );
}
