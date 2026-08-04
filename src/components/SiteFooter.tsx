"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import integrityImg from "@/assets/open/integrity.jpeg";
import compassionImg from "@/assets/open/compassion.jpeg";
import purposeImg from "@/assets/open/purpose.jpeg";
import trustImg from "@/assets/open/trust.jpeg";

const values = [
  {
    title: "INTEGRITY",
    text: "Morally and \n ethically guided.",
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
      <div className="container-wrapper py-7 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {values.map((val, idx) => (
              <div key={idx} className="relative w-full max-w-[300px] aspect-[2.5/1] mx-auto rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                {val.icon ? (
                  <Image
                    src={val.icon}
                    alt={`${val.title} image`}
                    fill
                    quality={100}
                    unoptimized={true}
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <HeartHandshake className="w-10 h-10 text-gold-DEFAULT" />
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="container-wrapper">
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(160,128,84,0.18))",
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
      <div className="container-wrapper py-6 sm:py-7">
        {/* Company name */}
        <p className="text-center text-[13px] font-semibold text-gold-100/55 tracking-[0.06em] mb-5">
          Grace &amp; Goodwill Ltd
        </p>

        {/* Three columns */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-5 sm:gap-0 sm:divide-x sm:divide-gold-muted/10">
          {/* Copyright */}
          <div className="sm:px-6 lg:px-10 text-center">
            <p className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mb-1">
              Copyright
            </p>
            <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light leading-relaxed">
              &copy; Grace &amp; Goodwill Ltd 2026.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Registration */}
          <div className="sm:px-6 lg:px-10 text-center">
            <p className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mb-1">
              Company Registration
            </p>
            <p className="text-[10px] sm:text-[11px] text-gold-100/38 font-light">
              Company No. 16011465
            </p>
          </div>

          {/* Registered Office */}
          <div className="sm:px-6 lg:px-10 text-center">
            <p className="text-[9px] sm:text-[10px] text-gold-200/22 uppercase tracking-[0.14em] font-medium mb-1">
              Registered Office
            </p>
            <address className="text-[10px] sm:text-[11px] text-gold-100/38 font-light leading-[1.6] not-italic">
              Hypoint,
              <br />
              Saltmeadows Road,
              <br />
              Gateshead, NE8 3AH,
              <br />
              United Kingdom
            </address>
          </div>
        </div>

        {/* Legal Links & Cookie Preferences */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px]">
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

        {/* Disclaimer */}
        <div className="mt-6 text-center max-w-3xl mx-auto px-4">
          <p className="text-[10px] sm:text-[11px] text-gold-100/30 font-light leading-relaxed">
            Grace &amp; Goodwill is an introductory agency for independent
            live-in carers and does not provide regulated care services.
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
