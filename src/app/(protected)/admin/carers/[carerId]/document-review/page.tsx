"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDocumentDetails, verifyDocument, rejectDocument } from "@/store/slices/adminSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Link from "next/link";
import { ArrowLeft, Check, X, FileText, Image as ImageIcon, Calendar, User, ExternalLink, Eye, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DocumentReviewPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold">Loading document review console...</p>
      </main>
    }>
      <DocumentReviewContent />
    </Suspense>
  );
}

function DocumentReviewContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const carerId = params.carerId as string;
  const documentId = searchParams.get("documentId");

  const { data: carer, loading, error } = useAppSelector((state) => state.admin.selectedCarer);
  const [activeDocId, setActiveDocId] = useState<string | null>(documentId);
  const [submittingAction, setSubmittingAction] = useState<"VERIFY" | "REJECT" | null>(null);

  useEffect(() => {
    if (carerId) {
      dispatch(fetchDocumentDetails(carerId));
    }
  }, [dispatch, carerId]);

  useEffect(() => {
    if (documentId) {
      setActiveDocId(documentId);
    }
  }, [documentId]);

  // If no documentId in query yet, default to first available document
  const rawDocs = carer?.carerProfile?.documents || [];
  const activeDoc = rawDocs.find((doc: any) => doc.id === activeDocId) || rawDocs[0];

  useEffect(() => {
    if (activeDoc && !activeDocId) {
      setActiveDocId(activeDoc.id);
    }
  }, [activeDoc, activeDocId]);

  const handleVerify = async () => {
    if (!activeDoc) return;
    setSubmittingAction("VERIFY");
    try {
      await dispatch(verifyDocument(activeDoc.id)).unwrap();
      showSuccessToast("Document Verified", "The document status has been updated to VERIFIED.");
      // Redirect back to main dashboard under Carers tab
      router.push("/admin?tab=carers");
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to verify document");
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleReject = async () => {
    if (!activeDoc) return;
    setSubmittingAction("REJECT");
    try {
      await dispatch(rejectDocument(activeDoc.id)).unwrap();
      showSuccessToast("Document Rejected", "The document status has been updated to REJECTED.");
      // Redirect back to main dashboard under Carers tab
      router.push("/admin?tab=carers");
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to reject document");
    } finally {
      setSubmittingAction(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const mapping: Record<string, string> = {
      CRIMINAL_RECORD_CHECK: "DBS Certificate",
      DRIVERS_LICENSE: "Driver's License",
      DEMENTIA_SUPPORT: "Dementia Certificate",
      NURSES_REGISTRY: "Nurses Registry",
      PASSPORT: "Passport",
      RIGHT_TO_WORK: "Right to Work",
      PROOF_OF_ADDRESS: "Proof of Address",
      NATIONAL_INSURANCE: "National Insurance Number",
      PUBLIC_LIABILITY_INSURANCE: "Public Liability Insurance",
      BUSINESS_INSURANCE: "Business Insurance",
      PROFESSIONAL_INDEMNITY: "Professional Indemnity Insurance",
      MANDATORY_TRAINING: "Mandatory Training Certificate",
      SPECIALIST_TRAINING: "Specialist Training Certificate",
    };
    return mapping[category] || category.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  };

  const getStatusBadgeStyles = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    switch (cleanStatus) {
      case "VERIFIED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "PENDING":
      case "UPLOADED":
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    if (cleanStatus === "UPLOADED" || cleanStatus === "PENDING") return "PENDING";
    return cleanStatus;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold animate-pulse">Fetching carer records...</p>
      </main>
    );
  }

  if (error || !carer) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold">Failed to Load Carer Profile</h2>
          <p className="text-xs text-red-500/80">{error || "The requested carer could not be found."}</p>
          <button
            onClick={() => router.push("/admin?tab=carers")}
            className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const isPDF = activeDoc?.fileType === "application/pdf" || activeDoc?.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8 max-w-7xl mx-auto px-4">
        
        {/* --- PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin?tab=carers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Carer Registry
            </Link>
            <h1 className="text-xl tracking-tight text-gold-200 sm:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold" /> Onboarding compliance Audit
            </h1>
            <p className="text-xs text-gold-100/50">
              Verify practitioner licenses, background clearance certificates, and training profiles
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-navy-900/40 px-4 py-3 rounded-xl border border-gold-300/5">
            <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gold-200">{carer.firstName} {carer.lastName}</p>
              <p className="text-[10px] text-gold-100/40 uppercase tracking-wider font-semibold">
                Status: <span className="text-gold font-bold">{carer.status}</span>
              </p>
            </div>
          </div>
        </header>

        {/* --- REVIEW WORKSPACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN: SIDEBAR PLAYLIST */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-4 shadow-soft backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 mb-3 border-b border-gold-300/5 pb-2">
                Document Vault ({rawDocs.length})
              </h3>
              
              {rawDocs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gold-100/40">
                  No documents uploaded.
                </div>
              ) : (
                <div className="space-y-2">
                  {rawDocs.map((doc: any) => {
                    const isActive = doc.id === activeDocId;
                    const cleanStatus = getStatusLabel(doc.status);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocId(doc.id);
                          router.push(`/admin/carers/${carerId}/document-review?documentId=${doc.id}`);
                        }}
                        className={`w-full text-left rounded-xl p-3 border transition-all duration-300 flex flex-col gap-1.5 ${
                          isActive
                            ? "bg-gold border-gold text-navy-950 shadow-elegant"
                            : "bg-navy-950/40 border-gold-300/5 text-gold-100 hover:border-gold-300/20"
                        }`}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <span className={`text-xs font-bold truncate ${isActive ? "text-navy-950" : "text-gold-200"}`}>
                            {getCategoryLabel(doc.fileCategory)}
                          </span>
                          {isActive ? (
                            <Eye className="h-3.5 w-3.5 flex-shrink-0 text-navy-950" />
                          ) : (
                            doc.fileType === "application/pdf" ? (
                              <FileText className="h-3.5 w-3.5 flex-shrink-0 text-gold/60" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5 flex-shrink-0 text-gold/60" />
                            )
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full gap-2 text-[10px]">
                          <span className={`truncate max-w-[120px] ${isActive ? "text-navy-950/70" : "text-gold-100/40"}`}>
                            {doc.fileName}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider ${
                            isActive
                              ? "bg-navy-950/20 text-navy-950 border border-navy-950/20"
                              : getStatusBadgeStyles(doc.status)
                          }`}>
                            {cleanStatus}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT COLUMNS: VIEW PORTAL & CONTROLS */}
          <section className="lg:col-span-3 space-y-6">
            {activeDoc ? (
              <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-6">
                
                {/* ACTIVE DOCUMENT METADATA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/5 pb-4">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block ${getStatusBadgeStyles(activeDoc.status)}`}>
                      {getStatusLabel(activeDoc.status)}
                    </span>
                    <h2 className="text-xl font-bold text-gold-200">
                      {getCategoryLabel(activeDoc.fileCategory)}
                    </h2>
                    <p className="text-xs text-gold-100/50 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-gold/60" /> {activeDoc.fileName} • {((activeDoc.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="text-left sm:text-right space-y-1 text-xs">
                    <p className="text-gold-100/40 font-semibold uppercase tracking-wider text-[10px]">Upload Date</p>
                    <p className="text-gold-100/80 font-bold flex items-center gap-1 sm:justify-end">
                      <Calendar className="h-3.5 w-3.5 text-gold/60" /> 
                      {activeDoc.createdAt ? new Date(activeDoc.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      }) : "Not Recorded"}
                    </p>
                  </div>
                </div>

                {/* PREVIEW FRAME */}
                <div className="relative rounded-xl border border-gold-300/5 bg-navy-950/60 p-2 flex items-center justify-center overflow-hidden min-h-[400px]">
                  {isPDF ? (
                    <div className="w-full h-[600px] relative">
                      <iframe
                        src={`${activeDoc.fileUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full rounded-lg bg-navy-900"
                        title={getCategoryLabel(activeDoc.fileCategory)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeDoc.fileUrl}
                        alt={getCategoryLabel(activeDoc.fileCategory)}
                        className="max-w-full max-h-[550px] object-contain rounded-lg shadow-elegant"
                      />
                    </div>
                  )}
                </div>

                {/* ACTION PORTAL */}
                <div className="bg-navy-950/40 rounded-xl border border-gold-300/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gold-100/50">
                    <span className="font-bold text-gold-200 block mb-0.5">Verification Guidelines</span>
                    Ensure signatures, credentials and dates align properly with client care requests profile.
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {activeDoc.status?.toUpperCase() === "VERIFIED" ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 text-emerald-400 font-bold text-xs flex items-center gap-2 w-full justify-center">
                        <CheckCircle2 className="h-4 w-4" /> Already Verified
                      </div>
                    ) : activeDoc.status?.toUpperCase() === "REJECTED" ? (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 text-rose-400 font-bold text-xs flex items-center gap-2 w-full justify-center">
                        <AlertTriangle className="h-4 w-4" /> Rejected
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={handleReject}
                          disabled={submittingAction !== null}
                          className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5"
                        >
                          {submittingAction === "REJECT" ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject Document
                        </button>
                        <button
                          onClick={handleVerify}
                          disabled={submittingAction !== null}
                          className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5"
                        >
                          {submittingAction === "VERIFY" ? (
                            <div className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Verify Document
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* EXTERNAL VIEW BUTTON FOR ACCESSIBILITY */}
                <div className="text-center pt-2">
                  <a
                    href={activeDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-gold-100/40 hover:text-gold transition duration-200"
                  >
                    Open raw file in a new tab <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-12 text-center text-gold-100/40 backdrop-blur-md">
                <FileText className="h-12 w-12 mx-auto text-gold-100/20 mb-4" />
                <h3 className="text-lg font-bold text-gold-200">No Document Selected</h3>
                <p className="text-xs max-w-sm mx-auto mt-2">
                  Select an uploaded compliance document from the vault to verify or review its qualifications checklist.
                </p>
              </div>
            )}
          </section>

        </div>

      </div>
    </main>
  );
}
