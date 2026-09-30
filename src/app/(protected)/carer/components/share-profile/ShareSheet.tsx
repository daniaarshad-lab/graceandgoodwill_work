"use client";

import { useState } from "react";
import {
  Link2,
  Copy,
  Check,
  CalendarDays,
  Mail,
  Share2,
  Lock,
  Users,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface ShareSheetProps {
  shareUrl: string;
  carerName?: string;
  expirationDate?: string;
  onRenew: () => void;
  renewing: boolean;
}

function formatExpirationDate(dateStr?: string): string {
  if (!dateStr) {
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + 1);
    return fallback.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ShareSheet({
  shareUrl,
  carerName,
  expirationDate,
  onRenew,
  renewing,
}: ShareSheetProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Stable, clean share URL without query parameters (such as ?v=...)
  const rawShareUrl = shareUrl ? shareUrl.split("?")[0] : "";
  const cleanShareUrl = (() => {
    if (!rawShareUrl) return "";
    // If running in browser and on an external host (e.g. ngrok tunnel), use current origin
    if (
      typeof window !== "undefined" &&
      window.location.origin &&
      !window.location.origin.includes("localhost") &&
      !window.location.origin.includes("127.0.0.1")
    ) {
      return rawShareUrl.replace(/^https?:\/\/[^\/]+/, window.location.origin);
    }
    // If NEXT_PUBLIC_APP_URL is configured (e.g. ngrok tunnel during development)
    const envAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
    if (envAppUrl && !envAppUrl.includes("localhost") && !envAppUrl.includes("127.0.0.1")) {
      return rawShareUrl.replace(/^https?:\/\/[^\/]+/, envAppUrl.replace(/\/+$/, ""));
    }
    return rawShareUrl;
  })();

  // Dynamic carer naming
  const resolvedName =
    carerName?.trim() ||
    (user?.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim() : "") ||
    "Our carer";

  const nameParts = resolvedName.split(/\s+/).filter(Boolean);
  const firstName = user?.firstName?.trim() || nameParts[0] || "Our carer";
  const lastInitial = user?.lastName?.trim()
    ? user.lastName.trim().charAt(0).toUpperCase()
    : nameParts.length > 1
    ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    : "";
  const formalName = lastInitial && !firstName.endsWith(".")
    ? `${firstName} ${lastInitial}.`
    : resolvedName;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanShareUrl);
      setCopied(true);
      showSuccessToast("Copied!", "Share link copied to clipboard.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showErrorToast("Failed", "Could not copy link to clipboard.");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `${formalName} has shared their professional live-in carer profile with you through Grace & Goodwill.\n\nView ${firstName}'s experience, introduction video, care skills, interests, languages and current availability using the secure link below.\n\n🔗 ${cleanShareUrl}\n\nThis profile link is available for a limited period.\n\nIf you would like to discuss ${firstName}'s profile, check their availability or talk to us about other live-in care options, the Grace & Goodwill team is here to help.\n\n📞 Call: 020 4524 0108\n💬 WhatsApp: +44 7462 931949\n🌐 graceandgoodwill.co.uk`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');
    
    // api.whatsapp.com avoids the wa.me redirect that sometimes corrupts emojis on desktop web
    const targetUrl = isMobile
      ? `whatsapp://send?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(targetUrl, "_blank");
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `${formalName} — Professional Live-In Carer Profile`,
    )}&body=${encodeURIComponent(
      `Hello,\n\nPlease find my professional carer profile here:\n${cleanShareUrl}\n\nKind regards,\n${formalName}`,
    )}`;
  };

  const handleShareSMS = () => {
    window.location.href = `sms:?&body=${encodeURIComponent(
      `My carer profile (Grace & Goodwill): ${cleanShareUrl}`,
    )}`;
  };

  const handleShareSocial = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const text = `${formalName} has shared their professional live-in carer profile with you through Grace & Goodwill.\n\nView ${firstName}'s experience, introduction video, care skills, interests, languages and current availability using the secure link below.\n\n🔗 ${cleanShareUrl}\n\nThis profile link is available for a limited period.\n\nIf you would like to discuss ${firstName}'s profile, check their availability or talk to us about other live-in care options, the Grace & Goodwill team is here to help.\n\n📞 Call: 020 4524 0108\n💬 WhatsApp: +44 7462 931949\n🌐 graceandgoodwill.co.uk`;
        
        await navigator.share({
          title: `${formalName} – Professional Live-In Carer Profile`,
          text: text,
          url: cleanShareUrl,
        });
      } catch {
        // Ignored if user dismissed share dialog
      }
    } else {
      await copyLink();
      showSuccessToast(
        "Copied",
        "Link copied — paste it into your social media post.",
      );
    }
  };

  const formattedExpiry = formatExpirationDate(expirationDate);

  return (
    <div className="space-y-3.5">
      {/* 1. Active Until Banner */}
      <div
        className="rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          background: "rgba(10, 18, 42, 0.65)",
          border: "1px solid rgba(201, 171, 82, 0.25)",
        }}
      >
        {/* Left: Green Active Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#052418] border border-emerald-500/40 w-fit">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
          <div className="text-xs sm:text-[12.5px]">
            <span className="text-emerald-400 font-semibold">Active until:</span>{" "}
            <span className="text-white font-medium">{formattedExpiry}</span>
          </div>
        </div>

        {/* Right: Calendar note */}
        <div className="flex items-center gap-2 sm:max-w-[280px]">
          <CalendarDays className="w-5 h-5 flex-shrink-0 text-[#ECCB76]" />
          <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-tight">
            Your link will remain active for 1 month. You can generate a new link when the current one expires.
          </p>
        </div>
      </div>

      {/* 2. Your Shareable Profile Link */}
      <div>
        <p className="text-xs sm:text-[13px] font-semibold text-white mb-1.5">
          Your Shareable Profile Link
        </p>
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Input Box */}
          <div
            className="flex-1 min-w-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: "rgba(10, 18, 42, 0.65)",
              border: "1px solid rgba(201, 171, 82, 0.35)",
            }}
          >
            <Link2 className="w-4 h-4 flex-shrink-0 text-[#ECCB76] stroke-[2.2]" />
            <span className="text-xs sm:text-sm text-slate-200 font-mono truncate select-all">
              {cleanShareUrl}
            </span>
          </div>

          {/* Copy Link Button */}
          <button
            id="copy-share-link-btn"
            type="button"
            onClick={copyLink}
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-all active:scale-95 hover:brightness-105"
            style={{
              background: "linear-gradient(135deg, #F8E090 0%, #D8A93E 50%, #B8851E 100%)",
              color: "#0A1128",
              border: "none",
              boxShadow: "0 4px 15px rgba(216, 169, 62, 0.3)",
            }}
          >
            <Copy className="w-4 h-4 stroke-[2.2]" />
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      {/* 3. Share Your Profile */}
      <div>
        <p className="text-xs sm:text-[13px] font-semibold text-white mb-2">
          Share Your Profile
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {/* WhatsApp */}
          <button
            id="share-via-whatsapp-btn"
            type="button"
            onClick={handleShareWhatsApp}
            className="py-2.5 px-2 sm:py-2.5 sm:px-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:border-amber-400/50 hover:bg-slate-800/40 active:scale-[0.98]"
            style={{
              background: "rgba(10, 18, 42, 0.65)",
              border: "1px solid rgba(201, 171, 82, 0.25)",
            }}
          >
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm mb-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.532 5.847L0 24l6.302-1.508A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.493-5.195-1.357l-.371-.221-3.742.895.928-3.647-.244-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </div>
            <span className="text-[11.5px] sm:text-xs font-semibold text-white">WhatsApp</span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-0.5 mt-0.5">
              <span>Share via WhatsApp</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ECCB76] stroke-[2.5] flex-shrink-0" />
            </span>
          </button>

          {/* Email */}
          <button
            id="share-via-email-btn"
            type="button"
            onClick={handleShareEmail}
            className="py-2.5 px-2 sm:py-2.5 sm:px-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:border-amber-400/50 hover:bg-slate-800/40 active:scale-[0.98]"
            style={{
              background: "rgba(10, 18, 42, 0.65)",
              border: "1px solid rgba(201, 171, 82, 0.25)",
            }}
          >
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center text-[#ECCB76] mb-1">
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <span className="text-[11.5px] sm:text-xs font-semibold text-white">Email</span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-0.5 mt-0.5">
              <span>Send via Email</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ECCB76] stroke-[2.5] flex-shrink-0" />
            </span>
          </button>

          {/* Text / SMS */}
          <button
            id="share-via-sms-btn"
            type="button"
            onClick={handleShareSMS}
            className="py-2.5 px-2 sm:py-2.5 sm:px-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:border-amber-400/50 hover:bg-slate-800/40 active:scale-[0.98]"
            style={{
              background: "rgba(10, 18, 42, 0.65)",
              border: "1px solid rgba(201, 171, 82, 0.25)",
            }}
          >
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center text-[#ECCB76] mb-1">
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <span className="text-[11.5px] sm:text-xs font-semibold text-white">Text / SMS</span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-0.5 mt-0.5">
              <span>Send via SMS</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ECCB76] stroke-[2.5] flex-shrink-0" />
            </span>
          </button>

          {/* Social Media */}
          <button
            id="share-via-social-btn"
            type="button"
            onClick={handleShareSocial}
            className="py-2.5 px-2 sm:py-2.5 sm:px-2 rounded-xl flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:border-amber-400/50 hover:bg-slate-800/40 active:scale-[0.98]"
            style={{
              background: "rgba(10, 18, 42, 0.65)",
              border: "1px solid rgba(201, 171, 82, 0.25)",
            }}
          >
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center text-blue-200 mb-1">
              <Share2 className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <span className="text-[11.5px] sm:text-xs font-semibold text-white">Social Media</span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 flex items-center justify-center gap-0.5 mt-0.5">
              <span>Share on Social</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#ECCB76] stroke-[2.5] flex-shrink-0" />
            </span>
          </button>
        </div>
      </div>

      {/* 4. Grace & Goodwill Enquiries Notice Box */}
      <div
        className="rounded-2xl p-3.5 sm:p-4"
        style={{
          background: "rgba(10, 18, 42, 0.55)",
          border: "1.5px solid rgba(236, 203, 118, 0.6)",
          boxShadow:
            "0 0 20px rgba(236, 203, 118, 0.25), inset 0 0 12px rgba(236, 203, 118, 0.08)",
        }}
      >
        <div className="flex items-start gap-3 sm:gap-3.5">
          {/* Shield Outline with Padlock */}
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-9 h-11 sm:w-10 sm:h-12 text-[#ECCB76]"
              viewBox="0 0 36 44"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M18 2.5L4 7.5v15c0 10.5 14 18 14 18s14-7.5 14-18v-15L18 2.5z"
                strokeWidth="2.4"
              />
              <path
                d="M14 20v-3.5a4 4 0 0 1 8 0V20"
                strokeWidth="2.2"
              />
              <rect
                x="12"
                y="20"
                width="12"
                height="9"
                rx="2"
                fill="currentColor"
                strokeWidth="2"
              />
              <circle cx="18" cy="23.5" r="1" fill="#0A1128" stroke="none" />
              <path d="M18 24.5v2" stroke="#0A1128" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs sm:text-[13px] font-semibold leading-snug text-[#ECCB76]">
              All enquiries and care requests generated through your shared profile
              are directed through Grace &amp; Goodwill.
            </p>
            <p className="text-[11px] sm:text-xs leading-normal text-amber-100/75">
              If a family or client is interested in your profile, we will contact you directly
              to discuss the opportunity.
            </p>
            <div className="h-px w-full my-2 bg-amber-400/20" />
            <div className="flex items-center gap-2 pt-0.5">
              <Lock className="w-3.5 h-3.5 flex-shrink-0 text-[#ECCB76]" />
              <p className="text-[10px] sm:text-[11px] text-[#ECCB76]/90">
                <span className="font-semibold text-white">Your personal details remain private.</span> No personal contact details, home address or compliance documents will be shown.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Digital Business Card Note */}
      <div className="flex items-start gap-3 px-1 py-0.5">
        <Users className="w-5 h-5 flex-shrink-0 text-[#ECCB76] stroke-[1.8] mt-0.5" />
        <p className="text-[11px] sm:text-xs text-slate-300 leading-normal">
          Use your profile as a digital business card and help more prospective clients,
          families and professional contacts discover your experience, skills and availability.
        </p>
      </div>

      {/* 6. Generate New Link Button */}
      <button
        id="renew-share-link-btn"
        type="button"
        onClick={onRenew}
        disabled={renewing}
        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-2.5 px-4 rounded-xl text-xs sm:text-[13.5px] font-semibold tracking-[0.02em] transition-all duration-300 cursor-pointer shadow-md active:scale-[0.99] mt-2"
        style={{
          background: "linear-gradient(135deg, #F8E090 0%, #D8A93E 45%, #B8851E 100%)",
          color: "#0A1128",
          border: "none",
          boxShadow: "0 4px 20px rgba(216, 169, 62, 0.35)",
        }}
      >
        <RefreshCw className={`w-4 h-4 stroke-[2.2] ${renewing ? "animate-spin" : ""}`} />
        <span>{renewing ? "Generating New Link..." : "Generate New Link"}</span>
      </button>
    </div>
  );
}
