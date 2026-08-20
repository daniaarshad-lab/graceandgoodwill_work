import LegalAgreementsFeature from "@/components/LegalAgreementsFeature";

interface StepLegalAgreementsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepLegalAgreements({
  onNext,
  onBack,
}: StepLegalAgreementsProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gold-100">Terms & Policies</h2>
        <p className="text-gold-200/70 mt-1">
          Please review and accept our platform terms and policies to continue.
        </p>
      </div>

      <LegalAgreementsFeature
        isOnboardingMode={true}
        onAllSigned={onNext}
        onBack={onBack}
      />
    </div>
  );
}

