"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Heart, ClipboardCheck } from "lucide-react";
import blogPublicImg from "@/assets/blog/blog-public1.jpeg";

export default function BlogHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    // Reset page to 1 on new search
    params.delete("page");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative bg-[#FDF8EC] w-full pt-28 pb-32 mb-12">
      {/* Elegant, soft asymmetric curve at the bottom to transition into navy */}
      <svg
        className="absolute bottom-0 left-0 w-full text-navy-950 translate-y-[1px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,120 C320,40 820,120 1440,20 V120 H0 Z" />
      </svg>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & Search */}
          <div className="max-w-xl">
            <h1 className="font-serif text-[44px] md:text-[54px] font-semibold text-[#1F2937] mb-6">
              Our Blog
            </h1>
            {/* Small decorative wave underline */}
            <div className="w-16 h-2 mb-6">
              <svg viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 5 Q 15 10 30 5 T 60 5" stroke="#C2A476" strokeWidth="2" fill="transparent" />
              </svg>
            </div>
            
            <p className="text-[17px] text-[#4B5563] mb-10 leading-relaxed max-w-[90%]">
              Discover expert guidance, heartfelt stories, and practical advice on live-in care from the team at Grace & Goodwill. We're here to provide the insights you need to navigate your family's care journey with confidence and compassion.
            </p>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex bg-white rounded-[32px] p-1.5 shadow-sm border border-gray-100 max-w-md">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search our posts"
                className="flex-1 bg-transparent px-5 py-2.5 text-[#374151] outline-none placeholder:text-gray-400 text-[15px]"
              />
              <button type="submit" className="bg-[#C2A476] hover:bg-[#B39365] text-navy-950 px-8 py-2.5 rounded-full font-semibold transition-colors text-[15px] shadow-sm">
                Search
              </button>
            </form>
          </div>

          {/* Right Column: Image/Illustration */}
          <div className="flex justify-center md:justify-end mt-16 md:mt-0">
            <div className="relative w-full max-w-[520px]">
              
              {/* Floating Icons (themed to Grace & Goodwill's elegant palette) */}
              <div className="absolute -top-8 left-10 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_4s_infinite]">
                <FileText className="w-6 h-6 text-gold-500" />
              </div>
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white p-5 rounded-full shadow-md z-20 animate-[bounce_5s_infinite_100ms]">
                <Heart className="w-8 h-8 text-gold-400 fill-gold-400" />
              </div>
              <div className="absolute top-0 right-6 bg-white p-4 rounded-full shadow-md z-20 animate-[bounce_6s_infinite_200ms]">
                <ClipboardCheck className="w-6 h-6 text-gold-400" />
              </div>

              <div className="relative w-full aspect-[4/3] overflow-hidden shadow-sm"
                   style={{
                     borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                     transition: "border-radius 1s ease-in-out"
                   }}
              >
                <Image
                  src={blogPublicImg}
                  alt="Blog Illustration"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
