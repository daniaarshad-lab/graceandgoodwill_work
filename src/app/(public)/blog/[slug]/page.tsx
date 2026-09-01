import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ArticleAuthor from "@/components/blog/ArticleAuthor";
import ArticleContent from "@/components/blog/ArticleContent";
import ArticleHeader from "@/components/blog/ArticleHeader";
import BlogBreadcrumbs from "@/components/blog/BlogBreadcrumbs";
import BlogJsonLd from "@/components/blog/BlogJsonLd";
import MockPostFallback from "@/components/blog/MockPostFallback";
import RelatedPosts from "@/components/blog/RelatedPosts";
import FAQAccordion from "@/components/FAQAccordion";
import { getCategoryLabel } from "@/data/blogCategories";
import { blogService, isBlogMockMode } from "@/services/blog/blog.service";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Posts created after the build (or only in localStorage) still render. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await blogService.listPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "Article not found | Grace & Goodwill",
      robots: { index: false, follow: false },
      alternates: { canonical: `/blog/${slug}` },
    };
  }

  const title = post.seoTitle?.trim() || post.title;
  const description = (post.seoDescription?.trim() || post.excerpt).slice(
    0,
    160,
  );
  const path = `/blog/${post.slug}`;

  return {
    title: `${title} | Grace & Goodwill`,
    description,
    /* Mandatory override: the root layout declares the homepage as canonical,
       which would otherwise drop every article from the search index. */
    alternates: { canonical: path },
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      url: path,
      siteName: "Grace & Goodwill",
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.featuredImageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    /* With the real API the server is the single source of truth, so an unknown
       slug is a genuine 404. On mock data the server can only see the seed —
       posts the admin created live in their browser's localStorage — so we hand
       off to a client component that can look there. Delete this branch (and
       MockPostFallback) when the backend is connected. */
    if (!isBlogMockMode) notFound();

    return (
      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-16 text-gold-100/90 sm:py-20">
        <div className="container-wrapper relative">
          <MockPostFallback slug={slug} />
        </div>
      </main>
    );
  }

  const related = await blogService.getRelatedPosts(slug, 3);

  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-navy-950 pb-16 text-gold-100/90 sm:pb-20">
      <BlogJsonLd post={post} />

      <ArticleHeader post={post} />

      <div className="container-wrapper relative">
        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Left Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-24">
              <span className="text-sm font-bold uppercase tracking-widest text-gold-300/60">
                Blog
              </span>
              
              <div className="mt-8 rounded-xl border border-gold-300/10 bg-navy-900/40 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="font-serif text-xl font-medium text-gold-50 mb-4">
                  Speak Directly With Us
                </h3>
                <p className="text-sm text-gold-200/80 mb-6 leading-relaxed">
                  Call our friendly support desk.
                </p>
                <a href="tel:+442045240108" className="block text-xl font-bold text-gold-200 hover:text-gold-100 transition-colors">
                  020 4524 0108
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="min-w-0">
            {/* Mobile blog label (hidden on desktop) */}
            <div className="mb-6 lg:hidden">
              <span className="text-sm font-bold uppercase tracking-widest text-gold-300/60">
                Blog
              </span>
            </div>

            <ArticleContent html={post.content} />

            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200/40">
                  Tags
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gold-300/12 bg-navy-900/40 px-3 py-1 text-[11px] text-gold-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.faqItems && post.faqItems.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-8 font-serif text-2xl font-semibold text-gold-50 sm:text-3xl">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqsList={post.faqItems as any} />
              </div>
            )}

            {post.cta && (
              <div className="mt-16 rounded-2xl border border-gold-300/10 bg-navy-900/40 p-8 text-center sm:p-12">
                <h2 className="mb-6 font-serif text-2xl font-semibold text-gold-50">
                  Next Steps
                </h2>
                <Link
                  href={post.cta.href}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#b59469] px-6 text-sm font-semibold text-navy-950 transition-all duration-300 hover:bg-[#c9a67d] hover:text-white hover:-translate-y-0.5"
                >
                  {post.cta.text}
                </Link>
              </div>
            )}

            <div className="mt-16 border-t border-gold-500/10 pt-8">
              <ArticleAuthor author={post.author} />
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl border border-gold-300/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <RelatedPosts posts={related} />
        </div>
      </div>
    </main>
  );
}
