"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "How does matching work?",
    answer:
      "We start by understanding your care needs, personality, and lifestyle preferences. From there, we introduce you to carefully vetted carers, allowing you to review detailed profiles and find a match that feels completely right.",
  },
  {
    question: "What happens if circumstances change?",
    answer:
      "Life is dynamic. If your support requirements evolve or your carer becomes unavailable, we step in immediately. We coordinate adjustments or find a new match without interruption to your daily routine.",
  },
  {
    question: "How does continuity support work?",
    answer:
      "Continuity is our standard. We manage carer transitions, plan coverage for holidays or sickness, and ensure a seamless handover process so you always receive reliable support from someone you know and trust.",
  },
  {
    question: "Can I request a different match?",
    answer:
      "Yes, absolutely. Your comfort and peace of mind are our absolute priority. If you ever feel a carer match isn’t optimal, just let us know, and we will work with you to arrange a new introduction without delay or extra fees.",
  },
  {
    question: "How are transitions supported?",
    answer:
      "We guide you through the transition from day one. Our care managers facilitate structured introductions and handovers, ensuring that both families and carers feel comfortable, prepared, and reassured.",
  },
  {
    question: "Can carers update training through the platform?",
    answer:
      "Yes. Carers have a dedicated profile portal and access to our compliance academy where they can complete training, monitor certificates, and log achievements directly on the platform.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Clear weekly pricing agreed in advance with transparency from the beginning and no unexpected surprises.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />

      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <section className="mb-16 text-center">
          <p className="inline-block rounded-full border border-gold-500/25 bg-gold-500/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            Support Desk
          </p>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-gold-50 sm:text-5xl md:text-6xl">
            Frequently Asked{" "}
            <span className="font-semibold text-gold-DEFAULT">Questions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gold-200/80 sm:text-lg">
            Find answers to common questions about matching, continuity, and how
            we coordinate trustworthy live-in support.
          </p>
        </section>

        {/* FAQs Accordion Grid */}
        <section className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                onClick={() => toggleFAQ(index)}
                className={`group rounded-[24px] border border-gold-300/10 bg-navy-900/40 p-6 backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${
                  isOpen
                    ? "border-gold-300/30 bg-navy-900/60 shadow-[0_12px_32px_rgba(212,175,55,0.05)]"
                    : "hover:border-gold-300/20 hover:bg-navy-900/50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base font-semibold text-gold-50 tracking-wide sm:text-lg group-hover:text-gold-100 transition-colors">
                    {faq.question}
                  </h2>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/10 bg-navy-950 shadow-inner">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`h-4 w-4 text-gold-300 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-gold-DEFAULT" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Animated expand/collapse container using grid interpolation */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-gold-200/70 sm:text-base border-t border-gold-500/10 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA section */}
        <section className="mt-20 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-light text-gold-50 sm:text-3xl">
            Have a different{" "}
            <span className="font-semibold text-gold-DEFAULT">question?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Our care advisors are here to help clarify any details about
            matching, pricing, or custom care workflows.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-950 shadow-elegant transition duration-300 hover:bg-gold-400 hover:scale-[1.02]"
            >
              Ask Us Directly
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-gold-300/30 px-8 py-3.5 text-sm font-semibold text-gold-200 transition duration-300 hover:bg-navy-900/50 hover:border-gold-300/60"
            >
              See How It Works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
