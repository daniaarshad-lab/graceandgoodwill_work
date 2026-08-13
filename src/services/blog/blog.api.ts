/**
 * Real HTTP implementation of BlogService.
 *
 * This file is written ahead of the backend on purpose: because it must satisfy
 * the same `BlogService` interface as the mock, TypeScript proves the two are
 * interchangeable now rather than at integration time.
 *
 * Endpoint paths and response shapes below are the PROPOSED contract. The
 * backend developer should confirm or correct them; only this file changes.
 * `apiFetch` prefixes /api and injects the bearer token from localStorage.
 */

import { apiFetch } from "@/lib/api";
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

function buildQuery(params: BlogListParams): string {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.category && params.category !== "all") {
    query.append("category", params.category);
  }
  if (params.tag) query.append("tag", params.tag);
  if (params.status) query.append("status", params.status);
  if (params.sort) query.append("sort", params.sort);
  return query.toString();
}

export const apiBlogService: BlogService = {
  async listPosts(params: BlogListParams = {}): Promise<BlogListResponse> {
    return apiFetch(`/blog/posts?${buildQuery(params)}`, { method: "GET" });
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return apiFetch(`/blog/posts/slug/${encodeURIComponent(slug)}`, {
      method: "GET",
    });
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    return apiFetch(`/blog/posts/${id}`, { method: "GET" });
  },

  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    return apiFetch(
      `/blog/posts/slug/${encodeURIComponent(slug)}/related?limit=${limit}`,
      { method: "GET" },
    );
  },

  async listCategories(): Promise<BlogCategory[]> {
    return apiFetch("/blog/categories", { method: "GET" });
  },

  async listPublishedSlugs(): Promise<string[]> {
    const response: BlogListResponse = await apiFetch(
      "/blog/posts?status=PUBLISHED&limit=1000&page=1",
      { method: "GET" },
    );
    return response.items.map((post) => post.slug);
  },

  async createPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
    return apiFetch("/blog/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updatePost(
    id: string,
    payload: UpdateBlogPostPayload,
  ): Promise<BlogPost> {
    return apiFetch(`/blog/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deletePost(id: string): Promise<void> {
    await apiFetch(`/blog/posts/${id}`, { method: "DELETE" });
  },

  async setPostStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    return apiFetch(`/blog/posts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async uploadFeaturedImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);
    /* apiFetch omits Content-Type for FormData so the browser sets the boundary. */
    return apiFetch("/blog/uploads", { method: "POST", body: formData });
  },
};
