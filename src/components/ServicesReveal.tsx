"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { services } from "@/data/servicesData";

export default function ServicesReveal() {
  const [isServicesVisible, setIsServicesVisible] = useState(false);
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

  return (
    <section
      ref={servicesRef}
      className={`mt-16 mb-12 transition-all duration-1000 ease-out ${
        isServicesVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
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
    </section>
  );
}
