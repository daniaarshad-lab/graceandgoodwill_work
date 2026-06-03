import React from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import ReduxProvider from "@/store/ReduxProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <SiteHeader />
        <div className="flex-grow">{children}</div>
        <SiteFooter />
      </AuthProvider>
    </ReduxProvider>
  );
}
