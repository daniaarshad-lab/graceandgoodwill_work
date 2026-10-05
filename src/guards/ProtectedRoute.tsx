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
        let targetRole = "";
        if (allowedRoles && allowedRoles.length > 0) {
          targetRole = allowedRoles[0].toLowerCase();
        } else if (typeof window !== "undefined") {
          const pathname = window.location.pathname.toLowerCase();
          if (pathname.startsWith("/carer")) targetRole = "carer";
          else if (pathname.startsWith("/client")) targetRole = "client";
          else if (pathname.startsWith("/admin")) targetRole = "admin";
        }

        let loginUrl = "/login";
        if (targetRole === "carer") {
          loginUrl = "/login?role=carer";
        } else if (targetRole === "client") {
          loginUrl = "/login?role=client";
        } else if (targetRole === "admin") {
          loginUrl = "/login?role=admin";
        }

        if (typeof window !== "undefined") {
          const currentTarget = window.location.pathname + window.location.search;
          if (currentTarget && !currentTarget.startsWith("/login")) {
            sessionStorage.setItem("auth_redirect", currentTarget);
          }
        }

        router.push(loginUrl);
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
