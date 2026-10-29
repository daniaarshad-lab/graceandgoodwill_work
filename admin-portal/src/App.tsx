import React, { useState } from 'react';
import { AdminSidebar, AdminView } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CarerProfileReview } from './components/admin/CarerProfileReview';
import { ActivePlacementView } from './components/admin/ActivePlacementView';
import { HealthConditionsView } from './components/admin/HealthConditionsView';
import { MedicationView } from './components/admin/MedicationView';
import { AllergiesView } from './components/admin/AllergiesView';
import { DeclarationsView } from './components/admin/DeclarationsView';
import { PlacementsView } from './components/admin/PlacementsView';
import { ExpiredProfileView } from './components/admin/ExpiredProfileView';
import { PlatformStoreProvider } from './data/platformStore';

export default function App() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [placementsInitialMode, setPlacementsInitialMode] = useState<
    'admin-list' | 'carer-available'
  >('admin-list');
  const [focusedPlacementId, setFocusedPlacementId] = useState<string | null>(null);

  const handleNavigate = (view: AdminView) => {
    if (view === 'carer-accommodation') {
      setPlacementsInitialMode('admin-list');
      setFocusedPlacementId(null);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing the standalone expired link page, show it full-viewport
  if (currentView === 'expired-link') {
    return (
      <PlatformStoreProvider>
        <ExpiredProfileView onBack={() => setCurrentView('dashboard')} />
      </PlatformStoreProvider>
    );
  }

  return (
    <PlatformStoreProvider>
      <div className="min-h-screen bg-[#F8F5EE] flex text-[#1E293B] antialiased">
        {/* Brand Navigation Sidebar (Deep Navy + Gold) with Mobile Drawer Support */}
        <AdminSidebar
          currentView={currentView}
          onViewChange={handleNavigate}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header with Hamburger Toggle for Mobile */}
          <AdminHeader
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSearch={(q) => console.log('Search:', q)}
          />

          {/* Dynamic Page Views */}
          <main className="flex-1 pb-16">
            {currentView === 'dashboard' && (
              <AdminDashboard onNavigate={handleNavigate} />
            )}

            {currentView === 'carer-review' && (
              <CarerProfileReview
                onBack={() => handleNavigate('dashboard')}
                onOpenCarerPortalPreview={() => {
                  setPlacementsInitialMode('carer-available');
                  setFocusedPlacementId(null);
                  setCurrentView('carer-accommodation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'active-placement' && (
              <ActivePlacementView onBack={() => handleNavigate('dashboard')} />
            )}

            {currentView === 'health-conditions' && (
              <HealthConditionsView onBack={() => handleNavigate('dashboard')} />
            )}

            {currentView === 'medication' && (
              <MedicationView onBack={() => handleNavigate('dashboard')} />
            )}

            {currentView === 'allergies' && (
              <AllergiesView onBack={() => handleNavigate('dashboard')} />
            )}

            {currentView === 'declarations' && (
              <DeclarationsView
                onBack={() => handleNavigate('dashboard')}
                onNavigateToPlacements={(placementId) => {
                  setPlacementsInitialMode('admin-list');
                  setFocusedPlacementId(placementId || null);
                  setCurrentView('carer-accommodation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'carer-accommodation' && (
              <PlacementsView
                key={`${placementsInitialMode}-${focusedPlacementId || 'list'}`}
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
