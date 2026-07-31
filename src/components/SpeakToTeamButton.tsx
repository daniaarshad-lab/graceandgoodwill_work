import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface SpeakToTeamButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
}

export default function SpeakToTeamButton({
  href = "https://wa.me/4402045781269?text=Hello%2C%20I'd%20like%20to%20enquire%20about%20live%20in%20care%20services%20from%20Grace%20%26%20Goodwill.",
  onClick,
  className = "",
}: SpeakToTeamButtonProps) {
  const wrapperClasses = `relative ${className || "w-full sm:w-max"} shrink-0`;
  const buttonClasses = `group relative flex items-center justify-between h-14 px-6 rounded-full border border-[#144738] bg-gradient-to-r from-[#0b2921] to-[#061712] w-full shrink-0 shadow-md transition-all duration-300 hover:shadow-lg hover:border-[#1a5c48]`;
  
  const content = (
    <>
      <div className="flex items-center gap-4 text-left z-10">
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(52,211,153,0.15)_0%,_transparent_70%)] blur-sm"></div>
          <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400 relative z-10 drop-shadow-sm" />
        </div>
        
        <div className="flex flex-col justify-center">
          <span className="text-[#d1fae5] font-semibold text-[15px] leading-snug tracking-wide drop-shadow-sm whitespace-nowrap">
            Chat to Our Team
          </span>
          <span className="text-[#a7f3d0]/70 font-medium text-[11px] leading-snug whitespace-nowrap">
            Chat with our matching specialists
          </span>
        </div>
      </div>
      <ChevronRight strokeWidth={2.5} className="text-[#34d399]/60 w-5 h-5 ml-4 transition-transform duration-300 group-hover:translate-x-1 z-10 drop-shadow-sm" />
    </>
  );

  if (onClick) {
    return (
      <div className={wrapperClasses}>
        <button
          type="button"
          onClick={onClick}
          className={buttonClasses}
        >
          {content}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        {content}
      </a>
    </div>
  );
}
