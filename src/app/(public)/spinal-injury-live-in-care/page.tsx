import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { MoveRight, UserCog, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/spinal-injury-live-in-care`,
  },
  title: "Spinal Injury and Mobility Support | Grace & Goodwill",
  description: "Specialised live-in support for spinal injuries and mobility changes, empowering you to maintain control over your lifestyle at home.",
};

export default function SpinalInjuryLiveInCarePage() {
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
            Spinal Injury and Mobility Support
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>A spinal injury or significant change in mobility can affect many aspects of everyday life, but it does not necessarily mean someone must give up living within their own home.</p>
            <p>Live-in support may provide practical assistance while allowing the individual to retain control over their routines, relationships, activities and lifestyle.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <UserCog className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Individual Requirements Vary</h2>
            </div>
            
            <div className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              <p>Some individuals may require relatively limited practical assistance.</p>
              <p>Others may need more extensive support.</p>
              <p>Depending on the arrangement agreed with the carer and the carer&apos;s experience, this may include:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto mb-6">
              {[
                "Personal care & dressing", "Mobility & transfers", "Meal preparation", 
                "Household tasks", "Shopping", "Attending appointments", 
                "Accessing the community", "Companionship", "Maintaining work & interests",
                "Assistance with established routines"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[14.5px] text-gold-100/80 font-light font-serif italic mt-auto border-t border-gold-400/10 pt-6">
                Where specialist techniques or equipment are involved, clients should consider carers with appropriate relevant experience and competence.
              </p>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Users className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Choosing a Carer</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-4">
              <p>Grace & Goodwill enables clients and families to browse live-in carer profiles and consider relevant skills, experience, interests, communication style and availability.</p>
              <p>The client remains in control of the final choice.</p>
              <p>Our team can also provide additional matching support where requested.</p>
            </div>
            
            <div className="mt-auto">
               <Button asChild variant="outline" size="sm" className="bg-navy-950/50 hover:bg-navy-900/80 group/btn">
                <Link href="/carers" className="flex items-center gap-2">
                  Browse Carer Profiles
                  <MoveRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Action Call */}
        <section className="max-w-7xl mx-auto text-center mt-12">
          <Button asChild variant="primary" size="md" fullWidth={false} className="px-10 py-4 text-base whitespace-nowrap shadow-lg shadow-gold-500/20">
            <Link href="/carers">Explore Spinal Injury Live-in Support</Link>
          </Button>
        </section>

      </div>
    </main>
  );
}
