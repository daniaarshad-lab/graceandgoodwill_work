"use client";

import { useState } from "react";
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

export default function BillingManagement({
  placements,
}: BillingManagementProps) {
  // Pre-seed some mock invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2026-001",
      clientName: "Eleanor Vance",
      carerName: "Sarah Connor",
      hours: 40,
      rate: 15.0,
      amount: 600.0,
      status: "Paid",
      dueDate: "2026-06-01",
    },
    {
      id: "INV-2026-002",
      clientName: "Arthur Dent",
      carerName: "Ford Prefect",
      hours: 35,
      rate: 18.0,
      amount: 630.0,
      status: "Pending",
      dueDate: "2026-06-15",
    },
    {
      id: "INV-2026-003",
      clientName: "Thomas Wayne",
      carerName: "Alfred Pennyworth",
      hours: 50,
      rate: 25.0,
      amount: 1250.0,
      status: "Overdue",
      dueDate: "2026-05-28",
    },
  ]);

  // Form states for generating a new invoice
  const [selectedPlacementId, setSelectedPlacementId] = useState("");
  const [hours, setHours] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  // Generate Invoice Handler
  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlacementId || !hours || !dueDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const placement = placements.find((p) => p.id === selectedPlacementId);
    if (!placement) return;

    const rateVal = parseFloat(customRate) || 15.0; // default rate
    const hoursVal = parseFloat(hours);
    const amountVal = hoursVal * rateVal;

    const newInvoice: Invoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      clientName: placement.clientName,
      carerName: placement.carerName,
      hours: hoursVal,
      rate: rateVal,
      amount: amountVal,
      status: "Pending",
      dueDate: dueDate,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setSuccessMsg(
      `Successfully generated invoice ${newInvoice.id} for £${amountVal.toFixed(2)}`,
    );

    // Reset fields
    setSelectedPlacementId("");
    setHours("");
    setCustomRate("");
    setDueDate("");

    setTimeout(() => setSuccessMsg(""), 5000);
  };

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
              <table className="w-full text-left text-sm text-gold-100/70">
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
            </div>
          </div>
        </div>

        {/* GENERATE NEW INVOICE FORM */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-6 shadow-soft backdrop-blur-md">
            <h3 className="text-lg font-bold text-gold-200 mb-4">
              Generate Placement Invoice
            </h3>

            {successMsg && (
              <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-100/50 mb-1.5">
                  Select Active Placement *
                </label>
                <select
                  required
                  value={selectedPlacementId}
                  onChange={(e) => setSelectedPlacementId(e.target.value)}
                  className="w-full rounded-xl border border-gold-300/10 bg-navy-950 px-3 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none"
                >
                  <option value="">-- Choose Placement --</option>
                  {placements
                    .filter(
                      (p) => p.status === "Active" || p.status === "Matched",
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.clientName} (Carer: {p.carerName})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-100/50 mb-1.5">
                    Hours Worked *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    placeholder="e.g. 40"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full rounded-xl border border-gold-300/10 bg-navy-950 px-3 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gold-100/50 mb-1.5">
                    Hourly Rate (£)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="0.5"
                    placeholder="Default: 15.00"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-full rounded-xl border border-gold-300/10 bg-navy-950 px-3 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-100/50 mb-1.5">
                  Invoice Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-gold-300/10 bg-navy-950 px-3 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gold hover:bg-gold-600 px-4 py-3 text-xs font-bold tracking-wider uppercase text-navy-950 shadow-elegant transition-all mt-2"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
