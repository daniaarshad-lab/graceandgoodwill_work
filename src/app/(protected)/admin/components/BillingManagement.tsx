import { useState, useEffect } from "react";
import { Placement } from "../types/admin.types";

interface Invoice {
  id: string;
  clientName: string;
  carerName: string;
  hours: number;
  rate: number;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
}

interface BillingManagementProps {
  placements: Placement[];
}

import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function BillingManagement({
  placements,
}: BillingManagementProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const loadInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const data = await adminService.getAdminInvoices();
      const mapped = data.map((inv: any) => ({
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
      }));
      setInvoices(mapped);

      const txData = await adminService.getAdminTransactions();
      setTransactions(txData);
    } catch (e) {
      console.error("Failed to load admin invoices", e);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const [triggeringBilling, setTriggeringBilling] = useState(false);

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

  const handleMarkAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Paid" as const } : inv,
      ),
    );
  };

  const handleSendReminder = (id: string) => {
    alert(`Payment reminder notification sent to the client for invoice ${id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gold-200">
            Billing & Invoices Management
          </h2>
          <p className="text-sm text-gold-100/50">
            Monitor client billing, record hours worked, and track carer
            payouts.
          </p>
        </div>
        <button
          onClick={async () => {
            setTriggeringBilling(true);
            try {
              const res = await adminService.triggerBillingRun();
              showSuccessToast("Billing Run Triggered", res.message || "Billing run completed successfully.");
              await loadInvoices();
            } catch (err: any) {
              showErrorToast("Billing Run Failed", err.message || "An error occurred.");
            } finally {
              setTriggeringBilling(false);
            }
          }}
          disabled={triggeringBilling}
          className="rounded-xl bg-gold hover:bg-gold-600 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-navy-950 shadow-elegant transition-all flex items-center justify-center disabled:opacity-50"
        >
          {triggeringBilling ? "Triggering..." : "Trigger Billing Run"}
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-100/40">
            Total Invoiced
          </span>
          <div className="mt-2 text-2xl font-black text-gold">
            £
            {totalInvoiced.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
            })}
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
            £
            {totalPending.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Overdue */}
        <div className="rounded-2xl border border-rose-500/10 bg-rose-950/20 p-5 shadow-soft backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400/60">
            Total Overdue
          </span>
          <div className="mt-2 text-2xl font-black text-rose-400">
            £
            {totalOverdue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
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
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
                        <td className="py-4 px-2 font-mono text-xs">
                          {inv.dueDate}
                        </td>
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
    </div>
  );
}
