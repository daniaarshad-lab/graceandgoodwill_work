"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Check } from "lucide-react";

import { faqs } from "@/data/faqData";
import { services } from "@/data/servicesData";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const servicesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
                className={`group rounded-[24px] border border-gold-300/10 bg-navy-900/40 p-6 backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${isOpen
                  ? "border-gold-300/30 bg-navy-900/60 shadow-[0_12px_32px_rgba(212,175,55,0.05)]"
                  : "hover:border-gold-300/20 hover:bg-navy-900/50"
                  }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-medium text-gold-50 tracking-wide sm:text-lg group-hover:text-gold-100 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gold-400/10 bg-navy-950 shadow-inner">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`h-4 w-4 text-gold-300 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-DEFAULT" : ""
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
                  className={`grid transition-all duration-300 ease-in-out ${isOpen
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

        {/* Services Section */}
        <section
          ref={servicesRef}
          className={`mt-16 mb-12 transition-all duration-1000 ease-out ${isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <div className="mx-auto max-w-4xl rounded-[32px] border border-gold-300/20 bg-gradient-to-b from-navy-900/80 to-navy-900/30 p-8 sm:p-12 shadow-[0_12px_40px_rgba(212,175,55,0.06)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-400/5 pointer-events-none" />

            <div className="relative z-10 mb-10 text-center space-y-4">
              <h2 className="text-2xl font-light tracking-tight text-gold-50 sm:text-3xl">
                What Live-In Care Can Include
              </h2>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 sm:gap-x-16 px-4 sm:px-8">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-3 cursor-default"
                >
                  <div className="flex shrink-0 items-center justify-center">
                    <Check className="h-[18px] w-[18px] text-gold-400 group-hover:text-gold-300 group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-[15px] font-light text-gold-50 tracking-wide leading-tight">
                    {service.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        {/* <section className="mt-20 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-8 text-center backdrop-blur-sm sm:p-12">
          <h2 className="text-2xl font-light text-gold-50 sm:text-3xl">
            Have a different{" "}
            <span className="font-semibold text-gold-DEFAULT">question?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gold-200/80 sm:text-base">
            Our care advisors are here to help clarify any details about
            matching, pricing, or custom care workflows.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="navy">
              <Link href="/contact">Ask Us Directly</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </section> */}
      </div>
    </main>
  );
}
