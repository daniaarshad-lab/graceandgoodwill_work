"use client";

import { useState, useEffect } from "react";
import { X, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/Button";

export default function HeroOfferModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-[#b59469] text-sm sm:text-base font-medium tracking-wide hover:text-[#c4a67e] transition-all border-b border-[#b59469]/40 hover:border-[#b59469] pb-0.5 group drop-shadow-[0_0_8px_rgba(181,148,105,0.5)] hover:drop-shadow-[0_0_12px_rgba(181,148,105,0.8)]"
      >
        View offer
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-[520px] bg-[#081021] border-[1.5px] border-[#b59469] rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] p-5 sm:px-10 sm:py-7 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 text-[#b59469] hover:text-[#e8ba7a] transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>

            {/* Icon & Heading */}
            <div className="flex flex-col items-center text-center mb-3 space-y-2 sm:space-y-3">
              <Gift className="w-8 h-8 sm:w-[38px] sm:h-[38px] text-[#b59469]" strokeWidth={1.5} />
              <h2 className="text-[22px] sm:text-[30px] font-playfair text-[#fdfbf7] tracking-wide">
                Limited client offer
              </h2>
            </div>

            {/* Main Text */}
            <p className="text-center text-white/90 text-[13px] sm:text-[14.5px] leading-[1.5] mb-4 sm:mb-5 font-serif px-1 sm:px-2">
              Join Grace & Goodwill before <strong>1 January</strong> and, if you are successfully matched with a suitable carer within 4 days, you will receive lifetime platform access with no registration or platform charges.
            </p>

            <div className="h-px w-4/5 mx-auto bg-white/10 mb-4 sm:mb-5" />

            {/* List */}
            <ul className="space-y-3 sm:space-y-3.5 mb-5 sm:mb-6 px-1 sm:px-2">
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-[#b59469] flex items-center justify-center shrink-0 mt-[3px] sm:mt-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#081021]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-white/90 text-[13px] sm:text-[14.5px] font-serif leading-snug">
                  Choose, compare and request suitable carers
                </span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-[#b59469] flex items-center justify-center shrink-0 mt-[3px] sm:mt-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#081021]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-white/90 text-[13px] sm:text-[14.5px] font-serif leading-snug">
                  Request a replacement carer if circumstances change
                </span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-[#b59469] flex items-center justify-center shrink-0 mt-[3px] sm:mt-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#081021]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-white/90 text-[13px] sm:text-[14.5px] font-serif leading-[1.4]">
                  No platform or registration charges for eligible clients who join before 1 January
                </span>
              </li>
            </ul>

            {/* CTA */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <Button asChild fullWidth className="!rounded-full font-serif">
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-[14px] sm:text-[15px]"
                >
                  Start your care request
                  <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
                </Link>
              </Button>
              
              <Link 
                href="/terms" 
                onClick={() => setIsOpen(false)}
                className="text-[12px] sm:text-[13px] text-white/70 hover:text-white underline underline-offset-[4px] decoration-white/40 hover:decoration-white transition-colors mt-1"
              >
                Terms apply
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
