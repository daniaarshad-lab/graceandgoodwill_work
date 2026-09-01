import React from "react";
import Image from "next/image";
import Link from "next/link";

import { BlogPost } from "@/types/blog.types";

interface BlogCardProps {
  post: BlogPost;
  /** Sizes hint for next/image; defaults to the 3-column listing grid. */
  sizes?: string;
  priority?: boolean;
}

export default function BlogCard({
  post,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: BlogCardProps) {
  return (
    <article className="group relative flex flex-col h-full bg-[#1A2639] shadow-sm hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1.5 hover:border-gold-300/30 transition-all duration-500 ease-out rounded-xl overflow-hidden border border-[#223047]">
      <div className="relative aspect-[1.5] w-full overflow-hidden bg-navy-950">
        <Image
          src={post.featuredImageUrl}
          alt={post.featuredImageAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6 overflow-hidden z-0">
        {/* Subtle decorative wave matching the elegant dark theme */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[70%] text-[#223047] pointer-events-none -z-10"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            fill="currentColor"
            d="M0,40 C40,70 60,10 100,40 L100,100 L0,100 Z"
          />
        </svg>

        <h3 className="font-serif text-[17px] sm:text-[18px] font-normal leading-snug text-gold-50 mb-5 group-hover:text-gold-200 transition-colors line-clamp-3 capitalize">
          <Link
            href={`/blog/${post.slug}`}
            prefetch={false}
            className="after:absolute after:inset-0 after:z-10 focus:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <div className="mt-auto">
          <span className="relative text-[14px] text-gold-200 pb-0.5 transition-colors duration-300 group-hover:text-gold-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-left after:bg-gold-200/50 after:transition-transform after:duration-300 group-hover:after:scale-x-0">
            Read Post
          </span>
        </div>
      </div>
    </article>
  );
}
