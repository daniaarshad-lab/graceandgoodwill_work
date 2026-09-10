import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star, Map, Navigation } from "lucide-react";

import ourLocationHeroSection from "@/assets/our-locations/our-location-hero-section.png";

export const metadata: Metadata = {
  title: "Live-in Care Locations Across the UK | Grace & Goodwill",
  description:
    "Grace & Goodwill provides professional live-in care across the UK. Find expert carers in London, Manchester, Birmingham, Bristol and more. Compassionate, independent carers matched to your needs.",
  alternates: { canonical: "https://graceandgoodwill.co.uk/location" },
  openGraph: {
    type: "website",
    url: "https://graceandgoodwill.co.uk/location",
    siteName: "Grace & Goodwill",
    title: "Live-in Care Locations Across the UK | Grace & Goodwill",
    description:
      "Professional live-in care available in every region of the UK. Trusted independent carers in London, Manchester, Birmingham, Bristol and beyond.",
  },
};

const locations = [
  {
    slug: "london",
    city: "London",
    region: "South East",
    tagline: "Premium live-in care across all London boroughs",
    highlight: "Over 32 boroughs covered",
  },
  {
    slug: "newcastle-upon-tyne",
    city: "Newcastle upon Tyne",
    region: "North East",
    tagline: "Dedicated care in the heart of the North East",
    highlight: "Covering Tyne & Wear",
  },
  {
    slug: "gateshead",
    city: "Gateshead",
    region: "North East",
    tagline: "Compassionate live-in support for Gateshead families",
    highlight: "Riverside & beyond",
  },
  {
    slug: "manchester",
    city: "Manchester",
    region: "North West",
    tagline: "Expert carers across Greater Manchester",
    highlight: "All GM boroughs served",
  },
  {
    slug: "birmingham",
    city: "Birmingham",
    region: "West Midlands",
    tagline: "Trusted live-in care throughout the Second City",
    highlight: "City-wide coverage",
  },
  {
    slug: "leeds",
    city: "Leeds",
    region: "Yorkshire",
    tagline: "Quality care across Leeds and West Yorkshire",
    highlight: "City & surrounding areas",
  },
  {
    slug: "liverpool",
    city: "Liverpool",
    region: "North West",
    tagline: "Warm, person-centred care in Merseyside",
    highlight: "All Merseyside areas",
  },
  {
    slug: "sheffield",
    city: "Sheffield",
    region: "Yorkshire",
    tagline: "Reliable live-in carers for Sheffield & surrounds",
    highlight: "South Yorkshire covered",
  },
  {
    slug: "nottingham",
    city: "Nottingham",
    region: "East Midlands",
    tagline: "Personalised care in Nottingham city & county",
    highlight: "City & county served",
  },
  {
    slug: "bristol",
    city: "Bristol",
    region: "South West",
    tagline: "Trusted independent carers throughout Bristol",
    highlight: "BS postcodes & beyond",
  },
];

const regions = [
  "All regions",
  "South East",
  "North East",
  "North West",
  "Yorkshire",
  "West Midlands",
  "East Midlands",
  "South West",
];

export default function LocationIndexPage() {
  return (
    <main className="relative min-h-screen bg-navy-950 overflow-hidden">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] rounded-full bg-gold-500/5 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-navy-800/40 blur-[120px]"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-28 lg:pt-24 lg:pb-36 bg-[#6B7291]">
        {/* Soft asymmetric curve at the bottom to transition into navy */}
        <svg
          className="absolute bottom-0 left-0 w-full text-navy-950 translate-y-[1px]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,120 C320,40 820,120 1440,20 V120 H0 Z" />
        </svg>

        <div className="container-wrapper relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-['Cinzel'] text-4xl sm:text-5xl lg:text-[54px] font-semibold text-white leading-[1.1] tracking-tight mb-6">
                Live in Care, UK-Wide
              </h1>

              {/* Decorative wave underline */}
              <div className="w-16 h-2 mb-6 mx-auto lg:mx-0">
                <svg viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#C2A476" strokeWidth="2" fill="transparent" />
                </svg>
              </div>

              <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Live in care gives you all the support you need while remaining
                in the comfort of your own home, close to family and friends. We
                are able to provide live in care in any location in the UK and
                for all care needs.
              </p>
            </div>

            {/* Right — UK map SVG illustration inside a beige blob */}
            <div className="flex-shrink-0 relative mt-16 lg:mt-0">
              
              {/* Floating Location Icons */}
              <div className="absolute -top-8 left-10 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_4s_infinite]">
                <MapPin className="w-6 h-6 text-gold-500" />
              </div>
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white p-5 rounded-full shadow-md z-20 animate-[bounce_5s_infinite_100ms]">
                <Map className="w-8 h-8 text-gold-400" />
              </div>
              <div className="absolute top-0 right-6 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_6s_infinite_200ms]">
                <Navigation className="w-6 h-6 text-gold-400" />
              </div>

              <div 
                className="relative w-[300px] sm:w-[380px] lg:w-[460px] aspect-[1.15] shadow-xl overflow-hidden"
                style={{
                  borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%",
                }}
              >
                <Image
                  src={ourLocationHeroSection}
                  alt="UK Wide Live-in Care Coverage"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Region Pills ──────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="container-wrapper">
          <p className="text-center text-white/40 text-sm font-medium uppercase tracking-widest mb-6">
            Browse by Region
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {regions.map((region, i) => (
              <span
                key={region}
                className={`px-5 py-2 rounded-full text-sm font-medium border cursor-default transition-all ${
                  i === 0
                    ? "bg-[#D4AF7A] text-navy-950 border-[#D4AF7A] font-semibold"
                    : "border-gold-400/20 text-white/60 hover:border-gold-400/50 hover:text-white/80 hover:bg-gold-400/5"
                }`}
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Cards Grid ───────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container-wrapper">
          <div className="text-center mb-12">
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-semibold text-white mb-3">
              Our Locations
            </h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              Select a city to explore our live-in care services, local coverage
              and how we can help you or your loved one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {locations.map((loc, i) => (
              <Link
                key={loc.slug}
                href={`/location/${loc.slug}`}
                className="group relative flex flex-col rounded-2xl border border-gold-400/15 bg-gradient-to-br from-navy-800/60 to-navy-950/80 backdrop-blur-sm overflow-hidden hover:border-gold-400/40 hover:shadow-lg hover:shadow-gold-400/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top accent bar */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#D4AF7A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6 flex flex-col gap-3 flex-1">
                  {/* Region badge */}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-400/60">
                    {loc.region}
                  </span>

                  {/* Map pin icon */}
                  <div className="w-9 h-9 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center group-hover:bg-gold-400/20 transition-colors">
                    <MapPin className="w-4 h-4 text-[#D4AF7A]" />
                  </div>

                  {/* City name */}
                  <h3 className="font-['Cinzel'] text-lg font-semibold text-white group-hover:text-[#D4AF7A] transition-colors leading-snug">
                    {loc.city}
                  </h3>

                  {/* Tagline */}
                  <p className="text-white/50 text-[13px] leading-relaxed flex-1">
                    {loc.tagline}
                  </p>

                  {/* Highlight chip */}
                  <div className="inline-flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF7A]/60" />
                    <span className="text-[11px] text-gold-300/70 font-medium">
                      {loc.highlight}
                    </span>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 py-4 border-t border-gold-400/10 flex items-center justify-between">
                  <span className="text-[12px] text-white/40 font-medium">
                    View services
                  </span>
                  <ArrowRight className="w-4 h-4 text-gold-300/50 group-hover:text-[#D4AF7A] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-16 border-t border-gold-400/10">
        <div className="container-wrapper text-center">
          <p className="text-gold-300/60 text-sm uppercase tracking-widest font-semibold mb-4">
            Don&apos;t see your area?
          </p>
          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-semibold text-white mb-4">
            We Cover the Whole of the UK
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto mb-8">
            Our network of independent carers extends across every region. Get
            in touch and we&apos;ll find the right carer near you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#b59469] text-navy-950 font-semibold text-sm hover:bg-[#a08054] hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/20"
          >
            Speak to our team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
