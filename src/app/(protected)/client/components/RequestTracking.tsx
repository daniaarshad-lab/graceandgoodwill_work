import { useEffect, useState } from "react";
import SectionCard from "./shared/SectionCard";
import { ClientPlacement } from "@/types/client.types";
import { User, Calendar, AlertTriangle, RefreshCw, PlusCircle, Shield, Award, CheckCircle2 } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientFeedbacks } from "@/store/slices/clientSlice";

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
  const dispatch = useAppDispatch();
  const { feedbacks } = useAppSelector((state) => state.client);
  const [feedbackPlacement, setFeedbackPlacement] = useState<{ id: string; carerName: string } | null>(null);

  useEffect(() => {
    dispatch(fetchClientFeedbacks());
  }, [dispatch]);

  const getStatusBadgeStyles = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    switch (cleanStatus) {
      case "ACTIVE":
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
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
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 space-y-6 animate-pulse">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/5 pb-4">
                <div className="space-y-2">
                  <div className="h-3 w-32 bg-gold-300/10 rounded" />
                  <div className="h-6 w-48 bg-gold-300/10 rounded" />
                </div>
                <div className="h-8 w-24 bg-gold-300/10 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-navy-950/40 border border-gold-300/5">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-2 w-16 bg-gold-300/5 rounded" />
                    <div className="h-4 w-24 bg-gold-300/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-400">Unable to load placement requests.</h4>
            <p className="text-xs text-rose-400/60">Please check your connection and try again.</p>
          </div>
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:bg-gold-200 transition duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : placements.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/60 shadow-soft backdrop-blur-md max-w-xl mx-auto space-y-6">
          <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <Shield className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-gold-200">No Active Placement Requests</h4>
            <p className="text-sm text-gold-100/60 leading-relaxed">
              You do not currently have any active placement requests. Submit a care request to begin matching with suitable carers.
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
        <div className="space-y-6">
          {placements.map((place) => (
            <SectionCard key={place.id} className="space-y-5">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/5 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-300/50 font-bold font-mono">
                    Ref ID: {place.id}
                  </span>
                  <h4 className="text-lg font-bold text-gold-200 mt-0.5">
                    {place.careRequest?.careCategory || (place.carerProfile as any)?.careTypes?.[0] || "General Care"}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gold-100/50">
                    Commenced: {new Date(place.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(place.status)}`}>
                    {place.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-navy-950/40 border border-gold-300/5 text-xs">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Client Name</span>
                  <span className="text-gold-200 font-bold">
                    {place.careRequest?.requestorName || "You"}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Assigned Carer</span>
                  <span className="text-gold-200 font-bold flex items-center gap-1 truncate" title={place.carerProfile?.user ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName}` : "Not Assigned"}>
                    <User className="h-3.5 w-3.5 text-gold/60 shrink-0" />
                    <span className="truncate">
                      {place.carerProfile?.user
                        ? `${place.carerProfile.user.firstName} ${place.carerProfile.user.lastName}`
                        : "Not Assigned"}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Duration</span>
                  <span className="text-gold-200 font-bold">
                    {place.careRequest?.duration || "Flexible"}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Created Date</span>
                  <span className="text-gold-200 font-bold">
                    {new Date(place.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {place.status === "COMPLETED" && (
                <div className="pt-4 border-t border-gold-300/10 flex justify-end">
                  {feedbacks.some((f) => f.placement?.id === place.id) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Feedback Submitted
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
                      className="px-4 py-2 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy-950 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Leave Feedback
                    </button>
                  )}
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}

      {feedbackPlacement && (
        <FeedbackModal
          placementId={feedbackPlacement.id}
          carerName={feedbackPlacement.carerName}
          onClose={() => setFeedbackPlacement(null)}
          onSuccess={() => {
            // we could fetch placements here, but we also manually set it in slice.
          }}
        />
      )}
    </div>
  );
}
