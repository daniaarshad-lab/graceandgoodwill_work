import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface BlogBreadcrumbsProps {
  items: Crumb[];
}

export default function BlogBreadcrumbs({ items }: BlogBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200/45 sm:text-[11px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  prefetch={false}
                  className="rounded-sm transition-colors hover:text-gold-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-gold-300/80" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="h-3 w-3 text-gold-200/25"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
