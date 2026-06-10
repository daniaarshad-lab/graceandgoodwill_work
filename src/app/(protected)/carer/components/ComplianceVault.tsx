import SectionCard from "./shared/SectionCard";
import { ComplianceDoc } from "../types/carer.types";
import Button from "@/components/Button";
import { Eye, Trash2, FileText, RefreshCw, Loader2 } from "lucide-react";

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
      {/* Main Document Upload Grid */}
      <div className={`grid grid-cols-1 ${isOnboarding ? "md:grid-cols-2" : ""} gap-6`}>
        {/* File Upload Dropzones Card */}
        {isOnboarding && (
          <SectionCard className="space-y-6">
            <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
              Compliance Document Upload
            </h3>
            <p className="text-xs text-gold-100/60 leading-relaxed">
              Upload official scans or photos (PDF, PNG, JPG) of your credentials
              to become a verified live-in carer. Ensure documents are clearly
              readable.
            </p>

            {/* Reusable document type uploads */}
            {docTypes.map((docType) => {
              const fileKey = categoryMapForSelection[docType];
              const selectedFile = selectedFiles[fileKey];
              return (
                <div
                  key={docType}
                  className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/20 flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-xs font-semibold text-gold-50">
                      {docType}
                    </h4>
                    {selectedFile ? (
                      <p className="text-[10px] text-emerald-400">
                        Selected: {selectedFile.name}
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
                      Upload File
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleDocUpload(docType, e)}
                      />
                    </label>
                  </Button>
                </div>
              );
            })}

            <div className="pt-4 border-t border-gold-300/10 flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={async () => {
                  const success = await handleBatchUpload();
                  if (success && onNext) {
                    onNext();
                  }
                }}
                disabled={!hasAllRequiredDocs || batchUploading}
              >
                {batchUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload All"
                )}
              </Button>
              {onNext && (
                <Button
                  variant="primary"
                  onClick={onNext}
                  disabled={complianceDocs.length === 0}
                  className="px-8 shadow-gold"
                >
                  Next
                </Button>
              )}
            </div>
          </SectionCard>
        )}

        {/* Vault Documents Uploaded List */}
        <SectionCard className="space-y-6">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
            Compliance Records Vault
          </h3>

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

                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 text-gold-200 hover:text-gold-50 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!isOnboarding && (
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
                              onChange={(e) =>
                                handleUpdateDoc(doc.id, doc.type, e)
                              }
                            />
                          </label>
                        </Button>
                      )}
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
        </SectionCard>
      </div>
    </div>
  );
}
