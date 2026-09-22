import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Network, Search, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/complex-needs-live-in-care`,
  },
  title: "Live-in Support for Complex Needs | Grace & Goodwill",
  description: "Bespoke live-in care matched precisely to individuals with multiple, overlapping support requirements.",
};

export default function ComplexNeedsLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Live-in Support for Complex Needs
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Some people have several overlapping support requirements rather than one single diagnosis.</p>
            <p>A person may be living with a physical disability alongside neurological symptoms, reduced mobility, communication difficulties, cognitive changes or other long-term needs.</p>
            <p>In these circumstances, finding somebody with relevant experience can be particularly important.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Network className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Looking Beyond a Diagnosis</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-3">
              <p>Two people with the same medical condition may require completely different support.</p>
              <p>The starting point should therefore be the individual:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {[
                "What they can do independently", "Where they would like assistance", 
                "Their normal routines", "Communication preferences", 
                "Mobility requirements", "Lifestyle", "Interests", 
                "Home environment", "Personal preferences", 
                "The type of person they would feel comfortable sharing their home with"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Search className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Finding Relevant Experience</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed space-y-4 mb-6">
              <p>Grace & Goodwill provides access to carer profiles so clients and families can consider carers whose previous experience may be relevant to their circumstances.</p>
              <p>Profiles can include information about experience, skills, interests, biography, introductory video and availability.</p>
              <p>Clients and families can explore available profiles themselves or request additional matching support from our team.</p>
              <p className="font-medium text-gold-100 pt-2">The final choice remains with the client or family.</p>
            </div>
            
            <div className="mt-auto p-5 bg-navy-950/50 rounded-2xl border border-gold-400/10 flex items-start gap-4">
               <AlertCircle className="w-6 h-6 text-gold-400 shrink-0 mt-0.5" />
               <p className="text-[14.5px] text-gold-100/90">
                 If complex support is required following an unexpected change in circumstances, <Link href="/urgent-live-in-care" className="text-gold-300 hover:text-gold-200 underline underline-offset-4">urgent matching support</Link> is also available.
               </p>
            </div>
          </section>
        </div>

        {/* Action Call */}
        <section className="max-w-4xl mx-auto text-center mt-12">
          <Button asChild variant="primary" size="md" fullWidth={false} className="px-10 py-4 text-base whitespace-nowrap shadow-lg shadow-gold-500/20">
            <Link href="/carers">Explore Complex Needs Support</Link>
          </Button>
        </section>

      </div>
    </main>
  );
}
