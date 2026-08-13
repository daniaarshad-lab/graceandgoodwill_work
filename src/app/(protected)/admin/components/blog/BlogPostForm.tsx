"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ExternalLink, Info } from "lucide-react";

import Button from "@/components/Button";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import BlogImageField from "./BlogImageField";
import BlogSeoFields from "./BlogSeoFields";
import { blogCategories } from "@/data/blogCategories";
import {
  slugify,
  validateBlogPost,
  type BlogFormErrors,
} from "@/lib/blogValidation";
import { blogService, isBlogMockMode } from "@/services/blog/blog.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import type { BlogPost, CreateBlogPostPayload } from "@/types/blog.types";

interface BlogPostFormProps {
  /** Absent in create mode. */
  post?: BlogPost;
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  categorySlug: string;
  tagsInput: string;
  authorName: string;
  authorRole: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
}

const emptyState: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  featuredImageAlt: "",
  categorySlug: blogCategories[0]?.slug ?? "",
  tagsInput: "",
  authorName: "",
  authorRole: "",
  seoTitle: "",
  seoDescription: "",
  isFeatured: false,
};

function toFormState(post: BlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImageUrl: post.featuredImageUrl,
    featuredImageAlt: post.featuredImageAlt,
    categorySlug: post.categorySlug,
    tagsInput: post.tags.join(", "),
    authorName: post.author.name,
    authorRole: post.author.role,
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    isFeatured: post.isFeatured ?? false,
  };
}

const inputClass = (hasError?: string) =>
  `w-full rounded-xl border ${
    hasError
      ? "border-rose-500/50 focus:ring-rose-500/50"
      : "border-gold-300/20 focus:ring-gold-DEFAULT"
  } bg-navy-950 px-4 py-3 text-sm text-gold-100 outline-none transition duration-300 focus:ring-2 shadow-inner`;

const labelClass = "mb-1.5 block text-xs font-semibold text-gold-200/70";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-400"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

/**
 * One form serves both Create and Edit — the only difference is whether a
 * `post` prop was supplied, which decides the initial state and whether submit
 * calls createPost or updatePost.
 */
export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(post);

  const [form, setForm] = useState<FormState>(
    post ? toFormState(post) : emptyState,
  );
  const [errors, setErrors] = useState<BlogFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  /* Once the admin edits the slug by hand, stop deriving it from the title. */
  const [slugTouched, setSlugTouched] = useState(isEditing);

  useEffect(() => {
    if (post) setForm(toFormState(post));
  }, [post]);

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setForm((previous) => ({
        ...previous,
        title: value,
        slug: slugTouched ? previous.slug : slugify(value),
      }));
      setErrors((previous) => ({
        ...previous,
        title: undefined,
        slug: undefined,
      }));
    },
    [slugTouched],
  );

  const tags = useMemo(
    () =>
      form.tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tagsInput],
  );

  const buildPayload = useCallback(
    (status: "DRAFT" | "PUBLISHED"): CreateBlogPostPayload => ({
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content,
      featuredImageUrl: form.featuredImageUrl.trim(),
      featuredImageAlt: form.featuredImageAlt.trim(),
      categorySlug: form.categorySlug,
      tags,
      status,
      author: {
        name: form.authorName.trim(),
        role: form.authorRole.trim() || "Grace & Goodwill",
      },
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      isFeatured: form.isFeatured,
    }),
    [form, tags],
  );

  const submit = useCallback(
    async (status: "DRAFT" | "PUBLISHED") => {
      const payload = buildPayload(status);
      const nextErrors = validateBlogPost(payload);

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        showErrorToast(
          "Please fix the highlighted fields",
          "Some required information is missing or invalid.",
        );
        return;
      }

      setErrors({});
      setIsSaving(true);
      try {
        if (isEditing && post) {
          await blogService.updatePost(post.id, payload);
          showSuccessToast(
            status === "PUBLISHED" ? "Post published" : "Draft saved",
            `"${payload.title}" has been updated.`,
          );
        } else {
          await blogService.createPost(payload);
          showSuccessToast(
            status === "PUBLISHED" ? "Post published" : "Draft saved",
            `"${payload.title}" has been created.`,
          );
        }
        router.push("/admin?tab=blog");
      } catch (error) {
        showErrorToast(
          "Could not save the post",
          error instanceof Error ? error.message : "Please try again.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [buildPayload, isEditing, post, router],
  );

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div className="min-w-0">
          <Link
            href="/admin?tab=blog"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-200/60 transition hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Blog Posts
          </Link>
          <h1 className="text-xl font-bold text-gold-200">
            {isEditing ? "Edit Blog Post" : "Create Blog Post"}
          </h1>
          <p className="text-xs text-gold-100/50">
            {isEditing
              ? "Update the article, then save it as a draft or publish it."
              : "Write the article, then save it as a draft or publish it straight away."}
          </p>
        </div>

        {isEditing && post?.status === "PUBLISHED" && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gold-300/20 px-4 py-2 text-xs font-bold text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
          >
            View live
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>

      {isBlogMockMode && (
        <p className="flex items-start gap-2 rounded-xl border border-gold-300/10 bg-navy-900/40 px-4 py-3 text-xs text-gold-100/55">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300/70" />
          Blog content is currently stored in this browser only. It will move to
          the server once the backend endpoints are connected.
        </p>
      )}

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit("PUBLISHED");
        }}
        className="grid gap-6 lg:grid-cols-[1fr_320px]"
      >
        {/* ── Main column ───────────────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            <label htmlFor="blog-title" className={labelClass}>
              Title
            </label>
            <input
              id="blog-title"
              type="text"
              value={form.title}
              disabled={isSaving}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="How to Choose the Right Live-In Carer"
              className={inputClass(errors.title)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "blog-title-error" : undefined}
            />
            <FieldError id="blog-title-error" message={errors.title} />
          </div>

          <div>
            <label htmlFor="blog-slug" className={labelClass}>
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs text-gold-100/35">/blog/</span>
              <input
                id="blog-slug"
                type="text"
                value={form.slug}
                disabled={isSaving}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug", event.target.value);
                }}
                placeholder="how-to-choose-the-right-live-in-carer"
                className={inputClass(errors.slug)}
                aria-invalid={Boolean(errors.slug)}
                aria-describedby={errors.slug ? "blog-slug-error" : undefined}
              />
            </div>
            <FieldError id="blog-slug-error" message={errors.slug} />
          </div>

          <div>
            <label htmlFor="blog-excerpt" className={labelClass}>
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              rows={3}
              value={form.excerpt}
              disabled={isSaving}
              onChange={(event) => setField("excerpt", event.target.value)}
              placeholder="A short summary shown on the blog listing and in search results."
              className={`${inputClass(errors.excerpt)} resize-none`}
              aria-invalid={Boolean(errors.excerpt)}
              aria-describedby={
                errors.excerpt ? "blog-excerpt-error" : undefined
              }
            />
            <FieldError id="blog-excerpt-error" message={errors.excerpt} />
          </div>

          <RichTextEditor
            label="Article content"
            value={form.content}
            disabled={isSaving}
            error={errors.content}
            describedById={errors.content ? "blog-content-error" : undefined}
            onChange={(html) => {
              setForm((previous) => ({ ...previous, content: html }));
              setErrors((previous) => ({ ...previous, content: undefined }));
            }}
          />

          <BlogImageField
            url={form.featuredImageUrl}
            alt={form.featuredImageAlt}
            disabled={isSaving}
            urlError={errors.featuredImageUrl}
            altError={errors.featuredImageAlt}
            onUrlChange={(value) => {
              setField("featuredImageUrl", value);
              setErrors((previous) => ({
                ...previous,
                featuredImageUrl: undefined,
              }));
            }}
            onAltChange={(value) => {
              setField("featuredImageAlt", value);
              setErrors((previous) => ({
                ...previous,
                featuredImageAlt: undefined,
              }));
            }}
          />

          <BlogSeoFields
            slug={form.slug}
            seoTitle={form.seoTitle}
            seoDescription={form.seoDescription}
            fallbackTitle={form.title}
            fallbackDescription={form.excerpt}
            disabled={isSaving}
            seoDescriptionError={errors.seoDescription}
            onSeoTitleChange={(value) => setField("seoTitle", value)}
            onSeoDescriptionChange={(value) => {
              setField("seoDescription", value);
              setErrors((previous) => ({
                ...previous,
                seoDescription: undefined,
              }));
            }}
          />
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold-200/60">
              Publishing
            </h2>

            <div>
              <label htmlFor="blog-category" className={labelClass}>
                Category
              </label>
              <select
                id="blog-category"
                value={form.categorySlug}
                disabled={isSaving}
                onChange={(event) =>
                  setField("categorySlug", event.target.value)
                }
                className={`${inputClass(errors.categorySlug)} cursor-pointer`}
                aria-invalid={Boolean(errors.categorySlug)}
              >
                {blogCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
              <FieldError
                id="blog-category-error"
                message={errors.categorySlug}
              />
            </div>

            <div>
              <label htmlFor="blog-tags" className={labelClass}>
                Tags{" "}
                <span className="font-normal text-gold-100/35">
                  (comma separated)
                </span>
              </label>
              <input
                id="blog-tags"
                type="text"
                value={form.tagsInput}
                disabled={isSaving}
                onChange={(event) => setField("tagsInput", event.target.value)}
                placeholder="live-in care, funding"
                className={inputClass()}
              />
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gold-300/12 bg-navy-950 px-2.5 py-0.5 text-[10px] text-gold-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="blog-author" className={labelClass}>
                Author
              </label>
              <input
                id="blog-author"
                type="text"
                value={form.authorName}
                disabled={isSaving}
                onChange={(event) => {
                  setField("authorName", event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    authorName: undefined,
                  }));
                }}
                placeholder="Eleanor Whitfield"
                className={inputClass(errors.authorName)}
                aria-invalid={Boolean(errors.authorName)}
                aria-describedby={
                  errors.authorName ? "blog-author-error" : undefined
                }
              />
              <FieldError id="blog-author-error" message={errors.authorName} />
            </div>

            <div>
              <label htmlFor="blog-author-role" className={labelClass}>
                Author role
              </label>
              <input
                id="blog-author-role"
                type="text"
                value={form.authorRole}
                disabled={isSaving}
                onChange={(event) => setField("authorRole", event.target.value)}
                placeholder="Head of Care Standards"
                className={inputClass()}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold-300/10 bg-navy-950 p-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                disabled={isSaving}
                onChange={(event) =>
                  setField("isFeatured", event.target.checked)
                }
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#b59469]"
              />
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-gold-200">
                  Feature on the blog homepage
                </span>
                <span className="mt-0.5 block text-[11px] text-gold-100/45">
                  Shown in the large card at the top of /blog.
                </span>
              </span>
            </label>
          </div>

          <div className="space-y-3 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-5">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Publish"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled={isSaving}
              onClick={() => submit("DRAFT")}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              variant="ghost-gold"
              size="md"
              fullWidth
              disabled={isSaving}
              onClick={() => router.push("/admin?tab=blog")}
            >
              Cancel
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}
