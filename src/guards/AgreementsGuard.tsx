"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { agreementsService } from "@/services/agreements/agreements.service";

interface AgreementsGuardProps {
  children: React.ReactNode;
}

export default function AgreementsGuard({ children }: AgreementsGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasPending, setHasPending] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      if (!isLoading && !isAuthenticated) {
        setHasPending(false);
      }
      return;
    }

    // Skip check for admins
    if (user.role?.toUpperCase() === "ADMIN" || user.role?.toUpperCase() === "SUPER_ADMIN") {
      setHasPending(false);
      return;
    }

    // Bypass redirect for Carers during onboarding, because the /carer route
    // natively handles Legal Agreements as Step 2 of the onboarding stepper.
    const normalizedPath = pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

    if (user.role?.toUpperCase() === "CARER" && normalizedPath === "/carer") {
      const isOnboardingParam =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("onboarding") ===
          "true";
      const isDone =
        typeof window !== "undefined" &&
        localStorage.getItem(`carer_onboarding_done_${user.id}`) === "true";

      if (!isDone || isOnboardingParam) {
        setHasPending(false);
        return;
      }
    }

    // Don't redirect if we're already on the agreements page or login/register/unauthorized/onboarding
    if (
      normalizedPath === "/agreements" ||
      normalizedPath.startsWith("/login") ||
      normalizedPath.startsWith("/register") ||
      normalizedPath.startsWith("/unauthorized") ||
      normalizedPath === "/client/onboarding"
    ) {
      setHasPending(false);
      return;
    }

    const checkAgreements = async () => {
      try {
        const pending = await agreementsService.getPendingAgreements();
        if (pending && pending.length > 0) {
          setHasPending(true);
          const search =
            typeof window !== "undefined" ? window.location.search : "";
          router.replace(`/agreements${search}`);
        } else {
          setHasPending(false);
        }
      } catch (err) {
        console.error("Failed to check agreements:", err);
        setHasPending(false);
      }
    };

    checkAgreements();
  }, [user, isAuthenticated, isLoading, pathname, router]);

  // Loading spinner during check or while redirecting
  if (isLoading || (isAuthenticated && (hasPending === null || hasPending === true))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-gold-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">
            {hasPending === true ? "Redirecting to agreements..." : "Checking legal agreements..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
