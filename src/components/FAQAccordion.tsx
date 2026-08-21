"use client";

import React, { useState } from "react";
import { faqs as defaultFaqs } from "@/data/faqData";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion({
  items = defaultFaqs,
}: {
  items?: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="space-y-4">
      {items.map((faq, index) => {
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
              <h3 className="text-base font-medium text-gold-50 tracking-wide sm:text-lg group-hover:text-gold-100 transition-colors">
                {faq.question}
              </h3>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/10 bg-navy-950 shadow-inner">
                <ChevronDown
                  className={`h-4 w-4 text-gold-300 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-gold-DEFAULT" : ""
                  }`}
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Animated expand/collapse container using grid interpolation with inline styles to prevent SSR flash */}
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
                marginTop: isOpen ? "1rem" : "0",
              }}
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
  );
}
