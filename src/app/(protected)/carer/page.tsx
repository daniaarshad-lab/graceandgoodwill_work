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
import ProfileMedia from "./components/ProfileMedia";
import ProfileAgreements from "./components/ProfileAgreements";
import ComplianceVault from "./components/ComplianceVault";
import AvailabilitySchedule from "./components/AvailabilitySchedule";
import UploadDocumentModal from "./components/UploadDocumentModal";
import PortalHeader from "./components/PortalHeader";
import PortalTabs, { TabType } from "./components/PortalTabs";
import OnboardingStepper from "./components/OnboardingStepper";
import StepLegalAgreements from "./components/StepLegalAgreements";
import StepIdentityVerification from "./components/StepIdentityVerification";
import StepProfessionalInfo from "./components/StepProfessionalInfo";
import StepTrainingCertificates from "./components/StepTrainingCertificates";
import StepComplianceDocs from "./components/StepComplianceDocs";
import StepInsuranceDocs from "./components/StepInsuranceDocs";
import StepAdditionalQuals from "./components/StepAdditionalQuals";
import StepVideoIntro from "./components/StepVideoIntro";
import StepDeclaration from "./components/StepDeclaration";
import StepPaymentDetails from "./components/StepPaymentDetails";
import StepReviewSubmit from "./components/StepReviewSubmit";
import PlacementOpportunities from "./components/PlacementOpportunities";
import MyApplications from "./components/MyApplications";
import ApplicationHistory from "./components/ApplicationHistory";
import CarerPlacements from "./components/CarerPlacements";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocumentFileType } from "@/types/document.types";
import { agreementsService } from "@/services/agreements/agreements.service";
import FullScreenLoader from "@/components/FullScreenLoader";

function CarerDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOnboardingParam = searchParams.get("onboarding") === "true";

  const tabParam = searchParams.get("tab") as TabType;
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    if (
      tabParam &&
      [
        "overview",
        "profile",
        "compliance",
        "availability",
        "opportunities",
        "placements",
        "membership",
        "agreements",
        "media",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedPlan, setSelectedPlanState] = useState<string | null>(null);

  const setSelectedPlan = (plan: string | null) => {
    setSelectedPlanState(plan);
    if (user?.id) {
      if (plan) {
        localStorage.setItem(`carer_selected_plan_${user.id}`, plan);
      } else {
        localStorage.removeItem(`carer_selected_plan_${user.id}`);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      const plan = localStorage.getItem(`carer_selected_plan_${user.id}`);
      if (plan) {
        setSelectedPlanState(plan);
      }
    }
  }, [user?.id]);

  const [initialStepSet, setInitialStepSet] = useState(false);
  const [isDeterminingStep, setIsDeterminingStep] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
  }, [dispatch]);

  const {
    profile,
    documents,
    loading,
    documentsLoading,
    batchUploading,
    deletingDocumentId,
  } = useAppSelector((state) => state.carer);
  const actualProfile = (profile as any)?.carerProfile || profile;
  const profileUser = actualProfile?.user || profile?.user;

  const portal = useCarerPortal({
    user,
    profile,
    documents,
  });

  useEffect(() => {
    setIsClient(true);
    if (!user?.id) return;
    const localStorageDone =
      localStorage.getItem(`carer_onboarding_done_${user.id}`) === "true";
    if (isOnboardingParam) {
      // Force onboarding if explicitly requested by URL
      setOnboardingDone(false);
      localStorage.removeItem(`carer_onboarding_done_${user.id}`);
    } else {
      setOnboardingDone(localStorageDone);
    }

    if (profile && !loading && !documentsLoading && !initialStepSet) {
      const urlStep = searchParams.get("step");
      if (urlStep) {
        setOnboardingStep(parseInt(urlStep, 10));
        setInitialStepSet(true);
      } else {
        // Evaluate the backend persisted data to determine the current incomplete step
        const initialize = async () => {
          const determineInitialStep = async () => {
            const p = profileUser || {};
            const ap = actualProfile || {};
            const docs = documents || [];

            // Step 2: Legal Agreements
            try {
              const pendingData =
                await agreementsService.getPendingAgreements();
              if (pendingData.length > 0) return 2;
            } catch (e) {
              console.error("Failed to check pending agreements", e);
            }

            // Step 3: Personal Info
            if (
              !p.firstName ||
              !p.lastName ||
              !(p.dateOfBirth || ap.dateOfBirth) ||
              !ap.address ||
              !ap.emergencyContactName ||
              !ap.emergencyContactNumber ||
              !ap.emergencyContactRelation
            ) {
              return 3;
            }

            // Step 4: Professional Info
            if (
              !ap.summary ||
              !ap.experienceYears ||
              !ap.careSpecialties?.length
            ) {
              return 4;
            }

            // Step 5: Training
            const requiredTraining = [
              DocumentFileType.SAFEGUARDING_ADULTS,
              DocumentFileType.MOVING_AND_HANDLING,
              DocumentFileType.MEDICATION_ADMINISTRATION,
              DocumentFileType.BASIC_LIFE_SUPPORT_FIRST_AID,
              DocumentFileType.INFECTION_PREVENTION_AND_CONTROL,
              DocumentFileType.HEALTH_AND_SAFETY,
              DocumentFileType.FIRE_SAFETY,
              DocumentFileType.FOOD_HYGIENE,
              DocumentFileType.GDPR_DATA_PROTECTION,
            ];
            const hasAllTraining = requiredTraining.every((type) =>
              docs.some((d: any) => d.fileType === type),
            );
            if (!hasAllTraining) return 5;

            // Step 6: Compliance
            const hasPassportOrDL = docs.some(
              (d: any) =>
                d.fileType === DocumentFileType.PASSPORT ||
                d.fileType === DocumentFileType.DRIVING_LICENCE,
            );
            const hasDL = docs.some(
              (d: any) => d.fileType === DocumentFileType.DRIVING_LICENCE,
            );
            const hasProofOfAddress = docs.some(
              (d: any) => d.fileType === DocumentFileType.PROOF_OF_ADDRESS,
            );
            const hasRightToWork = docs.some(
              (d: any) => d.fileType === DocumentFileType.RIGHT_TO_WORK,
            );
            const hasNiProof = docs.some(
              (d: any) =>
                d.fileType === DocumentFileType.NATIONAL_INSURANCE_PROOF,
            );

            let identityValid =
              hasPassportOrDL &&
              hasProofOfAddress &&
              hasRightToWork &&
              hasNiProof;

            if (hasDL) {
              let dp = ap.drivingPreferences || [];
              if (typeof dp === "string") {
                try {
                  dp = JSON.parse(dp);
                } catch {
                  dp = dp.split(",").map((s: string) => s.trim());
                }
              }
              const hasOwnVehiclePref = dp.includes(
                "I am happy to transport clients in my own vehicle",
              );
              if (
                hasOwnVehiclePref &&
                !docs.some(
                  (d: any) =>
                    d.fileType === DocumentFileType.BUSINESS_INSURANCE,
                )
              ) {
                identityValid = false;
              }
            }

            const requiredCompliance = [
              DocumentFileType.ENHANCED_DBS_CERTIFICATE,
              DocumentFileType.PROFESSIONAL_REFERENCE_1,
              DocumentFileType.PROFESSIONAL_REFERENCE_2,
            ];
            const hasAllCompliance = requiredCompliance.every((type) =>
              docs.some((d: any) => d.fileType === type),
            );

            if (!identityValid || !hasAllCompliance || !ap.employmentHistory) {
              return 6;
            }

            // Step 7: Insurance
            const requiredInsurance = [
              DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
            ];
            const hasInsurance = requiredInsurance.every((type) =>
              docs.some((d: any) => d.fileType === type),
            );
            if (!hasInsurance) return 7;

            // Step 8: Payment Details / Supplemental
            if (
              !ap.bankName ||
              !ap.accountName ||
              !ap.accountNumber ||
              !ap.sortCode ||
              !ap.nationalInsuranceNumber
            ) {
              return 8;
            }

            // Step 9: Additional Quals
            // We assume step 9 is required to pass through if they haven't uploaded an intro video yet
            if (!ap.introVideoUrl) {
              return 9;
            }

            // Step 11: Declarations
            if (
              !ap.declarations?.accuracy ||
              !ap.declarations?.checks ||
              !ap.declarations?.share
            ) {
              return 11;
            }

            return 12; // Final Review
          };

          const ap = actualProfile || {};

          let initialStep = ap.onboardingStep;
          if (!initialStep) {
            const step = await determineInitialStep();
            initialStep = step;
          }

          setOnboardingStep(initialStep);
          setInitialStepSet(true);
          setIsDeterminingStep(false);
        };

        initialize();
      }
    } else if (!profile && !loading) {
      setIsDeterminingStep(false);
    }
  }, [
    profile,
    documents,
    loading,
    documentsLoading,
    isOnboardingParam,
    initialStepSet,
    user?.id,
    searchParams,
  ]);

  // Optional: We no longer sync `onboardingStep` to localStorage since it's saved to the DB on Continue clicks.

  const showOnboarding =
    isClient && !onboardingDone && portal.applicationStatus !== "approved";

  const validateAllCompulsoryFields = () => {
    const missing = [];
    const {
      firstName,
      lastName,
      dateOfBirth,
      address,
      email,
      phone,
      emergencyContactName,
      emergencyContactNumber,
      emergencyContactRelation,
      complianceDocs,
      drivingPreferences,
      bio,
      experience,
      specialties,
      employmentHistory,
      bankName,
      accountName,
      accountNumber,
      sortCode,
      nationalInsuranceNumber,
    } = portal;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !address ||
      !email ||
      !phone ||
      !emergencyContactName ||
      !emergencyContactNumber ||
      !emergencyContactRelation
    ) {
      missing.push("Personal Information");
    }

    const hasPassportOrDL = complianceDocs.some(
      (d: any) =>
        d.type === DocumentFileType.PASSPORT ||
        d.type === DocumentFileType.DRIVING_LICENCE,
    );
    const hasDL = complianceDocs.some(
      (d: any) => d.type === DocumentFileType.DRIVING_LICENCE,
    );
    const hasProofOfAddress = complianceDocs.some(
      (d: any) => d.type === DocumentFileType.PROOF_OF_ADDRESS,
    );
    const hasRightToWork = complianceDocs.some(
      (d: any) => d.type === DocumentFileType.RIGHT_TO_WORK,
    );
    const hasNiProof = complianceDocs.some(
      (d: any) => d.type === DocumentFileType.NATIONAL_INSURANCE_PROOF,
    );

    let identityValid =
      hasPassportOrDL && hasProofOfAddress && hasRightToWork && hasNiProof;
    if (hasDL) {
      const hasOwnVehiclePref = (drivingPreferences || []).includes(
        "I am happy to transport clients in my own vehicle",
      );
      if (
        hasOwnVehiclePref &&
        !complianceDocs.some(
          (d: any) => d.type === DocumentFileType.BUSINESS_INSURANCE,
        )
      ) {
        identityValid = false;
      }
    }
    if (!identityValid) missing.push("Identity Verification");

    if (!bio || !experience || !specialties)
      missing.push("Professional Information");

    const requiredTraining = [
      DocumentFileType.SAFEGUARDING_ADULTS,
      DocumentFileType.MOVING_AND_HANDLING,
      DocumentFileType.MEDICATION_ADMINISTRATION,
      DocumentFileType.BASIC_LIFE_SUPPORT_FIRST_AID,
      DocumentFileType.INFECTION_PREVENTION_AND_CONTROL,
      DocumentFileType.HEALTH_AND_SAFETY,
      DocumentFileType.FIRE_SAFETY,
      DocumentFileType.FOOD_HYGIENE,
      DocumentFileType.GDPR_DATA_PROTECTION,
    ];
    if (
      !requiredTraining.every((type: string) =>
        complianceDocs.some((d: any) => d.type === type),
      )
    )
      missing.push("Mandatory Care Training");

    const requiredCompliance = [
      DocumentFileType.ENHANCED_DBS_CERTIFICATE,
      DocumentFileType.PROFESSIONAL_REFERENCE_1,
      DocumentFileType.PROFESSIONAL_REFERENCE_2,
    ];
    if (
      !requiredCompliance.every((type: string) =>
        complianceDocs.some((d: any) => d.type === type),
      ) ||
      !employmentHistory
    )
      missing.push("Required Compliance Documents");

    const requiredInsurance = [DocumentFileType.PUBLIC_LIABILITY_INSURANCE];
    if (
      !requiredInsurance.every((type: string) =>
        complianceDocs.some((d: any) => d.type === type),
      )
    )
      missing.push("Insurance Documents");

    if (
      !bankName ||
      !accountName ||
      !accountNumber ||
      !sortCode ||
      !nationalInsuranceNumber
    ) {
      missing.push("Supplemental Details");
    }

    if (!profile?.introVideoUrl) missing.push("Video Introduction");

    return missing;
  };

  // Dedicated Onboarding View Flow
  if (showOnboarding) {
    if (isDeterminingStep) {
      return (
        <main className="min-h-screen bg-navy-950 py-10 flex items-center justify-center">
          <FullScreenLoader isVisible={true} />
        </main>
      );
    }

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
              <StepLegalAgreements
                onNext={() => {
                  setOnboardingStep(3);
                }}
                onBack={() => router.push("/register")}
              />
            )}

            {onboardingStep === 3 && (
              <StepIdentityVerification
                portal={portal}
                onNext={() => {
                  setOnboardingStep(4);
                }}
                onBack={() => setOnboardingStep(2)}
              />
            )}

            {onboardingStep === 4 && (
              <StepProfessionalInfo
                portal={portal}
                onNext={() => {
                  setOnboardingStep(5);
                }}
                onBack={() => setOnboardingStep(3)}
              />
            )}

            {onboardingStep === 5 && (
              <StepTrainingCertificates
                portal={portal}
                onNext={() => {
                  setOnboardingStep(6);
                }}
                onBack={() => setOnboardingStep(4)}
              />
            )}

            {onboardingStep === 6 && (
              <StepComplianceDocs
                portal={portal}
                onNext={() => {
                  setOnboardingStep(7);
                }}
                onBack={() => setOnboardingStep(5)}
              />
            )}

            {onboardingStep === 7 && (
              <StepInsuranceDocs
                portal={portal}
                onNext={() => {
                  setOnboardingStep(8);
                }}
                onBack={() => setOnboardingStep(6)}
              />
            )}

            {onboardingStep === 8 && (
              <StepPaymentDetails
                portal={portal}
                onNext={() => {
                  setOnboardingStep(9);
                }}
                onBack={() => setOnboardingStep(7)}
              />
            )}

            {onboardingStep === 9 && (
              <StepAdditionalQuals
                portal={portal}
                onNext={() => {
                  setOnboardingStep(10);
                }}
                onBack={() => setOnboardingStep(8)}
              />
            )}

            {onboardingStep === 10 && (
              <StepVideoIntro
                portal={portal}
                onNext={() => {
                  setOnboardingStep(11);
                }}
                onBack={() => setOnboardingStep(9)}
              />
            )}

            {onboardingStep === 11 && (
              <StepDeclaration
                portal={portal}
                onNext={() => {
                  setOnboardingStep(12);
                }}
                onBack={() => setOnboardingStep(10)}
              />
            )}

            {onboardingStep === 12 && (
              <StepReviewSubmit
                portal={portal}
                onBack={() => setOnboardingStep(11)}
                onSubmit={async () => {
                  try {
                    const pendingData =
                      await agreementsService.getPendingAgreements();
                    if (pendingData.length > 0) {
                      showErrorToast(
                        "Incomplete",
                        "Please sign all required legal agreements in Step 2 before submitting.",
                      );
                      setOnboardingStep(2);
                      return;
                    }
                  } catch (e) {
                    console.error("Error checking agreements on submit", e);
                  }

                  if (
                    !portal.declarations?.accuracy ||
                    !portal.declarations?.checks ||
                    !portal.declarations?.share
                  ) {
                    showErrorToast(
                      "Incomplete",
                      "Please agree to all declarations before submitting your profile.",
                    );
                    setOnboardingStep(12);
                    return;
                  }

                  const missingSections = validateAllCompulsoryFields();
                  if (missingSections.length > 0) {
                    showErrorToast(
                      "Incomplete Profile",
                      `Please complete the following sections: ${missingSections.join(", ")}`,
                    );
                    return;
                  }

                  const success = await portal.submitProfile();
                  if (success) {
                    setOnboardingStep(13);
                  }
                }}
                isSubmitting={portal.isProfileSaving}
              />
            )}

            {onboardingStep === 13 && (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gradient-to-b from-navy-900/40 to-navy-950/60 border border-gold-300/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md max-w-2xl mx-auto mt-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-200/20 to-gold-200/5 rounded-full flex items-center justify-center border border-gold-200/30 mb-8 shadow-[0_0_20px_rgba(245,212,160,0.1)]">
                  <svg
                    className="w-10 h-10 text-gold-200 drop-shadow-[0_2px_4px_rgba(245,212,160,0.3)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-50 tracking-tight mb-4">
                  Thank you.
                </h3>

                <p className="text-gold-100/60 max-w-md mx-auto leading-relaxed mb-10 text-[14px]">
                  Your profile is now pending review by Grace & Goodwill.
                  <br />
                  <br />
                  We will verify your documents and contact you regarding
                  approval.
                </p>

                <div className="flex flex-col items-center gap-5 w-full">
                  <button
                    onClick={() => {
                      if (user?.id) {
                        localStorage.setItem(
                          `carer_onboarding_done_${user.id}`,
                          "true",
                        );
                        localStorage.removeItem(
                          `carer_onboarding_step_${user.id}`,
                        );
                      }
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
                    onClick={() => setOnboardingStep(10)}
                    className="flex items-center gap-1.5 text-[12.5px] font-medium text-gold-100/50 hover:text-gold-200 transition-colors tracking-wide focus:outline-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Selection
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
          profilePhoto={
            profile?.profilePhotoUrl || actualProfile?.profilePhotoUrl || null
          }
        />

        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="transition-all duration-500">
          {activeTab === "overview" && (
            <DashboardOverview
              applicationStatus={portal.applicationStatus}
              complianceDocs={portal.complianceDocs}
              availability={
                actualProfile?.availability ?? profile?.availability ?? []
              }
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <div className="space-y-8">
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
                bankName={portal.bankName}
                setBankName={portal.setBankName}
                accountName={portal.accountName}
                setAccountName={portal.setAccountName}
                accountNumber={portal.accountNumber}
                setAccountNumber={portal.setAccountNumber}
                sortCode={portal.sortCode}
                setSortCode={portal.setSortCode}
                nationalInsuranceNumber={portal.nationalInsuranceNumber}
                setNationalInsuranceNumber={portal.setNationalInsuranceNumber}
                canDrive={portal.canDrive}
                setCanDrive={portal.setCanDrive}
                hasBusinessInsurance={portal.hasBusinessInsurance}
                setHasBusinessInsurance={portal.setHasBusinessInsurance}
                complianceDocs={portal.complianceDocs}
                handleDocUpload={portal.handleDocUpload}
                uploadingDocType={portal.uploadingDocType}
                uploadProgress={portal.uploadProgress}
                errors={portal.profileErrors}
                isProfileSaving={portal.isProfileSaving}
                onSubmit={portal.handleSaveProfile}
                setActiveTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === "media" && (
            <ProfileMedia
              profilePhotoUrl={
                profile?.profilePhotoUrl || actualProfile?.profilePhotoUrl
              }
              introVideoUrl={
                profile?.introVideoUrl || actualProfile?.introVideoUrl
              }
              updatedAt={profile?.updatedAt || actualProfile?.updatedAt}
            />
          )}

          {activeTab === "compliance" && (
            <ComplianceVault
              complianceDocs={portal.complianceDocs}
              documentsLoading={documentsLoading}
              deletingDocumentId={deletingDocumentId}
              isOnboarding={false}
              handleUpdateDoc={portal.handleUpdateDoc}
              setPreviewDoc={portal.setPreviewDoc}
              setDocToDelete={portal.setDocToDelete}
            />
          )}

          {activeTab === "availability" && (
            <AvailabilitySchedule isProfileLoading={loading} />
          )}

          {activeTab === "opportunities" && <PlacementOpportunities />}

          {activeTab === "applications" && <MyApplications />}

          {activeTab === "history" && <ApplicationHistory />}

          {activeTab === "placements" && <CarerPlacements />}

          {activeTab === "agreements" && <ProfileAgreements />}
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
