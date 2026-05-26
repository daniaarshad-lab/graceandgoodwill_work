import { ComplianceDoc } from "../types/carer.types";

interface UploadDocumentModalProps {
  previewDoc: ComplianceDoc | null;
  setPreviewDoc: (doc: ComplianceDoc | null) => void;
  docToDelete: string | null;
  setDocToDelete: (id: string | null) => void;
  confirmDelete: () => void;
}

export default function UploadDocumentModal({
  previewDoc,
  setPreviewDoc,
  docToDelete,
  setDocToDelete,
  confirmDelete,
}: UploadDocumentModalProps) {
  return (
    <>
      {/* PDF Preview Modal Overlay */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant space-y-4">
            <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
              <div>
                <h4 className="text-base font-bold text-gold-50">
                  {previewDoc.name}
                </h4>
                <p className="text-[10px] text-gold-100/50 mt-0.5">
                  {previewDoc.type} • Mock Document Previewer
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-lg text-gold-200 hover:text-gold-50"
              >
                ✕
              </button>
            </div>

            {/* Mock document visual scan placeholder */}
            <div className="h-80 w-full rounded-xl border border-gold-300/10 bg-navy-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center text-4xl text-gold-DEFAULT">
                📄
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-semibold text-gold-200">
                  Grace & Goodwill Document Scanner
                </h5>
                <p className="text-xs text-gold-100/60 max-w-sm mx-auto">
                  [Mocked PDF rendering of {previewDoc.type}]. Secure storage
                  node confirmed. Credential verification matches user registry.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 rounded-full">
                Secure SSL Validated
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-xl bg-gold-DEFAULT px-5 py-2.5 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Confirmation Dialog Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant space-y-4">
            <h4 className="text-base font-bold text-gold-50">
              Confirm Deletion
            </h4>
            <p className="text-xs text-gold-100/70">
              Are you sure you want to permanently delete this compliance
              document? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="rounded-xl border border-gold-300/20 text-gold-200 px-4 py-2 text-xs font-semibold hover:bg-gold-300/10"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
