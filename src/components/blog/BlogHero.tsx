import React from "react";

/**
 * Listing hero. Mirrors the eyebrow + flanked-heading motif already used on
 * /services, /faq and /how-it-works so the Blog reads as part of the site.
 */
export default function BlogHero() {
  return (
    <section className="mb-14 text-center sm:mb-16">
      <div className="mb-3 flex items-center justify-center gap-4">
        <div
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/40 sm:w-12"
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400/70 sm:text-xs">
          Insights
        </span>
        <div
          aria-hidden="true"
          className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/40 sm:w-12"
        />
      </div>

      <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight text-gold-50 sm:text-4xl lg:text-5xl">
        Guidance for families and carers
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
        Practical writing on arranging live-in care, supporting someone at home,
        and living well in later years — from the team who do this every day.
      </p>
    </section>
  );
}
