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
      className="prose prose-invert prose-gold max-w-none"
      dangerouslySetInnerHTML={{ __html: stripDangerousHtml(html) }}
    />
  );
}
