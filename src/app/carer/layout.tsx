"use client";

import ProtectedRoute from "@/guards/ProtectedRoute";

export default function CarerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["carer"]}>{children}</ProtectedRoute>;
}
