import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { getCategoryLabel } from "@/data/blogCategories";
import { formatBlogDate } from "@/lib/blogValidation";
import type { BlogPost } from "@/types/blog.types";

interface FeaturedPostCardProps {
  post: BlogPost;
}

/** Wide editorial treatment for the single featured article on page one. */
export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="group relative mb-12 overflow-hidden rounded-[32px] border border-gold-300/15 bg-navy-900/40 shadow-elegant backdrop-blur-md transition-all duration-300 hover:border-gold-300/30 sm:mb-16">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[380px]">
          <Image
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent lg:bg-gradient-to-r"
          />
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold-500/25 bg-gold-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
              Featured
            </span>
            <span className="text-[11px] uppercase tracking-widest text-gold-200/50">
              {getCategoryLabel(post.categorySlug)}
            </span>
          </div>

          <h2 className="font-serif text-xl font-medium leading-snug text-gold-50 sm:text-2xl lg:text-3xl">
            <Link
              href={`/blog/${post.slug}`}
              prefetch={false}
              className="rounded-sm after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
            >
              {post.title}
            </Link>
          </h2>

          <p className="text-sm leading-relaxed text-gold-200/75 sm:text-base">
            {post.excerpt}
          </p>

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

          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 transition-colors group-hover:text-gold-300"
          >
            Read article
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
