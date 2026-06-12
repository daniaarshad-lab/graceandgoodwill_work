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
import { showErrorToast } from "@/utils/toast";

import DashboardOverview from "./components/DashboardOverview";
import ProfileManagement from "./components/ProfileManagement";
import ComplianceVault from "./components/ComplianceVault";
import AvailabilitySchedule from "./components/AvailabilitySchedule";
import UploadDocumentModal from "./components/UploadDocumentModal";
import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";
import OnboardingStepper from "./components/OnboardingStepper";
import StepPersonalInfo from "./components/StepPersonalInfo";
import StepIdentityVerification from "./components/StepIdentityVerification";
import StepProfessionalInfo from "./components/StepProfessionalInfo";
import StepTrainingCertificates from "./components/StepTrainingCertificates";
import StepComplianceDocs from "./components/StepComplianceDocs";
import StepInsuranceDocs from "./components/StepInsuranceDocs";
import StepAdditionalQuals from "./components/StepAdditionalQuals";
import StepVideoIntro from "./components/StepVideoIntro";
import StepDeclaration from "./components/StepDeclaration";
import OnboardingMembership from "./components/OnboardingMembership";
import Button from "@/components/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type TabType = "overview" | "profile" | "compliance" | "availability";

function CarerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const isOnboardingParam = searchParams.get("onboarding") === "true";
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(2);
  const [initialStepSet, setInitialStepSet] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
  }, [dispatch]);

  const { profile, documents, loading, documentsLoading, batchUploading, deletingDocumentId } = useAppSelector((state) => state.carer);
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

    if (profile && !initialStepSet) {
      const savedStep = localStorage.getItem("carer_onboarding_step");
      if (savedStep) {
        setOnboardingStep(parseInt(savedStep, 10));
      } else {
        const isComplianceUploaded = documents && documents.length >= 10;
        const isProfileSetup = !!(profile.bio && profile.experience && profile.address);
        
        console.log("[Onboarding Flow] isComplianceUploaded:", isComplianceUploaded, "isProfileSetup:", isProfileSetup);
        
        if (!profileUser?.dateOfBirth) {
          setOnboardingStep(2);
        } else if (!isProfileSetup) {
          setOnboardingStep(4);
        } else if (!isComplianceUploaded) {
          setOnboardingStep(6);
        } else {
          setOnboardingStep(10);
        }
      }
      setInitialStepSet(true);
    }
  }, [profile, documents, isOnboardingParam, initialStepSet]);

  useEffect(() => {
    if (initialStepSet) {
      localStorage.setItem("carer_onboarding_step", onboardingStep.toString());
    }
  }, [onboardingStep, initialStepSet]);

  const showOnboarding =
    isClient && !onboardingDone && portal.applicationStatus !== "approved";
    
  console.log("[Onboarding Flow] Render check -> isClient:", isClient, "onboardingDone:", onboardingDone, "status:", portal.applicationStatus, "=> showOnboarding:", showOnboarding);

  const validateAllCompulsoryFields = () => {
    const missing = [];
    const {
      firstName, lastName, dateOfBirth, address, email, phone, 
      emergencyContactName, emergencyContactNumber, emergencyContactRelation,
      complianceDocs, drivingPreferences, bio, experience, specialties, employmentHistory
    } = portal;
    
    if (!firstName || !lastName || !dateOfBirth || !address || !email || !phone || !emergencyContactName || !emergencyContactNumber || !emergencyContactRelation) {
      missing.push("Personal Information");
    }

    const hasPassportOrDL = complianceDocs.some((d: any) => d.type === "PASSPORT" || d.type === "DRIVERS_LICENSE");
    const hasDL = complianceDocs.some((d: any) => d.type === "DRIVERS_LICENSE");
    const hasProofOfAddress = complianceDocs.some((d: any) => d.type === "PROOF_OF_ADDRESS");
    const hasRightToWork = complianceDocs.some((d: any) => d.type === "RIGHT_TO_WORK");
    const hasNiProof = complianceDocs.some((d: any) => d.type === "NI_PROOF");
    
    let identityValid = hasPassportOrDL && hasProofOfAddress && hasRightToWork && hasNiProof;
    if (hasDL) {
       const hasOwnVehiclePref = (drivingPreferences || []).includes("I am happy to transport clients in my own vehicle");
       if (hasOwnVehiclePref && !complianceDocs.some((d: any) => d.type === "BUSINESS_INSURANCE")) {
          identityValid = false;
       }
    }
    if (!identityValid) missing.push("Identity Verification");

    if (!bio || !experience || !specialties) missing.push("Professional Information");

    const requiredTraining = ["SAFEGUARDING_ADULTS", "MOVING_AND_HANDLING", "MEDICATION_ADMINISTRATION", "BASIC_LIFE_SUPPORT", "INFECTION_PREVENTION", "HEALTH_AND_SAFETY", "FIRE_SAFETY", "FOOD_HYGIENE", "GDPR"];
    if (!requiredTraining.every((type: string) => complianceDocs.some((d: any) => d.type === type))) missing.push("Mandatory Care Training");

    const requiredCompliance = ["ENHANCED_DBS", "CV", "REFERENCE_1", "REFERENCE_2"];
    if (!requiredCompliance.every((type: string) => complianceDocs.some((d: any) => d.type === type)) || !employmentHistory) missing.push("Required Compliance Documents");

    const requiredInsurance = ["PUBLIC_LIABILITY", "PROFESSIONAL_INDEMNITY"];
    if (!requiredInsurance.every((type: string) => complianceDocs.some((d: any) => d.type === type))) missing.push("Insurance Documents");

    if (!profile?.introVideoUrl) missing.push("Video Introduction");

    return missing;
  };

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
              <StepPersonalInfo
                portal={portal}
                onNext={() => setOnboardingStep(3)}
                onBack={() => router.push("/register")}
              />
            )}

            {onboardingStep === 3 && (
              <StepIdentityVerification
                portal={portal}
                onNext={() => setOnboardingStep(4)}
                onBack={() => setOnboardingStep(2)}
              />
            )}

            {onboardingStep === 4 && (
              <StepProfessionalInfo
                portal={portal}
                onNext={() => setOnboardingStep(5)}
                onBack={() => setOnboardingStep(3)}
              />
            )}

            {onboardingStep === 5 && (
              <StepTrainingCertificates
                portal={portal}
                onNext={() => setOnboardingStep(6)}
                onBack={() => setOnboardingStep(4)}
              />
            )}

            {onboardingStep === 6 && (
              <StepComplianceDocs
                portal={portal}
                onNext={() => setOnboardingStep(7)}
                onBack={() => setOnboardingStep(5)}
              />
            )}

            {onboardingStep === 7 && (
              <StepInsuranceDocs
                portal={portal}
                onNext={() => setOnboardingStep(8)}
                onBack={() => setOnboardingStep(6)}
              />
            )}

            {onboardingStep === 8 && (
              <StepAdditionalQuals
                portal={portal}
                onNext={() => setOnboardingStep(9)}
                onBack={() => setOnboardingStep(7)}
              />
            )}

            {onboardingStep === 9 && (
              <StepVideoIntro
                portal={portal}
                onNext={() => setOnboardingStep(10)}
                onBack={() => setOnboardingStep(8)}
              />
            )}

            {onboardingStep === 10 && (
              <StepDeclaration
                portal={portal}
                onNext={() => setOnboardingStep(11)}
                onBack={() => setOnboardingStep(9)}
              />
            )}

            {onboardingStep === 11 && (
              <OnboardingMembership
                onComplete={async () => {
                  if (!portal.declarations?.accuracy || !portal.declarations?.checks || !portal.declarations?.share) {
                    showErrorToast("Incomplete", "Please agree to all declarations before submitting your profile.");
                    setOnboardingStep(10);
                    return;
                  }

                  const missingSections = validateAllCompulsoryFields();
                  if (missingSections.length > 0) {
                    showErrorToast("Incomplete Profile", `Please complete the following sections: ${missingSections.join(", ")}`);
                    return;
                  }

                  const success = await portal.handleSaveProfile();
                  if (success) {
                    setOnboardingStep(12);
                  }
                }}
                onBack={() => setOnboardingStep(10)}
                isSubmitting={portal.isProfileSaving}
              />
            )}

            {onboardingStep === 12 && (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gradient-to-b from-navy-900/40 to-navy-950/60 border border-gold-300/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md max-w-2xl mx-auto mt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-200/20 to-gold-200/5 rounded-full flex items-center justify-center border border-gold-200/30 mb-8 shadow-[0_0_20px_rgba(245,212,160,0.1)]">
                  <svg className="w-10 h-10 text-gold-200 drop-shadow-[0_2px_4px_rgba(245,212,160,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-50 tracking-tight mb-4">
                  Onboarding Complete!
                </h3>
                
                <p className="text-gold-100/60 max-w-md mx-auto leading-relaxed mb-10 text-[14px]">
                  Thank you for completing your professional profile. Your application is now under review by the Grace & Goodwill team.
                </p>
                
                <div className="flex flex-col items-center gap-5 w-full">
                  <button
                    onClick={() => {
                      localStorage.setItem("carer_onboarding_done", "true");
                      localStorage.removeItem("carer_onboarding_step");
                      setOnboardingDone(true);
                      if (isOnboardingParam) {
                        router.replace("/carer");
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20 text-navy-950 text-[14px] font-bold tracking-wide shadow-[0_4px_15px_rgba(245,212,160,0.2)] hover:shadow-[0_6px_20px_rgba(245,212,160,0.3)] hover:-translate-y-[1px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-200/50 w-full max-w-[280px]"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setOnboardingStep(11)}
                    className="flex items-center gap-1.5 text-[12.5px] font-medium text-gold-100/50 hover:text-gold-200 transition-colors tracking-wide focus:outline-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Membership
                  </button>
                </div>
              </div>
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
              documentsLoading={documentsLoading}
              batchUploading={batchUploading}
              deletingDocumentId={deletingDocumentId}
              isOnboarding={false}
              selectedFiles={portal.selectedFiles}
              handleBatchUpload={portal.handleBatchUpload}
              handleDocUpload={portal.handleDocUpload}
              handleUpdateDoc={portal.handleUpdateDoc}
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
