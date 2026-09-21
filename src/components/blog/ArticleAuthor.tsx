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
    <aside className="relative overflow-hidden group inline-flex items-center gap-5 rounded-full border border-gold-300/15 bg-white/5 pr-8 pl-3 py-3 backdrop-blur-md shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-gold-300/40 hover:shadow-[0_10px_40px_rgba(212,175,122,0.15)]">
      <div className="relative z-10 flex h-14 w-14 shrink-0 overflow-hidden items-center justify-center rounded-full border-2 border-gold-400/40 bg-navy-950 shadow-lg transition-all duration-500 group-hover:border-gold-300/80 group-hover:shadow-[0_0_15px_rgba(212,175,122,0.4)]">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={96}
            height={96}
            quality={100}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : author.name === "Aurea Neto" ? (
          <Image
            src={authorThumbnail}
            alt={author.name}
            width={96}
            height={96}
            quality={100}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <UserRound className="h-5 w-5 text-gold" aria-hidden="true" />
        )}
      </div>
      <div className="relative z-10 text-left flex flex-col justify-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold-300/70 mb-0.5 transition-colors duration-500 group-hover:text-gold-200/90">
          Written by
        </p>
        <p className="font-serif text-[17px] leading-tight text-white drop-shadow-sm transition-colors duration-500 group-hover:text-gold-50">{author.name}</p>
        <p className="text-[11px] font-medium tracking-wider text-white/60 mt-0.5 transition-colors duration-500 group-hover:text-white/80">{author.role}</p>
      </div>
      
      {/* Crystal shine effect */}
      <div className="absolute top-0 -left-[100%] h-full w-[40%] -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-[800ms] ease-in-out group-hover:left-[150%] z-20 pointer-events-none" />
    </aside>
  );
}
