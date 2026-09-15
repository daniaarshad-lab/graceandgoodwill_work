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
    text: "Morally and ethically\nguided.",
    icon: integrityIcon,
  },
  {
    title: "COMPASSION",
    text: "A duty to care,\na promise to serve.",
    icon: compassionIcon,
  },
  {
    title: "PURPOSE",
    text: "Care with meaning,\nimpact that lasts.",
    icon: purposeIcon,
    iconScale: "scale-[1.12]",
  },
  {
    title: "TRUST",
    text: "Built on honesty,\nstrengthened by reliability.",
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
              className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left lg:border-l lg:border-gold-400/[0.09] lg:px-7 lg:first:border-l-0 lg:first:pl-0"
            >
              <Image
                src={val.icon}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                className={`h-14 w-14 shrink-0 object-contain sm:mt-0.5 sm:h-16 sm:w-16 ${val.iconScale ?? ""}`}
              />
              <div className="min-w-0">
                <h3 className="text-[17px] sm:text-[22px] font-playfair font-semibold uppercase tracking-normal text-[#917559] leading-none mb-2">
                  {val.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] font-jost font-medium leading-[1.32] text-[#C0A381] whitespace-pre-line">
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

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 sm:gap-5 mb-6">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/GraceandGoodwillLiveinCareService"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/graceandgoodwill"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a
            href="https://youtube.com/@graceandgoodwill"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/graceandgoodwill/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          {/* X (Twitter) */}
          <a
            href="https://x.com/gracegoodwilluk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
            </svg>
          </a>
          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@graceandgoodwill"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          {/* Pinterest */}
          <a
            href="https://uk.pinterest.com/graceandgoodwill/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            className="text-gold-100/35 hover:text-gold-300/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </a>
        </div>

        {/* Legal Links & Cookie Preferences */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-6 text-[10px] sm:text-[11px] mb-4 text-center px-2">
          <Link
            href="/privacy"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Privacy Policy
          </Link>
          <span className="text-gold-100/20 hidden sm:inline">•</span>
          <Link
            href="/terms"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Website &amp; Platform Terms
          </Link>
          <span className="text-gold-100/20 hidden sm:inline">•</span>
          <Link
            href="/agency-introduction-terms"
            className="text-gold-100/40 hover:text-gold-100/90 transition-colors font-light hover:underline underline-offset-4 decoration-gold-100/20"
          >
            Agency Introduction Terms
          </Link>
          <span className="text-gold-100/20 hidden sm:inline">•</span>
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
