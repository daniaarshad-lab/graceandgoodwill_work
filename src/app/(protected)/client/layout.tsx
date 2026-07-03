"use client";

import ProtectedRoute from "@/guards/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchClientProfile } from "@/store/slices/clientSlice";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role?.toLowerCase() === "client") {
      dispatch(fetchClientProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return <ProtectedRoute allowedRoles={["client"]}>{children}</ProtectedRoute>;
}
