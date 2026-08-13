"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  EyeOff,
  FileText,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react";

import Button from "@/components/Button";
import Table, { type TableColumn } from "../shared/Table";
import StatusBadge from "../shared/StatusBadge";
import DeletePostDialog from "./DeletePostDialog";
import { blogCategories, getCategoryLabel } from "@/data/blogCategories";
import { formatBlogDate } from "@/lib/blogValidation";
import { blogService, isBlogMockMode } from "@/services/blog/blog.service";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import type {
  BlogListResponse,
  BlogPost,
  BlogSortOption,
  BlogStatus,
} from "@/types/blog.types";

const PAGE_SIZE = 10;

const STATUS_FILTERS: { value: BlogStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Drafts" },
  { value: "ARCHIVED", label: "Archived" },
];

const controlClass =
  "rounded-xl border border-gold-300/10 bg-navy-950 px-4 py-2 text-xs font-bold text-gold-200 outline-none transition duration-300 focus:border-gold-300/30 cursor-pointer";

/**
 * Blog list for the admin console.
 *
 * State is local (useState/useEffect) calling blogService directly — the same
 * approach InternalNotes.tsx uses. Redux here is reserved for server data and
 * the auth session, and blog list/filter state needs neither.
 */
export default function BlogPostsTab() {
  const [response, setResponse] = useState<BlogListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BlogStatus | "ALL">("ALL");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<BlogSortOption>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  /* Bumped after any mutation to force a refetch. */
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    blogService
      .listPosts({ page, limit: pageSize, search, status, category, sort })
      .then((result) => {
        if (!cancelled) setResponse(result);
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Failed to load blog posts.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, status, category, sort, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  const handleStatusToggle = useCallback(
    async (post: BlogPost) => {
      const nextStatus: BlogStatus =
        post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      setBusyId(post.id);
      try {
        await blogService.setPostStatus(post.id, nextStatus);
        showSuccessToast(
          nextStatus === "PUBLISHED" ? "Post published" : "Post unpublished",
          `"${post.title}" is now ${nextStatus.toLowerCase()}.`,
        );
        refresh();
      } catch (caught) {
        showErrorToast(
          "Could not update the post",
          caught instanceof Error ? caught.message : "Please try again.",
        );
      } finally {
        setBusyId(null);
      }
    },
    [refresh],
  );

  const handleDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await blogService.deletePost(pendingDelete.id);
      showSuccessToast(
        "Post deleted",
        `"${pendingDelete.title}" has been removed.`,
      );
      setPendingDelete(null);
      refresh();
    } catch (caught) {
      showErrorToast(
        "Could not delete the post",
        caught instanceof Error ? caught.message : "Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, refresh]);

  const columns: TableColumn<BlogPost>[] = [
    {
      header: "Post",
      key: "title",
      sortable: true,
      render: (post) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-gold-300/10 bg-navy-950">
            {post.featuredImageUrl && (
              <Image
                src={post.featuredImageUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                unoptimized={post.featuredImageUrl.startsWith("blob:")}
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gold-100">{post.title}</p>
            <p className="truncate text-[10px] text-gold-100/40">
              /blog/{post.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      key: "categorySlug",
      sortable: true,
      render: (post) => (
        <span className="whitespace-nowrap text-gold-100/70">
          {getCategoryLabel(post.categorySlug)}
        </span>
      ),
    },
    {
      header: "Author",
      key: "author",
      render: (post) => (
        <span className="whitespace-nowrap text-gold-100/70">
          {post.author.name}
        </span>
      ),
    },
    {
      header: "Published",
      key: "publishedAt",
      sortable: true,
      render: (post) => (
        <span className="whitespace-nowrap font-mono text-gold-100/60">
          {formatBlogDate(post.publishedAt)}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (post) => <StatusBadge status={post.status.toLowerCase()} />,
    },
    {
      header: "Actions",
      key: "actions",
      render: (post) => {
        const isBusy = busyId === post.id;
        return (
          <div className="flex items-center gap-1.5">
            {post.status === "PUBLISHED" && (
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${post.title} on the website`}
                title="View"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-300/15 text-gold-200/70 transition hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
              >
                <FileText className="h-3.5 w-3.5" />
              </a>
            )}
            <Link
              href={`/admin/blog/${post.id}`}
              aria-label={`Edit ${post.title}`}
              title="Edit"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-300/15 text-gold-200/70 transition hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => handleStatusToggle(post)}
              disabled={isBusy}
              aria-label={
                post.status === "PUBLISHED"
                  ? `Unpublish ${post.title}`
                  : `Publish ${post.title}`
              }
              title={post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold-300/15 text-gold-200/70 transition hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 disabled:opacity-40"
            >
              {post.status === "PUBLISHED" ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete(post)}
              disabled={isBusy}
              aria-label={`Delete ${post.title}`}
              title="Delete"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 text-rose-400/80 transition hover:border-rose-500/40 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  const hasFilters = Boolean(search) || status !== "ALL" || category !== "all";

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">Blog Management</h3>
          <p className="text-xs text-gold-100/50">
            Write, publish and manage the articles shown on the public website
          </p>
        </div>

        <Button asChild variant="primary" size="sm" fullWidth={false}>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Create Post
          </Link>
        </Button>
      </div>

      {isBlogMockMode && (
        <p className="rounded-xl border border-gold-300/10 bg-navy-900/40 px-4 py-2.5 text-[11px] text-gold-100/50">
          Blog content is stored in this browser while the backend endpoints are
          being built. Published posts appear on the public site immediately.
        </p>
      )}

      {/* ── Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-100/30"
            aria-hidden="true"
          />
          <label htmlFor="admin-blog-search" className="sr-only">
            Search posts
          </label>
          <input
            id="admin-blog-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search posts by title, excerpt or tag…"
            className="w-full rounded-xl border border-gold-300/10 bg-navy-950 py-2 pl-9 pr-4 text-xs text-gold-100 placeholder-gold-100/30 outline-none transition duration-200 focus:border-gold-300/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="admin-blog-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="admin-blog-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as BlogStatus | "ALL");
              setPage(1);
            }}
            className={controlClass}
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="admin-blog-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="admin-blog-category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className={controlClass}
          >
            <option value="all">All categories</option>
            {blogCategories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>

          <label htmlFor="admin-blog-sort" className="sr-only">
            Sort posts
          </label>
          <select
            id="admin-blog-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as BlogSortOption)}
            className={controlClass}
          >
            <option value="newest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">A–Z</option>
          </select>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      {error ? (
        <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400">
          <p className="text-sm font-semibold">Failed to load blog posts</p>
          <p className="text-xs text-red-500/80">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="cursor-pointer rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-navy-950 transition duration-300 hover:bg-gold-200"
          >
            Retry Load
          </button>
        </div>
      ) : !isLoading && response && response.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gold-300/10 bg-navy-900/60 p-16 text-center text-gold-100/40 backdrop-blur-md">
          <FileText
            className="mb-4 h-12 w-12 text-gold-100/20"
            aria-hidden="true"
          />
          <h4 className="text-lg font-bold text-gold-200">
            {hasFilters ? "No matching posts" : "No blog posts yet"}
          </h4>
          <p className="mt-2 max-w-sm text-xs">
            {hasFilters
              ? "Try a different search term or clear the filters to see all posts."
              : "Create your first article to start building the blog."}
          </p>
          <div className="mt-6">
            {hasFilters ? (
              <Button
                variant="outline"
                size="sm"
                fullWidth={false}
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setStatus("ALL");
                  setCategory("all");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button asChild variant="primary" size="sm" fullWidth={false}>
                <Link href="/admin/blog/new">Create Post</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Table<BlogPost>
          columns={columns}
          data={response?.items ?? []}
          isLoading={isLoading}
          /* Search/filter/sort are handled by the service so the tab exercises
             the same params the real API will take. Table's built-in search
             would only filter the rows already loaded. */
          searchable={false}
          pagination={{
            page: response?.page ?? 1,
            totalPages: response?.totalPages ?? 1,
            totalItems: response?.total ?? 0,
            pageSize,
            onPageChange: setPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
        />
      )}

      <DeletePostDialog
        isOpen={Boolean(pendingDelete)}
        postTitle={pendingDelete?.title ?? ""}
        isDeleting={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
