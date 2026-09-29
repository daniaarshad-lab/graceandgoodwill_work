import { useState, useEffect } from "react";
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
} from "lucide-react";
import Image from "next/image";
import { clientService } from "@/services/client/client.service";
import { ClientPlacement } from "@/types/client.types";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import SelectBackupCarerModal from "@/components/backup-carer/SelectBackupCarerModal";

interface PlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
}

type ClientPlacementTab = "arrangement" | "requirements" | "invoices";

export default function PlacementDetailModal({
  placementId,
  onClose,
}: PlacementDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [placement, setPlacement] = useState<ClientPlacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ClientPlacementTab>("arrangement");
  const [isSelectBackupOpen, setIsSelectBackupOpen] = useState(false);
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

  useEffect(() => {
    async function loadPlacement() {
      try {
        setLoading(true);
        const data = await clientService.getPlacementDetail(placementId);
        setPlacement(data);
      } catch (err: any) {
        setError(err.message || "Failed to load placement details");
      } finally {
        setLoading(false);
      }
    }
    loadPlacement();
  }, [placementId]);

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

  const formattedTitle = formatCareTitle(placement.careRequest?.careCategory);

  return createPortal(
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

          {/* Right: Quick Action & Close */}
          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={() => setIsSelectBackupOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-gold-DEFAULT" />
              <span>{backupCarerName ? "Change Preferred Backup Carer" : "Select Preferred Backup Carer"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. BALANCED EXECUTIVE SUMMARY STRIP (FULL WIDTH 4 CARDS)  */}
      {/* ========================================================= */}
      <div className="shrink-0 bg-navy-950 border-b border-gold-300/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Primary Lead Carer */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-teal-500/25 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-bold text-teal-400 tracking-wider block">
                Primary Lead Carer
              </span>
              <span className="text-sm font-bold text-white truncate block">
                {primaryCarerName}
              </span>
              <span className="text-[10px] text-teal-300/80 truncate block">
                Lead Carer • Active
              </span>
            </div>
          </div>

          {/* Card 2: Preferred Backup Carer */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-amber-500/25 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider block">
                Preferred Backup Carer
              </span>
              <span className="text-sm font-bold text-white truncate block">
                {backupCarerName || "None Assigned"}
              </span>
              <span className="text-[10px] text-amber-300/80 truncate block">
                Ready for Relief • Zero Extra Fee
              </span>
            </div>
          </div>

          {/* Card 3: Start Date */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-gold-300/15 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-DEFAULT font-bold text-sm shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-bold text-gold-100/50 tracking-wider block">
                Placement Start
              </span>
              <span className="text-sm font-bold text-gold-200 block">
                {new Date(placement.startDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-[10px] text-gold-100/60 block">
                Ongoing Live-in Care
              </span>
            </div>
          </div>

          {/* Card 4: Continuity Guarantee */}
          <div className="p-3.5 rounded-2xl bg-navy-900/70 border border-emerald-500/25 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">
                Continuity Guarantee
              </span>
              <span className="text-sm font-bold text-white block">
                Protected Coverage
              </span>
              <span className="text-[10px] text-emerald-300/80 truncate block">
                Seamless relief on call
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CLIENT TAB NAVIGATION                                  */}
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
            onClick={() => setActiveTab("requirements")}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "requirements"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Care Plan & Daily Needs</span>
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
                    Your lead primary carer provides day-to-day care, while your preferred backup carer is briefed and ready for holiday relief.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsSelectBackupOpen(true)}
                  className="font-bold text-xs shrink-0"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  {backupCarerName ? "Change Preferred Backup Carer" : "Designate Preferred Backup Carer"}
                </Button>
              </div>

              {/* Lead Primary Carer Card */}
              <div className="p-6 rounded-2xl border border-teal-500/30 bg-navy-900/70 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-xl shrink-0">
                      {primaryCarerName.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">
                          {primaryCarerName}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          Lead Primary Carer • Active
                        </span>
                      </div>
                      <p className="text-xs text-gold-100/70">
                        Assigned since {new Date(placement.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-teal-400 block tracking-wider">
                      Role in Placement
                    </span>
                    <span className="text-xs text-white font-medium">
                      Regular daily care & companionship
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/5 text-xs text-gold-100/80 leading-relaxed">
                  {primaryCarerName} is your dedicated lead carer managing all routine tasks, mobility assistance, medication prompting, and companion support.
                </div>
              </div>

              {/* Preferred Backup Carer Card */}
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-navy-900/70 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xl shrink-0">
                      {backupCarerName ? backupCarerName.charAt(0) : "B"}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">
                          {backupCarerName || "No Preferred Backup Carer Assigned"}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Preferred Backup Carer • Active
                        </span>
                      </div>
                      <p className="text-xs text-gold-100/70">
                        {backupCarerName ? "Ready for future relief cover • Zero extra fee" : "Please choose your preferred backup carer below"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSelectBackupOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {backupCarerName ? "Change Preferred Backup Carer" : "Choose Preferred Backup Carer"}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-300/5 text-xs text-gold-100/80 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>How your preferred backup carer protects your care:</span>
                  </div>
                  <p className="text-xs text-gold-100/70 pl-6">
                    If {primaryCarerName} schedules holiday or time off, {backupCarerName || "your preferred backup carer"} is offered the shift first to ensure continuity with a familiar carer. There is absolutely no extra retainer or matching fee.
                  </p>
                </div>
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
        </div>
      </main>

      {/* Select Backup Carer Modal */}
      {placement && (
        <SelectBackupCarerModal
          placementId={placement.id}
          clientName={placement.careRequest?.requestorName || "Current Placement"}
          isOpen={isSelectBackupOpen}
          onClose={() => setIsSelectBackupOpen(false)}
          onBackupSelected={(carer) => {
            setDesignatedBackupCarer({
              id: carer.id,
              userId: carer.id,
              user: {
                id: carer.id,
                firstName: carer.name.split(" ")[0],
                lastName: carer.name.split(" ")[1] || "",
              },
            });
          }}
        />
      )}
    </div>,
    document.body
  );
}
