import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { UserCheck, Zap, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disability and Young Adult Live-in Support | Grace & Goodwill",
  description: "Live-in support enabling younger adults and those with physical disabilities to maintain independence and live life on their own terms.",
};

export default function DisabilityLiveInSupportPage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Link href="/" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="main-page-heading mb-5">
            Disability and Young Adult Live-in Support
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Live-in care is not only for older people.</p>
            <p>Adults living with physical disabilities or long-term support needs may also choose live-in support because they want assistance available while continuing to live in their own home and maintain as much independence as possible.</p>
            <p>The person remains at the centre of decisions about their life, routines and support.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Zap className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Supporting Independence</h2>
            </div>
            
            <div className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              <p>Different people want different things from a live-in arrangement.</p>
              <p>For one person, support may mainly involve mobility and practical assistance. For another, it may include help with personal care, preparing meals, household activities, attending appointments or accessing the community.</p>
              <p>A live-in arrangement may include agreed support with:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {[
                "Personal care & dressing", "Mobility & transfers", "Meals & shopping", 
                "Household tasks", "Appointments", "Work or education routines", 
                "Hobbies & social activities", "Companionship", "Accessing the community"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
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
                <UserCheck className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Comfort and Compatibility</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-4">
              <p>
                For younger adults in particular, personality and lifestyle compatibility can matter just as much as practical experience.
              </p>
              <p>Grace & Goodwill carer profiles allow clients to look beyond a basic list of qualifications.</p>
              <p>Clients can consider a carer&apos;s:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Experience",
                "Biography",
                "Interests",
                "Skills",
                "Communication style",
                "Introductory video",
                "Availability"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[15px] text-gold-100 font-medium italic mt-auto border-t border-gold-400/10 pt-6">
              The client decides who they would like to consider. Where requested, Grace & Goodwill can also provide additional matching support.
            </p>
          </section>
        </div>

        {/* Conclusion / Matching Box */}
        <section className="max-w-4xl mx-auto text-center mt-12">
          <Button asChild variant="primary" size="md" fullWidth={false} className="px-10 py-4 text-base whitespace-nowrap shadow-lg shadow-gold-500/20">
            <Link href="/carers">Explore Disability Live-in Support</Link>
          </Button>
        </section>

      </div>
    </main>
  );
}
