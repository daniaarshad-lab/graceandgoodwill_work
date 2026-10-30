"use client";
import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Mail,
  ShieldCheck,
  X,
  Eye,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  CareRequestRecord,
  getShareableLinkRemainingHours,
  isShareableLinkActive,
} from '@/data/care-platform/platformStore';

interface SharedCareOpportunityModalProps {
  careRequest: CareRequestRecord;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCareRequest: (updated: Partial<CareRequestRecord>) => void;
  onOpenPreview: (mode: 'active' | 'expired') => void;
  showToast: (msg: string) => void;
}

export const SharedCareOpportunityModal: React.FC<SharedCareOpportunityModalProps> = ({
  careRequest,
  isOpen,
  onClose,
  onUpdateCareRequest,
  onOpenPreview,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isActive = isShareableLinkActive(careRequest);
  const remainingHours = getShareableLinkRemainingHours(careRequest);
  const isFulfilled = Boolean(
    careRequest.isFulfilled || careRequest.stage === 'Care Commenced'
  );

  // Generate or retrieve token
  const token =
    careRequest.shareableLinkToken ||
    `gg-care-${careRequest.id}-${Math.random().toString(36).substring(2, 8)}`;

  // Construct sharing link
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://graceandgoodwill.co.uk';
  const shareableUrl = `${origin}?care_opportunity=${token}`;

  const formattedExpiry = careRequest.shareableLinkExpiresAt
    ? new Date(careRequest.shareableLinkExpiresAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'In 72 hours';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      showToast('Shareable 72-hour link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Link copied: ' + shareableUrl);
    }
  };

  const handleRegenerate = () => {
    const newToken = `gg-care-${careRequest.id}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();
    const newExpiresAt = now + 72 * 3600 * 1000;

    onUpdateCareRequest({
      shareableLinkToken: newToken,
      shareableLinkCreatedAt: now,
      shareableLinkExpiresAt: newExpiresAt,
      isFulfilled: false,
    });
    showToast('New 72-hour shareable link generated successfully.');
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const text = `Grace & Goodwill — Live-in Care Opportunity (${careRequest.location})\n\nPlacement Type: ${careRequest.placementType}\nWeekly Carer Fee: £${careRequest.weeklyPayment} per week\nFood Allowance: £${careRequest.foodAllowance} per week\n\nReview confidential placement requirements & express interest:\n${shareableUrl}\n\n(This link automatically expires in 72 hours)`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Email share
  const handleShareEmail = () => {
    const subject = `Live-in Care Opportunity — ${careRequest.location} | Grace & Goodwill`;
    const body = `Hello,\n\nPlease review the following live-in care opportunity with Grace & Goodwill:\n\nLocation: ${careRequest.location}\nPlacement Type: ${careRequest.placementType} (${careRequest.duration})\nWeekly Carer Fee: £${careRequest.weeklyPayment} per week\nFood Allowance: £${careRequest.foodAllowance} per week\nPreferred Start: ${careRequest.preferredStart}\n\nView placement & accommodation details:\n${shareableUrl}\n\nNote: For client safety and privacy, all identifying details and full address are hidden. This link will expire automatically in 72 hours or once the placement is fulfilled.\n\nWarm regards,\nGrace & Goodwill Placement Team`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );
  };

  // Native or social share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Grace & Goodwill Care Opportunity — ${careRequest.location}`,
          text: `Live-in care opportunity in ${careRequest.location}. Weekly Carer Fee: £${careRequest.weeklyPayment}/wk + £${careRequest.foodAllowance}/wk food allowance.`,
          url: shareableUrl,
        });
        showToast('Shared successfully!');
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1629]/70 backdrop-blur-xs">
      <div className="bg-[#FAF7F2] text-[#0A1629] w-full max-w-xl rounded-3xl border border-[#E8DEC8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#060D1E] via-[#0A1629] to-[#12223D] text-white flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF7A]/20 border border-[#D4AF7A]/40 flex items-center justify-center text-[#D4AF7A]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF7A] text-[#0A1629]">
                  Admin Only
                </span>
                <span className="text-xs text-[#D4AF7A]">Confidential Link</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold mt-1 text-white">
                Share Care Opportunity
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#334155]">
          {/* Expiry Status Card */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isFulfilled
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : isActive
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isFulfilled
                    ? 'bg-rose-100 text-rose-700'
                    : isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isFulfilled ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isActive ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-bold text-sm">
                  {isFulfilled
                    ? 'Expired Automatically (Care Request Fulfilled)'
                    : isActive
                    ? `Active Link — Expires in ~${remainingHours} hours`
                    : 'Link Expired (Past 72-Hour Window)'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {isFulfilled
                    ? 'Care has commenced or the placement is fulfilled. All public links expired immediately.'
                    : isActive
                    ? `Generated link expires automatically on ${formattedExpiry}.`
                    : `Expired on ${formattedExpiry}. Generate a new link below if still unfulfilled.`}
                </div>
              </div>
            </div>

            {(!isActive || isFulfilled) && (
              <button
                type="button"
                onClick={handleRegenerate}
                className="px-3.5 py-2 rounded-xl bg-[#0A1629] text-white hover:bg-[#15233D] font-semibold text-xs inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate 72h Link</span>
              </button>
            )}
          </div>

          {/* Placement Quick Highlights for Verification */}
          <div className="bg-white rounded-2xl border border-[#EAE2D2] p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
              <span className="font-bold text-[#0A1629]">
                Opportunity: {careRequest.displayTitle} ({careRequest.location})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#8C6D2B] font-semibold text-[11px]">
                {careRequest.placementType}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-[#64748B] block">Weekly Carer Fee</span>
                <span className="font-bold text-[#0A1629]">
                  £{careRequest.weeklyPayment}/wk
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Food Allowance</span>
                <span className="font-bold text-[#0A1629]">
                  £{careRequest.foodAllowance}/wk
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Start Date</span>
                <span className="font-bold text-[#0A1629]">
                  {careRequest.preferredStart}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Accommodation</span>
                <span className="font-bold text-emerald-700">Private Bedroom</span>
              </div>
            </div>
          </div>

          {/* Shareable Link Input & Copy */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0A1629]">
              Shareable URL (Anonymous &amp; Privacy-Protected)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFD5C2] bg-white text-xs text-[#0A1629] font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-[#C8A464] hover:bg-[#B89352] text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Direct Sharing Channels */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[#0A1629]">
              Share Directly with Vetted Carers
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareEmail}
                className="p-3 rounded-xl bg-[#0A1629]/5 hover:bg-[#0A1629]/10 border border-[#0A1629]/20 text-[#0A1629] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email Carer</span>
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="p-3 rounded-xl bg-[#C8A464]/10 hover:bg-[#C8A464]/20 border border-[#C8A464]/30 text-[#8C6D2B] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Social / More</span>
              </button>
            </div>
          </div>

          {/* Privacy & Security Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-[#E8F1FA] border border-[#BFD6EE] flex items-start gap-2.5 text-[11px] text-[#1D3B5E] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#1B4F8C] shrink-0 mt-0.5" />
            <div>
              <strong>Strict Privacy Enforced:</strong> Client full names, exact residential
              street addresses, phone numbers, email addresses, and agreed client agency fees are
              permanently hidden. Recipients only see county location, medical and care needs,
              carer fee/allowance, and private bedroom accommodation.
            </div>
          </div>

          {/* Admin Preview Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE2D2]">
            <span className="text-[11px] text-[#64748B]">
              Admin Verification Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenPreview('active')}
                className="px-3 py-1.5 rounded-xl border border-[#DFD5C2] bg-white hover:bg-[#FAF7F2] text-[#0A1629] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A464]" />
                <span>Preview Carer View</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenPreview('expired')}
                className="px-3 py-1.5 rounded-xl border border-[#DFD5C2] bg-white hover:bg-[#FAF7F2] text-[#64748B] hover:text-[#0A1629] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Preview Expired Page</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
