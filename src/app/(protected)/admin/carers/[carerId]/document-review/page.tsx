"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarerDetails,
  verifyDocument,
  rejectDocument,
  updateDocumentInStore,
  updateDocumentNotesThunk,
  updateDocumentMetadataThunk,
  deleteDocumentThunk,
} from "@/store/slices/adminSlice";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  Edit,
} from "lucide-react";

import { getDocumentFileLabel } from "@/types/document.types";
import { storageService } from "@/services/storage.service";
import ThinSpinner from "@/components/ThinSpinner";
import AdminUploadCarerDocumentModal from "@/app/(protected)/admin/components/AdminUploadCarerDocumentModal";

export default function DocumentReviewPage() {
  return (
    <Suspense
      fallback={
        <ThinSpinner fullScreen size="xl" text="Loading document review console..." />
      }
    >
      <DocumentReviewContent />
    </Suspense>
  );
}

const getFullFileUrl = (url: string | undefined | null) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let baseUrl = apiUrl;
  try {
    baseUrl = new URL(apiUrl).origin;
  } catch (e) {
    baseUrl = apiUrl.replace(/\/api\/?$/, "");
  }
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${normalizedPath}`;
};


function DocumentReviewContent() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    data: carer,
    loading,
    error,
  } = useAppSelector((state) => state.admin.selectedCarer);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const carerId = params.carerId as string;
  const documentId = searchParams.get("documentId");

  const [activeDocId, setActiveDocId] = useState<string | null>(documentId);
  const [optimisticDoc, setOptimisticDoc] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(true);
  const [submittingAction, setSubmittingAction] = useState<
    "VERIFY" | "REJECT" | null
  >(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalContext, setUploadModalContext] = useState<{ category?: string, type?: string, documentId?: string, initialNotes?: string } | null>(null);

  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Compliance Expiry Tracking state
  const [expiryDateInput, setExpiryDateInput] = useState<string>("");
  const [isEditingExpiry, setIsEditingExpiry] = useState(false);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

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
    if (Array.isArray(profile.documents) && profile.documents.length > 0)
      return profile.documents;
    if (Array.isArray(carer.documents) && carer.documents.length > 0)
      return carer.documents;
    if (
      Array.isArray(carer.complianceDocuments) &&
      carer.complianceDocuments.length > 0
    )
      return carer.complianceDocuments;
    if (
      Array.isArray(profile.complianceDocuments) &&
      profile.complianceDocuments.length > 0
    )
      return profile.complianceDocuments;
    if (Array.isArray(carer.complianceDocs) && carer.complianceDocs.length > 0)
      return carer.complianceDocs;
    if (
      Array.isArray(profile.complianceDocs) &&
      profile.complianceDocs.length > 0
    )
      return profile.complianceDocs;
    return profile.documents || carer.documents || [];
  };

  const rawDocs = (() => {
    const docs = extractDocuments();
    if (optimisticDoc) {
      const existingIdx = docs.findIndex((d: any) => d.id === optimisticDoc.id);
      if (existingIdx >= 0) {
        const existing = docs[existingIdx];
        // If the document in Redux has been verified or rejected, clear optimisticDoc and use existing!
        if (existing.status && existing.status !== "PENDING" && existing.status !== "UPLOADED") {
          return docs;
        }
        const updated = [...docs];
        updated[existingIdx] = { ...existing, ...optimisticDoc };
        return updated;
      }
      return [optimisticDoc, ...docs];
    }
    return docs;
  })();

  const activeDoc =
    rawDocs.find((doc: any) => doc.id === activeDocId) || rawDocs[0];
  const [previewSignedUrl, setPreviewSignedUrl] = useState<string>("");

  useEffect(() => {
    setIsPreviewLoading(true);
    if (activeDoc) {
      const keyOrUrl = activeDoc.fileKey || activeDoc.fileUrl;
      if (keyOrUrl) {
        let isCancelled = false;
        storageService.getPresignedUrl(keyOrUrl).then((url) => {
          if (!isCancelled) {
            setPreviewSignedUrl(url);
          }
        }).catch(() => {
          if (!isCancelled) {
            setPreviewSignedUrl("");
            setIsPreviewLoading(false);
          }
        });
        return () => {
          isCancelled = true;
        };
      } else {
        setPreviewSignedUrl("");
        setIsPreviewLoading(false);
      }
    } else {
      setPreviewSignedUrl("");
      setIsPreviewLoading(false);
    }
  }, [activeDoc?.id, activeDoc?.fileKey, activeDoc?.fileUrl]);

  useEffect(() => {
    if (activeDoc && !activeDocId) {
      setActiveDocId(activeDoc.id);
    }
  }, [activeDoc, activeDocId]);

  useEffect(() => {
    setValidationError(null);
    setShowRejectInput(false);
    setEditingNotes(false);
    setIsEditingExpiry(false);
    setTempNotes(activeDoc?.internalNotes || "");

    if (activeDoc?.expiryDate) {
      try {
        const d = new Date(activeDoc.expiryDate);
        setExpiryDateInput(d.toISOString().split("T")[0]);
      } catch {
        setExpiryDateInput("");
      }
    } else {
      setExpiryDateInput("");
    }
  }, [activeDocId, activeDoc?.id, activeDoc?.internalNotes, activeDoc?.expiryDate]);

  const isDbsDoc =
    activeDoc?.fileType === "ENHANCED_DBS_CERTIFICATE" ||
    activeDoc?.fileCategory === "CRIMINAL_RECORD_CHECK" ||
    (activeDoc?.customDocumentType &&
      activeDoc.customDocumentType.toLowerCase().includes("dbs"));

  const getExpiryBadge = (doc: any) => {
    if (!doc?.expiryDate) {
      return {
        label: "No Expiry",
        className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      };
    }
    const expiry = new Date(doc.expiryDate);
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / msPerDay);

    if (doc.isExpired || daysRemaining < 0) {
      return {
        label: "Expired",
        className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        daysRemaining,
      };
    }
    if (daysRemaining <= 30) {
      return {
        label: `Expiring Soon (${daysRemaining}d)`,
        className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        daysRemaining,
      };
    }
    return {
      label: `Valid (${daysRemaining}d)`,
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      daysRemaining,
    };
  };

  const isApproved =
    activeDoc?.status?.toUpperCase() === "VERIFIED" ||
    activeDoc?.status?.toUpperCase() === "APPROVED";

  const currentSavedExpiry = activeDoc?.expiryDate
    ? (() => {
        try {
          return new Date(activeDoc.expiryDate).toISOString().split("T")[0];
        } catch {
          return "";
        }
      })()
    : "";

  const isDateChanged = expiryDateInput !== currentSavedExpiry;

  const handleVerify = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeDoc) return;
    setValidationError(null);
    setSubmittingAction("VERIFY");
    try {
      const docNotes = tempNotes || activeDoc.internalNotes || "";
      await dispatch(
        verifyDocument({
          docId: activeDoc.id,
          notes: docNotes,
          expiryDate: expiryDateInput ? new Date(expiryDateInput).toISOString() : null,
        }),
      ).unwrap();

      // Clear optimisticDoc so verified status from Redux immediately takes over
      setOptimisticDoc(null);

      showSuccessToast(
        "Document Approved",
        expiryDateInput
          ? `Document approved with expiry date: ${expiryDateInput}.`
          : "The document has been approved.",
      );

      // Re-fetch carer details so server & client state stay 100% in sync
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to verify document");
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleSaveMetadata = async () => {
    if (!activeDoc) return;
    setIsSavingMetadata(true);
    try {
      await dispatch(
        updateDocumentMetadataThunk({
          docId: activeDoc.id,
          expiryDate: expiryDateInput ? new Date(expiryDateInput).toISOString() : null,
        }),
      ).unwrap();
      showSuccessToast("Compliance Updated", "Expiry date has been updated.");
      setIsEditingExpiry(false);
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to update compliance details");
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeDoc) return;

    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    const docNotes = (notes[activeDoc.id] || "").trim();
    if (!docNotes) {
      setValidationError(
        "Please provide a rejection reason before rejecting this document.",
      );
      return;
    }
    setValidationError(null);
    setSubmittingAction("REJECT");
    try {
      await dispatch(
        rejectDocument({ docId: activeDoc.id, rejectionReason: docNotes }),
      ).unwrap();

      setOptimisticDoc(null);
      showSuccessToast("Document Rejected", "The document has been rejected.");
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to reject document");
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeDoc) return;
    setIsSavingNotes(true);
    try {
      await dispatch(updateDocumentNotesThunk({ docId: activeDoc.id, internalNotes: tempNotes })).unwrap();
      showSuccessToast("Notes Saved", "Internal notes updated successfully.");
      setEditingNotes(false);
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!activeDoc) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteDocumentThunk({ docId: activeDoc.id })).unwrap();
      showSuccessToast("Document Deleted", "The document has been removed.");
      setActiveDocId(null);
      setShowDeleteConfirm(false);
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Error", err || "Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDocumentName = (doc: any) => {
    if (!doc) return "Unknown Document";
    return doc.fileType
      ? getDocumentFileLabel(doc.fileType)
      : doc.fileName || doc.fileCategory || "Unknown Document";
  };

  const carerName = carer
    ? `${carer.user?.firstName || carer.firstName || ""} ${carer.user?.lastName || carer.lastName || ""}`.trim() || "Carer"
    : "Carer";

  const handleUploadSuccess = (newDoc: any) => {
    setIsPreviewLoading(true);
    setPreviewSignedUrl("");
    if (newDoc?.id) {
      setOptimisticDoc(newDoc);
      setActiveDocId(newDoc.id);
      if (newDoc.fileUrl) {
        setPreviewSignedUrl(newDoc.fileUrl);
      }
      // Instantly update Redux store in place
      dispatch(updateDocumentInStore({ docId: newDoc.id, updates: newDoc }));

      const newUrl = `${window.location.pathname}?documentId=${newDoc.id}`;
      window.history.pushState(
        {
          ...window.history.state,
          as: newUrl,
          url: newUrl,
        },
        "",
        newUrl,
      );
    }
    dispatch(fetchCarerDetails(carerId))
      .unwrap()
      .then(() => {
        setOptimisticDoc(null);
      })
      .catch(() => { });
  };

  const activeDocName = getDocumentName(activeDoc);

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
    if (cleanStatus === "UPLOADED" || cleanStatus === "PENDING")
      return "PENDING";
    if (cleanStatus === "VERIFIED") return "APPROVED";
    return cleanStatus;
  };

  if (loading) {
    return (
      <ThinSpinner fullScreen size="xl" text="Fetching carer records..." />
    );
  }

  if (error || !carer) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold">Failed to Load Carer Profile</h2>
          <p className="text-xs text-red-500/80">
            {error || "The requested carer could not be found."}
          </p>
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

  const groupedDocs = (() => {
    const groups: Record<string, any[]> = {};
    rawDocs.forEach((doc: any) => {
      const groupName = getDocumentName(doc);
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(doc);
    });
    return groups;
  })();

  const isPDF =
    activeDoc?.fileType === "application/pdf" ||
    activeDoc?.fileName?.toLowerCase().endsWith(".pdf") ||
    activeDoc?.fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage =
    activeDoc?.fileType?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeDoc?.fileName || "") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(activeDoc?.fileUrl || "");

  const fullFileUrl = previewSignedUrl || getFullFileUrl(activeDoc?.fileUrl);

  return (
    <main className="min-h-screen bg-navy-950 pt-2 pb-8 sm:pt-4 sm:pb-10 text-gold-100">
      <div className="container-wrapper space-y-8 max-w-7xl mx-auto px-4">
        {/* --- PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href={`/admin/carers/${carerId}?tab=documents`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Carer Details
            </Link>
            <h1 className="text-xl tracking-tight text-gold-200 sm:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold" /> Onboarding
              compliance Audit
            </h1>
            <p className="text-xs text-gold-100/50">
              Verify practitioner licenses, background clearance certificates,
              and training profiles
            </p>
          </div>
        </header>

        {/* --- REVIEW WORKSPACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* LEFT COLUMN: SIDEBAR PLAYLIST */}
          <aside className="lg:col-span-1 flex flex-col">
            <div
              className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-4 shadow-soft backdrop-blur-md flex flex-col overflow-hidden"
              style={{
                height: "820px",
                minHeight: "820px",
                maxHeight: "820px",
              }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-gold-300/5 pb-2 flex-shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50">
                  Document Vault ({rawDocs.length})
                </h3>

              </div>

              {rawDocs.length === 0 ? (
                <div className="text-center py-8 text-xs text-gold-100/40">
                  No documents uploaded.
                </div>
              ) : (
                <div
                  className="flex-1 overflow-y-auto pr-1 space-y-2"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(160,128,84,0.18) transparent",
                  }}
                >
                  <style>{`
                    .vault-scroll::-webkit-scrollbar { width: 4px; }
                    .vault-scroll::-webkit-scrollbar-track { background: transparent; }
                    .vault-scroll::-webkit-scrollbar-thumb { background-color: rgba(160,128,84,0.18); border-radius: 20px; }
                    .vault-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(160,128,84,0.36); }
                  `}</style>
                  <div className="vault-scroll space-y-4">
                    {Object.entries(groupedDocs).map(([groupName, docs]) => {
                      const isPending = docs.some((d: any) => d.status === "PENDING" || d.status === "UPLOADED");
                      const groupStatus = isPending ? "PENDING" : docs[0]?.status || "UPLOADED";

                      return (
                        <div key={groupName} className="rounded-xl border border-navy-800 bg-navy-900/40 p-2 space-y-2">
                          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-navy-800">
                            <h4 className="text-[13px] font-bold text-gold-200 truncate pr-2">{groupName}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider flex-shrink-0 ${getStatusBadgeStyles(groupStatus)}`}>
                              {getStatusLabel(groupStatus)}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {docs.map((doc: any) => {
                              const isActive = doc.id === activeDocId;
                              const cleanStatus = getStatusLabel(doc.status);
                              const uploaderName = doc.uploadedByName || (doc.uploadedByRole === "ADMIN" ? "Admin" : "Carer");
                              const uploadDate = doc.createdAt
                                ? new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                : "Unknown Date";

                              return (
                                <button
                                  key={doc.id}
                                  onClick={() => {
                                    if (doc.id !== activeDocId) {
                                      setIsPreviewLoading(true);
                                      setPreviewSignedUrl("");
                                    }
                                    setActiveDocId(doc.id);
                                    const newUrl = `${window.location.pathname}?documentId=${doc.id}`;
                                    window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
                                  }}
                                  className={`relative w-full text-left rounded-lg p-2 border transition-all duration-300 flex items-center justify-between gap-2 ${isActive
                                      ? "bg-navy-900/80 border-gold shadow-[0_0_8px_rgba(212,175,55,0.15)] ring-1 ring-gold/30 text-gold-100"
                                      : "bg-navy-950/40 border-gold-300/5 text-gold-100 hover:border-gold-300/20 hover:bg-navy-950/60"
                                    }`}
                                >
                                  {/* Left Column: File Name & Meta */}
                                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      {doc.fileType === "application/pdf" ? (
                                        <FileText className="h-3 w-3 text-rose-400 flex-shrink-0" />
                                      ) : (
                                        <ImageIcon className="h-3 w-3 text-blue-400 flex-shrink-0" />
                                      )}
                                      <span className="text-[11px] font-semibold text-gold-100 truncate" title={doc.fileName}>
                                        {doc.fileName || "Document"}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-gold-100/50 truncate w-full pl-4">
                                      Uploaded by {uploaderName} • {uploadDate}
                                    </span>
                                  </div>

                                  {/* Right Column: View Icon */}
                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {isActive && <Eye className="h-3 w-3 text-gold flex-shrink-0" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setUploadModalContext({
                                category: docs[0]?.fileCategory || docs[0]?.category,
                                type: docs[0]?.fileType || docs[0]?.type || docs[0]?.fileName || docs[0]?.name
                              });
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full mt-1.5 py-1.5 px-3 rounded-lg border border-gold-300/20 text-[10px] font-semibold text-gold-200/70 hover:text-gold-200 hover:bg-gold-300/10 hover:border-gold-300/40 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Upload className="w-3 h-3" />
                            + Upload additional document
                          </button>
                        </div>
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
                className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col gap-6 h-full"
              >
                <div className="space-y-6 flex flex-col">
                  {/* ACTIVE DOCUMENT METADATA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/5 pb-4 flex-shrink-0">
                    <div className="space-y-1">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase inline-block ${getStatusBadgeStyles(activeDoc.status)}`}
                      >
                        {getStatusLabel(activeDoc.status)}
                      </span>
                      <h2 className="text-xl font-bold text-gold-200">
                        {activeDocName}
                      </h2>
                      <p className="text-xs text-gold-100/50 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-gold/60" />{" "}
                        {activeDoc.fileName} •{" "}
                        {((activeDoc.fileSize || 0) / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center gap-2.5 mr-3">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadModalContext({
                              category: activeDoc.fileCategory || activeDoc.category,
                              type: activeDoc.fileType || activeDoc.type || activeDoc.fileName || activeDoc.name,
                              documentId: activeDoc.id,
                              initialNotes: activeDoc.internalNotes
                            });
                            setIsUploadModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/30 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                      <div className="text-left sm:text-right space-y-1 text-xs flex-shrink-0">
                        <p className="text-gold-100/40 font-semibold uppercase tracking-wider text-[10px]">
                          Upload Date
                        </p>
                        <p className="text-gold-100/80 font-bold flex items-center gap-1 sm:justify-end">
                          <Calendar className="h-3.5 w-3.5 text-gold/60" />
                          {activeDoc.createdAt
                            ? new Date(activeDoc.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT DETAILED INFORMATION */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-xl bg-navy-950/40 border border-gold-300/5 text-xs flex-shrink-0">
                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                        Document Type
                      </span>
                      <span className="text-gold-200 font-bold truncate block" title={getDocumentName(activeDoc)}>
                        {activeDoc.customDocumentType ||
                          (activeDoc.fileType
                            ? getDocumentFileLabel(activeDoc.fileType)
                            : activeDoc.fileCategory || "Document")}
                      </span>
                    </div>

                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                        Expiry Date
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-gold-200 font-bold">
                          {activeDoc.expiryDate
                            ? new Date(activeDoc.expiryDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                            : "No Expiry"}
                        </span>
                        {activeDoc.expiryDate && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold border leading-none ${getExpiryBadge(activeDoc).className
                              }`}
                          >
                            {getExpiryBadge(activeDoc).label}
                          </span>
                        )}
                      </div>
                    </div>

                    {isDbsDoc ? (
                      <div>
                        <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                          DBS Number
                        </span>
                        <span className="text-gold-200 font-bold font-mono truncate block">
                          {activeDoc.dbsCertificateNumber ||
                            carer?.carerProfile?.dbsCertificateNumber ||
                            "Not Set"}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                          Approved At
                        </span>
                        <span className="text-gold-200 font-bold">
                          {activeDoc.approvedAt
                            ? new Date(activeDoc.approvedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                            : "N/A"}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                        Rejected At
                      </span>
                      <span className="text-gold-200 font-bold">
                        {activeDoc.rejectedAt
                          ? new Date(activeDoc.rejectedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                          : "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                        Status
                      </span>
                      <span
                        className={`font-bold uppercase ${activeDoc.status?.toUpperCase() === "VERIFIED" ||
                            activeDoc.status?.toUpperCase() === "APPROVED"
                            ? "text-emerald-400"
                            : activeDoc.status?.toUpperCase() === "REJECTED"
                              ? "text-rose-400"
                              : "text-gold-DEFAULT"
                          }`}
                      >
                        {getStatusLabel(activeDoc.status)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gold-100/40 font-semibold uppercase tracking-wider block mb-1">
                        {activeDoc.status?.toUpperCase() === "REJECTED"
                          ? "Rejected By"
                          : "Approved By"}
                      </span>
                      <span className="text-gold-200 font-bold truncate block">
                        {activeDoc.status?.toUpperCase() === "APPROVED" ||
                          activeDoc.status?.toUpperCase() === "VERIFIED" ||
                          activeDoc.status?.toUpperCase() === "REJECTED"
                          ? (activeDoc.rejectedByName &&
                            activeDoc.rejectedByName !== "ADMIN" &&
                            activeDoc.rejectedByName) ||
                          (activeDoc.rejectedBy &&
                            activeDoc.rejectedBy !== "ADMIN" &&
                            activeDoc.rejectedBy) ||
                          (activeDoc.approvedByName &&
                            activeDoc.approvedByName !== "ADMIN" &&
                            activeDoc.approvedByName) ||
                          (activeDoc.approvedBy &&
                            activeDoc.approvedBy !== "ADMIN" &&
                            activeDoc.approvedBy) ||
                          (activeDoc.adminName &&
                            activeDoc.adminName !== "ADMIN" &&
                            activeDoc.adminName) ||
                          (activeDoc.reviewedBy &&
                            activeDoc.reviewedBy !== "ADMIN" &&
                            activeDoc.reviewedBy) ||
                          (user?.firstName
                            ? `${user.firstName} ${user.lastName || ""}`.trim()
                            : "System Admin")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* PREVIEW FRAME */}
                  <div
                    className="relative rounded-xl border border-gold-300/5 bg-navy-950/60 p-2 flex items-center justify-center overflow-y-auto flex-shrink-0"
                    style={{
                      height: "350px",
                      minHeight: "350px",
                      maxHeight: "350px",
                    }}
                  >
                    {/* Centered Preview Loader */}
                    {isPreviewLoading && activeDoc.fileUrl && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/85 backdrop-blur-sm rounded-xl">
                        <ThinSpinner size="md" spinnerClassName="border-gold" text="Loading document preview..." />
                      </div>
                    )}
                    {!activeDoc.fileUrl ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gold-100/40">
                        <FileText className="h-16 w-16 text-gold-100/20 mb-3 animate-pulse" />
                        <p className="text-sm font-bold text-gold-200">
                          No Document File Available
                        </p>
                        <p className="text-xs text-gold-100/30">
                          There is no file link associated with this document
                          status.
                        </p>
                      </div>
                    ) : isPDF ? (
                      <div className="w-full h-full relative">
                        <iframe
                          src={`${fullFileUrl}#toolbar=0&navpanes=0`}
                          onLoad={() => setIsPreviewLoading(false)}
                          className="w-full h-full rounded-lg bg-navy-900 border-0"
                          title={activeDocName}
                        />
                      </div>
                    ) : isImage ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fullFileUrl}
                          alt={activeDocName}
                          onLoad={() => setIsPreviewLoading(false)}
                          className="max-w-full max-h-[330px] object-contain rounded-lg shadow-elegant"
                          onError={(e) => {
                            setIsPreviewLoading(false);
                            e.currentTarget.style.display = "none";
                            const sibling = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = "flex";
                          }}
                        />
                        <div className="hidden flex-col items-center justify-center p-8 text-center text-gold-100/40">
                          <FileText className="h-16 w-16 text-gold-100/20 mb-3" />
                          <p className="text-sm font-bold text-gold-200">
                            Preview Unreadable
                          </p>
                          <p className="text-xs text-gold-100/30">
                            Could not read the uploaded image format.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gold-100/40">
                        <FileText className="h-16 w-16 text-gold-100/20 mb-3" />
                        <p className="text-sm font-bold text-gold-200">
                          No Direct Preview Available
                        </p>
                        <p className="text-xs text-gold-100/30 mb-6">
                          This file format ({activeDoc.fileType || "unknown"})
                          cannot be previewed in-browser.
                        </p>
                        <a
                          href={fullFileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-4 w-4" /> Download raw file to
                          view
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex-shrink-0">
                  {/* ADMIN NOTES */}
                  {showRejectInput && (
                    <div className="space-y-2 pt-2 border-t border-gold-300/5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs uppercase font-bold text-gold-200/60 block">
                        Rejection Reason{" "}
                        <span className="text-rose-500 font-bold ml-1">*</span>
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
                        placeholder="Provide a reason for rejection (required)..."
                        rows={2}
                        className={`w-full rounded-xl bg-navy-950 p-3 text-xs text-gold-100 placeholder-gold-100/20 outline-none transition duration-300 resize-none animate-none border ${validationError
                            ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                            : "border-gold-300/10 focus:border-gold-300/30"
                          }`}
                        autoFocus
                      />
                      {validationError && (
                        <p className="text-[10px] text-rose-400 font-semibold mt-1">
                          {validationError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ACTION PORTAL AND INTERNAL NOTES */}
                  <div className="space-y-4">
                    {/* INTERNAL ADMIN NOTES */}
                    <div className="space-y-2 pt-2 border-t border-gold-300/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase font-bold text-gold-200/60">
                          Internal Admin Notes
                        </label>
                        {!editingNotes ? (
                          <button
                            type="button"
                            onClick={() => setEditingNotes(true)}
                            className="text-[10px] text-gold hover:text-gold-200 uppercase tracking-wider font-bold transition-colors"
                          >
                            Edit Notes
                          </button>
                        ) : null}
                      </div>
                      {editingNotes ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Add internal notes about this document..."
                            rows={2}
                            disabled={isSavingNotes}
                            className="w-full rounded-xl bg-navy-950 p-3 text-xs text-gold-100 placeholder-gold-100/20 outline-none border border-gold-300/10 focus:border-gold-300/30 transition duration-300 resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNotes(false);
                                setTempNotes(activeDoc.internalNotes || "");
                              }}
                              disabled={isSavingNotes}
                              className="px-3 py-1 text-[10px] font-bold text-gold-200 hover:text-gold-100 uppercase tracking-wider"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveNotes}
                              disabled={isSavingNotes}
                              className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold bg-gold/10 hover:bg-gold/20 text-gold rounded-lg border border-gold/20 flex items-center gap-1 transition-colors"
                            >
                              {isSavingNotes ? "Saving..." : "Save Notes"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-navy-950/40 p-3 text-xs text-gold-100/80 border border-gold-300/5 min-h-[50px] whitespace-pre-wrap">
                          {activeDoc.internalNotes ? (
                            activeDoc.internalNotes
                          ) : (
                            <span className="italic text-gold-100/30">No internal notes added.</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* DOCUMENT EXPIRY DATE */}
                    <div className="space-y-2 pt-2 border-t border-gold-300/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-xs uppercase font-bold text-gold-200/60 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gold" />
                            Document Expiry Date
                            <span className="text-[10px] font-normal normal-case text-gold-100/40 italic">
                              (optional)
                            </span>
                          </label>
                          {activeDoc.expiryDate && !isEditingExpiry && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold border leading-none ${getExpiryBadge(activeDoc).className}`}
                            >
                              {getExpiryBadge(activeDoc).label}
                            </span>
                          )}
                        </div>
                        {activeDoc.expiryDate && !isEditingExpiry ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingExpiry(true);
                              try {
                                setExpiryDateInput(new Date(activeDoc.expiryDate).toISOString().split("T")[0]);
                              } catch {
                                setExpiryDateInput("");
                              }
                            }}
                            className="text-[10px] text-gold hover:text-gold-200 uppercase tracking-wider font-bold transition-colors cursor-pointer"
                          >
                            Edit Expiry
                          </button>
                        ) : null}
                      </div>

                      {activeDoc.expiryDate && !isEditingExpiry ? (
                        <div className="flex items-center rounded-xl bg-navy-950/40 p-3 text-xs border border-gold-300/5 min-h-[46px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gold-200 font-bold font-mono text-xs">
                              {new Date(activeDoc.expiryDate).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-[11px] text-gold-100/40">
                              (Tracked by compliance monitor)
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto min-w-[240px] max-w-xs">
                              <input
                                type="date"
                                value={expiryDateInput}
                                onChange={(e) => setExpiryDateInput(e.target.value)}
                                disabled={isSavingMetadata}
                                className="w-full rounded-xl bg-navy-950 p-2.5 text-xs text-gold-100 outline-none border border-gold-300/10 focus:border-gold-300/30 transition duration-300"
                              />
                              {expiryDateInput && (
                                <button
                                  type="button"
                                  onClick={() => setExpiryDateInput("")}
                                  disabled={isSavingMetadata}
                                  className="text-xs text-gold-100/40 hover:text-gold-200 px-2 py-1 rounded transition-colors cursor-pointer"
                                  title="Clear expiry date"
                                >
                                  Clear
                                </button>
                              )}
                            </div>

                            {/* Only show save button when user adds or changes an expiry date */}
                            {isDateChanged && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleSaveMetadata}
                                  disabled={isSavingMetadata}
                                  className="px-4 py-2 text-xs font-bold bg-gold hover:bg-gold-200 text-navy-950 rounded-xl flex items-center gap-1.5 shadow-sm transition duration-200 cursor-pointer h-9"
                                >
                                  {isSavingMetadata ? (
                                    <ThinSpinner size="xs" spinnerClassName="border-navy-950 shrink-0" className="inline-flex flex-row space-y-0" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                  <span>Save Expiry Date</span>
                                </button>

                                {activeDoc.expiryDate && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsEditingExpiry(false);
                                      try {
                                        setExpiryDateInput(new Date(activeDoc.expiryDate).toISOString().split("T")[0]);
                                      } catch {
                                        setExpiryDateInput("");
                                      }
                                    }}
                                    disabled={isSavingMetadata}
                                    className="px-3 py-1 text-[10px] font-bold text-gold-200 hover:text-gold-100 uppercase tracking-wider cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <p className="text-[10px] text-gold-100/40">
                            This expiry date will be tracked by the compliance expiry monitor, triggering automated renewal reminders.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ACTION PORTAL */}
                    <div className="bg-navy-950/40 rounded-xl border border-gold-300/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-gold-100/50">
                        <span className="font-bold text-gold-200 block mb-0.5">
                          Verification Guidelines
                        </span>
                        Ensure signatures, credentials and dates align properly
                        with client care requests profile.
                      </div>

                      <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-end whitespace-nowrap overflow-x-auto pb-1 md:pb-0">
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={handleDeleteDoc}
                          disabled={isDeleting || submittingAction !== null}
                          className="px-4 py-2 text-xs font-bold text-rose-400 bg-navy-950 border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/10 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                          title="Delete Document"
                        >
                          {isDeleting ? (
                            <ThinSpinner size="xs" spinnerClassName="border-rose-400 shrink-0" className="inline-flex flex-row space-y-0" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 flex-shrink-0" />
                              <span className="hidden sm:inline">Delete</span>
                            </>
                          )}
                        </button>

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

                        {activeDoc.status?.toUpperCase() === "VERIFIED" ||
                          activeDoc.status?.toUpperCase() === "APPROVED" ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-2 text-emerald-400 font-bold text-xs flex items-center gap-2 h-10 justify-center flex-shrink-0">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />{" "}
                            Approved ✓
                          </div>
                        ) : activeDoc.status?.toUpperCase() === "REJECTED" ? (
                          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-2 text-rose-400 font-bold text-xs flex items-center gap-2 h-10 justify-center flex-shrink-0">
                            <X className="h-4 w-4 flex-shrink-0" /> Rejected ✕
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-3">
                            {showRejectInput ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowRejectInput(false);
                                    setValidationError(null);
                                  }}
                                  disabled={submittingAction !== null}
                                  className="px-5 py-2 text-xs font-bold text-gold-200 bg-navy-950 hover:bg-navy-900 border border-gold-300/10 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center h-10 flex-shrink-0"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={handleReject}
                                  disabled={submittingAction !== null}
                                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 h-10 flex-shrink-0"
                                >
                                  {submittingAction === "REJECT" ? (
                                    <ThinSpinner size="xs" spinnerClassName="border-white shrink-0" className="inline-flex flex-row space-y-0" />
                                  ) : (
                                    <X className="h-4 w-4" flex-shrink-0="true" />
                                  )}
                                  Submit Rejection
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={handleReject}
                                  disabled={submittingAction !== null}
                                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                                >
                                  {submittingAction === "REJECT" ? (
                                    <ThinSpinner size="xs" spinnerClassName="border-white shrink-0" className="inline-flex flex-row space-y-0" />
                                  ) : (
                                    <X className="h-4 w-4" flex-shrink-0="true" />
                                  )}
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={handleVerify}
                                  disabled={submittingAction !== null}
                                  className="px-5 py-2 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 disabled:opacity-40 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-10 flex-shrink-0"
                                >
                                  {submittingAction === "VERIFY" ? (
                                    <ThinSpinner size="xs" spinnerClassName="border-navy-950 shrink-0" className="inline-flex flex-row space-y-0" />
                                  ) : (
                                    <Check className="h-4 w-4" flex-shrink-0="true" />
                                  )}
                                  Approve
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-12 text-center text-gold-100/40 backdrop-blur-md flex flex-col justify-center items-center h-full min-h-[500px]"
              >
                <FileText className="h-12 w-12 text-gold-100/20 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-gold-200">
                  No Document Selected
                </h3>
                <p className="text-xs max-w-sm mt-2">
                  Select an uploaded compliance document from the vault to
                  verify or review its qualifications checklist.
                </p>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-[#F5D4A0] via-[#D4AF37] to-[#C99232] hover:brightness-110 shadow-md shadow-gold/20 flex items-center gap-2 transition duration-200 cursor-pointer"
                >
                  <Upload className="h-4 w-4" /> Upload Document
                </button>
              </div>
            )}
          </section>
        </div>
        <AdminUploadCarerDocumentModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          carerId={carerId}
          carerName={carerName}
          documentId={uploadModalContext?.documentId}
          initialCategory={uploadModalContext ? uploadModalContext.category : undefined}
          initialType={uploadModalContext ? uploadModalContext.type : undefined}
          initialNotes={uploadModalContext ? uploadModalContext.initialNotes : undefined}
          isLocked={!!uploadModalContext}
          onUploadSuccess={handleUploadSuccess}
        />

        {showDeleteConfirm && (
          <div
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
              if (!isDeleting) setShowDeleteConfirm(false);
            }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-rose-500/20 bg-gradient-to-b from-navy-900 to-[#0a0f1d] p-6 text-gold-100 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2 pt-1">
                  <h3 className="text-lg font-bold text-rose-100">Delete Document?</h3>
                  <p className="text-xs text-rose-100/60 leading-relaxed">
                    Are you sure you want to delete this document? This action cannot be undone and the document will be permanently removed from the carer's compliance record.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-500/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-semibold text-rose-100/60 hover:text-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteDoc}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/20 flex items-center gap-2 transition duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <ThinSpinner size="xs" spinnerClassName="border-white" className="inline-flex flex-row space-y-0" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
