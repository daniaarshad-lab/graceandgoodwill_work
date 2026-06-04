"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarerDocuments,
  fetchCarerProfile,
} from "@/store/slices/carerSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useCarerPortal } from "./hooks/useCarerPortal";

import DashboardOverview from "./components/DashboardOverview";
import ProfileManagement from "./components/ProfileManagement";
import ComplianceVault from "./components/ComplianceVault";
import AvailabilitySchedule from "./components/AvailabilitySchedule";
import UploadDocumentModal from "./components/UploadDocumentModal";
import PortalHeader from "./components/PortalHeader";
import PortalTabs from "./components/PortalTabs";

type TabType = "overview" | "profile" | "compliance" | "availability";

export default function CarerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
  }, [dispatch]);

  const { profile, documents } = useAppSelector((state) => state.carer);
  const profileUser = profile?.user;

  const portal = useCarerPortal({
    user,
    profile,
    documents,
  });

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader
          firstName={profileUser?.firstName || portal.firstName}
          lastName={profileUser?.lastName || portal.lastName}
          email={profileUser?.email || portal.email}
          phone={profileUser?.phoneNumber || portal.phone}
          profilePhoto={portal.profilePhoto}
          photoUploading={portal.photoUploading}
          photoProgress={portal.photoProgress}
          handlePhotoChange={portal.handlePhotoChange}
        />

        <PortalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="transition-all duration-500">
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
