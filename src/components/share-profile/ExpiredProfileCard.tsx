import { Globe, ArrowRight } from "lucide-react";
import { CallUsButton, WhatsAppButton, EnquiryButton } from "@/components/Button";

export default function ExpiredProfileCard() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-10 relative z-10 w-full">
      {/* ── Logo Container (Above the Card) ── */}
      <div className="flex items-center gap-3 w-full mb-6 mt-2 px-1">
        <img
          src="/website_logo.png"
          alt="Grace & Goodwill logo"
          className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        />
        <div className="flex flex-col items-start justify-center">
          <span
            className="font-['Cinzel'] text-[15px] sm:text-[18px] font-medium tracking-[0.20em] uppercase leading-none"
            style={{
              color: "#D4AF7A",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            GRACE & GOODWILL
          </span>
          <span 
            className="text-[8px] sm:text-[9.5px] tracking-[0.2em] uppercase mt-1.5 leading-none"
            style={{ color: "#D4AF7A", opacity: 0.85 }}
          >
            Care Defined By Integrity
          </span>
        </div>
      </div>

      <div
        className="w-full max-w-[300px] rounded-3xl shadow-xl overflow-visible"
        style={{ backgroundColor: "#f5f0e8" }}
      >
        {/* Share Icon Badge — floats above card, straddling wave edge */}
        <div className="flex justify-center" style={{ marginTop: -30 }}>
          <div
            className="w-[58px] h-[58px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#f5f0e8",
              border: "2px solid #ddd5c5",
              boxShadow: "0 2px 16px rgba(13,27,62,0.22), 0 0 0 5px #f5f0e8",
            }}
          >
            {/* Share icon: upload/share arrow */}
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#c8a96e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
        </div>
        {/* Spacer below floating icon */}
        <div style={{ height: 14 }} />

        {/* Text Block */}
        <div className="px-4 pb-3 text-center">
          <h1
            className="text-[24px] sm:text-[26px] leading-[1.15]"
            style={{ 
              color: "#0d1b3e", 
              fontFamily: "'Cormorant Garamond', 'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontWeight: 600
            }}
          >
            This carer profile<br />link has expired
          </h1>
          <p
            className="text-[12.5px] mt-2 leading-relaxed"
            style={{ color: "#555e6e" }}
          >
            This shared profile is no longer available.
            If you would like to find out more about this specific
            carer or explore available live-in care options,
            please contact the Grace &amp; Goodwill team.
            We&apos;ll be happy to support you.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="px-4 pb-4 space-y-2">
          {/* Call Us */}
          <CallUsButton />

          {/* WhatsApp Us */}
          <WhatsAppButton />

          {/* Make an Enquiry */}
          <EnquiryButton />

          {/* Visit Website */}
          <a
            href="https://graceandgoodwill.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center w-full rounded-2xl overflow-hidden shadow-sm border transition-transform hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: "#f5f0e8", borderColor: "#ddd5c5", height: "48px" }}
          >
            <span
              className="flex items-center justify-center w-12 h-full shrink-0"
              style={{ backgroundColor: "#ece8de" }}
            >
              <Globe className="w-5 h-5" style={{ color: "#0d1b3e" }} />
            </span>
            <span
              className="w-px self-stretch"
              style={{ backgroundColor: "#ddd5c5" }}
            />
            <span className="flex-1 px-4 text-left">
              <span className="block text-sm font-bold" style={{ color: "#0d1b3e" }}>
                Visit Grace &amp; Goodwill
              </span>
              <span className="block text-xs" style={{ color: "#8a8070" }}>
                https://graceandgoodwill.co.uk
              </span>
            </span>
            <span className="pr-4">
              <ArrowRight className="w-4 h-4" style={{ color: "#8a8070" }} />
            </span>
          </a>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 w-full max-w-sm mt-6 mb-4 px-2">
        <div className="flex-1 h-px" style={{ backgroundColor: "#c8a96e44" }} />
        <span
          className="text-[10px] tracking-[0.2em] uppercase font-light whitespace-nowrap"
          style={{ color: "#c8a96e88" }}
        >
          Live-In Care Across the UK
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#c8a96e44" }} />
      </div>

      {/* ── Brand Values Footer ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm px-1">
        {[
          {
            src: "/Integrity.png",
            label: "INTEGRITY",
            sub: "Morally and ethically guided.",
          },
          {
            src: "/Compassion.png",
            label: "COMPASSION",
            sub: "A duty to care, a promise to serve.",
          },
          {
            src: "/Trust.png",
            label: "TRUST",
            sub: "Built on honesty, strengthened by reliability.",
          },
          {
            src: "/Purpose.png",
            label: "PURPOSE",
            sub: "Care with meaning, impact that lasts.",
          },
        ].map(({ src, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5 px-1">
            <img
              src={src}
              alt={label}
              className="w-8 h-8 object-contain opacity-80"
            />
            <span
              className="text-[9px] font-bold tracking-wider uppercase"
              style={{ color: "#c8a96e" }}
            >
              {label}
            </span>
            <span
              className="text-[8px] leading-tight"
              style={{ color: "#7a8aaa" }}
            >
              {sub}
            </span>
          </div>
        ))}
      </div>

      {/* ── Tagline ────────────────────────────────────────────────────── */}
      <p
        className="mt-4 text-xs italic"
        style={{ color: "#c8a96e", fontFamily: "Georgia, serif" }}
      >
        Changing lives through better care
      </p>
    </div>
  );
}
