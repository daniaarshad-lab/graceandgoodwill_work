import type { MetadataRoute } from "next";

import { blogService } from "@/services/blog/blog.service";

const BASE_URL = "https://graceandgoodwill.co.uk";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/how-it-works",
  "/pricing",
  "/contact",
  "/faq",
  "/emergency-care",
  "/blog",
  "/privacy",
  "/terms",
  "/agency-introduction-terms",
];

/**
 * The listing page uses load-more, so articles beyond the first page are not
 * reachable by a crawler following links. The sitemap is what makes every
 * published article discoverable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await blogService.listPosts({
    status: "PUBLISHED",
    page: 1,
    limit: 1000,
  });

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...items.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
