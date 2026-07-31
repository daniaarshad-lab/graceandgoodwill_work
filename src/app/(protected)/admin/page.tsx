"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminPortal, AdminTabType } from "./hooks/useAdminPortal";

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
const ClientRegistry = dynamic(() => import("./components/ClientRegistry"), {
  ssr: false,
});

const PlacementTracking = dynamic(
  () => import("./components/PlacementTracking"),
  { ssr: false },
);
const EmergencyCases = dynamic(() => import("./components/EmergencyCases"), {
  ssr: false,
});
const AdminEmergencyCareRequests = dynamic(
  () => import("./components/AdminEmergencyCareRequests"),
  { ssr: false },
);
const ApprovalModal = dynamic(() => import("./components/ApprovalModal"), {
  ssr: false,
});
const MatchAssignmentModal = dynamic(
  () => import("./components/MatchAssignmentModal"),
  { ssr: false },
);
const BillingManagement = dynamic(
  () => import("./components/BillingManagement"),
  { ssr: false },
);
const SupportEnquiryManagement = dynamic(
  () => import("./components/SupportEnquiryManagement"),
  { ssr: false },
);
const ProfileUpdateRequests = dynamic(
  () => import("./components/ProfileUpdateRequests"),
  { ssr: false },
);

import { Suspense } from "react";

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold">Loading admin console...</p>
      </main>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const portal = useAdminPortal();

  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeftPos = el.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
    };
    const onMouseUp = () => {
      isDown = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeftPos - walk;
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Local state to track matching confirmation flow
  const [matchingRequest, setMatchingRequest] = useState<any | null>(null);
  const [matchingCarer, setMatchingCarer] = useState<any | null>(null);

  // Tab mapping names for readable labels
  const tabLabels: Record<AdminTabType, string> = {
    overview: "Dashboard Overview",
    carers: "Carer Applications",
    clients: "Client Registry",
    requests: "Client Requests",
    placements: "Tracking & Overrides",
    emergency: "Emergency Triage",
    "emergency-requests": "Emergency Care Requests",
    billing: "Billing & Invoices",
    enquiries: "Support & Enquiries",
    "profile-updates": "Profile Updates",
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">

        {/* --- NAVIGATION TABS BAR --- */}
        <nav
          ref={scrollRef}
          className="flex flex-nowrap items-center gap-1 border-b border-gold-300/10 pb-1 overflow-x-auto overflow-y-hidden admin-tabs-nav"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.admin-tabs-nav::-webkit-scrollbar { display: none; }`}</style>
          {(Object.keys(tabLabels) as AdminTabType[]).filter(tab => tab !== "emergency").map((tab) => {
            const isActive = portal.activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => portal.setActiveTab(tab)}
                className={`px-3 sm:px-5 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? "border-b-2 border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                    : "text-gold-200/60 hover:text-gold-50"
                }`}
              >
                {tabLabels[tab]}
                {/* tab === "emergency" && portal.stats.emergencyCases > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white animate-pulse">
                    {portal.stats.emergencyCases}
                  </span>
                ) */}
                {tab === "carers" && portal.stats.pendingCarers > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gold-600 px-1.5 py-0.5 text-[9px] font-black text-navy-950">
                    {portal.stats.pendingCarers}
                  </span>
                )}
                {tab === "enquiries" && portal.stats.unreadEnquiries > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-navy-950 animate-pulse">
                    {portal.stats.unreadEnquiries}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* --- MAIN OPERATIONAL CONSOLES --- */}
        <div className="transition-all duration-300">
          {portal.loading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gold-100/60 font-semibold">
                Loading dashboard data...
              </p>
            </div>
          ) : portal.error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl mx-auto space-y-4">
              <p className="font-semibold text-sm">
                Failed to load admin console data
              </p>
              <p className="text-xs text-red-500/80">{portal.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300"
              >
                Retry Load
              </button>
            </div>
          ) : (
            <>
              {portal.activeTab === "overview" && (
                <AdminOverview
                  stats={portal.stats}
                  activities={portal.activities}
                  setActiveTab={portal.setActiveTab}
                  isLiveActive={portal.isLiveActive}
                  setIsLiveActive={portal.setIsLiveActive}
                />
              )}

              {/* TAB 2: CARER APPLICATIONS */}
              {portal.activeTab === "carers" && (
                <CarerApplications
                  carers={portal.carers}
                  onUpdateDocumentStatus={portal.handleUpdateDocumentStatus}
                  page={portal.carersPagination.page}
                  totalPages={portal.carersPagination.totalPages}
                  totalItems={portal.carersPagination.totalItems}
                  status={portal.carersPagination.status}
                  onPageChange={portal.setCarersPage}
                  onStatusChange={portal.setCarersStatus}
                  limit={portal.carersPagination.limit}
                  onLimitChange={portal.setCarersLimit}
                />
              )}

              {/* TAB 2.5: CLIENT REGISTRY */}
              {portal.activeTab === "clients" && (
                <ClientRegistry
                  clients={portal.clients}
                  page={portal.clientsPagination.page}
                  totalPages={portal.clientsPagination.totalPages}
                  totalItems={portal.clientsPagination.totalItems}
                  status={portal.clientsPagination.status}
                  onPageChange={portal.setClientsPage}
                  onStatusChange={portal.setClientsStatus}
                  limit={portal.clientsPagination.limit}
                  onLimitChange={portal.setClientsLimit}
                  loading={portal.clientsPagination.loading}
                  error={portal.clientsPagination.error}
                  setActiveTab={portal.setActiveTab}
                />
              )}

              {/* TAB 3: CLIENT CARE REQUESTS */}
              {portal.activeTab === "requests" && (
                <ClientRequests
                  requests={portal.requests}
                  setActiveTab={portal.setActiveTab}
                  page={portal.requestsPagination.page}
                  totalPages={portal.requestsPagination.totalPages}
                  totalItems={portal.requestsPagination.totalItems}
                  status={portal.requestsPagination.status}
                  onPageChange={portal.setRequestsPage}
                  onStatusChange={portal.setRequestsStatus}
                  refreshRequests={portal.refreshRequests}
                />
              )}

              {/* TAB 5: ACTIVE PLACEMENTS TRACKING */}
              {portal.activeTab === "placements" && (
                <PlacementTracking
                  placements={portal.placements}
                  carers={portal.carers}
                  onToggleContactRelease={portal.handleToggleContactRelease}
                  onReassignCarer={portal.handleOverridePlacementCarer}
                  refreshPlacements={portal.refreshPlacements}
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

              {/* TAB 6.5: EMERGENCY CARE REQUESTS (PUBLIC API) */}
              {portal.activeTab === "emergency-requests" && (
                <AdminEmergencyCareRequests
                  requests={portal.emergencyCareRequests}
                  page={portal.emergencyCareRequestsPagination.page}
                  totalPages={portal.emergencyCareRequestsPagination.totalPages}
                  totalItems={portal.emergencyCareRequestsPagination.totalItems}
                  status={portal.emergencyCareRequestsPagination.status}
                  onPageChange={portal.setEmergencyCareRequestsPage}
                  onStatusChange={portal.setEmergencyCareRequestsStatus}
                  loading={portal.emergencyCareRequestsPagination.loading}
                  error={portal.emergencyCareRequestsPagination.error}
                />
              )}

              {/* TAB 7: BILLING & INVOICES */}
              {portal.activeTab === "billing" && (
                <BillingManagement placements={portal.placements} />
              )}

              {/* TAB 8: SUPPORT & ENQUIRIES */}
              {portal.activeTab === "enquiries" && (
                <SupportEnquiryManagement
                  enquiries={portal.enquiries}
                  selectedEnquiry={portal.selectedEnquiry}
                  setSelectedEnquiry={portal.setSelectedEnquiry}
                  loadEnquiryDetails={portal.loadEnquiryDetails}
                  handleRespondToEnquiry={portal.handleRespondToEnquiry}
                  handleUpdateEnquiryStatus={portal.handleUpdateEnquiryStatus}
                />
              )}

              {/* TAB 9: PROFILE UPDATE REQUESTS */}
              {portal.activeTab === "profile-updates" && (
                <ProfileUpdateRequests />
              )}
            </>
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
