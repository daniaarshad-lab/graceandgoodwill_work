import React from "react";
import FAQAccordion from "@/components/FAQAccordion";
import ServicesReveal from "@/components/ServicesReveal";
import { faqs } from "@/data/faqData";

export const metadata = {
  title: "FAQ | Grace & Goodwill",
  description:
    "Frequently asked questions about live in care, matching, and support.",
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 px-6 py-20 text-gold-100/90">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[300px] w-[500px] rounded-full bg-navy-800/20 blur-[100px]" />

      <div className="mx-auto max-w-4xl">
        <section className="mb-16 text-center relative z-10">
          <div className="page-strapline">FAQ</div>

          <h1 className="main-page-heading">Frequently Asked Questions</h1>

          <p className="page-supporting-text mx-auto mt-6 max-w-xl">
            Find answers to common questions about matching and how we introduce
            trustworthy self-employed live-in support.
          </p>
        </section>

        <div className="relative z-10">
          <FAQAccordion groupByCategory={true} />
        </div>

        <div className="relative z-10 mt-16">
          <ServicesReveal />
        </div>
      </div>
    </main>
  );
}
