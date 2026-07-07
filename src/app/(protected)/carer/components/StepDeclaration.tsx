import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Check } from "lucide-react";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDeclaration({ portal, onNext, onBack }: Props) {
  const { declarations, setDeclarations, handleSaveProfile, isProfileSaving } =
    portal;

  const [submitted, setSubmitted] = useState(false);

  const handleCheckbox = (field: keyof typeof declarations) => {
    setDeclarations((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const errors = {
    accuracy: !declarations.accuracy
      ? "You must declare that the information is accurate."
      : "",
    checks: !declarations.checks ? "You must consent to reference checks." : "",
    share: !declarations.share
      ? "You must consent to sharing your profile."
      : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      return;
    }

    const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
    const success = await handleSaveProfile(syntheticEvent, 11);
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

        <div className="space-y-6">
          <div className="space-y-2">
            <div
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => handleCheckbox("accuracy")}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <div
                  className={`w-5 h-5 border-2 rounded transition-all ${declarations.accuracy
                      ? "bg-gold border-gold"
                      : submitted && errors.accuracy
                        ? "border-red-500 bg-red-950/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                        : "border-gold-300/30"
                    }`}
                />
                <Check
                  className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.accuracy ? "opacity-100" : "opacity-0"
                    }`}
                />
              </div>
              <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
                I declare that all the information provided in this profile is
                accurate and truthful. *
              </span>
            </div>
            {submitted && errors.accuracy && (
              <p className="text-xs text-red-500 font-semibold pl-8">
                {errors.accuracy}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => handleCheckbox("checks")}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <div
                  className={`w-5 h-5 border-2 rounded transition-all ${declarations.checks
                      ? "bg-gold border-gold"
                      : submitted && errors.checks
                        ? "border-red-500 bg-red-950/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                        : "border-gold-300/30"
                    }`}
                />
                <Check
                  className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.checks ? "opacity-100" : "opacity-0"
                    }`}
                />
              </div>
              <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
                I consent to compliance and reference checks. *
              </span>
            </div>
            {submitted && errors.checks && (
              <p className="text-xs text-red-500 font-semibold pl-8">
                {errors.checks}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => handleCheckbox("share")}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <div
                  className={`w-5 h-5 border-2 rounded transition-all ${declarations.share
                      ? "bg-gold border-gold"
                      : submitted && errors.share
                        ? "border-red-500 bg-red-950/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                        : "border-gold-300/30"
                    }`}
                />
                <Check
                  className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${declarations.share ? "opacity-100" : "opacity-0"
                    }`}
                />
              </div>
              <span className="text-sm text-gold-100/80 group-hover:text-gold-50 select-none">
                I consent for my profile information to be shared with
                prospective clients for matching purposes. *
              </span>
            </div>
            {submitted && errors.share && (
              <p className="text-xs text-red-500 font-semibold pl-8">
                {errors.share}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button
          type="button"
          variant="ghost-gold"
          onClick={onBack}
          disabled={isProfileSaving}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isProfileSaving}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
