import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/multiple-sclerosis-live-in-care`,
  },
  title: "Multiple Sclerosis Live-in Care UK | MS Support at Home | Grace & Goodwill",
  description: "Explore live-in care for multiple sclerosis with Grace & Goodwill. Find carers for mobility, personal care, routines and practical support at home.",
};

export default function MultipleSclerosisLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="text-center mb-12">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Multiple Sclerosis Live-in Care
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Practical support at home for people living with MS
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Multiple sclerosis can affect people in very different ways.</p>
            <p>Some people may experience changes in mobility, balance, strength, fatigue, coordination, vision, concentration or everyday confidence. Support needs may also change over time.</p>
            <p className="font-medium text-gold-200">Live-in care can provide practical day-to-day assistance at home while helping the person continue with familiar routines, relationships and activities that matter to them.</p>
            <p>Grace & Goodwill helps individuals and families explore available live-in carer profiles with experience relevant to neurological conditions and physical support needs.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md">
              <Link href="/carers">Find a Live-in Carer</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10 mt-16">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">How can a live-in carer support someone with MS?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Depending on the individual circumstances and agreed arrangement, practical support may include:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "personal care",
                "dressing",
                "mobility assistance",
                "preparing meals and drinks",
                "shopping",
                "light household tasks",
                "attending appointments",
                "companionship",
                "support with familiar daily routines",
                "practical help during periods of increased fatigue",
                "support with hobbies, outings and social activities",
                "other agreed everyday assistance"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>The level of support should reflect the person’s own abilities, preferences and lifestyle.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Supporting independence</h3>
            <div className="page-supporting-text space-y-4">
              <p>Living with MS does not mean losing control over everyday life.</p>
              <p>For many people, maintaining independence can mean continuing to make their own choices, following familiar routines and remaining involved in work, family life, hobbies and their community.</p>
              <p className="font-medium text-gold-200">A live-in care arrangement can provide practical support where it is needed while respecting what the person can and wants to continue doing independently.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Clinical and rehabilitation support</h3>
            <div className="page-supporting-text space-y-4">
              <p>Grace & Goodwill does not provide clinical, nursing, physiotherapy, occupational therapy or rehabilitation services.</p>
              <p>Live-in carers from Grace & Goodwill cannot undertake clinical or rehabilitation treatment.</p>
              <p className="font-medium text-gold-200">Where clinical or rehabilitation services are required, they must be provided separately by the appropriate qualified healthcare professionals.</p>
              <p>The chosen live-in carer can provide the agreed practical day-to-day support at home around the person’s existing routines and appointments, but does not replace clinical or rehabilitation professionals.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Choosing a carer with relevant experience</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>When considering live-in support for someone with multiple sclerosis, families may wish to explore carers with experience in areas such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "multiple sclerosis",
                "neurological conditions",
                "reduced mobility",
                "personal care",
                "moving and handling",
                "fatigue-related support",
                "supporting independence at home"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Grace & Goodwill allows clients and families to consider practical experience alongside personality, communication style, interests, availability and overall compatibility.</p>
              <p className="font-medium text-gold-200">The final choice remains with the client.</p>
            </div>
            
            {/* Internal Links Block */}
            <div className="mt-10 border-t border-gold-400/20 pt-6">
              <p className="text-sm font-serif text-gold-300 mb-4">Related helpful links:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { text: "Brain Injury & Neurological Support", href: "/brain-injury-live-in-care" },
                  { text: "Long-Term Live-in Care", href: "/long-term-live-in-care" },
                  { text: "Respite Live-in Care", href: "/respite-live-in-care" },
                  { text: "Contact", href: "/contact" }
                ].map((link, idx) => (
                  <Link key={idx} href={link.href} className="text-[13px] font-medium text-gold-100/70 hover:text-gold-300 bg-navy-950/50 px-3 py-1.5 rounded-full border border-gold-400/10 transition-colors">
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <div className="mt-16 bg-navy-900/40 p-8 sm:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Find the right live-in support</h3>
            <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
              <p>Contact Grace & Goodwill to explore independent carers with experience supporting adults living with MS.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gold-100/80 mb-8">
              <a href="tel:02045240108" className="hover:text-gold-200 transition-colors">
                <strong>Telephone:</strong> 020 4524 0108
              </a>
              <span className="hidden sm:inline text-gold-300/30">|</span>
              <a href="https://wa.me/447462931949" target="_blank" rel="noopener noreferrer" className="hover:text-gold-200 transition-colors">
                <strong>WhatsApp:</strong> +44 7462 931949
              </a>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="primary" size="md">
                <Link href="/carers">Find a Live-in Carer</Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <Link href="/contact">Speak to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
