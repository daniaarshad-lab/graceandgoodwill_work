"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { useClientPortal } from "./hooks/useClientPortal";

import PortalHeader from "./components/PortalHeader";
import PortalTabs, { TabType } from "./components/PortalTabs";

import ThinSpinner from "@/components/ThinSpinner";

const LoadingFallback = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <ThinSpinner size="lg" />
  </div>
);

const DashboardOverview = dynamic(
  () => import("./components/DashboardOverview"),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const ClientProfileManagement = dynamic(
  () => import("./components/ClientProfileManagement"),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const CareRequestForm = dynamic(() => import("./components/CareRequestForm"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});
const CarerProfiles = dynamic(() => import("./components/CarerProfiles"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});
const RequestTracking = dynamic(() => import("./components/RequestTracking"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});
const SupportEnquiryPanel = dynamic(
  () => import("./components/enquiry/SupportEnquiryPanel"),
  { ssr: false, loading: () => <LoadingFallback /> },
);
const InterestListPanel = dynamic(
  () => import("./components/InterestListPanel"),
  { ssr: false, loading: () => <LoadingFallback /> },
);

const ClientApplicationsPanel = dynamic(
  () => import("./components/ClientApplicationsPanel"),
  { ssr: false, loading: () => <LoadingFallback /> },
);

const AgreementsPanel = dynamic(() => import("@/components/AgreementsPanel"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

const BillingPanel = dynamic(() => import("./components/BillingPanel"), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

export default function ClientDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as TabType;
  const [activeTab, setActiveTab] = useState<TabType>("request");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/client?${params.toString()}`);
  };

  useEffect(() => {
    if (
      tabParam &&
      [
        "request",
        "overview",
        "profile",
        "carers",
        "tracking",
        "enquiry",
        "interest-list",
        "applications",
        "agreements",
        "billing",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Onboarding flow (reserved for future premium matching)
  // useEffect(() => {
  //   if (!user) return;
  //   const hasCompleted = localStorage.getItem(`client_onboarding_done_${user.id}`) === "true";
  //   const wantsOnboarding = searchParams.get("onboarding") === "true";
  //   if (wantsOnboarding && !hasCompleted) {
  //     setIsOnboarding(true);
  //   }
  // }, [user, searchParams]);

  // const handleOnboardingComplete = (journey: "match" | "browse") => {
  //   if (user?.id) {
  //     localStorage.setItem(`client_onboarding_done_${user.id}`, "true");
  //   }
  //   setIsOnboarding(false);
  //   if (journey === "browse") {
  //     router.push("/client/browse-carers");
  //   } else {
  //     const targetTab = "request";
  //     setActiveTab(targetTab);
  //     router.push(`/client?tab=${targetTab}`);
  //   }
  // };

  // Custom hook containing state + handlers
  const portal = useClientPortal({ user });

  useEffect(() => {
    if (activeTab === "tracking") {
      portal.fetchPlacements();
    }
  }, [activeTab, portal.fetchPlacements]);

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader user={user} />

        <PortalTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        <div className="transition-all duration-300">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <DashboardOverview
              user={user}
              careRequests={portal.careRequests}
              setActiveTab={handleTabChange}
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
              city={portal.careCity}
              setCity={portal.setCareCity}
              postcode={portal.carePostcode}
              setPostcode={portal.setCarePostcode}
              setLatitude={portal.setCareLatitude}
              setLongitude={portal.setCareLongitude}
              notes={portal.careNotes}
              setNotes={portal.setCareNotes}
              isOngoing={portal.isOngoing}
              setIsOngoing={portal.setIsOngoing}
              weeklyPayRange={portal.weeklyPayRange}
              setWeeklyPayRange={portal.setWeeklyPayRange}
              errors={portal.careErrors}
              isSubmitting={portal.isCareSubmitting}
              onSubmit={async (e) => {
                e.preventDefault();
                const success = await portal.handleCareSubmit(e);
                if (success) {
                  handleTabChange("carers");
                }
              }}
              setActiveTab={handleTabChange}
            />
          )}

          {/* TAB 3: CARER PROFILES */}
          {activeTab === "carers" && <CarerProfiles carers={portal.carers} />}

          {/* TAB 5: SUPPORT & ENQUIRIES */}
          {activeTab === "enquiry" && <SupportEnquiryPanel />}

          {/* TAB 7: INTEREST LIST */}
          {activeTab === "interest-list" && <InterestListPanel />}

          {/* TAB 8: APPLICATIONS (Offers received by client) */}
          {activeTab === "applications" && <ClientApplicationsPanel />}

          {/* TAB 8.5: PLACEMENTS (TRACKING) */}
          {activeTab === "tracking" && (
            <RequestTracking
              placements={portal.placements}
              loading={portal.placementsLoading}
              error={portal.placementsError}
              onRetry={portal.fetchPlacements}
              setActiveTab={handleTabChange}
            />
          )}

          {/* TAB 9: AGREEMENTS */}
          {activeTab === "agreements" && <AgreementsPanel />}

          {/* TAB 10: BILLING */}
          {activeTab === "billing" && <BillingPanel />}
        </div>
      </div>
    </main>
  );
}
