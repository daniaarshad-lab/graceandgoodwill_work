"use client";

import { CarerCareRequestDetail } from "@/types/carer.types";
import Button from "@/components/Button";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Banknote,
  FileText,
  AlertCircle,
} from "lucide-react";

interface PlacementDetailModalProps {
  careRequest: CarerCareRequestDetail | null;
  loading: boolean;
  applying: boolean;
  hasApplied: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function PlacementDetailModal({
  careRequest,
  loading,
  applying,
  hasApplied,
  onClose,
  onApply,
}: PlacementDetailModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gold-300/20 bg-navy-900 shadow-elegant">
        {/* Header */}
        <div className="sticky top-0 bg-navy-900 z-10 flex items-center justify-between p-6 border-b border-gold-300/10">
          <h3 className="text-xl font-bold text-gold-50">Placement Details</h3>
          <button
            onClick={onClose}
            className="text-gold-100/50 hover:text-gold-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !careRequest ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-DEFAULT"></div>
            <p className="text-sm text-gold-100/60">Loading details...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {careRequest.isOngoing && (
                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Ongoing / Permanent
                </span>
              )}
              {careRequest.isEmergency && (
                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                  Urgent
                </span>
              )}
            </div>

            {/* Care Category */}
            <div>
              <h4 className="text-lg font-bold text-gold-200">
                {careRequest.careCategory || "Care Placement"}
              </h4>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                icon={<MapPin className="w-4 h-4" />}
                label="Location"
                value={careRequest.city || careRequest.address || "TBC"}
              />
              <DetailItem
                icon={<Calendar className="w-4 h-4" />}
                label="Start Date"
                value={formatDate(careRequest.startDate)}
              />
              <DetailItem
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={careRequest.duration || "—"}
              />
              <DetailItem
                icon={<Calendar className="w-4 h-4" />}
                label="End Date"
                value={
                  careRequest.isOngoing
                    ? "Ongoing"
                    : formatDate(careRequest.endDate)
                }
              />
              <DetailItem
                icon={<Banknote className="w-4 h-4" />}
                label="Weekly Pay Range"
                value={formatPayRange(careRequest.weeklyPayRange)}
                valueClassName="text-emerald-400 font-semibold"
              />
              <DetailItem
                icon={<FileText className="w-4 h-4" />}
                label="Shift Type"
                value={careRequest.shiftType || "—"}
              />
            </div>

            {/* Requirements */}
            {careRequest.requirements && (
              <div className="rounded-xl bg-navy-950/60 border border-gold-300/5 p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gold-100/40 font-semibold">
                  Care Requirements
                </span>
                <p className="text-sm text-gold-100/80 leading-relaxed whitespace-pre-wrap">
                  {careRequest.requirements}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {careRequest.additionalNotes && (
              <div className="rounded-xl bg-navy-950/60 border border-gold-300/5 p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gold-100/40 font-semibold">
                  Additional Notes
                </span>
                <p className="text-sm text-gold-100/70 leading-relaxed whitespace-pre-wrap">
                  {careRequest.additionalNotes}
                </p>
              </div>
            )}

            {/* Schedule Notes */}
            {careRequest.scheduleNotes && (
              <div className="rounded-xl bg-navy-950/60 border border-gold-300/5 p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gold-100/40 font-semibold">
                  Schedule Notes
                </span>
                <p className="text-sm text-gold-100/70 leading-relaxed whitespace-pre-wrap">
                  {careRequest.scheduleNotes}
                </p>
              </div>
            )}

            {/* Apply Action */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gold-300/10">
              <Button
                variant="ghost-gold"
                size="sm"
                fullWidth={false}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth={false}
                disabled={hasApplied || applying}
                onClick={onApply}
              >
                {applying
                  ? "Submitting..."
                  : hasApplied
                    ? "Application Submitted ✓"
                    : "Apply Now"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-navy-950/40 border border-gold-300/5 p-3">
      <div className="text-gold-200/40 mt-0.5">{icon}</div>
      <div>
        <span className="block text-[10px] uppercase tracking-wider text-gold-100/40 font-semibold">
          {label}
        </span>
        <span className={`text-sm text-gold-200 font-medium ${valueClassName}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
