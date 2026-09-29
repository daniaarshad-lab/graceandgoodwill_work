"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  User,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import Button from "@/components/Button";
import { ReliefOffer } from "@/types/backupCarer.types";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const DECLINE_REASONS = [
  "Unavailable on requested dates / Calendar conflict",
  "Commute distance / Location not suitable",
  "Client care requirements do not match my skills",
  "Personal commitments during this period",
  "Other reason",
];

interface ReliefOpportunityModalProps {
  offer: ReliefOffer;
  isOpen: boolean;
  onClose: () => void;
  onOfferHandled?: () => void;
}

export default function ReliefOpportunityModal({
  offer,
  isOpen,
  onClose,
  onOfferHandled,
}: ReliefOpportunityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineReasonForm, setShowDeclineReasonForm] = useState(false);
  const [declineReason, setDeclineReason] = useState(DECLINE_REASONS[0]);
  const [declineNote, setDeclineNote] = useState("");
  const [confirmedState, setConfirmedState] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await backupCarerService.acceptReliefOffer(offer.assignmentId);
      showSuccessToast(
        "Relief Placement Confirmed!",
        `You have accepted the relief placement for ${offer.clientName}.`
      );
      setConfirmedState(true);
      if (onOfferHandled) onOfferHandled();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept relief placement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullReason =
        declineReason === "Other reason" && declineNote.trim()
          ? declineNote.trim()
          : declineNote.trim()
          ? `${declineReason} - ${declineNote.trim()}`
          : declineReason;

      await backupCarerService.declineReliefOffer(offer.assignmentId, fullReason);
      showSuccessToast(
        "Offer Declined",
        "The relief offer has been declined and our team will arrange alternative cover."
      );
      if (onOfferHandled) onOfferHandled();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to decline relief offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedStartDate = new Date(offer.startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedEndDate = new Date(offer.endDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {confirmedState ? (
          /* Confirmation View (Mockup 2 #4) */
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Placement Confirmed!</h3>
              <p className="text-sm text-gold-100/80">
                You have accepted the relief placement for{" "}
                <span className="text-gold-200 font-semibold">{offer.clientName}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/10 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between border-b border-gold-300/10 pb-2">
                <span className="text-gold-100/60">Relief Dates:</span>
                <span className="font-semibold text-gold-100">
                  {formattedStartDate} – {formattedEndDate} ({offer.nightsCount} nights)
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-300/10 pb-2">
                <span className="text-gold-100/60">Your Role for these Dates:</span>
                <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Active Relief Carer
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-100/60">Client:</span>
                <span className="font-semibold text-white">{offer.clientName}</span>
              </div>
            </div>

            <p className="text-xs text-gold-100/60">
              The client and our care team have been notified. Placement agreements and access details
              will be updated in your portal.
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full font-bold shadow-lg shadow-gold/20"
            >
              Done
            </Button>
          </div>
        ) : showDeclineReasonForm ? (
          /* Decline Reason Form */
          <form onSubmit={handleConfirmDecline} className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Decline Relief Placement</h3>
                <p className="text-xs text-gold-100/60">
                  Please let us know your reason so our care team can arrange cover.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Reason for Declining
              </label>
              <div className="space-y-2">
                {DECLINE_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      declineReason === r
                        ? "border-gold bg-gold-300/10 text-gold-200 font-semibold"
                        : "border-gold-300/10 bg-navy-950/60 text-gold-100/70 hover:border-gold-300/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="declineReason"
                      value={r}
                      checked={declineReason === r}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="accent-[#d4af37]"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                Additional Note (Optional)
              </label>
              <textarea
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                placeholder="Optional details or alternative dates you can cover..."
                rows={3}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gold-300/10">
              <Button
                variant="ghost-gold"
                size="sm"
                type="button"
                onClick={() => setShowDeclineReasonForm(false)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10"
              >
                {isSubmitting ? "Declining..." : "Confirm Decline"}
              </Button>
            </div>
          </form>
        ) : (
          /* Main Relief Offer Presentation (Mockup 1 #3 & Mockup 2 #3) */
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      New Relief Offer
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Relief Placement Opportunity
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-gold-100/80 leading-relaxed">
              A relief placement opportunity is available for a client where you are designated as the{" "}
              <strong className="text-amber-300">Preferred Relief/Backup Carer</strong>. The primary
              carer will be taking approved annual leave.
            </p>

            {/* Client & Placement Details Card */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-300/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-300/10 border border-gold-300/30 flex items-center justify-center text-gold-200 shrink-0 font-bold">
                  {offer.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{offer.clientName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gold-100/70">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{offer.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-gold-300/10">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-gold-100/50 font-bold block">
                    Dates Requested
                  </span>
                  <div className="flex items-center gap-1.5 text-gold-100 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {formattedStartDate} – {formattedEndDate}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-gold-100/50 font-bold block">
                    Duration
                  </span>
                  <div className="flex items-center gap-1.5 text-gold-100 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{offer.nightsCount} nights / days</span>
                  </div>
                </div>
              </div>

              {offer.requirements && (
                <div className="pt-2 text-xs text-gold-100/70 italic border-t border-gold-300/10">
                  "{offer.requirements}"
                </div>
              )}
            </div>

            {/* Explanatory note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gold-300/5 border border-gold-300/10 text-xs text-gold-100/70">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Please review the placement dates and confirm whether you can accept or decline. This
                opportunity is subject to your calendar availability and the standard placement workflow.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gold-300/10">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowDeclineReasonForm(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto !border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAccept}
                disabled={isSubmitting}
                className="w-full sm:w-auto text-xs font-bold shadow-lg shadow-gold/20"
              >
                {isSubmitting ? "Accepting..." : "Accept Placement"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
