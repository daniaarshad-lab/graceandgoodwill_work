/**
 * Blog form validation and formatting helpers.
 * Follows the existing convention in src/lib/validation.ts: pure functions
 * returning `string | null`, plus a form-level aggregator returning an errors
 * object.
 */

import { htmlToPlainText } from "@/lib/blogHtml";
import type { CreateBlogPostPayload } from "@/types/blog.types";

const WORDS_PER_MINUTE = 220;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function estimateReadingTime(html: string): number {
  const words = htmlToPlainText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatBlogDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const validateBlogTitle = (value: string): string | null => {
  if (!value.trim()) return "Title is required";
  if (value.trim().length < 8) return "Title must be at least 8 characters";
  if (value.trim().length > 120) return "Title must be 120 characters or fewer";
  return null;
};

export const validateBlogSlug = (value: string): string | null => {
  if (!value.trim()) return "Slug is required";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim())) {
    return "Use lowercase letters, numbers and hyphens only";
  }
  if (value.trim().length > 80) return "Slug must be 80 characters or fewer";
  return null;
};

export const validateBlogExcerpt = (value: string): string | null => {
  if (!value.trim()) return "Excerpt is required";
  if (value.trim().length < 40) return "Excerpt must be at least 40 characters";
  if (value.trim().length > 240)
    return "Excerpt must be 240 characters or fewer";
  return null;
};

export const validateBlogContent = (html: string): string | null => {
  const words = htmlToPlainText(html).split(/\s+/).filter(Boolean).length;
  if (words === 0) return "Article content is required";
  if (words < 40) return "Article content must be at least 40 words";
  return null;
};

export const validateBlogCategory = (value: string): string | null =>
  value.trim() ? null : "Category is required";

export const validateBlogImageUrl = (value: string): string | null => {
  if (!value.trim()) return "Featured image is required";
  const ok =
    value.startsWith("/") ||
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("blob:");
  return ok ? null : "Enter a valid image URL or choose one from the library";
};

export const validateBlogAuthorName = (value: string): string | null =>
  value.trim() ? null : "Author name is required";

export const validateSeoDescription = (value: string): string | null =>
  value.length > 160
    ? "Meta description must be 160 characters or fewer"
    : null;

export interface BlogFormErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categorySlug?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  authorName?: string;
  seoDescription?: string;
}

export function validateBlogPost(
  payload: CreateBlogPostPayload,
): BlogFormErrors {
  const errors: BlogFormErrors = {};

  const title = validateBlogTitle(payload.title);
  if (title) errors.title = title;

  const slug = validateBlogSlug(payload.slug);
  if (slug) errors.slug = slug;

  const excerpt = validateBlogExcerpt(payload.excerpt);
  if (excerpt) errors.excerpt = excerpt;

  const content = validateBlogContent(payload.content);
  if (content) errors.content = content;

  const category = validateBlogCategory(payload.categorySlug);
  if (category) errors.categorySlug = category;

  const image = validateBlogImageUrl(payload.featuredImageUrl);
  if (image) errors.featuredImageUrl = image;

  if (!payload.featuredImageAlt.trim()) {
    errors.featuredImageAlt = "Image description is required for accessibility";
  }

  const author = validateBlogAuthorName(payload.author.name);
  if (author) errors.authorName = author;

  const seo = validateSeoDescription(payload.seoDescription ?? "");
  if (seo) errors.seoDescription = seo;

  return errors;
}
