import React from "react";

/**
 * Reusable BBC Radio featured badge.
 * Renders the "AS FEATURED ON BBC RADIO" pill in the brand's navy theme.
 */
export default function BBCBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <a
        href="https://www.bbc.co.uk/programmes/p0m85mv7"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 bg-[#0d1b3e]/80 border border-gold-muted/40 px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md hover:border-gold-400/60 hover:shadow-[0_0_20px_rgba(247,215,116,0.2)] transition-all duration-300 cursor-pointer"
      >
        <span className="text-[10px] font-semibold text-gold-200 uppercase tracking-widest whitespace-nowrap">
          As Featured on
        </span>
        <div className="flex items-center gap-1.5">
          {/* BBC Logo Blocks */}
          <div className="flex gap-0.5">
            <span className="bg-white text-black text-[11px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
              B
            </span>
            <span className="bg-white text-black text-[11px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
              B
            </span>
            <span className="bg-white text-black text-[11px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
              C
            </span>
          </div>
          <span className="text-white font-bold tracking-[0.2em] text-xs">
            RADIO
          </span>
        </div>
      </a>
    </div>
  );
}
