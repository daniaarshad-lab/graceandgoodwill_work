import React from "react";
import type { Metadata } from "next";

import BlogHero from "@/components/blog/BlogHero";
import BlogListClient from "@/components/blog/BlogListClient";
import FeaturedPostCard from "@/components/blog/FeaturedPostCard";
import { blogService } from "@/services/blog/blog.service";

export const metadata: Metadata = {
  title: "Insights & Care Guides | Grace & Goodwill",
  description:
    "Practical guidance on live-in care, choosing a carer, funding, and supporting someone well at home.",
  /* The root layout pins canonical to the homepage, so every page must override it. */
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: "Grace & Goodwill",
    title: "Insights & Care Guides | Grace & Goodwill",
    description:
      "Practical guidance on live-in care, choosing a carer, funding, and supporting someone well at home.",
  },
};

const PAGE_SIZE = 9;

interface BlogIndexPageProps {
  searchParams: Promise<{ category?: string }>;
}

/**
 * Server component. The first page of articles is rendered into the HTML, so
 * the listing is fully indexable; only the search/filter/sort controls hydrate.
 */
export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const [response, categories] = await Promise.all([
    blogService.listPosts({
      status: "PUBLISHED",
      page: 1,
      limit: PAGE_SIZE,
      category: activeCategory,
      sort: "newest",
    }),
    blogService.listCategories(),
  ]);

  const featured =
    activeCategory === "all"
      ? (response.items.find((post) => post.isFeatured) ?? null)
      : null;

  /* Keep the featured article out of the grid so it is not shown twice. */
  const gridResponse = featured
    ? {
        ...response,
        items: response.items.filter((post) => post.id !== featured.id),
      }
    : response;

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
        {featured && <FeaturedPostCard post={featured} />}
        <BlogListClient
          initialResponse={gridResponse}
          categories={categories}
          initialCategory={activeCategory}
          pageSize={PAGE_SIZE}
        />
      </div>
    </main>
  );
}
