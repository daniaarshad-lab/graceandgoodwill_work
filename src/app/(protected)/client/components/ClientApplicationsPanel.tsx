"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCareRequests,
  fetchClientCareRequestApplications,
  approveApplication,
  rejectApplication,
  clearApplications,
  fetchInterestList,
} from "@/store/slices/clientSlice";
import { backupCarerService } from "@/services/backupCarer.service";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import SelectBackupCarerModal from "@/components/backup-carer/SelectBackupCarerModal";
import PlacementDetailModal from "./PlacementDetailModal";
import {
  Calendar,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Shield,
  CheckCircle2,
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

  // Backup Carer & Placement modals
  const [selectedPlacementForBackup, setSelectedPlacementForBackup] = useState<{
    placementId: string;
    clientName: string;
  } | null>(null);
  const [activePlacementModalId, setActivePlacementModalId] = useState<string | null>(null);

  const handleApprove = async (appId: string) => {
    setIsSubmitting(appId);
    try {
      await dispatch(approveApplication(appId)).unwrap();
      showSuccessToast(
        "Application Approved",
        "Primary carer selected successfully. You can now also select a preferred backup carer.",
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
        rejectApplication({
          applicationId: rejectAppId,
          reason: rejectReason.trim(),
        }),
      ).unwrap();
      showSuccessToast(
        "Application Rejected",
        "The applicant has been notified.",
      );
      setRejectAppId(null);
      setRejectReason("");
      if (selectedRequestId) {
        dispatch(fetchClientCareRequestApplications(selectedRequestId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleDesignateBackupFromApp = async (
    carerProfileId: string,
    carerName: string,
    placementOrRequestId: string,
  ) => {
    try {
      await backupCarerService.designatePreferredBackup(
        placementOrRequestId,
        carerProfileId,
      );
      showSuccessToast(
        "Preferred Backup Carer Designated!",
        `${carerName} is now designated as your Preferred Backup Carer.`,
      );
      if (selectedRequestId) {
        dispatch(fetchClientCareRequestApplications(selectedRequestId));
      }
    } catch (err: any) {
      showErrorToast("Action Failed", err.message || "Failed to designate backup carer.");
    }
  };

  useEffect(() => {
    dispatch(fetchCareRequests());
    dispatch(fetchInterestList());
  }, [dispatch]);

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
      <div className="py-20 flex items-center justify-center">
        <ThinSpinner size="xl" text="Loading care requests..." />
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
            <p className="text-xs text-gold-100/50 mt-1 leading-relaxed">
              View the status of your care requests, review and select primary carers, and designate your Preferred Backup Carer.
            </p>
          </div>
          <Button
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
            onClick={() => {
              dispatch(fetchCareRequests());
              if (selectedRequestId) {
                dispatch(fetchClientCareRequestApplications(selectedRequestId));
              }
            }}
          >
            Refresh
          </Button>
        </div>

        {clientManagedRequests.length === 0 ? (
          <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-12 text-center text-gold-100/50">
            <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold-300" />
            <p className="text-sm font-semibold text-gold-100/70">
              No active care requests found.
            </p>
            <p className="text-xs mt-1">
              Create a care request to begin receiving and reviewing carer applications.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientManagedRequests.map((req) => (
              <div
                key={req.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  selectedRequestId === req.id
                    ? "border-gold-300/30 bg-navy-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    : "border-gold-300/10 bg-navy-900/40 hover:border-gold-300/20 hover:bg-navy-900/60"
                }`}
              >
                {/* Request Header */}
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => handleSelectRequest(req.id)}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gold-200 break-words leading-tight">
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
                              : req.status === "CARER_SELECTED"
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
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

                  <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto shrink-0">
                    {/* View Placement Button */}
                    {(req.status === "CARER_SELECTED" || (req as any).placement) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const pId = (req as any).placement?.id || req.id;
                          setActivePlacementModalId(pId);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                        title="View multi-carer arrangement (Primary, Backup, Relief)"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Placement</span>
                      </button>
                    )}

                    {/* Choose / Change Backup Carer Direct Action */}
                    {(req.status === "CARER_SELECTED" || (req as any).placement) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlacementForBackup({
                            placementId: (req as any).placement?.id || req.id,
                            clientName: req.requestorName || "Your Placement",
                          });
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                        title="Designate or change Preferred Backup Carer"
                      >
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">Select Backup Carer</span>
                        <span className="sm:hidden">Backup</span>
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
                      const hasSelectedCarer = appsForRequest.some(
                        (a: any) =>
                          a.status === "SELECTED" ||
                          a.status === "APPROVED" ||
                          a.status === "ACCEPTED" ||
                          a.isAccepted,
                      );

                      return applicationsLoading ? (
                        <div className="py-8 flex justify-center">
                          <ThinSpinner size="md" text="Loading applications..." />
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
                          {appsForRequest.map((app) => {
                            const appAny = app as any;
                            const isAccepted = Boolean(
                              appAny.isAccepted ||
                              appAny.placementStatus === "PLACEMENT_CONFIRMED" ||
                              appAny.placementStatus === "ACTIVE" ||
                              appAny.placementStatus === "ONGOING"
                            );
                            const carerName = `${appAny.carer?.firstName || "Carer"} ${appAny.carer?.lastName || ""}`.trim();

                            return (
                              <div
                                key={app.id}
                                className={`flex items-start justify-between rounded-xl bg-navy-900 border p-4 transition-colors ${
                                  app.status === "SELECTED"
                                    ? "border-emerald-500/30 bg-emerald-950/10"
                                    : "border-gold-300/5 hover:border-gold-300/15"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  {appAny.carer?.profilePhotoUrl ||
                                  appAny.carerProfile?.profilePhotoUrl ? (
                                    <img
                                      src={
                                        appAny.carer?.profilePhotoUrl ||
                                        appAny.carerProfile?.profilePhotoUrl
                                      }
                                      alt="Carer"
                                      className="w-12 h-12 rounded-full object-cover border border-gold-300/20 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shrink-0 font-bold">
                                      {(appAny.carer?.firstName || "C")[0]}
                                    </div>
                                  )}
                                  <div>
                                    <h5 className="font-bold text-gold-100">
                                      {carerName}
                                    </h5>
                                    {app.isAssignedByAdmin && (
                                      <div className="mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                                        Selected by Admin
                                      </div>
                                    )}
                                    <p className="text-xs text-gold-100/60 mt-1">
                                      {appAny.carer?.experienceYears
                                        ? `${appAny.carer.experienceYears} Years Experience`
                                        : "Experience not specified"}
                                    </p>
                                    <p className="text-xs text-gold-100/40 line-clamp-1 italic mt-0.5">
                                      {appAny.carer?.bio || "No bio provided."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-gold-100/40">
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
                                                  app.status === "APPROVED" ||
                                                  app.status === "SELECTED"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}
                                      >
                                        {app.status}
                                      </span>
                                      {/* Accurate Acceptance Badge */}
                                      {app.status === "SELECTED" && (
                                        isAccepted ? (
                                          <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Offer Accepted • Primary Carer
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px] flex items-center gap-1">
                                            Waiting for Carer Acceptance
                                          </span>
                                        )
                                      )}
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

                                  {/* Direct "Set as Backup Carer" Button for Other Applicants */}
                                  {hasSelectedCarer && app.status !== "SELECTED" && app.status !== "REJECTED" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      fullWidth={false}
                                      onClick={() =>
                                        handleDesignateBackupFromApp(
                                          app.carerProfileId,
                                          carerName,
                                          (req as any).placement?.id || req.id,
                                        )
                                      }
                                      className="!border-cyan-500/30 !text-cyan-300 hover:!bg-cyan-500/10 text-xs flex items-center gap-1"
                                      title="Designate this applicant as your Preferred Backup Carer"
                                    >
                                      <Shield className="w-3 h-3 text-cyan-400" />
                                      Set as Backup
                                    </Button>
                                  )}

                                  {app.status === "PENDING" && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <button
                                        onClick={() => setRejectAppId(app.id)}
                                        disabled={isSubmitting === app.id}
                                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                      <button
                                        onClick={() => handleApprove(app.id)}
                                        disabled={
                                          isSubmitting === app.id ||
                                          hasSelectedCarer
                                        }
                                        title={
                                          hasSelectedCarer
                                            ? "A carer is already selected. You can set other applicants as a Backup Carer."
                                            : "Approve application as primary carer"
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                          hasSelectedCarer
                                            ? "bg-navy-950/60 text-gold-100/30 border border-gold-300/10 cursor-not-allowed opacity-50"
                                            : "bg-gold text-navy-950 hover:bg-gold-200 cursor-pointer"
                                        }`}
                                      >
                                        {isSubmitting === app.id
                                          ? "..."
                                          : "Approve"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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

      {/* Select Backup Carer Modal */}
      {selectedPlacementForBackup && (
        <SelectBackupCarerModal
          placementId={selectedPlacementForBackup.placementId}
          clientName={selectedPlacementForBackup.clientName}
          isOpen={true}
          onClose={() => setSelectedPlacementForBackup(null)}
          onBackupSelected={(carer) => {
            showSuccessToast(
              "Preferred Backup Carer Selected!",
              `${carer.name} is now designated as your Preferred Backup Carer.`,
            );
            dispatch(fetchCareRequests());
            if (selectedRequestId) {
              dispatch(fetchClientCareRequestApplications(selectedRequestId));
            }
          }}
        />
      )}

      {/* View Placement Details Modal */}
      {activePlacementModalId && (
        <PlacementDetailModal
          placementId={activePlacementModalId}
          onClose={() => setActivePlacementModalId(null)}
        />
      )}

      {/* Reject Application Modal */}
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
                Please provide a reason for rejecting this application. This helps us find better matches in the future.
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
