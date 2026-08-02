"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCareRequests,
  fetchClientCareRequestApplications,
  clearApplications,
  approveApplication,
  rejectApplication,
  fetchInterestList,
} from "@/store/slices/clientSlice";
import { clientService } from "@/services/client/client.service";
import { CareRequest, CareRequestApplication } from "@/types/client.types";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import {
  AlertCircle,
  RefreshCw,
  Users,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronRight,
  UserCircle,
} from "lucide-react";

export default function ClientApplicationsPanel() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    careRequests,
    loading: careRequestsLoading,
    applications,
    applicationsLoading,
    applicationsError,
    interestList,
  } = useAppSelector((state) => state.client);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const [rejectAppId, setRejectAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleApprove = async (appId: string) => {
    setIsSubmitting(appId);
    try {
      await dispatch(approveApplication(appId)).unwrap();
      showSuccessToast(
        "Application Approved",
        "The placement has been created successfully.",
      );
      dispatch(fetchCareRequests());
      if (selectedRequestId) {
        dispatch(fetchClientCareRequestApplications(selectedRequestId));
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast(
        "Approval Failed",
        err?.message || "Failed to approve application.",
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleReject = async () => {
    if (!rejectAppId || !rejectReason.trim()) return;
    setIsSubmitting("reject");
    try {
      await dispatch(
        rejectApplication({ applicationId: rejectAppId, reason: rejectReason }),
      ).unwrap();
      setRejectAppId(null);
      setRejectReason("");
      // Refresh applications for the selected request
      if (selectedRequestId) {
        dispatch(fetchClientCareRequestApplications(selectedRequestId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(null);
    }
  };

  useEffect(() => {
    dispatch(fetchCareRequests());
    dispatch(fetchInterestList());
  }, [dispatch]);

  // Show all care requests so clients can view applications proposed by G&G or themselves
  const clientManagedRequests = careRequests;

  useEffect(() => {
    if (selectedRequestId) {
      dispatch(fetchClientCareRequestApplications(selectedRequestId));
    } else {
      dispatch(clearApplications());
    }
  }, [selectedRequestId, dispatch]);

  const handleSelectRequest = (id: string) => {
    if (selectedRequestId === id) {
      setSelectedRequestId(null);
    } else {
      setSelectedRequestId(id);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (careRequestsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
        <p className="text-sm text-gold-100/60">Loading care requests...</p>
      </div>
    );
  }

  return (
    <>
      <SectionCard className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gold-300/10 pb-4">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-gold-200">
              Care Requests & Applications
            </h3>
            <p className="text-gold-200/70 text-sm mt-1 max-w-2xl">
              View the status of your care requests and review carer
              applications. Grace & Goodwill will notify you when new
              applications are ready for review.
            </p>
          </div>
          <Button
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
            className="self-start shrink-0"
            onClick={() => {
              dispatch(fetchCareRequests());
              if (selectedRequestId) {
                dispatch(fetchClientCareRequestApplications(selectedRequestId));
              }
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {clientManagedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-gold-300/10 rounded-2xl bg-navy-950/40">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-gold-200/60 font-medium">
              You do not have any active care requests.
            </p>
            <p className="text-xs mt-1 opacity-60">
              Create a new care request to begin receiving carer applications.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientManagedRequests.map((req) => (
              <div
                key={req.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  selectedRequestId === req.id
                    ? "border-gold-300/30 bg-navy-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    : "border-gold-300/10 bg-navy-900/40 hover:border-gold-300/20 hover:bg-navy-900/60"
                }`}
              >
                {/* Request Header (Clickable) */}
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => handleSelectRequest(req.id)}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-light text-gold-200 break-words leading-tight">
                      {Array.isArray(req.careCategory)
                        ? req.careCategory.join(" • ")
                        : req.careCategory || "Care Request"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs text-gold-100/60">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-gold-200/40" />
                        <span>{formatDate(req.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-gold-200/40" />
                        <span>{req.duration || "Ongoing"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            req.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : req.status === "FULFILLED"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    {req.status === "CARER_SELECTED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/client?tab=tracking");
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Placement</span>
                        <span className="sm:hidden">View</span>
                      </button>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-200 bg-navy-950 px-3 py-1.5 rounded-lg border border-gold-300/10">
                      <Users className="w-3.5 h-3.5 text-gold" />
                      <span className="hidden sm:inline">
                        View Applications
                      </span>
                      <span className="sm:hidden">Apps</span>
                    </div>
                    {selectedRequestId === req.id ? (
                      <ChevronDown className="w-5 h-5 text-gold-200/60" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gold-200/60" />
                    )}
                  </div>
                </div>

                {/* Applications List */}
                {selectedRequestId === req.id && (
                  <div className="border-t border-gold-300/10 bg-navy-950/30 p-5">
                    {(() => {
                      const appsForRequest = applications[req.id] || [];
                      return applicationsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-DEFAULT mr-3"></div>
                          <p className="text-sm text-gold-100/60">
                            Loading applications...
                          </p>
                        </div>
                      ) : applicationsError ? (
                        <div className="flex items-center justify-center py-8 text-red-400">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          <p className="text-sm">{applicationsError}</p>
                        </div>
                      ) : appsForRequest.length === 0 ? (
                        <div className="text-center py-8">
                          <UserCircle className="w-10 h-10 mx-auto mb-3 text-gold-100/20" />
                          <p className="text-sm text-gold-100/50">
                            No applications received yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {appsForRequest.map((app) => (
                            <div
                              key={app.id}
                              className="flex items-start justify-between rounded-xl bg-navy-900 border border-gold-300/5 p-4 hover:border-gold-300/15 transition-colors"
                            >
                              <div className="flex items-start gap-4">
                                {(app as any).carer?.profilePhotoUrl ||
                                (app as any).carerProfile?.profilePhotoUrl ? (
                                  <img
                                    src={
                                      (app as any).carer?.profilePhotoUrl ||
                                      (app as any).carerProfile?.profilePhotoUrl
                                    }
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover border border-gold-300/20"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-navy-800 border border-gold-300/10 flex items-center justify-center shrink-0">
                                    <UserCircle className="w-6 h-6 text-gold-100/30" />
                                  </div>
                                )}
                                <div>
                                  <h5 className="text-sm font-bold text-gold-100">
                                    {(app as any).carer?.firstName ||
                                      (app as any).carerProfile?.user
                                        ?.firstName ||
                                      "Carer"}{" "}
                                    {(app as any).carer?.lastName ||
                                      (app as any).carerProfile?.user
                                        ?.lastName ||
                                      ""}
                                  </h5>
                                  {(() => {
                                    const carerProfileId =
                                      app.carerProfileId ||
                                      (app as any).carerProfile?.id;
                                    const isFromInterestList =
                                      interestList?.some(
                                        (carer: any) =>
                                          carer.id === carerProfileId,
                                      );
                                    if (
                                      isFromInterestList &&
                                      app.isAssignedByAdmin
                                    ) {
                                      return (
                                        <div className="mt-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                                          Selected by admin from interest list
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                  {((app as any).carer?.experienceYears !==
                                    undefined ||
                                    (app as any).carerProfile
                                      ?.experienceYears !== undefined) && (
                                    <p className="text-xs text-gold-100/70 mt-0.5">
                                      {(app as any).carer?.experienceYears ??
                                        (app as any).carerProfile
                                          ?.experienceYears}{" "}
                                      Years Experience
                                    </p>
                                  )}
                                  <p className="text-xs text-gold-100/50 mt-1 line-clamp-2 italic">
                                    {(app as any).carer?.bio ||
                                    (app as any).carerProfile?.bio
                                      ? `"${(app as any).carer?.bio || (app as any).carerProfile?.bio}"`
                                      : "No bio provided."}
                                  </p>

                                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gold-100/40">
                                    <span>
                                      Applied: {formatDate(app.createdAt)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                        app.status === "PENDING"
                                          ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                          : app.status === "SHORTLISTED"
                                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            : app.status === "ACCEPTED" ||
                                                app.status === "APPROVED"
                                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                                      }`}
                                    >
                                      {app.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 shrink-0">
                                <Button
                                  variant="ghost-gold"
                                  size="sm"
                                  fullWidth={false}
                                  onClick={() => {
                                    router.push(
                                      `/client/carers/${app.carerProfileId}`,
                                    );
                                  }}
                                >
                                  View Profile
                                </Button>

                                {app.status === "PENDING" &&
                                  req.status !== "CARER_SELECTED" && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <button
                                        onClick={() => setRejectAppId(app.id)}
                                        disabled={isSubmitting === app.id}
                                        className="flex-1 px-4 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={() => handleApprove(app.id)}
                                        disabled={isSubmitting === app.id}
                                        className="flex-1 px-6 py-1.5 rounded-xl bg-gold text-navy-950 font-bold text-[10px] hover:bg-gold-200 transition-all shadow-elegant cursor-pointer flex items-center justify-center"
                                      >
                                        {isSubmitting === app.id
                                          ? "..."
                                          : "Approve"}
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {rejectAppId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setRejectAppId(null)}
          />
          <div className="relative bg-navy-900 border border-gold-300/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gold-200 mb-2">
                Reject Application
              </h3>
              <p className="text-sm text-gold-100/60 mb-6">
                Please provide a reason for rejecting this application. This
                helps us find better matches in the future.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter your reason here..."
                className="w-full bg-navy-950 border border-gold-300/20 rounded-xl p-3 text-gold-100 focus:outline-none focus:border-gold/50 h-32 resize-none text-sm"
              />
            </div>
            <div className="px-6 py-4 bg-navy-950/50 border-t border-gold-300/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectAppId(null)}
                className="px-4 py-2 text-xs font-bold text-gold-100/60 hover:text-gold-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting === "reject" || !rejectReason.trim()}
                className="px-6 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting === "reject"
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
