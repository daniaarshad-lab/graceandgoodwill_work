"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Share2, RefreshCw, Check } from "lucide-react";
import shareableProfileService, {
  ShareTokenStatus,
} from "@/services/carer/shareableProfile.service";
import ShareSheet from "./ShareSheet";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOKEN_TTL = 30 * 60; // 30 min in seconds

export default function ShareProfileModal({
  isOpen,
  onClose,
}: ShareProfileModalProps) {
  const [status, setStatus] = useState<ShareTokenStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [consented, setConsented] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Countdown timer ──────────────────────────────────────────────
  const startCountdown = useCallback((initial: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(initial);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus({ hasActiveToken: false });
          showErrorToast(
            "Link Expired",
            "Your share link has expired. Generate a new one to continue sharing.",
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Load status on open ──────────────────────────────────────────
  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shareableProfileService.getShareTokenStatus();
      setStatus(data);
      if (
        data.hasActiveToken &&
        data.expiresInSeconds &&
        data.expiresInSeconds > 0
      ) {
        setSecondsLeft(data.expiresInSeconds);
        startCountdown(data.expiresInSeconds);
      } else {
        setStatus({ hasActiveToken: false });
      }
    } catch {
      setStatus({ hasActiveToken: false });
    } finally {
      setLoading(false);
    }
  }, [startCountdown]);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, loadStatus]);

  // ── Close on Escape key ──────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Generate token after consent ─────────────────────────────────
  const handleGenerate = async () => {
    if (!consented) return;
    setGenerating(true);
    try {
      const data = await shareableProfileService.generateShareToken(true);
      setStatus(data);
      const secs = data.expiresInSeconds ?? TOKEN_TTL;
      setSecondsLeft(secs);
      startCountdown(secs);
      showSuccessToast(
        "Link Ready",
        "Your shareable profile link is active for 30 minutes.",
      );
    } catch (err: any) {
      showErrorToast("Failed", err.message || "Could not generate share link.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Renew token ──────────────────────────────────────────────────
  const handleRenew = async () => {
    setGenerating(true);
    try {
      const data = await shareableProfileService.generateShareToken(true);
      setStatus(data);
      const secs = data.expiresInSeconds ?? TOKEN_TTL;
      setSecondsLeft(secs);
      startCountdown(secs);
      showSuccessToast(
        "Link Renewed",
        "A fresh 30-minute share link has been generated.",
      );
    } catch (err: any) {
      showErrorToast("Failed", err.message || "Could not renew link.");
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  const pctLeft = Math.min(100, Math.round((secondsLeft / TOKEN_TTL) * 100));
  const isUrgent = secondsLeft > 0 && secondsLeft <= 120;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-navy-900 border border-gold-300/20 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-[slideUp_0.25s_ease] overflow-hidden">
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-navy-800/80 border border-gold-300/15 flex items-center justify-center text-gold-100/60 hover:text-gold-50 hover:bg-navy-700 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0 text-gold-DEFAULT">
            <Share2 className="w-5 h-5 text-gold-DEFAULT" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-gold-50">
              {status?.hasActiveToken
                ? "Share Your Profile"
                : "Before You Share"}
            </h2>
            <p className="text-xs text-gold-100/60 mt-0.5">
              {status?.hasActiveToken
                ? "Send your verified profile link to clients"
                : "Compliance checked by Grace & Goodwill"}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-gold-DEFAULT animate-spin" />
            <p className="text-xs text-gold-100/60">Checking share link status...</p>
          </div>
        ) : status?.hasActiveToken && status.shareUrl ? (
          /* ── ACTIVE TOKEN STATE: Share Sheet & Countdown ──────────── */
          <div className="space-y-5">
            {/* Countdown bar */}
            <div className="bg-navy-950/60 border border-gold-300/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gold-100/60">
                  Link expires in:
                </span>
                <span
                  className={
                    "font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg border transition-colors " +
                    (isUrgent
                      ? "text-red-400 bg-red-500/10 border-red-500/25 animate-pulse"
                      : "text-gold-DEFAULT bg-gold/10 border-gold/20")
                  }
                >
                  {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-navy-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: pctLeft + "%",
                    background: isUrgent
                      ? "#EF4444"
                      : pctLeft > 50
                      ? "linear-gradient(90deg, #5B8A6F, #C8973F)"
                      : "linear-gradient(90deg, #F59E0B, #EF4444)",
                  }}
                />
              </div>
            </div>

            {/* Channels & Copy Link */}
            <ShareSheet
              shareUrl={status.shareUrl}
              onRenew={handleRenew}
              renewing={generating}
            />

            {/* Discretion reminder note */}
            <div className="flex gap-2.5 bg-gold/5 border border-gold/10 rounded-xl p-3">
              <span className="text-xs flex-shrink-0 mt-0.5">ℹ️</span>
              <p className="text-[11px] text-gold-100/50 leading-relaxed">
                <span className="font-semibold text-gold-100/70">
                  Your discretion, your decision.
                </span>{" "}
                You decide where and with whom to share your profile. Links
                automatically expire after 30 minutes.
              </p>
            </div>
          </div>
        ) : (
          /* ── NO TOKEN STATE: Consent Screen with Yellow Checkbox ───── */
          <div className="space-y-5">
            <p className="text-xs sm:text-sm text-gold-100/70 leading-relaxed">
              Your shareable profile will display your photograph, introductory
              video (if uploaded), biography, experience, skills, languages, and
              availability.{" "}
              <strong className="text-gold-100/90 font-semibold">
                No personal contact details, residential address, or financial
                information will ever be shown.
              </strong>
            </p>

            <p className="text-xs text-gold-100/60 leading-relaxed">
              For your safety, the link remains active for{" "}
              <strong className="text-gold-DEFAULT font-bold">30 minutes</strong>.
              You can generate a fresh link at any time.
            </p>

            {/* Consent label with BRIGHT YELLOW CHECKBOX */}
            <label
              htmlFor="modal-consent-checkbox"
              className="flex items-start gap-3.5 cursor-pointer bg-navy-800/60 border border-gold-300/15 rounded-2xl p-4 hover:border-yellow-400/50 transition-colors"
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  id="modal-consent-checkbox"
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="sr-only"
                />
                {/* Yellow Checkbox Box */}
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
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#0A1128"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <span className="text-xs text-gold-100/75 leading-relaxed select-none">
                I understand that sharing my profile is entirely{" "}
                <strong className="text-yellow-400 font-bold">
                  at my own discretion
                </strong>
                . I decide where and with whom I share it. Grace &amp; Goodwill
                are not responsible for how my profile is used once shared.
              </span>
            </label>

            {/* Generate Button */}
            <button
              id="confirm-generate-share-link-btn"
              type="button"
              onClick={handleGenerate}
              disabled={!consented || generating}
              style={{
                background: consented
                  ? "linear-gradient(135deg, #F5D4A0 0%, #D4AF37 50%, #C99232 100%)"
                  : "rgba(255, 255, 255, 0.08)",
                color: consented ? "#0A1128" : "rgba(253, 230, 196, 0.35)",
                border: consented
                  ? "1px solid rgba(253, 230, 196, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              }}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-bold tracking-wide shadow-lg transition-all duration-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0A1128]" />
                  <span>Generating Link…</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Generate My Shareable Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center py-2 text-xs text-gold-100/40 hover:text-gold-100/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
