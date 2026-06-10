"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarerDocuments,
  fetchCarerProfile,
} from "@/store/slices/carerSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useCarerPortal } from "./hooks/useCarerPortal";

import DashboardOverview from "./components/DashboardOverview";
import ProfileManagement from "./components/ProfileManagement";
import ComplianceVault from "./components/ComplianceVault";
import AvailabilitySchedule from "./components/AvailabilitySchedule";
import UploadDocumentModal from "./components/UploadDocumentModal";
import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";
import OnboardingStepper from "./components/OnboardingStepper";
import OnboardingProfileSetup from "./components/OnboardingProfileSetup";
import OnboardingMembership from "./components/OnboardingMembership";
import Button from "@/components/Button";

type TabType = "overview" | "profile" | "compliance" | "availability";

function CarerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const isOnboardingParam = searchParams.get("onboarding") === "true";
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(2);
  const [isClient, setIsClient] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
  }, [dispatch]);

  const { profile, documents, loading } = useAppSelector((state) => state.carer);
  const profileUser = profile?.user;

  const portal = useCarerPortal({
    user,
    profile,
    documents,
  });

  useEffect(() => {
    setIsClient(true);
    const localStorageDone = localStorage.getItem("carer_onboarding_done") === "true";
    
    console.log("[Onboarding Flow] isOnboardingParam:", isOnboardingParam);
    console.log("[Onboarding Flow] localStorageDone:", localStorageDone);

    if (isOnboardingParam) {
      // Force onboarding if explicitly requested by URL
      setOnboardingDone(false);
      localStorage.removeItem("carer_onboarding_done");
      console.log("[Onboarding Flow] Setting onboardingDone to FALSE due to query param.");
    } else {
      setOnboardingDone(localStorageDone);
      console.log("[Onboarding Flow] Setting onboardingDone to:", localStorageDone);
    }

    if (profile) {
      const isComplianceUploaded = documents && documents.length > 0;
      const isProfileSetup = !!(profile.bio && profile.experience && profile.address);
      
      console.log("[Onboarding Flow] isComplianceUploaded:", isComplianceUploaded, "isProfileSetup:", isProfileSetup);
      
      if (!isComplianceUploaded) {
        setOnboardingStep(2);
      } else if (!isProfileSetup) {
        setOnboardingStep(3);
      } else {
        setOnboardingStep(4);
      }
    }
  }, [profile, documents, isOnboardingParam]);

  const showOnboarding =
    isClient && !onboardingDone && portal.applicationStatus !== "approved";
    
  console.log("[Onboarding Flow] Render check -> isClient:", isClient, "onboardingDone:", onboardingDone, "status:", portal.applicationStatus, "=> showOnboarding:", showOnboarding);

  // Dedicated Onboarding View Flow
  if (showOnboarding) {
    return (
      <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
        <div className="container-wrapper space-y-8">
          {/* Premium header is now integrated into OnboardingStepper */}

          <OnboardingStepper
            currentStep={onboardingStep}
            setCurrentStep={setOnboardingStep}
          />

          <div className="transition-all duration-500">
            {onboardingStep === 2 && (
              <div className="space-y-6">
                <ComplianceVault
                  complianceDocs={portal.complianceDocs}
                  uploadingDocType={portal.uploadingDocType}
                  uploadProgress={portal.uploadProgress}
                  handleDocUpload={portal.handleDocUpload}
                  setPreviewDoc={portal.setPreviewDoc}
                  setDocToDelete={portal.setDocToDelete}
                />
                <div className="flex justify-end pt-4 border-t border-gold-300/10">
                  <Button
                    onClick={() => setOnboardingStep(3)}
                    disabled={portal.complianceDocs.length === 0}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                    className="px-8 shadow-gold"
                  >
                    Continue to Profile Setup
                  </Button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <OnboardingProfileSetup
                onComplete={() => setOnboardingStep(4)}
              />
            )}

            {onboardingStep === 4 && (
              <OnboardingMembership
                onComplete={() => {
                  localStorage.setItem("carer_onboarding_done", "true");
                  setOnboardingDone(true);
                  if (isOnboardingParam) {
                    router.replace("/carer");
                  }
                }}
              />
            )}
          </div>
        </div>

        <UploadDocumentModal
          previewDoc={portal.previewDoc}
          setPreviewDoc={portal.setPreviewDoc}
          docToDelete={portal.docToDelete}
          setDocToDelete={portal.setDocToDelete}
          confirmDelete={() => {
            if (portal.docToDelete) {
              portal.handleDeleteDoc(portal.docToDelete);
              portal.setDocToDelete(null);
            }
          }}
        />
      </main>
    );
  }

  // Standard Carer Dashboard Layout (Unchanged)
  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader
          firstName={profileUser?.firstName || portal.firstName}
          lastName={profileUser?.lastName || portal.lastName}
          email={profileUser?.email || portal.email}
          phone={profileUser?.phoneNumber || portal.phone}
          profilePhoto={profile?.profilePhotoUrl || null}
        />

        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="transition-all duration-500">
          {activeTab === "overview" && (
            <DashboardOverview
              applicationStatus={portal.applicationStatus}
              membershipActive={portal.membershipActive}
              membershipExpiry={portal.membershipExpiry}
              complianceDocs={portal.complianceDocs}
              availability={profile?.availability ?? []}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <ProfileManagement
              firstName={portal.firstName}
              setFirstName={portal.setFirstName}
              lastName={portal.lastName}
              setLastName={portal.setLastName}
              email={portal.email}
              setEmail={portal.setEmail}
              phone={portal.phone}
              setPhone={portal.setPhone}
              bio={portal.bio}
              setBio={portal.setBio}
              specialties={portal.specialties}
              setSpecialties={portal.setSpecialties}
              experience={portal.experience}
              setExperience={portal.setExperience}
              address={portal.address}
              setAddress={portal.setAddress}
              canDrive={portal.canDrive}
              setCanDrive={portal.setCanDrive}
              hasBusinessInsurance={portal.hasBusinessInsurance}
              setHasBusinessInsurance={portal.setHasBusinessInsurance}
              handleDocUpload={portal.handleDocUpload}
              uploadingDocType={portal.uploadingDocType}
              uploadProgress={portal.uploadProgress}
              errors={portal.profileErrors}
              isProfileSaving={portal.isProfileSaving}
              onSubmit={portal.handleSaveProfile}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "compliance" && (
            <ComplianceVault
              complianceDocs={portal.complianceDocs}
              uploadingDocType={portal.uploadingDocType}
              uploadProgress={portal.uploadProgress}
              handleDocUpload={portal.handleDocUpload}
              setPreviewDoc={portal.setPreviewDoc}
              setDocToDelete={portal.setDocToDelete}
            />
          )}

          {activeTab === "availability" && (
            <AvailabilitySchedule
              isProfileLoading={loading}
            />
          )}
        </div>
      </div>

      <UploadDocumentModal
        previewDoc={portal.previewDoc}
        setPreviewDoc={portal.setPreviewDoc}
        docToDelete={portal.docToDelete}
        setDocToDelete={portal.setDocToDelete}
        confirmDelete={() => {
          if (portal.docToDelete) {
            portal.handleDeleteDoc(portal.docToDelete);
            portal.setDocToDelete(null);
          }
        }}
      />
    </main>
  );
}

export default function CarerDashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
            <p className="text-sm tracking-wider text-gold-200">
              Loading Dashboard...
            </p>
          </div>
        </main>
      }
    >
      <CarerDashboardContent />
    </Suspense>
  );
}
