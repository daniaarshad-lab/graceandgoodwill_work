import React from "react";

const values = [
  {
    title: "INTEGRITY",
    text: "Morally guided.",
    icon: (
      <svg
        className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v9" />
        <path d="M12 8c-1.5-1.5-1.5-3 0-4.5 1.5 1.5 1.5 3 0 4.5z" />
        <path d="M12 12c-2.5-0.5-3-2-2.5-3.5 1.5 0.5 2 2 2.5 3.5z" />
        <path d="M12 12c2.5-0.5 3-2 2.5-3.5-1.5 0.5-2 2-2.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "COMPASSION",
    text: "A duty to care.",
    icon: (
      <svg
        className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 11.5a2.5 2.5 0 0 0-4-2c-1.5 1.5 0 4 4 6.5 4-2.5 5.5-5 4-6.5a2.5 2.5 0 0 0-4 2z" />
        <path d="M4 14a8 8 0 0 0 16 0" />
        <path d="M7 12a5 5 0 0 0 10 0" />
      </svg>
    ),
  },
  {
    title: "TRUST",
    text: "Strengthened reliability.",
    icon: (
      <svg
        className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16" />
        <path d="M5 7h14" />
        <path d="M7 7v11" />
        <path d="M12 7v11" />
        <path d="M17 7v11" />
        <path d="M5 18h14" />
        <path d="M3 21h18" />
        <path d="M6 4c0 1.5-1 3-2 3" />
        <path d="M18 4c0 1.5 1 3 2 3" />
      </svg>
    ),
  },
  {
    title: "RESPECT",
    text: "Support with dignity.",
    icon: (
      <svg
        className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21a8 8 0 0 1-8-8 8.5 8.5 0 0 1 2-5" />
        <path d="M12 21a8 8 0 0 0 8-8 8.5 8.5 0 0 0-2-5" />
        <path d="M4.5 16.5c-1-1.5 0-3 1.5-2.5" />
        <path d="M3.5 12.5c-1.5-1 0-3 1.5-2.5" />
        <path d="M4.5 8.5c-1.5-1 .5-3 2-2" />
        <path d="M7 5.5c-1-1.5 1.5-2.5 2.5-1.5" />
        <path d="M19.5 16.5c1-1.5 0-3-1.5-2.5" />
        <path d="M20.5 12.5c1.5-1 0-3-1.5-2.5" />
        <path d="M19.5 8.5c1.5-1-.5-3-2-2" />
        <path d="M17 5.5c1-1.5-1.5-2.5-2.5-1.5" />
      </svg>
    ),
  },
  {
    title: "PURPOSE",
    text: "Care with meaning.",
    icon: (
      <svg
        className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 4l1.5 6.5 6.5 1.5-6.5 1.5-1.5 6.5-1.5-6.5-6.5-1.5 6.5-1.5Z" />
        <path d="m5.64 5.64 12.72 12.72" />
        <path d="m18.36 5.64-12.72 12.72" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-gold-100">
      {/* 1. VALUES SECTION (Super Compact & Premium) */}
      <section className="border-b border-navy-800/40 py-6 sm:py-8">
        <div className="mx-auto max-w-5xl px-2 sm:px-6">
          <div className="grid grid-cols-5 divide-x divide-gold-400/10">
            {values.map((val) => (
              <div
                key={val.title}
                className="group flex flex-col items-center text-center px-1 sm:px-2 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110">
                  {val.icon}
                </div>
                <h3 className="text-[9px] sm:text-[11px] font-serif font-semibold tracking-[0.1em] sm:tracking-[0.2em] text-gold-100 uppercase mb-0.5 group-hover:text-gold-50 transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-[8px] sm:text-[10px] text-gold-200/60 max-w-[130px] leading-relaxed font-light tracking-wide">
                  {val.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MINIMAL FOOTER (Ultra-Compact, Elegant, Centered) */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-xl px-6 text-center flex flex-col items-center">
          {/* Logo with clean direct SVG fallback handling to prevent broken links */}
          <div className="relative group mb-3">
            <svg
              className="h-10 w-20 text-gold-300 transition-all duration-500 group-hover:brightness-110"
              viewBox="0 0 640 320"
              fill="none"
            >
              <defs>
                <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f3d58d" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="gold-grad-2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e5c77d" />
                  <stop offset="100%" stopColor="#c69927" />
                </linearGradient>
              </defs>
              <rect
                x="48"
                y="32"
                width="224"
                height="224"
                fill="none"
                stroke="url(#gold-grad)"
                strokeWidth="20"
                rx="12"
              />
              <text
                x="160"
                y="140"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="140"
                fontWeight="700"
                fill="url(#gold-grad)"
              >
                G
              </text>
              <text
                x="270"
                y="170"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="140"
                fontWeight="700"
                fill="url(#gold-grad-2)"
              >
                G
              </text>
              <text
                x="190"
                y="160"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="90"
                fontWeight="700"
                fill="url(#gold-grad)"
              >
                &
              </text>
              <text
                x="340"
                y="160"
                textAnchor="start"
                fontFamily="Inter, sans-serif"
                fontSize="44"
                fontWeight="700"
                fill="#f8e3af"
              >
                GRACE & GOODWILL
              </text>
              <text
                x="340"
                y="210"
                textAnchor="start"
                fontFamily="Inter, sans-serif"
                fontSize="20"
                fill="#f4d88b"
                letterSpacing="0.2em"
              >
                CARE DEFINED BY INTEGRITY
              </text>
            </svg>
            <div className="absolute inset-0 bg-gold-400/5 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Core Branding Information */}
          <h2 className="text-xs sm:text-sm font-serif font-semibold tracking-[0.25em] text-gold-100 uppercase mb-0.5">
            GRACE & GOODWILL
          </h2>
          <p className="text-[9px] sm:text-[10px] font-serif italic tracking-[0.15em] text-gold-300/80 mb-3 uppercase">
            Care Defined by Integrity
          </p>

          {/* Subtle thin separator */}
          <div className="w-6 h-[1px] bg-gold-400/20 mb-3" />

          {/* Warm closing note */}
          <p className="text-[11px] sm:text-xs text-gold-200/90 font-light tracking-wide max-w-sm mb-4 leading-relaxed">
            Thank you for choosing GRACE & GOODWILL.
          </p>

          {/* Warm tight sign-off */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gold-300/40 uppercase tracking-[0.2em]">
              Regards,
            </span>
            <span className="text-sm font-serif font-medium tracking-widest text-gold-100 italic">
              Aurea
            </span>
          </div>
        </div>
      </section>
    </footer>
  );
}
