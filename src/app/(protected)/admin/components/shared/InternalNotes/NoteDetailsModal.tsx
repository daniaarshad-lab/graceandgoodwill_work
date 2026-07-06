import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Paperclip, Clock, Upload, File as FileIcon } from "lucide-react";
import Button from "@/components/Button";
import { InternalNote, InternalNoteHistory, InternalNoteAttachment } from "@/app/(protected)/admin/types/admin.types";
import { adminService } from "@/services/admin/admin.service";

interface NoteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: InternalNote | null;
  onAttachmentUploaded?: () => void;
}

export default function NoteDetailsModal({ isOpen, onClose, note, onAttachmentUploaded }: NoteDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<InternalNoteHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && note) {
      loadHistory();
      // Attachments are already on the note object typically, but if we needed to refresh them we could.
    }
  }, [isOpen, note]);

  // Prevent background scroll and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isUploading) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, isUploading, onClose]);

  const loadHistory = async () => {
    if (!note) return;
    setIsLoadingHistory(true);
    try {
      const historyData = await adminService.getInternalNoteHistory(note.id);
      setHistory(historyData);
    } catch (err: any) {
      console.error("Failed to load history:", err);
      // Fallback to note.history if available
      if (note.history) {
        setHistory(note.history);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !note) return;

    setIsUploading(true);
    setError(null);
    try {
      await adminService.addInternalNoteAttachment(note.id, file);
      if (onAttachmentUploaded) {
        onAttachmentUploaded();
      }
      // Note: we don't update local state here if we expect the parent to refetch and update the note prop
    } catch (err: any) {
      setError(err.message || "Failed to upload attachment");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen || !note || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-sm">
      {/* Clickable backdrop that closes modal */}
      <div className="absolute inset-0" onClick={!isUploading ? onClose : undefined} />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gold-300/10 bg-navy-900 shadow-soft flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gold-300/10 px-6 py-4">
          <h2 className="text-lg font-bold text-gold-200">Note Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gold-100/50 hover:bg-gold-300/10 hover:text-gold-100 transition duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
              {error}
            </div>
          )}

          {/* Note Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white">{note.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-xs text-gold-200">
                  {note.priority}
                </span>
                <span className="rounded-full border border-gold-300/20 bg-navy-950 px-3 py-1 text-xs text-gold-200">
                  {note.status}
                </span>
                {note.isPinned && (
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
                    Pinned
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-gold-300/10 bg-navy-950/50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-300">{note.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attachments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold text-gold-100">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </h4>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  fullWidth={false}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="py-1 px-3 text-xs h-auto"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              
              <div className="space-y-2">
                {!note.attachments?.length ? (
                  <p className="text-xs text-gray-500 italic">No attachments found.</p>
                ) : (
                  note.attachments.map((attachment: InternalNoteAttachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-gold-300/10 bg-navy-950 p-3 hover:border-gold-300/30 transition-colors"
                    >
                      <div className="rounded bg-navy-900 p-2">
                        <FileIcon className="h-4 w-4 text-gold-200" />
                      </div>
                      <span className="text-sm text-gold-100 truncate flex-1">
                        {attachment.fileName}
                      </span>
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Edit History Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-gold-100">
                <Clock className="h-4 w-4" />
                Edit History
              </h4>
              <div className="space-y-3">
                {isLoadingHistory ? (
                  <p className="text-xs text-gray-500">Loading history...</p>
                ) : !history.length ? (
                  <p className="text-xs text-gray-500 italic">No edits have been made to this note.</p>
                ) : (
                  history.map((record, index) => (
                    <div key={record.id} className="relative pl-5 border-l-2 border-gold-300/20 pb-4 last:pb-0">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
                      <div className="bg-navy-950/60 rounded-lg border border-gold-300/10 p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <p className="text-[11px] text-gold-100/60 font-mono">
                            {new Date(record.editedAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).replace(',', ' •')}
                          </p>
                        </div>
                        <p className="text-xs text-gold-50 mb-2">
                          <span className="text-gold-200/70">{index === history.length - 1 && !record.reason ? 'Created by ' : 'Edited by '}</span>
                          <span className="font-semibold">{record.editorName}</span>
                        </p>
                        
                        {(record.previousTitle || record.updatedTitle) && record.previousTitle !== record.updatedTitle && (
                          <div className="text-[11px] bg-navy-900/50 rounded px-2 py-1.5 border border-gold-300/5 text-gray-400 mb-2">
                            <span className="line-through opacity-70">{record.previousTitle}</span>
                            <span className="mx-2 text-gold-500">→</span>
                            <span className="text-gold-100">{record.updatedTitle}</span>
                          </div>
                        )}
                        
                        {record.reason && (
                          <div className="mt-2">
                            <span className="text-[10px] text-gold-200/50 uppercase tracking-wider font-semibold block mb-1">Reason:</span>
                            <p className="text-xs text-gold-100/90 leading-relaxed bg-navy-900 border border-gold-300/10 rounded px-2.5 py-2">
                              {record.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-gold-300/10 bg-navy-950/50 px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth={false}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
