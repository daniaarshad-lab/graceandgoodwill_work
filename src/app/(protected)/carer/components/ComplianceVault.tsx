import SectionCard from "./shared/SectionCard";
import { ComplianceDoc } from "../types/carer.types";
import Button from "@/components/Button";

interface ComplianceVaultProps {
  complianceDocs: ComplianceDoc[];
  uploadingDocType: string | null;
  uploadProgress: number;
  handleDocUpload: (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  setPreviewDoc: (doc: ComplianceDoc) => void;
  setDocToDelete: (id: string) => void;
  complianceError: string | null;
  complianceSuccess: string | null;
}

export default function ComplianceVault({
  complianceDocs,
  uploadingDocType,
  uploadProgress,
  handleDocUpload,
  setPreviewDoc,
  setDocToDelete,
  complianceError,
  complianceSuccess,
}: ComplianceVaultProps) {
  const docTypes = [
    "Driver's License",
    "Criminal Record Check",
    "Dementia Support Certificate",
    "Nurses Registry License",
  ] as const;

  return (
    <div className="space-y-6">
      {complianceError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 max-w-4xl mx-auto">
          {complianceError}
        </div>
      )}

      {complianceSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400 max-w-4xl mx-auto">
          {complianceSuccess}
        </div>
      )}

      {/* Main Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Dropzones Card */}
        <SectionCard className="space-y-6">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
            Compliance Document Upload
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed">
            Upload official PDF scans of your credentials to become a verified
            live-in carer. Ensure documents are clearly readable.
          </p>

          {/* Reusable document type uploads */}
          {docTypes.map((docType) => {
            const isDocUploading = uploadingDocType === docType;
            return (
              <div
                key={docType}
                className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/20 flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-semibold text-gold-50">
                    {docType}
                  </h4>
                  <p className="text-[10px] text-gold-100/50">
                    Required for credential validation
                  </p>
                </div>

                {isDocUploading ? (
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-navy-950 rounded-full overflow-hidden border border-gold-300/10">
                      <div
                        className="h-full bg-gold-DEFAULT rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gold-DEFAULT font-bold">
                      {uploadProgress}%
                    </span>
                  </div>
                ) : (
                  <Button
                    asChild
                    variant="ghost-gold"
                    size="sm"
                    fullWidth={false}
                  >
                    <label className="cursor-pointer">
                      Upload PDF
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleDocUpload(docType, e)}
                      />
                    </label>
                  </Button>
                )}
              </div>
            );
          })}
        </SectionCard>

        {/* Vault Documents Uploaded List */}
        <SectionCard className="space-y-6">
          <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
            Compliance Records Vault
          </h3>

          {complianceDocs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-gold-300/30 flex items-center justify-center text-gold-100/40">
                📄
              </div>
              <p className="text-xs text-gold-100/40">
                No documents uploaded yet. Upload items on the left to populate
                vault.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complianceDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0 h-10 w-10 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-lg text-gold-DEFAULT">
                      📄
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-gold-50 truncate">
                        {doc.name}
                      </h4>
                      <p className="text-[9px] text-gold-100/40 mt-0.5">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === "verified" ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-gold-DEFAULT/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-DEFAULT border border-gold-DEFAULT/20">
                        Pending
                      </span>
                    )}

                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 text-xs text-gold-200 hover:text-gold-50"
                      title="Preview"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc.id)}
                      className="p-1.5 text-xs text-red-500 hover:text-red-400"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
