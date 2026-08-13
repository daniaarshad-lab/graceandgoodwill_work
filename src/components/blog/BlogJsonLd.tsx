import React from "react";

import { getCategoryLabel } from "@/data/blogCategories";
import type { BlogPost } from "@/types/blog.types";

const SITE_URL = "https://graceandgoodwill.co.uk";

interface BlogJsonLdProps {
  post: BlogPost;
}

/**
 * BlogPosting + BreadcrumbList structured data. Hand-rolled rather than pulling
 * in a schema library — it is a plain object and JSON.stringify.
 */
export default function BlogJsonLd({ post }: BlogJsonLdProps) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: [`${SITE_URL}${post.featuredImageUrl}`],
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Grace & Goodwill",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/website_logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: getCategoryLabel(post.categorySlug),
    keywords: post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
