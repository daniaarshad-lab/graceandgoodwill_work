"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminPortal, AdminTabType } from "./hooks/useAdminPortal";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ThinSpinner from "@/components/ThinSpinner";

const AdminTabLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
    <ThinSpinner size="lg" text="Loading..." />
  </div>
);

const AdminOverview = dynamic(() => import("./components/AdminOverview"), {
  ssr: false,
  loading: () => <AdminTabLoadingFallback />,
});
const CarerApplications = dynamic(
  () => import("./components/CarerApplications"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const ClientRequests = dynamic(() => import("./components/ClientRequests"), {
  ssr: false,
  loading: () => <AdminTabLoadingFallback />,
});
const ClientRegistry = dynamic(() => import("./components/ClientRegistry"), {
  ssr: false,
  loading: () => <AdminTabLoadingFallback />,
});

const PlacementTracking = dynamic(
  () => import("./components/PlacementTracking"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const EmergencyCases = dynamic(() => import("./components/EmergencyCases"), {
  ssr: false,
  loading: () => <AdminTabLoadingFallback />,
});
const AdminEmergencyCareRequests = dynamic(
  () => import("./components/AdminEmergencyCareRequests"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const EmergencyCareRequestsList = dynamic(
  () => import("./components/EmergencyCareRequestsList"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
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
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const SupportEnquiryManagement = dynamic(
  () => import("./components/SupportEnquiryManagement"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const ProfileUpdateRequests = dynamic(
  () => import("./components/ProfileUpdateRequests"),
  { ssr: false, loading: () => <AdminTabLoadingFallback /> },
);
const BlogPostsTab = dynamic(() => import("./components/blog/BlogPostsTab"), {
  ssr: false,
});

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <ThinSpinner fullScreen size="xl" text="Loading..." />
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const portal = useAdminPortal();
  const [isTabPending, startTabTransition] = useTransition();

  const handleTabChange = (tab: AdminTabType) => {
    startTabTransition(() => {
      portal.setActiveTab(tab);
    });
  };

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

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
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
    blog: "Blog Posts",
  };

  return (
    <main className="h-[calc(100vh-72px)] bg-navy-950 pt-4 pb-6 text-gold-100 flex flex-col">
      <div className="container-wrapper flex-1 flex flex-col min-h-0">
        {/* --- NAVIGATION TABS BAR --- */}
        <div className="shrink-0 z-40 border-b border-gold-300/10 mb-6 pt-2">
          <nav
            ref={scrollRef}
            className="flex flex-nowrap items-center gap-1 pb-1 overflow-x-auto overflow-y-hidden admin-tabs-nav"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.admin-tabs-nav::-webkit-scrollbar { display: none; }`}</style>
            {(Object.keys(tabLabels) as AdminTabType[]).map((tab) => {
              const isActive = portal.activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-3 sm:px-5 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 cursor-pointer ${isActive
                      ? "border-b-2 border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                      : "text-gold-200/60 hover:text-gold-50"
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
                  {tab === "enquiries" && portal.stats.unreadEnquiries > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-navy-950 animate-pulse">
                      {portal.stats.unreadEnquiries}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* --- MAIN OPERATIONAL CONSOLES --- */}
        <div className="flex-1 min-h-0 overflow-y-auto transition-all duration-300">
          {portal.loading || isTabPending ? (
            <div className="flex flex-col items-center justify-center p-20 min-h-[300px]">
              <ThinSpinner size="xl" text="Loading..." />
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
                  setActiveTab={handleTabChange}
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
                  setActiveTab={handleTabChange}
                />
              )}

              {/* TAB 3: CLIENT CARE REQUESTS */}
              {portal.activeTab === "requests" && (
                <ClientRequests
                  requests={portal.requests}
                  setActiveTab={handleTabChange}
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

              {/* TAB 6: EMERGENCY CARE REQUESTS */}
              {portal.activeTab === "emergency" && (
                <EmergencyCareRequestsList
                  requests={portal.emergencyCareRequestsPagination.items}
                  page={portal.emergencyCareRequestsPagination.page}
                  totalPages={portal.emergencyCareRequestsPagination.totalPages}
                  totalItems={portal.emergencyCareRequestsPagination.totalItems}
                  status={portal.emergencyCareRequestsPagination.status}
                  limit={portal.emergencyCareRequestsPagination.limit}
                  loading={portal.emergencyCareRequestsPagination.loading}
                  error={portal.emergencyCareRequestsPagination.error}
                  onPageChange={portal.setEmergencyCareRequestsPage}
                  onStatusChange={portal.setEmergencyCareRequestsStatus}
                  onStatusUpdate={portal.changeEmergencyRequestStatus}
                  onLimitChange={portal.setEmergencyCareRequestsLimit}
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
                  onStatusUpdate={portal.changeEmergencyRequestStatus}
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
              {portal.activeTab === "blog" && <BlogPostsTab />}
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
