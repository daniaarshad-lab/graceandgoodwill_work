"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Info,
  X,
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
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
      await backupCarerService.bookLeaveRequest(placementId, {
        startDate,
        endDate,
        reason: "Planned Unavailability",
        handoverNotes: notes.trim() || undefined,
      });

      showSuccessToast(
        "Unavailability Recorded",
        "Your unavailability dates have been recorded. Our coordination team will arrange relief cover."
      );
      if (onLeaveBooked) onLeaveBooked();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to submit unavailability.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/80 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gold-300/10 shrink-0 bg-navy-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Report Unavailability / Arrange Relief Cover</h3>
              <p className="text-xs text-gold-100/60">
                Placement: <span className="text-gold-200 font-semibold">{clientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="timeoff-form" onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Start Date (First Day Unavailable)
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
                End Date (Last Day Unavailable)
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
                {dayCount} days
              </span>
            </div>
          )}

          {/* Handover Information Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gold-300/10 pb-3">
              <div className="p-2 rounded-xl bg-gold-500/20 text-gold-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gold-200">
                  Handover Information
                </h4>
                <p className="text-[11px] text-gold-100/60 mt-0.5">
                  Practical information for the incoming carer to maintain continuity of support.
                </p>
              </div>
            </div>

            {/* Guidance callout box */}
            <div className="p-3.5 rounded-xl border border-gold-300/15 bg-navy-950/70 space-y-2 text-xs text-gold-100/80">
              <div className="flex items-center gap-2 font-semibold text-gold-200 text-xs">
                <Info className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0" />
                <span>To help the incoming carer maintain continuity of support, you may wish to include:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gold-100/70 pl-2 list-disc list-inside">
                <li>Any recent changes in the client&apos;s health, mobility or general wellbeing</li>
                <li>Any recent falls, hospital visits or significant incidents</li>
                <li>Medication-related information or recent changes to be aware of</li>
                <li>Changes to routine, preferences or behaviour</li>
                <li>Upcoming appointments or commitments</li>
                <li>Mobility equipment or practical household information</li>
                <li>Relevant risks or concerns</li>
                <li>Anything else that may help maintain continuity of support</li>
              </ul>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter handover details, routines, medication notes, or practical instructions here..."
                rows={4}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none resize-y"
              />
            </div>

            <p className="text-[11px] text-gold-100/50">
              Please ensure handover details are provided so the incoming relief carer has clear context.
            </p>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="flex justify-end gap-3 p-4 sm:px-6 border-t border-gold-300/10 bg-navy-950/80 shrink-0">
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
            form="timeoff-form"
            disabled={isSubmitting || !startDate || !endDate}
            className="font-bold shadow-md shadow-gold/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Unavailability"}
          </Button>
        </div>
      </div>
    </div>
  );
}
