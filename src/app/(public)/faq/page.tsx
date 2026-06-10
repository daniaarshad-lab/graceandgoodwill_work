import React from "react";
import FAQAccordion from "@/components/FAQAccordion";
import ServicesReveal from "@/components/ServicesReveal";

export const metadata = {
  title: "FAQ | Grace & Goodwill",
  description:
    "Frequently asked questions about live in care, matching, and support.",
};

export default function FAQPage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />

      <div className="mx-auto max-w-4xl">
        <section className="mb-16 text-center">
          {/* <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Support Desk
          </p> */}

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-gold-100">
              Frequently Asked Questions
            </h1>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>

          {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium leading-tight  text-gold-darker">
            Frequently Asked Questions
          </h1> */}
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Find answers to common questions about matching, continuity, and how
            we coordinate trustworthy live-in support.
          </p>
        </section>

        <FAQAccordion />

        <ServicesReveal />
      </div>
    </main>
  );
}
