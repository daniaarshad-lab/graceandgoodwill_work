"use client";

import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchClientReferralsThunk,
  submitClientReferralThunk,
  resetReferralStatus,
} from "@/store/slices/referralSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

import PortalHeader from "../components/PortalHeader";
import PortalTabs from "../components/PortalTabs";
import ReferralFormClient from "@/components/referrals/ReferralFormClient";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";
import ThinSpinner from "@/components/ThinSpinner";

function ClientReferralsContent() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchClientReferralsThunk(statusFilter));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    return () => {
      dispatch(resetReferralStatus());
    };
  }, [dispatch]);

  const { clientReferrals, loading, submitting } = useAppSelector(
    (state) => state.referral,
  );

  const handleReferralSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<boolean> => {
    try {
      await dispatch(
        submitClientReferralThunk({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }),
      ).unwrap();
      showSuccessToast("Client referred successfully");
      dispatch(fetchClientReferralsThunk(statusFilter));
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

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch lg:min-h-[680px]">
          <div className="lg:col-span-4 h-full">
            <ReferralFormClient
              onSubmit={handleReferralSubmit}
              submitting={submitting}
              hidePhone={true}
            />
          </div>
          <div className="lg:col-span-6 h-full rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-[0_0_30px_rgba(212,175,122,0.03)] backdrop-blur-md">
            <ReferralDashboard
              referrals={clientReferrals}
              loading={loading}
              filterType="CLIENT"
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
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
        <ThinSpinner fullScreen text="Loading Referral Portal..." size="xl" />
      }
    >
      <ClientReferralsContent />
    </Suspense>
  );
}
