import { useState, useEffect } from "react";
import { ComplianceDoc } from "../types/carer.types";
import Button from "@/components/Button";
import { storageService } from "@/services/storage.service";

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
  const [signedUrl, setSignedUrl] = useState<string>("");

  useEffect(() => {
    const target = previewDoc?.fileKey || previewDoc?.previewUrl || previewDoc?.fileUrl;
    if (target) {
      storageService.getPresignedUrl(target).then((url) => {
        setSignedUrl(url);
      });
    } else {
      setSignedUrl("");
    }
  }, [previewDoc]);

  function getFullUrl(url: string | null | undefined) {
    if (!url) return "";
    let finalUrl = url;
    if (!url.startsWith("http")) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      let baseUrl = apiUrl;
      try {
        baseUrl = new URL(apiUrl).origin;
      } catch (e) {
        baseUrl = apiUrl.replace(/\/api\/?$/, "");
      }
      const cleanPath = url.startsWith("/") ? url : `/${url}`;
      finalUrl = `${baseUrl}${cleanPath}`;
    }
    return finalUrl;
  }

  const fullPreviewUrl = signedUrl || (previewDoc ? getFullUrl(previewDoc.previewUrl) : "");


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
                  {previewDoc.type} • Document Preview
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-lg text-gold-200 hover:text-gold-50"
              >
                ✕
              </button>
            </div>

            {/* Real document preview */}
            <div className="h-80 w-full rounded-xl border border-gold-300/10 bg-navy-950 overflow-hidden">
              {fullPreviewUrl ? (
                (() => {
                  const isImage =
                    previewDoc.name?.match(/\.(png|jpg|jpeg|gif|webp)$/i) ||
                    fullPreviewUrl.match(/\.(png|jpg|jpeg|gif|webp)/i);
                  const isPdf =
                    previewDoc.name?.match(/\.pdf$/i) ||
                    fullPreviewUrl.match(/\.pdf/i);

                  if (isImage) {
                    return (
                      <img
                        src={fullPreviewUrl}
                        alt={previewDoc.name}
                        className="w-full h-full object-contain"
                      />
                    );
                  }

                  if (isPdf) {
                    return (
                      <iframe
                        src={fullPreviewUrl}
                        title={previewDoc.name}
                        className="w-full h-full"
                      />
                    );
                  }

                  return (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center text-4xl text-gold-DEFAULT">
                        📄
                      </div>
                      <p className="text-xs text-gold-100/60">
                        Preview is not available for this file type.
                      </p>
                      <Button
                        asChild
                        variant="ghost-gold"
                        size="sm"
                      >
                        <a
                          href={fullPreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Document
                        </a>
                      </Button>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center text-4xl text-gold-DEFAULT">
                    📄
                  </div>
                  <p className="text-xs text-gold-100/60">
                    No preview URL available for this document.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setPreviewDoc(null)}
                variant="primary"
                size="sm"
                fullWidth={false}
              >
                Close Preview
              </Button>
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
              <Button
                onClick={() => setDocToDelete(null)}
                variant="ghost-gold"
                size="sm"
                fullWidth={false}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                variant="danger"
                size="sm"
                fullWidth={false}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
