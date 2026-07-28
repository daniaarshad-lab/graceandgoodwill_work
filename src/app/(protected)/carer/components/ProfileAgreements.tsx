"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { agreementsService, LegalAgreement, SignedAgreement } from "@/services/agreements/agreements.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientProfile } from "@/store/slices/clientSlice";
import { clientService } from "@/services/client/client.service";
import SectionCard from "./shared/SectionCard";

export default function ProfileAgreements() {
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
      const successUrl = `${window.location.origin}/client?payment=success`;
      const cancelUrl = `${window.location.origin}/client?payment=failed`;
      
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

      if (pendingData.length > 0) {
        setSelectedAgreement(pendingData[0]);
      } else {
        setSelectedAgreement(null);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign agreement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SectionCard className="w-full space-y-6 mt-6 flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">Loading agreements...</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="w-full space-y-6 mt-6">
      <div className="border-b border-gold-300/10 pb-6 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-gold-200">Legal Agreements</h3>
          <p className="text-sm text-gold-100/60 mt-1">
            Review and electronically sign your terms and policies.
          </p>
        </div>
        
        {/* Tab Controls */}
        <div className="inline-flex rounded-lg shadow-sm bg-navy-950/80 p-1.5 border border-gold-300/10 self-center md:self-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all border ${
              activeTab === "pending"
                ? "bg-[#b59469] border-[#b59469] text-navy-950 shadow-sm"
                : "border-transparent text-gold-200/60 hover:text-gold-50 hover:bg-navy-900/50"
            }`}
          >
            Pending Signature ({pending.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all border ${
              activeTab === "history"
                ? "bg-[#b59469] border-[#b59469] text-navy-950 shadow-sm"
                : "border-transparent text-gold-200/60 hover:text-gold-50 hover:bg-navy-900/50"
            }`}
          >
            Signing History ({history.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm text-center">
          {error}
        </div>
      )}

      {/* Pending Agreements Tab */}
      {activeTab === "pending" && (
        <div>
          {pending.length === 0 ? (
            user?.role?.toUpperCase() === "CLIENT" && !profile?.isLifetimeFeePaid ? (
              <div className="bg-navy-900/40 border border-gold-300/10 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-soft space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-gold-DEFAULT mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gold-50">Activate Your Account</h3>
                <p className="text-gold-100/70 text-sm leading-relaxed max-w-lg mx-auto">
                  Agreements signed successfully! To unlock matching, please pay the Lifetime Platform Fee.
                </p>
                
                <div className="p-4 rounded-xl bg-navy-950 border border-gold-300/10 max-w-md mx-auto text-left space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-gold-200/60 uppercase">
                    <span>Item</span>
                    <span>Price</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gold-50">
                    <span>Lifetime Registration Fee</span>
                    <span>£299.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gold-100/80">
                    <span>VAT (20%)</span>
                    <span>£59.80</span>
                  </div>
                  <div className="border-t border-gold-300/10 pt-3 flex justify-between items-center text-base font-bold text-gold-DEFAULT">
                    <span>Total Due</span>
                    <span>£358.80</span>
                  </div>
                </div>

                <button
                  onClick={handlePayLifetimeFee}
                  disabled={payingFee}
                  className="px-6 py-3 bg-gold-DEFAULT text-navy-950 rounded-xl font-bold hover:bg-gold-400 transition-all shadow-sm flex items-center justify-center mx-auto min-w-[240px] disabled:opacity-50 text-sm"
                >
                  {payingFee ? "Redirecting to Checkout..." : "Pay Fee & Activate Matching"}
                </button>
              </div>
            ) : (
              <div className="bg-navy-900/40 border border-gold-300/10 rounded-2xl p-10 text-center max-w-xl mx-auto shadow-soft">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gold-50 mb-2">All Caught Up!</h3>
                <p className="text-sm text-gold-100/70 mb-6">
                  You have signed all required agreements. You can now access full features of the Grace & Goodwill care platform.
                </p>
                <button
                  onClick={handleDashboardRedirect}
                  className="px-6 py-3 bg-[#b59469] text-navy-950 rounded-lg font-semibold hover:bg-[#9c7d55] transition shadow-sm"
                >
                  Go to Dashboard
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* List of pending docs */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-200/80 mb-2">Required Signatures</h4>
                {pending.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedAgreement(doc);
                      setError(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedAgreement?.id === doc.id
                        ? "bg-navy-950 border-gold-DEFAULT shadow-sm"
                        : "bg-navy-900/40 border-gold-300/10 hover:bg-navy-950/60 hover:border-gold-300/30"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold text-sm ${selectedAgreement?.id === doc.id ? "text-gold-50" : "text-gold-100/80"}`}>
                        {doc.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${selectedAgreement?.id === doc.id ? "bg-gold-DEFAULT/20 text-gold-DEFAULT" : "bg-navy-800 text-gold-200/60"}`}>
                        v{doc.version}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Doc Reader and Sign panel */}
              <div className="lg:col-span-2 space-y-6">
                {selectedAgreement && (
                  <div className="bg-navy-900/40 border border-gold-300/10 rounded-2xl p-5 shadow-soft">
                    <div className="border-b border-gold-300/10 pb-4 mb-4 flex justify-between items-center flex-wrap gap-3">
                      <h2 className="text-lg font-bold text-gold-50">{selectedAgreement.title}</h2>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handlePrintAgreement(selectedAgreement)}
                          className="text-[11px] bg-navy-950 hover:bg-navy-800 text-gold-200 border border-gold-300/20 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          Print / Save PDF
                        </button>
                        <span className="text-[11px] bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20 px-3 py-1.5 rounded-lg font-medium">
                          Version {selectedAgreement.version}
                        </span>
                      </div>
                    </div>

                    {/* Content Reader */}
                    <div className="bg-navy-950 border border-gold-300/10 rounded-xl p-5 h-[350px] overflow-y-auto mb-6 text-sm text-gold-100/80 leading-relaxed font-sans custom-scrollbar">
                      {selectedAgreement.content.split("\n\n").map((para, idx) => (
                        <p key={idx} className="mb-4">{para}</p>
                      ))}
                    </div>

                    {/* Signature Form */}
                    <form onSubmit={handleSign} className="border-t border-gold-300/10 pt-5">
                      <div className="mb-5 flex items-start group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            id="accept-terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="peer appearance-none h-4 w-4 rounded-sm border border-gold-300/30 bg-navy-950 checked:bg-gold-DEFAULT checked:border-gold-DEFAULT cursor-pointer transition-all"
                          />
                          <svg className="absolute w-3 h-3 text-navy-950 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <label htmlFor="accept-terms" className="ml-3 text-xs text-gold-100/70 group-hover:text-gold-100 transition-colors select-none cursor-pointer">
                          I confirm that I have read, understood, and accept the terms of the{" "}
                          <span className="text-gold-50 font-semibold">{selectedAgreement.title}</span>.
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div>
                          <label htmlFor="sig-name" className="block text-[11px] font-semibold text-gold-200/80 uppercase mb-2">
                            Full Name (Typed Signature)
                          </label>
                          <input
                            id="sig-name"
                            type="text"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            placeholder="Type your official name"
                            className="w-full bg-navy-950 border border-gold-300/20 rounded-xl px-4 py-2.5 text-sm text-gold-50 placeholder-gold-100/30 focus:outline-none focus:border-gold-DEFAULT focus:ring-1 focus:ring-gold-DEFAULT transition"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gold-DEFAULT hover:bg-gold-400 text-navy-950 text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSubmitting ? "Sealing Agreement..." : "Electronically Sign"}
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
        <div className="bg-navy-900/40 border border-gold-300/10 rounded-2xl p-5 shadow-soft">
          <h3 className="text-sm font-bold text-gold-50 mb-4">Signature Audit Trail</h3>
          {history.length === 0 ? (
            <p className="text-gold-100/50 text-sm text-center py-8">No signed agreements found.</p>
          ) : (
            <div className="overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gold-300/10 text-gold-200/70 font-semibold text-xs">
                    <th className="py-3 px-3">Document Title</th>
                    <th className="py-3 px-3 text-center">Version</th>
                    <th className="py-3 px-3">Signatory Name</th>
                    <th className="py-3 px-3">Signed Date</th>
                    <th className="py-3 px-3 hidden md:table-cell">IP Address</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gold-100/90 text-[13px]">
                  {history.map((record) => (
                    <tr key={record.id} className="border-b border-gold-300/5 hover:bg-navy-950/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-gold-50">{record.agreement?.title || "Legal Agreement"}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-navy-950 text-gold-200/80 px-2 py-0.5 rounded text-[10px] border border-gold-300/10">v{record.versionAccepted}</span>
                      </td>
                      <td className="py-3 px-3 italic">"{record.signatureName}"</td>
                      <td className="py-3 px-3 text-gold-100/60">{new Date(record.acceptedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-gold-100/40 hidden md:table-cell">{record.ipAddress}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handlePrintAgreement(record.agreement, record)}
                          className="text-[11px] text-gold-DEFAULT hover:text-gold-300 font-semibold transition-colors"
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
    </SectionCard>
  );
}
