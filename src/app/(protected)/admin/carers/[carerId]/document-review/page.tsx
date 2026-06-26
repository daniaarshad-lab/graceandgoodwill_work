"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarerDetails, verifyDocument, rejectDocument } from "@/store/slices/adminSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Link from "next/link";
import { ArrowLeft, Check, X, FileText, Image as ImageIcon, Calendar, User, ExternalLink, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Download } from "lucide-react";

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

const getFullFileUrl = (url: string | undefined | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${normalizedBase}${normalizedPath}`;
};

const getMockDocDetails = (category: string) => {
  const types: Record<string, { type: string; uploadDate: string; expiryDate: string }> = {
    "CRIMINAL_RECORD_CHECK": {
      type: "Criminal Record Check",
      uploadDate: "2026-05-10",
      expiryDate: "2029-05-10",
    },
    "DRIVERS_LICENSE": {
      type: "Identification",
      uploadDate: "2026-05-12",
      expiryDate: "2031-11-20",
    },
    "DEMENTIA_SUPPORT": {
      type: "Certification",
      uploadDate: "2026-05-14",
      expiryDate: "Lifetime",
    },
    "NURSES_REGISTRY": {
      type: "Professional License",
      uploadDate: "2026-05-15",
      expiryDate: "2027-03-31",
    },
  };
  return types[category] || {
    type: "Verification Document",
    uploadDate: "2026-05-16",
    expiryDate: "N/A",
  };
};

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
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (carerId) {
      dispatch(fetchCarerDetails(carerId));
    }
  }, [dispatch, carerId]);

  useEffect(() => {
    if (documentId) {
      setActiveDocId(documentId);
    }
  }, [documentId]);

  // Robustly extract documents from various possible backend paths
  const extractDocuments = () => {
    if (!carer) return [];
    const profile = carer.carerProfile || {};
    if (Array.isArray(profile.documents) && profile.documents.length > 0) return profile.documents;
    if (Array.isArray(carer.documents) && carer.documents.length > 0) return carer.documents;
    if (Array.isArray(carer.complianceDocuments) && carer.complianceDocuments.length > 0) return carer.complianceDocuments;
    if (Array.isArray(profile.complianceDocuments) && profile.complianceDocuments.length > 0) return profile.complianceDocuments;
    if (Array.isArray(carer.complianceDocs) && carer.complianceDocs.length > 0) return carer.complianceDocs;
    if (Array.isArray(profile.complianceDocs) && profile.complianceDocs.length > 0) return profile.complianceDocs;
    return profile.documents || carer.documents || [];
  };

  const rawDocs = extractDocuments();
  const activeDoc = rawDocs.find((doc: any) => doc.id === activeDocId) || rawDocs[0];

  useEffect(() => {
    if (activeDoc && !activeDocId) {
      setActiveDocId(activeDoc.id);
    }
  }, [activeDoc, activeDocId]);

  useEffect(() => {
    setValidationError(null);
  }, [activeDocId]);

  const handleVerify = async () => {
    if (!activeDoc) return;
    setValidationError(null);
    setSubmittingAction("VERIFY");
    try {
      const docNotes = notes[activeDoc.id] || "";
      await dispatch(verifyDocument({ docId: activeDoc.id, notes: docNotes })).unwrap();
      showSuccessToast("Document Approved", "The document has been approved successfully.");
      // Re-fetch to ensure local state is fully in sync with server
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to verify document");
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleReject = async () => {
    if (!activeDoc) return;
    const docNotes = (notes[activeDoc.id] || "").trim();
    if (!docNotes) {
      setValidationError("Please provide a rejection reason before rejecting this document.");
      return;
    }
    setValidationError(null);
    setSubmittingAction("REJECT");
    try {
      await dispatch(rejectDocument({ docId: activeDoc.id, rejectionReason: docNotes })).unwrap();
      showSuccessToast("Document Rejected", "The document has been rejected.");
      // Re-fetch to ensure local state is fully in sync with server
      dispatch(fetchCarerDetails(carerId));
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
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "PENDING":
      case "UPLOADED":
      default:
        return "bg-gold/10 text-gold border border-gold/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    if (cleanStatus === "UPLOADED" || cleanStatus === "PENDING") return "PENDING";
    if (cleanStatus === "VERIFIED") return "APPROVED";
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

  const isPDF = activeDoc?.fileType === "application/pdf" || activeDoc?.fileName?.toLowerCase().endsWith(".pdf") || activeDoc?.fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = activeDoc?.fileType?.startsWith("image/") || 
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeDoc?.fileName || "") || 
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeDoc?.fileUrl || "");

  const fullFileUrl = getFullFileUrl(activeDoc?.fileUrl);

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* LEFT COLUMN: SIDEBAR PLAYLIST */}
          <aside className="lg:col-span-1 flex flex-col">
            <div 
              className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-4 shadow-soft backdrop-blur-md flex flex-col overflow-hidden"
              style={{ height: "820px", minHeight: "820px", maxHeight: "820px" }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 mb-3 border-b border-gold-300/5 pb-2 flex-shrink-0">
                Document Vault ({rawDocs.length})
              </h3>
              
              {rawDocs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gold-100/40">
                  No documents uploaded.
                </div>
              ) : (
                <div 
                  className="flex-1 overflow-y-auto pr-1 space-y-2"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,128,84,0.18) transparent" }}
                >
                  <style>{`
                    .vault-scroll::-webkit-scrollbar { width: 4px; }
                    .vault-scroll::-webkit-scrollbar-track { background: transparent; }
                    .vault-scroll::-webkit-scrollbar-thumb { background-color: rgba(160,128,84,0.18); border-radius: 20px; }
                    .vault-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(160,128,84,0.36); }
                  `}</style>
                  <div className="vault-scroll space-y-2">
                    {rawDocs.map((doc: any) => {
                      const isActive = doc.id === activeDocId;
                      const cleanStatus = getStatusLabel(doc.status);
                      return (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setActiveDocId(doc.id);
                            const newUrl = `${window.location.pathname}?documentId=${doc.id}`;
                            window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
                          }}
                          className={`relative w-full text-left rounded-xl p-3 border transition-all duration-300 flex items-center justify-between gap-3 ${
                            isActive
                              ? "bg-navy-900/80 border-gold border-l-4 border-l-gold shadow-[0_0_12px_rgba(212,175,55,0.15)] ring-1 ring-gold/30 text-gold-100 pl-2.5"
                              : "bg-navy-950/40 border-gold-300/5 text-gold-100 hover:border-gold-300/20 hover:bg-navy-950/60 pl-3.5"
                          }`}
                        >
                          {/* Left Column: Document Type & File Name */}
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-gold-200 truncate">
                              {getCategoryLabel(doc.fileCategory)}
                            </span>
                            <span className="text-[11px] text-gold-100/50 truncate w-full" title={doc.fileName}>
                              {doc.fileName}
                            </span>
                          </div>

                          {/* Right Column: View Icon & Status Badge */}
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider ${getStatusBadgeStyles(doc.status)}`}>
                              {cleanStatus}
                            </span>
                            {isActive ? (
                              <Eye className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                            ) : (
                              doc.fileType === "application/pdf" ? (
                                <FileText className="h-3.5 w-3.5 text-gold-100/30 flex-shrink-0" />
                              ) : (
                                <ImageIcon className="h-3.5 w-3.5 text-gold-100/30 flex-shrink-0" />
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT COLUMNS: VIEW PORTAL & CONTROLS */}
          <section className="lg:col-span-3 flex flex-col">
            {activeDoc ? (
              <div 
                className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col justify-between"
                style={{ height: "820px", minHeight: "820px", maxHeight: "820px", overflow: "hidden" }}
              >
                
                <div className="space-y-6 flex-1 flex flex-col">
                  {/* ACTIVE DOCUMENT METADATA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/5 pb-4 flex-shrink-0">
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
                    
                    <div className="text-left sm:text-right space-y-1 text-xs flex-shrink-0">
                      <p className="text-gold-100/40 font-semibold uppercase tracking-wider text-[10px]">Upload Date</p>
                      <p className="text-gold-100/80 font-bold flex items-center gap-1 sm:justify-end">
                        <Calendar className="h-3.5 w-3.5 text-gold/60" /> 
                        {activeDoc.createdAt ? new Date(activeDoc.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        }) : getMockDocDetails(activeDoc.fileCategory).uploadDate}
                      </p>
                    </div>
                  </div>

                  {/* DOCUMENT DETAILED INFORMATION */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-navy-950/40 border border-gold-300/5 text-xs flex-shrink-0">
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Document Type</span>
                      <span className="text-gold-200 font-bold">{getMockDocDetails(activeDoc.fileCategory).type}</span>
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Upload Date</span>
                      <span className="text-gold-200 font-bold">
                        {activeDoc.createdAt ? new Date(activeDoc.createdAt).toISOString().split("T")[0] : getMockDocDetails(activeDoc.fileCategory).uploadDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Expiry Date</span>
                      <span className="text-gold-200 font-bold">{getMockDocDetails(activeDoc.fileCategory).expiryDate}</span>
                    </div>
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">Status</span>
                      <span className={`font-bold uppercase ${
                        activeDoc.status?.toUpperCase() === "VERIFIED" || activeDoc.status?.toUpperCase() === "APPROVED"
                          ? "text-emerald-400"
                          : activeDoc.status?.toUpperCase() === "REJECTED"
                            ? "text-rose-400"
                            : "text-gold-DEFAULT"
                      }`}>
                        {getStatusLabel(activeDoc.status)}
                      </span>
                    </div>
                  </div>

                  {/* PREVIEW FRAME */}
                  <div 
                    className="relative rounded-xl border border-gold-300/5 bg-navy-950/60 p-2 flex items-center justify-center overflow-y-auto flex-shrink-0"
                    style={{ height: "350px", minHeight: "350px", maxHeight: "350px" }}
                  >
                    {!activeDoc.fileUrl ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gold-100/40">
                        <FileText className="h-16 w-16 text-gold-100/20 mb-3 animate-pulse" />
                        <p className="text-sm font-bold text-gold-200">No Document File Available</p>
                        <p className="text-xs text-gold-100/30">There is no file link associated with this document status.</p>
                      </div>
                    ) : isPDF ? (
                      <div className="w-full h-full relative">
                        <iframe
                          src={`${fullFileUrl}#toolbar=0&navpanes=0`}
                          className="w-full h-full rounded-lg bg-navy-900 border-0"
                          title={getCategoryLabel(activeDoc.fileCategory)}
                        />
                      </div>
                    ) : isImage ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fullFileUrl}
                          alt={getCategoryLabel(activeDoc.fileCategory)}
                          className="max-w-full max-h-[330px] object-contain rounded-lg shadow-elegant"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden flex-col items-center justify-center p-8 text-center text-gold-100/40">
                          <FileText className="h-16 w-16 text-gold-100/20 mb-3" />
                          <p className="text-sm font-bold text-gold-200">Preview Unreadable</p>
                          <p className="text-xs text-gold-100/30">Could not read the uploaded image format.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gold-100/40">
                        <FileText className="h-16 w-16 text-gold-100/20 mb-3" />
                        <p className="text-sm font-bold text-gold-200">No Direct Preview Available</p>
                        <p className="text-xs text-gold-100/30 mb-6">
                          This file format ({activeDoc.fileType || "unknown"}) cannot be previewed in-browser.
                        </p>
                        <a
                          href={fullFileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-4 w-4" /> Download raw file to view
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex-shrink-0">
                  {/* ACTION PORTAL */}
                  <div className="bg-navy-950/40 rounded-xl border border-gold-300/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gold-100/50">
                      <span className="font-bold text-gold-200 block mb-0.5">Verification Guidelines</span>
                      Ensure signatures, credentials and dates align properly with client care requests profile.
                    </div>
                    
                    <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-end whitespace-nowrap">
                      {activeDoc.fileUrl && (
                        <a
                          href={fullFileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 text-xs font-bold text-gold bg-navy-950 border border-gold-300/10 hover:border-gold-300/30 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                        >
                          <Download className="h-4 w-4 flex-shrink-0" />
                          Download Document
                        </a>
                      )}
                      
                      {activeDoc.status?.toUpperCase() === "VERIFIED" || activeDoc.status?.toUpperCase() === "APPROVED" ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-2 text-emerald-400 font-bold text-xs flex items-center gap-2 h-10 justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> Approved ✓
                        </div>
                      ) : activeDoc.status?.toUpperCase() === "REJECTED" ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-2 text-rose-400 font-bold text-xs flex items-center gap-2 h-10 justify-center flex-shrink-0">
                          <X className="h-4 w-4 flex-shrink-0" /> Rejected ✕
                        </div>
                      ) : (
                        <div className="flex flex-row items-center gap-3">
                          <button
                            onClick={handleReject}
                            disabled={submittingAction !== null}
                            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                          >
                            {submittingAction === "REJECT" ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                            ) : (
                              <X className="h-4 w-4" flex-shrink-0="true" />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={handleVerify}
                            disabled={submittingAction !== null}
                            className="px-5 py-2 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                          >
                            {submittingAction === "VERIFY" ? (
                              <div className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                            ) : (
                              <Check className="h-4 w-4" flex-shrink-0="true" />
                            )}
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ADMIN NOTES */}
                  <div className="space-y-2 pt-2 border-t border-gold-300/5">
                    <label className="text-xs uppercase font-bold text-gold-200/60 block">
                      Admin Notes {validationError && <span className="text-rose-500 font-bold ml-1">*</span>}
                    </label>
                    <textarea
                      value={notes[activeDoc.id] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNotes((prev) => ({
                          ...prev,
                          [activeDoc.id]: val,
                        }));
                        if (val.trim()) {
                          setValidationError(null);
                        }
                      }}
                      placeholder="Add notes about this document review (e.g. key credentials verified, reason for rejection...)"
                      rows={2}
                      className={`w-full rounded-xl bg-navy-950 p-3 text-xs text-gold-100 placeholder-gold-100/20 outline-none transition duration-300 resize-none animate-none border ${
                        validationError
                          ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                          : "border-gold-300/10 focus:border-gold-300/30"
                      }`}
                    />
                    {validationError && (
                      <p className="text-[10px] text-rose-400 font-semibold mt-1">
                        {validationError}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div 
                className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-12 text-center text-gold-100/40 backdrop-blur-md flex flex-col justify-center items-center"
                style={{ height: "820px", minHeight: "820px", maxHeight: "820px", overflow: "hidden" }}
              >
                <FileText className="h-12 w-12 text-gold-100/20 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-gold-200">No Document Selected</h3>
                <p className="text-xs max-w-sm mt-2">
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
