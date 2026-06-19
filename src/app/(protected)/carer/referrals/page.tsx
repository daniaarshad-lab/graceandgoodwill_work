"use client";

import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCarerProfile,
  fetchCarerDocuments,
} from "@/store/slices/carerSlice";
import {
  fetchCarerReferralsThunk,
  submitCarerReferralThunk,
  resetReferralStatus,
} from "@/store/slices/referralSlice";
import { useCarerPortal } from "../hooks/useCarerPortal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

import PortalHeader from "../components/PortalHeader";
import PortalTabs from "../components/PortalTabs";
import ReferralFormCarer from "@/components/referrals/ReferralFormCarer";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

function CarerReferralsContent() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Load profiles, documents on mount
  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
    return () => {
      dispatch(resetReferralStatus());
    };
  }, [dispatch]);

  // Load referrals when statusFilter changes
  useEffect(() => {
    dispatch(fetchCarerReferralsThunk(statusFilter));
  }, [dispatch, statusFilter]);

  const { profile, documents } = useAppSelector((state) => state.carer);
  const { carerReferrals, loading, submitting } = useAppSelector(
    (state) => state.referral,
  );

  const profileUser = profile?.user;

  const portal = useCarerPortal({
    user,
    profile,
    documents,
  });

  const handleReferralSubmit = async (formData: FormData): Promise<boolean> => {
    try {
      await dispatch(submitCarerReferralThunk(formData)).unwrap();
      showSuccessToast("Referral submitted successfully.");
      dispatch(fetchCarerReferralsThunk(statusFilter));
      return true;
    } catch (err: any) {
      showErrorToast("Submission Failed", err || "Failed to submit referral");
      return false;
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader
          firstName={profileUser?.firstName || portal.firstName}
          lastName={profileUser?.lastName || portal.lastName}
          email={profileUser?.email || portal.email}
          phone={profileUser?.phoneNumber || portal.phone}
          profilePhoto={profile?.profilePhotoUrl || null}
        />

        <PortalTabs activeTab="referrals" />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch lg:min-h-[750px]">
          <div className="lg:col-span-4 h-full">
            <ReferralFormCarer
              onSubmit={handleReferralSubmit}
              submitting={submitting}
            />
          </div>
          <div className="lg:col-span-6 h-full rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md">
            <ReferralDashboard
              referrals={carerReferrals}
              loading={loading}
              filterType="CARER"
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CarerReferralsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
            <p className="text-sm tracking-wider text-gold-200">
              Loading Referral Portal...
            </p>
          </div>
        </main>
      }
    >
      <CarerReferralsContent />
    </Suspense>
  );
}
