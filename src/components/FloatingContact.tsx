"use client";

import React from "react";
import { Phone } from "lucide-react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]">
      <a
        href="tel:02045240108"
        className="group relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#e8ba7a] text-navy-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
        aria-label="Call Grace & Goodwill"
      >
        {/* Soft pulse glow behind the button */}
        <div className="absolute inset-0 rounded-full bg-[#d4af37] opacity-40 blur-md transition-all duration-300 group-hover:opacity-60 group-hover:blur-lg" />
        
        {/* Phone Icon */}
        <Phone className="relative z-10 h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2} />
      </a>
    </div>
  );
}
