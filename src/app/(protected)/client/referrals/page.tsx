"use client";

import { useEffect, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchReferrals,
  createClientReferral,
  resetReferralStatus,
} from "@/store/slices/referralSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

import PortalHeader from "../components/PortalHeader";
import PortalTabs from "../components/PortalTabs";
import ReferralFormClient from "@/components/referrals/ReferralFormClient";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

function ClientReferralsContent() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReferrals());
    return () => {
      dispatch(resetReferralStatus());
    };
  }, [dispatch]);

  const { referrals, loading, submitting } = useAppSelector(
    (state) => state.referral,
  );

  const handleReferralSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      await dispatch(createClientReferral(data)).unwrap();
      showSuccessToast(
        "Referral Sent",
        "Referral submitted successfully. Invitation email sent to the referred client.",
      );
      return true;
    } catch (err: any) {
      showErrorToast("Submission Failed", err || "Failed to submit referral");
      return false;
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8">
        <PortalHeader user={user} />

        <PortalTabs activeTab="referrals" />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch lg:h-[680px]">
          <div className="lg:col-span-4 h-full">
            <ReferralFormClient
              onSubmit={handleReferralSubmit}
              submitting={submitting}
            />
          </div>
          <div className="lg:col-span-6 h-full rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-[0_0_30px_rgba(212,175,122,0.03)] backdrop-blur-md">
            <ReferralDashboard
              referrals={referrals}
              loading={loading}
              filterType="CLIENT"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClientReferralsPage() {
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
      <ClientReferralsContent />
    </Suspense>
  );
}
