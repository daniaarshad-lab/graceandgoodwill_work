import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { getCategoryLabel } from "@/data/blogCategories";
import { formatBlogDate } from "@/lib/blogValidation";
import type { BlogPost } from "@/types/blog.types";

interface BlogCardProps {
  post: BlogPost;
  /** Sizes hint for next/image; defaults to the 3-column listing grid. */
  sizes?: string;
  priority?: boolean;
}

/**
 * One real anchor per card: the title link is stretched across the whole card
 * so the entire surface is clickable, without creating duplicate tab stops or
 * nesting interactive elements.
 */
export default function BlogCard({
  post,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: BlogCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-gold-300/10 bg-navy-900/40 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-navy-900/60 focus-within:border-gold-300/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={post.featuredImageUrl}
          alt={post.featuredImageAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent"
        />
        <span className="absolute left-4 top-4 rounded-full border border-gold-400/20 bg-navy-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur-md">
          {getCategoryLabel(post.categorySlug)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gold-200/50">
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatBlogDate(post.publishedAt ?? post.createdAt)}
          </time>
          <span aria-hidden="true" className="text-gold-200/25">
            •
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        <h3 className="font-serif text-lg font-medium leading-snug text-gold-50 transition-colors group-hover:text-gold-100">
          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
          >
            {post.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-gold-200/70">
          {post.excerpt}
        </p>

        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 transition-colors group-hover:text-gold-300"
        >
          Read article
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
