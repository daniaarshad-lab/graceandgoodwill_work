"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import partnershipLogo1 from "@/assets/partnership-logo/partnership-logo1.webp";
import partnershipLogo2 from "@/assets/partnership-logo/partnership-logo2.webp";

const partners = [
  {
    id: 1,
    src: partnershipLogo1,
    alt: "UKABIF Partner",
    scaleClass: "scale-[1.8] sm:scale-[2.0] group-hover:scale-[1.9] sm:group-hover:scale-[2.1]"
  },
  {
    id: 2,
    src: partnershipLogo2,
    alt: "Brain Injury Group Partner",
    scaleClass: "scale-[1.3] sm:scale-[1.4] group-hover:scale-[1.4] sm:group-hover:scale-[1.5]"
  }
];

export default function PartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-24 sm:h-28 w-64 sm:w-72 mx-auto bg-white rounded-[2rem] p-4 shadow-soft hover:shadow-elegant overflow-hidden animate-float">
      {partners.map((partner, index) => (
        <div
          key={partner.id}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={partner.src}
            alt={partner.alt}
            fill
            className={`object-contain transition-transform duration-500 ${partner.scaleClass}`}
          />
        </div>
      ))}
    </div>
  );
}
