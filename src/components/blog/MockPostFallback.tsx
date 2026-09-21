"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ArticleContent from "./ArticleContent";
import ArticleHeader from "./ArticleHeader";
import BlogBreadcrumbs from "./BlogBreadcrumbs";
import BlogPostNotFound from "./BlogPostNotFoundView";
import RelatedPosts from "./RelatedPosts";
import { getCategoryLabel } from "@/data/blogCategories";
import { blogService } from "@/services/blog/blog.service";
import type { BlogPost } from "@/types/blog.types";

interface MockPostFallbackProps {
  slug: string;
}

/**
 * MOCK MODE ONLY — delete this component when the backend is connected.
 *
 * While the blog runs on mock data, posts created in the admin live in the
 * author's localStorage, which a server component cannot read. Without this
 * fallback, creating a post and then opening it on the public site would 404.
 *
 * The server has already rendered nothing for this slug and generateMetadata
 * has marked it noindex, so nothing here affects SEO. Once blogService points
 * at the real API, the detail page calls notFound() instead and this file goes.
 */
export default function MockPostFallback({ slug }: MockPostFallbackProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    blogService
      .getPostBySlug(slug)
      .then(async (found) => {
        if (cancelled) return;
        if (!found || found.status !== "PUBLISHED") {
          setPost(null);
          return;
        }
        setPost(found);
        const relatedPosts = await blogService.getRelatedPosts(slug, 3);
        if (!cancelled) setRelated(relatedPosts);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm text-gold-100/50">Loading article…</p>
      </div>
    );
  }

  if (!post) return <BlogPostNotFound />;

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <BlogBreadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: getCategoryLabel(post.categorySlug) },
          ]}
        />

        <ArticleHeader post={post} />
        <ArticleContent html={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200/40">
              Tags
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold-300/12 bg-navy-900/40 px-3 py-1 text-[11px] text-gold-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/blog"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl border border-gold-300/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <RelatedPosts posts={related} />
      </div>
    </>
  );
}
