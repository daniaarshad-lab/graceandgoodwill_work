"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ChevronDown, Check } from "lucide-react";

export interface LocationPageData {
  city: string;
  region: string;
  slug: string;
  headline: string;
  intro: string[];
  stats?: any[];
  services?: any[];
  faqs?: any[];
  nearbyAreas?: string[];
}

export default function LocationPageTemplate({ data }: { data: LocationPageData }) {
  const { city } = data;
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* ── Light Themed Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 bg-[#F4F2F0]">
        {/* Elegant curvy wave at bottom transitioning to white */}
        <svg
          className="absolute bottom-0 left-0 w-full text-white translate-y-[1px]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,120 C320,40 820,120 1440,20 V120 H0 Z" />
        </svg>

        <div className="container-wrapper relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
            
            {/* Left Column: Copy & Trust Elements */}
            <div className="flex flex-col h-full lg:min-h-[500px]">
              <h1 className="font-serif text-[40px] sm:text-[48px] lg:text-[54px] font-semibold text-navy-950 leading-[1.1] mb-6 tracking-tight">
                Live in care in {city}
              </h1>

              {/* Decorative squiggly line */}
              <div className="w-16 h-2 mb-8">
                <svg viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#374151" strokeWidth="1.5" fill="transparent" />
                </svg>
              </div>

              <p className="text-[#4B5563] text-lg leading-relaxed max-w-lg mb-10">
                At Grace & Goodwill, we offer high-quality, personalised live in care for the elderly or any person in need in {city}. Explore our options below.
              </p>

              <div>
                <Link
                  href="#options"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#2A2D40] text-white font-medium text-[15px] hover:bg-[#1E2030] transition-colors shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right Column: Callback Form */}
            <div className="w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-t-sm rounded-b-xl overflow-hidden bg-white z-20">
              {/* Form Header */}
              <div className="bg-[#6B7291] px-8 py-7 text-white">
                <h3 className="font-serif text-[26px] font-semibold mb-2 text-[#D4AF7A]">
                  Request a call back
                </h3>
                <p className="text-white/90 text-[15px]">
                  We will be in touch within 1 working day.
                </p>
              </div>

              {/* Form Body */}
              <div className="p-8">
                <form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-[#4B5563] font-medium">Name<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Your full name" className="w-full bg-[#374151] border border-transparent rounded-sm px-4 py-3 text-[14px] text-white placeholder:text-gray-400 outline-none focus:border-[#D4AF7A] transition-colors" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-[#4B5563] font-medium">Email Address<span className="text-red-500">*</span></label>
                    <input type="email" placeholder="youremailaddress@email.com" className="w-full bg-[#374151] border border-transparent rounded-sm px-4 py-3 text-[14px] text-white placeholder:text-gray-400 outline-none focus:border-[#D4AF7A] transition-colors" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <label className="text-[13px] text-[#4B5563] font-medium">Phone Number<span className="text-red-500">*</span></label>
                    </div>
                    <div className="relative flex">
                      <div className="flex items-center gap-2 px-3 border border-transparent bg-[#4B5563] rounded-l-sm">
                        <span className="text-[13px] font-medium text-white">GB</span>
                        <ChevronDown className="w-3 h-3 text-white/70" />
                      </div>
                      <input type="tel" placeholder="Enter your number" className="w-full bg-[#374151] border border-transparent border-l-0 rounded-r-sm px-3 py-3 text-[14px] text-white placeholder:text-gray-400 outline-none focus:border-[#D4AF7A] transition-colors" required />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-[#4B5563] font-medium">Client or Carer?<span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-[14px] text-gray-500 appearance-none outline-none focus:border-[#6B7291] transition-colors cursor-pointer" required defaultValue="">
                        <option value="" disabled>Select an option</option>
                        <option value="client">I'm looking for care for myself or a loved one</option>
                        <option value="carer">I'm a carer looking for work</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setAgreed(!agreed)}
                      className={`w-[18px] h-[18px] shrink-0 mt-0.5 rounded-sm border flex items-center justify-center transition-colors ${agreed ? 'bg-[#2A2D40] border-[#2A2D40]' : 'border-gray-300 bg-white'}`}
                    >
                      {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                    <p className="text-[12px] text-[#6B7280] leading-snug cursor-pointer select-none" onClick={() => setAgreed(!agreed)}>
                      I consent to storage of my data according to the <Link href="/privacy" className="text-[#374151] font-semibold underline underline-offset-2">Privacy Policy</Link><span className="text-red-500">*</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] text-[#6B7280]">Required fields are marked with <span className="text-red-500">*</span></span>
                    <button type="submit" className="px-8 py-3 bg-[#2A2D40] hover:bg-[#1E2030] text-white text-[14px] font-medium rounded-full transition-colors shadow-sm">
                      Request Callback
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </main>
  );
}
