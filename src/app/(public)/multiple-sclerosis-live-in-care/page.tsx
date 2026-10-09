import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import { Check } from "lucide-react";
import type { Metadata } from "next";

import msImage1 from "@/assets/open/Multiple-Sclerosis-image-1.jpeg";
import msImage2 from "@/assets/open/Multiple-Sclerosis-image-2.jpeg";

export const metadata: Metadata = {
  alternates: {
    canonical: `/multiple-sclerosis-live-in-care`,
  },
  title: "Multiple Sclerosis Live-in Care UK | MS Support at Home | Grace & Goodwill",
  description: "Explore live-in care for multiple sclerosis with Grace & Goodwill. Find carers for mobility, personal care, routines and practical support at home.",
};

export default function MultipleSclerosisLiveInCarePage() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-navy-950 py-20 text-gold-100/90">
      <div className="pointer-events-none absolute left-1/4 top-10 h-[450px] w-[600px] rounded-full bg-gold-500/5 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-10 h-[450px] w-[600px] rounded-full bg-navy-800/30 blur-[130px]" />

      <div className="container-wrapper relative z-10">
        
        {/* Header Section */}
        <section className="mb-20 text-center">
          <Link href="/services" className="text-sm font-medium tracking-widest text-gold-400/80 hover:text-gold-300 transition-colors cursor-pointer inline-flex w-auto mx-auto justify-center items-center">
            &larr; BACK TO SERVICES
          </Link>

          <h1 className="main-page-heading mt-6 mb-6 max-w-4xl mx-auto">
            Multiple Sclerosis Live-in Care
          </h1>

          <p className="page-supporting-text mx-auto max-w-3xl mb-10 text-lg">
            Practical, day-to-day assistance at home. We help you continue with familiar routines, relationships, and activities that matter most while providing dedicated support for mobility, personal care, and fatigue management.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="primary" size="md" className="px-8 py-3.5" fullWidth={false}>
              <Link href="/register">Find a Live-in Carer</Link>
            </Button>
            <Button asChild variant="outline" size="md" className="px-8 py-3.5" fullWidth={false}>
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </section>

        <div className="space-y-24 mt-12">
          {/* Section 1 */}
          <section className="group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-semibold !font-sans text-gold-50 tracking-tight leading-snug mb-6">
                  How can a live-in carer support someone with MS?
                </h2>
                <div className="text-base text-gold-100/80 space-y-4 !font-sans font-light">
                  <p>Depending on the individual circumstances and agreed arrangement, practical support may include:</p>
                  
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-8 mb-8">
                    {[
                      "Personal care",
                      "Dressing",
                      "Mobility assistance",
                      "Preparing meals and drinks",
                      "Shopping",
                      "Light household tasks",
                      "Attending appointments",
                      "Companionship",
                      "Support with familiar daily routines",
                      "Practical help during periods of increased fatigue",
                      "Support with hobbies, outings and social activities",
                      "Other agreed everyday assistance"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 bg-gold-400/5 border border-gold-400/10 p-3 rounded-xl shadow-sm transition-colors hover:bg-gold-400/10">
                        <div className="shrink-0 bg-gold-400/20 p-1 rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-gold-300" strokeWidth={3} />
                        </div>
                        <span className="text-[14px] font-medium text-gold-100/90 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p>The level of support should reflect the person’s own abilities, preferences and lifestyle.</p>
                </div>
              </div>
              
              <div className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gold-300/20 bg-navy-950/40">
                <Image 
                  src={msImage1} 
                  alt="Multiple Sclerosis Live-in Care Support" 
                  className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gold-300/20 bg-navy-950/40">
                <Image 
                  src={msImage2} 
                  alt="Supporting independence for MS patients" 
                  className="w-full h-auto transform transition-transform duration-[2s] group-hover:scale-105" 
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
              
              <div className="order-1 lg:order-2 flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-semibold !font-sans text-gold-50 tracking-tight leading-snug mb-6">
                  Supporting independence
                </h2>
                <div className="text-base text-gold-100/80 space-y-5 !font-sans font-light leading-relaxed">
                  <p>Living with MS does not mean losing control over everyday life.</p>
                  <p>For many people, maintaining independence can mean continuing to make their own choices, following familiar routines and remaining involved in work, family life, hobbies and their community.</p>
                  <div className="mt-8 flex items-start gap-4 bg-gradient-to-r from-gold-400/10 to-transparent p-5 rounded-2xl border-l-4 border-gold-400/50 shadow-sm">
                    <p className="font-medium text-gold-200 text-[15px] leading-relaxed">
                      A live-in care arrangement can provide practical support where it is needed while respecting what the person can and wants to continue doing independently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sections 3 & 4 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-10 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30">
              <h2 className="card-heading mb-6 text-xl">Clinical and rehabilitation support</h2>
              <div className="page-supporting-text space-y-4">
                <p>Grace & Goodwill does not provide clinical, nursing, physiotherapy, occupational therapy or rehabilitation services.</p>
                <p>Live-in carers from Grace & Goodwill cannot undertake clinical or rehabilitation treatment.</p>
                <p className="font-medium text-gold-200">Where clinical or rehabilitation services are required, they must be provided separately by the appropriate qualified healthcare professionals.</p>
                <p>The chosen live-in carer can provide the agreed practical day-to-day support at home around the person’s existing routines and appointments, but does not replace clinical or rehabilitation professionals.</p>
              </div>
            </section>

            <section className="group relative flex flex-col rounded-[28px] border border-gold-300/10 bg-navy-900/40 p-6 sm:p-10 shadow-elegant backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/30">
              <h2 className="card-heading mb-6 text-xl">Choosing a carer with relevant experience</h2>
              <div className="page-supporting-text space-y-4">
                <p>When considering live-in support for someone with multiple sclerosis, families may wish to explore carers with experience in areas such as:</p>
                <ul className="grid grid-cols-1 gap-2 mt-4 mb-4">
                  {[
                    "Multiple sclerosis",
                    "Neurological conditions",
                    "Reduced mobility & moving and handling",
                    "Personal care & supporting independence at home",
                    "Fatigue-related support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                      <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <p>Grace & Goodwill allows clients and families to consider practical experience alongside personality, communication style, interests, availability and overall compatibility.</p>
                <p className="font-medium text-gold-200">The final choice remains with the client.</p>
              </div>
              
              {/* Internal Links Block */}
              <div className="mt-auto pt-8 border-t border-gold-400/10">
                <p className="text-xs font-semibold tracking-wider uppercase text-gold-400 mb-4">Related helpful links:</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/brain-injury-live-in-care" className="text-[13px] font-medium text-gold-200 hover:text-gold-50 bg-gold-400/10 px-4 py-2 rounded-xl border border-gold-400/20 transition-colors">Brain Injury Support</Link>
                  <Link href="/long-term-live-in-care" className="text-[13px] font-medium text-gold-200 hover:text-gold-50 bg-gold-400/10 px-4 py-2 rounded-xl border border-gold-400/20 transition-colors">Long-Term Live-in Care</Link>
                  <Link href="/respite-live-in-care" className="text-[13px] font-medium text-gold-200 hover:text-gold-50 bg-gold-400/10 px-4 py-2 rounded-xl border border-gold-400/20 transition-colors">Respite Live-in Care</Link>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Banner */}
          <section className="mt-12 rounded-[32px] border border-gold-300/15 bg-navy-900/30 p-6 sm:p-8 md:p-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
              Find the right live-in support
            </h2>
            <p className="page-supporting-text mx-auto mt-4 max-w-xl">
              Contact Grace & Goodwill to explore independent carers with experience supporting adults living with MS. We're here to help you find the perfect match.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-gold-100/90 mb-8">
              <a href="tel:02045240108" className="hover:text-gold-200 transition-colors font-medium">
                Telephone: 020 4524 0108
              </a>
              <span className="hidden sm:inline text-gold-400/30">|</span>
              <a href="https://wa.me/447462931949" target="_blank" rel="noopener noreferrer" className="hover:text-gold-200 transition-colors font-medium">
                WhatsApp: +44 7462 931949
              </a>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                variant="primary"
                size="md"
                fullWidth={false}
                className="px-8 py-3.5"
              >
                <Link href="/register">Find a Live-in Carer</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="md"
                fullWidth={false}
                className="px-8 py-3.5"
              >
                <Link href="/contact">Speak to Our Team</Link>
              </Button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
