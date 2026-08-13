import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

import { getCategoryLabel } from "@/data/blogCategories";
import { formatBlogDate } from "@/lib/blogValidation";
import type { BlogPost } from "@/types/blog.types";

interface ArticleHeaderProps {
  post: BlogPost;
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="mb-10">
      <span className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
        {getCategoryLabel(post.categorySlug)}
      </span>

      <h1 className="mt-5 font-serif text-2xl font-medium leading-tight tracking-tight text-gold-50 sm:text-4xl lg:text-[2.75rem]">
        {post.title}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-gold-200/80">
        {post.excerpt}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gold-200/50">
        <span>By {post.author.name}</span>
        <span aria-hidden="true" className="text-gold-200/25">
          •
        </span>
        <time dateTime={post.publishedAt ?? post.createdAt}>
          Published {formatBlogDate(post.publishedAt ?? post.createdAt)}
        </time>
        <span aria-hidden="true" className="text-gold-200/25">
          •
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {post.readingTimeMinutes} min read
        </span>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold-400/20 bg-navy-950 p-2 shadow-2xl sm:p-3">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gold-400/10"
          />
        </div>
      </div>
    </header>
  );
}
