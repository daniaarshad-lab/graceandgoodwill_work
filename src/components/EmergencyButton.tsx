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
  const commonClasses = `group relative flex items-center justify-between h-14 px-5 rounded-xl border border-[#F7D774] bg-[#D4AF37] hover:bg-[#E6C35C] transition-all duration-300 shrink-0 ${
    className || "w-full sm:w-max"
  }`;
  const commonStyle = {
    boxShadow:
      '0 0 10px rgba(247,215,116,0.4), 0 0 20px rgba(247,215,116,0.3), 0 0 35px rgba(247,215,116,0.2)',
  };

  const content = (
    <>
      <div className="flex items-center gap-3 text-left">
        <span className="text-xl leading-none">🚨</span>
        <div className="flex flex-col justify-center">
          <span className="text-white font-bold text-[14px] leading-snug uppercase tracking-wide">
            Emergency Care 24/7
          </span>
          <span className="text-white/90 text-[10px] leading-snug">
            Support within 24 hours where possible
          </span>
        </div>
      </div>
      <ChevronRight className="text-white w-5 h-5 ml-2 animate-none" />

      {/* Badge */}
      <div
        className="absolute -top-2.5 right-4 px-2 py-[2px] rounded-full text-[9px] font-bold text-white uppercase tracking-wider"
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
        style={commonStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={commonClasses}
      style={commonStyle}
    >
      {content}
    </Link>
  );
}
