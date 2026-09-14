"use client";

import React from "react";
import Link from "next/link";
import { User, Bell, ArrowRight } from "lucide-react";

// Professional, clean WhatsApp fill icon (Standard recognizable WhatsApp logo)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function HeroActionButtons() {
  return (
    <div className="w-full mt-2 lg:mt-4">
      {/* ── Desktop Layout: Integrated Bar ────────────────────────────── */}
      <div className="hidden lg:flex items-center bg-[#0d1b3e]/70 backdrop-blur-md border border-[#D4AF7A]/40 rounded-[18px] p-2 shadow-[0_0_20px_rgba(212,175,122,0.15)] w-max">
        
        {/* Item 1: Find a live-in carer */}
        <Link href="/contact" className="group flex items-center gap-4 px-5 xl:px-7 py-3 hover:bg-white/5 rounded-[12px] transition-colors">
          <div className="w-11 h-11 rounded-full border border-[#D4AF7A]/40 flex items-center justify-center shrink-0 group-hover:border-[#D4AF7A]/70 transition-colors">
            <User className="w-[18px] h-[18px] text-[#D4AF7A]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <div className="bg-[#b59469] text-navy-950 text-[13px] font-[400] px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#a3855c] transition-colors">
              Find a live-in carer <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <span className="text-white/60 text-[11px] font-[400] tracking-wide">
              Compassionate care, carefully matched
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-14 bg-[#D4AF7A]/15" />

        {/* Item 2: Emergency live-in care */}
        <Link href="/emergency-care" className="relative group flex items-center gap-4 px-5 xl:px-7 py-3 hover:bg-white/5 rounded-[12px] transition-colors">
          
          {/* Soft, diffused yellow/gold spotlight glow behind the item */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
            <div className="w-[160px] h-[90px] bg-[#D4AF7A] opacity-[0.25] blur-[35px] rounded-full" />
          </div>

          <div className="relative z-10 w-11 h-11 rounded-full border border-[#D4AF7A]/40 flex items-center justify-center shrink-0 group-hover:border-[#D4AF7A]/70 transition-colors">
            <Bell className="w-[18px] h-[18px] text-[#D4AF7A]" strokeWidth={1.5} />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-1">
            <span className="text-[#D4AF7A] text-[14px] font-[400] tracking-wide">
              Emergency live-in care 24/7
            </span>
            <span className="text-white/60 text-[11px] font-[400] tracking-wide">
              We're here when it matters
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-14 bg-[#D4AF7A]/15" />

        {/* Item 3: WhatsApp us */}
        <a href="https://wa.me/447462931949" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-5 xl:px-7 py-3 hover:bg-white/5 rounded-[12px] transition-colors">
          <div className="w-11 h-11 rounded-full border border-[#00E676]/40 flex items-center justify-center shrink-0 group-hover:border-[#00E676]/70 transition-colors">
            <WhatsAppIcon className="w-[20px] h-[20px] text-[#00E676]" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-white text-[14px] font-[400] tracking-wide">
              WhatsApp us
            </span>
            <span className="text-white/60 text-[11px] font-[400] tracking-wide">
              Quick, easy and secure
            </span>
          </div>
        </a>

      </div>

      {/* ── Mobile Layout: Stacked Pills ──────────────────────────────── */}
      <div className="flex lg:hidden flex-col gap-3 w-full max-w-md mx-auto sm:mx-0">
        
        {/* Item 1 */}
        <Link href="/contact" className="relative flex items-center w-full bg-[#b59469] text-navy-950 px-5 py-3.5 rounded-full shadow-md hover:bg-[#a3855c] transition-colors">
          <User className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          <span className="flex-1 text-center font-[400] text-[14px]">Find a live-in carer</span>
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={2} />
        </Link>

        {/* Item 2 */}
        <Link href="/emergency-care" className="flex items-center gap-4 w-full bg-[#0d1b3e]/70 backdrop-blur-md border border-[#D4AF7A]/30 text-white px-5 py-3.5 rounded-full hover:bg-white/5 transition-colors shadow-sm">
          <Bell className="w-5 h-5 text-[#D4AF7A] shrink-0" strokeWidth={1.5} />
          <span className="font-[400] text-[14px]">Emergency live-in care 24/7</span>
        </Link>

        {/* Item 3 */}
        <a href="https://wa.me/447462931949" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full bg-[#0d1b3e]/70 backdrop-blur-md border border-[#D4AF7A]/30 text-white px-5 py-3.5 rounded-full hover:bg-white/5 transition-colors shadow-sm">
          <WhatsAppIcon className="w-5 h-5 text-[#00E676] shrink-0" />
          <span className="font-[400] text-[14px]">WhatsApp us</span>
        </a>

      </div>
    </div>
  );
}
