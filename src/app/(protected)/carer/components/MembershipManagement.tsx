"use client";

import { useEffect, useState } from "react";
import { carerService } from "@/services/carer/carer.service";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { 
  Check, 
  Star, 
  Shield, 
  Award, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  Calendar, 
  Clock, 
  CreditCard,
  X,
  FileText
} from "lucide-react";

interface CarerSubscription {
  id: string;
  tier: "FREE" | "GOLD_ELITE" | "VERIFIED_PROFESSIONAL";
  status: "ACTIVE" | "PAST_DUE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  expiresAt: string;
  stripeSubscriptionId?: string;
  cancelAtPeriodEnd: boolean;
}

interface MembershipInvoice {
  id: string;
  amount: number;
  status: string;
  pdfUrl?: string;
  hostedUrl?: string;
  paidAt?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export default function MembershipManagement() {
  const [subscription, setSubscription] = useState<CarerSubscription | null>(null);
  const [invoices, setInvoices] = useState<MembershipInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showGoldModal, setShowGoldModal] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const subInfo = await carerService.getSubscriptionInfo();
      // If no subscription record exists, default to FREE
      if (!subInfo) {
        setSubscription({
          id: "",
          tier: "FREE",
          status: "ACTIVE",
          startDate: "",
          expiresAt: "",
          cancelAtPeriodEnd: false
        });
      } else {
        setSubscription(subInfo);
      }
      
      const invoiceList = await carerService.getSubscriptionInvoices();
      setInvoices(invoiceList || []);
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: "GOLD_ELITE" | "VERIFIED_PROFESSIONAL") => {
    setProcessing(true);
    try {
      const successUrl = `${window.location.origin}/carer?tab=membership&upgrade=success`;
      const cancelUrl = `${window.location.origin}/carer?tab=membership&upgrade=cancel`;
      
      const session = await carerService.createCheckoutSession(tier, successUrl, cancelUrl);
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Invalid session response");
      }
    } catch (err: any) {
      showErrorToast("Upgrade Failed", err.message || "Failed to connect to payment gateway");
      setProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    setProcessing(true);
    try {
      const returnUrl = `${window.location.origin}/carer?tab=membership`;
      const session = await carerService.createPortalSession(returnUrl);
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Invalid portal response");
      }
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to open billing portal");
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      const res = await carerService.cancelSubscription();
      showSuccessToast("Subscription Cancelled", res.message || "Your subscription will not renew next month.");
      setShowCancelModal(false);
      await fetchBillingData();
    } catch (err: any) {
      showErrorToast("Cancellation Failed", err.message || "Failed to cancel subscription");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm text-gold-200/60">Loading billing dashboard...</p>
      </div>
    );
  }

  const currentTier = subscription?.tier || "FREE";
  const isGoldActive = currentTier === "GOLD_ELITE" || currentTier === "VERIFIED_PROFESSIONAL";
  const isVerifiedActive = currentTier === "VERIFIED_PROFESSIONAL";
  const renewDate = subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "N/A";

  const getTierBadge = () => {
    if (isVerifiedActive) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-DEFAULT/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-DEFAULT border border-gold-DEFAULT/25">
          <Award className="w-3.5 h-3.5" /> Verified Professional™
        </span>
      );
    }
    if (isGoldActive) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-yellow-500 border border-yellow-500/25">
          <Star className="w-3.5 h-3.5 fill-yellow-500/20" /> Gold Elite
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-100/60 border border-gold-100/10">
        <Shield className="w-3.5 h-3.5" /> Free Membership
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* radial glow overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-DEFAULT/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subscription Status Card */}
      <SectionCard className="p-6 md:p-8 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gold-300/10 pb-6">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold-200/50">My Membership Plan</p>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-serif text-gold-50 tracking-wide">
                {currentTier === "FREE" && "Free Membership"}
                {currentTier === "GOLD_ELITE" && "Gold Elite Membership"}
                {currentTier === "VERIFIED_PROFESSIONAL" && "Verified Professional™ Status"}
              </h3>
              {getTierBadge()}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {currentTier === "FREE" ? (
              <Button
                onClick={() => setShowGoldModal(true)}
                disabled={processing}
                variant="primary"
                size="md"
                text={processing ? "Upgrading..." : "Upgrade to Gold Elite"}
              />
            ) : (
              <>
                <Button
                  onClick={handleManageBilling}
                  disabled={processing}
                  variant="ghost-gold"
                  size="md"
                  text="Manage Billing on Stripe"
                />
                {!subscription?.cancelAtPeriodEnd && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={processing}
                    className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all focus:outline-none"
                  >
                    Cancel Subscription
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Subscription Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gold-DEFAULT shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">Billing Period</span>
              <span className="text-xs text-gold-100">
                {currentTier === "FREE" ? "Forever Free" : "Monthly Auto-renew"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gold-DEFAULT shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">
                {subscription?.cancelAtPeriodEnd ? "Expiration Date" : "Renewal Date"}
              </span>
              <span className="text-xs text-gold-100">
                {currentTier === "FREE" ? "No Renewal Required" : renewDate}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-gold-DEFAULT shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gold-100/40 uppercase tracking-wider block">Pricing Tier</span>
              <span className="text-xs text-gold-100">
                {currentTier === "FREE" && "£0"}
                {currentTier === "GOLD_ELITE" && "£29.99 / mo (VAT Inc.)"}
                {currentTier === "VERIFIED_PROFESSIONAL" && "£39.99 / mo (VAT Inc.)"}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation Active Warning Banner */}
        {subscription?.cancelAtPeriodEnd && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Cancellation Scheduled</h5>
              <p className="text-[11px] text-gold-100/70 leading-normal mt-0.5">
                Your subscription will cancel automatically at the end of the billing period on <strong>{renewDate}</strong>. 
                You will continue to receive all premium benefits until then, after which your account will revert to the <strong>Free Membership</strong> and no further charges will apply.
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Verified Professional Unlock Guideline Card */}
      <SectionCard className="p-6 md:p-8 border border-gold-300/10 bg-navy-900/30">
        <div className="flex items-center gap-3 border-b border-gold-300/10 pb-4 mb-5">
          <Award className="w-5 h-5 text-gold-300" />
          <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
            Verified Professional™ Add-On
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs text-gold-100/80 leading-relaxed font-light">
              The <strong>Grace & Goodwill Verified Professional™</strong> add-on status is our highest badge of trust. Carers with this badge are featured before all other profile searches, receive highest matching priority, and gain early access to high-rate placements.
            </p>
            <div className="p-4 bg-navy-950/40 border border-gold-300/5 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-200 block mb-1">Add-on Cost</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gold-50 font-serif">+£10.00</span>
                <span className="text-[11px] text-gold-100/50">/ month (combined: £39.99/mo)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-200 border-b border-gold-300/10 pb-1 block">
              How to Unlock (Eligibility Checklist)
            </span>
            <ul className="space-y-2.5 text-xs text-gold-100/80">
              <li className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                  isGoldActive ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-gold-DEFAULT/5 border border-gold-300/10"
                }`}>
                  <Check className={`h-3 w-3 ${isGoldActive ? "text-emerald-400" : "text-gold-200/20"}`} strokeWidth={3} />
                </div>
                <div>
                  <span className="font-semibold text-gold-200">Gold Elite Membership</span>
                  <p className="text-[11px] text-gold-100/50 mt-0.5">Maintain active Gold status for minimum 3 consecutive months.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/5 border border-gold-300/10">
                  <Check className="h-3 w-3 text-gold-200/20" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-semibold text-gold-200">Compliance & Docs Verification</span>
                  <p className="text-[11px] text-gold-100/50 mt-0.5">Ensure DBS, CV, references, Right to Work, and training are fully approved.</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/5 border border-gold-300/10">
                  <Check className="h-3 w-3 text-gold-200/20" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-semibold text-gold-200">Successful Placements</span>
                  <p className="text-[11px] text-gold-100/50 mt-0.5">Complete at least 3 placements successfully through Grace & Goodwill.</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gold-DEFAULT/5 border border-gold-300/10">
                  <Check className="h-3 w-3 text-gold-200/20" strokeWidth={3} />
                </div>
                <div>
                  <span className="font-semibold text-gold-200">Virtual Interview</span>
                  <p className="text-[11px] text-gold-100/50 mt-0.5">Pass a professional interview review with our care management team.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Invoice History Section */}
      <SectionCard className="p-6 md:p-8 border border-gold-300/10 bg-navy-900/30">
        <div className="flex items-center gap-3 border-b border-gold-300/10 pb-4 mb-6">
          <FileText className="w-5 h-5 text-gold-300" />
          <h4 className="text-md font-bold text-gold-100 uppercase tracking-wide">
            Membership Invoices & Receipt History
          </h4>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-10 bg-navy-950/20 border border-dashed border-gold-300/10 rounded-2xl">
            <span className="text-gold-200/30 text-xs block">No membership invoices recorded yet</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gold-300/5 bg-navy-950/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gold-300/10 bg-navy-950/50 text-[10px] uppercase font-bold tracking-widest text-gold-200">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Paid Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Receipts</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gold-300/5 hover:bg-navy-900/20 transition-colors">
                    <td className="p-4 font-mono font-medium text-gold-100">{inv.id.substring(0, 18)}...</td>
                    <td className="p-4 text-gold-100/70">
                      {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "Pending"}
                    </td>
                    <td className="p-4 text-gold-50 font-semibold">£{Number(inv.amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-4">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-gold-DEFAULT hover:text-gold-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </a>
                      )}
                      {inv.hostedUrl && (
                        <a
                          href={inv.hostedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-gold-200/60 hover:text-gold-DEFAULT transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Stripe
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Cancellation Modal Overlay */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-gradient-to-b from-navy-900 to-navy-950 p-6 text-gold-100 shadow-[0_15px_40px_rgba(239,68,68,0.15)]">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gold-200/60 hover:text-gold-200 transition-colors p-1 rounded-full hover:bg-gold-400/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-400 border-b border-gold-300/10 pb-3">
                <AlertCircle className="w-5 h-5" />
                <h4 className="text-md font-bold uppercase tracking-wide">
                  Cancel Subscription
                </h4>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gold-100/90 leading-relaxed font-light">
                  Are you sure you want to cancel your Gold Elite membership subscription?
                </p>
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] text-amber-300 leading-normal">
                    <strong>Notice:</strong> If you cancel, your premium benefits will remain active until the end of your billing cycle on <strong>{renewDate}</strong>. 
                    Your account will then automatically revert to the <strong>Free Membership</strong>. You will not be charged again.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gold-300/10">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={processing}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gold-200 border border-gold-300/10 hover:border-gold-300/30 transition-all focus:outline-none"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={processing}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all focus:outline-none shadow-md"
                >
                  {processing ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gold Elite Upgrade Modal */}
      {showGoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[75vh] flex flex-col rounded-2xl border border-gold-DEFAULT/30 bg-gradient-to-b from-navy-900 to-navy-950 text-gold-100 shadow-[0_15px_50px_rgba(212,175,55,0.15)] animate-scale-up overflow-hidden">
            <button
              onClick={() => setShowGoldModal(false)}
              className="absolute top-4 right-4 text-gold-200/60 hover:text-gold-200 transition-colors p-1.5 rounded-full hover:bg-gold-400/10 z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable content body */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 scrollbar-thin space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gold-300/10 pb-4">
                <div className="p-2 bg-gold-DEFAULT/10 rounded-lg border border-gold-DEFAULT/25">
                  <Star className="w-6 h-6 text-gold-DEFAULT fill-gold-DEFAULT/20" />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-gold-DEFAULT tracking-wide font-bold">
                    Gold Elite Membership
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-gold-200/50">Plan Upgrades & Benefits</p>
                </div>
              </div>

              {/* Package details */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline p-4 bg-gold-DEFAULT/5 rounded-xl border border-gold-DEFAULT/10">
                  <span className="text-sm font-semibold text-gold-100">Membership Fee</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif text-gold-50 tracking-wide font-bold">£29.99</span>
                    <span className="text-xs text-gold-200/60"> / month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-gold-100/90 leading-relaxed font-light">
                    Premium tier for active professionals seeking first access to placements.
                  </p>

                  {/* Benefits checklist */}
                  <div className="space-y-3 pt-2 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold-300">Premium Benefits Included:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Priority placement alerts",
                        "First access to premium placements",
                        "Emergency placement priority",
                        "Featured profile",
                        "Certificate storage",
                        "Compliance expiry reminders",
                        "Professional profile enhancement",
                        "Priority compliance review",
                        "Enhanced placement opportunities",
                        "Advanced training discounts",
                        "End of Life Care Pathway",
                        "DBS support and guidance"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-gold-DEFAULT mt-0.5 shrink-0" strokeWidth={2.5} />
                          <span className="text-xs text-gold-100/80 leading-relaxed font-light">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="flex justify-end gap-3 p-4 border-t border-gold-300/20 bg-navy-950/90 backdrop-blur-md rounded-b-2xl sticky bottom-0 z-20">
              <Button
                onClick={() => setShowGoldModal(false)}
                disabled={processing}
                variant="outline"
                size="sm"
                text="Go Back"
                fullWidth={false}
              />
              <Button
                onClick={async () => {
                  setShowGoldModal(false);
                  await handleUpgrade("GOLD_ELITE");
                }}
                disabled={processing}
                variant="primary"
                size="sm"
                fullWidth={false}
              >
                <span className="flex items-center gap-1.5 font-bold">
                  {processing ? "Processing..." : "Proceed to Payment"}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
