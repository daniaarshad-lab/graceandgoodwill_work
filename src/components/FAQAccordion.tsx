"use client";

import React, { useState } from "react";
import { faqs as allFaqs } from "@/data/faqData";
import { ChevronDown } from "lucide-react";

export interface FAQAccordionItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  faqsList?: FAQAccordionItem[];
  groupByCategory?: boolean;
}

export default function FAQAccordion({ faqsList = allFaqs, groupByCategory = false }: FAQAccordionProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleFAQ = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  const renderFAQ = (faq: FAQAccordionItem) => {
    const isOpen = openQuestion === faq.question;
    return (
      <div
        key={faq.question}
        onClick={() => toggleFAQ(faq.question)}
        className={`group rounded-[24px] border border-gold-300/10 bg-navy-900/40 p-6 backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${isOpen
          ? "border-gold-300/30 bg-navy-900/60 shadow-[0_12px_32px_rgba(212,175,55,0.05)]"
          : "hover:border-gold-300/20 hover:bg-navy-900/50"
          }`}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-gold-50 tracking-wide sm:text-base group-hover:text-gold-100 transition-colors">
            {faq.question}
          </h3>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/10 bg-navy-950 shadow-inner">
            <ChevronDown
              className={`h-4 w-4 text-gold-300 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-DEFAULT" : ""
                }`}
              strokeWidth={2}
            />
          </div>
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${isOpen
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden">
            <p className="text-sm leading-relaxed text-gold-200/70 pt-4 border-t border-gold-500/10">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (groupByCategory) {
    const categories = Array.from(new Set(faqsList.map((f) => f.category)));
    return (
      <div className="space-y-12">
        {categories.map((category) => {
          if (!category) return null;
          const categoryFaqs = faqsList.filter((f) => f.category === category);
          return (
            <section key={category} className="space-y-6">
              <h2 className="text-2xl font-serif text-gold-200 border-b border-gold-500/20 pb-2">{category}</h2>
              <div className="space-y-4">
                {categoryFaqs.map(renderFAQ)}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return <section className="space-y-4">{faqsList.map(renderFAQ)}</section>;
}
