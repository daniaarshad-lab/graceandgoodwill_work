"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import LegalAgreementsFeature from "@/components/LegalAgreementsFeature";
import { Loader2 } from "lucide-react";

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
        <div className="flex min-h-screen items-center justify-center bg-navy-950 text-gold-100">
          <Loader2 className="h-10 w-10 animate-spin text-gold-DEFAULT opacity-80" />
        </div>
      }
    >
      <AgreementsPageContent />
    </Suspense>
  );
}
