"use client";

import React, { useState } from "react";
import { AdminSidebar, AdminView } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminDashboard } from "./AdminDashboard";
import { CarerProfileReview } from "./CarerProfileReview";
import { ActivePlacementView } from "./ActivePlacementView";
import { HealthConditionsView } from "./HealthConditionsView";
import { MedicationView } from "./MedicationView";
import { AllergiesView } from "./AllergiesView";
import { DeclarationsView } from "./DeclarationsView";
import { PlacementsView } from "./PlacementsView";
import { ExpiredProfileView } from "./ExpiredProfileView";
import { PlatformStoreProvider } from "@/data/care-platform/platformStore";

interface CarePlatformShellProps {
  initialView?: AdminView;
  initialPlacementsMode?: "admin-list" | "carer-available" | "client-portal";
}

export default function CarePlatformShell({
  initialView = "dashboard",
  initialPlacementsMode = "admin-list",
}: CarePlatformShellProps) {
  const [currentView, setCurrentView] = useState<AdminView>(initialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [placementsInitialMode, setPlacementsInitialMode] = useState<
    "admin-list" | "carer-available" | "client-portal"
  >(initialPlacementsMode);
  const [focusedPlacementId, setFocusedPlacementId] = useState<string | null>(
    null,
  );

  const handleNavigate = (view: AdminView) => {
    if (view === "carer-accommodation") {
      setPlacementsInitialMode("admin-list");
      setFocusedPlacementId(null);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentView === "expired-link") {
    return (
      <PlatformStoreProvider>
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F8F5EE]">
          <ExpiredProfileView onBack={() => setCurrentView("dashboard")} />
        </div>
      </PlatformStoreProvider>
    );
  }

  return (
    <PlatformStoreProvider>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F8F5EE] flex text-[#1E293B] antialiased">
        <AdminSidebar
          currentView={currentView}
          onViewChange={handleNavigate}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AdminHeader
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearch={(q) => console.log("Search:", q)}
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
              <ActivePlacementView onBack={() => handleNavigate("dashboard")} />
            )}

            {currentView === "health-conditions" && (
              <HealthConditionsView
                onBack={() => handleNavigate("dashboard")}
              />
            )}

            {currentView === "medication" && (
              <MedicationView onBack={() => handleNavigate("dashboard")} />
            )}

            {currentView === "allergies" && (
              <AllergiesView onBack={() => handleNavigate("dashboard")} />
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
