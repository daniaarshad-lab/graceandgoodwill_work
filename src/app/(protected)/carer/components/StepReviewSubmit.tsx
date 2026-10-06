import React from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { DocumentFileType } from "@/types/document.types";
import {
  Check,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Video,
} from "lucide-react";

interface Props {
  portal: any;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StepReviewSubmit({
  portal,
  onBack,
  onSubmit,
  isSubmitting,
}: Props) {
  const {
    firstName,
    lastName,
    phone,
    email,
    dateOfBirth,
    address,
    city,
    postcode,
    emergencyContactName,
    emergencyContactNumber,
    emergencyContactRelation,
    bio,
    specialties,
    experience,
    canDrive,
    hasBusinessInsurance,
    drivingPreferences,
    dbsUpdateServiceNumber,
    employmentHistory,
    declarations,
    complianceDocs,
  } = portal;

  // Helper to check if a specific document type has been uploaded
  const hasDocType = (type: string) => {
    return complianceDocs.some((d: any) => d.type === type);
  };

  // Helper to count uploaded mandatory training documents
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
  const uploadedTrainingCount = requiredTraining.filter(hasDocType).length;
  const trainingComplete = uploadedTrainingCount === requiredTraining.length;

  // Identity docs check
  const hasPassportOrDL =
    hasDocType(DocumentFileType.PASSPORT) ||
    (hasDocType(DocumentFileType.DRIVING_LICENCE_FRONT) && hasDocType(DocumentFileType.DRIVING_LICENCE_BACK));
  const hasProofOfAddress = hasDocType(DocumentFileType.PROOF_OF_ADDRESS);
  const hasRightToWork = hasDocType(DocumentFileType.RIGHT_TO_WORK);
  const hasNiProof = hasDocType(DocumentFileType.NATIONAL_INSURANCE_PROOF);
  const identityComplete =
    hasPassportOrDL && hasProofOfAddress && hasRightToWork && hasNiProof;

  // Professional Compliance check
  const requiredCompliance = [
    DocumentFileType.ENHANCED_DBS_CERTIFICATE,
    DocumentFileType.PROFESSIONAL_REFERENCE_1,
    DocumentFileType.PROFESSIONAL_REFERENCE_2,
  ];
  const uploadedComplianceCount = requiredCompliance.filter(hasDocType).length;
  const complianceDocsComplete =
    uploadedComplianceCount === requiredCompliance.length &&
    !!employmentHistory;

  // Insurance check
  const hasPublicLiability = hasDocType(
    DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
  );
  const insuranceComplete = hasPublicLiability;

  // Video check
  const videoUploaded =
    !!portal.profile?.introVideoUrl || !!portal.introVideoUrl;
  console.log("[Video Upload debug] StepReviewSubmit portal details:", {
    profile: portal.profile,
    introVideoUrl: portal.introVideoUrl,
    videoUploaded,
  });

  // Declarations check
  const declarationsComplete =
    declarations?.accuracy && declarations?.checks && declarations?.share;

  // Driving requirements check
  const needsBusinessInsurance =
    (drivingPreferences || []).includes(
      "I am happy to transport clients in my own vehicle",
    ) && canDrive === "yes";
  const hasBusinessInsuranceDoc = hasDocType(
    DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
  ); // Assuming Step 2 used PUBLIC_LIABILITY_INSURANCE for this
  const drivingRequirementsValid =
    !needsBusinessInsurance || hasBusinessInsuranceDoc;

  // Overall validation
  const missingItems: string[] = [];
  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !address ||
    !email ||
    !phone ||
    !emergencyContactName ||
    !emergencyContactNumber
  ) {
    missingItems.push("Personal Information fields");
  }
  if (!identityComplete) {
    missingItems.push(
      "Identity Verification Documents (Passport/DL, Proof of Address, Right to Work, NI Proof)",
    );
  }
  if (needsBusinessInsurance && !hasBusinessInsuranceDoc) {
    missingItems.push(
      "Business Insurance Certificate (required for driving preferences)",
    );
  }
  if (!bio || !experience || !specialties) {
    missingItems.push(
      "Professional Profile details (Bio, Experience, Specialties)",
    );
  }
  if (!trainingComplete) {
    missingItems.push(
      `Mandatory Care Training (${uploadedTrainingCount}/${requiredTraining.length} uploaded)`,
    );
  }
  if (!complianceDocsComplete) {
    missingItems.push(
      "Compliance & References (Enhanced DBS, CV, 2 References, Employment History)",
    );
  }
  if (!insuranceComplete) {
    missingItems.push("Insurance Documents (Public Liability)");
  }
  if (!videoUploaded) {
    missingItems.push("Introductory Video Upload");
  }

  if (!declarationsComplete) {
    missingItems.push("Declaration Agreements");
  }

  const isFormValid = missingItems.length === 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Validation Alert Banner */}
      {missingItems.length > 0 ? (
        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-md font-bold text-red-400">
              Your profile is incomplete
            </h4>
            <p className="text-xs text-gold-100/70 leading-relaxed">
              Please complete all onboarding sections before submitting your
              profile. The following items are missing or incomplete:
            </p>
            <ul className="list-disc list-inside text-xs text-red-400/90 space-y-1 pl-1">
              {missingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-gold-950/10 border border-gold-400/30 flex items-start gap-4">
          <Check className="w-6 h-6 text-gold-300 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-md font-bold text-gold-200">
              Profile Ready for Submission
            </h4>
            <p className="text-xs text-gold-100/70 leading-relaxed">
              All mandatory information and documentation have been completed.
              Please review the summary below and submit your profile for
              verification.
            </p>
          </div>
        </div>
      )}

      {/* Review Details Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section: Personal Info */}
        <SectionCard className="p-6 border border-gold-300/10 bg-navy-900/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-gold-300/10 pb-3">
            <User className="w-5 h-5 text-gold-300" />
            <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
              Personal Information
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Full Name
              </span>
              <span className="text-gold-50 font-medium break-words">
                {firstName} {lastName}
              </span>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Date of Birth
              </span>
              <span className="text-gold-50 font-medium break-words">
                {dateOfBirth}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Email Address
              </span>
              <span className="text-gold-50 font-medium break-all sm:break-words">
                {email}
              </span>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Mobile Number
              </span>
              <span className="text-gold-50 font-medium break-words">
                {phone}
              </span>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                City / Town
              </span>
              <span className="text-gold-50 font-medium break-words">
                {city || "—"}
              </span>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Postcode
              </span>
              <span className="text-gold-50 font-medium break-words">
                {postcode}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Address
              </span>
              <span className="text-gold-50 font-medium break-words">
                {address}
              </span>
            </div>
            <div className="sm:col-span-2 border-t border-gold-300/5 pt-3">
              <span className="text-[11px] font-bold text-gold-200 uppercase tracking-wider block mb-2">
                Emergency Contact
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">
                    Name
                  </span>
                  <span className="text-gold-50 font-medium break-words">
                    {emergencyContactName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">
                    Relation
                  </span>
                  <span className="text-gold-50 font-medium break-words">
                    {emergencyContactRelation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">
                    Phone
                  </span>
                  <span className="text-gold-50 font-medium break-words">
                    {emergencyContactNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section: Professional Info */}
        <SectionCard className="p-6 border border-gold-300/10 bg-navy-900/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-gold-300/10 pb-3">
            <Briefcase className="w-5 h-5 text-gold-300" />
            <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
              Professional Profile
            </h4>
          </div>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                  Care Experience
                </span>
                <span className="text-gold-50 font-medium break-words">
                  {experience} Years
                </span>
              </div>
              <div>
                <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                  Can Drive
                </span>
                <span className="text-gold-50 font-medium capitalize break-words">
                  {canDrive || "No"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Care Specialties
              </span>
              <span className="text-gold-50 font-medium break-words">
                {specialties || "None listed"}
              </span>
            </div>
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Biography Summary
              </span>
              <p className="text-gold-50/90 leading-relaxed font-light italic bg-navy-950/40 p-2.5 rounded-lg border border-gold-300/5 mt-1 break-words">
                "{bio || "No summary provided."}"
              </p>
            </div>
            {dbsUpdateServiceNumber && (
              <div>
                <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                  DBS Update Service Number
                </span>
                <span className="text-gold-50 font-medium break-words">
                  {dbsUpdateServiceNumber}
                </span>
              </div>
            )}
            <div>
              <span className="text-gold-100/40 uppercase tracking-wider block mb-0.5">
                Employment History
              </span>
              <span className="text-gold-50 font-medium line-clamp-2 break-all sm:break-words">
                {employmentHistory || "Not provided."}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Section: Documents Compliance Check */}
        <SectionCard className="p-6 border border-gold-300/10 bg-navy-900/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-gold-300/10 pb-3">
            <FileText className="w-5 h-5 text-gold-300" />
            <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
              Document Compliance Status
            </h4>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
              <span className="text-gold-100/80 font-medium">
                Identity Verification (Passport/DL)
              </span>
              {identityComplete ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Complete
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                </span>
              )}
            </div>

            <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
              <span className="text-gold-100/80 font-medium">
                Mandatory Care Certificates
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gold-100/60 font-semibold">
                  {uploadedTrainingCount} / {requiredTraining.length}
                </span>
                {trainingComplete ? (
                  <span className="text-green-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Complete
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
              <span className="text-gold-100/80 font-medium">
                Required Compliance (DBS, CV, References)
              </span>
              {complianceDocsComplete ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Complete
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                </span>
              )}
            </div>

            <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
              <span className="text-gold-100/80 font-medium">
                Carer Insurance (Public Liability)
              </span>
              {insuranceComplete ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Complete
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                </span>
              )}
            </div>

            {needsBusinessInsurance && (
              <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
                <span className="text-gold-100/80 font-medium">
                  Business Insurance (Required for Driving)
                </span>
                {hasBusinessInsuranceDoc ? (
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Complete
                  </span>
                ) : (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                  </span>
                )}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Section: Video Intro & Declarations */}
        <SectionCard className="p-6 border border-gold-300/10 bg-navy-900/30 space-y-4">
          <div className="flex items-center gap-3 border-b border-gold-300/10 pb-3">
            <Video className="w-5 h-5 text-gold-300" />
            <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
              Video & Declarations
            </h4>
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center bg-navy-950/20 p-2.5 rounded-lg border border-gold-300/5">
              <span className="text-gold-100/80 font-medium">
                Introductory Profile Video
              </span>
              {videoUploaded ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Uploaded
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>

            <div className="space-y-2 border-t border-gold-300/5 pt-3">
              <span className="text-[11px] font-bold text-gold-200 uppercase tracking-wider block mb-2">
                Declarations Signed
              </span>
              <div className="space-y-1.5 pl-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${declarations?.accuracy ? "bg-gold text-navy-950" : "bg-navy-950 border border-gold-300/20"}`}
                  >
                    {declarations?.accuracy && (
                      <Check className="w-3 h-3 stroke-[3px]" />
                    )}
                  </div>
                  <span className="text-[11px] text-gold-100/70">
                    Information Accuracy Declaration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${declarations?.checks ? "bg-gold text-navy-950" : "bg-navy-950 border border-gold-300/20"}`}
                  >
                    {declarations?.checks && (
                      <Check className="w-3 h-3 stroke-[3px]" />
                    )}
                  </div>
                  <span className="text-[11px] text-gold-100/70">
                    Compliance & Reference Check Consent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${declarations?.share ? "bg-gold text-navy-950" : "bg-navy-950 border border-gold-300/20"}`}
                  >
                    {declarations?.share && (
                      <Check className="w-3 h-3 stroke-[3px]" />
                    )}
                  </div>
                  <span className="text-[11px] text-gold-100/70">
                    Profile Share for Placement Matching Consent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Navigation & Submit controls */}
      <div className="flex justify-between items-center pt-4 gap-4 max-w-7xl mx-auto w-full">
        <Button
          type="button"
          variant="ghost-gold"
          onClick={onBack}
          disabled={isSubmitting}
          text="Back"
        />
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting || !isFormValid}
          text={
            isSubmitting
              ? "Submitting Application..."
              : "Submit Profile for Verification"
          }
        />
      </div>
    </div>
  );
}
