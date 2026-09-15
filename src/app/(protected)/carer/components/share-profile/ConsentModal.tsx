"use client";

import { useState } from "react";

interface ConsentModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ConsentModal({ onConfirm, onCancel, loading }: ConsentModalProps) {
  const [consented, setConsented] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-navy-900 border border-gold-300/15 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-[slideUp_0.3s_ease]">
        {/* Handle */}
        <div className="w-10 h-1 bg-gold-300/20 rounded-full mx-auto mb-6 sm:hidden" />

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold-DEFAULT" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7V8a5 5 0 00-10 0v2M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gold-50">Before You Share</h2>
        </div>

        <p className="text-xs text-gold-100/55 leading-relaxed mb-5">
          Your shareable profile will display your photograph, introductory video (if uploaded),
          biography, experience, skills, languages, and availability.{" "}
          <strong className="text-gold-100/75">No personal contact details, address, or financial
          information will be shown.</strong>
          <br /><br />
          The link will expire after <strong className="text-gold-DEFAULT">30 minutes</strong>.
          You can generate a new one at any time.
        </p>

        {/* Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer bg-navy-800/60 border border-gold-300/10 rounded-xl p-4 mb-6 hover:border-gold-300/20 transition-colors">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              className="sr-only"
            />
            <div
              style={{
                backgroundColor: consented ? "#EAB308" : "transparent",
                borderColor: "#EAB308",
                boxShadow: consented
                  ? "0 0 14px rgba(234, 179, 8, 0.6)"
                  : "none",
              }}
              className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
            >
              {consented && (
                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="#0A1128"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-gold-100/65 leading-relaxed">
            I understand that sharing my profile is entirely{" "}
            <strong className="text-gold-100/85">at my own discretion</strong>. I decide where
            and with whom I share it. Grace &amp; Goodwill are not responsible for how my profile
            is used once shared.
          </span>
        </label>

        {/* Actions */}
        <button
          id="confirm-consent-btn"
          onClick={onConfirm}
          disabled={!consented || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
            bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20
            text-navy-950 text-sm font-bold tracking-wide
            shadow-[0_4px_15px_rgba(245,212,160,0.2)] hover:shadow-[0_6px_20px_rgba(245,212,160,0.3)]
            hover:-translate-y-[1px] transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          )}
          {loading ? "Generating…" : "Generate My Shareable Link"}
        </button>
        <button
          onClick={onCancel}
          className="w-full mt-3 py-2.5 text-xs text-gold-100/40 hover:text-gold-100/70 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
