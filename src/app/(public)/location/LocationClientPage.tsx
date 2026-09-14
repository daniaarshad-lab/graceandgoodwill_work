"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Map, Navigation, ChevronUp, ChevronDown } from "lucide-react";

import ourLocationHeroSection from "@/assets/our-locations/our-location-hero-section.png";
import { regions as ukRegions, Region } from "@/data/locationsData";

const allRegionNames = ["All regions", ...ukRegions.map((r) => r.name)];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Region card with exclusive accordion (one county open at a time) ────────
function RegionCard({ region }: { region: Region }) {
  const [openCounty, setOpenCounty] = useState<string | null>(null);

  const toggle = (countyName: string) =>
    setOpenCounty((prev) => (prev === countyName ? null : countyName));

  return (
    <div className="rounded-2xl border border-gold-400/15 bg-navy-900/20 backdrop-blur-sm overflow-hidden hover:border-gold-400/25 transition-all duration-300">
      <div className="p-6">
        <h3 className="font-['Cinzel'] text-base font-semibold text-[#D4AF7A] mb-4 tracking-wide">
          {region.name}
        </h3>

        <div>
          {region.counties.map((county) => {
            const isOpen = openCounty === county.name;
            const countySlug = slugify(county.name);
            return (
              <div key={county.name} className="border-t border-gold-400/10 first:border-t-0">
                {/* County header row */}
                <button
                  onClick={() => toggle(county.name)}
                  className="w-full flex items-center justify-between py-3 px-1 text-left group"
                >
                  <span className={`text-sm font-medium transition-colors duration-200 ${isOpen ? "text-[#D4AF7A]" : "text-white/70 group-hover:text-white"}`}>
                    {county.name}
                  </span>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-[#D4AF7A] shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gold-400/40 shrink-0 group-hover:text-gold-300 transition-colors" />
                  }
                </button>

                {/* Towns list — links to /location/[county-slug]/[town-slug] */}
                {isOpen && (
                  <ul className="pb-3 pl-2 space-y-1">
                    {county.towns.map((town) => (
                      <li key={town}>
                        <Link
                          href={`/location/${countySlug}/${slugify(town)}`}
                          className="block text-[13px] text-[#b59469] hover:text-white transition-colors duration-150 pl-1 py-0.5"
                        >
                          {town}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function LocationIndexPage() {
  const [activeRegion, setActiveRegion] = useState("All regions");

  const filteredRegions =
    activeRegion === "All regions"
      ? ukRegions
      : ukRegions.filter((r) => r.name === activeRegion);

  return (
    <main className="relative min-h-screen bg-navy-950 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] rounded-full bg-gold-500/5 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-navy-800/40 blur-[120px]" />

      {/* ── Hero ── */}
      <section className="relative pt-16 pb-28 lg:pt-24 lg:pb-36 bg-[#6B7291]">
        <svg className="absolute bottom-0 left-0 w-full text-navy-950 translate-y-[1px]" preserveAspectRatio="none" viewBox="0 0 1440 120" fill="currentColor">
          <path d="M0,120 C320,40 820,120 1440,20 V120 H0 Z" />
        </svg>
        <div className="container-wrapper relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-['Cinzel'] text-4xl sm:text-5xl lg:text-[54px] font-semibold text-white leading-[1.1] tracking-tight mb-6">
                Live in Care, UK-Wide
              </h1>
              <div className="w-16 h-2 mb-6 mx-auto lg:mx-0">
                <svg viewBox="0 0 60 10" fill="none"><path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#C2A476" strokeWidth="2" fill="transparent" /></svg>
              </div>
              <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Live in care gives you all the support you need while remaining in the comfort of your own home, close to family and friends. We are able to provide live in care in any location in the UK and for all care needs.
              </p>
            </div>
            <div className="flex-shrink-0 relative mt-16 lg:mt-0">
              <div className="absolute -top-8 left-10 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_4s_infinite]"><MapPin className="w-6 h-6 text-gold-500" /></div>
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white p-5 rounded-full shadow-md z-20 animate-[bounce_5s_infinite_100ms]"><Map className="w-8 h-8 text-gold-400" /></div>
              <div className="absolute top-0 right-6 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_6s_infinite_200ms]"><Navigation className="w-6 h-6 text-gold-400" /></div>
              <div className="relative w-[300px] sm:w-[380px] lg:w-[460px] aspect-[1.15] shadow-xl overflow-hidden" style={{ borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%" }}>
                <Image src={ourLocationHeroSection} alt="UK Wide Live-in Care Coverage" fill className="object-cover object-center" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Region Filter Pills ── */}
      <section className="py-10">
        <div className="container-wrapper">
          <p className="text-center text-white/40 text-sm font-medium uppercase tracking-widest mb-6">Browse by Region</p>
          <div className="flex flex-wrap justify-center gap-3">
            {allRegionNames.map((name) => {
              const isActive = activeRegion === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveRegion(name)}
                  className={`group relative overflow-hidden px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF7A]/60
                    ${isActive
                      ? "bg-gradient-to-r from-[#D4AF7A] via-[#e8c98a] to-[#D4AF7A] text-navy-950 border-[#D4AF7A] font-semibold shadow-[0_0_18px_rgba(212,175,122,0.45)] scale-105"
                      : "border-gold-400/20 text-white/60 hover:border-[#b59469] hover:text-navy-950 hover:scale-105 hover:shadow-[0_0_14px_rgba(181,148,105,0.35)] hover:bg-[#b59469]"
                    }`}
                >
                  {!isActive && <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />}
                  {isActive && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full animate-ping bg-[#D4AF7A]/20" style={{ animationDuration: "1.8s" }} />}
                  <span className="relative z-10">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Region + County Accordion Cards ── */}
      <section className="pb-20">
        <div className="container-wrapper">
          <div className="text-center mb-10">
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-semibold text-white mb-3">
              {activeRegion === "All regions" ? "All Regions" : activeRegion}
            </h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              Click on a county to see the towns and areas we cover.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredRegions.map((region) => (
              <RegionCard key={region.name} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 border-t border-gold-400/10">
        <div className="container-wrapper text-center">
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-semibold text-white mb-4">Speak to one of our experts</h2>
          <p className="text-white/50 text-base max-w-lg mx-auto mb-8">Our friendly experts are here to help from 9am to 7pm, 7 days a week.</p>
          <a href="tel:02045240108" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#b59469] text-navy-950 font-semibold text-base hover:bg-[#a08054] hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/20 mb-6">
            020 4524 0108
          </a>
          <div className="mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 text-gold-300/70 hover:text-white text-sm font-medium transition-colors duration-200">
              Or send us a message <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
