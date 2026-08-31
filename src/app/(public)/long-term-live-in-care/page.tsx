import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Home, Heart, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Long-Term Live-in Care | Grace & Goodwill",
  description: "Consistent, long-term live-in support allowing you or a loved one to remain comfortably at home instead of moving to residential care.",
};

export default function LongTermLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Breadcrumb & Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Link href="/" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-normal mb-6 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="main-page-heading mb-5">
            Long-Term Live-in Care
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>For some people, the need for support is not temporary.</p>
            <p>Long-term live-in care can provide continuity for someone who wants to remain in their own home while having more consistent everyday assistance available.</p>
            <p>Rather than moving into residential care, the individual continues living within familiar surroundings while sharing their home with a live-in carer for an agreed placement.</p>
          </div>
        </div>

        {/* Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* Box 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <Users className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Who May Benefit From Long-Term Live-in Care?</h2>
            </div>

            <p className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">Long-term live-in support may be considered when someone:</p>

            <ul className="space-y-3 mt-auto">
              {[
                "Is finding everyday activities increasingly difficult",
                "No longer feels safe living alone",
                "Requires regular assistance with personal care or mobility",
                "Is living with dementia or another progressive condition",
                "Has a long-term disability",
                "Has ongoing neurological support needs",
                "Requires support following a life-changing injury",
                "Wants an alternative to residential care",
                "Would benefit from greater continuity and companionship at home"
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
                <Home className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Everyday Life Still Matters</h2>
            </div>

            <p className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mb-6">
              Long-term support should not mean that somebody loses the routines and identity that make their life their own. Depending on the arrangement agreed with the carer, support may include everyday activities such as:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Preparing meals", "Personal care", "Mobility", "Shopping",
                "Household tasks", "Attending appointments", "Companionship",
                "Hobbies and interests", "Maintaining relationships", "Supporting established routines"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[14.5px] text-gold-100/80 font-light font-serif italic mt-auto border-t border-gold-400/10 pt-6">
              The objective is not simply to have someone present in the home, but to find a carer whose experience, personality and availability may be appropriate for the individual.
            </p>
          </section>
        </div>

        {/* Conclusion / Matching Box */}
        <section className="max-w-4xl mx-auto bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg">
          <Heart className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-serif text-gold-50 mb-6">Finding the Right Carer for a Longer Placement</h2>
          <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed max-w-2xl mx-auto">
            <p>Living with another person makes compatibility particularly important.</p>
            <p>Clients and families can browse Grace & Goodwill carer profiles and consider factors including experience, interests, communication style, availability and personal background before deciding who they would like to consider.</p>
            <p>Where requested, our team can also provide additional matching support. The client remains in control of the final choice.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild variant="primary" size="md" fullWidth={false}>
              <Link href="/register">Explore Available Live-in Carers</Link>
            </Button>
            <Button asChild variant="outline" size="md" fullWidth={false} className="bg-navy-950/50 hover:bg-navy-900/80">
              <Link href="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}
