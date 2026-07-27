"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { agreementsService, LegalAgreement, SignedAgreement } from "@/services/agreements/agreements.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientProfile } from "@/store/slices/clientSlice";
import { clientService } from "@/services/client/client.service";

export default function AgreementsPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.client);
  const [pending, setPending] = useState<LegalAgreement[]>([]);
  const [history, setHistory] = useState<SignedAgreement[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  
  const [selectedAgreement, setSelectedAgreement] = useState<LegalAgreement | null>(null);
  const [signatureName, setSignatureName] = useState("");
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

  const handlePrintAgreement = (agreement: LegalAgreement | null, signedRecord?: SignedAgreement) => {
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
            <div>${agreement.content.split("\n\n").map(para => `<p>${para.replace(/\n/g, "<br/>")}</p>`).join("")}</div>
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

  const handleDashboardRedirect = () => {
    const role = user?.role?.toUpperCase();
    if (role === "CLIENT") {
      router.push("/client");
    } else if (role === "CARER") {
      router.push("/carer");
    } else if (role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handlePayLifetimeFee = async () => {
    try {
      setPayingFee(true);
      const successUrl = `${window.location.origin}/client`;
      const cancelUrl = `${window.location.origin}/agreements?session=cancelled`;
      
      const { url } = await clientService.createLifetimeFeeCheckout(successUrl, cancelUrl);
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
      setError("You must check the agreement box before signing.");
      return;
    }
    if (!signatureName.trim()) {
      setError("Please type your name as your electronic signature.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await agreementsService.signAgreement(selectedAgreement.id, signatureName);
      
      // Reset signing state
      setSignatureName("");
      setAgreedToTerms(false);
      
      // Refresh context profile
      await refreshUser();
      
      // Reload lists manually to verify count before redirect
      const pendingData = await agreementsService.getPendingAgreements();
      const historyData = await agreementsService.getSignedHistory();
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
          <p className="text-sm tracking-wider text-gold-200">Loading agreements...</p>
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
              Legal Agreements
            </h2>
            <p className="mt-1 text-sm text-gold-200/60">
              Review and electronically sign your terms and policies.
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
              Pending Signature ({pending.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-[#b59469] text-navy-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Signing History ({history.length})
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
              user?.role?.toUpperCase() === "CLIENT" && !profile?.isLifetimeFeePaid ? (
                <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-soft space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-[#d4af37] mb-6">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Activate Your Client Account</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto">
                    Agreements signed successfully! To unlock carer matching, search profiles, and submit introduction requests, please pay the one-off Lifetime Platform Fee.
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
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Redirecting to Checkout...
                      </>
                    ) : (
                      "Pay Fee & Activate Matching"
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-soft">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 mb-6">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                  <p className="text-slate-400 mb-6">
                    You have signed all required agreements. You can now access full features of the Grace & Goodwill care platform.
                  </p>
                  <button
                    onClick={handleDashboardRedirect}
                    className="px-6 py-3 bg-[#b59469] hover:bg-[#a08054] text-navy-950 rounded-lg font-semibold transition shadow-[0_8px_30px_rgba(160,128,84,0.24)]"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of pending docs */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-2">Required Documents</h3>
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
                        <span className="text-xs bg-navy-800 text-gold-DEFAULT px-2 py-1 rounded">v{doc.version}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Doc Reader and Sign panel */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedAgreement && (
                    <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 shadow-soft">
                      <div className="border-b border-navy-800 pb-4 mb-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">{selectedAgreement.title}</h2>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => handlePrintAgreement(selectedAgreement)}
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
                        {selectedAgreement.content.split("\n\n").map((para, idx) => (
                          <p key={idx} className="mb-4">{para}</p>
                        ))}
                      </div>

                      {/* Signature Form */}
                      <form onSubmit={handleSign} className="border-t border-navy-800 pt-6">
                        <div className="mb-5 flex items-start">
                          <input
                            id="accept-terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="h-5 w-5 rounded bg-navy-950 border-navy-800 text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-offset-navy-900 mt-0.5"
                          />
                          <label htmlFor="accept-terms" className="ml-3 text-sm text-slate-300 select-none">
                            I confirm that I have read, understood, and accept the terms of the{" "}
                            <span className="text-white font-medium">{selectedAgreement.title}</span>.
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                          <div>
                            <label htmlFor="sig-name" className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                              Full Name (Typed Signature)
                            </label>
                            <input
                              id="sig-name"
                              type="text"
                              value={signatureName}
                              onChange={(e) => setSignatureName(e.target.value)}
                              placeholder="Type your official name to sign"
                              className="w-full bg-navy-950 border border-navy-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-DEFAULT focus:ring-1 focus:ring-gold-DEFAULT transition"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#b59469] hover:bg-[#a08054] text-navy-950 font-bold py-3 px-6 rounded-lg transition-all shadow-[0_8px_30px_rgba(160,128,84,0.24)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-950" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sealing Agreement...
                              </>
                            ) : (
                              "Electronically Sign"
                            )}
                          </button>
                        </div>
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
            <h2 className="text-xl font-bold text-white mb-6">Signature Audit Trail</h2>
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No signed agreements found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 font-semibold">
                      <th className="py-3.5 px-4">Document Title</th>
                      <th className="py-3.5 px-4 text-center">Version</th>
                      <th className="py-3.5 px-4">Signatory Name</th>
                      <th className="py-3.5 px-4">Signed Date</th>
                      <th className="py-3.5 px-4">IP Address</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">User Agent</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="border-b border-navy-800/40 hover:bg-navy-850/30 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">{record.agreement?.title || "Legal Agreement"}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-navy-800 text-gold-DEFAULT px-2 py-0.5 rounded text-xs">v{record.versionAccepted}</span>
                        </td>
                        <td className="py-4 px-4 font-medium italic text-gold-100">"{record.signatureName}"</td>
                        <td className="py-4 px-4 text-slate-450">
                          {new Date(record.acceptedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">{record.ipAddress}</td>
                        <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate hidden md:table-cell" title={record.userAgent}>
                          {record.userAgent}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handlePrintAgreement(record.agreement, record)}
                            className="text-xs text-gold-DEFAULT hover:underline font-semibold"
                          >
                            Print / Save PDF
                          </button>
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
