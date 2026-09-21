import React from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";

import type { BlogAuthor } from "@/types/blog.types";
import authorThumbnail from "@/assets/blog/blog-thumnail.jpeg";

interface ArticleAuthorProps {
  author: BlogAuthor;
}

export default function ArticleAuthor({ author }: ArticleAuthorProps) {
  return (
    <aside className="mt-12 flex items-center gap-4 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex h-12 w-12 shrink-0 overflow-hidden items-center justify-center rounded-full border border-gold/40 bg-navy-950">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={96}
            height={96}
            quality={100}
            className="h-full w-full object-cover"
          />
        ) : author.name === "Aurea Neto" ? (
          <Image
            src={authorThumbnail}
            alt={author.name}
            width={96}
            height={96}
            quality={100}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="h-5 w-5 text-gold" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200/40">
          Written by
        </p>
        <p className="mt-1 font-serif text-base text-gold-50">{author.name}</p>
        <p className="text-xs text-gold-200/60">{author.role}</p>
      </div>
    </aside>
  );
}
