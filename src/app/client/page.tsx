"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientPortal } from "./hooks/useClientPortal";
import { mockCarers } from "./data/mockCarers";

// Components
import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";
import DashboardOverview from "./components/DashboardOverview";
import CareRequestForm from "./components/CareRequestForm";
import CarerProfiles from "./components/CarerProfiles";
import RequestTracking from "./components/RequestTracking";
import SupportEnquiryForm from "./components/SupportEnquiryForm";
import IntroductionModal from "./components/IntroductionModal";

type TabType = "overview" | "request" | "carers" | "tracking" | "enquiry";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Custom hook containing state + handlers
  const portal = useClientPortal({ user });

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-10 md:px-8 text-gold-100">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Hero Section */}
        <PortalHeader user={user} logout={logout} />

        {/* Tab Menu Navigation */}
        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* --- INTRODUCTION REQUEST NOTIFICATION BANNER --- */}
        {portal.introSuccessMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {portal.introSuccessMsg}
          </div>
        )}

        {/* Dynamic Panels */}
        <div className="transition-all duration-300">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <DashboardOverview
              user={user}
              careRequests={portal.careRequests}
              enquiries={portal.enquiries}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: SUBMIT CARE REQUEST */}
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
              success={portal.careSuccess}
              onSubmit={portal.handleCareSubmit}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 3: CARER PROFILES */}
          {activeTab === "carers" && (
            <CarerProfiles
              carers={mockCarers}
              onRequestIntro={portal.handleRequestIntro}
            />
          )}

          {/* TAB 4: REQUEST TRACKING */}
          {activeTab === "tracking" && (
            <RequestTracking careRequests={portal.careRequests} />
          )}

          {/* TAB 5: SUPPORT & ENQUIRIES */}
          {activeTab === "enquiry" && (
            <SupportEnquiryForm
              subject={portal.enquirySubject}
              setSubject={portal.setEnquirySubject}
              message={portal.enquiryMessage}
              setMessage={portal.setEnquiryMessage}
              preference={portal.enquiryPreference}
              setPreference={portal.setEnquiryPreference}
              errors={portal.enquiryErrors}
              isSubmitting={portal.isEnquirySubmitting}
              success={portal.enquirySuccess}
              onSubmit={portal.handleEnquirySubmit}
              enquiries={portal.enquiries}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>

      {/* --- CONFIRMATION DIALOG MODAL FOR REQUESTING INTRODUCTION --- */}
      {portal.selectedCarer && (
        <IntroductionModal
          carer={portal.selectedCarer}
          onCancel={() => portal.setSelectedCarer(null)}
          onConfirm={portal.confirmIntroRequest}
        />
      )}
    </main>
  );
}
