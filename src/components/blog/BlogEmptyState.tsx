import React from "react";
import { SearchX } from "lucide-react";

interface BlogEmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
}

export default function BlogEmptyState({
  title,
  message,
  action,
}: BlogEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-gold-300/10 bg-navy-900/30 px-6 py-16 text-center backdrop-blur-sm sm:py-20">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/15 bg-gold-DEFAULT/5">
        <SearchX className="h-6 w-6 text-gold-300/70" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-xl font-medium text-gold-50">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gold-200/60">
        {message}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
