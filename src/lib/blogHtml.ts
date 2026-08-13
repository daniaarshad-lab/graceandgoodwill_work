/**
 * HTML handling for blog article content.
 *
 * IMPORTANT — this is defence in depth, NOT a security boundary. Article HTML
 * is authored only by authenticated admins, and anyone holding an admin token
 * could POST arbitrary HTML straight to the API regardless of what this file
 * does. The authoritative sanitisation belongs on the server; see the backend
 * handoff notes. What lives here is a proportionate client-side guard that
 * costs no dependencies.
 *
 * Two functions exist because `DOMParser` is unavailable in the Next.js server
 * runtime and articles render on the server:
 *   - sanitizeEditorHtml : strong allowlist parse, browser only, run on SAVE
 *   - stripDangerousHtml : weak isomorphic regex, run on RENDER
 */

const DANGEROUS_TAGS =
  /<\s*\/?\s*(script|iframe|object|embed|link|meta|style|form|input|textarea|button|svg|math|base)\b[^>]*>/gi;
const EVENT_ATTRS = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS =
  /\b(href|src)\s*=\s*(?:"\s*(?:javascript|data|vbscript):[^"]*"|'\s*(?:javascript|data|vbscript):[^']*')/gi;

/** Isomorphic. Regex cannot truly parse HTML — treat this as a backstop only. */
export function stripDangerousHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, '$1="#"');
}

export function isSafeUrl(url: string): boolean {
  const value = url.trim().toLowerCase();
  return (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("/") ||
    value.startsWith("mailto:") ||
    value.startsWith("#")
  );
}

/* SPAN and DIV are deliberately absent — they get unwrapped, which strips
   browser cruft while keeping the text. */
const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "H2",
  "H3",
  "H4",
  "BLOCKQUOTE",
  "UL",
  "OL",
  "LI",
  "A",
  "CODE",
  "PRE",
  "HR",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  A: ["href", "target", "rel"],
};

/** Browser-only allowlist sanitiser. Call before persisting content. */
export function sanitizeEditorHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return stripDangerousHtml(html);
  }

  const doc = new DOMParser().parseFromString(
    `<div id="gg-root">${html}</div>`,
    "text/html",
  );
  const root = doc.getElementById("gg-root");
  if (!root) return "";

  const walk = (parent: Element) => {
    Array.from(parent.children).forEach((child) => {
      walk(child);

      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...Array.from(child.childNodes));
        return;
      }

      const allowed = ALLOWED_ATTRS[child.tagName] ?? [];
      Array.from(child.attributes).forEach((attr) => {
        if (!allowed.includes(attr.name.toLowerCase())) {
          child.removeAttribute(attr.name);
        }
      });

      if (child.tagName === "A") {
        const href = child.getAttribute("href") ?? "";
        if (!isSafeUrl(href)) child.setAttribute("href", "#");
        child.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  walk(root);
  return root.innerHTML;
}

/** Plain-text projection of article HTML, used for reading-time estimates. */
export function htmlToPlainText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
