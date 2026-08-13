import React from "react";

import BlogPostNotFoundView from "@/components/blog/BlogPostNotFoundView";

export default function BlogPostNotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/4 h-[400px] w-[500px] rounded-full bg-gold-500/5 blur-[130px]"
      />
      <div className="relative">
        <BlogPostNotFoundView />
      </div>
    </main>
  );
}
