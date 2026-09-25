"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import shareableProfileService, {
  ShareTokenStatus,
} from "@/services/carer/shareableProfile.service";
import { useAuth } from "@/contexts/AuthContext";
import ConsentModal from "./ConsentModal";
import ShareSheet from "./ShareSheet";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const TOKEN_TTL = 30 * 60; // 30 min in seconds

export default function ShareProfilePanel() {
  const { user } = useAuth();
  const carerName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "";
  const [status, setStatus] = useState<ShareTokenStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Load current token status on mount ───────────────────────────
  const loadStatus = useCallback(async () => {
    try {
      const data = await shareableProfileService.getShareTokenStatus();
      setStatus(data);
      if (data.hasActiveToken && data.expiresInSeconds && data.expiresInSeconds > 0) {
        setSecondsLeft(data.expiresInSeconds);
        startCountdown(data.expiresInSeconds);
      }
    } catch {
      // No token yet — not an error
      setStatus({ hasActiveToken: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadStatus]);

  // ── Countdown timer ──────────────────────────────────────────────
  const startCountdown = (initial: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(initial);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStatus({ hasActiveToken: false });
          showErrorToast("Link Expired", "Your share link has expired. Generate a new one to share.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Generate token after consent ─────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    setShowConsent(false);
    try {
      const data = await shareableProfileService.generateShareToken(true);
      setStatus(data);
      const secs = data.expiresInSeconds ?? TOKEN_TTL;
      setSecondsLeft(secs);
      startCountdown(secs);
      showSuccessToast("Link Ready", "Your shareable profile link is active for 30 minutes.");
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
      showSuccessToast("Link Renewed", "A fresh 30-minute link has been generated.");
    } catch (err: any) {
      showErrorToast("Failed", err.message || "Could not renew link.");
    } finally {
      setGenerating(false);
    }
  };

  const pctLeft = Math.min(100, Math.round((secondsLeft / TOKEN_TTL) * 100));
  const isUrgent = secondsLeft > 0 && secondsLeft <= 120;

  if (loading) {
    return (
      <div className="border border-gold-300/10 rounded-2xl p-6 bg-navy-900/40 backdrop-blur-md animate-pulse">
        <div className="h-5 w-48 bg-gold-300/10 rounded mb-4" />
        <div className="h-4 w-full bg-gold-300/10 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gold-300/10 rounded" />
      </div>
    );
  }

  return (
    <>
      <div className="border border-gold-300/10 rounded-2xl p-6 sm:p-8 bg-navy-900/40 backdrop-blur-md shadow-elegant space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold-DEFAULT" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gold-50">Share My Profile</h2>
            <p className="text-xs text-gold-100/50 mt-1 leading-relaxed">
              Generate a secure link to share your profile. Valid for{" "}
              <span className="text-gold-DEFAULT font-semibold">30 minutes</span> per link.
            </p>
          </div>
        </div>

        {/* Discretion notice */}
        <div className="flex gap-3 bg-gold-DEFAULT/5 border border-gold-DEFAULT/15 rounded-xl p-4">
          <span className="text-base flex-shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs text-gold-100/60 leading-relaxed">
            <span className="font-semibold text-gold-100/80">Your discretion, your decision.</span>{" "}
            Sharing your profile is entirely at your own choice. Grace &amp; Goodwill are not
            responsible for how your profile is used once shared. You decide where and with whom
            you share it.
          </p>
        </div>

        {/* State: No token */}
        {!status?.hasActiveToken && (
          <button
            id="generate-share-link-btn"
            onClick={() => setShowConsent(true)}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl
              bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20
              text-navy-950 text-sm font-bold tracking-wide
              shadow-[0_4px_15px_rgba(245,212,160,0.2)] hover:shadow-[0_6px_20px_rgba(245,212,160,0.3)]
              hover:-translate-y-[1px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            )}
            {generating ? "Generating…" : "Generate My Shareable Link"}
          </button>
        )}

        {/* State: Active token */}
        {status?.hasActiveToken && status.shareUrl && (
          <div className="space-y-5">
            {/* Countdown bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gold-100/50">Link expires in</span>
                <span
                  className={`font-mono text-sm font-bold px-3 py-0.5 rounded-lg border transition-colors ${
                    isUrgent
                      ? "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse"
                      : "text-gold-DEFAULT bg-gold-DEFAULT/10 border-gold-DEFAULT/20"
                  }`}
                >
                  {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-navy-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pctLeft}%`,
                    background: isUrgent
                      ? "#EF4444"
                      : pctLeft > 50
                      ? "linear-gradient(90deg,#5B8A6F,#C8973F)"
                      : "linear-gradient(90deg,#F59E0B,#EF4444)",
                  }}
                />
              </div>
            </div>

            {/* Link display */}
            <ShareSheet
              shareUrl={status.shareUrl}
              carerName={carerName}
              onRenew={handleRenew}
              renewing={generating}
            />
          </div>
        )}
      </div>

      {/* Consent modal */}
      {showConsent && (
        <ConsentModal
          onConfirm={handleGenerate}
          onCancel={() => setShowConsent(false)}
          loading={generating}
        />
      )}
    </>
  );
}
