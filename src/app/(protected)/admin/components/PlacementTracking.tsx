import { useState, useMemo, useEffect } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { Placement, CarerApplication } from "../types/admin.types";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import Button from "@/components/Button";
import Link from "next/link";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import InternalNotes from "./shared/InternalNotes/InternalNotes";

interface PlacementTrackingProps {
  placements: Placement[];
  carers: CarerApplication[];
  onToggleContactRelease: UseAdminPortalReturn["handleToggleContactRelease"];
  onReassignCarer: UseAdminPortalReturn["handleOverridePlacementCarer"];
  refreshPlacements?: () => void;
}

export default function PlacementTracking({
  placements,
  carers,
  onToggleContactRelease,
  onReassignCarer,
  refreshPlacements,
}: PlacementTrackingProps) {
  const [filter, setFilter] = useState<
    "All" | "PLACEMENT_STARTED" | "PLACEMENT_CONFIRMED" | "COMPLETED" | "ONGOING" | "CANCELLED"
  >("All");
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);
  const [expandedPlacementId, setExpandedPlacementId] = useState<string | null>(
    null,
  );
  const [reassignPlacementId, setReassignPlacementId] = useState<string | null>(
    null,
  );
  const [selectedNewCarerId, setSelectedNewCarerId] = useState<string>("");

  // Placement Billing States
  const [billingDetails, setBillingDetails] = useState<Record<string, any>>({});
  const [loadingBilling, setLoadingBilling] = useState<Record<string, boolean>>({});
  const [updatingWeeklyFee, setUpdatingWeeklyFee] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlacementBilling = async (placementId: string) => {
    setLoadingBilling((prev) => ({ ...prev, [placementId]: true }));
    try {
      const detail = await adminService.getPlacementBilling(placementId);
      setBillingDetails((prev) => ({ ...prev, [placementId]: detail }));
      if (detail && detail.weeklyFee) {
        setUpdatingWeeklyFee((prev) => ({ ...prev, [placementId]: detail.weeklyFee }));
      }
    } catch (err: any) {
      console.error("Failed to load placement billing details", err);
    } finally {
      setLoadingBilling((prev) => ({ ...prev, [placementId]: false }));
    }
  };

  const handleToggleExpand = (placementId: string) => {
    const nextVal = expandedPlacementId === placementId ? null : placementId;
    setExpandedPlacementId(nextVal);
    if (nextVal) {
      fetchPlacementBilling(placementId);
    }
  };

  const handleUpdateWeeklyFee = async (placementId: string) => {
    const fee = updatingWeeklyFee[placementId];
    if (fee === undefined || fee < 0) return;
    setActionLoading(`weekly-fee-${placementId}`);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await adminService.updatePlacementWeeklyFee(placementId, fee);
      setSuccessMessage("Weekly fee overridden successfully!");
      showSuccessToast("Fee Saved", "Agreed weekly fee overridden successfully.");
      await fetchPlacementBilling(placementId);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update weekly fee.");
      showErrorToast("Error", err.message || "Failed to update weekly fee.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePauseBilling = async (placementId: string) => {
    if (!confirm("Are you sure you want to pause Stripe billing collection for this placement?")) return;
    setActionLoading(`pause-${placementId}`);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await adminService.pausePlacementBilling(placementId);
      setSuccessMessage("Recurring weekly billing collection paused.");
      showSuccessToast("Billing Paused", "Recurring weekly billing collection paused.");
      await fetchPlacementBilling(placementId);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to pause billing.");
      showErrorToast("Error", err.message || "Failed to pause billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeBilling = async (placementId: string) => {
    setActionLoading(`resume-${placementId}`);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await adminService.resumePlacementBilling(placementId);
      setSuccessMessage("Recurring weekly billing collection resumed.");
      showSuccessToast("Billing Resumed", "Recurring weekly billing collection resumed.");
      await fetchPlacementBilling(placementId);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resume billing.");
      showErrorToast("Error", err.message || "Failed to resume billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendInvoice = async (invoiceId: string, placementId: string) => {
    setActionLoading(`resend-${invoiceId}`);
    try {
      await adminService.resendInvoice(invoiceId);
      showSuccessToast("Reminder Sent", "Payment reminder notification sent.");
      await fetchPlacementBilling(placementId);
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to send invoice reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefundPayment = async (paymentId: string, placementId: string) => {
    if (!confirm("Are you sure you want to issue a refund for this transaction? This action is irreversible.")) return;
    setActionLoading(`refund-${paymentId}`);
    try {
      await adminService.refundPayment(paymentId);
      showSuccessToast("Refund Success", "Payment refunded successfully.");
      await fetchPlacementBilling(placementId);
    } catch (err: any) {
      showErrorToast("Error", err.message || "Stripe refund trigger failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrintInvoice = (inv: any, clientName: string, clientEmail: string) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (printWindow) {
      const isReg = inv.invoiceNumber ? inv.invoiceNumber.startsWith("REG-") : inv.id.startsWith("REG-");
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${inv.invoiceNumber || inv.id}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
              .company-details { text-align: right; font-size: 12px; color: #64748b; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.05em; }
              .details { font-size: 14px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              .table th { background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; }
              .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
              .totals-box { display: flex; flex-direction: column; align-items: flex-end; margin-top: 20px; }
              .total-row { display: flex; justify-content: space-between; width: 250px; padding: 6px 0; font-size: 13px; }
              .total-row.grand-total { border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 18px; font-weight: bold; color: #0f172a; }
              .badge { display: inline-block; padding: 4px 12px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
              .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 50px; font-size: 12px; color: #94a3b8; }
              @media print { .no-print { display: none; } body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #d4af37; border: none; color: #0f172a; font-weight: bold; border-radius: 6px; cursor: pointer;">
                Print / Save PDF
              </button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
              <div>
                <div class="logo">Grace & Goodwill</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">CARE DEFINED BY INTEGRITY</div>
              </div>
              <div class="company-details">
                <strong>Grace & Goodwill Ltd</strong><br/>
                123 Care Street, London, UK<br/>
                VAT Registration No: GB 123 4567 89
              </div>
            </div>
            <div class="meta-grid">
              <div>
                <div class="section-title">Invoice To</div>
                <div class="details"><strong>${clientName}</strong><br/>${clientEmail}</div>
              </div>
              <div style="text-align: right;">
                <div class="section-title">Invoice Details</div>
                <div class="details">
                  <strong>Invoice Number:</strong> ${inv.invoiceNumber || inv.id}<br/>
                  <strong>Date of Issue:</strong> ${new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}<br/>
                  <strong>Status:</strong> <span class="badge">${inv.status}</span>
                </div>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Subtotal</th>
                  <th style="text-align: right;">VAT (20%)</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${isReg ? 'Lifetime Matching Platform Access' : 'Live-in Care Weekly Placement Service'}</strong><br/>
                    <span style="font-size: 12px; color: #64748b;">
                      ${isReg 
                        ? 'One-off registration fee covering onboarding, profiling, and lifetime matched access.' 
                        : `Weekly recurring placement cycle: ${new Date(inv.billingPeriodStart).toLocaleDateString()} to ${new Date(inv.billingPeriodEnd).toLocaleDateString()}`
                      }
                    </span>
                  </td>
                  <td style="text-align: right;">£${Number(inv.subtotal || (Number(inv.total || inv.amount) / 1.2)).toFixed(2)}</td>
                  <td style="text-align: right;">£${Number(inv.vat || (Number(inv.total || inv.amount) - (Number(inv.total || inv.amount) / 1.2))).toFixed(2)}</td>
                  <td style="text-align: right;">£${Number(inv.total || inv.amount).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div class="totals-box">
              <div class="total-row"><span>Subtotal</span><span>£${Number(inv.subtotal || (Number(inv.total || inv.amount) / 1.2)).toFixed(2)}</span></div>
              <div class="total-row"><span>VAT (20%)</span><span>£${Number(inv.vat || (Number(inv.total || inv.amount) - (Number(inv.total || inv.amount) / 1.2))).toFixed(2)}</span></div>
              <div class="total-row grand-total"><span>Total Paid</span><span>£${Number(inv.total || inv.amount).toFixed(2)}</span></div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      ACTIVE: "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400",
      PAUSED: "bg-amber-950/60 border border-amber-500/30 text-amber-400 animate-pulse",
      CANCELLED: "bg-red-950/60 border border-red-500/30 text-red-400",
      PAID: "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400",
      PENDING: "bg-amber-950/60 border border-amber-500/30 text-amber-400",
      FAILED: "bg-red-950/60 border border-red-500/30 text-red-400 animate-pulse",
      OVERDUE: "bg-rose-950/60 border border-rose-500/30 text-rose-400",
      REFUNDED: "bg-slate-900 border border-slate-700 text-slate-400",
    };
    return statusMap[status.toUpperCase()] || "bg-navy-800 text-slate-400";
  };

  const filteredPlacements = placements.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter;
  });

  // Approved Carers pool for reassignment overrides
  const approvedCarers = useMemo(() => {
    return carers.filter((c) => c.status === "Approved");
  }, [carers]);

  const handleUpdateStatus = async (placementId: string, newStatus: string) => {
    setUpdatingStatusFor(placementId);
    try {
      await adminService.updatePlacementStatus(placementId, newStatus);
      showSuccessToast("Status Updated", "Placement status successfully updated.");
      if (refreshPlacements) {
        refreshPlacements();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      showErrorToast("Failed to update status", error.message);
    } finally {
      setUpdatingStatusFor(null);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gold-200 mb-1.5">
            Care Placement Tracking Pipeline
          </h3>
          <p className="text-xs text-gold-100/50 max-w-xl leading-relaxed">
            Monitor active matchups, authorize contact release, perform manual
            override swaps, and audit operational timelines
          </p>
        </div>

        <div 
          className="flex flex-nowrap items-center rounded-xl bg-navy-950 p-1 border border-gold-300/10 gap-1 max-w-full overflow-x-auto admin-placement-tabs"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.admin-placement-tabs::-webkit-scrollbar { display: none; }`}</style>
          {[
            { label: "All", value: "All" },
            { label: "Active", value: "PLACEMENT_STARTED" },
            { label: "Matched", value: "PLACEMENT_CONFIRMED" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              variant="selectable"
              isSelected={filter === tab.value}
              size="sm"
              fullWidth={false}
              className="rounded-lg px-4 py-1.5 text-xs tracking-wide whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPlacements.map((place) => {
          const isExpanded = expandedPlacementId === place.id;
          const isReassigning = reassignPlacementId === place.id;

          return (
            <SectionCard key={place.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-300/5 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/admin/clients/${place.clientId}`}
                      className="text-lg font-bold text-gold-200 hover:text-gold hover:underline transition duration-200 cursor-pointer"
                    >
                      {place.clientName}
                    </Link>
                    <span className="text-gold-100/40">➔</span>
                    <h4 className="text-lg font-bold text-gold">
                      {place.carerName}
                    </h4>
                  </div>
                  <p className="text-xs text-gold-100/50 mt-1">
                    {place.careType && (Array.isArray(place.careType) ? place.careType.join(", ") : place.careType) + " • "}
                    {place.location} • Commenced:{" "}
                    {place.startDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={place.status}
                    disabled={updatingStatusFor === place.id}
                    onChange={(e) => handleUpdateStatus(place.id, e.target.value)}
                    className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-[10px] font-bold text-gold-200 outline-none focus:border-gold-300/50 transition duration-300 cursor-pointer"
                  >
                    <option value="PLACEMENT_CONFIRMED">Matched</option>
                    <option value="PLACEMENT_STARTED">Active</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button
                    onClick={() => handleToggleExpand(place.id)}
                    variant="ghost-gold"
                    size="sm"
                    fullWidth={false}
                  >
                    {isExpanded ? "Hide Details ▲" : "Expand Details ▼"}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-6 bg-navy-950/40 p-4 rounded-xl border border-gold-300/5 transition duration-300">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Contact details authorization gates */}
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
                        Contact Details Visibility Gate
                      </h5>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          place.contactDetailsReleased
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-gold/10 text-gold-DEFAULT border border-gold/20"
                        }`}
                      >
                        {place.contactDetailsReleased
                          ? "Released"
                          : "Restricted"}
                      </span>
                    </div>

                    <div className="space-y-2 rounded-xl bg-navy-950 p-3 border border-gold-300/5 text-xs">
                      <div className="flex items-center justify-between border-b border-gold-300/5 pb-2">
                        <span className="text-gold-100/40 font-semibold">
                          Client Phone / Email:
                        </span>
                        <span className="text-gold-200 font-medium font-mono">
                          {place.contactDetailsReleased
                            ? "+44 7700 910777"
                            : "****** Restricted ******"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gold-100/40 font-semibold">
                          Carer Phone / Email:
                        </span>
                        <span className="text-gold-200 font-medium font-mono">
                          {place.contactDetailsReleased
                            ? "+44 7700 900882"
                            : "****** Restricted ******"}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onToggleContactRelease(place.id)}
                      variant={
                        place.contactDetailsReleased ? "danger" : "primary"
                      }
                      size="sm"
                      fullWidth
                    >
                      {place.contactDetailsReleased
                        ? "Revoke Details Visibility Gate"
                        : "Approve Contact Release"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
                      Chronological Milestone Audit
                    </h5>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {place.timeline.map((event, eventIdx) => (
                          <li key={event.title}>
                            <div className="relative pb-8">
                              {eventIdx !== place.timeline.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gold-300/10"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-950 text-gold-DEFAULT border border-gold-300/10">
                                    ✓
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1.5">
                                  <p className="text-xs font-bold text-gold-200">
                                    {event.title}
                                  </p>
                                  <p className="text-[10px] text-gold-100/40">
                                    {event.timestamp}
                                  </p>
                                  <p className="text-[11px] text-gold-100/60 italic mt-1">
                                    &ldquo;{event.description}&rdquo;
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

                  {/* Dedicated Billing Section */}
                  <div className="border-t border-gold-300/10 pt-6 mt-6">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gold-200 mb-4">
                      Placement Financial & Billing Overview
                    </h5>
                    {loadingBilling[place.id] ? (
                      <p className="text-xs text-gold-100/50">Loading placement financial metrics...</p>
                    ) : billingDetails[place.id] ? (
                      (() => {
                        const detail = billingDetails[place.id];
                        const clientName = place.clientName;
                        const clientEmail = detail.client?.user?.email || "";
                        const invoicesList = detail.invoices || [];

                        return (
                          <div className="space-y-6">
                            {successMessage && (
                              <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs">
                                {successMessage}
                              </div>
                            )}
                            {errorMessage && (
                              <div className="p-3.5 rounded bg-red-950/40 border border-red-500/20 text-red-400 text-xs">
                                {errorMessage}
                              </div>
                            )}

                            {/* Financial KPI Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-navy-950 p-4 rounded-xl border border-gold-300/5 text-xs">
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Agreed Weekly Fee</span>
                                <span className="font-mono text-gold-100 text-sm font-bold">£{Number(detail.weeklyFee).toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Daily Rate (Calc)</span>
                                <span className="font-mono text-gold-100 text-sm">£{Number(detail.dailyRate).toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Billing Frequency</span>
                                <span className="text-slate-300 text-sm font-medium">{detail.billingFrequency}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Outstanding Balance</span>
                                <span className="font-mono text-rose-400 text-sm font-bold">£{Number(detail.outstandingBalance).toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-navy-950 p-4 rounded-xl border border-gold-300/5 text-xs">
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Platform Fee Status</span>
                                <span className={`text-xs font-bold ${detail.isLifetimeFeePaid ? "text-emerald-400" : "text-amber-500"}`}>
                                  {detail.isLifetimeFeePaid ? "Paid & Confirmed" : "Pending Payment"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Stripe Subscription Status</span>
                                <span className="text-slate-350 text-xs font-medium">{detail.billingStatus || "Unsubscribed"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Next Billing Cycle</span>
                                <span className="text-slate-350 font-mono text-xs">{detail.nextBillingDate ? new Date(detail.nextBillingDate).toLocaleDateString() : "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block mb-0.5">Subscription ID</span>
                                <span className="text-slate-400 text-[10px] font-mono">{detail.stripeSubscriptionId ? detail.stripeSubscriptionId.slice(0, 15) + "..." : "None"}</span>
                              </div>
                            </div>

                            {/* Billing Action Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-950 border border-gold-300/5">
                              <div className="flex items-center gap-3">
                                <div>
                                  <label className="block text-[10px] text-gold-100/40 uppercase tracking-wider mb-1">Agreed Weekly Fee (£)</label>
                                  <input
                                    type="number"
                                    value={updatingWeeklyFee[place.id] !== undefined ? updatingWeeklyFee[place.id] : Number(detail.weeklyFee)}
                                    onChange={(e) => setUpdatingWeeklyFee(prev => ({ ...prev, [place.id]: Number(e.target.value) }))}
                                    className="w-28 bg-navy-900 border border-gold-300/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-gold-DEFAULT"
                                  />
                                </div>
                                <button
                                  onClick={() => handleUpdateWeeklyFee(place.id)}
                                  disabled={actionLoading === `weekly-fee-${place.id}`}
                                  className="mt-4 bg-navy-800 border border-gold-DEFAULT/20 text-gold-DEFAULT hover:bg-navy-700 px-3 py-1 rounded text-xs font-bold transition"
                                >
                                  Save Fee
                                </button>
                              </div>

                              <div className="flex gap-2">
                                {detail.billingStatus === "ACTIVE" ? (
                                  <button
                                    onClick={() => handlePauseBilling(place.id)}
                                    disabled={actionLoading !== null}
                                    className="bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                                  >
                                    Pause Billing
                                  </button>
                                ) : detail.billingStatus === "PAUSED" ? (
                                  <button
                                    onClick={() => handleResumeBilling(place.id)}
                                    disabled={actionLoading !== null}
                                    className="bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                                  >
                                    Resume Billing
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {/* Placement Invoice History Table */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-gold-100/50 uppercase tracking-widest font-bold block mb-2">Generated Placement Invoices</span>
                              {invoicesList.length === 0 ? (
                                <p className="text-xs text-gold-100/30 py-3 bg-navy-950/30 rounded-xl text-center">No statements generated for this placement yet.</p>
                              ) : (
                                <div className="overflow-x-auto rounded-xl border border-gold-300/5 bg-navy-950/20">
                                  <table className="w-full text-left border-collapse text-xs text-slate-350">
                                    <thead>
                                      <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold text-gold-200">
                                        <th className="py-2.5 px-3">Invoice ID</th>
                                        <th className="py-2.5 px-3">Period</th>
                                        <th className="py-2.5 px-3">Subtotal</th>
                                        <th className="py-2.5 px-3">VAT (20%)</th>
                                        <th className="py-2.5 px-3">Total</th>
                                        <th className="py-2.5 px-3 text-center">Status</th>
                                        <th className="py-2.5 px-3 text-right">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {invoicesList.map((inv: any) => {
                                        const payment = inv.payments?.find((p: any) => p.status === "Paid");
                                        const isPaid = inv.status === "PAID";
                                        
                                        return (
                                          <tr key={inv.id} className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors">
                                            <td className="py-3 px-3 font-mono font-semibold text-white">{inv.invoiceNumber || inv.id}</td>
                                            <td className="py-3 px-3 text-slate-400">
                                              {inv.billingPeriodStart ? `${new Date(inv.billingPeriodStart).toLocaleDateString()} - ${new Date(inv.billingPeriodEnd).toLocaleDateString()}` : "Onboarding Access"}
                                            </td>
                                            <td className="py-3 px-3 font-mono">£{Number(inv.subtotal || (Number(inv.total || inv.amount) / 1.2)).toFixed(2)}</td>
                                            <td className="py-3 px-3 font-mono">£{Number(inv.vat || (Number(inv.total || inv.amount) - (Number(inv.total || inv.amount) / 1.2))).toFixed(2)}</td>
                                            <td className="py-3 px-3 font-mono font-semibold text-gold-DEFAULT">£{Number(inv.total || inv.amount).toFixed(2)}</td>
                                            <td className="py-3 px-3 text-center">
                                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                inv.status === "PAID" 
                                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                  : inv.status === "PENDING"
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                              }`}>
                                                {inv.status}
                                              </span>
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                              <div className="flex justify-end items-center gap-3">
                                                {inv.pdfUrl && (
                                                  <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="text-gold-DEFAULT hover:underline font-bold text-[10px]">PDF</a>
                                                )}
                                                {inv.receiptUrl && (
                                                  <a href={inv.receiptUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-gold-DEFAULT hover:underline font-bold text-[10px]">Stripe</a>
                                                )}
                                                <button onClick={() => handlePrintInvoice(inv, clientName, clientEmail)} className="text-gold-DEFAULT hover:underline font-bold text-[10px]">Print</button>
                                                {inv.status !== "PAID" && (
                                                  <button onClick={() => handleResendInvoice(inv.id, place.id)} className="text-gold-200/60 hover:text-gold-DEFAULT hover:underline font-bold text-[10px]">Remind</button>
                                                )}
                                                {isPaid && payment && (
                                                  <button onClick={() => handleRefundPayment(payment.id, place.id)} className="text-red-400 hover:underline font-bold text-[10px]">Refund</button>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-xs text-gold-100/30">No billing information found for this placement.</p>
                    )}
                  </div>

                  {/* Internal Notes Section */}
                  <div className="border-t border-gold-300/10 pt-6">
                    <InternalNotes entityId={place.id} entityType="PLACEMENT" />
                  </div>
                </div>
              )}

              {/* Override / Reassignment Actions bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold-300/5 pt-4">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-gold-100/30">
                  Critical Placement Tools
                </p>

                {place.status?.toUpperCase() === "PLACEMENT_STARTED" || place.status?.toUpperCase() === "ONGOING" ? (
                  isReassigning ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <select
                        value={selectedNewCarerId}
                        onChange={(e) => setSelectedNewCarerId(e.target.value)}
                        className="w-full sm:w-auto rounded-lg bg-navy-950 border border-gold-300/10 px-3 py-2 text-xs text-gold-200 focus:outline-none"
                      >
                        <option value="">Select Replacement Carer...</option>
                        {approvedCarers
                          .filter((c) => c.id !== place.carerId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.city} - {c.experience})
                            </option>
                          ))}
                      </select>

                      <Button
                        onClick={() => {
                          if (selectedNewCarerId) {
                            onReassignCarer(place.id, selectedNewCarerId);
                            setReassignPlacementId(null);
                            setSelectedNewCarerId("");
                          }
                        }}
                        disabled={!selectedNewCarerId}
                        variant="primary"
                        size="sm"
                        fullWidth={false}
                      >
                        Reassign
                      </Button>
                      <Button
                        onClick={() => {
                          setReassignPlacementId(null);
                          setSelectedNewCarerId("");
                        }}
                        variant="ghost-gold"
                        size="sm"
                        fullWidth={false}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setReassignPlacementId(place.id)}
                      variant="ghost-gold"
                      size="sm"
                      fullWidth={false}
                      className="font-bold bg-navy-950/40 border border-gold-300/15"
                    >
                      Manual Override (Reassign Carer)
                    </Button>
                  )
                ) : (
                  <span className="text-xs text-rose-400 font-semibold italic bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                    Reassignment disabled: Placement is {place.status.toLowerCase()} (contract inactive)
                  </span>
                )}
              </div>
            </SectionCard>
          );
        })}

        {filteredPlacements.length === 0 && (
          <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
            No placements found matching the &apos;{filter}&apos; filter.
          </div>
        )}
      </div>
    </div>
  );
}
