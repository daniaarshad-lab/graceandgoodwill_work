"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCarerPortal } from "./hooks/useCarerPortal";

// Components
import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";
import DashboardOverview from "./components/DashboardOverview";
import ProfileManagement from "./components/ProfileManagement";
import ComplianceVault from "./components/ComplianceVault";
import AvailabilitySchedule from "./components/AvailabilitySchedule";
import UploadDocumentModal from "./components/UploadDocumentModal";

type TabType = "overview" | "profile" | "compliance" | "availability";

export default function CarerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Custom hook containing state + handlers
  const portal = useCarerPortal({ user });

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        {/* Header Hero Section */}
        <PortalHeader
          firstName={portal.firstName}
          lastName={portal.lastName}
          email={portal.email}
          phone={portal.phone}
          profilePhoto={portal.profilePhoto}
          photoUploading={portal.photoUploading}
          photoProgress={portal.photoProgress}
          handlePhotoChange={portal.handlePhotoChange}
          logout={logout}
        />

        {/* Tabbed Menu Navigation */}
        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Panels */}
        <div className="transition-all duration-500">
          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <DashboardOverview
              applicationStatus={portal.applicationStatus}
              membershipActive={portal.membershipActive}
              membershipExpiry={portal.membershipExpiry}
              complianceDocs={portal.complianceDocs}
              availability={portal.availability}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: PROFILE PANEL */}
          {activeTab === "profile" && (
            <ProfileManagement
              firstName={portal.firstName}
              setFirstName={portal.setFirstName}
              lastName={portal.lastName}
              setLastName={portal.setLastName}
              email={portal.email}
              setEmail={portal.setEmail}
              phone={portal.phone}
              setPhone={portal.setPhone}
              bio={portal.bio}
              setBio={portal.setBio}
              specialties={portal.specialties}
              setSpecialties={portal.setSpecialties}
              experience={portal.experience}
              setExperience={portal.setExperience}
              address={portal.address}
              setAddress={portal.setAddress}
              profilePhoto={portal.profilePhoto}
              photoUploading={portal.photoUploading}
              photoProgress={portal.photoProgress}
              photoError={portal.photoError}
              handlePhotoChange={portal.handlePhotoChange}
              errors={portal.profileErrors}
              errorMsg={portal.profileErrorMsg}
              successMsg={portal.profileSuccessMsg}
              isProfileSaving={portal.isProfileSaving}
              onSubmit={portal.handleSaveProfile}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 3: COMPLIANCE VAULT PANEL */}
          {activeTab === "compliance" && (
            <ComplianceVault
              complianceDocs={portal.complianceDocs}
              uploadingDocType={portal.uploadingDocType}
              uploadProgress={portal.uploadProgress}
              handleDocUpload={portal.handleDocUpload}
              setPreviewDoc={portal.setPreviewDoc}
              setDocToDelete={portal.setDocToDelete}
              complianceError={portal.complianceError}
              complianceSuccess={portal.complianceSuccess}
            />
          )}

          {/* TAB 4: AVAILABILITY Grid Management */}
          {activeTab === "availability" && (
            <AvailabilitySchedule
              availability={portal.availability}
              availabilityError={portal.availabilityError}
              availabilitySuccess={portal.availabilitySuccess}
              isAvailabilitySaving={portal.isAvailabilitySaving}
              handleSaveAvailability={portal.handleSaveAvailability}
              handleToggleDay={portal.handleToggleDay}
              handleToggleShift={portal.handleToggleShift}
            />
          )}
        </div>
      </div>

      {/* --- CONFIRMATION & PREVIEW MODALS --- */}
      <UploadDocumentModal
        previewDoc={portal.previewDoc}
        setPreviewDoc={portal.setPreviewDoc}
        docToDelete={portal.docToDelete}
        setDocToDelete={portal.setDocToDelete}
        confirmDelete={() => {
          if (portal.docToDelete) {
            portal.handleDeleteDoc(portal.docToDelete);
            portal.setDocToDelete(null);
            portal.setComplianceSuccess("Document successfully deleted.");
            setTimeout(() => portal.setComplianceSuccess(null), 4000);
          }
        }}
      />
    </main>
  );
}
