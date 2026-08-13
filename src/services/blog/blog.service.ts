/**
 * The only file that changes when the backend is ready.
 *
 * Every call site imports `blogService` and never learns which implementation
 * it received, so switching costs no call-site changes.
 *
 * To go live against the real API:
 *   1. Set NEXT_PUBLIC_BLOG_USE_MOCK=false  (reversible, useful while the
 *      backend is half-built), or
 *   2. Delete blog.mock.ts + src/data/blogSeed.ts and reduce this file to
 *      `export const blogService = apiBlogService;`
 */

import type { BlogService } from "@/types/blog.types";
import { mockBlogService } from "./blog.mock";
import { apiBlogService } from "./blog.api";

const USE_MOCK = process.env.NEXT_PUBLIC_BLOG_USE_MOCK !== "false";

export const blogService: BlogService = USE_MOCK
  ? mockBlogService
  : apiBlogService;

/** True while the blog is running on local mock data. Used to show an admin notice. */
export const isBlogMockMode = USE_MOCK;
