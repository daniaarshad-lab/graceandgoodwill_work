/**
 * Mock implementation of BlogService.
 *
 * Server (SSR, `next build`, generateStaticParams, sitemap): the seed array IS
 * the database. localStorage is never touched and latency is not simulated, so
 * builds stay fast and prerendering is deterministic.
 *
 * Browser: seeds localStorage on first run, then reads and writes it, so admin
 * edits survive a refresh.
 *
 * TODO(backend): delete this file and collapse the ternary in blog.service.ts.
 */

import { blogCategories } from "@/data/blogCategories";
import { blogSeedPosts } from "@/data/blogSeed";
import { estimateReadingTime, slugify } from "@/lib/blogValidation";
import { sanitizeEditorHtml } from "@/lib/blogHtml";
import type {
  BlogCategory,
  BlogListParams,
  BlogListResponse,
  BlogPost,
  BlogService,
  BlogStatus,
  CreateBlogPostPayload,
  UpdateBlogPostPayload,
  UploadImageResponse,
} from "@/types/blog.types";

/** Bump the suffix whenever the BlogPost shape changes. */
const STORAGE_KEY = "gg_blog_posts_v11";

const isBrowser = (): boolean => typeof window !== "undefined";

/** Simulated latency, browser only, so loading states are exercised for real. */
const delay = (ms = 240): Promise<void> =>
  isBrowser()
    ? new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 120))
    : Promise.resolve();

function readStore(): BlogPost[] {
  if (!isBrowser()) return blogSeedPosts;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blogSeedPosts));
      return blogSeedPosts;
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogPost[]) : blogSeedPosts;
  } catch {
    /* Corrupt JSON or blocked storage — degrade to the seed rather than crash. */
    return blogSeedPosts;
  }
}

function writeStore(posts: BlogPost[]): void {
  if (!isBrowser()) {
    throw new Error(
      "blogService: writes are only available in the browser while running on mock data.",
    );
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function generateId(): string {
  if (isBrowser() && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `post-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/** Single selector shared by listPosts, getRelatedPosts and listPublishedSlugs. */
function selectPosts(
  all: BlogPost[],
  params: BlogListParams = {},
): BlogListResponse {
  const {
    page = 1,
    limit = 9,
    search = "",
    category = "all",
    tag,
    status = "PUBLISHED",
    sort = "newest",
  } = params;

  let rows = all.slice();

  if (status !== "ALL") rows = rows.filter((post) => post.status === status);
  if (category && category !== "all") {
    rows = rows.filter((post) => post.categorySlug === category);
  }
  if (tag) rows = rows.filter((post) => post.tags.includes(tag));

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    rows = rows.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  rows.sort((a, b) => {
    if (sort === "title-asc") return a.title.localeCompare(b.title);
    const aTime = new Date(a.publishedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.publishedAt ?? b.createdAt).getTime();
    return sort === "oldest" ? aTime - bTime : bTime - aTime;
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    items: rows.slice((safePage - 1) * limit, safePage * limit),
    total,
    page: safePage,
    limit,
    totalPages,
  };
}

export const mockBlogService: BlogService = {
  async listPosts(params: BlogListParams = {}): Promise<BlogListResponse> {
    await delay();
    return selectPosts(readStore(), params);
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await delay(180);
    return readStore().find((post) => post.slug === slug) ?? null;
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    await delay(180);
    return readStore().find((post) => post.id === id) ?? null;
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    await delay(180);
    const all = readStore();
    const current = all.find((post) => post.slug === slug);
    if (!current) return [];

    const published = all.filter(
      (post) => post.status === "PUBLISHED" && post.slug !== slug,
    );

    /* Same category first, then shared tags, then most recent. */
    const scored = published
      .map((post) => {
        const sameCategory =
          post.categorySlug === current.categorySlug ? 10 : 0;
        const sharedTags = post.tags.filter((t) =>
          current.tags.includes(t),
        ).length;
        return { post, score: sameCategory + sharedTags };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(b.post.publishedAt ?? b.post.createdAt).getTime() -
          new Date(a.post.publishedAt ?? a.post.createdAt).getTime()
        );
      });

    return scored.slice(0, limit).map((entry) => entry.post);
  },

  async listCategories(): Promise<BlogCategory[]> {
    await delay(120);
    return blogCategories;
  },

  async listPublishedSlugs(): Promise<string[]> {
    return readStore()
      .filter((post) => post.status === "PUBLISHED")
      .map((post) => post.slug);
  },

  async createPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
    await delay(420);
    const posts = readStore();

    const slug = payload.slug.trim() || slugify(payload.title);
    if (posts.some((post) => post.slug === slug)) {
      throw new Error(`The slug "${slug}" is already in use by another post.`);
    }

    const now = new Date().toISOString();
    const content = sanitizeEditorHtml(payload.content);

    const post: BlogPost = {
      ...payload,
      id: generateId(),
      slug,
      content,
      readingTimeMinutes: estimateReadingTime(content),
      publishedAt: payload.status === "PUBLISHED" ? now : null,
      createdAt: now,
      updatedAt: now,
    };

    writeStore([post, ...posts]);
    return post;
  },

  async updatePost(
    id: string,
    payload: UpdateBlogPostPayload,
  ): Promise<BlogPost> {
    await delay(420);
    const posts = readStore();
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) throw new Error("That post no longer exists.");

    const existing = posts[index];

    if (payload.slug && payload.slug !== existing.slug) {
      if (posts.some((post) => post.slug === payload.slug && post.id !== id)) {
        throw new Error(
          `The slug "${payload.slug}" is already in use by another post.`,
        );
      }
    }

    const content =
      payload.content !== undefined
        ? sanitizeEditorHtml(payload.content)
        : existing.content;

    const nextStatus = payload.status ?? existing.status;

    const updated: BlogPost = {
      ...existing,
      ...payload,
      content,
      readingTimeMinutes: estimateReadingTime(content),
      /* Stamp publishedAt on the first transition to PUBLISHED only — never
         overwrite an existing publication date on a later edit. */
      publishedAt:
        nextStatus === "PUBLISHED"
          ? (existing.publishedAt ?? new Date().toISOString())
          : existing.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    const next = posts.slice();
    next[index] = updated;
    writeStore(next);
    return updated;
  },

  async deletePost(id: string): Promise<void> {
    await delay(320);
    const posts = readStore();
    if (!posts.some((post) => post.id === id)) {
      throw new Error("That post no longer exists.");
    }
    writeStore(posts.filter((post) => post.id !== id));
  },

  async setPostStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    return mockBlogService.updatePost(id, { status });
  },

  async uploadFeaturedImage(file: File): Promise<UploadImageResponse> {
    await delay(700);
    /* TODO(backend): POST multipart to the upload endpoint and return the CDN
       URL. The object URL below is session-scoped and will not resolve after a
       reload — BlogImageField warns the admin about exactly that. */
    return { url: URL.createObjectURL(file) };
  },
};
