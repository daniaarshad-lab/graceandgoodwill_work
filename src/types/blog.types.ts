/**
 * Blog / Content Management types.
 *
 * `BlogService` at the bottom of this file is the seam between the UI and the
 * data source. Both the mock implementation and the real HTTP implementation
 * satisfy it, so swapping one for the other is a single line in
 * src/services/blog/blog.service.ts and TypeScript guarantees the two never
 * drift apart.
 */

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogSortOption = "newest" | "oldest" | "title-asc";

export interface BlogCategory {
  slug: string;
  label: string;
  description: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitised HTML produced by RichTextEditor. */
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  /**
   * Deliberately a plain string rather than a literal union: categories will
   * come from the backend later, and a union would force a type change every
   * time an admin adds one. Validated at the form layer instead.
   */
  categorySlug: string;
  tags: string[];
  status: BlogStatus;
  author: BlogAuthor;
  readingTimeMinutes: number;
  /** ISO 8601. Null while the post has never been published. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
  faqItems?: { question: string; answer: string }[];
  cta?: { text: string; href: string };
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  /** "all" or a BlogCategory.slug. */
  category?: string;
  tag?: string;
  /** Public callers pass "PUBLISHED"; admin passes "ALL" or a specific status. */
  status?: BlogStatus | "ALL";
  sort?: BlogSortOption;
}

/** Mirrors the paginated shape already returned by admin.service.ts. */
export interface BlogListResponse {
  items: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  categorySlug: string;
  tags: string[];
  status: BlogStatus;
  author: BlogAuthor;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

export interface UploadImageResponse {
  url: string;
}

/**
 * The contract every implementation must satisfy.
 * See src/services/blog/blog.service.ts for how implementations are selected.
 */
export interface BlogService {
  listPosts(params?: BlogListParams): Promise<BlogListResponse>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  getPostById(id: string): Promise<BlogPost | null>;
  getRelatedPosts(slug: string, limit?: number): Promise<BlogPost[]>;
  listCategories(): Promise<BlogCategory[]>;
  /** Feeds generateStaticParams and sitemap.ts. */
  listPublishedSlugs(): Promise<string[]>;

  createPost(payload: CreateBlogPostPayload): Promise<BlogPost>;
  updatePost(id: string, payload: UpdateBlogPostPayload): Promise<BlogPost>;
  deletePost(id: string): Promise<void>;
  setPostStatus(id: string, status: BlogStatus): Promise<BlogPost>;

  uploadFeaturedImage(file: File): Promise<UploadImageResponse>;
}
