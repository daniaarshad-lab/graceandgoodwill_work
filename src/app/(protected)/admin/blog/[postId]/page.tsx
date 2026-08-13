"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import BlogPostForm from "../../components/blog/BlogPostForm";
import { blogService } from "@/services/blog/blog.service";
import type { BlogPost } from "@/types/blog.types";

/**
 * Edit Post.
 *
 * React is 18.x here, so `React.use()` is unavailable and the `params` promise
 * prop only works in server components. Route params are read with useParams(),
 * matching src/app/(protected)/admin/clients/[id]/page.tsx.
 *
 * The post is fetched client-side because in mock mode it lives in
 * localStorage, which the server cannot read.
 */
export default function EditBlogPostPage() {
  const params = useParams<{ postId: string }>();
  const postId = params?.postId;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    blogService
      .getPostById(postId)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setError("We could not find that post. It may have been deleted.");
        } else {
          setPost(result);
        }
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Failed to load the post.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-8 text-gold-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {isLoading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
            <p className="text-sm font-semibold text-gold-100/60">
              Loading post…
            </p>
          </div>
        ) : error || !post ? (
          <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center">
            <AlertTriangle
              className="mx-auto h-8 w-8 text-rose-400"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-rose-400">
              {error ?? "Post not found"}
            </p>
            <Link
              href="/admin?tab=blog"
              className="inline-flex items-center gap-2 rounded-xl border border-gold-300/20 px-5 py-2.5 text-xs font-bold text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Blog Posts
            </Link>
          </div>
        ) : (
          <BlogPostForm post={post} />
        )}
      </div>
    </main>
  );
}
