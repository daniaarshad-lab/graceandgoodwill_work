"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronRight } from "lucide-react";
import { services } from "@/data/servicesData";
import { regions } from "@/data/locationsData";

export default function ServicesReveal() {
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string>("All regions");
  const servicesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsServicesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const allRegionNames = ["All regions", ...regions.map((r) => r.name)];

  const filteredRegions =
    activeRegion === "All regions"
      ? regions
      : regions.filter((r) => r.name === activeRegion);

  return (
    <section
      ref={servicesRef}
      className={`mt-16 mb-12 transition-all duration-1000 ease-out ${
        isServicesVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      {/* What Live-In Care Can Include */}
      <div className="mx-auto max-w-4xl rounded-[32px] border border-gold-300/20 bg-gradient-to-b from-navy-900/80 to-navy-900/30 p-8 sm:p-12 shadow-[0_12px_40px_rgba(212,175,55,0.06)] backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-400/5 pointer-events-none" />

        <div className="relative z-10 mb-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            What Live-In Care Can Include
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 sm:gap-x-16 px-4 sm:px-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3 cursor-default"
            >
              <div className="flex shrink-0 items-center justify-center">
                <Check className="h-[18px] w-[18px] text-gold-400 group-hover:text-gold-300 group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-[15px] font-light text-gold-50 tracking-wide leading-tight">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* UK Regions & Counties Section */}
      <div className="mt-16 mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-8 text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-50 tracking-wide">
            Areas We Cover Across the UK
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto" />
          <p className="text-gold-100/70 text-sm max-w-xl mx-auto">
            Grace &amp; Goodwill supports live-in care matching for placements
            across the United Kingdom.
          </p>
        </div>

        {/* Region filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
          {allRegionNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveRegion(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeRegion === name
                  ? "bg-navy-900 border-gold-400/60 text-gold-50 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  : "bg-transparent border-gold-300/20 text-gold-100/70 hover:border-gold-300/50 hover:text-gold-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Region cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {filteredRegions.map((region) => (
            <div
              key={region.name}
              className="rounded-2xl border border-gold-300/15 bg-navy-900/40 backdrop-blur-sm p-6 shadow-sm hover:border-gold-300/30 hover:bg-navy-900/60 transition-all duration-300"
            >
              {/* Region name */}
              <h3 className="text-base font-semibold text-gold-50 mb-3 tracking-wide">
                {region.name}
              </h3>
              <div className="h-px bg-gold-300/15 mb-3" />

              {/* Counties list */}
              <ul className="space-y-0 divide-y divide-gold-300/10">
                {region.counties.map((county) => (
                  <li
                    key={county.name}
                    className="flex items-center justify-between py-2.5 group"
                  >
                    <span className="text-sm text-gold-100/80 group-hover:text-gold-50 transition-colors duration-150">
                      {county.name}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-gold-400/50 shrink-0 group-hover:text-gold-300 group-hover:translate-x-0.5 transition-all duration-150" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
