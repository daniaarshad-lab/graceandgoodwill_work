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
  Plane,
  LogOut,
  Users,
  Shield,
  Layers,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import ThinSpinner from "@/components/ThinSpinner";
import { useAppSelector } from "@/store/hooks";
import PlacementTimeline from "@/components/backup-carer/PlacementTimeline";
import PlacementRulesCard from "@/components/backup-carer/PlacementRulesCard";
import ReliefOpportunityModal from "@/components/backup-carer/ReliefOpportunityModal";
import WithdrawalGuardrailModal from "@/components/backup-carer/WithdrawalGuardrailModal";
import BookTimeOffModal from "@/components/backup-carer/BookTimeOffModal";
import { backupCarerService } from "@/services/backupCarer.service";
import { ReliefOffer, PreferredBackupDesignation } from "@/types/backupCarer.types";

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

        if (placementId.startsWith("backup-")) {
          const backups = await backupCarerService.getPreferredBackupPlacements();
          const found = backups.find((b) => b.id === placementId) || backups[0];
          setPlacement({
            id: found.id,
            status: "PREFERRED_BACKUP",
            isPreferredBackup: true,
            myRole: "PREFERRED_BACKUP_CARER",
            startDate: new Date().toISOString(),
            startDateText: found.startDateText || "No dates assigned yet",
            clientProfile: {
              user: {
                firstName: found.clientName.split(" ")[0] || "Client",
                lastName: found.clientName.split(" ").slice(1).join(" ") || "",
              },
            },
            careRequest: {
              careCategory: found.careCategory,
              city: found.city,
              requirements: found.notes || "You are selected as preferred backup for this client, and will be offered dates when relief is required.",
            },
          });
          setLoading(false);
          setPaymentsLoading(false);
          return;
        }

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

          {placement.isPreferredBackup && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-200 block">Preferred Relief / Backup Designation</span>
                <span className="text-[11px] text-amber-300/80">
                  You are selected as preferred backup for this client, and will be offered dates when relief is required.
                </span>
              </div>
            </div>
          )}

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
  const [reliefOffers, setReliefOffers] = useState<ReliefOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sub-tabs: "current", "relief", "past", "guidelines"
  const [activeSubTab, setActiveSubTab] = useState<
    "current" | "relief" | "past" | "guidelines"
  >("current");

  // Modals state
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [declineModalPlacementId, setDeclineModalPlacementId] = useState<string | null>(null);
  const [activeReliefOffer, setActiveReliefOffer] = useState<ReliefOffer | null>(null);
  const [timeOffPlacement, setTimeOffPlacement] = useState<{
    id: string;
    clientName: string;
  } | null>(null);
  const [withdrawalPlacement, setWithdrawalPlacement] = useState<{
    id: string;
    clientName: string;
    startDate: string;
    status: string;
  } | null>(null);

  const profile = useAppSelector((state) => state.carer.profile);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [backupPlacements, setBackupPlacements] = useState<PreferredBackupDesignation[]>([]);

  const fetchPlacementsAndOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [placementsData, offersData, backupData] = await Promise.all([
        carerService.getPlacements().catch(() => []),
        backupCarerService.getReliefOpportunities().catch(() => []),
        backupCarerService.getPreferredBackupPlacements(profile?.id).catch(() => []),
      ]);
      setPlacements(placementsData);
      setReliefOffers(offersData);
      setBackupPlacements(backupData);
    } catch (err: any) {
      setError(err.message || "Failed to load placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacementsAndOffers();
  }, [profile?.id]);

  const handleAcceptOffer = async (placementId: string) => {
    setAcceptingId(placementId);
    try {
      await carerService.acceptPlacement(placementId);
      showSuccessToast(
        "Placement Accepted!",
        "Congratulations! Your care placement is confirmed."
      );
      fetchPlacementsAndOffers();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept placement offer.");
    } finally {
      setAcceptingId(null);
    }
  };

  // Roles calculation
  const primaryPlacements = placements.filter(
    (p) =>
      p.status === "PLACEMENT_CONFIRMED" ||
      p.status === "PLACEMENT_STARTED" ||
      p.status === "ACTIVE" ||
      p.status === "ONGOING"
  );
  const pendingPrimaryOffers = placements.filter(
    (p) => p.status === "PENDING_ACCEPTANCE"
  );
  const pastPlacements = placements.filter(
    (p) =>
      p.status === "COMPLETED" ||
      p.status === "CANCELLED" ||
      p.status === "REJECTED_BY_CARER" ||
      p.status === "TERMINATED"
  );

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation (Mockup 1 #2) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gold-300/15 pb-2">
        <button
          onClick={() => setActiveSubTab("current")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "current"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Current & Upcoming</span>
          {(primaryPlacements.length > 0 || backupPlacements.length > 0) && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeSubTab === "current"
                  ? "bg-navy-950 text-gold"
                  : "bg-gold-300/20 text-gold-200"
              }`}
            >
              {primaryPlacements.length + backupPlacements.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("relief")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "relief"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Relief Opportunities</span>
          {reliefOffers.length > 0 && (
            <span className="text-[10px] bg-amber-500 text-navy-950 font-bold px-2 py-0.5 rounded-full animate-pulse">
              {reliefOffers.length} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("past")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "past"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Past Placements</span>
          {pastPlacements.length > 0 && (
            <span className="text-[10px] bg-gold-300/20 text-gold-200 px-1.5 py-0.2 rounded-full">
              {pastPlacements.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("guidelines")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ml-auto ${
            activeSubTab === "guidelines"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-gold-300" />
          <span>Rules & Timeline</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <ThinSpinner size="md" text="Loading placements and relief opportunities..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
          <p className="text-xs text-rose-400/60">{error}</p>
          <Button variant="outline" onClick={fetchPlacementsAndOffers} className="mt-2">
            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: CURRENT & UPCOMING PLACEMENTS */}
          {activeSubTab === "current" && (
            <div className="space-y-6">
              {/* Action Required: Pending Offers */}
              {pendingPrimaryOffers.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200">
                      Standard Placement Offers Awaiting Your Response ({pendingPrimaryOffers.length})
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {pendingPrimaryOffers.map((place) => (
                      <div
                        key={place.id}
                        className="p-6 rounded-2xl border-2 border-gold/40 bg-navy-900 shadow-xl space-y-4 relative overflow-hidden group hover:border-gold transition-all"
                      >
                        <div className="absolute top-0 right-0 bg-gold/20 text-gold-200 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl border-l border-b border-gold/30">
                          Action Required
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pr-24">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                                Role Offered: Primary Carer
                              </span>
                              <span className="text-[11px] text-gold-100/50 uppercase tracking-wider font-semibold">
                                Live-in Placement
                              </span>
                            </div>
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

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-gold-100/80 bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 block">
                                Carer Role
                              </span>
                              <span className="font-bold text-amber-300">
                                Primary Carer
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gold shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 block">
                                Start Date
                              </span>
                              <span>{new Date(place.startDate).toLocaleDateString("en-GB")}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gold shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 block">
                                Duration
                              </span>
                              <span className="font-medium text-white">
                                {(() => {
                                  const req = place.careRequest as any;
                                  if (req?.duration && req.duration !== "Standard Duration") {
                                    return req.duration;
                                  }
                                  if (place.startDate && place.endDate) {
                                    const start = new Date(place.startDate);
                                    const end = new Date(place.endDate);
                                    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                    const weeks = Math.round(diffDays / 7);
                                    return diffDays >= 7 ? `${weeks} ${weeks === 1 ? "Week" : "Weeks"} (${diffDays}d)` : `${diffDays} Days`;
                                  }
                                  if (req?.startDate && req?.endDate) {
                                    const start = new Date(req.startDate);
                                    const end = new Date(req.endDate);
                                    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                    const weeks = Math.round(diffDays / 7);
                                    return diffDays >= 7 ? `${weeks} ${weeks === 1 ? "Week" : "Weeks"} (${diffDays}d)` : `${diffDays} Days`;
                                  }
                                  if (req?.isOngoing || req?.durationCategory === "PERMANENT") {
                                    return "Ongoing / Permanent Care";
                                  }
                                  return "Ongoing Placement";
                                })()}
                              </span>
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
                        </div>

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

              {/* Active / Confirmed Placements List (Mockup 1 #2) */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200/80">
                  Confirmed & Active Placements ({primaryPlacements.length + backupPlacements.length})
                </h4>

                {primaryPlacements.length === 0 && backupPlacements.length === 0 ? (
                  <div className="text-center p-10 rounded-2xl border border-gold-300/10 bg-navy-900/40 space-y-2">
                    <p className="text-sm text-gold-100/80 font-semibold">
                      No active primary or backup placements currently.
                    </p>
                    <p className="text-xs text-gold-100/50">
                      Check the <strong>Relief Opportunities</strong> tab to review open relief offers.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Primary Placements */}
                    {primaryPlacements.map((place) => {
                      const clientName = `${place.clientProfile?.user?.firstName || "Client"} ${place.clientProfile?.user?.lastName || ""}`.trim();
                      const locationStr = place.careRequest?.city || place.careRequest?.postcode || "London";

                      return (
                        <div
                          key={place.id}
                          className="p-5 rounded-2xl border border-gold-300/15 bg-gradient-to-br from-navy-900 to-navy-950 shadow-lg space-y-4 hover:border-gold-300/30 transition-all"
                        >
                          {/* Header row with Client and Role Badge */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                                <User className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white">{clientName}</h4>
                                <div className="flex items-center gap-2 text-xs text-gold-100/70 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                  <span>{locationStr}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(place.startDate).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}{" "}
                                    – {place.endDate ? new Date(place.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Ongoing"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Role Badge (Mockup 1 #2) */}
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <div>
                                  <span className="font-bold block">Primary Carer</span>
                                  <span className="text-[10px] text-emerald-300/70">
                                    You are the main carer for this placement
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gold-100/80 bg-navy-950/50 p-3.5 rounded-xl border border-gold-300/10">
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Care Category
                              </span>
                              <span className="text-gold-100 font-medium">
                                {Array.isArray(place.careRequest?.careCategory)
                                  ? place.careRequest.careCategory.join(", ")
                                  : place.careRequest?.careCategory || "Live-in Care"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Contact Information
                              </span>
                              {place.contactDetailsReleased ? (
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Details Unlocked
                                </span>
                              ) : (
                                <span className="text-amber-400 font-medium flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" /> Direct Contact Unlocks 48h prior
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Continuity Cover
                              </span>
                              <span className="text-gold-200">
                                Preferred Backup Carer
                              </span>
                            </div>
                          </div>

                          {/* Actions: View Details, Book Time Off, Withdraw */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              {/* Book Holiday / Time Off Button (Mockup 3 #2) */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setTimeOffPlacement({
                                    id: place.id,
                                    clientName,
                                  })
                                }
                                className="text-xs !border-amber-500/30 !text-amber-300 hover:!bg-amber-500/10"
                              >
                                <Plane className="w-3.5 h-3.5 mr-1 text-amber-400" />
                                Book Holiday / Time Off
                              </Button>

                              {/* 3-Tier Withdrawal Guardrail Button */}
                              <Button
                                variant="ghost-gold"
                                size="sm"
                                onClick={() =>
                                  setWithdrawalPlacement({
                                    id: place.id,
                                    clientName,
                                    startDate: place.startDate,
                                    status: place.status,
                                  })
                                }
                                className="text-xs text-rose-400 hover:text-rose-300"
                              >
                                <LogOut className="w-3.5 h-3.5 mr-1" />
                                Withdraw
                              </Button>
                            </div>

                            <Button
                              variant="ghost-gold"
                              size="sm"
                              onClick={() => setSelectedPlacementId(place.id)}
                              className="text-xs group"
                            >
                              View Details <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Preferred Backup Carer Placements */}
                    {backupPlacements.map((place) => {
                      const clientName = place.clientName || "Client";
                      const locationStr = place.city || place.postcode || "London";

                      return (
                        <div
                          key={place.id}
                          className="p-5 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-navy-900 via-navy-900 to-amber-950/20 shadow-lg space-y-4 hover:border-amber-500/40 transition-all"
                        >
                          {/* Header row with Client and Role Badge */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                                <User className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white">{clientName}</h4>
                                <div className="flex items-center gap-2 text-xs text-gold-100/70 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                  <span>{locationStr}</span>
                                  <span>•</span>
                                  <span className="text-amber-200/90 font-medium">
                                    {place.startDateText || "No dates assigned yet"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Role Badge */}
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
                                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                                <div>
                                  <span className="font-bold block text-amber-200">
                                    Preferred Backup Carer
                                  </span>
                                  <span className="text-[10px] text-amber-300/80 leading-tight block">
                                    You are selected as preferred backup for this client, and will be offered dates when relief is required
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gold-100/80 bg-navy-950/50 p-3.5 rounded-xl border border-gold-300/10">
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Care Category
                              </span>
                              <span className="text-gold-100 font-medium">
                                {Array.isArray(place.careCategory)
                                  ? place.careCategory.join(", ")
                                  : place.careCategory || "Live-in Companion Support"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Relief Schedule
                              </span>
                              <span className="text-amber-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Standby for Relief Requests
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                                Continuity Role
                              </span>
                              <span className="text-gold-200 font-semibold">
                                Preferred Backup Carer
                              </span>
                            </div>
                          </div>

                          {/* Actions: Info note on left, View Details on right */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2 text-[11px] text-gold-100/60">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>You will be offered dates first whenever this client&apos;s primary carer requests relief or time off.</span>
                            </div>

                            <Button
                              variant="ghost-gold"
                              size="sm"
                              onClick={() => setSelectedPlacementId(place.id)}
                              className="text-xs group"
                            >
                              View Details <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RELIEF OPPORTUNITIES (Mockup 1 #3) */}
          {activeSubTab === "relief" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gold-200">
                    Relief Placement Opportunities
                  </h4>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    When the primary carer is unavailable, you receive relief offers as the client's
                    preferred backup carer.
                  </p>
                </div>
              </div>

              {reliefOffers.length === 0 ? (
                <div className="text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/40 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-300/10 text-gold-300 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-white">No Pending Relief Offers</h5>
                  <p className="text-xs text-gold-100/60 max-w-sm mx-auto leading-relaxed">
                    You have no relief placement offers awaiting response right now. As clients' primary
                    carers book holiday, new relief opportunities will show here for your acceptance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reliefOffers.map((offer) => {
                    const startFormatted = new Date(offer.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const endFormatted = new Date(offer.endDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={offer.id}
                        className="p-6 rounded-2xl border-2 border-amber-500/40 bg-navy-900 shadow-xl space-y-4 relative overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                              {offer.clientName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold text-white">{offer.clientName}</h4>
                                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                                  Relief Cover Opportunity
                                </span>
                              </div>
                              <p className="text-xs text-gold-100/70 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                <span>{offer.location}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase text-gold-100/50 font-bold block">
                              Duration
                            </span>
                            <span className="text-sm font-bold text-amber-300">
                              {offer.nightsCount} nights / days
                            </span>
                          </div>
                        </div>

                        {/* Dates info box */}
                        <div className="p-3.5 rounded-xl bg-navy-950/70 border border-gold-300/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-gold-100 font-medium">
                            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              {startFormatted} – {endFormatted}
                            </span>
                          </div>
                        </div>

                        {offer.requirements && (
                          <p className="text-xs text-gold-100/70 italic">
                            "{offer.requirements}"
                          </p>
                        )}

                        {/* Actions */}
                        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gold-300/10">
                          <button
                            type="button"
                            onClick={() => setActiveReliefOffer(offer)}
                            className="text-xs text-gold-300 hover:text-gold-200 hover:underline font-semibold cursor-pointer"
                          >
                            View Placement Details
                          </button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveReliefOffer(offer)}
                              className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                            >
                              Decline
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setActiveReliefOffer(offer)}
                              className="text-xs font-bold shadow-md shadow-gold/20"
                            >
                              Review & Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAST PLACEMENTS */}
          {activeSubTab === "past" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200/80">
                Completed & Historic Placements ({pastPlacements.length})
              </h4>

              {pastPlacements.length === 0 ? (
                <div className="text-center p-10 rounded-2xl border border-gold-300/10 bg-navy-900/40">
                  <p className="text-xs text-gold-100/50">No historic placements recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastPlacements.map((place) => (
                    <SectionCard key={place.id} className="space-y-4 opacity-90">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/5 pb-4">
                        <div>
                          <h4 className="text-base font-bold text-gold-200">
                            {Array.isArray(place.careRequest?.careCategory)
                              ? place.careRequest.careCategory.join(", ")
                              : place.careRequest?.careCategory || "Live-in Care"}
                          </h4>
                          <p className="text-xs text-gold-100/60 mt-0.5">
                            Client: {place.clientProfile?.user?.firstName}{" "}
                            {place.clientProfile?.user?.lastName}
                          </p>
                        </div>
                        <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold-300/10 text-gold-200 border border-gold-300/20">
                          {place.status?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPlacementId(place.id)}
                          className="text-xs"
                        >
                          View Historical Details
                        </Button>
                      </div>
                    </SectionCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RULES & TIMELINE GUIDELINES (Mockup 1 #4 & #5) */}
          {activeSubTab === "guidelines" && (
            <div className="space-y-6">
              <PlacementTimeline currentStep={3} />
              <PlacementRulesCard />
            </div>
          )}
        </div>
      )}

      {/* Decline Offer Modal (Standard placement) */}
      {declineModalPlacementId && (
        <DeclineOfferModal
          placementId={declineModalPlacementId}
          onClose={() => setDeclineModalPlacementId(null)}
          onDeclined={fetchPlacementsAndOffers}
        />
      )}

      {/* Placement Detail Modal */}
      {selectedPlacementId && (
        <PlacementDetailModal
          placementId={selectedPlacementId}
          onClose={() => setSelectedPlacementId(null)}
          onAccepted={fetchPlacementsAndOffers}
          onDeclineClick={() => setDeclineModalPlacementId(selectedPlacementId)}
        />
      )}

      {/* Relief Opportunity Modal */}
      {activeReliefOffer && (
        <ReliefOpportunityModal
          offer={activeReliefOffer}
          isOpen={!!activeReliefOffer}
          onClose={() => setActiveReliefOffer(null)}
          onOfferHandled={fetchPlacementsAndOffers}
        />
      )}

      {/* Book Holiday / Time Off Modal */}
      {timeOffPlacement && (
        <BookTimeOffModal
          placementId={timeOffPlacement.id}
          clientName={timeOffPlacement.clientName}
          isOpen={!!timeOffPlacement}
          onClose={() => setTimeOffPlacement(null)}
          onLeaveBooked={fetchPlacementsAndOffers}
        />
      )}

      {/* 3-Tier Withdrawal Guardrail Modal */}
      {withdrawalPlacement && (
        <WithdrawalGuardrailModal
          placementId={withdrawalPlacement.id}
          clientName={withdrawalPlacement.clientName}
          startDate={withdrawalPlacement.startDate}
          status={withdrawalPlacement.status}
          isOpen={!!withdrawalPlacement}
          onClose={() => setWithdrawalPlacement(null)}
          onWithdrawn={fetchPlacementsAndOffers}
        />
      )}
    </div>
  );
}

