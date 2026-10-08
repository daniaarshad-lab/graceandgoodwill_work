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
  Sparkles,
  Phone,
  Mail,
  Heart,
  RefreshCw,
  Plane,
  Star,
} from "lucide-react";
import Image from "next/image";
import { clientService } from "@/services/client/client.service";
import { ClientPlacement } from "@/types/client.types";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import CarerArrangementCard from "@/components/backup-carer/CarerArrangementCard";
import ClientBackupCarerModal from "@/components/backup-carer/ClientBackupCarerModal";
import PlacementReviewsSection from "@/components/placement/PlacementReviewsSection";

interface PlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
  isPage?: boolean;
}

type ClientPlacementTab = "arrangement" | "schedule" | "requirements" | "invoices" | "reviews";

export default function PlacementDetailModal({
  placementId,
  onClose,
  isPage = false,
}: PlacementDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [placement, setPlacement] = useState<ClientPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ClientPlacementTab>("arrangement");
  const [isSelectBackupOpen, setIsSelectBackupOpen] = useState(false);
  const [backupTargetPriority, setBackupTargetPriority] = useState<number>(1);
  const [designatedBackupCarer, setDesignatedBackupCarer] = useState<any>(null);

  // Lock outer page scrollbar while full-screen modal is active
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
      const data = await clientService.getPlacementDetail(placementId);
      setPlacement(data);
    } catch (err: any) {
      setError(err.message || "Failed to load placement details");
    } finally {
      setLoading(false);
    }
  }, [placementId]);

  useEffect(() => {
    loadPlacement();
  }, [loadPlacement]);

  // Support ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSelectBackupOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSelectBackupOpen]);

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
            ← Back to Care Requests
          </Button>
        </div>
      </div>,
      document.body
    );
  }

  const primaryCarer = placement.carerProfile;
  const primaryCarerName = primaryCarer?.user
    ? `${primaryCarer.user.firstName} ${primaryCarer.user.lastName}`
    : "Assigned Carer";

  const backupCarer =
    designatedBackupCarer ||
    (placement as any).preferredBackupCarer ||
    null;

  const backupCarerName = backupCarer?.user
    ? `${backupCarer.user.firstName || ""} ${backupCarer.user.lastName || ""}`.trim()
    : "";

  // Clean formatting of care category title (avoids "Rehabilitation24/7" string squishing)
  const formatCareTitle = (category: any) => {
    if (!category) return "24/7 Live-in Companion Care";
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

  const formattedTitle = formatCareTitle(placement.careRequest?.careCategory);

  const modalContent = (
    <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 bg-navy-950 text-gold-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. TOP BRAND & WORKSPACE HEADER BAR (Cleanly under AuthenticatedHeader) */}
      {/* ========================================================= */}
      <header className="shrink-0 bg-navy-900/95 backdrop-blur-md border-b border-gold-300/15 px-4 sm:px-8 py-3.5 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Brand + Back to Requests */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/25 bg-navy-950 hover:bg-gold-500/10 hover:border-gold-400/40 text-xs font-bold text-gold-200 hover:text-gold-100 transition-all shadow-sm cursor-pointer"
              title="Return to Care Requests (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-gold-DEFAULT" />
              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-gold-300/20 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50">
                  Client Placement Details
                </span>
                <span className="text-[10px] font-mono text-gold-100/40">
                  • #{placement.id.slice(0, 8)}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    placement.status === "ACTIVE" ||
                    placement.status === "CONFIRMED" ||
                    placement.status === "PLACEMENT_CONFIRMED"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-gold-300/15 text-gold-200 border-gold-300/30"
                  }`}
                >
                  {placement.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{formattedTitle}</span>
              </h1>
            </div>
          </div>

          {/* Right: Placement Start Date Badge & Refresh */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap justify-end">
            {(placement.startDate || (placement as any).careRequest?.startDate) && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/20 bg-navy-950/80 text-xs font-semibold text-gold-200 shadow-sm"
                title="Placement Start Date"
              >
                <Calendar className="w-3.5 h-3.5 text-gold-DEFAULT" />
                <span>
                  Start Date:{" "}
                  {formatDate(placement.startDate || (placement as any).careRequest?.startDate)}
                </span>
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
      {/* 2. CLIENT TAB NAVIGATION                                  */}
      {/* ========================================================= */}
      <div className="shrink-0 bg-navy-900/90 border-b border-gold-300/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("arrangement")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "arrangement"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Dedicated Carer Team</span>
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
            onClick={() => setActiveTab("requirements")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "requirements"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daily Support</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "invoices"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Weekly Invoices & Statements</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "reviews"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Carer Reviews & Feedback</span>
            {placement.feedbacks && placement.feedbacks.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-gold-DEFAULT/20 text-gold-200 font-mono text-[10px] border border-gold-DEFAULT/30">
                {placement.feedbacks.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN SCROLLABLE CONTENT BODY                           */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* TAB 1: DEDICATED CARER TEAM (WARM, REASSURING PRESENTATION) */}
          {activeTab === "arrangement" && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-5 rounded-2xl border border-gold-300/15 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gold-DEFAULT" />
                    Dedicated Continuity Team
                  </h3>
                  <p className="text-xs text-gold-100/70 leading-relaxed max-w-2xl">
                    Your care is safeguarded under the Grace & Goodwill multi-carer continuity model.
                    Your lead primary carer provides day-to-day care, while your preferred backup carer is briefed and ready for relief cover.
                  </p>
                </div>
              </div>

              {/* Multi-Carer Arrangement Card (Primary, Preferred Backup, Active Relief Carer) */}
              <CarerArrangementCard
                primaryCarer={placement.carerProfile as any}
                preferredBackupCarer={placement.preferredBackupCarer}
                backupCarers={placement.backupCarers || []}
                activeReliefCarer={
                  placement.leaveRequests?.some((l: any) => l.status === "COVER_CONFIRMED")
                    ? (placement.activeReliefCarer || placement.preferredBackupCarer)
                    : (placement.activeReliefCarer || null)
                }
                activeReliefDates={(() => {
                  const confirmedLeave = placement.leaveRequests?.find((l: any) => l.status === "COVER_CONFIRMED");
                  return confirmedLeave
                    ? { startDate: confirmedLeave.startDate, endDate: confirmedLeave.endDate }
                    : undefined;
                })()}
                placementStartDate={placement.startDate}
                isAdmin={false}
                onSelectBackupClick={(priority) => {
                  setBackupTargetPriority(priority || 1);
                  setIsSelectBackupOpen(true);
                }}
              />

              {/* Quick Reviews Banner */}
              <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 text-gold-DEFAULT shrink-0">
                    <Star className="w-5 h-5 fill-gold-DEFAULT" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Carer Reviews & Placement Feedback</h4>
                    <p className="text-xs text-gold-100/60">
                      Rate and review your primary and relief carers. Approved reviews are displayed on their professional profile.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("reviews")}
                  className="font-bold shrink-0 self-start sm:self-auto cursor-pointer text-xs"
                >
                  Manage Reviews ({(placement as any).feedbacks?.length || 0})
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE & HOLIDAYS (DEDICATED CONTINUITY & RELIEF SCHEDULE) */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Placement Schedule Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement Start Date
                  </span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                    <span>{formatDate(placement.startDate || (placement as any).careRequest?.startDate)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gold-300/15 bg-navy-900/60 shadow-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
                    Placement Duration
                  </span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-DEFAULT" />
                    <span>
                      {placement.endDate
                        ? `Until ${formatDate(placement.endDate)}`
                        : placement.careRequest?.endDate && !placement.careRequest?.isOngoing
                        ? `Until ${formatDate(placement.careRequest.endDate)}`
                        : placement.careRequest?.isOngoing
                        ? "Ongoing Live-in Care"
                        : "Ongoing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Holiday Relief & Coverage Schedule Section */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gold-200">
                        Relief Cover Schedule
                      </h4>
                      <p className="text-xs text-gold-100/60 mt-0.5">
                        Seamless continuity when your lead carer has planned unavailability. Zero extra charge.
                      </p>
                    </div>
                  </div>
                </div>

                {(!placement.leaveRequests || placement.leaveRequests.length === 0) ? (
                  <div className="p-8 rounded-xl bg-navy-950/40 border border-gold-300/10 text-xs text-gold-100/60 text-center space-y-2">
                    <Calendar className="w-8 h-8 text-gold-300/20 mx-auto" />
                    <p className="font-semibold text-gold-200">No unavailability periods recorded yet.</p>
                    <p className="text-gold-100/50 max-w-md mx-auto">
                      When {primaryCarerName} reports planned unavailability, scheduled relief cover with {backupCarerName || "your preferred backup carer"} will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {placement.leaveRequests.map((req: any) => {
                      const isConfirmed = req.status === "COVER_CONFIRMED";
                      const isOffered = req.status === "OFFERED_TO_BACKUP";

                      return (
                        <div
                          key={req.id}
                          className="p-4 rounded-xl border border-gold-300/15 bg-navy-950/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm hover:border-gold-300/30 transition-all"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm">
                                {req.reason || "Planned Unavailability"}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isConfirmed
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : isOffered
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {isConfirmed
                                  ? "Relief Cover Confirmed"
                                  : isOffered
                                  ? "Relief Offered to Backup"
                                  : "Arranging Relief Cover"}
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

                          <div className="shrink-0 self-start sm:self-center">
                            {isConfirmed ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs whitespace-nowrap">
                                <CheckCircle2 className="w-4 h-4 shrink-0" /> Covered by {backupCarerName || "Preferred Backup Carer"}
                              </span>
                            ) : (
                              <span className="text-amber-400/90 font-medium flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-xs whitespace-nowrap">
                                Coordination team arranging cover
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CARE PLAN & DAILY NEEDS */}
          {activeTab === "requirements" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-6">
                <div className="border-b border-gold-300/10 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-DEFAULT" />
                    Care Requirements & Placement Specifications
                  </h3>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Service details, dates, and recorded care directives for your carers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Care Category
                      </span>
                      <span className="text-gold-100 font-semibold text-sm">
                        {formattedTitle}
                      </span>
                    </div>

                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Schedule
                      </span>
                      <span className="text-gold-100 font-semibold text-sm">
                        {placement.careRequest?.startDate
                          ? new Date(placement.careRequest.startDate).toLocaleDateString()
                          : "30 Sept 2026"}
                        {placement.careRequest?.endDate
                          ? ` - ${new Date(placement.careRequest.endDate).toLocaleDateString()}`
                          : " (Ongoing)"}
                      </span>
                    </div>

                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Location
                      </span>
                      <span className="text-gold-100 font-semibold text-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold-DEFAULT" />
                        {placement.careRequest?.city || placement.careRequest?.postcode || "London, UK"}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-navy-950/60 p-6 rounded-xl border border-gold-300/10 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider block mb-3 text-gold-100/50 font-bold">
                      Care Directives & Notes
                    </span>
                    <div className="text-gold-100/90 text-sm leading-relaxed bg-navy-900/60 p-5 rounded-xl border border-gold-300/5 flex-1 whitespace-pre-line">
                      {placement.careRequest?.requirements ||
                        "Live-in companion care support, post-operative rehabilitation assistance, routine daily companionship, medication prompting, meal preparation, and mobility support."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVOICES & STATEMENTS */}
          {activeTab === "invoices" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gold-300/10 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold-DEFAULT" />
                    Weekly Invoices & Statements
                  </h3>
                  <span className="text-xs text-gold-100/50">
                    {placement.invoices?.length || 0} Invoices
                  </span>
                </div>

                {placement.invoices && placement.invoices.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-gold-300/10 bg-navy-950/40">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-gold-300/10 bg-navy-950/80 text-gold-100/40 uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3 font-semibold">Invoice #</th>
                          <th className="py-2.5 px-3 font-semibold">Period</th>
                          <th className="py-2.5 px-3 font-semibold">Amount</th>
                          <th className="py-2.5 px-3 font-semibold">Status</th>
                          <th className="py-2.5 px-3 font-semibold">Due Date</th>
                          <th className="py-2.5 px-3 text-right">PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-300/5">
                        {placement.invoices.map((inv) => (
                          <tr
                            key={inv.id}
                            className="hover:bg-navy-900/40 transition-colors"
                          >
                            <td className="py-3 px-3 text-gold-200 font-mono text-xs">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-3 px-3 text-gold-100/70">
                              {new Date(inv.billingPeriodStart).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "short" },
                              )}{" "}
                              -{" "}
                              {new Date(inv.billingPeriodEnd).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "short" },
                              )}
                            </td>
                            <td className="py-3 px-3 text-gold-DEFAULT font-semibold font-mono">
                              £{Number(inv.total).toFixed(2)}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  inv.status === "PAID"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : inv.status === "OVERDUE"
                                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                    : "bg-gold-300/15 text-gold-200 border border-gold-300/30"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gold-100/70">
                              {new Date(inv.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {inv.pdfUrl ? (
                                <a
                                  href={inv.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-gold-DEFAULT hover:underline inline-flex items-center gap-1 font-bold text-xs"
                                >
                                  <Download className="h-3 w-3" /> PDF
                                </a>
                              ) : (
                                <span className="text-gold-100/40 text-xs">
                                  Processing
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 rounded-xl bg-navy-950/30 border border-gold-300/5">
                    <p className="text-xs text-gold-100/50">
                      No invoices generated for this placement yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CARER REVIEWS & FEEDBACK */}
          {activeTab === "reviews" && (
            <PlacementReviewsSection
              placementId={placement.id}
              primaryCarer={placement.carerProfile}
              preferredBackupCarer={placement.preferredBackupCarer}
              activeReliefCarer={placement.activeReliefCarer}
              backupCarers={(placement as any).backupCarers || []}
              feedbacks={(placement as any).feedbacks || []}
              onReviewSubmitted={() => {
                loadPlacement();
              }}
            />
          )}
        </div>
      </main>

      {/* Client Backup Carer Modal — Interest list based, same UI as admin */}
      {isSelectBackupOpen && placement && (
        <ClientBackupCarerModal
          placementId={placement.id}
          careRequestId={(placement as any).careRequestId || placement.careRequest?.id}
          preferredBackupCarerId={placement.preferredBackupCarer?.id}
          backupCarers={(placement as any).backupCarers || []}
          targetPriority={backupTargetPriority}
          onClose={() => {
            setIsSelectBackupOpen(false);
            setBackupTargetPriority(1);
          }}
          onBackupSelected={() => {
            loadPlacement();
          }}
        />
      )}
    </div>
  );

  return isPage ? modalContent : createPortal(modalContent, document.body);
}
