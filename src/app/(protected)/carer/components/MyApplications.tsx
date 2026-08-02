"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarerApplications } from "@/store/slices/carerSlice";
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
} from "lucide-react";

export default function MyApplications() {
  const dispatch = useAppDispatch();
  const { applications, applicationsLoading, error } = useAppSelector(
    (state) => state.carer,
  );

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

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
          Pending
        </span>
      );
    }
    if (s === "SELECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-400/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Selected
        </span>
      );
    }
    if (s === "REJECTED") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
          Rejected
        </span>
      );
    }
    if (s === "WITHDRAWN") {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-400 border border-gray-500/20">
          Withdrawn
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gold-500/10 px-2 py-1 text-xs font-semibold text-gold-400 border border-gold-500/20">
        {status}
      </span>
    );
  };

  // Only show active applications (not in history tab)
  const activeApplications = applications.filter((app) =>
    ["PENDING", "SELECTED"].includes(app.status?.toUpperCase() || ""),
  );

  if (applicationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm text-gold-100/60">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">My Applications</h3>
          <p className="text-xs text-gold-100/50 mt-1">
            View the status of the care requests you have applied for.
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

      {activeApplications.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-medium">
            You haven't submitted any applications yet.
          </p>
          <p className="text-xs mt-1 opacity-60">
            Check the Placement Opportunities tab to apply for jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activeApplications.map((app) => {
            const req = app.careRequest;
            if (!req) return null;
            return (
              <div
                key={app.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-300/10 bg-navy-900/50 p-5 transition-all duration-300 hover:border-gold-300/30 hover:bg-navy-800 hover:shadow-xl hover:shadow-gold-900/10"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {req.careCategory && Array.isArray(req.careCategory) ? (
                        req.careCategory.map((cat: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-gold-950/40 px-2 py-1 text-xs font-semibold text-gold-200 border border-gold-300/20"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-gold-950/40 px-2 py-1 text-xs font-semibold text-gold-200 border border-gold-300/20">
                          General Care
                        </span>
                      )}
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gold-100/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-60 text-gold-300" />
                      <span className="text-sm leading-tight">
                        {req.city || "Location not specified"}
                        {req.postcode && `, ${req.postcode.split(" ")[0]}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gold-100/80">
                      <Calendar className="h-4 w-4 shrink-0 opacity-60 text-gold-300" />
                      <span className="text-sm">
                        Starts: {formatDate(req.startDate)}
                      </span>
                    </div>

                    {req.shiftType && (
                      <div className="flex items-center gap-2 text-gold-100/80">
                        <Clock className="h-4 w-4 shrink-0 opacity-60 text-gold-300" />
                        <span className="text-sm capitalize">
                          {req.shiftType}
                        </span>
                      </div>
                    )}

                    {req.weeklyPayRange && (
                      <div className="flex items-center gap-2 text-gold-100/80">
                        <Briefcase className="h-4 w-4 shrink-0 opacity-60 text-gold-300" />
                        <span className="text-sm">{req.weeklyPayRange}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-gold-300/10 pt-4">
                  <p className="text-xs text-gold-100/40">
                    Applied on: {formatDate(app.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
