import React from "react";
import { UserRound } from "lucide-react";

import type { BlogAuthor } from "@/types/blog.types";

interface ArticleAuthorProps {
  author: BlogAuthor;
}

export default function ArticleAuthor({ author }: ArticleAuthorProps) {
  return (
    <aside className="mt-12 flex items-center gap-4 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-DEFAULT/40 bg-navy-950">
        <UserRound className="h-5 w-5 text-gold-DEFAULT" aria-hidden="true" />
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
