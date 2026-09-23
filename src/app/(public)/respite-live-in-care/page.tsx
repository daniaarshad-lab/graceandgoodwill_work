import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { Coffee, Clock, ShieldCheck, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `/respite-live-in-care`,
  },
  title: "Respite Live-in Care | Grace & Goodwill",
  description: "Temporary live-in care allowing family carers to take a holiday, rest, or handle unexpected situations while their loved one remains safely at home.",
};

export default function RespiteLiveInCarePage() {
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
            Respite Live-in Care
          </h1>
          <div className="page-supporting-text mt-6 space-y-4">
            <p>Live-in care does not always need to be a permanent arrangement.</p>
            <p>Sometimes a family simply needs someone suitable to step in for a defined period.</p>
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
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Giving Family Carers Time Away</h2>
            </div>

            <div className="text-[15px] text-gold-100/75 font-light font-serif leading-relaxed space-y-4">
              <p>Caring for somebody over a prolonged period can be physically and emotionally demanding.</p>
              <p>Taking time away does not mean that a family member cares any less.</p>
              <p>Having temporary live-in support can allow a family carer to rest, travel, attend to other responsibilities or simply recover while the person they support remains within their familiar home.</p>
            </div>
          </section>

          {/* Box 2 */}
          <section className="bg-gradient-to-br from-navy-900/60 to-navy-950/80 p-10 sm:p-14 rounded-[3rem] border border-gold-300/15 shadow-elegant relative overflow-hidden flex flex-col group">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold-500/10 rounded-full blur-[40px] group-hover:bg-gold-500/20 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex items-center gap-5 mb-8 border-b border-gold-400/10 pb-5">
              <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center border border-gold-400/20 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0">
                <ShieldCheck className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="text-[26px] font-serif text-gold-50 leading-tight">Respite live-in care can be considered when:</h2>
            </div>

            <ul className="space-y-3 mt-auto">
              {[
                "A family carer needs a holiday",
                "Somebody needs a weekend away",
                "A family carer needs time to rest and recover",
                "Another carer becomes temporarily unavailable",
                "An existing arrangement breaks down unexpectedly",
                "Somebody needs temporary support following illness",
                "Additional support is needed after hospital treatment",
                "A family wants to trial live-in care before considering a longer arrangement"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-400/60 shrink-0"></div>
                  <span className="text-[14px] font-light font-serif text-gold-100/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Urgent Respite & Matching Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 max-w-5xl mx-auto">
          {/* Finding Temporary Support */}
          <section className="bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg flex flex-col">
            <Heart className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-serif text-gold-50 mb-6">Finding Temporary Support</h2>
            <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mx-auto">
              <p>Grace & Goodwill allows families to explore live-in carer profiles and consider carers whose availability matches the dates required.</p>
              <p>Families can compare relevant experience, skills, interests, background and availability before deciding who they would like to consider.</p>
              <p>Where additional help is needed, our team can provide matching support.</p>
            </div>
            <div className="mt-auto pt-8">
              <Button asChild variant="primary" size="md" className="whitespace-nowrap">
                <Link href="/carers">Find Respite Live-in Support</Link>
              </Button>
            </div>
          </section>

          {/* Urgent Respite */}
          <section className="bg-gradient-to-b from-navy-800/40 to-navy-900/60 p-10 sm:p-14 rounded-[3rem] border border-gold-300/10 text-center relative shadow-lg flex flex-col">
            <Clock className="w-10 h-10 text-gold-400 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-serif text-gold-50 mb-6">When Respite Becomes Urgent</h2>
            <div className="space-y-4 text-[15px] text-gold-100/75 font-light font-serif leading-relaxed mx-auto">
              <p>Sometimes respite cannot be planned weeks in advance.</p>
              <p>A family carer may suddenly become ill, an existing carer may become unavailable or circumstances may change unexpectedly.</p>
              <p>Grace & Goodwill can support urgent searches in these situations. Where a suitable carer is available and the required arrangements can be completed, somebody may be able to start within 24 hours.</p>
            </div>
            <div className="mt-auto pt-8">
              <Button asChild variant="outline" size="md" className="whitespace-nowrap bg-navy-950/50 hover:bg-navy-900/80">
                <Link href="/urgent-live-in-care">Urgent Matching Support</Link>
              </Button>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
