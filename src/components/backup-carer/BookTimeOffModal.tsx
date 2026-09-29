"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Plane,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/Button";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface BookTimeOffModalProps {
  placementId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  onLeaveBooked?: () => void;
}

export default function BookTimeOffModal({
  placementId,
  clientName,
  isOpen,
  onClose,
  onLeaveBooked,
}: BookTimeOffModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("Annual Leave / Holiday");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate day count
  let dayCount = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime >= 0) {
      dayCount = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      showErrorToast("Validation Error", "Please select both start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      showErrorToast("Invalid Range", "End date must be on or after start date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullReason = notes.trim() ? `${reason}: ${notes.trim()}` : reason;
      await backupCarerService.bookLeaveRequest(placementId, {
        startDate,
        endDate,
        reason: fullReason,
      });

      showSuccessToast(
        "Time-off Request Submitted",
        "Your holiday dates have been recorded. Our team will offer relief cover to the preferred backup carer."
      );
      if (onLeaveBooked) onLeaveBooked();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to book time off.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Plane className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Book Holiday / Time Off</h3>
            <p className="text-xs text-gold-100/60">
              Placement: <span className="text-gold-200 font-semibold">{clientName}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Start Date (First Day Off)
              </label>
              <input
                type="date"
                min={minDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-100 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                End Date (Last Day Off)
              </label>
              <input
                type="date"
                min={startDate || minDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-100 focus:border-gold outline-none"
              />
            </div>
          </div>

          {dayCount > 0 && (
            <div className="p-3 rounded-xl bg-gold-300/10 border border-gold-300/20 text-xs text-gold-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Total Duration:
              </span>
              <span className="font-bold">
                {dayCount} days ({dayCount - 1} nights relief required)
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-100 focus:border-gold outline-none"
            >
              <option value="Annual Leave / Holiday">Annual Leave / Holiday</option>
              <option value="Family / Personal Commitment">Family / Personal Commitment</option>
              <option value="Medical / Dental Appointment">Medical / Dental Appointment</option>
              <option value="Rest / Rotation Break">Rest / Rotation Break</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
              Handover Notes / Specific Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any helpful handover points for the relief carer or care team..."
              rows={2}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none"
            />
          </div>

          {/* Workflow preview notification */}
          <div className="p-3 rounded-xl bg-navy-950/60 border border-gold-300/10 text-xs text-gold-100/70 space-y-1.5">
            <div className="flex items-center gap-1.5 text-gold-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Relief Cover Dispatch Process:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Once submitted, your request will be flagged to Admin as <em>Pending Relief Cover</em>.
              Our team will immediately offer these dates to the client's designated Preferred Backup
              Carer.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gold-300/10">
            <Button
              variant="ghost-gold"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting || !startDate || !endDate}
              className="font-bold shadow-md shadow-gold/20"
            >
              {isSubmitting ? "Submitting..." : "Submit Holiday Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
