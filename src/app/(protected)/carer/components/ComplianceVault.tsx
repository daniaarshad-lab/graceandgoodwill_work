import SectionCard from "./shared/SectionCard";
import { ComplianceDoc } from "../types/carer.types";
import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, Eye, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Button from "@/components/Button";

interface ComplianceVaultProps {
  complianceDocs: ComplianceDoc[];
  uploadingDocType: string | null;
  uploadProgress: number;
  documentsLoading: boolean;
  batchUploading: boolean;
  deletingDocumentId: string | null;
  isOnboarding: boolean;
  selectedFiles: Record<string, File>;
  handleBatchUpload: () => Promise<boolean | void> | void;
  handleDocUpload: (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
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

const categoryDisplayMap: Record<string, string> = {
  DRIVERS_LICENSE: "Driver's License",
  CRIMINAL_RECORD_CHECK: "Criminal Record Check",
  DEMENTIA_SUPPORT: "Dementia Support Certificate",
  NURSES_REGISTRY: "Nurses Registry License",
  BUSINESS_INSURANCE: "Business Insurance",
};

export default function ComplianceVault({
  complianceDocs,
  uploadingDocType,
  uploadProgress,
  documentsLoading,
  batchUploading,
  deletingDocumentId,
  isOnboarding,
  selectedFiles,
  handleBatchUpload,
  handleDocUpload,
  handleUpdateDoc,
  setPreviewDoc,
  setDocToDelete,
  onNext,
  onBack,
}: ComplianceVaultProps) {
  const docTypes = [
    "Driver's License",
    "Criminal Record Check",
    "Dementia Support Certificate",
    "Mandatory Care Certificate",
    "Business Insurance Certificate",
  ] as const;

  const categoryMapForSelection: Record<string, string> = {
    "Driver's License": "drivers_license",
    "Criminal Record Check": "criminal_record_check",
    "Dementia Support Certificate": "dementia_support",
    "Mandatory Care Certificate": "care_certificate",
    "Business Insurance Certificate": "business_insurance",
  };

  const hasAllRequiredDocs = docTypes.every((docType) =>
    complianceDocs.some(
      (doc) =>
        doc.type ===
        {
          "Driver's License": "DRIVERS_LICENSE",
          "Criminal Record Check": "CRIMINAL_RECORD_CHECK",
          "Dementia Support Certificate": "DEMENTIA_SUPPORT",
          "Mandatory Care Certificate": "CARE_CERTIFICATE",
          "Business Insurance Certificate": "BUSINESS_INSURANCE",
        }[docType]
    )
  );

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
          ) : <div />}

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Panel: Update Documents */}
        <SectionCard className="h-[600px] flex flex-col">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4 mb-4">
            Document Management
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed mb-4 shrink-0">
            Upload or update official scans or photos (PDF, PNG, JPG) of your credentials.
            Ensure documents are clearly readable to stay compliant.
          </p>

          {/* Reusable document type uploads (scrollable container) */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-4 mb-4">
            {docTypes.map((docType) => {
              const fileKey = categoryMapForSelection[docType];
              const selectedFile = selectedFiles[fileKey];

              const backendType = {
                "Driver's License": "DRIVERS_LICENSE",
                "Criminal Record Check": "CRIMINAL_RECORD_CHECK",
                "Dementia Support Certificate": "DEMENTIA_SUPPORT",
                "Mandatory Care Certificate": "CARE_CERTIFICATE",
                "Business Insurance Certificate": "BUSINESS_INSURANCE",
              }[docType];

              const uploadedDoc = complianceDocs.find((doc) => doc.type === backendType);
              const displayName = selectedFile ? selectedFile.name : uploadedDoc ? uploadedDoc.name : null;

              return (
                <div
                  key={docType}
                  className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/20 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors hover:bg-navy-950/40"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-semibold text-gold-50">
                      {docType}
                    </h4>
                    {displayName ? (
                      <p className="text-[10px] text-emerald-400">
                        Selected: {displayName}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gold-100/50">
                        Required for credential validation
                      </p>
                    )}
                  </div>

                  <Button
                    asChild
                    variant="ghost-gold"
                    size="sm"
                    fullWidth={false}
                  >
                    <label className="cursor-pointer">
                      {displayName ? "Update File" : "Upload File"}
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          if (uploadedDoc) {
                            handleUpdateDoc(uploadedDoc.id, backendType!, e);
                          } else {
                            handleDocUpload(docType, e);
                          }
                        }}
                      />
                    </label>
                  </Button>
                </div>
              );
            })}
          </div>

          {isOnboarding && (
            <div className="pt-4 border-t border-gold-300/10 shrink-0">
              {/* Batch Upload Row */}
              <div className="flex justify-center w-full">
                <Button
                  variant="primary"
                  onClick={async () => {
                    const success = await handleBatchUpload();
                    if (success && onNext) {
                      onNext();
                    }
                  }}
                  disabled={!hasAllRequiredDocs || batchUploading}
                  className="w-full md:w-auto md:min-w-[280px] shadow-gold py-3"
                >
                  {batchUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload All Documents"
                  )}
                </Button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Right Panel: Vault Documents Uploaded List */}
        <SectionCard className="h-[600px] flex flex-col">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4 mb-4">
            Compliance Records Vault
          </h3>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {documentsLoading ? (
              <div className="text-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-gold-DEFAULT animate-spin mx-auto" />
                <p className="text-xs text-gold-100/50">
                  Loading compliance documents...
                </p>
              </div>
            ) : complianceDocs.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-gold-300/30 flex items-center justify-center text-gold-100/40">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs text-gold-100/40">
                  No documents uploaded yet. Upload items on the left to populate
                  vault.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {complianceDocs.map((doc) => {
                  const isDeleting = deletingDocumentId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex justify-between items-center gap-4 transition-opacity ${isDeleting ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 h-10 w-10 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-semibold text-gold-50 truncate">
                            {doc.name}
                          </h4>
                          <p className="text-[9px] text-gold-100/40 mt-0.5">
                            {categoryDisplayMap[doc.type] || doc.type} •{" "}
                            {doc.fileType || "Document"} • {doc.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status === "verified" ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                            Verified
                          </span>
                        ) : doc.status === "failed" ? (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                            Failed
                          </span>
                        ) : (
                          <span className="rounded-full bg-gold-DEFAULT/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-DEFAULT border border-gold-DEFAULT/20">
                            Pending
                          </span>
                        )}

                        <Button
                          asChild
                          variant="ghost-gold"
                          size="sm"
                          className="h-8 px-3 text-[10px]"
                        >
                          <label className="cursor-pointer">
                            Update File
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => handleUpdateDoc(doc.id, doc.type, e)}
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
                            <Loader2 className="w-4 h-4 animate-spin" />
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
