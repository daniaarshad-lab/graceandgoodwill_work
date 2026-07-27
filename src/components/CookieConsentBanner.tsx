"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Shield, X, Settings } from "lucide-react";
import Toggle from "@/components/Toggle";

interface CookiePreferences {
  strictlyNecessary: true; // always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "gg_cookie_consent";

const DEFAULT_PREFERENCES: CookiePreferences = {
  strictlyNecessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const ALL_ACCEPTED: CookiePreferences = {
  strictlyNecessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};


function loadConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

function saveConsent(prefs: CookiePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}



export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  /* On mount, check if user has already made a choice */
  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);


  const handleAcceptAll = useCallback(() => {
    saveConsent(ALL_ACCEPTED);
    setVisible(false);
    setShowModal(false);
  }, []);

  const handleRejectNonEssential = useCallback(() => {
    saveConsent(DEFAULT_PREFERENCES);
    setVisible(false);
    setShowModal(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    saveConsent(prefs);
    setVisible(false);
    setShowModal(false);
  }, [prefs]);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeBanner = useCallback(() => {
    /* Closing the banner without choosing = reject non-essential (safe default) */
    saveConsent(DEFAULT_PREFERENCES);
    setVisible(false);
  }, []);

  /* ── Lock body scroll when modal is open ─────────────────────────────── */
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  /* ── Nothing to render if consent already given ──────────────────────── */
  if (!visible) return null;

  return (
    <>
      {/* ── Floating Consent Card ─────────────────────────────────────── */}
      {!showModal && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          aria-modal="false"
          className="
            fixed z-[99998] animate-fade-in
            bottom-4 left-4 right-4
            sm:bottom-5 sm:left-5 sm:right-auto
            md:bottom-6 md:left-6
          "
          style={{ maxWidth: 392 }}
        >
          <div
            className="
              rounded-2xl overflow-hidden
              bg-[#0B1230]
              border border-gold-muted/25
              shadow-[0_16px_60px_rgba(0,0,0,0.55),0_0_80px_rgba(160,128,84,0.05)]
            "
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-muted/10 border border-gold-muted/25 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-gold-400" />
                </div>
                <h2 className="text-[15px] font-semibold text-gold-100 tracking-wide">
                  We value your privacy
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBanner}
                aria-label="Close cookie consent banner"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gold-200/40 hover:text-gold-100 hover:bg-gold-muted/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-muted/50 -mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── Body Text ────────────────────────────────────────────── */}
            <div className="px-5 pt-3.5 pb-5">
              <p className="text-[12px] text-gold-200/55 leading-[1.65] font-light">
                Grace &amp; Goodwill uses cookies to ensure our website
                functions properly, improve your browsing experience, analyse
                website traffic, and, with your consent, provide personalised
                content and services. You can accept all cookies, reject
                non-essential cookies, or customise your preferences at any
                time.
              </p>
            </div>

            {/* ── Buttons ──────────────────────────────────────────────── */}
            <div className="px-5 pb-5 flex flex-col gap-2.5">
              {/* Accept All — primary gold filled */}
              <button
                id="cookie-accept-all"
                type="button"
                onClick={handleAcceptAll}
                className="
                  w-full inline-flex items-center justify-center
                  px-5 py-2.5 text-[13px] font-semibold rounded-xl
                  bg-[#b59469] text-navy-950
                  hover:bg-[#c9a67d] hover:text-white
                  hover:-translate-y-[1px]
                  hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)]
                  active:translate-y-0 active:shadow-none
                  transition-all duration-300 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-[#0B1230]
                "
              >
                Accept All
              </button>

              {/* Reject Non-Essential — outlined */}
              <button
                id="cookie-reject-non-essential"
                type="button"
                onClick={handleRejectNonEssential}
                className="
                  w-full inline-flex items-center justify-center
                  px-5 py-2.5 text-[13px] font-semibold rounded-xl
                  bg-transparent
                  border border-gold-muted/35 text-gold-200
                  hover:border-gold-muted/60 hover:bg-gold-muted/8 hover:text-white
                  active:bg-gold-muted/12
                  transition-all duration-300 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-[#0B1230]
                "
              >
                Reject Non-Essential
              </button>

              {/* Manage Preferences — text link with icon */}
              <button
                id="cookie-manage-preferences"
                type="button"
                onClick={openModal}
                className="
                  w-full inline-flex items-center justify-center gap-1.5
                  py-2 text-[12px] font-medium
                  text-gold-200/50
                  hover:text-gold-200/80
                  transition-all duration-200 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-gold-muted/50 rounded-lg
                "
              >
                <Settings className="w-3.5 h-3.5" />
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Manage Preferences Modal ──────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-label="Cookie Preferences"
          aria-modal="true"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="relative w-full max-w-[540px] max-h-[90vh] overflow-hidden rounded-2xl bg-[#0B1230] border border-gold-muted/20 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_120px_rgba(160,128,84,0.06)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold-muted/15 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-muted/10 border border-gold-muted/25 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4.5 h-4.5 text-gold-400" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gold-100 tracking-wide">
                  Cookie Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close cookie preferences"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gold-200/50 hover:text-gold-100 hover:bg-gold-muted/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-muted/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <div className="px-6 py-5 space-y-4">
                {/* ── 1. Strictly Necessary ─────────────────────────────── */}
                <CookieCategory
                  title="Strictly Necessary Cookies"
                  description="These cookies are essential for the website to function and cannot be switched off."
                  alwaysActive
                />

                {/* ── 2. Functional ─────────────────────────────────────── */}
                <CookieCategory
                  title="Functional Cookies"
                  description="Remember your preferences and improve your experience."
                  checked={prefs.functional}
                  onChange={(v) =>
                    setPrefs((p) => ({ ...p, functional: v }))
                  }
                />

                {/* ── 3. Analytics ──────────────────────────────────────── */}
                <CookieCategory
                  title="Analytics Cookies"
                  description="Help us understand how visitors use our website so we can improve it."
                  checked={prefs.analytics}
                  onChange={(v) =>
                    setPrefs((p) => ({ ...p, analytics: v }))
                  }
                />

                {/* ── 4. Marketing ──────────────────────────────────────── */}
                <CookieCategory
                  title="Marketing Cookies"
                  description="Used to measure marketing performance and, where applicable, provide more relevant content."
                  checked={prefs.marketing}
                  onChange={(v) =>
                    setPrefs((p) => ({ ...p, marketing: v }))
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gold-muted/15 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  id="cookie-modal-reject"
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-xl
                    border border-gold-muted/35 bg-transparent text-gold-200
                    hover:border-gold-muted/60 hover:bg-gold-muted/8 hover:text-white
                    transition-all duration-300 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-[#0B1230]"
                >
                  Reject Non-Essential
                </button>
                <button
                  id="cookie-modal-accept-all"
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-[13px] font-semibold rounded-xl
                    border border-gold-muted/35 bg-transparent text-gold-200
                    hover:border-gold-muted/60 hover:bg-gold-muted/8 hover:text-white
                    transition-all duration-300 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-[#0B1230]"
                >
                  Accept All
                </button>
                <button
                  id="cookie-modal-save"
                  type="button"
                  onClick={handleSavePreferences}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-[13px] font-semibold rounded-xl
                    bg-[#b59469] text-navy-950
                    hover:bg-[#c9a67d] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(160,128,84,0.24)]
                    transition-all duration-300 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-gold-muted/50 focus:ring-offset-2 focus:ring-offset-[#0B1230]"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Cookie Category Row                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

interface CookieCategoryProps {
  title: string;
  description: string;
  alwaysActive?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function CookieCategory({
  title,
  description,
  alwaysActive = false,
  checked = false,
  onChange,
}: CookieCategoryProps) {
  return (
    <div className="rounded-xl bg-navy-950/50 border border-gold-muted/12 p-4 transition-colors duration-200 hover:border-gold-muted/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gold-100 mb-1">
            {title}
          </h3>
          <p className="text-xs text-gold-200/50 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 pt-0.5">
          {alwaysActive ? (
            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full tracking-wide">
              Always Active
            </span>
          ) : (
            <Toggle
              checked={checked}
              onChange={(v) => onChange?.(v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
