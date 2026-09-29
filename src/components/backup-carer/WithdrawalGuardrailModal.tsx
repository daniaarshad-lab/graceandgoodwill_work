"use client";

import { useState } from "react";
import {
  Calendar,
  AlertTriangle,
  Lock,
  PhoneCall,
  X,
  XCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Button from "@/components/Button";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const WITHDRAWAL_REASONS = [
  "Illness / Medical emergency",
  "Family / Personal emergency",
  "Transport / Travel disruption",
  "Unforeseen personal commitment",
  "Other urgent circumstance",
];

interface WithdrawalGuardrailModalProps {
  placementId: string;
  clientName: string;
  startDate: string;
  status: string;
  isOpen: boolean;
  onClose: () => void;
  onWithdrawn?: () => void;
}

export default function WithdrawalGuardrailModal({
  placementId,
  clientName,
  startDate,
  status,
  isOpen,
  onClose,
  onWithdrawn,
}: WithdrawalGuardrailModalProps) {
  const [selectedReason, setSelectedReason] = useState(WITHDRAWAL_REASONS[0]);
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const eligibility = backupCarerService.checkWithdrawalEligibility(startDate, status);
  const formattedStartDate = new Date(startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.canWithdrawOnPlatform) return;

    setIsSubmitting(true);
    try {
      const fullReason = customNote.trim()
        ? `${selectedReason}: ${customNote.trim()}`
        : selectedReason;

      await backupCarerService.withdrawFromPlacement(placementId, fullReason);
      showSuccessToast(
        "Withdrawal Submitted",
        "Your withdrawal has been recorded and the client & management team have been notified."
      );
      if (onWithdrawn) onWithdrawn();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to submit withdrawal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* TIER 3: Placement Underway / Commenced (Mockup 2 #7) */}
        {eligibility.tier === "COMMENCED_LOCKED" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Placement in Progress</h3>
                <p className="text-xs text-gold-100/60">This placement is now underway.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-100/50">Client:</span>
                <span className="font-semibold text-white">{clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Started:</span>
                <span className="font-semibold text-gold-100">{formattedStartDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Status:</span>
                <span className="font-bold text-emerald-400">In Progress</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200/90 leading-relaxed">
              You cannot withdraw or resign from a placement via the platform once it has commenced.
              If you are unable to continue, please contact Grace & Goodwill directly by phone.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button variant="ghost-gold" size="sm" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
              <a
                href={`tel:${eligibility.phoneSupportNumber}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-gold/20 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Grace & Goodwill ({eligibility.phoneSupportNumber})</span>
              </a>
            </div>
          </div>
        )}

        {/* TIER 2: Restricted (Within 3 Days) (Mockup 2 #6) */}
        {eligibility.tier === "RESTRICTED_3_DAYS" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Withdrawal Not Available</h3>
                <p className="text-xs text-gold-100/60">Within 3 days of agreed start date</p>
              </div>
            </div>

            <p className="text-xs text-gold-100/80 leading-relaxed">
              You are within 3 days of the start date, so you can no longer withdraw from this placement
              through the platform.
            </p>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-100/50">Placement:</span>
                <span className="font-semibold text-white">{clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Start Date:</span>
                <span className="font-semibold text-amber-300">{formattedStartDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Today's Date:</span>
                <span className="font-semibold text-gold-100">{todayFormatted}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              If you are unable to continue, please contact Grace & Goodwill directly by phone. We will
              discuss the situation and make appropriate alternative arrangements.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button variant="ghost-gold" size="sm" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <a
                href={`tel:${eligibility.phoneSupportNumber}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-gold/20 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Grace & Goodwill</span>
              </a>
            </div>
          </div>
        )}

        {/* TIER 1: Withdrawal Allowed (> 3 Days Notice) (Mockup 2 #5) */}
        {eligibility.tier === "ALLOWED" && (
          <form onSubmit={handleWithdrawSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Withdraw from Placement</h3>
                <p className="text-xs text-gold-100/60">
                  You can withdraw up to 3 days before the start date.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-100/50">Placement:</span>
                <span className="font-semibold text-white">{clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Start Date:</span>
                <span className="font-semibold text-gold-100">{formattedStartDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/50">Notice Period:</span>
                <span className="font-semibold text-emerald-400">
                  {eligibility.daysUntilStart} days remaining (Platform withdrawal available)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Reason for Withdrawal
              </label>
              <div className="space-y-1.5">
                {WITHDRAWAL_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === r
                        ? "border-rose-400/80 bg-rose-500/10 text-rose-200 font-semibold"
                        : "border-gold-300/10 bg-navy-950/60 text-gold-100/70 hover:border-gold-300/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="withdrawalReason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="accent-[#d4af37]"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Additional Details
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Please provide any relevant details for the coordination team..."
                rows={2}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none"
              />
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
                variant="outline"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 font-bold"
              >
                {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
