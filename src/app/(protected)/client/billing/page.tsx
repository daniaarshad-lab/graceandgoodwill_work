"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/services/client/client.service";
import ProtectedRoute from "@/guards/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientProfile } from "@/store/slices/clientSlice";
import { Download, ExternalLink, Printer } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: string;
  subtotal: string;
  vat: string;
  total: string;
  status: string;
  pdfUrl?: string;
  receiptUrl?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  placement?: {
    id: string;
    weeklyFee: string;
    status: string;
  };
}

export default function ClientBillingPage() {
  const { user, refreshUser } = useAuth();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.client);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      dispatch(fetchClientProfile());
      const invoicesData = await clientService.getInvoices();
      const list = Array.isArray(invoicesData) 
        ? invoicesData 
        : (invoicesData && Array.isArray((invoicesData as any).items) ? (invoicesData as any).items : []);
      setInvoices(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load billing history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handlePayLifetimeFee = async () => {
    try {
      setActionLoading("lifetime");
      setError(null);
      const successUrl = `${window.location.origin}/client/billing?session=success`;
      const cancelUrl = `${window.location.origin}/client/billing?session=cancelled`;
      
      const { url } = await clientService.createLifetimeFeeCheckout(successUrl, cancelUrl);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to generate checkout URL");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate Stripe Checkout.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubscribePlacement = async (placementId: string) => {
    try {
      setActionLoading(placementId);
      setError(null);
      const successUrl = `${window.location.origin}/client/billing?session=success`;
      const cancelUrl = `${window.location.origin}/client/billing?session=cancelled`;
      
      const { url } = await clientService.subscribeToPlacement(placementId, successUrl, cancelUrl);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to generate subscription checkout URL");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate subscription checkout.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrintInvoice = (inv: Invoice) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (printWindow) {
      const isReg = inv.invoiceNumber.startsWith("REG-");
      const clientName = profile?.user ? `${profile.user.firstName} ${profile.user.lastName}` : "Client Family";
      const clientEmail = profile?.user?.email || "";
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${inv.invoiceNumber}</title>
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
              @media print {
                .no-print { display: none; }
                body { padding: 0; }
              }
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
                <div class="details">
                  <strong>${clientName}</strong><br/>
                  ${clientEmail}
                </div>
              </div>
              <div style="text-align: right;">
                <div class="section-title">Invoice Details</div>
                <div class="details">
                  <strong>Invoice Number:</strong> ${inv.invoiceNumber}<br/>
                  <strong>Date of Issue:</strong> ${new Date(inv.invoiceDate).toLocaleDateString()}<br/>
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
                  <td style="text-align: right;">£${Number(inv.subtotal || (Number(inv.total) / 1.2)).toFixed(2)}</td>
                  <td style="text-align: right;">£${Number(inv.vat || (Number(inv.total) - (Number(inv.total) / 1.2))).toFixed(2)}</td>
                  <td style="text-align: right;">£${Number(inv.total).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals-box">
              <div class="total-row">
                <span>Subtotal</span>
                <span>£${Number(inv.subtotal || (Number(inv.total) / 1.2)).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>VAT (20%)</span>
                <span>£${Number(inv.vat || (Number(inv.total) - (Number(inv.total) / 1.2))).toFixed(2)}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total Paid</span>
                <span>£${Number(inv.total).toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for choosing Grace & Goodwill.<br/>
              If you have any questions about this statement, please contact accounts@graceandgoodwill.com
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Find any placements that need subscription setup
  // We can infer placements from invoices or profile relations
  const isLifetimePaid = profile?.isLifetimeFeePaid;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PAID: "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400",
      PENDING: "bg-amber-950/60 border border-amber-500/30 text-amber-400",
      FAILED: "bg-red-950/60 border border-red-500/30 text-red-400",
      OVERDUE: "bg-rose-950/60 border border-rose-500/30 text-rose-400",
      REFUNDED: "bg-slate-900 border border-slate-700 text-slate-400",
    };
    return statusMap[status.toUpperCase()] || "bg-navy-800 text-slate-400";
  };

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <div className="min-h-screen bg-navy-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-navy-900 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Billing & <span className="text-gold-DEFAULT">Payments</span>
              </h1>
              <p className="text-slate-400 mt-1">Manage your platform fees, active placements subscription, and view invoice receipts.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Core Cards: Lifetime Fee & Active Placements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Lifetime Platform Fee Card */}
            <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">Lifetime Platform Fee</h2>
                  {isLifetimePaid ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                      Active & Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-950/60 border border-red-500/30 text-red-400 animate-pulse">
                      Payment Required
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Grace & Goodwill charges a one-off lifetime registration fee of <span className="font-semibold text-white">£299 + VAT</span> which covers your initial consultation, comprehensive client onboarding, and lifetime access to our carer matching platform.
                </p>
              </div>

              <div>
                {isLifetimePaid ? (
                  <div className="bg-navy-950 border border-navy-850 rounded-xl p-4 flex items-center space-x-3 text-slate-400">
                    <svg className="h-6 w-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Verified on security log. Matching active.</span>
                  </div>
                ) : (
                  <button
                    onClick={handlePayLifetimeFee}
                    disabled={actionLoading !== null}
                    className="w-full bg-[#d4af37] hover:bg-gold-400 text-navy-950 font-bold py-3.5 px-4 rounded-xl transition shadow-elegant flex items-center justify-center disabled:opacity-50"
                  >
                    {actionLoading === "lifetime" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Redirecting to Stripe...
                      </>
                    ) : (
                      "Pay Registration Fee (£358.80 Inc. VAT)"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Active Placements Subscription Card */}
            <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Placement Weekly Subscription</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Once we match you with a carer and confirm the placement, you must set up your weekly recurring subscription. Weekly fees are collected in advance every 7 days via Stripe.
                </p>
              </div>

              <div>
                {/* List unique placements that don't have stripeSubscriptionId set */}
                {invoices.length > 0 && invoices.some(inv => inv.placement && !inv.placement.weeklyFee) ? (
                  <p className="text-slate-400 text-sm mb-4">No active placements requiring configuration.</p>
                ) : null}

                {/* Provide a quick checkout helper for any placement linked in invoice history */}
                {invoices.map((inv) => {
                  if (inv.placement && !inv.placement.weeklyFee) { // Wait, placeholder checkout
                    return (
                      <button
                        key={inv.id}
                        onClick={() => handleSubscribePlacement(inv.placement!.id)}
                        disabled={actionLoading !== null}
                        className="w-full bg-navy-800 hover:bg-navy-700 border border-gold-DEFAULT/20 text-gold-DEFAULT font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center disabled:opacity-50"
                      >
                        Activate Subscription for Placement #{inv.placement!.id.slice(0, 8)}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <div className="bg-navy-950 border border-navy-850 rounded-xl p-4 flex items-center space-x-3 text-slate-400">
                  <svg className="h-5 w-5 text-gold-DEFAULT flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Subscriptions anchor to the placement start date.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Invoice History */}
          <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-xl font-bold text-white mb-6">Payment History</h2>
            
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-DEFAULT"></div>
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-slate-400 text-center py-12">No invoices generated yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 font-semibold">
                      <th className="py-3.5 px-4">Invoice ID</th>
                      <th className="py-3.5 px-4">Billing Period</th>
                      <th className="py-3.5 px-4">Issue Date</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-navy-850 hover:bg-navy-850/20 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">{inv.invoiceNumber}</td>
                        <td className="py-4 px-4 text-slate-400">
                          {new Date(inv.billingPeriodStart).toLocaleDateString()} - {new Date(inv.billingPeriodEnd).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-right font-semibold text-white">
                          £{Number(inv.total).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end items-center gap-4">
                            {inv.pdfUrl && (
                              <a
                                href={inv.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-gold-DEFAULT hover:underline text-xs"
                              >
                                <Download className="w-3.5 h-3.5" /> PDF
                              </a>
                            )}
                            {inv.receiptUrl && (
                              <a
                                href={inv.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-slate-400 hover:text-gold-DEFAULT hover:underline text-xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Stripe
                              </a>
                            )}
                            <button
                              onClick={() => handlePrintInvoice(inv)}
                              className="inline-flex items-center gap-1 font-bold text-gold-DEFAULT hover:underline text-xs"
                            >
                              <Printer className="w-3.5 h-3.5" /> Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
