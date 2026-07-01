import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";
import Button from "@/components/Button";
import { UpdateInternalNotePayload, InternalNote } from "@/app/(protected)/admin/types/admin.types";

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: InternalNote | null;
  onSave: (id: string, payload: UpdateInternalNotePayload) => Promise<void>;
}

export default function EditNoteModal({ isOpen, onClose, note, onSave }: EditNoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isPinned, setIsPinned] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{title?: string, content?: string, global?: string}>({});
  const [touched, setTouched] = useState<{title?: boolean, content?: boolean}>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (note && isOpen) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setPriority(note.priority || "MEDIUM");
      setIsPinned(note.isPinned || false);
      setErrors({});
      setTouched({});
    }
  }, [note, isOpen]);

  // Prevent background scroll and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isSaving) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !note || !mounted) return null;

  const validateTitle = (val: string) => val.trim() ? undefined : "Title is required.";
  const validateContent = (val: string) => val.trim() ? undefined : "Note content is required.";

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (errors.title && val.trim()) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    if (errors.content && val.trim()) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const handleBlur = (field: 'title' | 'content') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'title') {
      const error = validateTitle(title);
      setErrors(prev => ({ ...prev, title: error }));
    }
    if (field === 'content') {
      const error = validateContent(content);
      setErrors(prev => ({ ...prev, content: error }));
    }
  };

  const handleSave = async () => {
    const titleError = validateTitle(title);
    const contentError = validateContent(content);
    
    setTouched({ title: true, content: true });
    
    if (titleError || contentError) {
      setErrors({ title: titleError, content: contentError });
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await onSave(note.id, {
        title: title.trim(),
        content: content.trim(),
        priority,
        isPinned,
      });
      onClose();
    } catch (err: any) {
      setErrors({ global: err.message || "Failed to update the note." });
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/80 p-4 sm:p-6 backdrop-blur-sm">
      {/* Clickable backdrop that closes modal */}
      <div className="absolute inset-0" onClick={!isSaving ? onClose : undefined} />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gold-300/10 bg-navy-900 shadow-soft flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-300/10 px-6 py-4 bg-navy-900">
          <h2 className="text-lg font-bold text-gold-200">Edit Internal Note</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-2 text-gold-100/50 hover:bg-gold-300/10 hover:text-gold-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-navy-900 max-h-[65vh]">
          {errors.global && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-400">
              {errors.global}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gold-100">Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => handleBlur('title')}
              disabled={isSaving}
              autoFocus
              placeholder="e.g. Call with Carer"
              className={`w-full rounded-xl border ${errors.title ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-gold-300/20 focus:ring-gold-DEFAULT'} bg-navy-950 px-4 py-3 text-sm text-gold-100 outline-none focus:ring-2 transition duration-300 shadow-inner`}
            />
            {errors.title && (
              <p className="text-sm text-rose-400 flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gold-100">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSaving}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-4 py-3 text-sm text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 shadow-inner"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gold-100 flex items-center justify-between">
              <span>Note Content <span className="text-rose-400">*</span></span>
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => handleBlur('content')}
              disabled={isSaving}
              rows={8}
              placeholder="Enter your detailed note here..."
              className={`w-full rounded-xl border ${errors.content ? 'border-rose-500/50 focus:ring-rose-500/50' : 'border-gold-300/20 focus:ring-gold-DEFAULT'} bg-navy-950 px-4 py-3 text-sm text-gold-100 outline-none focus:ring-2 transition duration-300 shadow-inner resize-none`}
            />
            {errors.content && (
              <p className="text-sm text-rose-400 flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="h-4 w-4" />
                {errors.content}
              </p>
            )}
          </div>

          <label className="inline-flex items-center gap-3 cursor-pointer mt-2 group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                disabled={isSaving}
                className="peer sr-only"
              />
              <div className="h-5 w-5 rounded border border-gold-300/40 bg-navy-950 peer-checked:bg-gold peer-checked:border-gold transition-colors duration-200 shadow-sm"></div>
              <svg className="absolute w-3.5 h-3.5 text-navy-950 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gold-100/90 group-hover:text-gold-200 transition-colors duration-200">
              Pin to top of timeline
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gold-300/10 px-6 py-4 bg-navy-900">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            fullWidth={false}
            className={`min-w-[140px] shadow-lg shadow-gold/10 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
