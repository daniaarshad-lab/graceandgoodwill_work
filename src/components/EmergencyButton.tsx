 import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface EmergencyButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
}

export default function EmergencyButton({
  href = "/emergency-care",
  onClick,
  className = "",
}: EmergencyButtonProps) {
  // Static premium gold background, no hover scaling
  const commonClasses = `group relative flex items-center justify-between h-14 px-5 rounded-full border border-[#F7D774]/50 bg-gradient-to-r from-[#D4AF37] via-[#E6C35C] to-[#D4AF37] shrink-0 shadow-sm ${
    className || "w-full sm:w-max"
  }`;
  
  const content = (
    <>
      <style>{`
        @keyframes emergencyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .emergency-icon-animate {
          display: inline-block;
          animation: emergencyPulse 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="flex items-center gap-3 text-left z-10">
        {/* Animated Icon */}
        <div className="flex items-center justify-center w-8 h-8">
          <span className="text-2xl leading-none emergency-icon-animate">🚨</span>
        </div>
        
        <div className="flex flex-col justify-center">
          <span className="text-navy-950 font-extrabold text-[14px] leading-snug uppercase tracking-wide drop-shadow-sm">
            Emergency Care 24/7
          </span>
          <span className="text-navy-950/80 font-semibold text-[10px] leading-snug">
            Support within 24 hours where possible
          </span>
        </div>
      </div>
      <ChevronRight className="text-navy-950 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 z-10" />

      {/* Badge - Static */}
      <div
        className="absolute -top-2.5 right-4 px-3 py-[2px] rounded-full text-[9px] font-bold text-white uppercase tracking-wider shadow-md border border-white/20"
        style={{ backgroundColor: '#FF6B35' }}
      >
        Available 24/7
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={commonClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={commonClasses}
    >
      {content}
    </Link>
  );
}
