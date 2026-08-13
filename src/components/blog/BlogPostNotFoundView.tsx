import React from "react";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

/**
 * Shared "article not found" panel. Used by the route's not-found.tsx and by
 * MockPostFallback, so the two cannot drift apart.
 */
export default function BlogPostNotFoundView() {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-300/15 bg-gold-DEFAULT/5">
        <FileQuestion className="h-7 w-7 text-gold-300/70" aria-hidden="true" />
      </div>

      <h1 className="font-serif text-2xl font-medium text-gold-50 sm:text-3xl">
        We could not find that article
      </h1>

      <p className="mx-auto mt-4 text-sm leading-relaxed text-gold-200/70">
        It may have been moved, or the link may be incomplete. Our other
        guidance is all still available.
      </p>

      <Link
        href="/blog"
        prefetch={false}
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-gold-300/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Blog
      </Link>
    </div>
  );
}
