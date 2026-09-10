"use client";

import React from "react";
import Link from "next/link";
import { HandHeart, ChevronRight } from "lucide-react";

export default function HeroActionButtons() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[100%] sm:max-w-md xl:max-w-full overflow-visible xl:flex-row xl:items-center xl:flex-nowrap">
      
      {/* Find a Live-in Carer */}
      <Link
        href="/contact"
        prefetch={false}
        id="btn-find-carer-hero"
        className="hero-action-btn relative flex items-center justify-between h-14 w-full xl:w-max rounded-full border-2 border-[#F7D774] bg-[#5C441D] shadow-[0_0_15px_rgba(247,215,116,0.3)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(247,215,116,0.5)] hover:bg-[#6E5223] overflow-hidden"
      >
        <div className="flex items-center">
          <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(247,215,116,0.15)_0%,_transparent_70%)] blur-sm"></div>
              <HandHeart
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#F7D774] relative z-10 drop-shadow-sm"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-left z-10 pr-2">
            <span className="text-[#FDF2D5] font-bold text-[13px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm whitespace-nowrap">
              FIND A LIVE-IN CARER
            </span>
          </div>
        </div>
        <ChevronRight
          strokeWidth={3}
          className="text-[#FDF2D5]/70 w-5 h-5 mr-4 transition-transform duration-500 z-10 shrink-0 group-hover:translate-x-1"
        />
      </Link>

      {/* Emergency Live-in Care */}
      <div className="relative shrink-0 flex items-center w-full xl:w-max">
        <Link
          href="/emergency-care"
          className="hero-action-btn relative flex items-center justify-between h-14 w-full rounded-full border-2 border-[#F7D774] bg-[#7A180F] shadow-[0_0_25px_rgba(247,215,116,0.65)] transition-all duration-500 hover:shadow-[0_0_35px_rgba(247,215,116,0.85)] overflow-hidden"
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
          
          <div className="flex items-center">
            <div className="w-14 h-14 flex items-center justify-center shrink-0 z-10">
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 scale-125 rounded-full bg-[radial-gradient(circle,_rgba(255,135,3,0.9)_0%,_rgba(255,135,3,0.5)_50%,_transparent_75%)] blur-sm"></div>
                <span className="text-[28px] leading-none emergency-icon-animate relative z-10 drop-shadow-md">
                  🚨
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center shrink-0 pr-4">
              <span className="text-[#FDF2D5] font-bold text-[13px] sm:text-[14px] leading-tight tracking-[0.02em] drop-shadow-md whitespace-nowrap">
                EMERGENCY LIVE-IN CARE 24/7
              </span>
              <span className="text-[#FDF2D5]/80 font-medium text-[10px] sm:text-[11px] leading-snug whitespace-nowrap">
                Matched within 24 hours
              </span>
            </div>
          </div>
          
          <ChevronRight
            strokeWidth={3}
            className="text-[#F7D774] w-5 h-5 mr-4 transition-transform duration-500 z-10 drop-shadow-sm shrink-0 group-hover:translate-x-1"
          />
        </Link>
        
        {/* Top Right Badge */}
        <div className="absolute -top-[11px] right-8 px-3 py-[2px] bg-[#EE4B2B] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-[1.5px] border-white/20 z-20 flex items-center justify-center pointer-events-none">
          <span className="text-white text-[9px] font-extrabold tracking-wider uppercase drop-shadow-sm leading-none pt-[1px]">
            AVAILABLE 24/7
          </span>
        </div>
      </div>

      {/* Chat to our team */}
      <a
        href="https://wa.me/447462931949?text=Hello%2C%20I'd%20like%20to%20enquire%20about%20live%20in%20care%20services%20from%20Grace%20%26%20Goodwill."
        target="_blank"
        rel="noopener noreferrer"
        id="btn-chat-hero"
        className="hero-action-btn relative flex items-center justify-between h-14 w-full xl:w-max rounded-full border-2 border-[#F7D774] bg-[#0F6D2E] shadow-[0_0_15px_rgba(247,215,116,0.3)] transition-all duration-500 hover:shadow-[0_0_25px_rgba(247,215,116,0.5)] hover:bg-[#0C5A26] overflow-hidden"
      >
        <div className="flex items-center">
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
          <div className="flex items-center gap-2 sm:gap-3 text-left z-10 pr-2">
            <span className="text-[#E0F8EA] font-bold text-[13px] sm:text-[14px] leading-tight tracking-[0.02em] uppercase drop-shadow-sm whitespace-nowrap">
              CHAT TO OUR TEAM
            </span>
          </div>
        </div>
        <ChevronRight
          strokeWidth={3}
          className="text-[#00C653]/70 w-5 h-5 mr-4 transition-transform duration-500 z-10 shrink-0 group-hover:translate-x-1"
        />
      </a>

    </div>
  );
}
