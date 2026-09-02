"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";

import { isSafeUrl } from "@/lib/blogHtml";
import EditorToolbar, { type ToolbarState } from "./EditorToolbar";
import {
  configureEditor,
  queryActive,
  queryBlock,
  runCommand,
  type EditorCommand,
} from "./editorCommands";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label: string;
  describedById?: string;
}

/** contentEditable needs a block to put the caret in, or Enter misbehaves. */
const EMPTY_HTML = "<p><br></p>";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the article…",
  disabled,
  error,
  label,
  describedById,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  /**
   * The last HTML this component handed to its parent. Anything else arriving
   * in `value` came from outside (an async post load, a form reset) and must be
   * written into the DOM. This guard is what keeps the caret alive — see the
   * sync effect below.
   */
  const lastEmittedRef = useRef<string>(value);
  const savedRangeRef = useRef<Range | null>(null);

  const [isEmpty, setIsEmpty] = useState(!value);
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    bold: false,
    italic: false,
    block: "p",
  });
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState("https://");
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    configureEditor();
  }, []);

  /* Seed the DOM once on mount. */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = value || EMPTY_HTML;
    lastEmittedRef.current = value;
    setIsEmpty(!value);
    /* Mount only — later syncing is handled by the effect below. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sync DOWN only on genuinely external changes.
   *
   * Writing `innerHTML` destroys and recreates every child node, which destroys
   * the Selection anchor and collapses the caret to position 0. If this ran on
   * our own echo, every keystroke would send the cursor to the start and typing
   * "hello" would produce "olleh". Because `emit()` sets `lastEmittedRef`
   * *before* calling `onChange`, the guard already matches by the time React
   * re-renders, so this returns early and never touches the DOM while typing.
   *
   * It is also idempotent under reactStrictMode double-invocation.
   */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    el.innerHTML = value || EMPTY_HTML;
    setIsEmpty(!value);
  }, [value]);

  const refreshToolbar = useCallback(() => {
    setToolbarState({
      bold: queryActive("bold"),
      italic: queryActive("italic"),
      block: queryBlock(),
    });
  }, []);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    let html = el.innerHTML;
    if (html === EMPTY_HTML || html === "<br>" || html === "<p></p>") html = "";
    lastEmittedRef.current = html; // must precede onChange — see the effect above
    setIsEmpty(!html);
    onChange(html);
  }, [onChange]);

  /* Track formatting state, but only while the editor holds focus, otherwise
     selections elsewhere on the page cause pointless re-renders. */
  useEffect(() => {
    const handleSelectionChange = () => {
      const el = editorRef.current;
      if (!el || !el.contains(document.activeElement)) return;
      refreshToolbar();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [refreshToolbar]);

  const handleCommand = useCallback(
    (command: EditorCommand) => {
      if (disabled) return;
      editorRef.current?.focus();
      runCommand(command);
      /* execCommand does not reliably fire `input`, so emit explicitly. */
      emit();
      refreshToolbar();
    },
    [disabled, emit, refreshToolbar],
  );

  /* Force plain text on paste. Pasting from Word or a web page is by far the
     largest source of junk markup, and the only realistic injection vector. */
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      emit();
    },
    [emit],
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    /* Dropped content bypasses the paste handler entirely. */
    event.preventDefault();
  }, []);

  const openLinkPopover = useCallback(() => {
    if (disabled) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setLinkError("Select the text you want to turn into a link first.");
      setIsLinkOpen(true);
      savedRangeRef.current = null;
      return;
    }
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    setLinkDraft("https://");
    setLinkError(null);
    setIsLinkOpen(true);
  }, [disabled]);

  const applyLink = useCallback(() => {
    const url = linkDraft.trim();
    const range = savedRangeRef.current;
    const el = editorRef.current;

    if (!range) {
      setLinkError("Select the text you want to turn into a link first.");
      return;
    }
    if (!isSafeUrl(url) || url === "https://") {
      setLinkError("Enter a valid https://, mailto: or /page URL.");
      return;
    }
    if (!el) return;

    el.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range); // restore the exact selection execCommand needs

    document.execCommand("createLink", false, url);

    /* execCommand cannot set attributes, so harden anchors afterwards. */
    el.querySelectorAll("a[href]").forEach((anchor) => {
      anchor.setAttribute("rel", "noopener noreferrer");
      if (/^https?:\/\//i.test(anchor.getAttribute("href") ?? "")) {
        anchor.setAttribute("target", "_blank");
      }
    });

    savedRangeRef.current = null;
    setIsLinkOpen(false);
    setLinkError(null);
    emit();
  }, [linkDraft, emit]);

  const editorId = "rich-text-editor";

  return (
    <div className="space-y-1.5">
      <span
        id={`${editorId}-label`}
        className="block text-xs font-bold uppercase tracking-wider text-gold-200/60"
      >
        {label}
      </span>

      <div
        className={`overflow-hidden rounded-xl border bg-navy-950 shadow-inner transition duration-300 ${
          error ? "border-rose-500/50" : "border-gold-300/20"
        }`}
      >
        <EditorToolbar
          state={toolbarState}
          disabled={disabled}
          onCommand={handleCommand}
          onRequestLink={openLinkPopover}
        />

        {isLinkOpen && (
          <div className="flex flex-wrap items-center gap-2 border-b border-gold-300/10 bg-navy-900/60 px-3 py-2">
            <label htmlFor={`${editorId}-link`} className="sr-only">
              Link URL
            </label>
            <input
              id={`${editorId}-link`}
              type="url"
              value={linkDraft}
              autoFocus
              onChange={(event) => {
                setLinkDraft(event.target.value);
                setLinkError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
                if (event.key === "Escape") setIsLinkOpen(false);
              }}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-lg border border-gold-300/20 bg-navy-950 px-3 py-1.5 text-xs text-gold-100 outline-none transition focus:border-gold-300/40"
            />
            <button
              type="button"
              onClick={applyLink}
              aria-label="Apply link"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-DEFAULT/15 text-gold-DEFAULT transition hover:bg-gold-DEFAULT/25 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsLinkOpen(false)}
              aria-label="Cancel link"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gold-200/60 transition hover:bg-gold-300/10 hover:text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-300/50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {linkError && (
              <p className="w-full text-[11px] text-rose-400">{linkError}</p>
            )}
          </div>
        )}

        <div className="relative">
          {isEmpty && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-4 text-sm text-gold-100/25"
            >
              {placeholder}
            </span>
          )}
          <div
            ref={editorRef}
            id={editorId}
            role="textbox"
            aria-multiline="true"
            aria-labelledby={`${editorId}-label`}
            aria-describedby={describedById}
            aria-invalid={Boolean(error)}
            contentEditable={!disabled}
            suppressContentEditableWarning
            spellCheck
            onInput={emit}
            onBlur={emit}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onKeyUp={refreshToolbar}
            onMouseUp={refreshToolbar}
            className="gg-editor min-h-[320px] max-h-[560px] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-gold-100/90 outline-none focus:ring-0"
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
