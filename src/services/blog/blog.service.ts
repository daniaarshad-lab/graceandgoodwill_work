/**
 * Blog Service: Integrates dynamic backend API endpoints with default static blogs.
 *
 * - Static default blogs from `blogSeedPosts` are preserved as baseline content.
 * - Dynamic blogs created, updated, or deleted via the Admin Portal use the backend API.
 * - Categories are managed statically via `blogCategories`.
 */

import { blogCategories } from "@/data/blogCategories";
import { blogSeedPosts } from "@/data/blogSeed";
import { apiBlogService } from "./blog.api";
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

const DELETED_STATIC_KEY = "gg_deleted_static_posts";

function getDeletedStaticIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DELETED_STATIC_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markStaticPostDeleted(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getDeletedStaticIds();
    set.add(id);
    window.localStorage.setItem(
      DELETED_STATIC_KEY,
      JSON.stringify(Array.from(set)),
    );
  } catch {
    // Ignore storage errors
  }
}

function filterAndSortPosts(
  all: BlogPost[],
  params: BlogListParams = {},
): BlogPost[] {
  const {
    search = "",
    category = "all",
    tag,
    status = "PUBLISHED",
    sort = "newest",
  } = params;

  let rows = all.slice();

  if (status && status !== "ALL") {
    rows = rows.filter((post) => post.status === status);
  }
  if (category && category !== "all") {
    const catLower = category.toLowerCase();
    rows = rows.filter(
      (post) =>
        post.categorySlug.toLowerCase() === catLower ||
        (post.category && post.category.toLowerCase() === catLower),
    );
  }
  if (tag) {
    rows = rows.filter((post) => post.tags.includes(tag));
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (sort === "oldest") {
    rows.sort((a, b) => {
      const aTime = new Date(a.publishedAt || a.createdAt).getTime();
      const bTime = new Date(b.publishedAt || b.createdAt).getTime();
      return aTime - bTime;
    });
  } else if (sort === "title-asc") {
    rows.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // newest default
    rows.sort((a, b) => {
      const aTime = new Date(a.publishedAt || a.createdAt).getTime();
      const bTime = new Date(b.publishedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
  }

  return rows;
}

export const blogService: BlogService = {
  async listPosts(params: BlogListParams = {}): Promise<BlogListResponse> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 10);

    let apiItems: BlogPost[] = [];
    try {
      const apiResponse = await apiBlogService.listPosts({
        ...params,
        page: 1,
        limit: 1000,
      });
      if (apiResponse && Array.isArray(apiResponse.items)) {
        apiItems = apiResponse.items;
      }
    } catch {
      apiItems = [];
    }

    const deletedStaticIds = getDeletedStaticIds();
    const availableStaticPosts = blogSeedPosts
      .filter((p) => !deletedStaticIds.has(p.id))
      .map((p) => ({ ...p, isDefault: true }));
    const staticFiltered = filterAndSortPosts(availableStaticPosts, params);

    // Dynamic API posts take precedence over static ones with the same slug or id
    const apiSlugs = new Set(apiItems.map((p) => p.slug));
    const apiIds = new Set(apiItems.map((p) => p.id));
    const remainingStatic = staticFiltered.filter(
      (p) => !apiSlugs.has(p.slug) && !apiIds.has(p.id),
    );

    const combined = [...apiItems, ...remainingStatic];
    const sorted = filterAndSortPosts(combined, params);

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const apiPost = await apiBlogService.getPostBySlug(slug);
    if (apiPost) return apiPost;
    const deletedStaticIds = getDeletedStaticIds();
    const staticPost = blogSeedPosts.find(
      (p) => p.slug === slug && !deletedStaticIds.has(p.id),
    );
    return staticPost ? { ...staticPost, isDefault: true } : null;
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    const apiPost = await apiBlogService.getPostById(id);
    if (apiPost) return apiPost;
    const deletedStaticIds = getDeletedStaticIds();
    const staticPost = blogSeedPosts.find(
      (p) => p.id === id && !deletedStaticIds.has(p.id),
    );
    return staticPost ? { ...staticPost, isDefault: true } : null;
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    const current =
      (await apiBlogService.getPostBySlug(slug)) ||
      blogSeedPosts.find((p) => p.slug === slug);
    if (!current) return [];

    let apiPublished: BlogPost[] = [];
    try {
      const apiRes = await apiBlogService.listPosts({
        status: "PUBLISHED",
        limit: 100,
      });
      apiPublished = apiRes.items || [];
    } catch {
      apiPublished = [];
    }

    const deletedStaticIds = getDeletedStaticIds();
    const allPublished = [
      ...apiPublished,
      ...blogSeedPosts
        .filter((p) => p.status === "PUBLISHED" && !deletedStaticIds.has(p.id))
        .map((p) => ({ ...p, isDefault: true })),
    ].filter(
      (p, index, self) =>
        p.slug !== slug && self.findIndex((x) => x.slug === p.slug) === index,
    );

    const currentCategory = current.categorySlug;
    const scored = allPublished.map((post) => {
      const sameCategory = post.categorySlug === currentCategory ? 10 : 0;
      const sharedTags = post.tags.filter((t) =>
        current.tags.includes(t),
      ).length;
      return { post, score: sameCategory + sharedTags };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aTime = new Date(a.post.publishedAt || a.post.createdAt).getTime();
      const bTime = new Date(b.post.publishedAt || b.post.createdAt).getTime();
      return bTime - aTime;
    });

    return scored.slice(0, limit).map((s) => s.post);
  },

  async listCategories(): Promise<BlogCategory[]> {
    return blogCategories;
  },

  async listPublishedSlugs(): Promise<string[]> {
    let apiSlugs: string[] = [];
    try {
      apiSlugs = await apiBlogService.listPublishedSlugs();
    } catch {
      apiSlugs = [];
    }
    const deletedStaticIds = getDeletedStaticIds();
    const staticSlugs = blogSeedPosts
      .filter((p) => p.status === "PUBLISHED" && !deletedStaticIds.has(p.id))
      .map((p) => p.slug);
    return Array.from(new Set([...apiSlugs, ...staticSlugs]));
  },

  async createPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
    return apiBlogService.createPost(payload);
  },

  async updatePost(
    id: string,
    payload: UpdateBlogPostPayload,
  ): Promise<BlogPost> {
    const isDefault = blogSeedPosts.some((p) => p.id === id);
    if (isDefault) {
      throw new Error("Default system blogs are permanent and cannot be modified.");
    }
    return apiBlogService.updatePost(id, payload);
  },

  async deletePost(id: string): Promise<void> {
    const isDefault = blogSeedPosts.some((p) => p.id === id);
    if (isDefault) {
      throw new Error("Default system blogs cannot be deleted.");
    }
    return apiBlogService.deletePost(id);
  },

  async setPostStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    const isDefault = blogSeedPosts.some((p) => p.id === id);
    if (isDefault) {
      throw new Error("Default system blogs cannot be modified.");
    }
    return apiBlogService.setPostStatus(id, status);
  },

  async uploadFeaturedImage(file: File): Promise<UploadImageResponse> {
    return apiBlogService.uploadFeaturedImage(file);
  },
};

export const isBlogMockMode = false;


