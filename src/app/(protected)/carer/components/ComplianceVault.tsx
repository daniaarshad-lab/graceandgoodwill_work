import SectionCard from "./shared/SectionCard";
import { ComplianceDoc } from "../types/carer.types";
import React from "react";
import {
  FileText,
  Trash2,
  Eye,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";

interface ComplianceVaultProps {
  complianceDocs: ComplianceDoc[];
  documentsLoading: boolean;
  deletingDocumentId: string | null;
  isOnboarding: boolean;
  handleUpdateDoc: (
    id: string,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  setPreviewDoc: (doc: ComplianceDoc) => void;
  setDocToDelete: (id: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function ComplianceVault({
  complianceDocs,
  documentsLoading,
  deletingDocumentId,
  isOnboarding,
  handleUpdateDoc,
  setPreviewDoc,
  setDocToDelete,
  onNext,
  onBack,
}: ComplianceVaultProps) {
  const allVerified =
    complianceDocs.length > 0 &&
    complianceDocs.every((doc) => doc.status === "verified");

  const sortedDocs = [...complianceDocs].sort((a, b) => {
    if (a.status === "failed" && b.status !== "failed") return -1;
    if (a.status !== "failed" && b.status === "failed") return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Row */}
      {isOnboarding && (
        <div className="flex justify-between items-center w-full max-w-5xl mx-auto pb-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gold-300/10 bg-navy-900/30 backdrop-blur-md text-gold-200/80 text-[12.5px] font-medium tracking-wide hover:bg-navy-800/40 hover:border-gold-300/20 hover:text-gold-50 hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(212,175,55,0.05)] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gold-DEFAULT/30"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {onNext && (
            <button
              onClick={onNext}
              disabled={complianceDocs.length === 0}
              className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20 text-navy-950 text-[12.5px] font-semibold tracking-wide shadow-[0_2px_8px_rgba(245,212,160,0.15)] hover:shadow-[0_4px_12px_rgba(245,212,160,0.25)] hover:-translate-y-[1px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gold-200/50 disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none ml-auto"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Document Upload Grid */}
      <div className="w-full">
        {/* Vault Documents List */}
        <SectionCard className="h-[600px] flex flex-col">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4 mb-4">
            Compliance Records Vault
          </h3>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {documentsLoading ? (
              <div className="text-center py-12">
                <ThinSpinner size="md" text="Loading compliance documents..." />
              </div>
            ) : complianceDocs.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-gold-300/30 flex items-center justify-center text-gold-100/40">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs text-gold-100/40">No documents found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDocs.map((doc) => {
                  const isDeleting = deletingDocumentId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 transition-opacity ${
                        isDeleting ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                        <div className="shrink-0 h-10 w-10 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-gold-50 truncate">
                            {doc.name}
                          </h4>
                          <p className="text-[9px] text-gold-100/40 mt-0.5 truncate">
                            {doc.category
                              ? doc.category
                                  .split("_")
                                  .map(
                                    (w: string) =>
                                      w.charAt(0).toUpperCase() +
                                      w.slice(1).toLowerCase(),
                                  )
                                  .join(" ")
                              : "Document"}{" "}
                            • {doc.size}
                          </p>
                          {doc.status === "failed" && doc.rejectionReason && (
                            <p className="text-[10px] text-red-400 mt-1 font-medium break-words">
                              Reason : {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-end sm:justify-start">
                        {doc.status === "verified" ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                            Verified
                          </span>
                        ) : doc.status === "failed" ? (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                            Rejected
                          </span>
                        ) : (
                          <span className="rounded-full bg-gold-DEFAULT/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-DEFAULT border border-gold-DEFAULT/20">
                            Pending Admin review
                          </span>
                        )}

                        <Button
                          asChild
                          variant="ghost-gold"
                          size="sm"
                          className="h-8 px-3 text-[10px]"
                        >
                          <label className="cursor-pointer">
                            Upload / Update File
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) =>
                                handleUpdateDoc(doc.id, doc.type, e)
                              }
                            />
                          </label>
                        </Button>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-gold-200 hover:text-gold-50 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDocToDelete(doc.id)}
                          className="p-1.5 text-red-500 hover:text-red-400 transition-colors"
                          title="Delete"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <ThinSpinner size="xs" spinnerClassName="border-red-400 shrink-0" className="inline-flex flex-row space-y-0" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
