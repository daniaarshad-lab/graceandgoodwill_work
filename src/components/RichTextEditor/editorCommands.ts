/**
 * Formatting commands for RichTextEditor.
 *
 * ACCEPTED TRADE-OFF: `document.execCommand` is deprecated. It is also
 * implemented in every current browser, has no standardised replacement, and is
 * the only way to get rich-text editing with zero dependencies. The alternative
 * was a ~100kb editor library, which was explicitly ruled out. If this ever
 * needs replacing, the seam is this file plus RichTextEditor's `emit()`.
 */

export type EditorCommand =
  | "bold"
  | "italic"
  | "h2"
  | "h3"
  | "paragraph"
  | "blockquote"
  | "ul"
  | "ol"
  | "unlink"
  | "clear";

/**
 * `formatBlock` values are angle-bracketed because older Firefox and Safari
 * only accept that form; Chrome accepts both.
 */
export function runCommand(command: EditorCommand): void {
  switch (command) {
    case "bold":
      document.execCommand("bold");
      break;
    case "italic":
      document.execCommand("italic");
      break;
    case "h2":
      document.execCommand("formatBlock", false, "<h2>");
      break;
    case "h3":
      document.execCommand("formatBlock", false, "<h3>");
      break;
    case "paragraph":
      document.execCommand("formatBlock", false, "<p>");
      break;
    case "blockquote":
      document.execCommand("formatBlock", false, "<blockquote>");
      break;
    case "ul":
      document.execCommand("insertUnorderedList");
      break;
    case "ol":
      document.execCommand("insertOrderedList");
      break;
    case "unlink":
      document.execCommand("unlink");
      break;
    case "clear":
      document.execCommand("removeFormat");
      document.execCommand("formatBlock", false, "<p>");
      break;
  }
}

/** Configure the editing surface once, on mount. */
export function configureEditor(): void {
  try {
    /* Emit <b>/<i> rather than inline style attributes, which the sanitiser strips. */
    document.execCommand("styleWithCSS", false, "false");
    /* Enter produces <p> instead of <div>. */
    document.execCommand("defaultParagraphSeparator", false, "p");
  } catch {
    /* Older browsers reject these; formatting still works without them. */
  }
}

export function queryActive(command: string): boolean {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

export function queryBlock(): string {
  try {
    return (document.queryCommandValue("formatBlock") || "").toLowerCase();
  } catch {
    return "";
  }
}
