"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import integrityIcon from "@/assets/open/value-icon-integrity.png";
import compassionIcon from "@/assets/open/value-icon-compassion.png";
import purposeIcon from "@/assets/open/value-icon-purpose.png";
import trustIcon from "@/assets/open/value-icon-trust.png";

type ValueItem = {
  title: string;
  text: string;
  icon: StaticImageData;
  /* Optical size correction. The icons share one CSS box, but an open, thin
     glyph reads smaller than a solid one at the same measured size, so it is
     nudged up here rather than by giving it a different box. */
  iconScale?: string;
};

/* Each icon is the supplied glyph cropped out of its source artwork, squared
   with matching padding so all four read at the same optical size. The icons
   carry no alt text — the adjacent heading already names the value. */
const values: ValueItem[] = [
  {
    title: "INTEGRITY",
    text: "Morally and ethically guided.",
    icon: integrityIcon,
  },
  {
    title: "COMPASSION",
    text: "A duty to care, a promise to serve.",
    icon: compassionIcon,
  },
  {
    title: "PURPOSE",
    text: "Care with meaning, impact that lasts.",
    icon: purposeIcon,
    iconScale: "scale-[1.12]",
  },
  {
    title: "TRUST",
    text: "Built on honesty, strengthened by reliability.",
    icon: trustIcon,
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
      <div className="container-wrapper pt-8 pb-7 sm:pt-10 sm:pb-9">
        {/* One integrated strip rather than four blocks: hairline rules divide
            the columns on desktop, plain spacing carries the stacked layouts. */}
        <ul className="mx-auto grid grid-cols-2 gap-x-5 gap-y-7 sm:max-w-2xl sm:gap-x-10 sm:gap-y-8 lg:max-w-7xl lg:grid-cols-4 lg:gap-x-0">
          {values.map((val) => (
            <li
              key={val.title}
              /* Narrow columns stack the icon over its text and centre it —
                 matching the footer's other mobile content — then switch to
                 icon-beside-text once there is room for it. */
              className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left lg:border-l lg:border-gold-400/[0.09] lg:px-7 lg:first:border-l-0 lg:first:pl-0"
            >
              <Image
                src={val.icon}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                className={`h-10 w-10 shrink-0 object-contain sm:mt-0.5 sm:h-11 sm:w-11 ${val.iconScale ?? ""}`}
              />
              <div className="min-w-0">
                <h3 className="text-[13px] sm:text-sm font-medium uppercase tracking-[0.18em] text-gold-muted">
                  {val.title}
                </h3>
                <p className="mt-1.5 text-[13px] sm:text-sm font-light leading-relaxed text-gold-200/70">
                  {val.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center mb-6 sm:mb-8 sm:px-6">
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
