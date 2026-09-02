import React from "react";

import BlogCard from "./BlogCard";
import type { BlogPost } from "@/types/blog.types";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="related-heading">
      <div className="mb-8 space-y-4 text-center">
        <h2
          id="related-heading"
          className="font-serif text-2xl tracking-wide text-gold-50 sm:text-3xl"
        >
          Related reading
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ))}
      </div>
    </section>
  );
}
