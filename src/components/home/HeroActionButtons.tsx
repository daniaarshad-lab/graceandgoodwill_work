"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HandHeart, ChevronRight } from "lucide-react";

export default function HeroActionButtons() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    if (isTouch && expandedId !== id) {
      e.preventDefault();
      setExpandedId(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!(e.target as Element).closest('.hero-action-btn')) {
        setExpandedId(null);
      }
    };
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col xl:flex-row items-end xl:items-center gap-4 flex-wrap xl:flex-nowrap w-full max-w-[100%] overflow-visible">
        <Link
          href="/contact"
          prefetch={false}
          id="btn-find-carer-hero"
          onClick={(e) => handleClick(e, 'find-carer')}
          className={`hero-action-btn group relative flex items-center justify-start h-14 w-14 sm:w-[280px] xl:w-max rounded-full border-2 border-[#F7D774] bg-[#5C441D] shrink-0 shadow-[0_0_15px_rgba(247,215,116,0.3)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(247,215,116,0.5)] hover:bg-[#6E5223] overflow-hidden ${expandedId === 'find-carer' ? '!w-[280px]' : 'hover:w-[280px]'}`}
        >
          <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(247,215,116,0.15)_0%,_transparent_70%)] blur-sm"></div>
              <HandHeart
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#F7D774] relative z-10 drop-shadow-sm"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className={`flex items-center gap-2 sm:gap-3 text-left z-10 shrink-0 opacity-0 sm:opacity-100 transition-opacity duration-500 ${expandedId === 'find-carer' ? '!opacity-100 !visible' : 'group-hover:opacity-100 invisible group-hover:visible sm:visible'}`}>
            <span className="text-[#FDF2D5] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm whitespace-nowrap">
              FIND A LIVE-IN CARER
            </span>
          </div>
          <ChevronRight
            strokeWidth={3}
            className={`text-[#FDF2D5]/70 w-5 h-5 ml-auto mr-4 transition-transform duration-500 z-10 shrink-0 opacity-0 sm:opacity-100 ${expandedId === 'find-carer' ? 'translate-x-1 !opacity-100' : 'group-hover:translate-x-1 group-hover:opacity-100'}`}
          />
        </Link>

        <div className="relative shrink-0 flex items-center">
          <Link
            href="/emergency-care"
            onClick={(e) => handleClick(e, 'emergency')}
            className={`hero-action-btn group peer relative flex items-center justify-start h-14 w-14 sm:w-[320px] xl:w-max rounded-full border-2 border-[#F7D774] bg-[#7A180F] shadow-[0_0_25px_rgba(247,215,116,0.65)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(247,215,116,0.85)] overflow-hidden ${expandedId === 'emergency' ? '!w-[320px]' : 'hover:w-[320px]'}`}
          >
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
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(255,135,3,0.9)_0%,_rgba(255,135,3,0.5)_50%,_transparent_75%)] blur-sm"></div>
                <span className="text-[28px] leading-none emergency-icon-animate relative z-10 drop-shadow-md">
                  🚨
                </span>
              </div>
            </div>

            <div className={`flex flex-col justify-center shrink-0 pr-4 transition-opacity duration-500 ${expandedId === 'emergency' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible sm:opacity-100 sm:visible'}`}>
              <span className="text-[#FDF2D5] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] drop-shadow-md whitespace-nowrap">
                EMERGENCY LIVE-IN CARE 24/7
              </span>
              <span className="text-[#FDF2D5]/80 font-medium text-[9px] sm:text-[11px] leading-snug whitespace-nowrap">
                Matched within 24 hours
              </span>
            </div>
            <ChevronRight
              strokeWidth={3}
              className={`text-[#F7D774] w-5 h-5 ml-auto mr-4 transition-transform duration-500 z-10 drop-shadow-sm shrink-0 ${expandedId === 'emergency' ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 sm:opacity-100'}`}
            />
          </Link>
          
          {/* Top Right Badge - moved outside to prevent overflow-hidden clipping */}
          <div className={`absolute -top-[11px] right-8 px-3 py-[2px] bg-[#EE4B2B] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-[1.5px] border-white/20 z-20 flex items-center justify-center transition-opacity duration-500 whitespace-nowrap pointer-events-none ${expandedId === 'emergency' ? 'opacity-100' : 'opacity-0 peer-hover:opacity-100 sm:opacity-100'}`}>
            <span className="text-white text-[9px] font-extrabold tracking-wider uppercase drop-shadow-sm leading-none pt-[1px]">
              AVAILABLE 24/7
            </span>
          </div>
        </div>

        <a
          href="https://wa.me/447462931949?text=Hello%2C%20I'd%20like%20to%20enquire%20about%20live%20in%20care%20services%20from%20Grace%20%26%20Goodwill."
          target="_blank"
          rel="noopener noreferrer"
          id="btn-chat-hero"
          onClick={(e) => handleClick(e, 'chat')}
          className={`hero-action-btn group relative flex items-center justify-start h-14 w-14 sm:w-[280px] xl:w-max rounded-full border-2 border-[#F7D774] bg-[#0F6D2E] shrink-0 shadow-[0_0_15px_rgba(247,215,116,0.3)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(247,215,116,0.5)] hover:bg-[#0C5A26] overflow-hidden ${expandedId === 'chat' ? '!w-[280px]' : 'hover:w-[280px]'}`}
        >
          <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(0,198,83,0.15)_0%,_transparent_70%)] blur-sm"></div>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C653] relative z-10 drop-shadow-sm"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
          </div>
          <div className={`flex items-center gap-2 sm:gap-3 text-left z-10 shrink-0 opacity-0 sm:opacity-100 transition-opacity duration-500 ${expandedId === 'chat' ? '!opacity-100 !visible' : 'group-hover:opacity-100 invisible group-hover:visible sm:visible'}`}>
            <span className="text-[#E0F8EA] font-bold text-[11px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm whitespace-nowrap">
              CHAT TO OUR TEAM
            </span>
          </div>
          <ChevronRight
            strokeWidth={3}
            className={`text-[#00C653]/70 w-5 h-5 ml-auto mr-4 transition-transform duration-500 z-10 shrink-0 opacity-0 sm:opacity-100 ${expandedId === 'chat' ? 'translate-x-1 !opacity-100' : 'group-hover:translate-x-1 group-hover:opacity-100'}`}
          />
        </a>
      </div>

      <div className="mt-8 lg:hidden flex flex-col items-end">
        <a
          href="https://www.bbc.co.uk/programmes/p0m85mv7"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleClick(e, 'bbc')}
          className={`hero-action-btn group relative flex items-center justify-center h-14 w-14 sm:w-[330px] xl:w-max bg-navy-900 border border-gold-muted/30 rounded-full shadow-lg backdrop-blur-md hover:border-gold-400/50 transition-all duration-500 cursor-pointer overflow-hidden ${expandedId === 'bbc' ? '!w-[330px]' : 'hover:w-[330px]'}`}
        >
          {/* Layer 1: Collapsed State (Just BBC Logo) */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${expandedId === 'bbc' ? 'opacity-0' : 'opacity-100 group-hover:opacity-0 sm:opacity-0 sm:hidden'}`}>
            <div className="flex gap-0.5 scale-[0.6]">
              <span className="bg-white text-black text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">B</span>
              <span className="bg-white text-black text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">B</span>
              <span className="bg-white text-black text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">C</span>
            </div>
          </div>

          {/* Layer 2: Expanded State (Full Text) */}
          <div className={`flex items-center justify-center gap-3.5 w-[330px] sm:w-auto transition-opacity duration-500 whitespace-nowrap px-5 ${expandedId === 'bbc' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible sm:opacity-100 sm:visible'}`}>
            <span className="text-xs sm:text-sm font-semibold text-gold-200 uppercase tracking-widest">
              As Featured on
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <span className="bg-white text-black text-xs sm:text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">B</span>
                <span className="bg-white text-black text-xs sm:text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">B</span>
                <span className="bg-white text-black text-xs sm:text-[13px] font-bold px-1.5 py-0.5 rounded-sm leading-none">C</span>
              </div>
              <span className="text-white font-bold tracking-[0.2em] text-sm sm:text-base">RADIO</span>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
