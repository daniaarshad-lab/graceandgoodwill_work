"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles && (!user || !user.role || !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase()))) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);

  // Loading spinner styled to match the theme
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-gold-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of secure content if unauthenticated or unauthorized
  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && (!user || !user.role || !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase()))) {
    return null;
  }

  return <>{children}</>;
}
