"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

import ThinSpinner from "@/components/ThinSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (
        allowedRoles &&
        (!user ||
          !user.role ||
          !allowedRoles
            .map((r) => r.toLowerCase())
            .includes(user.role.toLowerCase()))
      ) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);

  // Loading spinner styled to match the theme
  if (isLoading) {
    return <ThinSpinner fullScreen text="Verifying session..." size="xl" />;
  }

  // Prevent flash of secure content if unauthenticated or unauthorized
  if (!isAuthenticated) {
    return <ThinSpinner fullScreen text="Redirecting to login..." size="xl" />;
  }

  if (
    allowedRoles &&
    (!user ||
      !user.role ||
      !allowedRoles
        .map((r) => r.toLowerCase())
        .includes(user.role.toLowerCase()))
  ) {
    return <ThinSpinner fullScreen text="Redirecting..." size="xl" />;
  }

  return <>{children}</>;
}
