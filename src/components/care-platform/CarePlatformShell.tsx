"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminView } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminDashboard } from "./AdminDashboard";
import { CarerProfileReview } from "./CarerProfileReview";
import { ActivePlacementView } from "./ActivePlacementView";
import { ClientProfilePortalView } from "./ClientProfilePortalView";
import { ClientBiographyView } from "./ClientBiographyView";
import { ClientHealthConditionsView } from "./ClientHealthConditionsView";
import { ClientDeclarationsAdminView } from "./ClientDeclarationsAdminView";
import { ClientDeclarationPortalView } from "./ClientDeclarationPortalView";
import { HealthConditionsView } from "./HealthConditionsView";
import { MedicationView } from "./MedicationView";
import { AllergiesView } from "./AllergiesView";
import { DeclarationsView } from "./DeclarationsView";
import { PlacementsView } from "./PlacementsView";
import { ExpiredProfileView } from "./ExpiredProfileView";
import { PlatformStoreProvider } from "@/data/care-platform/platformStore";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutThunk } from "@/store/slices/authSlice";
import { AUTH_ROUTES } from "@/lib/auth-routes";

interface CarePlatformShellProps {
  initialView?: AdminView;
  initialPlacementsMode?: "admin-list" | "carer-available";
}

export default function CarePlatformShell({
  initialView = "dashboard",
  initialPlacementsMode = "admin-list",
}: CarePlatformShellProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [currentView, setCurrentView] = useState<AdminView>(initialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [placementsInitialMode, setPlacementsInitialMode] = useState<
    "admin-list" | "carer-available"
  >(initialPlacementsMode);
  const [focusedPlacementId, setFocusedPlacementId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  const handleNavigate = (view: AdminView) => {
    if (view === "carer-accommodation") {
      setPlacementsInitialMode("admin-list");
      setFocusedPlacementId(null);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_logging_out", String(Date.now()));
    }
    await dispatch(logoutThunk());
    router.replace(AUTH_ROUTES.login.admin);
  };

  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
      : undefined;

  if (currentView === "expired-link") {
    return (
      <PlatformStoreProvider>
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#F8F5EE]">
          <ExpiredProfileView onBack={() => setCurrentView("dashboard")} />
        </div>
      </PlatformStoreProvider>
    );
  }

  return (
    <PlatformStoreProvider>
      <div className="fixed inset-0 z-40 overflow-y-auto bg-[#F8F5EE] flex text-[#1E293B] antialiased">
        <AdminSidebar
          currentView={currentView}
          onViewChange={handleNavigate}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          websiteHref="/"
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AdminHeader
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearch={(q) => console.log("Search:", q)}
            userName={fullName}
            userEmail={user?.email}
            userRole={user?.role}
            websiteHref="/"
            classicAdminHref="/admin/classic"
            onLogout={handleLogout}
          />

          <main className="flex-1 pb-16">
            {currentView === "dashboard" && (
              <AdminDashboard onNavigate={handleNavigate} />
            )}
            {currentView === "carer-review" && (
              <CarerProfileReview
                onBack={() => handleNavigate("dashboard")}
                onOpenCarerPortalPreview={() => {
                  setPlacementsInitialMode("carer-available");
                  setFocusedPlacementId(null);
                  setCurrentView("carer-accommodation");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {currentView === "active-placement" && (
              <ActivePlacementView
                onBack={() => handleNavigate("dashboard")}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === "client-portal-profile" && (
              <ClientProfilePortalView onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
            )}
            {currentView === "client-biography" && (
              <ClientBiographyView onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
            )}
            {currentView === "client-health-conditions" && (
              <ClientHealthConditionsView onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
            )}
            {currentView === "client-declarations" && (
              <ClientDeclarationsAdminView onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
            )}
            {currentView === "client-declaration-portal" && (
              <ClientDeclarationPortalView onBack={() => handleNavigate("dashboard")} onNavigate={handleNavigate} />
            )}
            {currentView === "health-conditions" && (
              <HealthConditionsView
                userRole={user?.role}
                onBack={() => handleNavigate("dashboard")}
              />
            )}
            {currentView === "medication" && (
              <MedicationView
                onBack={() => handleNavigate("dashboard")}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === "allergies" && (
              <AllergiesView
                onBack={() => handleNavigate("dashboard")}
                onNavigate={handleNavigate}
              />
            )}
            {currentView === "declarations" && (
              <DeclarationsView
                onBack={() => handleNavigate("dashboard")}
                onNavigateToPlacements={(placementId) => {
                  setPlacementsInitialMode("admin-list");
                  setFocusedPlacementId(placementId || null);
                  setCurrentView("carer-accommodation");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {currentView === "carer-accommodation" && (
              <PlacementsView
                key={`${placementsInitialMode}-${focusedPlacementId || "list"}`}
                initialMode={placementsInitialMode}
                initialSelectedPlacementId={focusedPlacementId}
              />
            )}
          </main>
        </div>
      </div>
    </PlatformStoreProvider>
  );
}
