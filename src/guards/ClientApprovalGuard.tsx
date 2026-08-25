"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/store/hooks";

interface ClientApprovalGuardProps {
  children: React.ReactNode;
}

export default function ClientApprovalGuard({
  children,
}: ClientApprovalGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const clientProfile = useAppSelector((state) => state.client.profile);
  const profileLoading = useAppSelector((state) => state.client.loading);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (user.role?.toUpperCase() !== "CLIENT") return;

    if (!profileLoading && clientProfile) {
      const status = clientProfile.status;
      const isPending = status === "PENDING" || status === "PENDING_APPROVAL" || status === "INCOMPLETE";
      const isOnboardingRoute = pathname === "/client/onboarding";

      if (isPending && !isOnboardingRoute) {
        router.replace("/client/onboarding");
      } else if (!isPending && isOnboardingRoute) {
        // If approved and trying to access onboarding, redirect to portal
        router.replace("/client");
      }
    }
  }, [
    user,
    isAuthenticated,
    isLoading,
    clientProfile,
    profileLoading,
    pathname,
    router,
  ]);

  if (
    isLoading ||
    profileLoading ||
    (clientProfile &&
      (clientProfile.status === "PENDING" || clientProfile.status === "PENDING_APPROVAL" || clientProfile.status === "INCOMPLETE") &&
      pathname !== "/client/onboarding")
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gold-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">
            Checking approval status...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
