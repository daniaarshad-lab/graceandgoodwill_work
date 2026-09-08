import React from "react";
import type { Metadata } from "next";

import BlogHero from "@/components/blog/BlogHero";
import BlogListClient from "@/components/blog/BlogListClient";
import { blogService } from "@/services/blog/blog.service";

export const metadata: Metadata = {
  title: "Insights & Care Guides | Grace & Goodwill",
  description:
    "Practical guidance on live-in care, choosing a carer, funding, and supporting someone well at home.",
  /* The root layout pins canonical to the homepage, so every page must override it. */
  alternates: { canonical: "https://graceandgoodwill.co.uk/blog" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/blog",
    siteName: "Grace & Goodwill",
    title: "Insights & Care Guides | Grace & Goodwill",
    description:
      "Practical guidance on live-in care, choosing a carer, funding, and supporting someone well at home.",
  },
};

const PAGE_SIZE = 8;

interface BlogIndexPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

/**
 * Server component. The first page of articles is rendered into the HTML, so
 * the listing is fully indexable; only the search/filter/sort controls hydrate.
 */
export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const { category, search } = await searchParams;
  const activeCategory = category ?? "all";
  const activeSearch = search ?? "";

  const [gridResponse, categories] = await Promise.all([
    blogService.listPosts({
      status: "PUBLISHED",
      page: 1,
      limit: PAGE_SIZE,
      category: activeCategory,
      search: activeSearch,
      sort: "newest",
    }),
    blogService.listCategories(),
  ]);

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 pb-16 sm:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[600px] rounded-full bg-gold-500/5 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 h-[450px] w-[600px] rounded-full bg-navy-800/30 blur-[130px]"
      />

      <BlogHero />

      <div className="container-wrapper relative mt-12">
        <BlogListClient
          initialResponse={gridResponse}
          categories={categories}
          initialCategory={activeCategory}
          initialSearch={activeSearch}
          pageSize={PAGE_SIZE}
        />
      </div>
    </main>
  );
}
