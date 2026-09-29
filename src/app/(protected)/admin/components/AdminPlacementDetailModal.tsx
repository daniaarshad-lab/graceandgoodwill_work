import { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  User,
  FileText,
  AlertTriangle,
  Download,
  DollarSign,
  Lock,
  ShieldCheck,
  Plane,
  Calendar,
  Send,
  Sparkles,
  CheckCircle2,
  Users,
  CreditCard,
  MessageSquare,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Printer,
  Bell,
  PauseCircle,
  PlayCircle,
  XCircle,
  Check,
} from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import {
  AdminPlacementDetail,
  CarerPayment,
  PlacementTimelineEvent,
} from "../types/admin.types";
import Button from "@/components/Button";
import InternalNotes from "./shared/InternalNotes/InternalNotes";
import ThinSpinner from "@/components/ThinSpinner";
import { toast } from "sonner";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import CarerArrangementCard from "@/components/backup-carer/CarerArrangementCard";
import PlacementCalendarView from "@/components/backup-carer/PlacementCalendarView";
import PromoteBackupModal from "@/components/backup-carer/PromoteBackupModal";
import SelectBackupCarerModal from "@/components/backup-carer/SelectBackupCarerModal";
import AdminApplicationsModal from "./AdminApplicationsModal";
import { backupCarerService } from "@/services/backupCarer.service";
import { CarerLeaveRequest } from "@/types/backupCarer.types";

interface AdminPlacementDetailModalProps {
  placementId: string;
  onClose: () => void;
  onPlacementUpdated?: () => void;
  timeline?: PlacementTimelineEvent[];
}

type TabType = "continuity" | "schedule" | "clinical" | "financials" | "notes";

function PaymentUpdateModal({
  payment,
  onClose,
  onSuccess,
}: {
  payment: CarerPayment;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(payment.status);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("status", status);
      if (file) {
        formData.append("receipt", file);
      }
      await adminService.updateCarerPaymentStatus(payment.id, formData);
      toast.success("Payment status updated successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold text-gold-200 mb-4">
          Update Carer Payment Status
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-100/60 mb-1">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-4 py-2.5 text-sm text-gold-100 focus:border-gold-DEFAULT focus:outline-none"
            >
              <option value="UNPAID">UNPAID</option>
              <option value="PAID">PAID</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-100/60 mb-1">
              Payment Receipt / Proof (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-xs text-gold-100/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-DEFAULT/10 file:text-gold-DEFAULT hover:file:bg-gold-DEFAULT/20 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-300/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPlacementDetailModal({
  placementId,
  onClose,
  onPlacementUpdated,
  timeline: propTimeline,
}: AdminPlacementDetailModalProps) {
  const [placement, setPlacement] = useState<AdminPlacementDetail | null>(null);
  const [billingDetail, setBillingDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("continuity");
  const [selectedPayment, setSelectedPayment] = useState<CarerPayment | null>(
    null,
  );
  const [togglingContactRelease, setTogglingContactRelease] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Weekly Fee editing state
  const [overrideFee, setOverrideFee] = useState<number>(0);
  const [isEditingFee, setIsEditingFee] = useState(false);

  // Backup Carer & Leave Requests States
  const [isSelectBackupOpen, setIsSelectBackupOpen] = useState(false);
  const [isPromoteBackupOpen, setIsPromoteBackupOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<CarerLeaveRequest[]>([]);
  const [dispatchingLeaveId, setDispatchingLeaveId] = useState<string | null>(null);
  const [preferredBackupCarer, setPreferredBackupCarer] = useState<any>(null);

  const loadPlacement = async () => {
    try {
      setLoading(true);
      const [data, leaves, billing] = await Promise.all([
        adminService.getPlacementDetail(placementId),
        backupCarerService.getLeaveRequests(placementId).catch(() => []),
        adminService.getPlacementBilling(placementId).catch(() => null),
      ]);
      setPlacement(data);
      if (data?.preferredBackupCarer) {
        setPreferredBackupCarer(data.preferredBackupCarer);
      } else {
        setPreferredBackupCarer(null);
      }
      setLeaveRequests(leaves);
      setBillingDetail(billing);
      if (billing && billing.weeklyFee) {
        setOverrideFee(Number(billing.weeklyFee));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load placement details");
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchRelief = async (leaveId: string) => {
    if (!preferredBackupCarer?.id) {
      toast.error("Please designate a preferred backup carer before dispatching relief offers.");
      return;
    }
    setDispatchingLeaveId(leaveId);
    try {
      await backupCarerService.dispatchReliefOfferToBackup(
        placementId,
        leaveId,
        preferredBackupCarer.id
      );
      toast.success("Relief opportunity offer dispatched to preferred backup carer!");
      setLeaveRequests((prev) =>
        prev.map((l) =>
          l.id === leaveId ? { ...l, status: "OFFERED_TO_BACKUP" as const } : l
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to dispatch relief offer");
    } finally {
      setDispatchingLeaveId(null);
    }
  };

  const handleToggleContactRelease = async () => {
    try {
      setTogglingContactRelease(true);
      await adminService.togglePlacementContactRelease(placementId);
      toast.success(
        placement?.contactDetailsReleased
          ? "Contact details revoked from carer."
          : "Contact details released to carer successfully."
      );
      await loadPlacement();
      if (onPlacementUpdated) {
        onPlacementUpdated();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle contact release");
    } finally {
      setTogglingContactRelease(false);
    }
  };

  const handlePauseBilling = async () => {
    if (
      !confirm(
        "Are you sure you want to pause subscription billing collection for this placement?"
      )
    )
      return;
    setActionLoading("pause-billing");
    try {
      await adminService.pausePlacementBilling(placementId);
      showSuccessToast("Billing Paused", "Recurring weekly billing collection paused.");
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to pause billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeBilling = async () => {
    setActionLoading("resume-billing");
    try {
      await adminService.resumePlacementBilling(placementId);
      showSuccessToast("Billing Resumed", "Recurring weekly billing collection resumed.");
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to resume billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelPlacement = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this care placement and weekly subscription? A final prorated invoice will be generated automatically for the active days."
      )
    )
      return;
    setActionLoading("cancel-placement");
    try {
      await adminService.updatePlacementStatus(
        placementId,
        "CANCELLED",
        new Date().toISOString()
      );
      showSuccessToast(
        "Placement Cancelled",
        "Care placement and subscription cancelled successfully."
      );
      await loadPlacement();
      if (onPlacementUpdated) onPlacementUpdated();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to cancel placement.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateWeeklyFee = async () => {
    if (overrideFee < 0) return;
    setActionLoading("update-fee");
    try {
      await adminService.updatePlacementWeeklyFee(placementId, overrideFee);
      showSuccessToast("Fee Saved", "Agreed weekly fee overridden successfully.");
      setIsEditingFee(false);
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to update weekly fee.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendInvoice = async (invoiceId: string) => {
    setActionLoading(`resend-${invoiceId}`);
    try {
      await adminService.resendInvoice(invoiceId);
      showSuccessToast("Reminder Sent", "Payment reminder notification sent.");
      await loadPlacement();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to send invoice reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrintInvoice = (
    inv: any,
    clientName: string,
    clientEmail: string
  ) => {
    const printWindow = window.open("", "_blank", "width=960,height=900");
    if (printWindow) {
      const isReg = inv.invoiceNumber
        ? inv.invoiceNumber.startsWith("REG-")
        : inv.id.startsWith("REG-");
      const logoUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/website_logo.png`
          : "/website_logo.png";

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${inv.invoiceNumber || inv.id}</title>
            <style>
              * { box-sizing: border-box; }
              html, body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #1e293b;
                margin: 0;
                padding: 0;
                width: 100%;
                line-height: 1.5;
                background: #f8fafc;
              }
              .invoice-container {
                width: 100%;
                max-width: 900px;
                margin: 20px auto;
                padding: 40px;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              }
              .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 22px; font-weight: bold; color: #1e3a8a; line-height: 1.2; }
              .company-details { text-align: right; font-size: 12px; color: #64748b; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.05em; }
              .details { font-size: 14px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              .table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; }
              .table td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
              .totals-box { display: flex; flex-direction: column; align-items: flex-end; margin-top: 20px; }
              .total-row { display: flex; justify-content: space-between; width: 280px; padding: 6px 0; font-size: 13px; }
              .total-row.grand-total { border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 18px; font-weight: bold; color: #0f172a; }
              .badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
              .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 60px; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div style="margin: 20px; text-align: right;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #d4af37; border: none; color: #0f172a; font-weight: bold; border-radius: 6px; cursor: pointer;">
                Print / Save PDF
              </button>
            </div>
            <div class="invoice-container">
              <div class="header">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${logoUrl}" alt="Grace & Goodwill" style="height: 52px; width: auto; object-fit: contain;" />
                  <div>
                    <div class="logo">Grace & Goodwill</div>
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-top: 2px; letter-spacing: 0.08em; text-transform: uppercase;">CARE DEFINED BY INTEGRITY</div>
                  </div>
                </div>
                <div class="company-details">
                  <h1 style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0 0 2px 0;">INVOICE</h1>
                  <div style="font-size: 14px; font-weight: 700; font-family: monospace;"># ${inv.invoiceNumber || inv.id}</div>
                  <strong>Grace & Goodwill Ltd</strong><br/>
                  123 Care Street, London, UK
                </div>
              </div>
              <div class="meta-grid">
                <div>
                  <div class="section-title">Billed To</div>
                  <div class="details">
                    <strong>${clientName}</strong><br/>
                    ${clientEmail}<br/>
                  </div>
                </div>
                <div>
                  <div class="section-title">Invoice Details</div>
                  <div class="details">
                    <strong>Issue Date:</strong> ${new Date(inv.createdAt || Date.now()).toLocaleDateString()}<br/>
                    <strong>Status:</strong> <span class="badge">${inv.status}</span>
                  </div>
                </div>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Care Placement Management Service (${inv.billingPeriodStart ? new Date(inv.billingPeriodStart).toLocaleDateString() : ""} - ${inv.billingPeriodEnd ? new Date(inv.billingPeriodEnd).toLocaleDateString() : ""})</td>
                    <td style="text-align: right; font-family: monospace;">£${Number(inv.subtotal || inv.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div class="totals-box">
                <div class="total-row"><span>Subtotal:</span><span>£${Number(inv.subtotal || inv.total).toFixed(2)}</span></div>
                <div class="total-row grand-total"><span>Total:</span><span>£${Number(inv.total).toFixed(2)}</span></div>
              </div>
              <div class="footer">Thank you for choosing Grace & Goodwill Care Services.</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  useEffect(() => {
    loadPlacement();
  }, [placementId]);

  // Support ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !isSelectBackupOpen &&
        !isPromoteBackupOpen &&
        !selectedPayment
      ) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSelectBackupOpen, isPromoteBackupOpen, selectedPayment]);

  // Lock outer page scrollbar while full-screen modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 flex items-center justify-center bg-navy-950 text-gold-100">
        <ThinSpinner size="xl" text="Loading placement workspace..." />
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 flex items-center justify-center bg-navy-950 p-6 text-gold-100">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-navy-900 p-8 text-center space-y-4 shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-rose-400 mx-auto" />
          <h3 className="text-xl font-bold text-rose-400">
            Error Loading Placement
          </h3>
          <p className="text-sm text-gold-100/70">{error}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  const clientName =
    `${placement.clientProfile?.user?.firstName || ""} ${placement.clientProfile?.user?.lastName || ""}`.trim() ||
    "Client";
  const clientEmail = placement.clientProfile?.user?.email || "";
  const primaryCarerName =
    `${placement.carerProfile?.user?.firstName || ""} ${placement.carerProfile?.user?.lastName || ""}`.trim() ||
    "Primary Carer";
  const backupName =
    `${preferredBackupCarer?.user?.firstName || ""} ${preferredBackupCarer?.user?.lastName || ""}`.trim();
  const pendingLeavesCount = leaveRequests.filter(
    (l) => l.status === "PENDING_RELIEF"
  ).length;

  // Timeline events: from props or synthesized from placement records
  const timelineEvents: PlacementTimelineEvent[] =
    propTimeline && propTimeline.length > 0
      ? propTimeline
      : [
          {
            title: "Placement Match Initiated",
            timestamp: new Date(placement.createdAt).toLocaleString("en-GB"),
            description: `Admin registered placement for ${clientName} matched with ${primaryCarerName}.`,
          },
          ...(placement.acceptedAt
            ? [
                {
                  title: "Carer Accepted Placement",
                  timestamp: new Date(placement.acceptedAt).toLocaleString("en-GB"),
                  description: `${primaryCarerName} accepted the care assignment.`,
                },
              ]
            : []),
          ...(placement.contactDetailsReleased
            ? [
                {
                  title: "Client Contact Details Released",
                  timestamp: placement.contactDetailsReleasedAt
                    ? new Date(placement.contactDetailsReleasedAt).toLocaleString("en-GB")
                    : "Prior to start",
                  description:
                    "Direct client contact info unlocked for lead carer coordination.",
                },
              ]
            : []),
          {
            title: "Care Scheduled Start",
            timestamp: new Date(placement.startDate).toLocaleDateString("en-GB"),
            description: `Official service start date for this care package.`,
          },
        ];

  // Invoices list: from placement or billing detail
  const invoicesList =
    billingDetail?.invoices && billingDetail.invoices.length > 0
      ? billingDetail.invoices
      : placement.invoices || [];

  return (
    <div className="fixed top-[72px] inset-x-0 bottom-0 z-40 bg-navy-950 text-gold-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. TOP EXECUTIVE HEADER BAR (Cleanly under AuthenticatedHeader) */}
      {/* ========================================================= */}
      <header className="shrink-0 bg-navy-900/95 backdrop-blur-md border-b border-gold-300/15 px-4 sm:px-8 py-3 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Back button & Breadcrumb & Titles */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/25 bg-navy-950 hover:bg-gold-500/10 hover:border-gold-400/40 text-xs font-bold text-gold-200 hover:text-gold-100 transition-all shadow-sm cursor-pointer"
              title="Return to Placements Pipeline (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-gold-DEFAULT" />
              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-gold-300/20 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50">
                  Placement Workspace
                </span>
                <span className="text-[10px] font-mono text-gold-100/40">
                  • #{placement.id.slice(0, 8)}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    placement.status === "ACTIVE" ||
                    placement.status === "PLACEMENT_CONFIRMED" ||
                    placement.status === "CONFIRMED"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : placement.status === "REJECTED_BY_CARER"
                      ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      : "bg-gold-300/15 text-gold-200 border-gold-300/30"
                  }`}
                >
                  {placement.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{clientName}</span>
                <span className="text-xs font-normal text-gold-100/60 hidden sm:inline">
                  — {placement.careRequest?.careCategory || "24/7 Live-in Care"}
                </span>
              </h1>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setIsSelectBackupOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-gold-DEFAULT" />
              <span>{backupName ? "Change Backup Carer" : "Assign Backup Carer"}</span>
            </button>

            <button
              onClick={handleToggleContactRelease}
              disabled={togglingContactRelease}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                placement.contactDetailsReleased
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  : "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
              }`}
              title="Toggle carer access to client phone and address"
            >
              {placement.contactDetailsReleased ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contacts Released</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Release Contacts</span>
                </>
              )}
            </button>

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
      {/* 2. EXECUTIVE GLANCE STRIP                                 */}
      {/* ========================================================= */}
      <div className="shrink-0 bg-navy-950/90 border-b border-gold-300/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Client Card */}
          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-gold-300/10">
            <span className="text-[9px] uppercase font-bold text-gold-100/50 block">Client</span>
            <span className="text-xs font-bold text-white truncate block">{clientName}</span>
            <span className="text-[10px] text-gold-100/60 truncate block">
              {placement.clientProfile?.user?.phoneNumber || placement.clientProfile?.user?.email || "No phone"}
            </span>
          </div>

          {/* Primary Carer Card */}
          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-gold-300/10">
            <span className="text-[9px] uppercase font-bold text-teal-400 block">Primary Carer</span>
            <span className="text-xs font-bold text-white truncate block">{primaryCarerName}</span>
            <span className="text-[10px] text-teal-300/80 truncate block">Assigned & Active</span>
          </div>

          {/* Backup Carer Card */}
          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-gold-300/10">
            <span className="text-[9px] uppercase font-bold text-amber-400 block">Preferred Backup</span>
            <span className="text-xs font-bold text-white truncate block">
              {backupName || "None Assigned"}
            </span>
          </div>

          {/* Start Date */}
          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-gold-300/10">
            <span className="text-[9px] uppercase font-bold text-gold-100/50 block">Placement Start</span>
            <span className="text-xs font-bold text-gold-200 block">
              {new Date(placement.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-[10px] text-gold-100/60 block">Ongoing Service</span>
          </div>

          {/* 48h Privacy Status */}
          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-gold-300/10 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase font-bold text-gold-100/50 block">48h Contact Privacy</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  placement.contactDetailsReleased ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="text-xs font-bold text-white">
                {placement.contactDetailsReleased ? "Unlocked for Carer" : "Safeguarded / Locked"}
              </span>
            </div>
            <span className="text-[10px] text-gold-100/60 truncate block">
              {placement.contactDetailsReleased ? "Direct contact enabled" : "Reveals 48h prior to start"}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTUITIVE TABBED NAVIGATION BAR                        */}
      {/* ========================================================= */}
      <div className="shrink-0 bg-navy-900/80 border-b border-gold-300/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("continuity")}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "continuity"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Carer Team & Continuity</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "schedule"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule & Holiday Relief</span>
            {pendingLeavesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-navy-950 font-black text-[9px] animate-pulse">
                {pendingLeavesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("clinical")}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "clinical"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Clinical Care Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("financials")}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "financials"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Financials & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "notes"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Internal Notes</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN SCROLLABLE CONTENT BODY                           */}
      {/* ========================================================= */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Declined Warning Banner */}
          {placement.status === "REJECTED_BY_CARER" && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Placement Offer Declined by Carer ({primaryCarerName})</span>
              </div>
              <p className="text-rose-300/90 text-xs pl-6">
                <strong>Decline Reason:</strong> {placement.rejectionReason || "No specific reason provided."}
              </p>
              <p className="text-amber-300/80 text-[11px] pl-6">
                <strong>Action Required:</strong> The care request status has been reverted back to <em>Under Review</em>. Please re-assign an alternative carer from the applicant pool.
              </p>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 1: CARER CONTINUITY & ROLES + MILESTONE AUDIT       */}
          {/* ------------------------------------------------------- */}
          {activeTab === "continuity" && (
            <div className="space-y-6">
              {/* Full Carer Arrangement Card */}
              <div className="rounded-2xl border border-gold-300/20 bg-navy-900/60 p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold-DEFAULT" />
                      Unified Multi-Carer Continuity Arrangement
                    </h3>
                    <p className="text-xs text-gold-100/60 mt-0.5">
                      Ensure zero care disruptions with active primary coverage and Preferred Backup Carer support.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSelectBackupOpen(true)}
                    className="font-bold text-xs"
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    {backupName ? "Change Backup Carer" : "Designate Backup Carer"}
                  </Button>
                </div>

                <CarerArrangementCard
                  primaryCarer={placement.carerProfile as any}
                  preferredBackupCarer={preferredBackupCarer}
                  activeReliefCarer={
                    leaveRequests.some((l) => l.status === "COVER_CONFIRMED")
                      ? preferredBackupCarer
                      : null
                  }
                  activeReliefDates={(() => {
                    const confirmedLeave = leaveRequests.find((l) => l.status === "COVER_CONFIRMED");
                    return confirmedLeave
                      ? { startDate: confirmedLeave.startDate, endDate: confirmedLeave.endDate }
                      : undefined;
                  })()}
                  placementStartDate={placement.startDate}
                  isAdmin={true}
                  onSelectBackupClick={() => setIsSelectBackupOpen(true)}
                  onPromoteBackupClick={() => setIsPromoteBackupOpen(true)}
                />
              </div>

              {/* 48-Hour Contact Details Release Control Card */}
              <div
                className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 shadow-xl ${
                  placement.contactDetailsReleased
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                      placement.contactDetailsReleased
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {placement.contactDetailsReleased ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-gold-50">
                        Client Contact & Address Sharing Protocol
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          placement.contactDetailsReleased
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {placement.contactDetailsReleased
                          ? "Released to Carer"
                          : "Locked (48h Window Enforced)"}
                      </span>
                    </div>
                    <p className="text-xs text-gold-100/70 leading-relaxed max-w-3xl">
                      {placement.contactDetailsReleased
                        ? `Direct client phone, email, and exact home address are currently visible in the carer's portal. ${
                            placement.contactDetailsReleasedAt
                              ? `Manual release granted on ${new Date(placement.contactDetailsReleasedAt).toLocaleString("en-GB")}.`
                              : ""
                          }`
                        : "Client phone, email, and exact street address are hidden from carers until 48 hours prior to the placement start date. You can manually release access now for advance logistics coordination."}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <Button
                    variant={placement.contactDetailsReleased ? "outline" : "primary"}
                    size="sm"
                    disabled={togglingContactRelease}
                    onClick={handleToggleContactRelease}
                    className={`text-xs px-4 py-2 font-bold ${
                      placement.contactDetailsReleased
                        ? "!border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                        : ""
                    }`}
                  >
                    {togglingContactRelease ? (
                      "Updating..."
                    ) : placement.contactDetailsReleased ? (
                      <>
                        <Lock className="w-3.5 h-3.5 mr-1.5" />
                        Revoke Contact Access
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                        Release Contacts Now
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Chronological Milestone Audit (Moved from Expand Details) */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-4">
                <div className="border-b border-gold-300/10 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-DEFAULT" />
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Chronological Milestone Audit
                    </h4>
                    <p className="text-xs text-gold-100/60 mt-0.5">
                      Operational audit trail of all lifecycle events and admin approvals for this placement.
                    </p>
                  </div>
                </div>

                <div className="flow-root pt-2">
                  <ul className="-mb-8">
                    {timelineEvents.map((event, eventIdx) => (
                      <li key={event.title + eventIdx}>
                        <div className="relative pb-6">
                          {eventIdx !== timelineEvents.length - 1 ? (
                            <span
                              className="absolute top-3 left-3 -ml-px h-full w-[1px] bg-gold-300/15"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-950 text-gold-DEFAULT border border-gold-300/30 text-[10px] font-bold">
                                ✓
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-xs font-bold text-gold-200 leading-tight">
                                {event.title}
                              </p>
                              <p className="text-[10px] text-gold-100/40 mt-0.5">
                                {event.timestamp}
                              </p>
                              <p className="text-xs text-gold-100/70 mt-1 leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 2: SCHEDULE & HOLIDAY RELIEF                        */}
          {/* ------------------------------------------------------- */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              {/* Upcoming Leave Requests Section */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gold-200">
                        Primary Carer Holiday & Leave Requests
                      </h4>
                      <p className="text-xs text-gold-100/60 mt-0.5">
                        Manage primary carer absences and dispatch 1-click relief offers to the Preferred Backup Carer.
                      </p>
                    </div>
                  </div>
                </div>

                {leaveRequests.length === 0 ? (
                  <div className="p-8 rounded-xl bg-navy-950/40 border border-gold-300/10 text-xs text-gold-100/60 text-center">
                    No holiday or time-off requests registered for this placement.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaveRequests.map((req) => {
                      const isPendingRelief = req.status === "PENDING_RELIEF";
                      const isOffered = req.status === "OFFERED_TO_BACKUP";
                      const isConfirmed = req.status === "COVER_CONFIRMED";

                      return (
                        <div
                          key={req.id}
                          className="p-5 rounded-xl border border-gold-300/15 bg-navy-950/60 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {req.reason || "Holiday Request"}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    isPendingRelief
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                                      : isOffered
                                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  }`}
                                >
                                  {isPendingRelief
                                    ? "Pending Relief Cover"
                                    : isOffered
                                    ? "Offer Sent to Backup"
                                    : "Relief Cover Confirmed"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gold-100/70">
                                <Calendar className="w-3.5 h-3.5 text-amber-400" />
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
                          </div>

                          {/* Admin Action Alert */}
                          {isPendingRelief && (
                            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                              <div className="flex items-start gap-2.5">
                                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <span className="font-bold text-xs text-amber-300 block">
                                    Relief Dispatch Action Required:
                                  </span>
                                  <p className="text-xs text-gold-100/80 leading-relaxed">
                                    {primaryCarerName} has requested time off for these dates. Dispatch the relief opportunity offer directly to your designated Preferred Backup Carer ({backupName || "Preferred Backup Carer"}).
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={dispatchingLeaveId === req.id}
                                  onClick={() => handleDispatchRelief(req.id)}
                                  className="font-bold text-xs shadow-md shadow-gold/20"
                                >
                                  <Send className="w-3.5 h-3.5 mr-1.5" />
                                  {dispatchingLeaveId === req.id
                                    ? "Dispatching..."
                                    : `Offer to ${backupName || "Backup Carer"}`}
                                </Button>
                              </div>
                            </div>
                          )}

                          {isOffered && (
                            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200/90 flex items-center justify-between gap-3">
                              <span>
                                Relief placement offer sent to <strong>{backupName}</strong>. Awaiting carer acceptance in portal.
                              </span>
                              <span className="text-[10px] text-blue-300 uppercase tracking-wider font-semibold">
                                Pending Carer Response
                              </span>
                            </div>
                          )}

                          {isConfirmed && (
                            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>
                                <strong>{backupName}</strong> has confirmed relief cover for these dates and is active as the Relief Carer.
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Placement Schedule & Calendar View */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-4">
                <div className="border-b border-gold-300/10 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold-DEFAULT" />
                    4-Week Placement Schedule & Shift Coverage
                  </h4>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Visual timeline showing primary carer coverage shifts and scheduled relief handover periods.
                  </p>
                </div>

                <PlacementCalendarView
                  primaryCarerName={primaryCarerName}
                  reliefCarerName={backupName || "Relief Carer"}
                  leaveStartDate={
                    leaveRequests.find(
                      (l) => l.status === "COVER_CONFIRMED" || l.status === "OFFERED_TO_BACKUP"
                    )?.startDate
                  }
                  leaveEndDate={
                    leaveRequests.find(
                      (l) => l.status === "COVER_CONFIRMED" || l.status === "OFFERED_TO_BACKUP"
                    )?.endDate
                  }
                />
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 3: CLINICAL CARE PLAN & REQUIREMENTS                */}
          {/* ------------------------------------------------------- */}
          {activeTab === "clinical" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-6">
                <div className="border-b border-gold-300/10 pb-4">
                  <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold-DEFAULT" />
                    Clinical Requirements & Placement Specifications
                  </h3>
                  <p className="text-xs text-gold-100/60 mt-0.5">
                    Care conditions, daily support scope, and specific client care directives.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Metadata Column */}
                  <div className="space-y-4">
                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Care Category
                      </span>
                      <span className="text-gold-100 font-semibold text-sm">
                        {placement.careRequest?.careCategory || "24/7 Live-in Care"}
                      </span>
                    </div>

                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Location / Region
                      </span>
                      <span className="text-gold-100 font-semibold text-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold-DEFAULT" />
                        {placement.careRequest?.city || placement.careRequest?.postcode || "London, UK"}
                      </span>
                    </div>

                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Priority Level
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full uppercase font-bold inline-block mt-1 ${
                          placement.careRequest?.isEmergency
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {placement.careRequest?.isEmergency ? "Emergency Case" : "Standard Placement"}
                      </span>
                    </div>

                    <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/10">
                      <span className="text-[9px] uppercase tracking-wider block mb-1 text-gold-100/40 font-medium">
                        Client Contact Information
                      </span>
                      <div className="space-y-1 text-xs text-gold-100/80 mt-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gold-100/50" />
                          <span>{placement.clientProfile?.user?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gold-100/50" />
                          <span>{placement.clientProfile?.user?.phoneNumber || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Column */}
                  <div className="md:col-span-2 bg-navy-950/60 p-6 rounded-xl border border-gold-300/10 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider block mb-3 text-gold-100/50 font-bold">
                      Clinical Requirements & Daily Care Scope
                    </span>
                    <div className="text-gold-100/90 text-sm leading-relaxed bg-navy-900/60 p-5 rounded-xl border border-gold-300/5 flex-1 whitespace-pre-line">
                      {placement.careRequest?.requirements ||
                        "Primary requirements include live-in companion care, post-operative rehabilitation support, medication prompting, meal preparation, mobility assistance, and daily companionship. Client prefers carers with experience in post-orthopaedic recovery."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 4: FINANCIALS & BILLING OVERVIEW (ALL FROM EXPAND DETAILS) */}
          {/* ------------------------------------------------------- */}
          {activeTab === "financials" && (
            <div className="space-y-6">
              {/* Placement Financial & Billing KPI Cards */}
              <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gold-DEFAULT" />
                      Placement Financial & Billing Overview
                    </h3>
                    <p className="text-xs text-gold-100/60 mt-0.5">
                      Monitor weekly rates, platform fees, billing subscription lifecycle, and outstanding balance.
                    </p>
                  </div>

                  {/* Action Controls: Pause, Resume, Cancel */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {billingDetail?.billingStatus === "ACTIVE" && (
                      <button
                        onClick={handlePauseBilling}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Pause Billing</span>
                      </button>
                    )}
                    {billingDetail?.billingStatus === "PAUSED" && (
                      <button
                        onClick={handleResumeBilling}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume Billing</span>
                      </button>
                    )}
                    {(placement.status === "PLACEMENT_STARTED" ||
                      placement.status === "ONGOING" ||
                      placement.status === "PLACEMENT_CONFIRMED") && (
                      <button
                        onClick={handleCancelPlacement}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Placement & Subscription</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-950/70 p-4 rounded-xl border border-gold-300/10 text-xs">
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Agreed Weekly Fee
                    </span>
                    <span className="font-mono text-gold-DEFAULT text-base font-bold">
                      £{Number(billingDetail?.weeklyFee || 250).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Daily Rate (Calc)
                    </span>
                    <span className="font-mono text-gold-100 text-base font-semibold">
                      £{Number(billingDetail?.dailyRate || (billingDetail?.weeklyFee ? billingDetail.weeklyFee / 7 : 35.71)).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Billing Frequency
                    </span>
                    <span className="text-white text-base font-semibold">
                      {billingDetail?.billingFrequency || "WEEKLY"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Outstanding Balance
                    </span>
                    <span className="font-mono text-rose-400 text-base font-bold">
                      £{Number(billingDetail?.outstandingBalance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-950/70 p-4 rounded-xl border border-gold-300/10 text-xs">
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Platform Fee Status
                    </span>
                    <span
                      className={`text-xs font-bold inline-flex items-center gap-1 ${
                        billingDetail?.isLifetimeFeePaid
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {billingDetail?.isLifetimeFeePaid ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Paid & Confirmed
                        </>
                      ) : (
                        "Pending Payment"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Subscription Status
                    </span>
                    <span className="text-white text-xs font-bold uppercase">
                      {billingDetail?.billingStatus || "ACTIVE"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Next Billing Cycle
                    </span>
                    <span className="text-gold-100/80 font-mono text-xs">
                      {billingDetail?.nextBillingDate
                        ? new Date(billingDetail.nextBillingDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-1">
                      Subscription ID
                    </span>
                    <span className="text-gold-100/60 font-mono text-xs truncate block">
                      {billingDetail?.stripeSubscriptionId || "None"}
                    </span>
                  </div>
                </div>

                {/* Override Weekly Fee Box */}
                <div className="p-4 rounded-xl bg-navy-950/40 border border-gold-300/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gold-200">
                      Override Agreed Weekly Fee
                    </span>
                    <p className="text-[11px] text-gold-100/60">
                      Update the recurring weekly billing fee charged to this client for this placement.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-100/40 font-mono text-xs">
                        £
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={overrideFee}
                        onChange={(e) => setOverrideFee(Number(e.target.value))}
                        className="w-32 pl-7 pr-3 py-1.5 rounded-lg border border-gold-300/20 bg-navy-950 font-mono text-xs text-white focus:border-gold-DEFAULT focus:outline-none"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={actionLoading === "update-fee"}
                      onClick={handleUpdateWeeklyFee}
                      className="text-xs py-1.5 font-bold"
                    >
                      {actionLoading === "update-fee" ? "Saving..." : "Save Fee"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Invoices List with Full Actions (Print & Remind) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-4">
                    <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gold-DEFAULT" /> Generated Client Invoices
                    </h3>
                    <span className="text-xs text-gold-100/50">
                      {invoicesList.length} Total Records
                    </span>
                  </div>

                  {invoicesList.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gold-300/10 bg-navy-950/40">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gold-300/10 bg-navy-950/80 text-[10px] uppercase font-bold text-gold-200">
                            <th className="py-2.5 px-3">Invoice #</th>
                            <th className="py-2.5 px-3">Period</th>
                            <th className="py-2.5 px-3">Subtotal</th>
                            <th className="py-2.5 px-3">VAT (20%)</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoicesList.map((inv: any) => (
                            <tr
                              key={inv.id}
                              className="border-b border-gold-300/5 hover:bg-navy-900/40 transition-colors"
                            >
                              <td className="py-3 px-3 font-mono font-semibold text-white">
                                {inv.invoiceNumber || inv.id?.slice(0, 10)}
                              </td>
                              <td className="py-3 px-3 text-gold-100/70">
                                {inv.billingPeriodStart
                                  ? `${new Date(inv.billingPeriodStart).toLocaleDateString()} - ${new Date(inv.billingPeriodEnd).toLocaleDateString()}`
                                  : "Weekly Cycle"}
                              </td>
                              <td className="py-3 px-3 font-mono">
                                £{Number(inv.subtotal || inv.total * 0.8).toFixed(2)}
                              </td>
                              <td className="py-3 px-3 font-mono text-gold-100/60">
                                £{Number(inv.vat || (inv.subtotal ? inv.subtotal * 0.2 : 0)).toFixed(2)}
                              </td>
                              <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">
                                £{Number(inv.total).toFixed(2)}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    inv.status === "PAID"
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                      : inv.status === "PENDING"
                                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handlePrintInvoice(inv, clientName, clientEmail)}
                                    className="p-1 rounded-lg hover:bg-gold-500/10 text-gold-DEFAULT hover:text-gold-200 transition-colors"
                                    title="Print or download invoice PDF"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>
                                  {inv.status !== "PAID" && (
                                    <button
                                      onClick={() => handleResendInvoice(inv.id)}
                                      disabled={actionLoading === `resend-${inv.id}`}
                                      className="p-1 rounded-lg hover:bg-gold-500/10 text-gold-DEFAULT hover:text-gold-200 transition-colors"
                                      title="Send payment reminder email"
                                    >
                                      <Bell className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {inv.pdfUrl && (
                                    <a
                                      href={inv.pdfUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded-lg hover:bg-gold-500/10 text-gold-DEFAULT hover:text-gold-200"
                                      title="Open PDF"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 rounded-xl bg-navy-950/30 border border-gold-300/5 flex-1 flex items-center justify-center">
                      <p className="text-xs text-gold-100/50">
                        No invoices generated yet for this placement.
                      </p>
                    </div>
                  )}
                </div>

                {/* Carer Payments List */}
                <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-4">
                    <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gold-DEFAULT" /> Carer Remuneration & Payments
                    </h3>
                    <span className="text-xs text-gold-100/50">
                      {placement.carerPayments?.length || 0} Total Records
                    </span>
                  </div>

                  {placement.carerPayments && placement.carerPayments.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gold-300/10 bg-navy-950/40">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gold-300/10 bg-navy-950/80 text-[10px] uppercase font-bold text-gold-200">
                            <th className="py-2.5 px-3">Period</th>
                            <th className="py-2.5 px-3">Amount</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                            <th className="py-2.5 px-3 text-right">Receipt</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {placement.carerPayments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b border-gold-300/5 hover:bg-navy-900/40 transition-colors"
                            >
                              <td className="py-3 px-3 text-gold-100/70">
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
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                      : payment.status === "UNPAID"
                                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
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
                                  <span className="text-gold-100/40">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedPayment(payment)}
                                  className="py-1 px-2.5 text-[10px]"
                                >
                                  Update
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 rounded-xl bg-navy-950/30 border border-gold-300/5 flex-1 flex items-center justify-center">
                      <p className="text-xs text-gold-100/50">
                        No carer payments recorded yet for this placement.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* TAB 5: INTERNAL NOTES                                   */}
          {/* ------------------------------------------------------- */}
          {activeTab === "notes" && (
            <div className="p-6 rounded-2xl border border-gold-300/20 bg-navy-900/60 shadow-xl space-y-4">
              <div className="border-b border-gold-300/10 pb-4">
                <h3 className="text-base font-semibold text-gold-200 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gold-DEFAULT" />
                  Internal Administrative Notes & Audit Records
                </h3>
                <p className="text-xs text-gold-100/60 mt-0.5">
                  Private case notes, client preferences, and operational logs visible only to administrators.
                </p>
              </div>

              <InternalNotes entityId={placement.id} entityType="PLACEMENT" />
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* 5. SUB-MODALS (PAYMENT, BACKUP SELECTION, PROMOTE)        */}
      {/* ========================================================= */}
      {selectedPayment && (
        <PaymentUpdateModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onSuccess={() => {
            setSelectedPayment(null);
            loadPlacement();
          }}
        />
      )}

      {/* Select Preferred Backup Carer Modal via Candidate & Interest List Modal */}
      {isSelectBackupOpen && placement && (
        <AdminApplicationsModal
          careRequestId={placement.careRequestId}
          clientProfileId={placement.clientProfileId}
          clientName={clientName}
          placementId={placement.id}
          initialTab="interest-list"
          onClose={() => setIsSelectBackupOpen(false)}
          onStatusUpdated={() => {
            loadPlacement();
            if (onPlacementUpdated) onPlacementUpdated();
          }}
          onBackupSelected={(carer) => {
            setPreferredBackupCarer({
              id: carer.id,
              userId: carer.userId || carer.id,
              user: {
                id: carer.id,
                firstName: carer.firstName || carer.name?.split(" ")[0] || "Preferred",
                lastName: carer.lastName || carer.name?.split(" ")[1] || "Backup",
                email: carer.email || "carer@example.com",
                phoneNumber: carer.phoneNumber || "+44 222 222 222",
              },
            });
            setIsSelectBackupOpen(false);
            loadPlacement();
            if (onPlacementUpdated) onPlacementUpdated();
          }}
        />
      )}

      {/* Promote Backup Carer Modal */}
      {placement && (
        <PromoteBackupModal
          placementId={placement.id}
          clientName={clientName}
          currentPrimaryName={primaryCarerName}
          backupCarerName={backupName || "Backup Carer"}
          isOpen={isPromoteBackupOpen}
          onClose={() => setIsPromoteBackupOpen(false)}
          onPromoted={() => {
            loadPlacement();
            if (onPlacementUpdated) onPlacementUpdated();
          }}
        />
      )}
    </div>
  );
}
