"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/services/client/client.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientProfile, getClientPlacements } from "@/store/slices/clientSlice";
import { Download, Printer } from "lucide-react";

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
  gocardlessPaymentId?: string | null;
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
  const { profile, placements } = useAppSelector((state) => state.client);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      dispatch(fetchClientProfile());
      dispatch(getClientPlacements());
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

    // Check if redirected back from a checkout success
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const session = params.get("session");
    const billingRequestId = params.get("billing_request_id");
    const paymentStatus = params.get("payment");

    if (paymentStatus === "failed" || session === "cancelled") {
      setError("GoCardless payment mandate setup failed or was cancelled. Please try again.");
    }

    if (session === "success" || billingRequestId || paymentStatus === "success") {
      refreshUser();

      // Start polling backend updates as GoCardless webhook processing is asynchronous
      let pollCount = 0;
      const interval = setInterval(async () => {
        pollCount++;
        
        await refreshUser();
        dispatch(fetchClientProfile());
        dispatch(getClientPlacements());
        
        try {
          const invoicesData = await clientService.getInvoices();
          const list = Array.isArray(invoicesData) 
            ? invoicesData 
            : (invoicesData && Array.isArray((invoicesData as any).items) ? (invoicesData as any).items : []);
          setInvoices(list);
        } catch (e) {
          console.error("Polling invoices failed", e);
        }

        // Stop polling after 6 attempts (12 seconds)
        if (pollCount >= 6) {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [dispatch, refreshUser]);

  const handlePayLifetimeFee = async () => {
    try {
      setActionLoading("lifetime");
      const successUrl = `${window.location.origin}/client?payment=success`;
      const cancelUrl = `${window.location.origin}/client?payment=failed`;
      
      const { url } = await clientService.createLifetimeFeeCheckout(successUrl, cancelUrl);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to generate checkout URL");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate GoCardless Checkout.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubscribePlacement = async (placementId: string) => {
    try {
      setActionLoading(placementId);
      setError(null);
      const successUrl = `${window.location.origin}/client?tab=billing&session=success`;
      const cancelUrl = `${window.location.origin}/client?tab=billing&session=cancelled`;
      
      const { url } = await clientService.subscribeToPlacement(placementId, successUrl, cancelUrl);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to generate subscription checkout URL");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate GoCardless subscription setup.");
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
                  <strong>Status:</strong> <span class="badge">${inv.status}</span><br/>
                  ${inv.gocardlessPaymentId ? `<strong>GoCardless Payment ID:</strong> ${inv.gocardlessPaymentId}` : ""}
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
    <div className="w-full text-slate-100">
      <div className="w-full space-y-6">
        
        {/* Header */}
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gold-100">
            Billing & Payments
          </h2>
          <p className="mt-1 text-sm text-gold-200/60">
            Manage your platform fees, active placements subscription, and view invoice receipts.
          </p>
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
                      Redirecting to Checkout...
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
                Once we match you with a carer and confirm the placement, you must set up your weekly recurring subscription. Weekly fees are collected in advance every 7 days via Direct Debit (GoCardless).
              </p>
            </div>

            <div>
              {!placements || placements.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center">No care placements found requiring configuration.</p>
              ) : (
                <div className="space-y-4 mb-6">
                  {placements.map((placement) => {
                    const carerName = placement.carerProfile?.user 
                      ? `${placement.carerProfile.user.firstName} ${placement.carerProfile.user.lastName}` 
                      : "Carer Specialist";
                    const startDateStr = new Date(placement.startDate).toLocaleDateString();
                    const endDateStr = placement.endDate ? new Date(placement.endDate).toLocaleDateString() : "Ongoing";
                    const isSubscribed = !!placement.gocardlessMandateId || !!profile?.gocardlessMandateId;
                    
                    return (
                      <div key={placement.id} className="bg-navy-950 border border-navy-850 rounded-xl p-4 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-white text-sm">{carerName}</h3>
                          <div className="flex flex-col gap-1 text-xs text-slate-400">
                            <span>
                              <strong className="text-slate-300">Period:</strong> {startDateStr} — {endDateStr}
                            </span>
                            <span>
                              <strong className="text-slate-300">Weekly Fee:</strong> £{Number(placement.weeklyFee || 0).toFixed(2)} / week
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center w-full">
                          {isSubscribed ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 w-full justify-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                              Direct Debit Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSubscribePlacement(placement.id)}
                              disabled={actionLoading !== null}
                              className="w-full bg-[#d4af37] hover:bg-gold-400 text-navy-950 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center disabled:opacity-50"
                            >
                              {actionLoading === placement.id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy-950" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Redirecting...
                                </>
                              ) : (
                                "Authorize Direct Debit"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
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
  );
}
