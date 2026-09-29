"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarerApplications } from "@/store/slices/carerSlice";
import { carerService } from "@/services/carer/carer.service";
import Button from "@/components/Button";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  RefreshCw,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import ThinSpinner from "@/components/ThinSpinner";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

type FilterStatus = "ALL" | "PENDING" | "SELECTED" | "WITHDRAWN" | "REJECTED";

export default function MyApplications() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { applications, applicationsLoading, error } = useAppSelector(
    (state) => state.carer,
  );

  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCarerApplications());
  }, [dispatch]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDurationDisplay = (req: any) => {
    if (!req) return "Standard Duration";
    if (req.duration && req.duration !== "Standard Duration") {
      return req.duration;
    }
    if (req.startDate && req.endDate) {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.round(diffDays / 7);
      if (diffDays >= 7) {
        return `${weeks} ${weeks === 1 ? "Week" : "Weeks"} (${diffDays} Days)`;
      }
      return `${diffDays} Days`;
    }
    if (req.isOngoing || req.durationCategory === "PERMANENT") {
      return "Ongoing / Permanent Care";
    }
    return "Ongoing Placement";
  };

  const handleAcceptOffer = async (app: any) => {
    setAcceptingId(app.id);
    try {
      // Find associated placement ID or call acceptPlacement
      const placementId = app.careRequest?.placement?.id || app.placementId || app.careRequestId;
      await carerService.acceptPlacement(placementId);
      showSuccessToast(
        "Offer Accepted!",
        "Congratulations! Your care placement is confirmed.",
      );
      dispatch(fetchCarerApplications());
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept offer.");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDeclineOffer = async (app: any) => {
    const reason = window.prompt("Please state the reason for declining this placement offer:") || "Unavailable";
    setDecliningId(app.id);
    try {
      const placementId = app.careRequest?.placement?.id || app.placementId || app.careRequestId;
      await carerService.rejectPlacement(placementId, reason);
      showSuccessToast("Offer Declined", "The care placement offer has been declined.");
      dispatch(fetchCarerApplications());
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to decline offer.");
    } finally {
      setDecliningId(null);
    }
  };

  const checkIsAccepted = (app: any) => {
    return Boolean(
      app.isAccepted ||
      app.placementStatus === "PLACEMENT_CONFIRMED" ||
      app.placementStatus === "PLACEMENT_STARTED" ||
      app.placementStatus === "ONGOING" ||
      app.placementStatus === "COMPLETED" ||
      (app.careRequest?.placement && (
        app.careRequest.placement.acceptedAt ||
        ["PLACEMENT_CONFIRMED", "PLACEMENT_STARTED", "ONGOING", "COMPLETED"].includes(
          app.careRequest.placement.status,
        )
      )),
    );
  };

  const getStatusBadge = (app: any) => {
    const s = app?.status?.toUpperCase() || "PENDING";
    const isAccepted = checkIsAccepted(app);

    if (s === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
          <Clock className="w-3 h-3" />
          Applied (Pending Review)
        </span>
      );
    }
    if (s === "SELECTED") {
      if (isAccepted) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Offer Accepted
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Selected • Offer Awaiting Acceptance
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    if (s === "WITHDRAWN") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-400 border border-gray-500/20">
          Withdrawn
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-400 border border-gold-500/20">
        {s}
      </span>
    );
  };

  // Counts for all statuses
  const counts = useMemo(() => {
    const res = { ALL: applications.length, PENDING: 0, SELECTED: 0, WITHDRAWN: 0, REJECTED: 0 };
    applications.forEach((app) => {
      const s = app.status?.toUpperCase();
      if (s === "PENDING") res.PENDING++;
      else if (s === "SELECTED") res.SELECTED++;
      else if (s === "WITHDRAWN") res.WITHDRAWN++;
      else if (s === "REJECTED") res.REJECTED++;
    });
    return res;
  }, [applications]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    if (activeFilter === "ALL") return applications;
    return applications.filter(
      (app) => app.status?.toUpperCase() === activeFilter,
    );
  }, [applications, activeFilter]);

  if (applicationsLoading && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ThinSpinner size="lg" text="Loading your applications..." />
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <Button
          variant="ghost-gold"
          size="sm"
          fullWidth={false}
          onClick={() => dispatch(fetchCarerApplications())}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">My Applications</h3>
          <p className="text-xs text-gold-100/50 mt-1">
            Track all submitted applications, placement offers awaiting response, and past outcomes.
          </p>
        </div>
        <Button
          variant="ghost-gold"
          size="sm"
          fullWidth={false}
          onClick={() => dispatch(fetchCarerApplications())}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gold-300/10 pb-2">
        {(
          [
            { id: "ALL", label: `All (${counts.ALL})` },
            { id: "PENDING", label: `Applied (${counts.PENDING})` },
            { id: "SELECTED", label: `Selected / Offers (${counts.SELECTED})` },
            { id: "WITHDRAWN", label: `Withdrawn (${counts.WITHDRAWN})` },
            { id: "REJECTED", label: `Rejected (${counts.REJECTED})` },
          ] as const
        ).map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/40 shadow-sm"
                  : "text-gold-100/60 hover:text-gold-200 hover:bg-navy-900 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50 bg-navy-900/20">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-40 text-gold-300" />
          <p className="text-sm font-medium">
            {activeFilter === "ALL"
              ? "You haven't submitted any applications yet."
              : `No applications with status "${activeFilter.toLowerCase()}".`}
          </p>
          <p className="text-xs mt-1 opacity-60">
            Check the Placement Opportunities tab to apply for open care positions.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredApplications.map((app) => {
            const req = app.careRequest;
            if (!req) return null;
            const isSelectedOffer = app.status?.toUpperCase() === "SELECTED";
            const isAccepted = checkIsAccepted(app);
            const durationText = getDurationDisplay(req);

            return (
              <div
                key={app.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                  isSelectedOffer
                    ? isAccepted
                      ? "border-emerald-500/40 bg-gradient-to-br from-navy-900 via-emerald-950/20 to-navy-950 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/20"
                      : "border-emerald-500/40 bg-gradient-to-br from-navy-900 via-emerald-950/20 to-navy-950 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/20"
                    : "border-gold-300/10 bg-navy-900/50 hover:border-gold-300/30 hover:bg-navy-800 hover:shadow-xl"
                }`}
              >
                {/* Offer Action Banner */}
                {isSelectedOffer && (
                  <div
                    className={`mb-3.5 -mx-5 -mt-5 border-b px-5 py-2.5 flex items-center justify-between ${
                      isAccepted
                        ? "bg-emerald-500/15 border-emerald-500/30"
                        : "bg-emerald-500/20 border-emerald-500/30"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      {isAccepted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirmed Placement
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" /> Placement Offer
                        </>
                      )}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isAccepted
                          ? "text-emerald-300 bg-emerald-500/25 border-emerald-400/40"
                          : "text-white bg-emerald-600/60 border-emerald-400/40"
                      }`}
                    >
                      {isAccepted ? "Offer Accepted" : "Action Required"}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category and Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {req.careCategory && Array.isArray(req.careCategory) ? (
                        req.careCategory.map((cat: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-gold-950/40 px-2 py-0.5 text-xs font-semibold text-gold-200 border border-gold-300/20"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-gold-950/40 px-2 py-0.5 text-xs font-semibold text-gold-200 border border-gold-300/20">
                          {req.careCategory || "General Care"}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(app)}
                  </div>

                  {/* Role Offered Pill */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-navy-950/70 border border-gold-300/10 text-xs">
                    <Shield className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-gold-100/60 text-[11px] uppercase tracking-wider font-semibold">
                      Role:
                    </span>
                    <span className="font-bold text-gold-200">
                      Primary Carer
                    </span>
                  </div>

                  {/* Core Details Grid */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-gold-100/80">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                      <span className="leading-tight">
                        {req.city || "Location not specified"}
                        {req.postcode && `, ${req.postcode.split(" ")[0]}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gold-100/80">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                      <span>Starts: {formatDate(req.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gold-100/80">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                      <span>Duration: <strong>{durationText}</strong></span>
                    </div>

                    {req.shiftType && (
                      <div className="flex items-center gap-2 text-gold-100/80">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                        <span className="capitalize">{req.shiftType}</span>
                      </div>
                    )}

                    {req.weeklyPayRange && (
                      <div className="flex items-center gap-2 text-gold-100/80">
                        <Briefcase className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                        <span>{req.weeklyPayRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and Action Buttons */}
                <div className="mt-5 border-t border-gold-300/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gold-100/50">
                    <span>Applied: {formatDate(app.createdAt)}</span>
                    {app.updatedAt && app.updatedAt !== app.createdAt && (
                      <span>Updated: {formatDate(app.updatedAt)}</span>
                    )}
                  </div>

                  {isSelectedOffer && (
                    isAccepted ? (
                      <div className="pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => router.push("/carer?tab=placements")}
                          className="text-xs font-bold py-2 shadow-md shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 text-white border !border-emerald-400/40"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
                          View Confirmed Placement
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-emerald-200" />
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={decliningId === app.id || acceptingId === app.id}
                          onClick={() => handleDeclineOffer(app)}
                          className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/15 text-xs py-2"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          {decliningId === app.id ? "Declining..." : "Decline"}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={acceptingId === app.id || decliningId === app.id}
                          onClick={() => handleAcceptOffer(app)}
                          className="text-xs font-bold py-2 shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          {acceptingId === app.id ? "Accepting..." : "Accept Offer"}
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
