"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { useClientPortal } from "./hooks/useClientPortal";

import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";

const DashboardOverview = dynamic(
  () => import("./components/DashboardOverview"),
  { ssr: false },
);
const ClientProfileManagement = dynamic(
  () => import("./components/ClientProfileManagement"),
  { ssr: false },
);
const CareRequestForm = dynamic(() => import("./components/CareRequestForm"), {
  ssr: false,
});
const CarerProfiles = dynamic(() => import("./components/CarerProfiles"), {
  ssr: false,
});
const RequestTracking = dynamic(() => import("./components/RequestTracking"), {
  ssr: false,
});
const SupportEnquiryPanel = dynamic(
  () => import("./components/enquiry/SupportEnquiryPanel"),
  { ssr: false },
);
const IntroductionModal = dynamic(
  () => import("./components/IntroductionModal"),
  { ssr: false },
);

type TabType =
  | "overview"
  | "profile"
  | "request"
  | "carers"
  | "tracking"
  | "enquiry";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Custom hook containing state + handlers
  const portal = useClientPortal({ user });

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader user={user} />

        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="transition-all duration-300">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <DashboardOverview
              user={user}
              careRequests={portal.careRequests}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: PROFILE MANAGEMENT */}
          {activeTab === "profile" && <ClientProfileManagement />}

          {/* TAB 3: SUBMIT CARE REQUEST */}
          {activeTab === "request" && (
            <CareRequestForm
              fullName={portal.careFullName}
              setFullName={portal.setCareFullName}
              email={portal.careEmail}
              setEmail={portal.setCareEmail}
              phone={portal.carePhone}
              setPhone={portal.setCarePhone}
              careType={portal.careType}
              setCareType={portal.setCareType}
              support={portal.careSupport}
              setSupport={portal.setCareSupport}
              startDate={portal.careStartDate}
              setStartDate={portal.setCareStartDate}
              duration={portal.careDuration}
              setDuration={portal.setCareDuration}
              address={portal.careAddress}
              setAddress={portal.setCareAddress}
              notes={portal.careNotes}
              setNotes={portal.setCareNotes}
              errors={portal.careErrors}
              isSubmitting={portal.isCareSubmitting}
              onSubmit={portal.handleCareSubmit}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 3: CARER PROFILES */}
          {activeTab === "carers" && (
            <CarerProfiles
              carers={portal.carers}
              onRequestIntro={portal.handleRequestIntro}
            />
          )}

          {/* TAB 4: REQUEST TRACKING */}
          {activeTab === "tracking" && (
            <RequestTracking careRequests={portal.careRequests} />
          )}

          {/* TAB 5: SUPPORT & ENQUIRIES */}
          {activeTab === "enquiry" && <SupportEnquiryPanel />}
        </div>
      </div>

      {/* --- CONFIRMATION DIALOG MODAL FOR REQUESTING INTRODUCTION --- */}
      {portal.selectedCarer && (
        <IntroductionModal
          carer={portal.selectedCarer}
          careRequests={portal.careRequests}
          onCancel={() => portal.setSelectedCarer(null)}
          onConfirm={portal.confirmIntroRequest}
        />
      )}
    </main>
  );
}
