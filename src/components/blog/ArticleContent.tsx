import React from "react";

import { stripDangerousHtml } from "@/lib/blogHtml";

interface ArticleContentProps {
  html: string;
}

/**
 * Renders stored article HTML.
 *
 * `stripDangerousHtml` is a backstop only — content is authored by admins and
 * sanitised with a proper allowlist parser on save (browser), and must also be
 * sanitised server-side by the API once it exists. See src/lib/blogHtml.ts.
 */
export default function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      className="prose prose-invert prose-gold max-w-none prose-p:font-serif prose-headings:font-serif prose-headings:font-medium prose-headings:text-gold-50 prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-headings:tracking-wide prose-headings:capitalize prose-strong:underline prose-strong:decoration-[#d4af37]/60 prose-strong:underline-offset-[3px] prose-strong:decoration-2"
      dangerouslySetInnerHTML={{ __html: stripDangerousHtml(html) }}
    />
  );
}
