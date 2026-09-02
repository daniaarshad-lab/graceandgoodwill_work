import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Activity, BrainCircuit, Heart, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/brain-injury-live-in-care`,
  },
  title: "Brain Injury and Neurological Live-in Support | Grace & Goodwill",
  description: "Live-in support enabling individuals with acquired brain injuries or neurological conditions to continue living safely at home.",
};

export default function BrainInjuryLiveInCarePage() {
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
            Brain Injury and Neurological Support
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>The impact of a brain injury or neurological condition can vary considerably from one person to another.</p>
            <p>Changes may affect mobility, memory, communication, behaviour, fatigue, concentration, confidence or the ability to manage everyday activities independently.</p>
            <p>For some people, live-in support can make it possible to continue living at home while receiving the practical assistance they require.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <BrainCircuit className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Support Based Around the Person</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-3">
              <p>Someone living with an acquired brain injury may require a very different type of support from somebody living with Parkinson&apos;s disease, multiple sclerosis or another neurological condition.</p>
              <p>The arrangement should therefore reflect the individual rather than simply the diagnosis. Depending on the person and the agreement made with the carer, support may include:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {[
                "Personal care & mobility", "Meal preparation", "Household activities", 
                "Appointments", "Maintaining routines", "Companionship", 
                "Community activities", "Communication support", "Prompting & organisation",
                "Support following rehabilitation"
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
                <Activity className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Relevant Experience Matters</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-4">
              <p>Families and clients can search Grace & Goodwill profiles for carers whose previous experience may be relevant to the individual&apos;s circumstances.</p>
              <p>Profiles allow clients to consider the person behind the experience as well, including their interests, personality, background, communication style and availability.</p>
              <p className="mt-4 pt-4 border-t border-gold-400/10 text-gold-100 font-medium">The client or family decides who they would like to consider.</p>
            </div>
            
            <div className="mt-auto">
               <Button asChild variant="outline" size="sm" className="bg-navy-950/50 hover:bg-navy-900/80">
                <Link href="/carers">Explore Carer Profiles &rarr;</Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Urgent Recovery / Post-Hospital Box */}
        <section className="max-w-4xl mx-auto bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg">
          <Clock className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-gold-50 mb-6">Support Following Sudden Change</h2>
          
          <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed max-w-2xl mx-auto">
            <p>Brain injury can sometimes create an immediate need for support, particularly after stroke, trauma, rehabilitation or hospital discharge.</p>
            <p>Where support is required urgently, Grace & Goodwill can help identify available carers for the family to consider.</p>
            <p className="text-gold-100 font-medium pt-2">
              Where a suitable carer is available and arrangements can be completed, a live-in carer may be able to start within 24 hours.
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="md" fullWidth={false} className="px-8 whitespace-nowrap">
              <Link href="/carers">Explore Brain Injury & Neurological Support</Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth={false} className="px-8 whitespace-nowrap bg-navy-950/50 hover:bg-navy-900/80">
              <Link href="/urgent-live-in-care">Need Urgent Support?</Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
