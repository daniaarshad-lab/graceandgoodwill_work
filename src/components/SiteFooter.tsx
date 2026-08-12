"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import integrityImg from "@/assets/open/integrity.png";
import compassionImg from "@/assets/open/compassion.png";
import purposeImg from "@/assets/open/purpose.png";
import trustImg from "@/assets/open/trust.png";

const values = [
  {
    title: "INTEGRITY",
    text: "Rooted in law,\nguided by ethics.",
    icon: integrityImg,
  },
  {
    title: "COMPASSION",
    text: "A duty to care,\na promise to serve.",
    icon: compassionImg,
  },
  {
    title: "PURPOSE",
    text: "Care with meaning,\nimpact that lasts.",
    icon: purposeImg,
  },
  {
    title: "TRUST",
    text: "Built on honesty,\nstrengthened by reliability.",
    icon: trustImg,
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
      <div className="container-wrapper mb-8 sm:mb-10 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {values.map((val, idx) => (
              <div key={idx} className="relative w-full h-[150px] sm:h-[200px] mx-auto flex items-center justify-center">
                {val.icon ? (
                  <Image
                    src={val.icon}
                    alt={`${val.title} image`}
                    fill
                    quality={100}
                    unoptimized={true}
                    className="object-contain object-center scale-110 sm:scale-125"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <HeartHandshake className="w-10 h-10 text-gold-DEFAULT" />
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center mb-6 sm:mb-8">
        <div className="w-full max-w-4xl flex items-center gap-3 px-4 sm:px-6">
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

        {/* Copyright | Disclaimer | Registration — all one row */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-4">
          {/* Copyright */}
          <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light whitespace-nowrap">
            <span className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mr-1.5">Copyright</span>
            &copy; Grace &amp; Goodwill Ltd 2026. All rights reserved.
          </p>

          {/* Disclaimer — centre */}
          <p className="text-[10px] sm:text-[11px] text-gold-100/30 font-light whitespace-nowrap text-center">
            Grace &amp; Goodwill is an introductory agency for independent live-in carers and does not provide regulated care services.
          </p>

          {/* Registration */}
          <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light whitespace-nowrap">
            <span className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mr-1.5">Company Registration</span>
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
