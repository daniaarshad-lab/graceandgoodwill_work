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
  CalendarClock,
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
import { ReliefOffer, PreferredBackupDesignation, ConfirmedReliefAssignment } from "@/types/backupCarer.types";
import CarerPlacementDetailModal from "./CarerPlacementDetailModal";

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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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

export default function CarerPlacements() {
  const [placements, setPlacements] = useState<CarerPlacement[]>([]);
  const [reliefOffers, setReliefOffers] = useState<ReliefOffer[]>([]);
  const [confirmedReliefAssignments, setConfirmedReliefAssignments] = useState<ConfirmedReliefAssignment[]>([]);
  const [acceptingReliefId, setAcceptingReliefId] = useState<string | null>(null);
  const [decliningReliefId, setDecliningReliefId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sub-tabs: "current" (Active), "offers" (Awaiting Decision), "backups" (Standby Roster), "past" (History), "guidelines" (Rules)
  const [activeSubTab, setActiveSubTab] = useState<
    "current" | "offers" | "backups" | "past" | "guidelines"
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
      const [placementsData, offersData, backupData, confirmedData] = await Promise.all([
        carerService.getPlacements().catch(() => []),
        backupCarerService.getReliefOpportunities().catch(() => []),
        backupCarerService.getPreferredBackupPlacements(profile?.id).catch(() => []),
        backupCarerService.getConfirmedReliefAssignments().catch(() => []),
      ]);
      setPlacements(placementsData);
      setReliefOffers(offersData);
      setBackupPlacements(backupData);
      setConfirmedReliefAssignments(confirmedData);
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

  // Helper: Detect if a placement has confirmed active relief coverage
  const isCoveringRelief = (place: CarerPlacement) => {
    return (
      place.myRole === "ACTIVE_RELIEF_CARER" ||
      place.activeReliefCarerProfileId === profile?.id ||
      place.assignments?.some(
        (a: any) =>
          (a.carerProfileId === profile?.id || !a.carerProfileId) &&
          (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
          ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
      ) ||
      place.leaveRequests?.some(
        (l: any) =>
          l.status === "COVER_CONFIRMED" &&
          (l.offeredCarerProfileId === profile?.id ||
            place.preferredBackupCarerProfileId === profile?.id ||
            place.backupCarers?.some((b: any) => b.carerProfileId === profile?.id))
      )
    );
  };

  // Helper: Detect if placement is a standby backup designation (and not actively covering relief)
  const isBackupDesignation = (place: CarerPlacement) => {
    if (isCoveringRelief(place)) return false;
    return (
      Boolean(place.isBackup) ||
      place.myRole === "PREFERRED_BACKUP_CARER" ||
      place.myRole === "SECONDARY_BACKUP_CARER" ||
      Boolean(place.roleTitle && place.roleTitle.toLowerCase().includes("backup")) ||
      Boolean(place.carerProfileId && profile?.id && place.carerProfileId !== profile.id) ||
      place.preferredBackupCarerProfileId === profile?.id ||
      place.backupCarers?.some((b: any) => b.carerProfileId === profile?.id)
    );
  };

  // 1. Current & Upcoming: Confirmed active working placements (Lead Primary Carer OR Active Relief Carer covering dates)
  const activePlacements = placements.filter(
    (p) =>
      ["PLACEMENT_CONFIRMED", "PLACEMENT_STARTED", "ACTIVE", "ONGOING"].includes(p.status) &&
      !isBackupDesignation(p)
  );

  // 2. Offers: Pending primary match offers + pending relief opportunities
  const pendingPrimaryOffers = placements.filter(
    (p) => p.status === "PENDING_ACCEPTANCE"
  );
  const totalOffersCount = pendingPrimaryOffers.length + reliefOffers.length;

  // 3. Backup Designations: Placements where carer is designated as 1st or 2nd backup (standby roster)
  const backupDesignationsFromPlacements = placements.filter(
    (p) =>
      ["PLACEMENT_CONFIRMED", "PLACEMENT_STARTED", "ACTIVE", "ONGOING"].includes(p.status) &&
      isBackupDesignation(p)
  );
  const uniqueExternalBackups = backupPlacements.filter(
    (bp) =>
      !placements.some((p) => p.id === bp.id || `backup-${p.id}` === bp.id)
  );
  const backupDesignationsList = [
    ...backupDesignationsFromPlacements,
    ...uniqueExternalBackups,
  ];

  // 4. Past Placements
  const pastPlacements = placements.filter(
    (p) =>
      p.status === "COMPLETED" ||
      p.status === "CANCELLED" ||
      p.status === "REJECTED_BY_CARER" ||
      p.status === "TERMINATED"
  );

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation - Clean 4-Tab Separation */}
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
          {activePlacements.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeSubTab === "current"
                  ? "bg-navy-950 text-gold"
                  : "bg-gold-300/20 text-gold-200"
              }`}
            >
              {activePlacements.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("offers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "offers"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Offers</span>
          {totalOffersCount > 0 && (
            <span className="text-[10px] bg-amber-500 text-navy-950 font-bold px-2 py-0.5 rounded-full animate-pulse">
              {totalOffersCount} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("backups")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "backups"
              ? "bg-gold text-navy-950 shadow-md shadow-gold/20"
              : "bg-navy-900/60 text-gold-100/70 hover:text-gold-200 hover:bg-navy-900 border border-gold-300/10"
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Backup Designations</span>
          {backupDesignationsList.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeSubTab === "backups"
                  ? "bg-navy-950 text-gold"
                  : "bg-gold-300/20 text-gold-200"
              }`}
            >
              {backupDesignationsList.length}
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
          {/* ========================================================= */}
          {/* TAB 1: CURRENT & UPCOMING (ACTIVE WORK ONLY)              */}
          {/* ========================================================= */}
          {activeSubTab === "current" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gold-200">
                    Active Placements & Confirmed Relief Coverage
                  </h4>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Live-in care placements where you are currently placed as primary carer or actively covering relief dates.
                  </p>
                </div>
              </div>

              {activePlacements.length === 0 ? (
                <div className="text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/40 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-300/10 text-gold-300 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-white">No Active Placements Currently</h5>
                  <p className="text-xs text-gold-100/60 max-w-sm mx-auto leading-relaxed">
                    You have no active live-in or relief engagements scheduled. Check the <strong className="text-gold-200">Offers</strong> tab for open placement or relief opportunities, or review your standby clients under <strong className="text-gold-200">Backup Designations</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activePlacements.map((place) => {
                    const clientName = `${place.clientProfile?.user?.firstName || "Client"} ${place.clientProfile?.user?.lastName || ""}`.trim();
                    const locationStr = place.careRequest?.city || place.careRequest?.postcode || "London";

                    const hasActiveReliefAssignment = place.assignments?.some(
                      (a: any) =>
                        (a.carerProfileId === profile?.id || !a.carerProfileId) &&
                        (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
                        ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
                    );

                    const hasConfirmedLeave = place.leaveRequests?.some(
                      (l: any) =>
                        l.status === "COVER_CONFIRMED" &&
                        (l.offeredCarerProfileId === profile?.id ||
                          place.preferredBackupCarerProfileId === profile?.id ||
                          place.backupCarers?.some((b: any) => b.carerProfileId === profile?.id))
                    );

                    const isReliefCovering =
                      place.myRole === "ACTIVE_RELIEF_CARER" ||
                      place.activeReliefCarerProfileId === profile?.id ||
                      hasActiveReliefAssignment ||
                      hasConfirmedLeave;

                    const confirmedLeave = place.leaveRequests?.find(
                      (l: any) =>
                        l.status === "COVER_CONFIRMED" &&
                        (l.offeredCarerProfileId === profile?.id ||
                          place.preferredBackupCarerProfileId === profile?.id ||
                          place.backupCarers?.some((b: any) => b.carerProfileId === profile?.id))
                    );
                    const reliefAssignment = place.assignments?.find(
                      (a: any) =>
                        (a.carerProfileId === profile?.id || !a.carerProfileId) &&
                        (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
                        ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
                    );
                    const reliefStartDate = reliefAssignment?.startDate || confirmedLeave?.startDate;
                    const reliefEndDate = reliefAssignment?.endDate || confirmedLeave?.endDate;
                    const reliefDatesStr = reliefStartDate
                      ? `${new Date(reliefStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${
                          reliefEndDate
                            ? new Date(reliefEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                            : "Ongoing"
                        }`
                      : "";

                    return (
                      <div
                        key={place.id}
                        className={`p-5 rounded-2xl border shadow-lg space-y-4 transition-all ${
                          isReliefCovering
                            ? "border-teal-500/30 bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950/20 hover:border-teal-500/50"
                            : "border-emerald-500/25 bg-gradient-to-br from-navy-900 via-navy-900 to-emerald-950/20 hover:border-emerald-500/40"
                        }`}
                      >
                        {/* Header row with Client and Role Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                isReliefCovering
                                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {isReliefCovering ? (
                                <CalendarClock className="w-5 h-5 text-teal-400" />
                              ) : (
                                <User className="w-5 h-5 text-emerald-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-white">{clientName}</h4>
                              <div className="flex items-center gap-2 text-xs text-gold-100/70 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                <span>{locationStr}</span>
                                <span>•</span>
                                <span>
                                  {isReliefCovering ? (
                                    <span className="text-teal-300 font-semibold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                      Providing relief care: {reliefDatesStr || "Scheduled period"}
                                    </span>
                                  ) : (
                                    <>
                                      {new Date(place.startDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}{" "}
                                      – {place.endDate ? new Date(place.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Ongoing"}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Role Badge */}
                          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                            {isReliefCovering ? (
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs">
                                <CalendarClock className="w-4 h-4 text-teal-400 shrink-0" />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold block text-teal-200">
                                      Active Relief Carer
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                                      Covering
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-teal-300/80">
                                    Accepted relief dates & covering
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                                <div>
                                  <span className="font-bold block">Primary Carer</span>
                                  <span className="text-[10px] text-emerald-300/70">
                                    You are the main carer for this placement
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Role Explanation Notice */}
                        {isReliefCovering ? (
                          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-2.5 text-xs text-teal-200/90 leading-relaxed">
                            <CalendarClock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-bold text-teal-300 text-xs">
                                Active Relief Coverage: {reliefDatesStr || "Accepted relief dates"}
                              </p>
                              <p className="text-[11px] text-teal-200/80">
                                You have accepted specific relief dates and are covering this placement during primary carer time off.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-200/90 leading-relaxed">
                            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-bold text-emerald-300 text-xs">
                                Active Lead Live-in Placement
                              </p>
                              <p className="text-[11px] text-emerald-200/80">
                                You are the confirmed primary live-in carer providing dedicated support for this client.
                              </p>
                            </div>
                          </div>
                        )}

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
                            {isReliefCovering ? (
                              <span className="text-teal-300 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Details Unlocked for Relief
                              </span>
                            ) : place.contactDetailsReleased ? (
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
                              Continuity Role
                            </span>
                            <span className={isReliefCovering ? "text-teal-300 font-semibold" : "text-emerald-400 font-semibold"}>
                              {isReliefCovering
                                ? "Active Relief Carer • Covering"
                                : "Lead Primary Carer"}
                            </span>
                          </div>
                        </div>

                        {/* Actions: View Details, Book Time Off, Withdraw */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            {!isReliefCovering && (
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
                            )}

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
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: OFFERS (ALL PENDING PRIMARY & RELIEF OFFERS)       */}
          {/* ========================================================= */}
          {(activeSubTab === "offers" || (activeSubTab as any) === "relief") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gold-200">
                    Placement & Relief Offers Awaiting Decision
                  </h4>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Review and respond to new live-in matches and relief coverage requests awaiting your decision.
                  </p>
                </div>
                {totalOffersCount > 0 && (
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {totalOffersCount} Action{totalOffersCount > 1 ? "s" : ""} Required
                  </span>
                )}
              </div>

              {totalOffersCount === 0 ? (
                <div className="text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/40 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-300/10 text-gold-300 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-white">No Pending Offers Right Now</h5>
                  <p className="text-xs text-gold-100/60 max-w-sm mx-auto leading-relaxed">
                    You have no placement or relief offers awaiting response. When clients select you for a primary placement or relief dates are requested for your backup clients, offers will show here.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Section A: Primary Live-in Placement Match Offers */}
                  {pendingPrimaryOffers.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gold">
                        <Sparkles className="w-5 h-5 text-gold animate-bounce" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200">
                          Primary Live-in Placement Matches ({pendingPrimaryOffers.length})
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

                  {/* Section B: Relief Coverage Opportunities */}
                  {reliefOffers.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                          Relief Coverage Opportunities ({reliefOffers.length})
                        </h4>
                      </div>

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
                                    {offer.nightsCount} days
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

                              {/* Actions / Status */}
                              {offer.status === "OFFER_DECLINED" ? (
                                <div className="pt-3 border-t border-gold-300/10">
                                  <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                                    <XCircle className="w-4 h-4" />
                                    You declined this relief opportunity.
                                  </div>
                                </div>
                              ) : (
                                <div className="pt-3 border-t border-gold-300/10">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setActiveReliefOffer(offer)}
                                      className="text-xs text-gold-300 hover:text-gold-200 hover:underline font-semibold cursor-pointer"
                                    >
                                      View Full Details
                                    </button>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={decliningReliefId === offer.assignmentId || acceptingReliefId === offer.assignmentId}
                                        onClick={async () => {
                                          setDecliningReliefId(offer.assignmentId);
                                          try {
                                            await backupCarerService.declineReliefOffer(offer.assignmentId, "Declined by carer");
                                            showSuccessToast("Offer Declined", "The relief offer has been declined.");
                                            fetchPlacementsAndOffers();
                                          } catch (err: any) {
                                            showErrorToast("Error", err.message || "Failed to decline offer.");
                                          } finally {
                                            setDecliningReliefId(null);
                                          }
                                        }}
                                        className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                                      >
                                        {decliningReliefId === offer.assignmentId ? "Declining..." : "Decline"}
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        disabled={acceptingReliefId === offer.assignmentId || decliningReliefId === offer.assignmentId}
                                        onClick={async () => {
                                          setAcceptingReliefId(offer.assignmentId);
                                          try {
                                            await backupCarerService.acceptReliefOffer(offer.assignmentId);
                                            showSuccessToast(
                                              "Confirmed!",
                                              "You are covering for " + offer.clientName + ". Placement is confirmed in Current & Upcoming."
                                            );
                                            fetchPlacementsAndOffers();
                                            setActiveSubTab("current");
                                          } catch (err: any) {
                                            showErrorToast("Error", err.message || "Failed to accept offer.");
                                          } finally {
                                            setAcceptingReliefId(null);
                                          }
                                        }}
                                        className="text-xs font-bold shadow-md shadow-gold/20"
                                      >
                                        {acceptingReliefId === offer.assignmentId ? "Accepting..." : "Accept"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BACKUP DESIGNATIONS (STANDBY ROSTER)               */}
          {/* ========================================================= */}
          {activeSubTab === "backups" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Clients who have selected you as their preferred backup carer for seamless multi-carer continuity.
                  </p>
                </div>
              </div>

              {backupDesignationsList.length === 0 ? (
                <div className="text-center p-12 rounded-2xl border border-gold-300/10 bg-navy-900/40 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gold-300/10 text-gold-300 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-white">No preferred Backup Designations</h5>
                  <p className="text-xs text-gold-100/60 max-w-sm mx-auto leading-relaxed">
                    When clients select you as their preferred or secondary backup carer for continuity of care, they will appear here on your standby roster.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backupDesignationsList.map((place: any) => {
                    const clientName = place.clientProfile?.user
                      ? `${place.clientProfile.user.firstName || "Client"} ${place.clientProfile.user.lastName || ""}`.trim()
                      : place.clientName || "Client";
                    const locationStr = place.careRequest?.city || place.careRequest?.postcode || place.city || place.postcode || "London, UK";
                    const isSecondBackup =
                      place.backupPriority === 2 ||
                      place.backupCarers?.some((b: any) => b.carerProfileId === profile?.id && b.priority === 2);
                    const roleTitle = isSecondBackup ? "2nd Choice Backup Carer" : "1st Choice Preferred Backup";

                    return (
                      <div
                        key={place.id}
                        className={`p-5 rounded-2xl border shadow-lg space-y-4 transition-all ${
                          isSecondBackup
                            ? "border-blue-500/25 bg-gradient-to-br from-navy-900 via-navy-900 to-blue-950/20 hover:border-blue-500/40"
                            : "border-amber-500/25 bg-gradient-to-br from-navy-900 via-navy-900 to-amber-950/20 hover:border-amber-500/40"
                        }`}
                      >
                        {/* Header row with Client and Role Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                isSecondBackup
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              <Users className={`w-5 h-5 ${isSecondBackup ? "text-blue-400" : "text-amber-400"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white">{clientName}</h4>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                    isSecondBackup
                                      ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                      : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                  }`}
                                >
                                  {roleTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gold-100/70 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                                <span>{locationStr}</span>
                                <span>•</span>
                                <span className="text-gold-100/60">
                                  {place.startDateText || "Standby (No relief dates assigned yet)"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Standby Status Badge */}
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <div
                              className={`flex items-center gap-2 p-2 rounded-xl border text-xs ${
                                isSecondBackup
                                  ? "bg-blue-950/40 border-blue-500/30 text-blue-300"
                                  : "bg-amber-950/40 border-amber-500/30 text-amber-300"
                              }`}
                            >
                              <Shield className="w-4 h-4 shrink-0" />
                              <div>
                                <span className="font-bold block">
                                  {isSecondBackup ? "2nd Backup Roster" : "1st Backup Roster"}
                                </span>
                                <span className="text-[10px] opacity-80">
                                  Standby • Zero Extra Charge
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Preferred Backup Explanation Notice */}
                        <div
                          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
                            isSecondBackup
                              ? "bg-blue-500/10 border-blue-500/25 text-blue-200/90"
                              : "bg-amber-500/10 border-amber-500/25 text-amber-200/90"
                          }`}
                        >
                          <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isSecondBackup ? "text-blue-400" : "text-amber-400"}`} />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs">
                              {isSecondBackup
                                ? "You are selected as 2nd choice backup safety net"
                                : "You are selected as preferred 1st choice backup"}
                            </p>
                            <p className="text-[11px] opacity-80">
                              Dates will be offered in your Offers tab when the primary carer requests holiday or emergency leave. You can accept or decline dates when offered.
                            </p>
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
                                : place.careRequest?.careCategory || place.careCategory || "Live-in Companion Support"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                              Relief Status
                            </span>
                            <span className="text-amber-300/90 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Standby for Relief Requests
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-gold-100/40 font-bold block mb-0.5">
                              Designation Priority
                            </span>
                            <span className={isSecondBackup ? "text-blue-300 font-semibold" : "text-amber-300 font-semibold"}>
                              {isSecondBackup ? "2nd Choice Backup" : "1st Choice Preferred Backup"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <Button
                            variant="ghost-gold"
                            size="sm"
                            onClick={() =>
                              setWithdrawalPlacement({
                                id: place.id,
                                clientName,
                                startDate: place.startDate || new Date().toISOString(),
                                status: place.status || "CONFIRMED",
                              })
                            }
                            className="text-xs text-rose-400 hover:text-rose-300"
                          >
                            <LogOut className="w-3.5 h-3.5 mr-1" />
                            Withdraw as Backup
                          </Button>

                          <Button
                            variant="ghost-gold"
                            size="sm"
                            onClick={() => setSelectedPlacementId(place.id)}
                            className="text-xs group"
                          >
                            View Placement Details <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                          </Button>
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
        <CarerPlacementDetailModal
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

