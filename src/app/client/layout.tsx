"use client";

import ProtectedRoute from "@/guards/ProtectedRoute";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["client"]}>{children}</ProtectedRoute>;
}
