"use client";

import { useEffect, useState } from "react";
import { carerService } from "@/services/carer/carer.service";
import { CarerPlacement } from "@/types/carer.types";
import SectionCard from "./shared/SectionCard";
import {
  User,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Check,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import ThinSpinner from "@/components/ThinSpinner";

const DECLINE_REASONS = [
  "Schedule conflict / Unavailable on requested dates",
  "Location / Commute distance is too far",
  "Care requirements do not match my preferences",
  "Rate / Hours not suitable",
  "Personal circumstances / Other",
];

function DeclineOfferModal({
  placementId,
  onClose,
  onDeclined,
}: {
  placementId: string;
  onClose: () => void;
  onDeclined: () => void;
}) {
  const [selectedReason, setSelectedReason] = useState(DECLINE_REASONS[0]);
  const [customNote, setCustomNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullReason =
        selectedReason === "Personal circumstances / Other" && customNote.trim()
          ? customNote.trim()
          : customNote.trim()
            ? `${selectedReason} - ${customNote.trim()}`
            : selectedReason;

      await carerService.rejectPlacement(placementId, fullReason);
      showSuccessToast(
        "Offer Declined",
        "Placement offer has been declined and client notified."
      );
      onDeclined();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to decline placement offer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gold-200">Decline Placement Offer</h3>
            <p className="text-xs text-gold-100/60">
              Please specify the reason to help our coordination team adjust.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gold-200/80">
              Reason
            </label>
            <div className="space-y-2">
              {DECLINE_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? "border-gold bg-gold-300/10 text-gold-200"
                      : "border-gold-300/10 bg-navy-950/60 text-gold-100/70 hover:border-gold-300/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-[#d4af37]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gold-200/80">
              Additional Details (Optional)
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Provide any additional context or dates you are available..."
              rows={3}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3 py-2 text-xs text-gold-200 placeholder:text-gold-100/30 focus:border-gold outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gold-300/10">
            <Button
              variant="ghost-gold"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="submit"
              disabled={submitting}
              className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10"
            >
              {submitting ? "Declining..." : "Confirm Decline"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlacementDetailModal({
  placementId,
  onClose,
  onAccepted,
  onDeclineClick,
}: {
  placementId: string;
  onClose: () => void;
  onAccepted?: () => void;
  onDeclineClick?: () => void;
}) {
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    async function loadPlacement() {
      try {
        setLoading(true);
        setPaymentsLoading(true);
        const [data, paymentsData] = await Promise.all([
          carerService.getPlacementDetail(placementId),
          carerService.getPlacementPayments(placementId).catch(() => []),
        ]);
        setPlacement(data);
        setPayments(paymentsData);
      } catch (err: any) {
        setError(err.message || "Failed to load placement details");
      } finally {
        setLoading(false);
        setPaymentsLoading(false);
      }
    }
    loadPlacement();
  }, [placementId]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await carerService.acceptPlacement(placementId);
      showSuccessToast(
        "Placement Accepted!",
        "Your care placement offer is confirmed."
      );
      if (onAccepted) onAccepted();
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept placement.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
        <ThinSpinner size="xl" text="Loading placement details..." />
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
          <h3 className="text-xl font-bold text-rose-400">
            Error Loading Details
          </h3>
          <p className="text-sm text-gold-100/60">{error}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const isPendingOffer = placement.status === "PENDING_ACCEPTANCE";
  const isRejected = placement.status === "REJECTED_BY_CARER";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8 space-y-8">
          <div className="border-b border-gold-300/10 pb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gold-200 flex items-center gap-2">
              Placement Details
              <span
                className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${
                  isPendingOffer
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    : isRejected
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : placement.status === "PLACEMENT_CONFIRMED" || placement.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-gold-300/10 text-gold-200 border border-gold-300/20"
                }`}
              >
                {isPendingOffer
                  ? "Pending Your Acceptance"
                  : isRejected
                    ? "Declined"
                    : placement.status?.replace(/_/g, " ")}
              </span>
            </h2>

            {isPendingOffer && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    if (onDeclineClick) onDeclineClick();
                  }}
                  className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                >
                  Decline Offer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAccept}
                  disabled={accepting}
                  className="text-xs font-bold"
                >
                  {accepting ? "Accepting..." : "Accept Placement Offer"}
                </Button>
              </div>
            )}
          </div>

          {isRejected && placement.rejectionReason && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Decline Reason:</strong> {placement.rejectionReason}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                  <User className="h-4 w-4 text-gold-200" /> Client Profile
                </h3>
                {placement.contactDetailsReleased ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Details Released
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" /> Details Locked
                  </span>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Name
                  </span>
                  <span className="text-gold-100 font-bold">
                    {placement.clientProfile?.user?.firstName}{" "}
                    {placement.clientProfile?.user?.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Contact
                  </span>
                  {placement.contactDetailsReleased && placement.clientProfile?.user?.email ? (
                    <span className="text-gold-100">
                      <a
                        href={`mailto:${placement.clientProfile.user.email}`}
                        className="hover:underline text-gold-200 font-medium"
                      >
                        {placement.clientProfile.user.email}
                      </a>
                      {placement.clientProfile.user.phoneNumber && (
                        <>
                          <br />
                          <a
                            href={`tel:${placement.clientProfile.user.phoneNumber}`}
                            className="hover:underline text-gold-100"
                          >
                            {placement.clientProfile.user.phoneNumber}
                          </a>
                        </>
                      )}
                    </span>
                  ) : (
                    <div className="p-3 rounded-lg bg-gold-300/5 border border-gold-300/10 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400/90 font-semibold">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {isRejected
                            ? "Contact details unavailable"
                            : isPendingOffer
                              ? "Hidden during offer review"
                              : "Automatic 48h Release"}
                        </span>
                      </div>
                      <p className="text-gold-100/60 text-[11px] leading-relaxed">
                        {isRejected
                          ? "Direct client phone and email are not disclosed for declined placements."
                          : isPendingOffer
                            ? "Client direct phone and email will unlock 48 hours before placement commences once accepted."
                            : "Direct phone number and email will be automatically released 48 hours before placement starts."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl border border-gold-300/10 bg-navy-950/40">
              <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold-200" /> Care Requirements
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Category
                  </span>
                  <span className="text-gold-100">
                    {Array.isArray(placement.careRequest?.careCategory)
                      ? placement.careRequest.careCategory.join(", ")
                      : placement.careRequest?.careCategory || "General Care"}
                  </span>
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Location
                  </span>
                  {placement.contactDetailsReleased && placement.careRequest?.address ? (
                    <span className="text-gold-100">
                      {placement.careRequest.address}
                      <br />
                      {placement.careRequest.city} {placement.careRequest.postcode}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-gold-100 font-medium block">
                        {[placement.careRequest?.city, placement.careRequest?.postcode]
                          .filter(Boolean)
                          .join(", ") || placement.careRequest?.city || "Location provided upon placement"}
                      </span>
                      {!placement.contactDetailsReleased && (
                        <span className="text-gold-100/50 flex items-center gap-1.5 text-[11px] italic">
                          <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                          Exact street address unlocked 48h prior to commencement
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                    Schedule
                  </span>
                  <span className="text-gold-100">
                    {placement.startDate
                      ? new Date(placement.startDate).toLocaleDateString()
                      : "N/A"}
                    {placement.endDate
                      ? ` - ${new Date(placement.endDate).toLocaleDateString()}`
                      : placement.careRequest?.isOngoing
                        ? " (Ongoing)"
                        : ""}
                  </span>
                </div>
                {placement.careRequest?.additionalNotes && (
                  <div>
                    <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1 text-[10px]">
                      Notes
                    </span>
                    <span className="text-gold-100">
                      {placement.careRequest.additionalNotes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          {!isPendingOffer && (
            <div className="space-y-4 pt-4 border-t border-gold-300/10">
              <h3 className="text-lg font-bold text-gold-200 flex items-center gap-2">
                Payment History
              </h3>
              {paymentsLoading ? (
                <div className="flex justify-center p-4">
                  <ThinSpinner size="sm" text="Loading payment history..." textClassName="text-xs text-gold-100/60" />
                </div>
              ) : paymentsError ? (
                <div className="text-center py-4 border border-rose-500/20 rounded-xl bg-rose-950/10">
                  <p className="text-sm text-rose-400">{paymentsError}</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-6 border border-gold-300/5 rounded-xl bg-navy-950/20">
                  <p className="text-sm text-gold-100/60">
                    No payment history available.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gold-300/5 bg-navy-950/20">
                  <table className="w-full text-left border-collapse text-xs text-slate-350">
                    <thead>
                      <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold text-gold-200">
                        <th className="py-2.5 px-3">Period</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors"
                        >
                          <td className="py-3 px-3 text-slate-400">
                            {payment.periodStartDate
                              ? `${new Date(payment.periodStartDate).toLocaleDateString()} - ${new Date(payment.periodEndDate).toLocaleDateString()}`
                              : "N/A"}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">
                            £{Number(payment.amount).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                payment.status === "PAID"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : payment.status === "UNPAID"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {payment.transactionProofUrl ? (
                              <a
                                href={payment.transactionProofUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gold-DEFAULT hover:underline font-bold text-[10px] inline-flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarerPlacements() {
  const [placements, setPlacements] = useState<CarerPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(
    null
  );
  const [declineModalPlacementId, setDeclineModalPlacementId] = useState<
    string | null
  >(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carerService.getPlacements();
      setPlacements(data);
    } catch (err: any) {
      setError(err.message || "Failed to load placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleAcceptOffer = async (placementId: string) => {
    setAcceptingId(placementId);
    try {
      await carerService.acceptPlacement(placementId);
      showSuccessToast(
        "Placement Accepted!",
        "Congratulations! Your care placement is confirmed."
      );
      fetchPlacements();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept placement offer.");
    } finally {
      setAcceptingId(null);
    }
  };

  const pendingOffers = placements.filter(
    (p) => p.status === "PENDING_ACCEPTANCE"
  );
  const activeOrPastPlacements = placements.filter(
    (p) => p.status !== "PENDING_ACCEPTANCE"
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">Placements & Match Offers</h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Review placement proposals from clients and coordinate your active care assignments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <ThinSpinner size="md" text="Loading placements..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
          <p className="text-xs text-rose-400/60">{error}</p>
          <Button variant="outline" onClick={fetchPlacements} className="mt-2">
            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* New Placement Offers Section */}
          {pendingOffers.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200">
                  New Placement Offers Awaiting Your Response ({pendingOffers.length})
                </h4>
              </div>

              <div className="space-y-4">
                {pendingOffers.map((place) => (
                  <div
                    key={place.id}
                    className="p-6 rounded-2xl border-2 border-gold/40 bg-navy-900 shadow-xl space-y-4 relative overflow-hidden group hover:border-gold transition-all"
                  >
                    <div className="absolute top-0 right-0 bg-gold/20 text-gold-200 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl border-l border-b border-gold/30">
                      Action Required
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pr-24">
                      <div>
                        <h4 className="text-lg font-bold text-gold-200">
                          {Array.isArray(place.careRequest?.careCategory)
                            ? place.careRequest.careCategory.join(", ")
                            : place.careRequest?.careCategory || "Care Placement Match"}
                        </h4>
                        <p className="text-xs text-gold-100/70 mt-1">
                          Client:{" "}
                          <span className="font-semibold text-white">
                            {place.clientProfile?.user?.firstName}{" "}
                            {place.clientProfile?.user?.lastName}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gold-100/80 bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gold shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-gold-100/40 block">
                            Start Date
                          </span>
                          <span>{new Date(place.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-gold-100/40 block">
                            Location
                          </span>
                          <span className="truncate">
                            {place.careRequest?.city || place.careRequest?.address || "London, UK"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold shrink-0" />
                        <div>
                          <span className="text-[10px] uppercase text-gold-100/40 block">
                            Duration
                          </span>
                          <span>
                            {place.endDate
                              ? `Until ${new Date(place.endDate).toLocaleDateString()}`
                              : place.careRequest?.isOngoing
                                ? "Ongoing Placement"
                                : "Standard Duration"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {place.careRequest?.requirements && (
                      <p className="text-xs text-gold-100/70 italic line-clamp-2">
                        "{place.careRequest.requirements}"
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gold-300/10">
                      <Button
                        variant="ghost-gold"
                        size="sm"
                        onClick={() => setSelectedPlacementId(place.id)}
                        className="text-xs"
                      >
                        View Full Details
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeclineModalPlacementId(place.id)}
                          className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Decline Offer
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={acceptingId === place.id}
                          onClick={() => handleAcceptOffer(place.id)}
                          className="text-xs font-bold shadow-md shadow-gold/20"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          {acceptingId === place.id ? "Accepting..." : "Accept Placement Offer"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active & Confirmed Placements */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200/80">
              Active & Confirmed Placements
            </h4>

            {activeOrPastPlacements.length === 0 ? (
              <div className="text-center p-10 rounded-2xl border border-gold-300/10 bg-navy-900/40">
                <p className="text-xs text-gold-100/50">
                  No confirmed or active placements found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrPastPlacements.map((place) => {
                  const isRejected = place.status === "REJECTED_BY_CARER";
                  return (
                    <SectionCard key={place.id} className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/5 pb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gold-200">
                            {Array.isArray(place.careRequest?.careCategory)
                              ? place.careRequest.careCategory.join(", ")
                              : place.careRequest?.careCategory || "General Care"}
                          </h4>
                          <p className="text-xs text-gold-100/60 mt-0.5">
                            Client: {place.clientProfile?.user?.firstName}{" "}
                            {place.clientProfile?.user?.lastName}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            isRejected
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : place.status === "PLACEMENT_CONFIRMED" || place.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-gold-300/10 text-gold-200 border border-gold-300/20"
                          }`}
                        >
                          {isRejected ? "Declined by You" : place.status?.replace(/_/g, " ")}
                        </span>
                      </div>

                      {isRejected && place.rejectionReason && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                          <strong>Reason:</strong> {place.rejectionReason}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gold-100">
                          <Calendar className="h-4 w-4 text-gold/60 shrink-0" />
                          <span>
                            Commenced: {new Date(place.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gold-100">
                          <MapPin className="h-4 w-4 text-gold/60 shrink-0" />
                          <span className="truncate">
                            {place.careRequest?.city || place.careRequest?.address || "Location details on file"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPlacementId(place.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </SectionCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline Offer Modal */}
      {declineModalPlacementId && (
        <DeclineOfferModal
          placementId={declineModalPlacementId}
          onClose={() => setDeclineModalPlacementId(null)}
          onDeclined={fetchPlacements}
        />
      )}

      {/* Placement Detail Modal */}
      {selectedPlacementId && (
        <PlacementDetailModal
          placementId={selectedPlacementId}
          onClose={() => setSelectedPlacementId(null)}
          onAccepted={fetchPlacements}
          onDeclineClick={() => setDeclineModalPlacementId(selectedPlacementId)}
        />
      )}
    </div>
  );
}
