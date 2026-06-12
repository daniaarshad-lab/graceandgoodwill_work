import { memo, useCallback } from "react";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  description: string;
}

export interface OnboardingStepperProps {
  currentStep: number; // 1 to 5
  setCurrentStep: (step: number) => void;
}

const ONBOARDING_STEPS: StepItem[] = [
  { id: 1, label: "Register", description: "Created" },
  { id: 2, label: "Personal", description: "Info" },
  { id: 3, label: "Identity", description: "Docs" },
  { id: 4, label: "Professional", description: "Info" },
  { id: 5, label: "Training", description: "Certs" },
  { id: 6, label: "Compliance", description: "Docs" },
  { id: 7, label: "Insurance", description: "Docs" },
  { id: 8, label: "Additional", description: "Quals" },
  { id: 9, label: "Video", description: "Intro" },
  { id: 10, label: "Declaration", description: "Consent" },
  { id: 11, label: "Service Options", description: "Plan" },
  { id: 12, label: "Complete", description: "Ready" },
];

/**
 * Premium Header Component
 * Isolated to prevent unnecessary re-renders when stepping
 */
const StepperHeader = memo(({ progress }: { progress: number }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 bg-navy-900/30 border border-gold-300/10 rounded-2xl p-4 md:px-6 md:py-4 backdrop-blur-md">
    <div className="flex flex-col gap-1 max-w-lg">
      <h2 className="text-xl md:text-2xl font-light text-gold-100 tracking-wide">
        Welcome to <span className="font-semibold">Grace & Goodwill</span>
      </h2>
      <p className="text-gold-100/50 text-[13px] leading-relaxed">
        Complete your professional onboarding journey to join our elite network of healthcare professionals.
      </p>
    </div>

    <div className="flex flex-col gap-2 w-full md:w-[220px] shrink-0">
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-medium uppercase tracking-widest text-gold-100/40">Journey Progress</span>
        <span className="text-[13px] font-bold text-gold-DEFAULT drop-shadow-[0_0_8px_rgba(184,145,94,0.3)]">
          {progress}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-navy-950/80 rounded-full overflow-hidden relative shadow-inner border border-gold-300/5">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-muted to-gold-DEFAULT rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Subtle animated shine */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-[2px] animate-pulse rounded-r-full" />
        </div>
      </div>
    </div>
  </div>
));

StepperHeader.displayName = "StepperHeader";

/**
 * Individual Step Item Component
 * Extracted for readability and memoized for performance
 */
interface StepperStepItemProps {
  step: StepItem;
  index: number;
  totalSteps: number;
  currentStep: number;
  onStepClick: (step: StepItem) => void;
}

const StepperStepItem = memo(({ step, index, totalSteps, currentStep, onStepClick }: StepperStepItemProps) => {
  const isCompleted = step.id < currentStep;
  const isActive = step.id === currentStep;
  const isClickable = step.id <= currentStep && step.id >= 2 && step.id <= 11;

  return (
    <div
      onClick={() => isClickable && onStepClick(step)}
      className={`group flex-1 flex flex-col items-center relative z-10 transition-all duration-300 ${
        isClickable ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Thin Connector Line (Don't render on the last item) */}
      {index < totalSteps - 1 && (
        <div className="absolute top-[15px] left-[50%] w-full h-[2px] bg-gold-300/10 -z-10">
          <div
            className={`h-full transition-all duration-700 ease-out ${
              isCompleted
                ? "bg-gold-DEFAULT w-full shadow-[0_0_4px_rgba(184,145,94,0.4)]"
                : isActive
                ? "bg-gradient-to-r from-gold-DEFAULT to-transparent w-1/2"
                : "bg-transparent w-0"
            }`}
          />
        </div>
      )}

      {/* Circle Indicator */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 relative z-10 ${
          isCompleted
            ? "bg-gold-DEFAULT text-white shadow-[0_0_8px_rgba(184,145,94,0.4)]"
            : isActive
            ? "bg-navy-950 border-[1.5px] border-gold-DEFAULT shadow-[0_0_8px_rgba(184,145,94,0.2)]"
            : "bg-navy-950 border-[1.5px] border-gold-300/10 text-gold-100/30"
        }`}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 stroke-[3px]" />
        ) : isActive ? (
          <div className="w-2.5 h-2.5 rounded-full bg-gold-DEFAULT shadow-[0_0_4px_rgba(184,145,94,0.4)]" />
        ) : (
          <span className="text-[13px] font-medium">{step.id}</span>
        )}
      </div>

      {/* Text Content */}
      <div className="mt-3 flex flex-col items-center text-center w-full px-1">
        <span
          className={`text-[12px] md:text-[13px] font-semibold transition-colors duration-300 ${
            isActive
              ? "text-gold-50"
              : isCompleted
              ? "text-gold-200"
              : "text-gold-100/40"
          }`}
        >
          {step.label}
        </span>
        <span
          className={`text-[11px] mt-0.5 leading-snug transition-colors duration-300 hidden sm:block ${
            isActive ? "text-gold-100/60" : isCompleted ? "text-gold-200/50" : "text-gold-100/30"
          }`}
        >
          {step.description}
        </span>
      </div>
    </div>
  );
});

StepperStepItem.displayName = "StepperStepItem";

/**
 * Main Onboarding Stepper Component
 * Serves as the orchestration layer
 */
export default function OnboardingStepper({ currentStep, setCurrentStep }: OnboardingStepperProps) {
  // Memoize click handler to prevent unnecessary re-renders of step items
  const handleStepClick = useCallback(
    (step: StepItem) => {
      if (step.id <= currentStep && step.id >= 2 && step.id <= 11) {
        setCurrentStep(step.id);
      }
    },
    [currentStep, setCurrentStep]
  );

  const calculateProgress = () => {
    switch (currentStep) {
      case 1: return 8;
      case 2: return 16;
      case 3: return 25;
      case 4: return 33;
      case 5: return 41;
      case 6: return 50;
      case 7: return 58;
      case 8: return 66;
      case 9: return 75;
      case 10: return 83;
      case 11: return 91;
      case 12: return 100;
      default: return 0;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 mb-6 mt-2">
      {/* Header section isolated into memoized component */}
      <StepperHeader progress={calculateProgress()} />

      {/* Classic Horizontal Stepper */}
      <div className="w-full mx-auto pb-4 overflow-x-auto hide-scrollbar">
        <div className="flex justify-between items-start min-w-[900px] w-full relative px-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <StepperStepItem
              key={step.id}
              step={step}
              index={index}
              totalSteps={ONBOARDING_STEPS.length}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
