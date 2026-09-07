"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import Pagination from "@/app/(protected)/admin/components/shared/Pagination";
import BlogCard from "./BlogCard";
import BlogEmptyState from "./BlogEmptyState";
import { blogService, isBlogMockMode } from "@/services/blog/blog.service";
import type {
  BlogCategory,
  BlogListResponse,
  BlogPost,
  BlogSortOption,
} from "@/types/blog.types";

interface BlogListClientProps {
  /** Server-rendered first page. Present in the HTML source before JS runs. */
  initialResponse: BlogListResponse;
  categories: BlogCategory[];
  initialCategory: string;
  initialSearch?: string;
  pageSize: number;
}

const SORT_OPTIONS: { value: BlogSortOption; label: string }[] = [
  { value: "newest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "A–Z" },
];

export default function BlogListClient({
  initialResponse,
  categories,
  initialCategory,
  initialSearch = "",
  pageSize,
}: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || initialSearch;

  const [posts, setPosts] = useState<BlogPost[]>(initialResponse.items);
  const [page, setPage] = useState(initialResponse.page);
  const [totalPages, setTotalPages] = useState(initialResponse.totalPages);
  const [total, setTotal] = useState(initialResponse.total);

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<BlogSortOption>("newest");

  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Skip the first filter run: the server already gave us that exact page. */
  const isFirstRun = useRef(true);

  /**
   * MOCK MODE ONLY. Posts the admin created live in this browser's
   * localStorage, which the server could not see when it rendered this page.
   * This silently merges them in on mount — no spinner, so the server-rendered
   * list stays visible rather than flashing. Remove with the mock service.
   */
  useEffect(() => {
    if (!isBlogMockMode) return;
    let cancelled = false;

    blogService
      .listPosts({
        status: "PUBLISHED",
        page: 1,
        limit: pageSize,
        category: initialCategory,
        sort: "newest",
      })
      .then((response) => {
        if (cancelled) return;
        setPosts(response.items);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      })
      .catch(() => {
        /* Keep whatever the server rendered. */
      });

    return () => {
      cancelled = true;
    };
    /* Mount only — later changes are handled by the filter effect below. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep the category in the URL so a filtered view can be linked and crawled. */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (category && category !== "all") {
      url.searchParams.set("category", category);
    } else {
      url.searchParams.delete("category");
    }
    window.history.replaceState(null, "", url.toString());
  }, [category]);

  // Synchronize state when initialResponse changes (e.g. from server action like search)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setPosts(initialResponse.items);
    setPage(initialResponse.page);
    setTotalPages(initialResponse.totalPages);
    setTotal(initialResponse.total);
  }, [initialResponse]);

  // Handle client-side filtering and sorting ONLY if category or sort change on the client,
  // or if they are modified independent of the server component. Since search causes a server reload, 
  // we let the server component pass down the new initialResponse.
  useEffect(() => {
    // If it's just sorting/category change, we still do client-side fetch.
    if (isFirstRun.current) return;
    
    // We only want to run this if category or sort changes manually in the client,
    // not when initialResponse is fresh from a search.
    let cancelled = false;
    setIsFiltering(true);
    setError(null);

    blogService
      .listPosts({
        status: "PUBLISHED",
        page: 1,
        limit: pageSize,
        search,
        category,
        sort,
      })
      .then((response) => {
        if (cancelled) return;
        setPosts(response.items);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      })
      .catch(() => {
        if (!cancelled)
          setError("We could not load articles. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsFiltering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, sort, pageSize]); // intentionally omitting search to avoid double-fetch

  const goToPage = useCallback((newPage: number) => {
    setIsFiltering(true);
    setError(null);
    blogService
      .listPosts({
        status: "PUBLISHED",
        page: newPage,
        limit: pageSize,
        search,
        category,
        sort,
      })
      .then((response) => {
        setPosts(response.items);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setTotal(response.total);
        const heading = document.getElementById("blog-articles-heading");
        if (heading) {
          heading.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch(() => setError("We could not load articles. Please try again."))
      .finally(() => setIsFiltering(false));
  }, [pageSize, search, category, sort]);

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setError(null);
    blogService
      .listPosts({
        status: "PUBLISHED",
        page: page + 1,
        limit: pageSize,
        search,
        category,
        sort,
      })
      .then((response) => {
        setPosts((previous) => [...previous, ...response.items]);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      })
      .catch(() =>
        setError("We could not load more articles. Please try again."),
      )
      .finally(() => setIsLoadingMore(false));
  }, [page, pageSize, search, category, sort]);

  const clearFilters = useCallback(() => {
    setCategory("all");
    setSort("newest");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const hasActiveFilters = Boolean(search) || category !== "all";
  const hasMore = page < totalPages;

  return (
    <section aria-labelledby="blog-articles-heading">
      <h2 id="blog-articles-heading" className="sr-only">
        Articles
      </h2>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col sm:flex-row gap-8 sm:gap-16">
        {/* Sort by */}
        <div className="flex-1 max-w-[240px]">
          <label htmlFor="blog-sort" className="block text-sm text-gold-200/70 mb-1 font-serif">
            Sort by
          </label>
          <select
            id="blog-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as BlogSortOption)
            }
            className="w-full bg-transparent border-b border-gold-300/30 py-2 text-base text-gold-50 outline-none focus:border-gold-300 transition-colors cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FDF2D5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1em",
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-navy-900 text-gold-50">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by */}
        <div className="flex-1 max-w-[240px]">
          <label htmlFor="blog-filter" className="block text-sm text-gold-200/70 mb-1 font-serif">
            Filter by
          </label>
          <select
            id="blog-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full bg-transparent border-b border-gold-300/30 py-2 text-base text-gold-50 outline-none focus:border-gold-300 transition-colors cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FDF2D5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1em",
            }}
          >
            {[{ slug: "all", label: "All" }, ...categories].map((item) => (
              <option key={item.slug} value={item.slug} className="bg-navy-900 text-gold-50">
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gold-200/40" aria-live="polite">
        {isFiltering
          ? "Loading articles…"
          : `${total} ${total === 1 ? "article" : "articles"}`}
      </p>

      {/* ── Results ───────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {isFiltering ? (
        <div className="flex items-center justify-center py-20">
          <ThinSpinner size="md" />
          <span className="sr-only">Loading articles</span>
        </div>
      ) : posts.length === 0 ? (
        <BlogEmptyState
          title={hasActiveFilters ? "No matching articles" : "No articles yet"}
          message={
            hasActiveFilters
              ? "Try a different search term, or browse all articles."
              : "We are working on our first pieces. Please check back shortly."
          }
          action={
            hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                fullWidth={false}
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={index < 4} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <Button
                variant="outline"
                size="md"
                fullWidth={false}
                onClick={loadMore}
                disabled={isLoadingMore}
                className="min-w-[200px]"
              >
                {isLoadingMore ? "Loading…" : "Load more articles"}
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                onPageChange={goToPage}
              />
            </div>
          )}

        </>
      )}
    </section>
  );
}
