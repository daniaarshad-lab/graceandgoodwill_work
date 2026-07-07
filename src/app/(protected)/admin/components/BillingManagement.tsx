import { useState, useEffect } from "react";
import { Placement } from "../types/admin.types";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface Invoice {
  id: string;
  clientName: string;
  carerName: string;
  hours: number;
  rate: number;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  rawStatus?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  invoiceDate?: string;
  payments?: any[];
}

interface BillingManagementProps {
  placements: Placement[];
}

export default function BillingManagement({
  placements,
}: BillingManagementProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [triggeringBilling, setTriggeringBilling] = useState(false);

  // Platform pricing and placement registry settings
  const [settings, setSettings] = useState<any>({
    id: "default",
    lifetimePlatformFee: 299.00,
    vatRate: 20.00,
    companyName: "Grace & Goodwill",
    companyAddress: "123 Care Street, London",
    invoicePrefix: "REG-",
  });
  const [detailedPlacements, setDetailedPlacements] = useState<any[]>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<any | null>(null);
  const [newWeeklyFee, setNewWeeklyFee] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadBillingDashboardData = async () => {
    try {
      setLoadingInvoices(true);
      setErrorMessage(null);

      // Load Invoices
      const invoicesData = await adminService.getAdminInvoices();
      const mapped = invoicesData.map((inv: any) => ({
        id: inv.invoiceNumber || inv.id,
        clientName: inv.clientProfile?.user 
          ? `${inv.clientProfile.user.firstName} ${inv.clientProfile.user.lastName}` 
          : "Client Registration",
        carerName: inv.carerProfile?.user 
          ? `${inv.carerProfile.user.firstName} ${inv.carerProfile.user.lastName}` 
          : "Platform Fee",
        hours: inv.hoursLogged || 0,
        rate: Number(inv.dailyRate || 0),
        amount: Number(inv.total || inv.amount || 0),
        status: (inv.status === "PAID" ? "Paid" : (inv.status === "PENDING" ? "Pending" : "Overdue")) as "Paid" | "Pending" | "Overdue",
        dueDate: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : "",
        rawStatus: inv.status,
        billingPeriodStart: inv.billingPeriodStart,
        billingPeriodEnd: inv.billingPeriodEnd,
        invoiceDate: inv.invoiceDate,
        payments: inv.payments,
      }));
      setInvoices(mapped);

      // Load Transactions
      const txData = await adminService.getAdminTransactions();
      setTransactions(txData);

      // Load Settings
      const settingsData = await adminService.getBillingSettings();
      if (settingsData) {
        setSettings({
          ...settingsData,
          lifetimePlatformFee: Number(settingsData.lifetimePlatformFee),
          vatRate: Number(settingsData.vatRate),
        });
      }

      // Load Placements detailed billing
      const placementsList = await adminService.getPlacements();
      const detailed: any[] = [];
      for (const p of placementsList) {
        try {
          const detail = await adminService.getPlacementBilling(p.id);
          detailed.push(detail);
        } catch (e) {
          console.error(`Failed to load billing details for placement ${p.id}`, e);
        }
      }
      setDetailedPlacements(detailed);
    } catch (e) {
      console.error("Failed to load admin billing data", e);
      setErrorMessage("Failed to load admin billing dashboard data.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    loadBillingDashboardData();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading("settings");
      setSuccessMessage(null);
      setErrorMessage(null);
      await adminService.updateBillingSettings(settings);
      setSuccessMessage("Platform settings updated successfully!");
      showSuccessToast("Settings Saved", "Platform settings updated successfully.");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update platform settings.");
      showErrorToast("Error", err?.message || "Failed to update platform settings.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTriggerBillingRun = async () => {
    if (!confirm("Are you sure you want to trigger the weekly billing run? This will calculate and issue invoices for all active placements.")) return;
    try {
      setTriggeringBilling(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      await adminService.triggerBillingRun();
      setSuccessMessage("Weekly billing run completed successfully! Invoices generated.");
      showSuccessToast("Billing Run Completed", "Weekly billing run completed successfully.");
      await loadBillingDashboardData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Billing run execution failed.");
      showErrorToast("Error", err?.message || "Billing run execution failed.");
    } finally {
      setTriggeringBilling(false);
    }
  };

  const handleWeeklyFeeOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacement) return;
    try {
      setActionLoading(`weekly-fee-${selectedPlacement.placementId}`);
      setErrorMessage(null);
      setSuccessMessage(null);
      await adminService.updatePlacementWeeklyFee(selectedPlacement.placementId, newWeeklyFee);
      setSuccessMessage(`Agreed weekly fee successfully overridden to £${newWeeklyFee} for future cycles.`);
      showSuccessToast("Fee Overridden", "Agreed weekly fee successfully overridden.");
      setSelectedPlacement(null);
      await loadBillingDashboardData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to override weekly fee.");
      showErrorToast("Error", err?.message || "Failed to override weekly fee.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePauseBilling = async (placementId: string) => {
    if (!confirm("Are you sure you want to pause Stripe billing collection for this placement?")) return;
    try {
      setActionLoading(`pause-${placementId}`);
      setErrorMessage(null);
      setSuccessMessage(null);
      await adminService.pausePlacementBilling(placementId);
      setSuccessMessage("Recurring weekly billing collection paused.");
      showSuccessToast("Billing Paused", "Recurring weekly billing collection paused.");
      await loadBillingDashboardData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to pause billing.");
      showErrorToast("Error", err?.message || "Failed to pause billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeBilling = async (placementId: string) => {
    try {
      setActionLoading(`resume-${placementId}`);
      setErrorMessage(null);
      setSuccessMessage(null);
      await adminService.resumePlacementBilling(placementId);
      setSuccessMessage("Recurring weekly billing collection resumed.");
      showSuccessToast("Billing Resumed", "Recurring weekly billing collection resumed.");
      await loadBillingDashboardData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resume billing.");
      showErrorToast("Error", err?.message || "Failed to resume billing.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Paid" as const } : inv,
      )
    );
    showSuccessToast("Invoice Paid", "Invoice marked as paid successfully.");
  };

  const handleSendReminder = async (id: string) => {
    try {
      setActionLoading(`remind-${id}`);
      setErrorMessage(null);
      setSuccessMessage(null);
      await adminService.resendInvoice(id);
      setSuccessMessage(`Reminder notification sent for invoice ${id}.`);
      showSuccessToast("Reminder Sent", "Payment reminder notification sent.");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send payment reminder.");
      showErrorToast("Error", err?.message || "Failed to send payment reminder.");
    } finally {
      setActionLoading(null);
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

  // Statistics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  if (loadingInvoices) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold">Loading billing configuration data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gold-200">
            Billing & Invoices Management
          </h2>
          <p className="text-sm text-gold-100/50">
            Configure global pricing parameters, monitor client invoicing, and oversee subscription overrides.
          </p>
        </div>
        <button
          onClick={handleTriggerBillingRun}
          disabled={triggeringBilling}
          className="rounded-xl bg-gold hover:bg-gold-600 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-navy-950 shadow-elegant transition-all flex items-center justify-center disabled:opacity-50"
        >
          {triggeringBilling ? "Triggering..." : "Trigger Billing Run"}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm">
          {errorMessage}
        </div>
      )}

      {/* METRICS ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-100/40">
            Total Invoiced
          </span>
          <div className="mt-2 text-2xl font-black text-gold">
            £{totalInvoiced.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Paid */}
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-950/20 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/60">
            Total Paid
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            £{totalPaid.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Pending */}
        <div className="rounded-2xl border border-amber-500/10 bg-amber-950/20 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400/60">
            Total Pending
          </span>
          <div className="mt-2 text-2xl font-black text-amber-400">
            £{totalPending.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Overdue */}
        <div className="rounded-2xl border border-rose-500/10 bg-rose-950/20 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400/60">
            Total Overdue
          </span>
          <div className="mt-2 text-2xl font-black text-rose-400">
            £{totalOverdue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* INVOICE LIST PANEL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 shadow-soft backdrop-blur-md">
            <h3 className="text-lg font-bold text-gold-200 mb-4">
              Invoice Records
            </h3>

            <div className="overflow-x-auto">
              {/* Desktop table */}
              <table className="hidden md:table w-full text-left text-sm text-gold-100/70">
                <thead>
                  <tr className="border-b border-gold-300/10 text-xs font-bold uppercase tracking-wider text-gold-100/40">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Client / Carer</th>
                    <th className="py-3 px-2">Hours Logged</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Due Date</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-300/5">
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gold-100/30"
                      >
                        No invoice records found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-navy-900/20 transition-all"
                      >
                        <td className="py-4 px-2 font-mono font-bold text-gold">
                          {inv.id}
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-semibold text-gold-100">
                            {inv.clientName}
                          </div>
                          <div className="text-[10px] text-gold-100/40">
                            Carer: {inv.carerName}
                          </div>
                        </td>
                        <td className="py-4 px-2 font-mono">
                          {inv.hours} hrs{" "}
                          <span className="text-[10px] text-gold-100/40">
                            @ £{inv.rate}/hr
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono font-bold text-gold-200">
                          £{inv.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              inv.status === "Paid"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : inv.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono">{inv.dueDate}</td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex justify-end gap-1.5">
                            {inv.status !== "Paid" && (
                              <button
                                onClick={() => handleMarkAsPaid(inv.id)}
                                className="rounded bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/40 px-2 py-1 text-[10px] font-bold text-emerald-300 uppercase transition-all"
                              >
                                Mark Paid
                              </button>
                            )}
                            {inv.status !== "Paid" && (
                              <button
                                onClick={() => handleSendReminder(inv.id)}
                                className="rounded bg-navy-950 border border-gold-300/10 hover:border-gold-300/30 px-2 py-1 text-[10px] font-bold text-gold-200 uppercase transition-all"
                              >
                                Remind
                              </button>
                            )}
                            {inv.status === "Paid" && (
                              <span className="text-[10px] text-emerald-400 font-bold uppercase py-1 px-2">
                                Cleared
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile Card List */}
              <div className="block md:hidden space-y-4">
                {invoices.length === 0 ? (
                  <p className="py-8 text-center text-gold-100/30 text-xs">No invoice records found.</p>
                ) : (
                  invoices.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-gold text-xs">{inv.id}</span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            inv.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : inv.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gold-100/40 font-semibold">Client:</span>
                          <span className="text-gold-100 font-semibold">{inv.clientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold-100/40 font-semibold">Carer:</span>
                          <span className="text-gold-100/70">{inv.carerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gold-100/40 font-semibold">Hours:</span>
                          <span>{inv.hours} hrs @ £{inv.rate}/hr</span>
                        </div>
                        <div className="flex justify-between border-t border-gold-300/5 pt-1.5 mt-1.5">
                          <span className="text-gold-100/40 font-semibold">Due Date:</span>
                          <span>{inv.dueDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-gold-200 pt-1">
                          <span>Amount:</span>
                          <span>£{inv.amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-gold-300/5">
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => handleMarkAsPaid(inv.id)}
                            className="rounded bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 uppercase transition-all"
                          >
                            Mark Paid
                          </button>
                        )}
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => handleSendReminder(inv.id)}
                            className="rounded bg-navy-950 border border-gold-300/10 hover:border-gold-300/30 px-3 py-1.5 text-xs font-bold text-gold-200 uppercase transition-all"
                          >
                            Remind
                          </button>
                        )}
                        {inv.status === "Paid" && (
                          <span className="text-xs text-emerald-400 font-bold uppercase py-1.5">
                            Cleared
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTION LOGS PANEL */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 shadow-soft backdrop-blur-md">
            <h3 className="text-lg font-bold text-gold-200 mb-4">
              Real-Time Transaction Audit
            </h3>
            <p className="text-xs text-gold-100/50 mb-4 leading-relaxed">
              Every card payment, platform registration fee, and carer subscription renewal processed via Stripe is recorded below for administrative auditing.
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-navy-800">
              {transactions.length === 0 ? (
                <p className="text-xs text-gold-100/30 text-center py-6">No transaction logs captured yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 rounded-xl border border-gold-300/5 bg-navy-950/60 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gold-100">
                        {tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : "User"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        tx.status === "SUCCESS" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-gold-100/60">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-semibold text-white">{tx.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-bold text-gold">£{Number(tx.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(tx.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Global Pricing Settings form */}
        <div className="bg-navy-900/60 border border-gold-300/10 rounded-2xl p-6 shadow-soft lg:col-span-2 backdrop-blur-md">
          <h3 className="text-lg font-bold text-gold-200 mb-6 uppercase tracking-wider">Global Pricing Settings</h3>
          
          <form onSubmit={handleUpdateSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gold-100/50 uppercase mb-2">Lifetime Platform Fee (£)</label>
                <input
                  type="number"
                  value={settings.lifetimePlatformFee}
                  onChange={(e) => setSettings({ ...settings, lifetimePlatformFee: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-gold-300/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-DEFAULT"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-100/50 uppercase mb-2">VAT Rate (%)</label>
                <input
                  type="number"
                  value={settings.vatRate}
                  onChange={(e) => setSettings({ ...settings, vatRate: Number(e.target.value) })}
                  className="w-full bg-navy-950 border border-gold-300/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-DEFAULT"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gold-100/50 uppercase mb-2">Invoice Prefix</label>
                <input
                  type="text"
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                  className="w-full bg-navy-950 border border-gold-300/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-DEFAULT"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gold-100/50 uppercase mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-navy-950 border border-gold-300/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-DEFAULT"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={actionLoading === "settings"}
                className="bg-navy-800 border border-gold-DEFAULT/20 text-gold-DEFAULT hover:bg-navy-700 font-bold py-2.5 px-6 rounded-lg transition"
              >
                {actionLoading === "settings" ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Metrics / Status */}
        <div className="bg-navy-900/60 border border-gold-300/10 rounded-2xl p-6 shadow-soft flex flex-col justify-between backdrop-blur-md">
          <div>
            <h3 className="text-lg font-bold text-gold-200 mb-6 uppercase tracking-wider">Placement Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gold-300/5">
                <span className="text-slate-400">Total Active Contracts</span>
                <span className="text-white font-bold text-lg">{detailedPlacements.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gold-300/5">
                <span className="text-slate-400">Failed / Overdue Invoices</span>
                <span className="text-rose-400 font-bold text-lg">
                  {invoices.filter(inv => inv.rawStatus === "FAILED" || inv.status === "Overdue").length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Pending Approvals</span>
                <span className="text-amber-400 font-bold text-lg">
                  {invoices.filter(inv => inv.status === "Pending").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placement Billing Registry */}
      <div className="bg-navy-900/60 border border-gold-300/10 rounded-2xl p-6 shadow-soft backdrop-blur-md">
        <h3 className="text-lg font-bold text-gold-200 mb-6 uppercase tracking-wider">Placement Billing Registry</h3>
        {detailedPlacements.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No active placements registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-slate-350">
              <thead>
                <tr className="border-b border-gold-300/10 text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Carer</th>
                  <th className="py-3.5 px-4 text-right">Weekly Fee</th>
                  <th className="py-3.5 px-4 text-center">Stripe Subscription</th>
                  <th className="py-3.5 px-4 text-center">Billing Status</th>
                  <th className="py-3.5 px-4 text-right">Outstanding Bal.</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {detailedPlacements.map((p) => (
                  <tr key={p.placementId} className="border-b border-gold-300/5 hover:bg-navy-850/20 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      {p.client.user ? `${p.client.user.firstName} ${p.client.user.lastName}` : "Client Profile"}
                    </td>
                    <td className="py-4 px-4">
                      {p.carer.user ? `${p.carer.user.firstName} ${p.carer.user.lastName}` : "Carer Profile"}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-gold-100">
                      £{Number(p.weeklyFee).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center text-xs font-mono text-slate-400">
                      {p.stripeSubscriptionId ? p.stripeSubscriptionId.slice(0, 14) + "..." : "Unsubscribed"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(p.billingStatus)}`}>
                        {p.billingStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-rose-300 font-mono">
                      £{Number(p.outstandingBalance).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPlacement(p);
                          setNewWeeklyFee(Number(p.weeklyFee));
                        }}
                        className="text-xs bg-navy-850 hover:bg-navy-800 text-gold-DEFAULT border border-gold-DEFAULT/20 px-2.5 py-1.5 rounded-lg transition"
                      >
                        Edit Fee
                      </button>
                      {p.billingStatus === "ACTIVE" ? (
                        <button
                          onClick={() => handlePauseBilling(p.placementId)}
                          disabled={actionLoading !== null}
                          className="text-xs bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition"
                        >
                          Pause
                        </button>
                      ) : p.billingStatus === "PAUSED" ? (
                        <button
                          onClick={() => handleResumeBilling(p.placementId)}
                          disabled={actionLoading !== null}
                          className="text-xs bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg transition"
                        >
                          Resume
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPlacement && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-gold-300/10 w-full max-w-md rounded-2xl p-6 shadow-soft space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Override Weekly Care Fee</h3>
              <p className="text-xs text-slate-400 mt-1">Placement ID: {selectedPlacement.placementId}</p>
            </div>
            <form onSubmit={handleWeeklyFeeOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold-100/50 uppercase mb-2">New Weekly Fee (£)</label>
                <input
                  type="number"
                  required
                  value={newWeeklyFee}
                  onChange={(e) => setNewWeeklyFee(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-gold-300/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gold-DEFAULT"
                />
                <p className="text-xs text-slate-500 mt-1">Modifies future invoice cycles only. Stripe subscription updates automatically.</p>
              </div>
              <div className="flex space-x-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlacement(null)}
                  className="bg-navy-850 text-slate-400 px-4 py-2 rounded-lg hover:bg-navy-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading?.startsWith("weekly-fee-")}
                  className="bg-[#d4af37] hover:bg-gold-400 text-navy-950 font-bold px-6 py-2 rounded-lg transition"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
