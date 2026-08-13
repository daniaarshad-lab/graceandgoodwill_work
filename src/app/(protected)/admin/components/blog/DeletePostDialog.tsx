"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

import Button from "@/components/Button";

interface DeletePostDialogProps {
  isOpen: boolean;
  postTitle: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation dialog for the one destructive action in the blog CMS.
 * Follows the portal + ESC + scroll-lock pattern established by AddNoteModal.
 */
export default function DeletePostDialog({
  isOpen,
  postTitle,
  isDeleting,
  onCancel,
  onConfirm,
}: DeletePostDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm sm:p-6">
      <div
        className="absolute inset-0"
        onClick={isDeleting ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-post-title"
        aria-describedby="delete-post-description"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gold-300/10 bg-navy-900 shadow-soft"
      >
        <div className="flex items-start justify-between border-b border-gold-300/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-500/25 bg-rose-500/10">
              <AlertTriangle
                className="h-4 w-4 text-rose-400"
                aria-hidden="true"
              />
            </div>
            <h2
              id="delete-post-title"
              className="text-lg font-bold text-gold-200"
            >
              Delete blog post
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="rounded-full p-2 text-gold-100/50 transition duration-300 hover:bg-gold-300/10 hover:text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300/50 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p id="delete-post-description" className="text-sm text-gold-100/70">
            Are you sure you want to delete this blog post?
          </p>
          <p className="mt-3 rounded-xl border border-gold-300/10 bg-navy-950 px-4 py-3 text-sm font-semibold text-gold-100">
            {postTitle}
          </p>
          <p className="mt-3 text-xs text-gold-100/45">
            This cannot be undone. If the post is published it will be removed
            from the website immediately.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-gold-300/10 px-6 py-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="md"
            fullWidth={false}
            onClick={onCancel}
            disabled={isDeleting}
            className="sm:min-w-[120px]"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            fullWidth={false}
            onClick={onConfirm}
            disabled={isDeleting}
            className="sm:min-w-[120px]"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
