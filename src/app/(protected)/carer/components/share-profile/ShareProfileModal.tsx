"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Share2,
  RefreshCw,
  Camera,
  PlayCircle,
  FileText,
  Briefcase,
  Globe,
  Star,
  CalendarDays,
  UserCheck,
  Lock,
  ShieldCheck,
  Clock,
  Link2,
} from "lucide-react";
import shareableProfileService, {
  ShareTokenStatus,
} from "@/services/carer/shareableProfile.service";
import ShareSheet from "./ShareSheet";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOKEN_TTL = 30 * 60; // 30 min in seconds (countdown display)

const PROFILE_ITEMS = [
  { icon: Camera, label: "Photograph" },
  { icon: PlayCircle, label: "Introduction video" },
  { icon: FileText, label: "Biography" },
  { icon: Briefcase, label: "Care experience and skills" },
  { icon: Globe, label: "Languages" },
  { icon: Star, label: "Interests and personality" },
  { icon: CalendarDays, label: "Availability" },
  { icon: UserCheck, label: "Approved recommendations where available" },
];

export default function ShareProfileModal({
  isOpen,
  onClose,
}: ShareProfileModalProps) {
  const [status, setStatus] = useState<ShareTokenStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [consented, setConsented] = useState(false);

  // Load status on open
  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shareableProfileService.getShareTokenStatus();
      setStatus(data);
    } catch {
      setStatus({ hasActiveToken: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setConsented(false);
      loadStatus();
    }
  }, [isOpen, loadStatus]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open to avoid double scrollbars
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Generate token after consent
  const handleGenerate = async () => {
    if (!consented) {
      showErrorToast(
        "Consent Required",
        "Please check the consent box below to generate your shareable link.",
      );
      return;
    }
    setGenerating(true);
    try {
      const data = await shareableProfileService.generateShareToken(true);
      setStatus(data);
      showSuccessToast(
        "Link Ready",
        "Your shareable profile link is now active.",
      );
    } catch (err: any) {
      showErrorToast("Failed", err.message || "Could not generate share link.");
    } finally {
      setGenerating(false);
    }
  };

  // Renew token
  const handleRenew = async () => {
    setGenerating(true);
    try {
      const data = await shareableProfileService.generateShareToken(true);
      setStatus(data);
      showSuccessToast(
        "Link Renewed",
        "A fresh share link has been generated.",
      );
    } catch (err: any) {
      showErrorToast("Failed", err.message || "Could not renew link.");
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-hidden animate-[fadeIn_0.2s_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease]"
        style={{
          background: "linear-gradient(165deg, #0b152d 0%, #070d1e 65%, #040815 100%)",
          border: "1px solid rgba(201,171,82,0.38)",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.85), 0 0 35px rgba(201,171,82,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer text-white/60 hover:text-white"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable content inside the modal */}
        <div
          className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(201, 171, 82, 0.4) transparent",
          }}
        >
          {/* LOADING */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin" style={{ color: "#C9AB52" }} />
              <p className="text-xs" style={{ color: "rgba(201,171,82,0.7)" }}>Checking share link status...</p>
            </div>
          ) : status?.hasActiveToken && status.shareUrl ? (
            /* ACTIVE TOKEN STATE - Matches Image 2 */
            <div>
              {/* Header for Active Shareable Profile */}
              <div className="pr-8 mb-4">
                <h2
                  className="text-xl sm:text-2xl lg:text-[26px] font-bold leading-tight text-white"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Your profile is ready to share
                </h2>
                <p className="text-xs sm:text-[12.5px] mt-1.5 text-[#D8BA68] leading-normal">
                  Use your profile as a digital business card and help more prospective clients,
                  families and professional contacts discover your experience, skills and availability.
                </p>
              </div>

              {/* Active token view */}
              <ShareSheet
                shareUrl={status.shareUrl}
                expirationDate={status.expirationDate || status.expiresAt}
                onRenew={handleRenew}
                renewing={generating}
              />
            </div>
          ) : (
            /* NO TOKEN STATE - Matches Pre-Generation Reference */
            <div>
              {/* Header for Pre-Generation State */}
              <div className="flex items-start gap-3.5 pr-8 mb-3.5">
                <div
                  className="w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(10, 18, 42, 0.6)",
                    border: "1.5px solid rgba(201, 171, 82, 0.6)",
                    boxShadow: "0 0 15px rgba(201, 171, 82, 0.1)",
                  }}
                >
                  <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#ECCB76] stroke-[2]" />
                </div>
                <div>
                  <h2
                    className="text-xl sm:text-2xl font-bold leading-tight text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Share your professional<br />live-in carer profile
                  </h2>
                  <p className="text-xs sm:text-[12.5px] mt-1 text-[#D8BA68] leading-normal">
                    Use your shareable profile as a digital business card to showcase
                    your experience, skills and availability through Grace &amp; Goodwill.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
              {/* Profile items box */}
              <div>
                <p className="text-xs sm:text-[13px] font-bold text-white mb-1.5">
                  Your shareable profile may include:
                </p>
                <div
                  className="rounded-2xl p-3.5 sm:p-4"
                  style={{
                    background: "rgba(10, 18, 42, 0.55)",
                    border: "1px solid rgba(201, 171, 82, 0.28)",
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-3 sm:gap-y-3.5">
                    {PROFILE_ITEMS.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <Icon className="w-5 h-5 flex-shrink-0 text-[#ECCB76] stroke-[1.8]" />
                        <span className="text-[11px] sm:text-xs text-slate-200 leading-snug">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy notice box */}
              <div
                className="flex items-center gap-3 rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5"
                style={{
                  background: "rgba(13, 22, 45, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  <Lock className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-[11px] sm:text-xs leading-snug text-slate-300">
                  <span className="font-semibold text-white">For your privacy, the following will not be displayed:</span>{" "}
                  Personal telephone number, email address, home address and compliance documents.
                </p>
              </div>

              {/* Grace & Goodwill enquiries notice box */}
              <div
                className="rounded-2xl p-3.5 sm:p-4"
                style={{
                  background: "rgba(10, 18, 42, 0.55)",
                  border: "1.5px solid rgba(216, 169, 62, 0.7)",
                  boxShadow:
                    "0 0 18px rgba(216, 169, 62, 0.2), inset 0 0 14px rgba(216, 169, 62, 0.04)",
                }}
              >
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-9 h-11 sm:w-10 sm:h-12 text-[#ECCB76]"
                      viewBox="0 0 36 44"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Shield Outline */}
                      <path
                        d="M18 2.5L4 7.5v15c0 10.5 14 18 14 18s14-7.5 14-18v-15L18 2.5z"
                        strokeWidth="2.4"
                      />
                      {/* Lock Shackle */}
                      <path
                        d="M14 20v-3.5a4 4 0 0 1 8 0V20"
                        strokeWidth="2.2"
                      />
                      {/* Lock Body */}
                      <rect
                        x="12"
                        y="20"
                        width="12"
                        height="9"
                        rx="2"
                        fill="currentColor"
                        strokeWidth="2"
                      />
                      {/* Keyhole */}
                      <circle cx="18" cy="23.5" r="1" fill="#0A1128" stroke="none" />
                      <path d="M18 24.5v2" stroke="#0A1128" strokeWidth="1.2" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-[13px] font-semibold leading-snug text-[#ECCB76]">
                      All enquiries and care requests generated through your shared profile
                      are directed through Grace &amp; Goodwill.
                    </p>
                    <p className="text-[11px] sm:text-xs leading-normal text-amber-100/75">
                      If a family or client is interested in your profile, we will contact you directly
                      to discuss the opportunity.
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-[#ECCB76]" />
                      <p className="text-[10px] sm:text-[11px] text-[#ECCB76]/90">
                        We handle enquiries securely, so you can focus on what you do best caring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Link duration notice */}
              <div className="flex items-center gap-2 px-1">
                <Clock className="w-4 h-4 flex-shrink-0 text-[#ECCB76]/80" />
                <p className="text-[11px] sm:text-xs leading-normal text-slate-300">
                  Your link will remain active for 1 month. You can generate a new link when the current one expires.
                </p>
              </div>

              {/* Consent Checkbox */}
              <label
                htmlFor="modal-consent-checkbox"
                className="flex items-start gap-2.5 px-1 cursor-pointer transition-colors"
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    id="modal-consent-checkbox"
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-[18px] h-[18px] sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: consented ? "#EAB308" : "transparent",
                      border: consented
                        ? "2px solid #EAB308"
                        : "1.8px solid rgba(201, 171, 82, 0.75)",
                      borderRadius: "4px",
                      boxShadow: consented ? "0 0 10px rgba(234,179,8,0.5)" : "none",
                    }}
                  >
                    {consented && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs leading-relaxed select-none text-slate-300">
                  I understand that I choose where and with whom I share my professional profile.
                  I confirm that I am happy for the approved public profile information listed above
                  to be displayed through my shareable link.
                </span>
              </label>

              {/* Generate CTA Button */}
              <button
                id="confirm-generate-share-link-btn"
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-lg active:scale-[0.99] mt-1"
                style={{
                  background: "linear-gradient(135deg, #F8E090 0%, #D8A93E 45%, #B8851E 100%)",
                  color: "#0A1128",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(216, 169, 62, 0.35)",
                  opacity: !consented && !generating ? 0.8 : 1,
                }}
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Link...</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Generate My Shareable Profile</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              {/* Cancel link */}
              {/* <button
                type="button"
                onClick={onClose}
                className="w-full text-center py-1 text-xs sm:text-sm font-medium transition-colors cursor-pointer hover:text-white underline underline-offset-2"
                style={{ color: "#D8BA68" }}
              >
                Cancel
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
