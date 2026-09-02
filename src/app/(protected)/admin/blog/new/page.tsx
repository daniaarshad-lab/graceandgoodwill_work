"use client";

import React from "react";

import BlogPostForm from "../../components/blog/BlogPostForm";

/**
 * Create Post. Admin-only protection is inherited from
 * src/app/(protected)/admin/layout.tsx — no extra guard needed here.
 */
export default function CreateBlogPostPage() {
  return (
    <main className="min-h-screen bg-navy-950 px-4 py-8 text-gold-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <BlogPostForm />
      </div>
    </main>
  );
}
