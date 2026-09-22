import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import type { Metadata } from "next";

import companionshipImg from "@/assets/open/companionship-long-term-livin.jpeg";

export const metadata: Metadata = {
  alternates: {
    canonical: `/live-in-companionship-care`,
  },
  title: "Live-in Companionship Care at Home UK | Grace & Goodwill",
  description: "Explore live-in companionship care at home with Grace & Goodwill. Find experienced carers for company, practical support, routines and everyday independence.",
};

export default function CompanionshipLiveInCarePage() {
  return (
    <main className="min-h-screen bg-navy-950 pt-16 md:pt-20 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="text-center mb-12">
          <Link href="/services" className="inline-flex items-center text-gold-300/80 hover:text-gold-200 text-sm font-medium mb-6 transition-colors">
            &larr; Back to Services
          </Link>
          <h1 className="main-page-heading mb-5">
            Live-in Companionship Care
          </h1>
          <h2 className="text-xl font-medium text-gold-200 mb-6 font-serif">
            Companionship, reassurance and everyday support at home
          </h2>
          <div className="page-supporting-text mt-6 space-y-4 text-left">
            <p>Not everyone looking for live-in support has a specific diagnosis or complex care need.</p>
            <p>Some people simply feel increasingly isolated, would value more company or need practical help with everyday life while continuing to live independently at home.</p>
            <p>Live-in companionship can provide reassuring one-to-one support while helping someone maintain the routines, interests, relationships and familiar surroundings that matter to them.</p>
            <p>Grace & Goodwill helps individuals and families explore live-in carer profiles, giving you greater visibility over experience, personality, interests, availability and other information that may help you decide who feels right for your home and lifestyle.</p>
          </div>
          <div className="mt-8">
            <Button asChild variant="primary" size="md">
              <Link href="/carers">Explore Live-in Companionship</Link>
            </Button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full max-w-4xl mx-auto mb-16 px-4">
          <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 border-t-2 border-l-2 border-gold-400/30 rounded-tl-[3rem] pointer-events-none -mt-4 -ml-2"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-gold-400/30 rounded-br-[3rem] pointer-events-none -mb-4 -mr-2"></div>
          <div className="relative z-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-300/20 bg-navy-950/40 group">
            <Image
              src={companionshipImg}
              alt="Live-in Companionship Care"
              className="w-full h-auto aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-[2s]"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/5 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="space-y-10">
          {/* Section 1 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Who may benefit from live-in companionship?</h3>
            <p className="page-supporting-text mb-4">Live-in companionship may be suitable for someone who:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "lives alone and would value regular company",
                "feels increasingly isolated or less socially connected",
                "would feel more reassured with another person in the home",
                "needs practical help with meals, shopping or household routines",
                "has become less confident going out independently",
                "would benefit from support attending appointments or activities",
                "has family living further away",
                "wants some everyday support while remaining independent at home",
                "would benefit from continuity and a familiar person around them"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>There does not need to be a particular diagnosis before someone considers companionship support.</p>
              <p className="font-medium text-gold-200">For some people, the most important thing is simply having another person there.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">What can a live-in companion help with?</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>The exact arrangement is agreed directly with the chosen carer and should reflect the individual’s own routines, preferences and lifestyle.</p>
              <p>Depending on the arrangement, companionship may include support with:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "conversation and company",
                "preparing meals",
                "shopping",
                "light household tasks",
                "attending appointments",
                "going for walks or outings",
                "hobbies and interests",
                "maintaining social activities",
                "getting out into the local community",
                "supporting familiar daily routines",
                "other agreed practical support"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Where personal care or additional support is also required, this can be considered when exploring suitable carers with relevant experience.</p>
              <p className="font-medium text-gold-200">The aim is not to take over someone’s life, but to provide support around the way they already choose to live.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Staying connected to the life you already know</h3>
            <div className="page-supporting-text space-y-4">
              <p>For many people, remaining at home means staying close to much more than a property.</p>
              <p>It can mean staying near familiar neighbours, local shops, pets, belongings, memories, routines and the community that feels like home.</p>
              <p>Live-in companionship can help someone continue enjoying those familiar parts of everyday life while having another person nearby for company, practical support and reassurance.</p>
              <p>For families, this may also provide peace of mind when they cannot always be there themselves.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Finding someone you feel comfortable with</h3>
            <div className="page-supporting-text space-y-4 mb-6">
              <p>Compatibility can be especially important when someone will be sharing your home.</p>
              <p>Experience matters, but so can personality, communication style, interests, routines and the way somebody approaches everyday life.</p>
              <p>Grace & Goodwill allows clients and families to explore carer profiles and consider information such as:</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                "profile photograph",
                "introduction video",
                "biography",
                "care experience",
                "skills and training",
                "hobbies and interests",
                "languages",
                "driving status",
                "availability",
                "preferred placements"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[15px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="page-supporting-text space-y-4">
              <p>Clients can use the platform independently or ask the Grace & Goodwill team for support identifying potentially suitable available profiles.</p>
              <p className="font-medium text-gold-200">The final choice remains with the client.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-8 sm:p-10 rounded-[2rem] border border-gold-300/15 shadow-elegant text-center">
            <h3 className="text-2xl font-serif text-gold-50 mb-6">Short-term or ongoing companionship</h3>
            <div className="page-supporting-text space-y-4 text-left max-w-3xl mx-auto mb-8">
              <p>Live-in companionship can be considered for both ongoing and shorter-term arrangements.</p>
              <p>Some families may want longer-term continuity, while others may need support for a temporary period, for example while relatives are away, after a change in circumstances or while considering what type of longer-term support may be most appropriate.</p>
              <p>Grace & Goodwill also supports short-term live-in care, including respite arrangements, subject to suitable carer availability and both parties agreeing to proceed.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="outline" size="md">
                <Link href="/long-term-live-in-care">Explore Long-Term Live-in Care</Link>
              </Button>
              <Button asChild variant="outline" size="md">
                <Link href="/respite-live-in-care">Explore Respite Live-in Care</Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-navy-900/40 p-8 sm:p-12 rounded-[2rem] border border-gold-300/10 shadow-elegant text-center">
          <h3 className="text-2xl font-serif text-gold-50 mb-6">Find companionship that feels right for you</h3>
          <div className="page-supporting-text space-y-4 max-w-3xl mx-auto mb-8">
            <p>Choosing somebody to share your home is a personal decision.</p>
            <p>Whether you are looking for company, practical everyday support or simply greater reassurance at home, Grace & Goodwill helps you explore available live-in carers and make a more informed choice.</p>
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
    </main>
  );
}
