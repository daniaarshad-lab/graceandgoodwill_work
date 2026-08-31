import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { AlertCircle, Clock, FileCheck, Search, Users, ShieldCheck, Heart, CalendarCheck, Phone, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urgent & Rapid Live-in Care | Grace & Goodwill",
  description: "When the need for live-in support develops with almost no warning, we can often match families with carers ready to start within 24 hours.",
};

export default function UrgentLiveInCarePage() {
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
            Need Live-in Care Urgently?
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Sometimes the need for live-in support develops with almost no warning.</p>
            <p>A person may be medically ready to leave hospital sooner than expected. Someone may have experienced a stroke, fall, fracture, surgery or sudden change in mobility. A family carer may become ill or exhausted. An existing carer may become unexpectedly unavailable. Or a family may suddenly realise that the person they love can no longer safely manage at home without additional support.</p>
            <p className="text-gold-100 font-medium pt-2">Grace & Goodwill provides urgent live-in care matching across the UK, including situations where a family is hoping to find a suitable carer who may be able to start within 24 hours.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Clock className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Can a Carer Start Within 24 Hours?</h2>
            </div>
            
            <div className="text-[15.5px] text-gold-100/90 leading-relaxed mb-6 space-y-3">
              <p className="font-medium text-gold-100 text-lg">Potentially, yes.</p>
              <p>Where a suitable carer is available and the necessary arrangements can be completed quickly, a live-in carer may be able to start within 24 hours.</p>
              <p>However, this cannot be guaranteed in every case. Timing will depend on factors including:</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {[
                "Location", "Carer availability", "Individual's requirements", 
                "Travel arrangements", "Completion of documentation", 
                "Client & carer agreement"
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
                <AlertCircle className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Situations For Urgent Support</h2>
            </div>
            
            <p className="text-[15.5px] text-gold-100/90 leading-relaxed space-y-4 mb-6">
              Families contact us following situations such as:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 mt-auto">
              {[
                "Urgent hospital discharge", "Stroke", "Falls or fractures", 
                "Surgery", "Sudden change in mobility", "Dementia-related changes", 
                "Family-carer illness", "Family-carer exhaustion", "Loss of existing carer",
                "Alternative to residential care", "Elderly parent unsafe alone",
                "Emergency respite", "Unexpected health changes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* The Process */}
        <section className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-gold-50 text-center mb-10">What Happens When You Contact Us?</h2>
          <p className="text-center text-gold-100/80 mb-12">When the situation is urgent, we keep the process focused.</p>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gold-500/20 before:to-transparent">
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-950 border-4 border-gold-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <Search className="w-5 h-5 text-gold-400" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-6 sm:p-8 rounded-3xl border border-gold-300/10 shadow-elegant">
                <h3 className="font-serif text-xl text-gold-50 mb-2">1. Tell Us What Has Happened</h3>
                <p className="text-gold-100/80 text-[14.5px] leading-relaxed">We will need to understand the immediate circumstances, required start date, location and the type of support being sought.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-950 border-4 border-gold-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <Users className="w-5 h-5 text-gold-400" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-6 sm:p-8 rounded-3xl border border-gold-300/10 shadow-elegant">
                <h3 className="font-serif text-xl text-gold-50 mb-2">2. Review Suitable Carers</h3>
                <p className="text-gold-100/80 text-[14.5px] leading-relaxed">Available carer profiles can then be considered against the individual&apos;s requirements and preferences.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-950 border-4 border-gold-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <Heart className="w-5 h-5 text-gold-400" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-6 sm:p-8 rounded-3xl border border-gold-300/10 shadow-elegant">
                <h3 className="font-serif text-xl text-gold-50 mb-2">3. Review the Profiles</h3>
                <p className="text-gold-100/80 text-[14.5px] leading-relaxed">The client or family can consider relevant information about potentially suitable carers.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-950 border-4 border-gold-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-6 sm:p-8 rounded-3xl border border-gold-300/10 shadow-elegant">
                <h3 className="font-serif text-xl text-gold-50 mb-2">4. Decide Who You Would Like to Consider</h3>
                <p className="text-gold-100/80 text-[14.5px] leading-relaxed">The client or family remains in control of the final choice. The carer also chooses whether they wish to accept the placement.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-navy-950 border-4 border-gold-500/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-gold-400 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                <FileCheck className="w-5 h-5 text-gold-400" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-6 sm:p-8 rounded-3xl border border-gold-300/10 shadow-elegant">
                <h3 className="font-serif text-xl text-gold-50 mb-2">5. Complete the Necessary Arrangements</h3>
                <p className="text-gold-100/80 text-[14.5px] leading-relaxed">If both parties wish to proceed, the necessary placement arrangements can then be completed.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Available 24/7 & CTA */}
        <section className="max-w-4xl mx-auto bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg">
          <Clock className="w-12 h-12 text-gold-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-gold-50 mb-6">Available 24 Hours a Day</h2>
          <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed max-w-2xl mx-auto">
            <p>Urgent situations do not always happen during normal office hours.</p>
            <p>Our Urgent Matching Team can be contacted 24 hours a day for urgent matching enquiries.</p>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="lg" className="px-8 whitespace-nowrap shadow-lg shadow-gold-500/20">
              <Link href="tel:+44000000000" className="flex items-center gap-2"><Phone className="w-5 h-5"/> Call Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 whitespace-nowrap bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] border-[#25D366]/30">
              <Link href="#" className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/> WhatsApp Emergency Support</Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth={false} className="px-8 whitespace-nowrap bg-navy-950/50 hover:bg-navy-900/80">
              <Link href="/contact">Request Urgent Matching</Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
