import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Brain, Heart, Home, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/dementia-and-alzheimers-live-in-care`,
  },
  title: "Dementia and Alzheimer's Live-in Care | Grace & Goodwill",
  description: "Live-in care can allow somebody living with dementia to continue living safely in their own familiar home with expert support.",
};

export default function DementiaLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="max-w-7xl mx-auto text-center mb-20">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Dementia and Alzheimer&apos;s Live-in Care
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Living with dementia does not automatically mean someone has to leave their own home.</p>
            <p>For many people, familiar surroundings, established routines and recognisable possessions can become increasingly important as memory, orientation and confidence change.</p>
            <p>Live-in care can allow somebody to continue living at home while receiving additional everyday support.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Brain className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Support That Reflects the Individual</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-3">
              <p>No two people experience dementia in exactly the same way.</p>
              <p>Some individuals may remain highly independent but need reassurance, companionship or help remembering everyday tasks.</p>
              <p>Others may require more extensive assistance with:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Personal care", "Medication routines (where agreed)", "Meals and hydration", 
                "Mobility", "Household tasks", "Appointments", 
                "Maintaining familiar routines", "Companionship", "Communication", 
                "Orientation and reassurance", "Social activities"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[15px] text-gold-100 font-medium italic mt-auto border-t border-gold-400/10 pt-6">
              The support provided will depend on the arrangement agreed directly between the client and the carer.
            </p>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Home className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Familiarity and Routine</h2>
            </div>
            
            <p className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              Changes of environment can sometimes be particularly difficult for people living with dementia. Remaining at home may allow someone to stay close to:
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "Familiar rooms and possessions",
                "Family",
                "Neighbours",
                "Pets",
                "Established routines",
                "Local surroundings",
                "Memories associated with their home"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[15px] text-gold-100 font-medium italic mt-auto border-t border-gold-400/10 pt-6">
              This can be one reason families explore live-in care as an alternative to residential care.
            </p>
          </section>
        </div>

        {/* Conclusion / Matching Box */}
        <section className="max-w-7xl mx-auto bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg">
          <Users className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-gold-50 mb-6">Choosing a Carer With Relevant Experience</h2>
          
          <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed max-w-2xl mx-auto">
            <p>Families can browse Grace & Goodwill carer profiles and consider carers with relevant dementia experience.</p>
            <p>Profiles can help families compare information including:</p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 py-2">
              {[
                "previous experience", "skills", "interests", "communication style", 
                "biography", "introductory video", "availability"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>Families remain in control of who they choose to consider.</p>
            <p className="mt-4 pt-4 border-t border-gold-400/10">
              If circumstances change suddenly and support is required quickly, our Urgent Matching Team can also help families explore available carers. Where a suitable carer is available and arrangements can be completed, someone may be able to start within 24 hours.
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="md" fullWidth={false} className="px-8 whitespace-nowrap">
              <Link href="/carers">Explore Live-in Carers</Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth={false} className="px-8 whitespace-nowrap bg-navy-950/50 hover:bg-navy-900/80">
              <Link href="/urgent-live-in-care">Need Support Urgently?</Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
