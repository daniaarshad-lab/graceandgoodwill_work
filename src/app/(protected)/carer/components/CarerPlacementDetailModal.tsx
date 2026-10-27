"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  X,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Download,
  Users,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plane,
  Lock,
  Shield,
  XCircle,
  Phone,
  Mail,
  CalendarClock,
  LogOut,
  Info,
  Save,
  ArrowRight,
  ClipboardList,
  Plus,
} from "lucide-react";
import { carerService } from "@/services/carer/carer.service";
import { backupCarerService } from "@/services/backupCarer.service";
import { useAppSelector } from "@/store/hooks";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import HandoverNotesManager from "@/components/backup-carer/HandoverNotesManager";

interface CarerPlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
  onAccepted?: () => void;
  onDeclineClick?: () => void;
  isPage?: boolean;
}

type CarerPlacementTab = "overview" | "schedule" | "handover" | "requirements" | "payments";

export default function CarerPlacementDetailModal({
  placementId,
  onClose,
  onAccepted,
  onDeclineClick,
  isPage = false,
}: CarerPlacementDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CarerPlacementTab>("overview");

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  // Departure Confirmation State
  const [showDepartureConfirm, setShowDepartureConfirm] = useState(false);
  const [isConfirmingDeparture, setIsConfirmingDeparture] = useState(false);

  // Leave Request Cancellation State
  const [cancellingLeaveId, setCancellingLeaveId] = useState<string | null>(null);

  // Target Leave Request for Handover Tab Redirection
  const [targetHandoverLeaveId, setTargetHandoverLeaveId] = useState<string | null>(null);

  // Hook must be called unconditionally at top of component
  const { profile } = useAppSelector((state) => state.carer);

  useEffect(() => {
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const loadPlacement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
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
            requirements:
              found.notes ||
              "You are selected as preferred backup for this client, and will be offered dates when relief is required.",
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
  }, [placementId]);

  useEffect(() => {
    loadPlacement();
  }, [loadPlacement]);

  // Support ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await carerService.acceptPlacement(placementId);
      showSuccessToast(
        "Placement Accepted!",
        "Your care placement offer is confirmed."
      );
      if (onAccepted) onAccepted();
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to accept placement.");
    } finally {
      setAccepting(false);
    }
  };

  const handleConfirmDeparture = async () => {
    setIsConfirmingDeparture(true);
    try {
      await backupCarerService.confirmPlacementDeparture(placementId);
      showSuccessToast(
        "Departure Confirmed",
        "Your departure has been recorded. The Grace & Goodwill team has been notified."
      );
      setShowDepartureConfirm(false);
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to confirm departure.");
    } finally {
      setIsConfirmingDeparture(false);
    }
  };

  const handleCancelLeave = async (leaveId: string) => {
    if (!window.confirm("Are you sure you want to cancel this planned unavailability request?")) {
      return;
    }
    setCancellingLeaveId(leaveId);
    try {
      await backupCarerService.cancelLeaveRequest(leaveId);
      showSuccessToast("Request Cancelled", "Your unavailability request has been cancelled.");
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to cancel unavailability request.");
    } finally {
      setCancellingLeaveId(null);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return createPortal(
      <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 flex items-center justify-center bg-navy-950 text-gold-100">
        <ThinSpinner size="xl" text="Loading placement workspace..." />
      </div>,
      document.body
    );
  }

  if (error || !placement) {
    return createPortal(
      <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 flex items-center justify-center bg-navy-950 p-6 text-gold-100">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-navy-900 p-8 text-center space-y-4 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-rose-400 mx-auto" />
          <h3 className="text-xl font-bold text-rose-400">
            Error Loading Details
          </h3>
          <p className="text-sm text-gold-100/70">{error}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            ← Back to Placements
          </Button>
        </div>
      </div>,
      document.body
    );
  }

  const isPendingOffer = placement.status === "PENDING_ACCEPTANCE";
  const isRejected = placement.status === "REJECTED_BY_CARER";
  const isModalBackup =
    Boolean(placement.isBackup) ||
    placement.myRole === "PREFERRED_BACKUP_CARER" ||
    placement.myRole === "SECONDARY_BACKUP_CARER" ||
    Boolean(placement.isPreferredBackup) ||
    Boolean(placement.roleTitle && placement.roleTitle.toLowerCase().includes("backup")) ||
    Boolean(placement.carerProfileId && profile?.id && placement.carerProfileId !== profile.id) ||
    placement.preferredBackupCarerProfileId === profile?.id ||
    placement.backupCarers?.some((b: any) => b.carerProfileId === profile?.id);

  const hasActiveReliefAssignment = placement.assignments?.some(
    (a: any) =>
      (a.carerProfileId === profile?.id || !a.carerProfileId) &&
      (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
      ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
  );

  const hasConfirmedLeave = placement.leaveRequests?.some(
    (l: any) =>
      l.status === "COVER_CONFIRMED" &&
      (l.offeredCarerProfileId === profile?.id || isModalBackup)
  );

  const isReliefCovering =
    placement.myRole === "ACTIVE_RELIEF_CARER" ||
    placement.activeReliefCarerProfileId === profile?.id ||
    hasActiveReliefAssignment ||
    hasConfirmedLeave;

  const confirmedLeave = placement.leaveRequests?.find(
    (l: any) =>
      l.status === "COVER_CONFIRMED" &&
      (l.offeredCarerProfileId === profile?.id || isModalBackup)
  );
  const reliefAssignment = placement.assignments?.find(
    (a: any) =>
      (a.carerProfileId === profile?.id || !a.carerProfileId) &&
      (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
      ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
  );
  const reliefStartDate = reliefAssignment?.startDate || confirmedLeave?.startDate;
  const reliefEndDate = reliefAssignment?.endDate || confirmedLeave?.endDate;
  const reliefDatesText = reliefStartDate
    ? `${new Date(reliefStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${
        reliefEndDate
          ? new Date(reliefEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : "Ongoing"
      }`
    : "";

  const formatCareTitle = (category: any) => {
    if (!category) return "24/7 Live-in Care";
    if (Array.isArray(category)) {
      return category.filter(Boolean).join(" • ");
    }
    const str = String(category);
    return str.replace(/([a-z])([0-9A-Z])/g, "$1 • $2");
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Flexible / TBD";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const clientName = placement.clientProfile?.user
    ? `${placement.clientProfile.user.firstName || ""} ${placement.clientProfile.user.lastName || ""}`.trim()
    : "Care Client";

  const formattedTitle = formatCareTitle(placement.careRequest?.careCategory);

  const effectiveStartDate = placement.startDate || placement.careRequest?.startDate;
  const effectiveEndDate = placement.endDate || placement.careRequest?.endDate;
  const isOngoingCare =
    !effectiveEndDate ||
    Boolean(
      placement.careRequest?.isOngoing ||
      (placement.careRequest as any)?.durationCategory === "PERMANENT"
    );

  const primaryCarer = placement.carerProfile;
  const primaryCarerName = primaryCarer
    ? `${primaryCarer.user?.firstName || primaryCarer.firstName || ""} ${
        primaryCarer.user?.lastName || primaryCarer.lastName || ""
      }`.trim() || "Primary Carer"
    : "Primary Carer";

  const parsedCustomHandoverNotes: any[] = (() => {
    if (!placement?.handoverNotes) return [];
    const raw = placement.handoverNotes.trim();
    if (raw.startsWith("[") && raw.endsWith("]")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  })();

  const totalHandoverNotesCount = (() => {
    const leaveNotesCount = (placement?.leaveRequests || []).filter((r: any) => Boolean(r.handoverNotes)).length;
    const customCount = parsedCustomHandoverNotes.length;
    return Math.max(leaveNotesCount, customCount);
  })();

  const durationText = (() => {
    const req = placement.careRequest as any;
    if (req?.duration && req.duration !== "Standard Duration") {
      return req.duration;
    }
    if (effectiveStartDate && effectiveEndDate) {
      const start = new Date(effectiveStartDate);
      const end = new Date(effectiveEndDate);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs > 0) {
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.round(diffDays / 7);
        if (diffDays >= 7) {
          return `${weeks} ${weeks === 1 ? "Week" : "Weeks"} (${diffDays} Days)`;
        }
        return `${diffDays} ${diffDays === 1 ? "Day" : "Days"}`;
      }
    }
    if (isOngoingCare) {
      return "Ongoing Live-in Care";
    }
    return "Ongoing";
  })();

  const modalContent = (
    <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 bg-navy-950 text-gold-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. TOP EXECUTIVE HEADER BAR (Matching Client & Admin)     */}
      {/* ========================================================= */}
      <header className="shrink-0 bg-navy-900/95 backdrop-blur-md border-b border-gold-300/15 px-4 sm:px-8 py-3.5 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Brand + Back to Placements */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/25 bg-navy-950 hover:bg-gold-500/10 hover:border-gold-400/40 text-xs font-bold text-gold-200 hover:text-gold-100 transition-all shadow-sm cursor-pointer"
              title="Return to Placements (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-gold-DEFAULT" />
              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-gold-300/20 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50">
                  Carer Placement Workspace
                </span>
                <span className="text-[10px] font-mono text-gold-100/40">
                  • #{placement.id.slice(0, 8)}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    isPendingOffer
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse"
                      : isRejected
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      : isReliefCovering
                      ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                      : isModalBackup
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : placement.status === "ACTIVE" ||
                        placement.status === "CONFIRMED" ||
                        placement.status === "PLACEMENT_CONFIRMED"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-gold-300/15 text-gold-200 border-gold-300/30"
                  }`}
                >
                  {isPendingOffer
                    ? "Pending Your Acceptance"
                    : isRejected
                    ? "Declined"
                    : isReliefCovering
                    ? "Active Relief Carer • Covering"
                    : isModalBackup
                    ? placement.roleTitle || "Preferred Backup • Active"
                    : placement.status?.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{clientName ? `${clientName} • ` : ""}{formattedTitle}</span>
              </h1>
            </div>
          </div>

          {/* Right: Quick Actions & Placement Dates */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap justify-end">
            {effectiveStartDate && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gold-300/20 bg-navy-950/80 text-xs font-semibold text-gold-200 shadow-sm"
                title="Placement Dates"
              >
                <Calendar className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0" />
                <span>Start: {formatDate(effectiveStartDate)}</span>
                <span className="text-gold-300/40">-</span>
                {effectiveEndDate ? (
                  <span>End: {formatDate(effectiveEndDate)}</span>
                ) : (
                  <span className="text-teal-400 font-medium">Ongoing</span>
                )}
              </div>
            )}

            {/* Carer Permanent Departure Confirmation */}
            {!isPendingOffer && !isRejected && (
              placement.carerDepartedAt ? (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 text-xs font-semibold shadow-sm"
                  title="Placement Departure Confirmed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Departed{" "}
                    {new Date(placement.carerDepartedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDepartureConfirm(true)}
                  className="!border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15 text-xs font-semibold flex items-center gap-1.5"
                  title="Confirm physical departure after permanently finishing placement"
                >
                  <LogOut className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirm I Have Left the Placement</span>
                </Button>
              )
            )}

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
                  {accepting ? "Accepting..." : "Accept Placement"}
                </Button>
              </div>
            )}

            <button
              onClick={loadPlacement}
              className="p-1.5 rounded-xl border border-gold-300/15 bg-navy-950 text-gold-100/60 hover:text-gold-200 hover:bg-gold-300/10 transition-colors cursor-pointer"
              title="Refresh placement data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. CARER TAB NAVIGATION                                  */}
      {/* ========================================================= */}
      <div className="shrink-0 bg-navy-900/90 border-b border-gold-300/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Overview & Role</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "schedule"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Relief Cover Schedule</span>
            {placement.leaveRequests && placement.leaveRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gold-DEFAULT/20 text-gold-200 font-mono text-[10px] border border-gold-DEFAULT/30">
                {placement.leaveRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setTargetHandoverLeaveId(null);
              setActiveTab("handover");
            }}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "handover"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Handover Notes</span>
            {totalHandoverNotesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gold-DEFAULT/20 text-gold-200 font-mono text-[10px] border border-gold-DEFAULT/30">
                {totalHandoverNotesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("requirements")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "requirements"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Care Needs & Client Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "payments"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment History</span>
            {payments && payments.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gold-DEFAULT/20 text-gold-200 font-mono text-[10px] border border-gold-DEFAULT/30">
                {payments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN SCROLLABLE CONTENT BODY                           */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TAB 1: OVERVIEW & ROLE */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Alert / Status Banners */}
              {isPendingOffer && (
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-navy-950 to-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                      Placement Offer Pending Acceptance
                    </h3>
                    <p className="text-xs text-amber-200/80 leading-relaxed max-w-2xl">
                      You have been matched and offered this placement. Please review the details below and confirm or decline this offer.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        if (onDeclineClick) onDeclineClick();
                      }}
                      className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAccept}
                      disabled={accepting}
                      className="text-xs font-bold"
                    >
                      {accepting ? "Accepting..." : "Accept Placement"}
                    </Button>
                  </div>
                </div>
              )}

              {isReliefCovering && (
                <div className="p-5 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-navy-950 to-teal-950/20 flex items-start gap-3.5 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-300 text-sm">
                        Active Relief Carer • Covering
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                        Confirmed Relief Coverage
                      </span>
                    </div>
                    <p className="text-xs text-gold-100/80 leading-relaxed">
                      {reliefDatesText
                        ? `You have accepted specific relief dates (${reliefDatesText}) and are actively covering for the primary carer.`
                        : "You have accepted specific relief dates and are actively covering for this placement."}
                    </p>
                  </div>
                </div>
              )}

              {isModalBackup && !isReliefCovering && (
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-navy-950 to-navy-900 flex items-start gap-3.5 shadow-xl">
                  <Shield className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-amber-300 block text-sm">
                      {placement.roleTitle || "Preferred Backup Carer • Standby Active"}
                    </span>
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      You have been selected as preferred backup for this placement. When the primary lead carer takes scheduled holiday or emergency relief is needed, relief dates will be offered to you first in your Relief Opportunities tab.
                    </p>
                  </div>
                </div>
              )}

              {isRejected && placement.rejectionReason && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>
                    <strong>Decline Reason:</strong> {placement.rejectionReason}
                  </span>
                </div>
              )}

              {/* Placement Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Your Assigned Role
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {isReliefCovering ? (
                      <CalendarClock className="w-4 h-4 text-teal-400" />
                    ) : (
                      <Shield className="w-4 h-4 text-gold-DEFAULT" />
                    )}
                    <span>
                      {isReliefCovering
                        ? "Active Relief Carer (Covering)"
                        : isModalBackup
                        ? placement.roleTitle || "Preferred Backup Carer"
                        : "Lead Primary Carer"}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Client Name
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-DEFAULT" />
                    <span>{clientName || "Protected"}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement Start Date
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                    <span>{formatDate(effectiveStartDate)}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement End Date
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                    <span>
                      {effectiveEndDate ? formatDate(effectiveEndDate) : "Ongoing Live-in Care"}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Location
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-gold-DEFAULT shrink-0" />
                    <span className="truncate">
                      {placement.careRequest?.city || placement.careRequest?.postcode || "United Kingdom"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role & Continuity Description Card */}
              <div className="p-6 rounded-2xl border border-gold-300/15 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 shadow-xl space-y-4">
                <div className="border-b border-gold-300/10 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-DEFAULT" />
                    Continuity Team Specifications
                  </h3>
             
                </div>

                <p className="text-xs text-gold-100/70 leading-relaxed">
                  {isModalBackup
                    ? "As the preferred backup carer, you provide seamless continuity for this client when their lead carer takes scheduled holiday breaks or in urgent relief situations. You have been chosen by the client/admin based on your verified credentials."
                    : "As the lead primary carer, you provide dedicated daily care. Under Grace & Goodwill's continuity model, a designated preferred backup carer is assigned to provide coverage whenever you take scheduled holiday, ensuring the client is always supported without interruption."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE & HOLIDAYS */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Schedule Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement Start Date
                  </span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                    <span>{formatDate(effectiveStartDate)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement End Date
                  </span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                    <span>
                      {effectiveEndDate ? formatDate(effectiveEndDate) : "Ongoing Live-in Care"}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement Duration
                  </span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-DEFAULT" />
                    <span>{durationText}</span>
                  </div>
                </div>
              </div>

              {/* Unavailability & Relief Cover Section */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gold-200">
                        Unavailability & Relief Cover
                      </h4>
                      <p className="text-xs text-gold-100/60 mt-0.5">
                        {isModalBackup
                          ? "Relief dates scheduled for this placement."
                          : "Scheduled planned unavailability and relief coverage."}
                      </p>
                    </div>
                  </div>
                </div>

                {isModalBackup ? (
                  <div className="p-6 rounded-xl bg-navy-950/40 border border-gold-300/10 text-xs text-gold-100/70 text-center space-y-2">
                    <p className="font-semibold text-amber-300 text-sm">
                      Standby Relief Coverage
                    </p>
                    <p className="text-gold-100/60 max-w-md mx-auto">
                      As a preferred backup carer, you cover relief when the primary carer takes time off. When relief dates become available, you will receive notifications in your Relief Opportunities tab.
                    </p>
                  </div>
                ) : !placement.leaveRequests || placement.leaveRequests.length === 0 ? (
                  <div className="p-8 rounded-xl bg-navy-950/40 border border-gold-300/10 text-xs text-gold-100/60 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-gold-300/20 mx-auto" />
                    <p className="font-semibold text-gold-200">No unavailability periods recorded yet.</p>
                    <p className="text-gold-100/50 max-w-md mx-auto">
                      Whenever you need time away, report planned unavailability on your placement card and relief cover will be arranged.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {placement.leaveRequests.map((req: any) => {
                      const isConfirmed = req.status === "COVER_CONFIRMED";
                      const isOffered = req.status === "OFFERED_TO_BACKUP";
                      const isPending = req.status === "PENDING_RELIEF";
                      const isCancelled = req.status === "CANCELLED";
                      const isApproved = Boolean(
                        req.adminNotes?.toLowerCase().includes("approved") ||
                        req.status === "NO_COVER_NEEDED"
                      );
                      const canCancel = (isPending || isOffered) && !isCancelled;

                      return (
                        <div
                          key={req.id}
                          className="p-4 sm:p-5 rounded-2xl border border-gold-300/15 bg-navy-950/60 space-y-3 shadow-sm hover:border-gold-300/30 transition-all"
                        >
                          {/* Top Row: Title, Dates, and Top-Right Cancel Button / Confirmed Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm sm:text-base">
                                  {req.reason || "Planned Unavailability"}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    isConfirmed || isApproved
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : isOffered
                                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                      : isPending
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-slate-700/40 text-slate-400 border border-slate-600/30"
                                  }`}
                                >
                                  {isConfirmed
                                    ? "Relief Cover Confirmed"
                                    : isApproved
                                    ? "Approved"
                                    : isOffered
                                    ? "Pending Backup Confirmation"
                                    : isPending
                                    ? "Awaiting Relief Cover"
                                    : isCancelled
                                    ? "Declined / Cancelled"
                                    : "Pending"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gold-100/70">
                                <Calendar className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0" />
                                <span>
                                  {new Date(req.startDate).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  –{" "}
                                  {new Date(req.endDate).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Top Right Action & Status Area */}
                            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                              {isConfirmed ? (
                                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs whitespace-nowrap">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Relief Confirmed
                                </span>
                              ) : isApproved ? (
                                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs whitespace-nowrap">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Approved
                                </span>
                              ) : isOffered ? (
                                <span className="text-blue-400 font-medium flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 text-xs whitespace-nowrap">
                                  ⏳ Awaiting backup response
                                </span>
                              ) : isCancelled ? (
                                <span className="text-slate-400 font-medium flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/30 text-xs whitespace-nowrap">
                                  Cancelled
                                </span>
                              ) : null}

                              {canCancel && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelLeave(req.id)}
                                  disabled={cancellingLeaveId === req.id}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-sm hover:scale-[1.02]"
                                  title="Cancel this leave request"
                                >
                                  {cancellingLeaveId === req.id ? (
                                    <ThinSpinner className="w-3.5 h-3.5 animate-spin text-rose-400" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                  )}
                                  <span>Cancel Request</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Beautiful Individual Leave Handover Directives Display */}
                          {(() => {
                            const matchingHandover = parsedCustomHandoverNotes.find((n: any) => n.leaveRequestId === req.id);
                            const handoverText = matchingHandover?.notes || req.handoverNotes;
                            const isComplete = Boolean(matchingHandover?.isComplete);

                            if (handoverText) {
                              return (
                                <div className="mt-2 p-4 rounded-xl border border-gold-300/20 bg-gradient-to-br from-navy-900/90 to-navy-950/90 space-y-3 shadow-inner">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gold-300/10">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gold-DEFAULT shrink-0" />
                                      <span className="text-xs font-bold text-gold-200">
                                        Handover Directives & Instructions
                                      </span>
                                    </div>
                                    {isComplete ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        Handover Verified Complete
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                                        <Clock className="w-3 h-3 text-amber-400" />
                                        Pending Completion
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-xs text-gold-100/90 bg-navy-950/80 p-3 rounded-lg border border-gold-300/10 break-words break-all whitespace-pre-wrap leading-relaxed max-w-full">
                                    {handoverText}
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-[11px] text-gold-100/70 border-t border-gold-300/10">
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <span>
                                        Added by <strong className="text-white">{matchingHandover?.authorName || primaryCarerName}</strong>
                                      </span>
                                      {(matchingHandover?.updatedAt || req.updatedAt) && (
                                        <span className="text-gold-100/50">
                                          Updated: {new Date(matchingHandover?.updatedAt || req.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-[11px] text-amber-300/80 italic hidden lg:block">
                                        To edit or mark complete, review in Handover Notes tab:
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTargetHandoverLeaveId(req.id);
                                          setActiveTab("handover");
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gold-DEFAULT/15 hover:bg-gold-DEFAULT/25 text-gold-200 border border-gold-DEFAULT/30 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                                      >
                                        <span>Go to Handover Notes</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div className="mt-2.5 p-3 rounded-xl border border-dashed border-gold-300/15 bg-navy-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gold-100/60">
                                <div className="flex items-center gap-2">
                                  <Info className="w-3.5 h-3.5 text-gold-100/40 shrink-0" />
                                  <span>No handover note recorded yet for this leave period.</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetHandoverLeaveId(req.id);
                                    setActiveTab("handover");
                                  }}
                                  className="inline-flex items-center gap-1 text-xs text-gold-DEFAULT hover:underline font-semibold cursor-pointer shrink-0"
                                >
                                  <Plus className="w-3 h-3" /> Add Handover Note
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DEDICATED HANDOVER NOTES TAB */}
          {activeTab === "handover" && (
            <div className="space-y-6">
              <HandoverNotesManager
                placement={placement}
                currentUserName={
                  profile
                    ? `${(profile as any).user?.firstName || (profile as any).firstName || ""}`.trim() +
                      ((profile as any).user?.lastName || (profile as any).lastName
                        ? ` ${(profile as any).user?.lastName || (profile as any).lastName}`.trim()
                        : "") || "Carer"
                    : "Carer"
                }
                currentUserRole={
                  placement.activeReliefCarerProfileId === profile?.id ||
                  placement.myRole === "ACTIVE_RELIEF_CARER"
                    ? "Relief Carer"
                    : "Primary Carer"
                }
                targetLeaveRequestId={targetHandoverLeaveId}
                onHandoverUpdated={loadPlacement}
              />
            </div>
          )}

          {/* TAB 3: CARE PLAN & CLIENT PROFILE */}
          {activeTab === "requirements" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Profile Card */}
                <div className="space-y-4 p-6 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-xl">
                  <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="h-4 w-4 text-gold-DEFAULT" /> Client Profile
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

                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                        Full Name
                      </span>
                      <span className="text-white font-bold text-base">
                        {placement.clientProfile?.user?.firstName}{" "}
                        {placement.clientProfile?.user?.lastName}
                      </span>
                    </div>

                    <div>
                      <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                        Contact Information
                      </span>
                      {placement.contactDetailsReleased && (placement.clientProfile?.user?.phoneNumber || ((placement as any).emailExceptionAuthorised && placement.clientProfile?.user?.email)) ? (
                        <div className="space-y-2 text-gold-100">
                          {(placement as any).emailExceptionAuthorised && placement.clientProfile?.user?.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gold-DEFAULT" />
                              <a
                                href={`mailto:${placement.clientProfile.user.email}`}
                                className="hover:underline text-gold-200 font-medium"
                              >
                                {placement.clientProfile.user.email}
                              </a>
                            </div>
                          )}
                          {placement.clientProfile.user.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gold-DEFAULT" />
                              <a
                                href={`tel:${placement.clientProfile.user.phoneNumber}`}
                                className="hover:underline text-gold-100 font-mono"
                              >
                                {placement.clientProfile.user.phoneNumber}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-gold-300/5 border border-gold-300/10 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                            <Lock className="w-4 h-4 shrink-0" />
                            <span>
                              {isRejected
                                ? "Contact details unavailable"
                                : isPendingOffer
                                ? "Hidden during offer review"
                                : "Automatic 48h Release"}
                            </span>
                          </div>
                          <p className="text-gold-100/60 text-xs leading-relaxed">
                            {isRejected
                              ? "Direct client telephone and residential address are not disclosed for declined placements."
                              : isPendingOffer
                              ? "Client direct telephone and residential address will unlock before placement commences once accepted."
                              : "Direct telephone number and residential address will be automatically released before placement starts."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Care Requirements Card */}
                <div className="space-y-4 p-6 rounded-2xl border border-gold-300/15 bg-navy-900/60 shadow-xl">
                  <div className="border-b border-gold-300/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold-DEFAULT" /> Care Specifications
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div>
                      <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                        Care Category
                      </span>
                      <span className="text-white font-semibold">
                        {Array.isArray(placement.careRequest?.careCategory)
                          ? placement.careRequest.careCategory.join(", ")
                          : placement.careRequest?.careCategory || "General Live-in Care"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                        Service Location
                      </span>
                      {placement.contactDetailsReleased && placement.careRequest?.address ? (
                        <span className="text-white">
                          {placement.careRequest.address}
                          <br />
                          {placement.careRequest.city} {placement.careRequest.postcode}
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-white font-medium block">
                            {[placement.careRequest?.city, placement.careRequest?.postcode]
                              .filter(Boolean)
                              .join(", ") || placement.careRequest?.city || "Location confirmed upon placement"}
                          </span>
                          {!placement.contactDetailsReleased && (
                            <span className="text-gold-100/50 flex items-center gap-1.5 text-xs italic">
                              <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                              Exact street address unlocked 48h prior to commencement
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                        Schedule
                      </span>
                      <span className="text-white">
                        {effectiveStartDate ? formatDate(effectiveStartDate) : "Flexible / TBD"}
                        {effectiveEndDate
                          ? ` – ${formatDate(effectiveEndDate)} (${durationText})`
                          : isOngoingCare
                          ? " (Ongoing Live-in Care)"
                          : ""}
                      </span>
                    </div>

                    {placement.careRequest?.additionalNotes && (
                      <div>
                        <span className="text-gold-100/50 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                          Directives & Notes
                        </span>
                        <div className="text-gold-100/80 text-xs bg-navy-950/60 p-3 rounded-xl border border-gold-300/10 leading-relaxed whitespace-pre-line">
                          {placement.careRequest.additionalNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT HISTORY */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gold-300/10 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold-DEFAULT" />
                    Payment History & Disbursements
                  </h3>
                  <span className="text-xs text-gold-100/50">
                    {payments.length} Records
                  </span>
                </div>

                {paymentsLoading ? (
                  <div className="flex justify-center py-12">
                    <ThinSpinner size="lg" text="Loading payment records..." />
                  </div>
                ) : paymentsError ? (
                  <div className="text-center py-6 border border-rose-500/20 rounded-xl bg-rose-950/10">
                    <p className="text-sm text-rose-400">{paymentsError}</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12 rounded-xl bg-navy-950/40 border border-gold-300/10 space-y-2">
                    <CreditCard className="w-8 h-8 text-gold-300/20 mx-auto" />
                    <p className="text-sm font-semibold text-gold-200">
                      No payment history available yet.
                    </p>
                    <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                      Disbursements and remittances for this placement will be recorded here following your care periods.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gold-300/10 bg-navy-950/40">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gold-300/10 bg-navy-950/80 text-[10px] uppercase font-bold text-gold-100/50 tracking-wider">
                          <th className="py-3 px-4">Period</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Receipt / Proof</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-300/5">
                        {payments.map((payment) => (
                          <tr
                            key={payment.id}
                            className="hover:bg-navy-900/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 text-gold-100/80">
                              {payment.periodStartDate
                                ? `${new Date(payment.periodStartDate).toLocaleDateString()} - ${new Date(payment.periodEndDate).toLocaleDateString()}`
                                : "N/A"}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gold-DEFAULT text-sm">
                              £{Number(payment.amount).toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  payment.status === "PAID"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : payment.status === "UNPAID"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {payment.transactionProofUrl ? (
                                <a
                                  href={payment.transactionProofUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gold-DEFAULT hover:underline font-bold text-xs inline-flex items-center gap-1"
                                >
                                  <Download className="h-3.5 w-3.5" /> Receipt
                                </a>
                              ) : (
                                <span className="text-gold-100/30 text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Permanent Departure Confirmation Dialog */}
      {showDepartureConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-navy-900 shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setShowDepartureConfirm(false)}
              disabled={isConfirmingDeparture}
              className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Placement Departure</h3>
                <p className="text-xs text-gold-100/60">
                  Client: <span className="text-gold-200 font-semibold">{clientName}</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 space-y-2 text-xs text-amber-200">
              <p className="font-semibold text-amber-300">
                Are you sure you want to confirm your departure?
              </p>
              <p className="text-amber-100/80 leading-relaxed">
                Please only confirm once you have permanently completed your placement, finished your handover, and physically left the client&apos;s home.
              </p>
              <p className="text-[11px] text-amber-200/70 pt-1 border-t border-amber-500/20">
                Note: This does not affect your ability to submit travel or placement expenses, which remain accessible for up to 30 days.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost-gold"
                size="sm"
                onClick={() => setShowDepartureConfirm(false)}
                disabled={isConfirmingDeparture}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDeparture}
                disabled={isConfirmingDeparture}
                className="font-bold shadow-md shadow-amber-500/20 !bg-amber-600 hover:!bg-amber-500 !text-white"
              >
                {isConfirmingDeparture ? "Confirming..." : "Yes, Confirm Departure"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return isPage ? modalContent : createPortal(modalContent, document.body);
}
