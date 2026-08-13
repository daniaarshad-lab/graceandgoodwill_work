"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

import Button from "@/components/Button";
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
  pageSize,
}: BlogListClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialResponse.items);
  const [page, setPage] = useState(initialResponse.page);
  const [totalPages, setTotalPages] = useState(initialResponse.totalPages);
  const [total, setTotal] = useState(initialResponse.total);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
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

  /* Debounce the search box so typing does not fire a request per keystroke. */
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

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
  }, [search, category, sort, pageSize]);

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
    setSearchInput("");
    setSearch("");
    setCategory("all");
    setSort("newest");
  }, []);

  const hasActiveFilters = Boolean(search) || category !== "all";
  const hasMore = page < totalPages;

  return (
    <section aria-labelledby="blog-articles-heading">
      <h2 id="blog-articles-heading" className="sr-only">
        Articles
      </h2>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-200/40"
              aria-hidden="true"
            />
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <input
              id="blog-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-xl border border-gold-300/15 bg-navy-900/50 py-2.5 pl-10 pr-10 text-sm text-gold-100 placeholder-gold-100/30 outline-none transition duration-200 focus:border-gold-300/40"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gold-200/40 transition hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="shrink-0">
            <label htmlFor="blog-sort" className="sr-only">
              Sort articles
            </label>
            <select
              id="blog-sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as BlogSortOption)
              }
              className="w-full cursor-pointer rounded-xl border border-gold-300/15 bg-navy-900/50 px-4 py-2.5 text-sm text-gold-200 outline-none transition duration-200 focus:border-gold-300/40 sm:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category filter — a real radiogroup rather than clickable divs. */}
        <div
          role="radiogroup"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          {[{ slug: "all", label: "All articles" }, ...categories].map(
            (item) => {
              const isActive = category === item.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setCategory(item.slug)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 ${
                    isActive
                      ? "border-gold-400/40 bg-gold-DEFAULT/10 text-gold-200"
                      : "border-gold-300/12 bg-navy-900/40 text-gold-200/55 hover:border-gold-300/30 hover:text-gold-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            },
          )}
        </div>

        <p className="text-xs text-gold-200/40" aria-live="polite">
          {isFiltering
            ? "Loading articles…"
            : `${total} ${total === 1 ? "article" : "articles"}`}
        </p>
      </div>

      {/* ── Results ───────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 text-center text-sm text-rose-400">
          {error}
        </div>
      )}

      {isFiltering ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            className="h-6 w-6 animate-spin text-gold-DEFAULT"
            aria-hidden="true"
          />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={index < 3} />
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
        </>
      )}
    </section>
  );
}
