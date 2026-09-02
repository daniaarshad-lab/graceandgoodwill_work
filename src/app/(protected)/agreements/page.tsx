"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import LegalAgreementsFeature from "@/components/LegalAgreementsFeature";
import ThinSpinner from "@/components/ThinSpinner";

function AgreementsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnboarding = searchParams.get("onboarding") === "true";

  return (
    <LegalAgreementsFeature
      isOnboardingMode={isOnboarding}
      onAllSigned={() => {
        router.push("/client");
      }}
    />
  );
}

export default function AgreementsPage() {
  return (
    <Suspense
      fallback={
        <ThinSpinner fullScreen text="Loading agreements..." size="xl" />
      }
    >
      <AgreementsPageContent />
    </Suspense>
  );
}
