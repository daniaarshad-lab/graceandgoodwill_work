import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Coffee, HeartHandshake, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/live-in-companionship`,
  },
  title: "Live-in Companionship & Everyday Support | Grace & Goodwill",
  description: "Live-in companionship combines social connection with practical everyday assistance, allowing you to live safely and independently at home.",
};

export default function CompanionshipLiveInCarePage() {
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
            Live-in Companionship and Everyday Support
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Not everyone searching for a live-in carer has a specific diagnosis.</p>
            <p>Someone may be physically relatively independent but live alone, feel increasingly isolated, lack confidence managing certain everyday activities or simply feel safer knowing somebody else is in the home.</p>
            <p>Live-in companionship can combine social connection with agreed practical assistance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Coffee className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">More Than Having Someone in the House</h2>
            </div>
            
            <p className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              Good companionship is personal. It might mean:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto mb-6">
              {[
                "Sharing meals", "Having conversations", "Going for walks", 
                "Attending social activities", "Shopping together", "Appointments", 
                "Maintaining hobbies", "Visiting friends or relatives", 
                "Preparing meals", "Light household activities", "Maintaining routines"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[14.5px] text-gold-100/80 font-light font-serif italic mt-auto border-t border-gold-400/10 pt-6">
                For somebody who has spent years living independently, finding a person they actually enjoy sharing their home with can be extremely important.
              </p>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <HeartHandshake className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Personality and Interests Matter</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-4">
              <p>Grace & Goodwill profiles allow clients and families to learn more about carers as individuals.</p>
              <p>Profiles may include information about:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 mt-auto">
              {[
                "Interests", "Personality", "Background", 
                "Previous experience", "Skills", "Introductory video", "Availability"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[14.5px] text-gold-100/80 font-light font-serif italic mt-auto border-t border-gold-400/10 pt-6">
                This gives clients the opportunity to consider compatibility as well as practical experience.
              </p>
          </section>
        </div>

        {/* Action Call */}
        <section className="max-w-4xl mx-auto text-center mt-12">
          <Button asChild variant="primary" size="md" fullWidth={false} className="px-10 py-4 text-base whitespace-nowrap shadow-lg shadow-gold-500/20">
            <Link href="/carers">Explore Companionship Support</Link>
          </Button>
        </section>

      </div>
    </main>
  );
}
