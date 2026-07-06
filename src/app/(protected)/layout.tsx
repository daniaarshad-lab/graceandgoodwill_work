import React from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import ReduxProvider from "@/store/ReduxProvider";
import AgreementsGuard from "@/guards/AgreementsGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <AgreementsGuard>
          <SiteHeader />
          <div className="flex-grow">{children}</div>
          <SiteFooter />
        </AgreementsGuard>
      </AuthProvider>
    </ReduxProvider>
  );
}
