"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarerCareRequests,
  fetchCarerCareRequestById,
  applyToCarerCareRequest,
  clearSelectedCareRequest,
  fetchCarerApplications,
} from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Button from "@/components/Button";
import {
  MapPin,
  Calendar,
  Clock,
  Banknote,
  Briefcase,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import PlacementDetailModal from "./PlacementDetailModal";
import ThinSpinner from "@/components/ThinSpinner";

export default function PlacementOpportunities() {
  const dispatch = useAppDispatch();
  const {
    careRequests,
    careRequestsLoading,
    careRequestsError,
    selectedCareRequest,
    selectedCareRequestLoading,
    applyingToCareRequest,
    applications,
  } = useAppSelector((state) => state.carer);

  const [viewingDetailId, setViewingDetailId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCarerCareRequests());
    dispatch(fetchCarerApplications());
  }, [dispatch]);

  const handleViewDetails = (id: string) => {
    setViewingDetailId(id);
    dispatch(fetchCarerCareRequestById(id));
  };

  const handleCloseDetail = () => {
    setViewingDetailId(null);
    dispatch(clearSelectedCareRequest());
  };

  const handleApply = async (careRequestId: string) => {
    try {
      await dispatch(applyToCarerCareRequest(careRequestId)).unwrap();
      showSuccessToast(
        "Application Submitted",
        "Your application has been submitted. You will be notified when there is an update.",
      );
    } catch (err: any) {
      showErrorToast(
        "Application Failed",
        err?.message || "Failed to submit application.",
      );
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

  const formatPayRange = (
    range?: string | { min: number; max: number } | null,
  ) => {
    if (!range) return "Not specified";
    if (typeof range === "string") return range;
    return `£${range.min?.toLocaleString() || 0} – £${range.max?.toLocaleString() || 0} / week`;
  };

  if (careRequestsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ThinSpinner size="lg" text="Loading placement opportunities..." />
      </div>
    );
  }

  if (careRequestsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-sm text-red-400">{careRequestsError}</p>
        <Button
          variant="ghost-gold"
          size="sm"
          fullWidth={false}
          onClick={() => dispatch(fetchCarerCareRequests())}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Placement Opportunities
          </h3>
          <p className="text-xs text-gold-100/50 mt-1">
            Browse available care requests and apply for placements that match
            your skills and availability.
          </p>
        </div>
        <Button
          variant="ghost-gold"
          size="sm"
          fullWidth={false}
          onClick={() => dispatch(fetchCarerCareRequests())}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {careRequests.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-medium">
            No placement opportunities available at the moment.
          </p>
          <p className="text-xs mt-1 opacity-60">
            Check back regularly for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {careRequests.map((req) => {
            const hasApplied =
              applications?.some((app: any) => app.careRequestId === req.id) ||
              false;

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-gold-300/15 bg-navy-900/60 p-5 space-y-4 hover:border-gold-300/30 hover:bg-navy-900/80 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-gold-200">
                      {req.careCategory || "Care Placement"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gold-100/50">
                      <MapPin className="w-3 h-3" />
                      <span>{req.city || req.address || "Location TBC"}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {req.isOngoing && (
                      <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        Ongoing
                      </span>
                    )}
                    {req.isEmergency && (
                      <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-gold-100/60">
                    <Calendar className="w-3.5 h-3.5 text-gold-200/40" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-gold-100/40">
                        Start Date
                      </span>
                      <span className="text-gold-200 font-medium">
                        {formatDate(req.startDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gold-100/60">
                    <Clock className="w-3.5 h-3.5 text-gold-200/40" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-gold-100/40">
                        Duration
                      </span>
                      <span className="text-gold-200 font-medium">
                        {req.duration || "—"}
                      </span>
                    </div>
                  </div>

                  {req.endDate && (
                    <div className="flex items-center gap-1.5 text-gold-100/60">
                      <Calendar className="w-3.5 h-3.5 text-gold-200/40" />
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-gold-100/40">
                          End Date
                        </span>
                        <span className="text-gold-200 font-medium">
                          {formatDate(req.endDate)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-gold-100/60">
                    <Banknote className="w-3.5 h-3.5 text-gold-200/40" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-gold-100/40">
                        Weekly Pay
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {formatPayRange(req.weeklyPayRange)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Care Requirements */}
                {req.requirements && (
                  <div className="rounded-xl bg-navy-950/60 border border-gold-300/5 p-3">
                    <span className="text-[10px] uppercase tracking-wider text-gold-100/40 font-semibold">
                      Care Requirements
                    </span>
                    <p className="text-xs text-gold-100/70 mt-1 line-clamp-2 leading-relaxed">
                      {req.requirements}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="ghost-gold"
                    size="sm"
                    fullWidth
                    onClick={() => handleViewDetails(req.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    disabled={hasApplied || applyingToCareRequest}
                    onClick={() => handleApply(req.id)}
                  >
                    {hasApplied ? "Applied ✓" : "Apply Now"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {viewingDetailId && (
        <PlacementDetailModal
          careRequest={selectedCareRequest}
          loading={selectedCareRequestLoading}
          applying={applyingToCareRequest}
          hasApplied={applications.some(
            (app) => app.careRequestId === viewingDetailId,
          )}
          onClose={handleCloseDetail}
          onApply={() => handleApply(viewingDetailId)}
        />
      )}
    </div>
  );
}
