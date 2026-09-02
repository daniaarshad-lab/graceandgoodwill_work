"use client";

import Image from "next/image";
import partnershipLogo3 from "@/assets/partnership-logo/partnership-logo3.jpeg";
import partnershipLogo2 from "@/assets/partnership-logo/partnership-logo2.webp";

const partners = [
  {
    id: 1,
    src: partnershipLogo3,
    alt: "UKABIF Partner",
    cssHeight: 60, // UKABIF — much smaller to fit comfortably
  },
  {
    id: 2,
    src: partnershipLogo2,
    alt: "Brain Injury Group Partner",
    cssHeight: 72, 
  },
];

/**
 * True seamless marquee math:
 * - We render ONE half = 4 repetitions of the partner set (8 logo slots)
 * - 8 slots × ~280px each ≈ 2240px — wider than any common viewport
 * - We then render a SECOND identical half (aria-hidden) immediately after
 * - Total track = 2 × half = ~4480px
 * - Animation: translateX(-50%) moves the track left by exactly ONE half
 * - When it resets to 0, the start of half-A looks identical to the start of half-B
 * - Result: perfectly seamless, no gaps, no jumps, ever.
 */
const half = [...partners, ...partners, ...partners, ...partners]; // 8 logo slots

const LogoItem = ({
  partner,
  hidden,
  index,
}: {
  partner: (typeof partners)[0];
  hidden?: boolean;
  index: number;
}) => (
  <div
    className="partners-marquee-item"
    aria-hidden={hidden || undefined}
    key={index}
  >
    <div className="partners-logo-card relative">
      {/* Soft spotlight glow to ensure dark text is highly readable against the dark card */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.7)_0%,_transparent_60%)] pointer-events-none rounded-xl" />
      
      <Image
        className="relative z-10 drop-shadow-sm"
        src={partner.src}
        alt={partner.alt}
        style={{
          height: `${partner.cssHeight}px`,
          width: "auto",
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  </div>
);

export default function PartnersCarousel() {
  return (
    <div className="partners-marquee-wrapper">
      {/* Edge fade masks */}
      <div className="partners-marquee-fade partners-marquee-fade--left" />
      <div className="partners-marquee-fade partners-marquee-fade--right" />

      <div className="partners-marquee-track">
        {/* Half A — the "real" content */}
        {half.map((partner, i) => (
          <LogoItem key={`a-${i}`} partner={partner} index={i} />
        ))}

        {/* Half B — exact duplicate, aria-hidden, makes the -50% loop seamless */}
        {half.map((partner, i) => (
          <LogoItem key={`b-${i}`} partner={partner} index={i} hidden />
        ))}
      </div>
    </div>
  );
}
