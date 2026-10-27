"use client";

import React from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  ChevronRight,
  Link as LinkIcon,
  CheckCircle2,
  QrCode,
  Shield,
  Heart,
  Landmark,
  Award,
} from 'lucide-react';

interface ExpiredProfileViewProps {
  onBack: () => void;
}

export const ExpiredProfileView: React.FC<ExpiredProfileViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#060D1E] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* Background Room Subtle Blur Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury living background"
          className="w-full h-full object-cover object-center filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060D1E]/90 via-[#060D1E]/95 to-[#060D1E]" />
      </div>

      {/* Top Bar for Back / Admin Switch */}
      <div className="w-full max-w-4xl px-4 pt-4 flex items-center justify-between relative z-20">
        <button
          onClick={onBack}
          className="text-xs text-[#D4AF7A] hover:text-[#EBD8B2] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-[#D4AF7A]/20 backdrop-blur-sm transition-colors"
        >
          &larr; Back to Admin Portal
        </button>
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF7A]/60 font-semibold">
          Expired Link Share Preview
        </span>
      </div>

      {/* ── SECTION 1: Brand Header ── */}
      <div className="pt-8 pb-6 flex flex-col items-center text-center relative z-10 px-4">
        {/* 3D Gold Knot Logo */}
        <div className="w-16 h-16 mb-3 relative">
          <img
            src="/website_logo.png"
            alt="Grace & Goodwill Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,122,0.4)]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <h1 className="font-cinzel text-lg md:text-xl font-medium tracking-[0.22em] text-[#D4AF7A] uppercase drop-shadow-md">
          Grace &amp; Goodwill
        </h1>

        <div className="flex items-center gap-2 mt-1.5 opacity-90">
          <div className="w-6 h-px bg-[#D4AF7A]/70" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF7A] font-medium">
            Care Defined By Integrity
          </span>
          <div className="w-6 h-px bg-[#D4AF7A]/70" />
        </div>
      </div>

      {/* ── SECTION 2: Expired Profile Card (Preserved Above Footer) ── */}
      <div className="w-full max-w-sm px-4 relative z-10 mb-10">
        <div className="bg-[#FAF7F2] text-[#0A1629] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EAE2D2] relative pt-10">
          {/* Floating Chain Link Icon Straddling Top Card Edge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-[#E0D5C1] shadow-lg flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-[#B88E3E]" strokeWidth={2.4} />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2.5">
            <h2 className="font-serif text-2xl font-bold text-[#0A1629] leading-tight">
              This carer profile<br />link has expired
            </h2>
            <p className="text-xs text-[#6B5E47] leading-relaxed">
              This shared profile is no longer available. If you would like to find out more about this specific carer or explore available live-in care options, please contact the Grace &amp; Goodwill team. We&apos;ll be happy to support you.
            </p>
          </div>

          {/* 4 Contact Buttons */}
          <div className="space-y-2.5 mt-6">
            {/* 1. Call Us */}
            <a
              href="tel:02045240108"
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#060D1E] text-white border border-[#D4AF7A]/40 shadow-sm hover:brightness-110 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF7A]/15 flex items-center justify-center text-[#D4AF7A]">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">Call Us</div>
                  <div className="text-[10px] text-[#D4AF7A]">020 4524 0108</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF7A] group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 2. WhatsApp Us */}
            <a
              href="https://wa.me/447462931949"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#1E6B43] text-white shadow-sm hover:bg-[#185A37] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">WhatsApp Us</div>
                  <div className="text-[10px] text-emerald-100">+44 7462 931949</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 3. Make an Enquiry */}
            <a
              href="mailto:info@graceandgoodwill.co.uk"
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF7A] to-[#B88E3E] text-[#0A1629] shadow-sm hover:brightness-105 transition-all group font-semibold"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-[#0A1629]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#0A1629]">Make an Enquiry</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1629] group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 4. Visit Grace & Goodwill */}
            <a
              href="https://graceandgoodwill.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-[#EDE4D3] text-[#0A1629] border border-[#DDD5C5] shadow-sm hover:bg-[#E5DAC6] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center text-[#0A1629]">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-[#0A1629]">Visit Grace &amp; Goodwill</div>
                  <div className="text-[10px] text-[#8A7A60]">https://graceandgoodwill.co.uk</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A7A60] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: REPLACED BOTTOM SECTION - FULL WEBSITE FOOTER DESIGN ── */}
      <footer className="w-full bg-[#050B17] border-t border-[#D4AF7A]/20 pt-10 pb-8 px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-10">
          {/* Header Divider: LIVE-IN CARE ACROSS THE UK */}
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF7A]/40" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#D4AF7A] font-semibold">
              Live-In Care Across The UK
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF7A]/40" />
          </div>

          {/* 4 Brand Values with Official Icons & Text */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* 1. Integrity */}
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#D4AF7A]/20 to-transparent border border-[#D4AF7A]/30 flex items-center justify-center text-[#D4AF7A] shadow-md">
                <Shield className="w-6 h-6 text-[#D4AF7A]" />
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#EBD8B2] tracking-wider uppercase mt-1">
                Integrity
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Morally and ethically guided.
              </p>
            </div>

            {/* 2. Compassion */}
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#D4AF7A]/20 to-transparent border border-[#D4AF7A]/30 flex items-center justify-center text-[#D4AF7A] shadow-md">
                <Heart className="w-6 h-6 text-[#D4AF7A]" />
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#EBD8B2] tracking-wider uppercase mt-1">
                Compassion
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                A duty to care, a promise to serve.
              </p>
            </div>

            {/* 3. Trust */}
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#D4AF7A]/20 to-transparent border border-[#D4AF7A]/30 flex items-center justify-center text-[#D4AF7A] shadow-md">
                <Landmark className="w-6 h-6 text-[#D4AF7A]" />
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#EBD8B2] tracking-wider uppercase mt-1">
                Trust
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Built on honesty, strengthened by reliability.
              </p>
            </div>

            {/* 4. Purpose */}
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#D4AF7A]/20 to-transparent border border-[#D4AF7A]/30 flex items-center justify-center text-[#D4AF7A] shadow-md">
                <Award className="w-6 h-6 text-[#D4AF7A]" />
              </div>
              <h4 className="font-cinzel text-xs font-bold text-[#EBD8B2] tracking-wider uppercase mt-1">
                Purpose
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Care with meaning, impact that lasts.
              </p>
            </div>
          </div>

          {/* 4 Trust Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2 border-y border-[#D4AF7A]/15 text-center text-xs">
            <div className="p-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] mx-auto mb-1" />
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wide">
                Fully Vetted Carers
              </div>
            </div>
            <div className="p-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] mx-auto mb-1" />
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wide">
                Self-Employed Professionals
              </div>
            </div>
            <div className="p-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] mx-auto mb-1" />
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wide">
                Compassionate &amp; Reliable
              </div>
            </div>
            <div className="p-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] mx-auto mb-1" />
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wide">
                Family-Focused Support
              </div>
            </div>
          </div>

          {/* Need a Live-in Carer Banner */}
          <div className="bg-gradient-to-r from-[#D4AF7A] to-[#B88E3E] text-[#0A1629] rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#060D1E] text-[#D4AF7A] flex items-center justify-center shrink-0 shadow-md">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                  NEED A LIVE-IN CARER?
                </h3>
                <p className="text-xs sm:text-sm font-medium opacity-90">
                  Speak with our friendly team today.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a
                href="https://graceandgoodwill.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060D1E]/15 hover:bg-[#060D1E]/25 transition-colors font-semibold"
              >
                <Globe className="w-4 h-4" />
                <span>graceandgoodwill.co.uk</span>
              </a>
              <a
                href="tel:02045781269"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060D1E]/15 hover:bg-[#060D1E]/25 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>020 4578 1269</span>
              </a>
              <a
                href="mailto:info@graceandgoodwill.co.uk"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060D1E]/15 hover:bg-[#060D1E]/25 transition-colors font-semibold"
              >
                <Mail className="w-4 h-4" />
                <span>info@graceandgoodwill.co.uk</span>
              </a>
            </div>
          </div>

          {/* Bottom Branding & QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative shrink-0">
                <img
                  src="/website_logo.png"
                  alt="Grace & Goodwill Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,122,0.3)]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <p className="font-serif italic text-sm text-[#D4AF7A]">
                  Delivering care with integrity.
                </p>
                <p className="text-xs text-slate-300 font-light">
                  Because every person deserves exceptional care.
                </p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex items-center gap-3 bg-white/5 border border-[#D4AF7A]/30 p-2.5 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-[#060D1E]" />
              </div>
              <div className="text-left text-[10px]">
                <span className="block font-semibold uppercase tracking-wider text-[#D4AF7A]">
                  Visit Our Website
                </span>
                <span className="text-slate-400">Scan to browse live-in care</span>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-6 border-t border-white/10 text-center text-[10px] text-slate-400 space-y-1 font-light">
            <p>&copy; Grace &amp; Goodwill Ltd 2026. Company Registration No. 16011465.</p>
            <p className="text-slate-500">
              Grace &amp; Goodwill is an introductory agency for independent live-in carers and does not provide regulated care services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
