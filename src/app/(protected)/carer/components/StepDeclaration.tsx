import React from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Check } from "lucide-react";
import { showErrorToast } from "@/utils/toast";
import { useAppSelector } from "@/store/hooks";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDeclaration({ portal, onNext, onBack }: Props) {
  const {
    declarations, setDeclarations,
    handleSaveProfile, isProfileSaving,
  } = portal;

  const handleCheckbox = (field: keyof typeof declarations) => {
    setDeclarations((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const isFormComplete = declarations.accuracy && declarations.checks && declarations.share;

  const profile = useAppSelector((state) => state.carer.profile);

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
    if (!requiredTraining.every(type => complianceDocs.some((d: any) => d.type === type))) missing.push("Mandatory Care Training");

    const requiredCompliance = ["ENHANCED_DBS", "CV", "REFERENCE_1", "REFERENCE_2"];
    if (!requiredCompliance.every(type => complianceDocs.some((d: any) => d.type === type)) || !employmentHistory) missing.push("Required Compliance Documents");

    const requiredInsurance = ["PUBLIC_LIABILITY", "PROFESSIONAL_INDEMNITY"];
    if (!requiredInsurance.every(type => complianceDocs.some((d: any) => d.type === type))) missing.push("Insurance Documents");

    if (!profile?.introVideoUrl) missing.push("Video Introduction");

    return missing;
  };

  const handleNext = async () => {
    if (!isFormComplete) {
      showErrorToast("Incomplete", "Please agree to all declarations before submitting your profile.");
      return;
    }
    const missingSections = validateAllCompulsoryFields();
    if (missingSections.length > 0) {
      showErrorToast("Incomplete Profile", `Please complete the following sections: ${missingSections.join(", ")}`);
      return;
    }

    const success = await handleSaveProfile();
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
         Declaration
        </h3>

        <div className="space-y-4">
          <div 
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => handleCheckbox('accuracy')}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <div className={`w-5 h-5 border-2 rounded transition-all ${declarations.accuracy ? 'bg-gold border-gold' : 'border-gold-300/30'}`} />
              <Check className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.accuracy ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
              I declare that all the information provided in this profile is accurate and truthful. (*)
            </span>
          </div>

          <div 
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => handleCheckbox('checks')}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <div className={`w-5 h-5 border-2 rounded transition-all ${declarations.checks ? 'bg-gold border-gold' : 'border-gold-300/30'}`} />
              <Check className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.checks ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
              I consent to compliance and reference checks. (*)
            </span>
          </div>

          <div 
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => handleCheckbox('share')}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <div className={`w-5 h-5 border-2 rounded transition-all ${declarations.share ? 'bg-gold border-gold' : 'border-gold-300/30'}`} />
              <Check className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.share ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
              I consent for my profile information to be shared with prospective clients for matching purposes. (*)
            </span>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack} disabled={isProfileSaving}>
          Back
        </Button>
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleNext} 
          disabled={!isFormComplete || isProfileSaving}
        >
          {isProfileSaving ? "Submitting..." : "Submit Profile for Verification"}
        </Button>
      </div>
    </div>
  );
}
