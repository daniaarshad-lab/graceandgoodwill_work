"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { Check, Compass, Search, HeartHandshake } from "lucide-react";

interface ClientOnboardingProps {
  user: any;
  onComplete: (journey: "match" | "browse") => void;
}

export default function ClientOnboarding({ user, onComplete }: ClientOnboardingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedOption, setSelectedOption] = useState<"match" | "browse" | null>(null);

  const handleContinue = () => {
    if (selectedOption) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    if (selectedOption) {
      onComplete(selectedOption);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {step === 1 ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-50 tracking-tight">
              Welcome to Grace & Goodwill
            </h2>
            <p className="text-gold-100/65 max-w-md mx-auto text-[13px] leading-relaxed font-light">
              We are committed to providing premium, bespoke healthcare matching. Let's select your care journey to get started.
            </p>
          </div>

          <div className="bg-navy-900/30 border border-gold-300/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-elegant space-y-6">
            <h3 className="text-base font-bold text-gold-100 text-center tracking-wide">
              How would you like to proceed?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Match */}
              <div
                onClick={() => setSelectedOption("match")}
                className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  selectedOption === "match"
                    ? "bg-navy-900/90 border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-gold/30"
                    : "bg-navy-950/40 border-gold-300/5 hover:border-gold-300/20 hover:bg-navy-950/60"
                }`}
              >
                {/* Select Indicator */}
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedOption === "match"
                    ? "bg-gold border-gold text-navy-950"
                    : "border-gold-300/20 group-hover:border-gold-300/40"
                }`}>
                  {selectedOption === "match" && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>

                <div className="flex-1 space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    selectedOption === "match" ? "bg-gold/15 text-gold" : "bg-gold-DEFAULT/5 text-gold-DEFAULT/60 group-hover:text-gold"
                  }`}>
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[13.5px] font-bold text-gold-200 tracking-wide">
                      Let Grace & Goodwill Match Me With A Carer
                    </h4>
                    <p className="text-xs text-gold-100/50 leading-relaxed font-light">
                      Our team will review your requirements and recommend suitable carers on your behalf.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option B: Browse */}
              <div
                onClick={() => setSelectedOption("browse")}
                className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  selectedOption === "browse"
                    ? "bg-navy-900/90 border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-gold/30"
                    : "bg-navy-950/40 border-gold-300/5 hover:border-gold-300/20 hover:bg-navy-950/60"
                }`}
              >
                {/* Select Indicator */}
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selectedOption === "browse"
                    ? "bg-gold border-gold text-navy-950"
                    : "border-gold-300/20 group-hover:border-gold-300/40"
                }`}>
                  {selectedOption === "browse" && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>

                <div className="flex-1 space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    selectedOption === "browse" ? "bg-gold/15 text-gold" : "bg-gold-DEFAULT/5 text-gold-DEFAULT/60 group-hover:text-gold"
                  }`}>
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[13.5px] font-bold text-gold-200 tracking-wide">
                      Browse & Select Carers Myself
                    </h4>
                    <p className="text-xs text-gold-100/50 leading-relaxed font-light">
                      I would like to browse available carers and create my own shortlist before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button
                type="button"
                onClick={handleContinue}
                disabled={!selectedOption}
                text="Continue"
                variant="primary"
                className="w-full max-w-xs font-semibold"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-navy-900/30 border border-gold-300/10 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-elegant text-center flex flex-col items-center max-w-2xl mx-auto space-y-6">
            {/* Confirmation Icon */}
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse">
              <Compass className="w-8 h-8 text-gold" />
            </div>

            {/* Selected Journey Display */}
            <div className="px-4 py-2 rounded-full bg-gold-DEFAULT/5 border border-gold-DEFAULT/10">
              <p className="text-[10px] uppercase tracking-wider text-gold-200/80 font-bold">
                Selected Journey:{" "}
                <span className="text-gold-50">
                  {selectedOption === "match"
                    ? "Let Grace & Goodwill Match Me"
                    : "Browse & Select Carers"}
                </span>
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h3 className="text-[17px] font-bold text-gold-100 tracking-wide leading-relaxed">
                Thank you for registering with Grace & Goodwill.
              </h3>
              <p className="text-xs text-gold-100/60 leading-relaxed font-light">
                A member of our team will contact you as soon as possible, with a maximum response time of 24 hours, to discuss your care needs and next steps.
              </p>
            </div>

            <div className="pt-6 w-full flex justify-center">
              <Button
                type="button"
                onClick={handleFinish}
                text="Continue To Dashboard"
                variant="primary"
                className="w-full max-w-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
