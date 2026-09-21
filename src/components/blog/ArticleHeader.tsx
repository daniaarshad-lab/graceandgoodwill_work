import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import ArticleAuthor from "./ArticleAuthor";

import { getCategoryLabel } from "@/data/blogCategories";
import { formatBlogDate } from "@/lib/blogValidation";
import type { BlogPost } from "@/types/blog.types";

interface ArticleHeaderProps {
  post: BlogPost;
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <>
      <header className="relative bg-navy-900 text-white pt-24 pb-32 sm:pb-48 w-full px-4 sm:px-6 lg:px-8">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-navy-950">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[120px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
          <div className="page-strapline mb-2">
            {getCategoryLabel(post.categorySlug)}
          </div>

          <h1 className="mt-4 font-serif text-3xl font-medium leading-tight sm:text-4xl lg:text-[2.75rem] text-white capitalize">
            {post.title}
          </h1>

          <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-white/90">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/70">
            <time dateTime={post.publishedAt ?? post.createdAt}>
              Published {formatBlogDate(post.publishedAt ?? post.createdAt)}
            </time>
            <span aria-hidden="true" className="text-white/40">
              •
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <div className="mt-8">
            <ArticleAuthor author={post.author} />
          </div>
        </div>
      </header>

      <div className="relative z-20 -mt-24 sm:-mt-36 mb-16 mx-auto max-w-4xl">
        <div className="overflow-hidden shadow-2xl rounded-lg">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
