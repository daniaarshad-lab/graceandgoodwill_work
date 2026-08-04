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
import ReferralFormClient from "@/components/referrals/ReferralFormClient";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";

function CarerReferralsContent() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeAccordion, setActiveAccordion] = useState<
    "CARER" | "CLIENT" | null
  >("CARER");

  // Load profiles, documents on mount
  useEffect(() => {
    dispatch(fetchCarerProfile());
    dispatch(fetchCarerDocuments());
    return () => {
      dispatch(resetReferralStatus());
    };
  }, [dispatch]);

  // Load referrals when statusFilter or activeAccordion changes
  useEffect(() => {
    dispatch(
      fetchCarerReferralsThunk({
        status: statusFilter,
        type: activeAccordion || undefined,
      }),
    );
  }, [dispatch, statusFilter, activeAccordion]);

  const { profile, documents } = useAppSelector((state) => state.carer);
  const { carerReferrals, clientReferrals, loading, submitting } =
    useAppSelector((state) => state.referral);

  const profileUser = profile?.user;

  const portal = useCarerPortal({
    user,
    profile,
    documents,
  });

  const handleReferralSubmit = async (formData: FormData): Promise<boolean> => {
    try {
      formData.append("role", "CARER");
      await dispatch(submitCarerReferralThunk(formData)).unwrap();
      showSuccessToast("Referral submitted successfully.");
      dispatch(
        fetchCarerReferralsThunk({ status: statusFilter, type: "CARER" }),
      );
      return true;
    } catch (err: any) {
      showErrorToast("Submission Failed", err || "Failed to submit referral");
      return false;
    }
  };

  const handleClientReferralSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phone || "");
      formData.append("role", "CLIENT");

      await dispatch(submitCarerReferralThunk(formData)).unwrap();
      showSuccessToast("Client referred successfully.");
      dispatch(
        fetchCarerReferralsThunk({ status: statusFilter, type: "CLIENT" }),
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
        <PortalHeader
          firstName={profileUser?.firstName || portal.firstName}
          lastName={profileUser?.lastName || portal.lastName}
          email={profileUser?.email || portal.email}
          phone={profileUser?.phoneNumber || portal.phone}
          profilePhoto={profile?.profilePhotoUrl || null}
        />

        <PortalTabs activeTab="referrals" />

        <div className="flex flex-col gap-6">
          {/* Accordion 1: Carer Referrals */}
          <div className="flex flex-col">
            <button
              onClick={() =>
                setActiveAccordion((prev) =>
                  prev === "CARER" ? null : "CARER",
                )
              }
              className={`w-full flex items-center justify-between rounded-2xl border border-gold-300/10 p-5 sm:p-6 transition-all duration-300 focus:outline-none group ${
                activeAccordion === "CARER"
                  ? "bg-navy-900/60 shadow-elegant border-gold-300/30"
                  : "bg-navy-900/40 hover:bg-navy-900/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-gold-300/20 to-gold-200/5 border border-gold-300/20 flex items-center justify-center text-lg text-gold-DEFAULT group-hover:scale-105 transition-transform">
                  👥
                </div>
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gold-200 tracking-wide">
                    Refer a Carer{" "}
                  </h2>
                </div>
              </div>
              <div
                className={`transform transition-transform duration-300 ${activeAccordion === "CARER" ? "rotate-180" : ""}`}
              >
                <svg
                  className="w-5 h-5 text-gold-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            <div
              className={`grid transition-all duration-500 ease-in-out ${activeAccordion === "CARER" ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch pb-2">
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
            </div>
          </div>

          {/* Accordion 2: Client Referrals */}
          <div className="flex flex-col">
            <button
              onClick={() =>
                setActiveAccordion((prev) =>
                  prev === "CLIENT" ? null : "CLIENT",
                )
              }
              className={`w-full flex items-center justify-between rounded-2xl border border-gold-300/10 p-5 sm:p-6 transition-all duration-300 focus:outline-none group ${
                activeAccordion === "CLIENT"
                  ? "bg-navy-900/60 shadow-elegant border-gold-300/30"
                  : "bg-navy-900/40 hover:bg-navy-900/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-gold-300/20 to-gold-200/5 border border-gold-300/20 flex items-center justify-center text-lg text-gold-DEFAULT group-hover:scale-105 transition-transform">
                  ❤️
                </div>
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gold-200 tracking-wide">
                    Refer a Client
                  </h2>
                </div>
              </div>
              <div
                className={`transform transition-transform duration-300 ${activeAccordion === "CLIENT" ? "rotate-180" : ""}`}
              >
                <svg
                  className="w-5 h-5 text-gold-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            <div
              className={`grid transition-all duration-500 ease-in-out ${activeAccordion === "CLIENT" ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch pb-2">
                  <div className="lg:col-span-4 h-full">
                    <ReferralFormClient
                      onSubmit={handleClientReferralSubmit}
                      submitting={submitting}
                    />
                  </div>
                  <div className="lg:col-span-6 h-full rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md">
                    <ReferralDashboard
                      referrals={carerReferrals}
                      loading={loading}
                      filterType="CLIENT"
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                    />
                  </div>
                </div>
              </div>
            </div>
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
