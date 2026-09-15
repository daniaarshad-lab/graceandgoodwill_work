"use client";

import { useState } from "react";
import { showSuccessToast } from "@/utils/toast";

interface ShareSheetProps {
  shareUrl: string;
  onRenew: () => void;
  renewing: boolean;
}

const CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.532 5.847L0 24l6.302-1.508A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.493-5.195-1.357l-.371-.221-3.742.895.928-3.647-.244-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
    iconBg: "bg-green-500/10 border-green-500/20",
    action: (url: string) => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi! I'd like to share my carer profile with you: ${url}`)}`, "_blank"),
  },
  {
    id: "email",
    label: "Email",
    icon: (
      <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    action: (url: string) =>
      (window.location.href = `mailto:?subject=${encodeURIComponent("My Carer Profile — Grace & Goodwill")}&body=${encodeURIComponent(`Hello,\n\nPlease find my professional carer profile here:\n${url}\n\nThis link is valid for 30 minutes.\n\nKind regards`)}`),
  },
  {
    id: "sms",
    label: "Text / SMS",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    action: (url: string) => (window.location.href = `sms:?&body=${encodeURIComponent(`My carer profile (Grace & Goodwill): ${url}`)}`),
  },
  {
    id: "social",
    label: "Social Media",
    icon: (
      <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
      </svg>
    ),
    iconBg: "bg-pink-500/10 border-pink-500/20",
    action: (url: string) => {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({ title: "My Carer Profile – Grace & Goodwill", url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        showSuccessToast("Copied", "Link copied — paste it into your social media post.");
      }
    },
  },
];

export default function ShareSheet({ shareUrl, onRenew, renewing }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showSuccessToast("Copied!", "Share link copied to clipboard.");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Link box */}
      <div className="flex items-center gap-2 bg-navy-800/60 border border-gold-300/10 rounded-xl px-4 py-3">
        <span className="flex-1 text-xs text-gold-100/60 font-mono truncate">{shareUrl}</span>
        <button
          id="copy-share-link-btn"
          onClick={copyLink}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            copied
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 text-gold-DEFAULT hover:bg-gold-DEFAULT/20"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Channel grid */}
      <p className="text-[10px] uppercase tracking-widest text-gold-100/30 font-semibold">Share via</p>
      <div className="grid grid-cols-2 gap-3">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            id={`share-via-${ch.id}-btn`}
            onClick={() => ch.action(shareUrl)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gold-300/10 bg-navy-800/40
              hover:border-gold-300/25 hover:bg-navy-800/70 transition-all text-left"
          >
            <span className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${ch.iconBg}`}>
              {ch.icon}
            </span>
            <span className="text-xs font-semibold text-gold-100/70">{ch.label}</span>
          </button>
        ))}
      </div>

      {/* Renew */}
      <button
        id="renew-share-link-btn"
        onClick={onRenew}
        disabled={renewing}
        className="w-full py-3 rounded-xl border border-dashed border-gold-300/15 text-xs text-gold-100/35
          hover:border-gold-300/30 hover:text-gold-100/60 transition-all disabled:opacity-50"
      >
        {renewing ? "Generating new link…" : "↻ Generate a New Link"}
      </button>
    </div>
  );
}
