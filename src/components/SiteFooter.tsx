"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import integrityImg from "@/assets/open/integrity.jpeg";
import compassionImg from "@/assets/open/compassion.jpeg";
import purposeImg from "@/assets/open/purpose.jpeg";
import trustImg from "@/assets/open/trust.jpeg";

/* Artwork is square with the icon + wording sitting in a centred horizontal
   band, so each tile crops the empty top/bottom rather than letterboxing it. */
const values = [
  {
    title: "Integrity",
    alt: "Integrity — morally and ethically guided",
    image: integrityImg,
  },
  {
    title: "Compassion",
    alt: "Compassion — a duty to care, a promise to serve",
    image: compassionImg,
  },
  {
    title: "Purpose",
    alt: "Purpose — care with meaning, impact that lasts",
    image: purposeImg,
  },
  {
    title: "Trust",
    alt: "Trust — built on honesty, strengthened by reliability",
    image: trustImg,
  },
];

function SiteFooter() {
  return (
    <footer className="relative bg-navy-950">
      {/* Top gold accent line */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.4) 70%, transparent)",
        }}
      />

      {/* ── Values Row ─────────────────────────────────────────────────── */}
      <div className="container-wrapper mb-6 sm:mb-8 pt-6 sm:pt-8">
        {/* Width is capped per breakpoint so the tiles stay modest on wide
            screens — the wording is part of the artwork, so tile width is the
            only thing controlling how large it reads. */}
        <div className="mx-auto grid max-w-[18rem] grid-cols-1 gap-2.5 sm:max-w-xl sm:grid-cols-2 sm:gap-4 lg:max-w-6xl lg:grid-cols-4">
          {values.map((val) => (
            <div
              key={val.title}
              className="group relative w-full aspect-[7/3] overflow-hidden rounded-lg sm:rounded-xl ring-1 ring-gold-400/10 transition-all duration-300 hover:ring-gold-400/25"
            >
              <Image
                src={val.image}
                alt={val.alt}
                fill
                quality={90}
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 290px, 288px"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center mb-6 sm:mb-8 sm:px-6 mt-6 sm:mt-0">
        <div className="w-full max-w-4xl flex items-center gap-3 px-4 ">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(270deg, rgba(160,128,84,0.18), transparent)",
            }}
          />
          <div className="flex items-center gap-1">
            <div className="w-[3px] h-[3px] rounded-full bg-gold-400/25" />
            <div className="w-1 h-1 rounded-full bg-gold-400/40" />
            <div className="w-[3px] h-[3px] rounded-full bg-gold-400/25" />
          </div>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(160,128,84,0.18), transparent)",
            }}
          />
        </div>
      </div>

      {/* ── Company Info ───────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-6">
        {/* Legal Links & Cookie Preferences */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] mb-4">
          <Link
            href="/privacy"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Privacy Policy
          </Link>
          <span className="text-gold-100/20">•</span>
          <Link
            href="/terms"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Website &amp; Platform Terms
          </Link>
          <span className="text-gold-100/20">•</span>
          <Link
            href="/agency-introduction-terms"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Agency Introduction Terms
          </Link>
          <span className="text-gold-100/20">•</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new Event("gg:open-cookie-preferences"));
            }}
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light cursor-pointer hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Cookie Preferences
          </button>
        </div>

        {/* Copyright | Disclaimer | Registration — stacked until there is
            genuinely room for three columns. Only the two short lines may
            hold nowrap; the disclaimer always wraps. */}
        <div className="flex flex-col xl:flex-row items-center xl:justify-between w-full gap-2 xl:gap-6 text-center xl:text-left">
          {/* Copyright */}
          <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light xl:whitespace-nowrap">
            <span className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mr-1.5">
              Copyright
            </span>
            &copy; Grace &amp; Goodwill Ltd 2026. All rights reserved.
          </p>

          {/* Disclaimer — centre */}
          <p className="max-w-prose xl:max-w-none text-[10px] sm:text-[11px] text-gold-100/30 font-light text-balance text-center">
            Grace &amp; Goodwill is an introductory agency for independent
            live-in carers and does not provide regulated care services.
          </p>

          {/* Registration */}
          <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light xl:whitespace-nowrap xl:text-right">
            <span className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mr-1.5">
              Company Registration
            </span>
            Company No. 16011465
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.12) 30%, rgba(212,175,55,0.2) 50%, rgba(212,175,55,0.12) 70%, transparent)",
        }}
      />
    </footer>
  );
}

export default React.memo(SiteFooter);
