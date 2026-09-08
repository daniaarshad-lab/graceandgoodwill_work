import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface EmergencyButtonProps {
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  className?: string;
}

export default function EmergencyButton({
  href = "/emergency-care",
  onClick,
  className = "",
}: EmergencyButtonProps) {
  const commonClasses = `group relative flex items-center justify-start h-14 overflow-hidden rounded-full border-2 border-[#F7D774] bg-[#7A180F] shrink-0 shadow-[0_0_25px_rgba(247,215,116,0.65)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(247,215,116,0.85)] ${className || "w-full sm:w-max"
    }`;

  const content = (
    <>
      {/* Top Right Badge - hidden on mobile until hover */}
      <div className="absolute -top-[11px] right-8 px-3 py-[2px] bg-[#EE4B2B] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-[1.5px] border-white/20 z-20 flex items-center justify-center opacity-0 group-[.js-expanded]:!opacity-100 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-500 whitespace-nowrap">
        <span className="text-white text-[9px] font-extrabold tracking-wider uppercase drop-shadow-sm leading-none pt-[1px]">
          AVAILABLE 24/7
        </span>
      </div>

      <style>{`
        @keyframes emergencyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .emergency-icon-animate {
          display: inline-block;
          animation: emergencyPulse 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10">
        {/* Animated Icon with vibrant radial glow */}
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(255,135,3,0.9)_0%,_rgba(255,135,3,0.5)_50%,_transparent_75%)] blur-sm"></div>
          <span className="text-[28px] leading-none emergency-icon-animate relative z-10 drop-shadow-md">
            🚨
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center shrink-0 pr-4 opacity-0 group-[.js-expanded]:!opacity-100 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-500 invisible group-[.js-expanded]:!visible sm:visible group-hover:visible">
        <span className="text-[#FDF2D5] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] drop-shadow-md whitespace-nowrap">
          EMERGENCY LIVE-IN CARE 24/7
        </span>
        <span className="text-[#FDF2D5]/80 font-medium text-[9px] sm:text-[11px] leading-snug whitespace-nowrap">
          Matched within 24 hours
        </span>
      </div>
      <ChevronRight
        strokeWidth={3}
        className="text-[#F7D774] w-5 h-5 ml-auto mr-4 transition-transform duration-500 group-[.js-expanded]:translate-x-1 group-hover:translate-x-1 z-10 drop-shadow-sm shrink-0 opacity-0 group-[.js-expanded]:!opacity-100 group-hover:opacity-100 sm:opacity-100"
      />
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClasses}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={commonClasses}>
      {content}
    </Link>
  );
}
