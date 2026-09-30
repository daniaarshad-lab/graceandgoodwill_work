"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientPlacement } from "@/types/client.types";
import {
  User,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Shield,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchClientFeedbacks,
  fetchClientCareRequestApplications,
} from "@/store/slices/clientSlice";
import PlacementDetailModal from "./PlacementDetailModal";
import ThinSpinner from "@/components/ThinSpinner";

interface RequestTrackingProps {
  placements: ClientPlacement[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  setActiveTab: (tab: any) => void;
}

export default function RequestTracking({
  placements,
  loading,
  error,
  onRetry,
  setActiveTab,
}: RequestTrackingProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { feedbacks, careRequests, applications, applicationsLoading } =
    useAppSelector((state) => state.client);
  const [feedbackPlacement, setFeedbackPlacement] = useState<{
    id: string;
    carerName: string;
  } | null>(null);
  const [detailPlacementId, setDetailPlacementId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchClientFeedbacks());
    if (careRequests?.length) {
      careRequests.forEach((cr) => {
        dispatch(fetchClientCareRequestApplications(cr.id));
      });
    }
  }, [dispatch, careRequests]);

  const getStatusBadgeStyles = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    switch (cleanStatus) {
      case "ACTIVE":
      case "APPROVED":
      case "PLACEMENT_CONFIRMED":
      case "CARER_SELECTED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "PENDING_ACCEPTANCE":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse";
      case "REJECTED_BY_CARER":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold";
      case "UNDER_REVIEW":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/20";
      case "COMPLETED":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "CANCELLED":
      case "TERMINATED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "PENDING":
      case "MATCHING":
      case "REVIEWING":
      default:
        return "bg-gold/10 text-gold border border-gold/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "REJECTED_BY_CARER":
        return "Rejected by Current Assigned Carer (Re-assignment Needed)";
      case "PENDING_ACCEPTANCE":
        return "Pending Carer Acceptance";
      case "PLACEMENT_CONFIRMED":
        return "Carer Confirmed";
      case "UNDER_REVIEW":
        return "Under Review";
      case "CARER_SELECTED":
        return "Carer Selected";
      default:
        return status?.replace(/_/g, " ") || "Pending";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Care Placement Progress
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Track requirements review and carer pairing processes in real time.
        </p>
      </div>

      {/* States */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <ThinSpinner size="xl" text="Loading placement progress..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-400">
              Unable to load placement requests.
            </h4>
            <p className="text-xs text-rose-400/60">
              Please check your connection and try again.
            </p>
          </div>
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:bg-gold-200 transition duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : placements.length === 0 &&
        (!careRequests?.length ||
          Object.values(applications).flat().length === 0) ? (
        <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/60 shadow-soft backdrop-blur-md max-w-xl mx-auto space-y-6">
          <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <Shield className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-gold-200">
              No Active Placement Requests
            </h4>
            <p className="text-sm text-gold-100/60 leading-relaxed">
              You do not currently have any active placement requests or pending
              applications. Submit a care request to begin matching with
              suitable carers.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("request")}
            className="px-6 py-3 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:bg-gold-200 transition duration-300 flex items-center gap-2 shadow-elegant cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" /> Submit Care Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {placements.length > 0 && (
            <h4 className="text-base font-bold text-gold-200">
              Active Placements
            </h4>
          )}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-placement-scroll">
            <style>{`
              .custom-placement-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .custom-placement-scroll::-webkit-scrollbar-track {
                background: rgba(15, 23, 42, 0.4);
                border-radius: 4px;
              }
              .custom-placement-scroll::-webkit-scrollbar-thumb {
                background: rgba(212, 175, 55, 0.2);
                border-radius: 4px;
              }
              .custom-placement-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(212, 175, 55, 0.4);
              }
            `}</style>
            {placements.map((place) => {
              const isRejected = place.status === "REJECTED_BY_CARER";
              const isPending = place.status === "PENDING_ACCEPTANCE";

              return (
                <div
                  key={place.id}
                  className={`rounded-xl border p-5 shadow-sm backdrop-blur-md transition-all duration-300 space-y-4 ${
                    isRejected
                      ? "border-rose-500/30 bg-navy-900/80 shadow-rose-950/20"
                      : isPending
                        ? "border-amber-500/30 bg-navy-900/70"
                        : "border-gold-300/10 bg-navy-900/60 hover:border-gold-300/20"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4
                        className="text-base font-bold text-gold-200 truncate"
                        title={
                          place.careRequest?.careCategory ||
                          (place.carerProfile as any)?.careTypes?.[0] ||
                          "General Care"
                        }
                      >
                        {place.careRequest?.careCategory ||
                          (place.carerProfile as any)?.careTypes?.[0] ||
                          "General Care"}
                      </h4>
                      <span className="text-[10px] text-gold-100/50 mt-1 block">
                        Commenced:{" "}
                        {new Date(place.startDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 mt-2 sm:mt-0">
                      <span
                        className={`rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusBadgeStyles(place.status)}`}
                      >
                        {getStatusLabel(place.status)}
                      </span>
                      <button
                        onClick={() => router.push(`/placement/${place.id}`)}
                        className="px-3 py-1 rounded bg-navy-950/60 text-gold-200 border border-gold-300/20 hover:bg-gold-300/10 text-[9px] font-bold uppercase tracking-wider transition-all"
                      >
                        View Details & Invoices
                      </button>
                    </div>
                  </div>

                  {/* Rejection Alert Banner */}
                  {isRejected && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs">
                      <div className="flex items-start gap-2.5 text-rose-200">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-rose-300">
                            Rejected by Current Assigned Carer {place.carerProfile?.user ? `(${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName})` : ""}
                          </p>
                          <p className="text-[11px] text-rose-300/80">
                            {place.rejectionReason ? `Reason: "${place.rejectionReason}" — ` : ""}
                            Re-assignment needed. Please select an alternative carer from your interest list or applicant pool.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => setActiveTab("applications")}
                          className="px-3 py-1.5 rounded-lg bg-navy-950 text-gold-200 border border-gold-300/20 hover:bg-gold-300/10 text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pending Acceptance Info Banner */}
                  {isPending && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                      <span>
                        Placement offer sent to Carer <strong>{place.carerProfile?.user?.firstName} {place.carerProfile?.user?.lastName}</strong>. Awaiting carer acceptance.
                      </span>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-navy-950/40 border border-gold-300/5 text-[10px]">
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-0.5 text-[8px]">
                        Client Name
                      </span>
                      <span
                        className="text-gold-200 font-bold truncate block"
                        title={
                          place.careRequest?.requestorName &&
                          !place.careRequest.requestorName.toLowerCase().includes("none")
                            ? place.careRequest.requestorName
                            : "You"
                        }
                      >
                        {place.careRequest?.requestorName &&
                        !place.careRequest.requestorName.toLowerCase().includes("none")
                          ? place.careRequest.requestorName
                          : "You"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-0.5 text-[8px]">
                        Assigned Carer
                      </span>
                      {isRejected ? (
                        <span
                          className="text-rose-400 font-bold flex items-center gap-1 truncate"
                          title={
                            place.carerProfile?.user
                              ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName} (Declined)`
                              : "Declined by Carer"
                          }
                        >
                          <XCircle className="h-3 w-3 text-rose-400 shrink-0" />
                          <span className="truncate">
                            {place.carerProfile?.user
                              ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName} (Declined)`
                              : "Declined"}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="text-gold-200 font-bold flex items-center gap-1 truncate"
                          title={
                            place.carerProfile?.user
                              ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName}`
                              : "Not Assigned"
                          }
                        >
                          <User className="h-3 w-3 text-gold/60 shrink-0" />
                          <span className="truncate">
                            {place.carerProfile?.user
                              ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName}`
                              : "Not Assigned"}
                          </span>
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-0.5 text-[8px]">
                        Duration
                      </span>
                      <span
                        className="text-gold-200 font-bold truncate block"
                        title={place.careRequest?.duration || "Flexible"}
                      >
                        {place.careRequest?.duration || "Flexible"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-0.5 text-[8px]">
                        Created Date
                      </span>
                      <span className="text-gold-200 font-bold">
                        {new Date(place.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {place.status === "COMPLETED" && (
                    <div className="pt-2 border-t border-gold-300/5 flex justify-end">
                      {feedbacks.some((f) => f.placement?.id === place.id) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider cursor-not-allowed">
                          <CheckCircle2 className="w-3 h-3" /> Feedback Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setFeedbackPlacement({
                              id: place.id,
                              carerName: place.carerProfile?.user
                                ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName}`
                                : "Your Carer",
                            })
                          }
                          className="px-3 py-1 rounded bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy-950 text-[9px] font-bold uppercase tracking-wider transition-all"
                        >
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {feedbackPlacement && (
        <FeedbackModal
          placementId={feedbackPlacement.id}
          carerName={feedbackPlacement.carerName}
          onClose={() => setFeedbackPlacement(null)}
          onSuccess={() => {
            dispatch(fetchClientFeedbacks());
            setFeedbackPlacement(null);
          }}
        />
      )}

      {detailPlacementId && (
        <PlacementDetailModal
          placementId={detailPlacementId}
          onClose={() => setDetailPlacementId(null)}
        />
      )}
    </div>
  );
}
