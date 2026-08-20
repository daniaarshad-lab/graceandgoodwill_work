"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  agreementsService,
  LegalAgreement,
  SignedAgreement,
} from "@/services/agreements/agreements.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientProfile } from "@/store/slices/clientSlice";
import { clientService } from "@/services/client/client.service";

export default function AgreementsPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.client);
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (paymentStatus === "success" && profile && !profile.isLifetimeFeePaid) {
      let pollCount = 0;
      const interval = setInterval(async () => {
        pollCount++;
        await refreshUser();
        dispatch(fetchClientProfile());

        if (pollCount >= 12) {
          clearInterval(interval);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, profile, refreshUser, dispatch]);
  const [pending, setPending] = useState<LegalAgreement[]>([]);
  const [history, setHistory] = useState<SignedAgreement[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [selectedAgreement, setSelectedAgreement] =
    useState<LegalAgreement | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingFee, setPayingFee] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.role?.toUpperCase() === "CLIENT") {
        dispatch(fetchClientProfile());
      }
      const pendingData = await agreementsService.getPendingAgreements();
      const historyData = await agreementsService.getSignedHistory();
      setPending(pendingData);
      setHistory(historyData);

      if (pendingData.length > 0) {
        setSelectedAgreement(pendingData[0]);
      } else {
        setSelectedAgreement(null);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch agreements. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handlePrintAgreement = (
    agreement: LegalAgreement | null,
    signedRecord?: SignedAgreement,
  ) => {
    if (!agreement) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const signatureBlock = signedRecord
        ? `<div class="signature-section">
             <h3>Electronic Signature Audit Trail</h3>
             <p><strong>Signed Electronically By:</strong> "${signedRecord.signatureName}"</p>
             <p><strong>Accepted Timestamp:</strong> ${new Date(signedRecord.acceptedAt).toLocaleString()}</p>
             <p><strong>Agreement Version:</strong> v${signedRecord.versionAccepted}</p>
             <p><strong>Audit IP Address:</strong> ${signedRecord.ipAddress}</p>
             <p><strong>Client Device Details:</strong> ${signedRecord.userAgent}</p>
             <div class="stamp">Grace & Goodwill Digital Agreement Certified Seal</div>
           </div>`
        : "";

      printWindow.document.write(`
        <html>
          <head>
            <title>${agreement.title} - Grace & Goodwill</title>
            <style>
              body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; padding: 50px; color: #111; max-width: 800px; margin: auto; }
              h1 { font-size: 26px; border-bottom: 2px solid #222; padding-bottom: 12px; font-weight: bold; text-align: center; }
              .meta { font-size: 13px; color: #444; margin-bottom: 40px; text-align: center; font-style: italic; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              p { margin-bottom: 18px; text-align: justify; font-size: 15px; }
              .signature-section { margin-top: 50px; border-top: 3px double #333; padding-top: 20px; font-family: sans-serif; font-size: 13px; }
              .signature-section h3 { font-size: 15px; margin-bottom: 15px; color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
              .signature-section p { margin-bottom: 6px; font-size: 13px; }
              .stamp { margin-top: 25px; border: 2px solid #c99232; color: #c99232; display: inline-block; padding: 6px 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; font-size: 11px; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${agreement.title}</h1>
            <div class="meta">Document Version: ${agreement.version} | Target Role: ${agreement.targetRole} | Grace & Goodwill Care Management</div>
            <div>${agreement.content
              .split("\n\n")
              .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
              .join("")}</div>
            ${signatureBlock}
            <script>
              setTimeout(function() {
                window.print();
              }, 250);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePayLifetimeFee = async () => {
    try {
      setPayingFee(true);
      const successUrl = `${window.location.origin}/client?payment=success`;
      const cancelUrl = `${window.location.origin}/client?payment=failed`;

      const { url } = await clientService.createLifetimeFeeCheckout(
        successUrl,
        cancelUrl,
      );
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to generate checkout URL");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate checkout.");
    } finally {
      setPayingFee(false);
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreement) return;
    if (!agreedToTerms) {
      setError("You must accept the terms before proceeding.");
      return;
    }

    const autoName =
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      user?.email ||
      "Accepted";

    try {
      setIsSubmitting(true);
      setError(null);
      await agreementsService.signAgreement(
        selectedAgreement.id,
        autoName,
      );

      // Reset acceptance state
      setAgreedToTerms(false);

      // Refresh context profile
      await refreshUser();

      // Reload lists manually to verify count before redirect
      const rawPendingData = await agreementsService.getPendingAgreements();
      const historyData = await agreementsService.getSignedHistory();

      // Optimistically filter out the signed agreement in case of backend delay
      const pendingData = rawPendingData.filter(
        (doc) => doc.id !== selectedAgreement.id,
      );

      setPending(pendingData);
      setHistory(historyData);

      if (pendingData.length === 0) {
        const role = user?.role?.toUpperCase();
        if (role === "CLIENT") {
          dispatch(fetchClientProfile());
          if (profile?.isLifetimeFeePaid) {
            router.replace("/client");
          }
        } else if (role === "CARER") {
          router.replace("/carer");
        } else if (role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      } else {
        setSelectedAgreement(pendingData[0]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign agreement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">
            Loading agreements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-100">
      <div className="w-full border border-white/10 rounded-2xl p-6 sm:p-8">
        {/* Header & Tab Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gold-100">
              Terms & Policies
            </h2>
            <p className="mt-1 text-sm text-gold-200/60">
              Please review and accept our platform terms and policies to continue.
            </p>
          </div>

          <div className="mt-4 md:mt-0 inline-flex rounded-md shadow-sm bg-navy-900/50 p-1 border border-navy-800">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "pending"
                  ? "bg-[#b59469] text-navy-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              To Accept ({pending.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-[#b59469] text-navy-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Accepted Policies ({history.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Pending Agreements Tab */}
        {activeTab === "pending" && (
          <div>
            {pending.length === 0 ? (
              user?.role?.toUpperCase() === "CLIENT" &&
              !profile?.isLifetimeFeePaid ? (
                paymentStatus === "success" ? (
                  <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-soft space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-[#d4af37] animate-pulse">
                      <svg
                        className="animate-spin h-8 w-8 text-gold-DEFAULT"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Direct Debit Payment Authorizing...
                    </h3>
                    <p className="text-slate-350 text-sm max-w-md mx-auto">
                      We are setting up your GoCardless mandate. This may take a
                      few moments as we verify details with Bacs. Please do not
                      refresh or close this window.
                    </p>
                  </div>
                ) : (
                  <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-soft space-y-6">
                    {paymentStatus === "failed" && (
                      <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200 text-sm font-semibold flex items-center justify-center gap-2">
                        <span>⚠️</span>
                        <span>
                          Direct Debit mandate setup failed or was cancelled.
                          Please try again.
                        </span>
                      </div>
                    )}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-[#d4af37] mb-6">
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      Activate Your Client Account
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
                      Agreements signed successfully! To unlock carer matching,
                      search profiles, and submit introduction requests, please
                      pay the one-off Lifetime Platform Fee.
                    </p>

                    <div className="p-4 rounded-xl bg-navy-950 border border-navy-850 max-w-md mx-auto text-left space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase">
                        <span>Item</span>
                        <span>Price</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-white">
                        <span>Lifetime Registration Fee</span>
                        <span>£299.00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-350">
                        <span>VAT (20%)</span>
                        <span>£59.80</span>
                      </div>
                      <div className="border-t border-navy-800 pt-2 flex justify-between items-center text-base font-bold text-gold">
                        <span>Total Due</span>
                        <span>£358.80</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayLifetimeFee}
                      disabled={payingFee}
                      className="px-8 py-3.5 bg-[#b59469] hover:bg-[#a08054] text-navy-950 rounded-xl font-bold transition-all shadow-[0_8px_30px_rgba(160,128,84,0.24)] flex items-center justify-center mx-auto min-w-[240px] disabled:opacity-50"
                    >
                      {payingFee ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-950"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Redirecting to Checkout...
                        </>
                      ) : (
                        "Pay Fee & Activate Matching"
                      )}
                    </button>
                  </div>
                )
              ) : (
                <div className="relative w-full py-8 sm:py-12 flex flex-col items-center justify-center group">
                  {/* Subtle ambient glow behind the content */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-40 w-40 rounded-full bg-gold-DEFAULT/5 blur-[80px] group-hover:bg-gold-DEFAULT/10 transition-all duration-1000"></div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-gold-400/20 bg-gradient-to-b from-gold-400/10 to-transparent mb-5 shadow-[0_0_30px_rgba(181,148,105,0.15)]">
                      <div className="absolute inset-0 rounded-full border border-gold-400/30 animate-[spin_6s_linear_infinite] border-t-transparent border-l-transparent"></div>
                      <div className="absolute inset-2 rounded-full border border-gold-400/20 animate-[spin_4s_linear_infinite_reverse] border-b-transparent border-r-transparent"></div>
                      <svg
                        className="h-6 w-6 sm:h-8 sm:w-8 text-gold-400 drop-shadow-[0_0_10px_rgba(181,148,105,0.6)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gold-200">
                      All Caught Up!
                    </h3>

                    <p className="text-gold-100/60 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium text-center">
                      You have successfully signed all your required agreements!
                      Sit back, relax, and enjoy exploring all the features the
                      Grace & Goodwill care platform has to offer.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of pending docs */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-2">
                    Required Documents
                  </h3>
                  {pending.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedAgreement(doc);
                        setError(null);
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedAgreement?.id === doc.id
                          ? "bg-navy-900 border-gold-DEFAULT text-white shadow-elegant"
                          : "bg-navy-900/40 border-navy-800 text-slate-300 hover:bg-navy-900/60"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{doc.title}</span>
                        <span className="text-xs bg-navy-800 text-gold-DEFAULT px-2 py-1 rounded">
                          v{doc.version}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Doc Reader and Sign panel */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedAgreement && (
                    <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft">
                      <div className="border-b border-navy-800 pb-4 mb-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          {selectedAgreement.title}
                        </h2>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() =>
                              handlePrintAgreement(selectedAgreement)
                            }
                            className="text-xs bg-navy-850 hover:bg-navy-800 text-gold-DEFAULT border border-gold-DEFAULT/20 px-3 py-1.5 rounded-lg transition font-semibold"
                          >
                            Print / Save PDF
                          </button>
                          <span className="text-xs bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20 px-3 py-1.5 rounded-full font-semibold">
                            Version {selectedAgreement.version}
                          </span>
                        </div>
                      </div>

                      {/* Content Reader */}
                      <div className="bg-navy-950 border border-navy-850 rounded-xl p-5 h-96 overflow-y-auto mb-6 text-sm text-slate-300 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-navy-800">
                        {selectedAgreement.content
                          .split("\n\n")
                          .map((para, idx) => (
                            <p key={idx} className="mb-4 whitespace-pre-line">
                              {para}
                            </p>
                          ))}
                      </div>

                      {/* Acceptance Form */}
                      <form
                        onSubmit={handleSign}
                        className="border-t border-navy-800 pt-6 space-y-4"
                      >
                        <div className={`flex items-start bg-navy-900/30 p-4 rounded-xl border transition-colors ${error && !agreedToTerms ? "border-red-500/50" : "border-navy-800/60"}`}>
                          <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                            <input id="accept-terms" type="checkbox" checked={agreedToTerms}
                              onChange={(e) => { setAgreedToTerms(e.target.checked); setError(null); }}
                              className="peer appearance-none w-5 h-5 border-2 border-navy-700 rounded bg-navy-900/50 checked:bg-[#b59469] checked:border-[#b59469] focus:outline-none focus:ring-2 focus:ring-[#b59469]/30 transition-all cursor-pointer shadow-inner" />
                            <svg className="absolute w-3.5 h-3.5 text-navy-950 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <label htmlFor="accept-terms" className="ml-3.5 text-sm text-slate-300 select-none cursor-pointer leading-tight">
                            I have read and accept the{" "}
                            <span className="text-white font-bold">{selectedAgreement.title}</span>.
                          </label>
                        </div>

                        <button type="submit" disabled={isSubmitting || !agreedToTerms}
                          className="w-full bg-[#b59469] hover:bg-[#a08054] text-navy-950 font-bold py-3 px-6 rounded-lg transition-all shadow-[0_8px_30px_rgba(160,128,84,0.24)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-950" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </>
                          ) : ("Accept & Continue")}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-xl font-bold text-white mb-6">
              Accepted Policies &amp; Terms
            </h2>
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No accepted policies found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4">Policy Title</th>
                      <th className="py-3.5 px-4 text-center">Version</th>
                      <th className="py-3.5 px-4">Accepted By</th>
                      <th className="py-3.5 px-4">Accepted Date</th>
                      <th className="py-3.5 px-4">IP Address</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-navy-800/40 hover:bg-navy-850/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-semibold text-white">
                          {record.agreement?.title || "Platform Policy"}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-navy-800 text-gold-DEFAULT px-2.5 py-1 rounded text-xs font-semibold">
                            v{record.versionAccepted}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-200 whitespace-nowrap">
                          {record.signatureName}
                        </td>
                        <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                          {new Date(record.acceptedAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                          {record.ipAddress}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Accepted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
