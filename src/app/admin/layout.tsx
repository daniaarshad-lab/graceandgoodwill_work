"use client";

import ProtectedRoute from "@/guards/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}
