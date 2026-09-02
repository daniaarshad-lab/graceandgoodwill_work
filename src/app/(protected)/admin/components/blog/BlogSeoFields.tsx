"use client";

import React from "react";
import { AlertCircle, Globe } from "lucide-react";

interface BlogSeoFieldsProps {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  fallbackTitle: string;
  fallbackDescription: string;
  disabled?: boolean;
  seoDescriptionError?: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
}

const MAX_DESCRIPTION = 160;

/**
 * Search-engine fields, shown with a live preview so the admin can see what a
 * result will actually look like. Both fields fall back to the post's own
 * title/excerpt when left blank, which is what generateMetadata does.
 */
export default function BlogSeoFields({
  slug,
  seoTitle,
  seoDescription,
  fallbackTitle,
  fallbackDescription,
  disabled,
  seoDescriptionError,
  onSeoTitleChange,
  onSeoDescriptionChange,
}: BlogSeoFieldsProps) {
  const previewTitle = seoTitle.trim() || fallbackTitle || "Untitled article";
  const previewDescription =
    seoDescription.trim() ||
    fallbackDescription ||
    "Add an excerpt or meta description.";
  const remaining = MAX_DESCRIPTION - seoDescription.length;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gold-300/70" aria-hidden="true" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
          Search engine listing
        </h3>
      </div>

      <div>
        <label
          htmlFor="blog-seo-title"
          className="mb-1.5 block text-xs font-semibold text-gold-200/70"
        >
          Meta title{" "}
          <span className="font-normal text-gold-100/35">
            (optional — defaults to the post title)
          </span>
        </label>
        <input
          id="blog-seo-title"
          type="text"
          value={seoTitle}
          disabled={disabled}
          onChange={(event) => onSeoTitleChange(event.target.value)}
          placeholder={fallbackTitle || "Post title"}
          className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-4 py-3 text-sm text-gold-100 shadow-inner outline-none transition duration-300 focus:ring-2 focus:ring-gold-DEFAULT"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="blog-seo-description"
            className="block text-xs font-semibold text-gold-200/70"
          >
            Meta description
          </label>
          <span
            className={`text-[11px] ${
              remaining < 0 ? "text-rose-400" : "text-gold-100/35"
            }`}
          >
            {remaining} characters left
          </span>
        </div>
        <textarea
          id="blog-seo-description"
          rows={3}
          value={seoDescription}
          disabled={disabled}
          onChange={(event) => onSeoDescriptionChange(event.target.value)}
          placeholder={fallbackDescription || "Summarise the article"}
          aria-invalid={Boolean(seoDescriptionError)}
          aria-describedby={
            seoDescriptionError ? "blog-seo-description-error" : undefined
          }
          className={`w-full resize-none rounded-xl border ${
            seoDescriptionError
              ? "border-rose-500/50 focus:ring-rose-500/50"
              : "border-gold-300/20 focus:ring-gold-DEFAULT"
          } bg-navy-950 px-4 py-3 text-sm text-gold-100 shadow-inner outline-none transition duration-300 focus:ring-2`}
        />
        {seoDescriptionError && (
          <p
            id="blog-seo-description-error"
            className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {seoDescriptionError}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gold-300/10 bg-navy-950 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gold-200/40">
          Preview
        </p>
        <p className="truncate text-sm text-gold-200">
          {previewTitle} | Grace &amp; Goodwill
        </p>
        <p className="mt-0.5 truncate text-[11px] text-emerald-400/70">
          graceandgoodwill.co.uk/blog/{slug || "your-post-slug"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-gold-100/50">
          {previewDescription}
        </p>
      </div>
    </section>
  );
}
