"use client";

import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  Globe,
  Heart,
  Home,
  Hourglass,
  Info,
  Mail,
  Plus,
  Send,
  Users,
  X,
} from 'lucide-react';
import { DEFAULT_MARGARET_AVATAR } from "@/data/care-platform/clientProfileImages";
import { usePlatformStore } from "@/data/care-platform/platformStore";
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ClientDeclarationsAdminViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

export const ClientDeclarationsAdminView: React.FC<ClientDeclarationsAdminViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const {
    clientAvatars,
    declarationStatus,
    setDeclarationStatus,
    declarationDiffs,
    setDeclarationDiffs,
    declarationAuditTrail,
    addDeclarationAuditEntry,
  } = usePlatformStore();

  const [editingDiffs, setEditingDiffs] = useState(false);
  const [showAllAudit, setShowAllAudit] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const margaretAvatar = clientAvatars['margaret-lewis'] || DEFAULT_MARGARET_AVATAR;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const renderSectionIcon = (section: string) => {
    if (section.toLowerCase().includes('care')) return <Home className="w-4 h-4 text-[#8C6D2B]" />;
    if (section.toLowerCase().includes('medical')) {
      return <Plus className="w-4 h-4 text-[#8C6D2B]" />;
    }
    if (section.toLowerCase().includes('interest')) {
      return <Heart className="w-4 h-4 text-[#8C6D2B]" />;
    }
    return <Globe className="w-4 h-4 text-[#8C6D2B]" />;
  };

  const handleConfirmAndSubmitChanges = () => {
    setDeclarationStatus('awaiting_client');
    addDeclarationAuditEntry({
      id: `aud-${Date.now()}`,
      date: '29 Oct 2026',
      time: '09:30',
      title: 'Changes submitted for client confirmation',
      actor: 'Entered by Jessica Smith (Admin)',
      version: 'Declaration v3.3 (Awaiting Confirmation)',
      details: `Categories: ${declarationDiffs.map((d) => d.section).join(', ')}`,
    });
    showToast(
      'Draft changes submitted. Confirmation email dispatched to Margaret Lewis for client authorisation.'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 relative overflow-hidden">
      {/* Background Grace & Goodwill 3D Gold Knot Watermark */}
      <div className="absolute top-0 right-0 w-[420px] sm:w-[540px] lg:w-[620px] h-48 sm:h-56 pointer-events-none select-none z-0 overflow-hidden opacity-[0.20]">
        <img
          src="/website_logo.png"
          alt=""
          className="w-full h-full object-contain object-right filter brightness-110 contrast-110"
        />
      </div>

      {/* Unified Client Section Navigation */}
      {onNavigate && (
        <ClientSectionNav currentView="client-declarations" onNavigate={onNavigate} />
      )}

      {/* Breadcrumbs + View Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#7D7362]">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#0A1629] transition-colors cursor-pointer"
          >
            Clients
          </button>
          <span>&gt;</span>
          <span>Margaret Lewis</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#0A1629]">Declarations</span>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('client-declaration-portal')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#DFD0B4] bg-white hover:bg-[#FAF6EE] text-xs font-semibold text-[#0A1629] shadow-sm transition-colors cursor-pointer"
          >
            <span>Open Client Portal Declaration View</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B88E3E]" />
          </button>
        )}
      </div>

      {/* Page Title */}
      <div className="relative z-10">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Declarations
        </h1>
        <p className="text-sm text-[#5C5549] mt-1">
          Manage client information, review changes and track confirmations.
        </p>
      </div>

      {/* Client Summary Header Strip */}
      <div className="relative z-10 bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={margaretAvatar}
            alt="Margaret Lewis"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A059]/40 shrink-0"
          />
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#0A1629]">
              Margaret Lewis
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5549] mt-0.5">
              <span>Client ID: CL001245</span>
              <span className="text-[#D5CBB8]" aria-hidden="true">
                |
              </span>
              <span>Live-in care</span>
              <span className="text-[#D5CBB8]" aria-hidden="true">
                |
              </span>
              <span>Chester</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#F2ECE0] lg:pl-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#8C6D2B]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#5C5549]">
                Current Declaration Version
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-bold text-[#0A1629] tabular-nums">
                  {declarationStatus === 'live' ? 'v3.3' : 'v3.2'}
                </span>
                <span className="text-xs text-[#7D7362]">
                  {declarationStatus === 'live'
                    ? 'Confirmed & live today'
                    : 'Live since 12 Jan 2024'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('client-portal-profile')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
          >
            <span>View Client Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B88E3E]" />
          </button>
        </div>
      </div>

      {/* 3-Step Workflow Status Progression */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
        {/* Step 1: Draft - Not Live */}
        <button
          type="button"
          onClick={() => setDeclarationStatus('draft')}
          className={`lg:col-span-3 text-left rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            declarationStatus === 'draft'
              ? 'bg-[#FDF9F0] border-[#C5A059] shadow-sm'
              : 'bg-white border-[#EAE3D4] hover:border-[#D4AF7A]'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#F5EBD6] flex items-center justify-center text-[#8C6D2B] shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-serif text-lg font-semibold text-[#0A1629]">
                Draft &ndash; Not Live
              </div>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                Changes have been made and are awaiting client review.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#8C6D2B]">
                {declarationStatus === 'draft' ? '● Current status' : '○ Step 1'}
              </div>
            </div>
          </div>
        </button>

        <div className="hidden lg:flex lg:col-span-1 justify-center text-[#C5A059]">
          <ChevronRight className="w-5 h-5" />
        </div>

        {/* Step 2: Awaiting Client Confirmation */}
        <button
          type="button"
          onClick={() => setDeclarationStatus('awaiting_client')}
          className={`lg:col-span-3 text-left rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            declarationStatus === 'awaiting_client'
              ? 'bg-[#FDF9F0] border-[#C5A059] shadow-sm'
              : 'bg-white border-[#EAE3D4] hover:border-[#D4AF7A]'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#F5EBD6] flex items-center justify-center text-[#8C6D2B] shrink-0">
              <Hourglass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-serif text-lg font-semibold text-[#0A1629]">
                Awaiting Client Confirmation
              </div>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                Client has been notified and needs to review and authorise the changes.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#8C6D2B]">
                {declarationStatus === 'awaiting_client' ? '● Current status' : '○ Step 2'}
              </div>
            </div>
          </div>
        </button>

        <div className="hidden lg:flex lg:col-span-1 justify-center text-[#C5A059]">
          <ChevronRight className="w-5 h-5" />
        </div>

        {/* Step 3: Submitted / Live */}
        <button
          type="button"
          onClick={() => setDeclarationStatus('live')}
          className={`lg:col-span-3 text-left rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            declarationStatus === 'live'
              ? 'bg-[#FDF9F0] border-[#C5A059] shadow-sm'
              : 'bg-white border-[#EAE3D4] hover:border-[#D4AF7A]'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#F5EBD6] flex items-center justify-center text-[#8C6D2B] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-serif text-lg font-semibold text-[#0A1629]">
                Submitted / Live
              </div>
              <p className="text-xs text-[#5C5549] leading-relaxed">
                Changes confirmed by client and now live on profile.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-emerald-700">
                {declarationStatus === 'live' ? '● Current status (Live)' : '○ Step 3'}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* MIDDLE 2-COLUMN GRID: Client Information Declaration | Review and Authorise Changes */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Client Information Declaration */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#8C6D2B]" />
                <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                  Client Information Declaration
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#8C6D2B]">
                Version 3.3 ({declarationStatus === 'live' ? 'Live' : 'Draft'})
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D4]">
              <p className="font-serif italic text-[16px] sm:text-[17px] text-[#1E293B] leading-relaxed">
                I confirm that the information in my Grace &amp; Goodwill client profile is true,
                complete and up to date to the best of my knowledge. I understand that this
                information is used to match me with suitable carers and to support the delivery of
                safe, personalised care. I will notify Grace &amp; Goodwill of any changes to my
                circumstances, needs or preferences.
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-[13px] text-[#334155] pt-1">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>
                  I understand that any changes made by the Grace &amp; Goodwill team will not go
                  live until I have reviewed and authorised them.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>
                  I will be asked to confirm changes via email and through my client account.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>
                  My confirmed information helps ensure the best possible matches and continuity of
                  care.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Review and Authorise Changes */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-[#8C6D2B]" />
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                Review and Authorise Changes
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingDiffs(!editingDiffs)}
              className="text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] underline cursor-pointer"
            >
              {editingDiffs ? 'Done Editing' : 'Edit Draft Values'}
            </button>
          </div>

          <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
            You have made changes to the client&apos;s information below. These changes will not go
            live until the client reviews and authorises them.
          </p>

          <div className="overflow-x-auto border border-[#EAE3D4] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EAE3D4] text-[#0A1629] font-semibold">
                  <th className="py-2.5 px-3.5">Field / Section</th>
                  <th className="py-2.5 px-3.5">Current (Live)</th>
                  <th className="py-2.5 px-3.5 bg-[#F6EBD4]/60">New (Draft)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D4]">
                {declarationDiffs.map((diff) => (
                  <tr key={diff.id}>
                    <td className="py-3 px-3.5 font-semibold text-[#0A1629]">
                      <div className="flex items-center gap-2">
                        {renderSectionIcon(diff.section)}
                        <span>{diff.section}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-[#5C5549]">{diff.currentLive}</td>
                    <td className="py-3 px-3.5 bg-[#FDF7E9] font-medium text-[#0A1629]">
                      {editingDiffs ? (
                        <input
                          type="text"
                          value={diff.newDraft}
                          onChange={(e) =>
                            setDeclarationDiffs((prev) =>
                              prev.map((item) =>
                                item.id === diff.id ? { ...item, newDraft: e.target.value } : item
                              )
                            )
                          }
                          className="w-full px-2 py-1 rounded-lg border border-[#D4AF7A] bg-white text-xs text-[#0A1629]"
                        />
                      ) : (
                        diff.newDraft
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN GRID: Email to Client | Confirm & Submit CTA | Audit Trail */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Col 1: Email to Client */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8C6D2B]" />
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">Email to Client</h3>
            </div>
            <button
              type="button"
              onClick={() =>
                showToast('Preview email sent to admin@graceandgoodwill.co.uk.')
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] hover:bg-white text-[11px] font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              <span>Send Preview</span>
              <ArrowRight className="w-3 h-3 text-[#B88E3E]" />
            </button>
          </div>

          <div className="space-y-1 text-xs bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D4]">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold text-[#5C5549]">From:</span>
              <span className="col-span-9 text-[#0A1629]">careteam@graceandgoodwill.co.uk</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold text-[#5C5549]">To:</span>
              <span className="col-span-9 text-[#0A1629]">margaret.lewis@email.co.uk</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-semibold text-[#5C5549]">Subject:</span>
              <span className="col-span-9 font-medium text-[#0A1629]">
                Review and Confirm Changes to Your Information
              </span>
            </div>
          </div>

          {/* Styled Email Body Card */}
          <div className="relative rounded-2xl p-5 border border-[#EAE3D4] bg-[#FDFBF7] overflow-hidden space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/website_logo_dark_clean.png"
                alt="Grace & Goodwill"
                className="w-7 h-7 object-contain"
              />
              <div>
                <div className="font-cinzel text-[11px] tracking-[0.18em] font-semibold text-[#8C6D2B] uppercase">
                  GRACE &amp; GOODWILL
                </div>
                <div className="text-[8px] tracking-[0.16em] uppercase text-[#7D7362]">
                  CARE DEFINED BY INTEGRITY
                </div>
              </div>
            </div>

            <h4 className="font-serif text-lg font-semibold text-[#0A1629]">
              Review and Confirm Changes
            </h4>

            <p className="text-xs text-[#334155] leading-relaxed">
              Dear Margaret,
              <br />
              We have made some updates to your client profile. Please review the changes below and
              confirm that the information is correct. These changes will not go live until you
              have authorised them.
            </p>

            <button
              type="button"
              onClick={() => onNavigate?.('client-declaration-portal')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#B88E3E] hover:brightness-105 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <span>Review Changes in Your Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Col 2: Primary Submit CTA & Info Notice */}
        <div className="lg:col-span-3 space-y-4">
          <button
            type="button"
            onClick={handleConfirmAndSubmitChanges}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#C8A25A] to-[#AD8336] hover:brightness-105 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Confirm &amp; Submit Changes</span>
          </button>

          <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#0A1629] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5 text-[#D4AF7A]" />
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              Admin-entered changes do not go live until the client reviews and authorises them.
              Once confirmed, a new declaration version will be created and the changes will be
              visible across the platform.
            </p>
          </div>
        </div>

        {/* Col 3: Audit Trail */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C6D2B]" />
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">Audit Trail</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAllAudit(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] hover:bg-white text-[11px] font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 text-[#B88E3E]" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {declarationAuditTrail.slice(0, 4).map((entry, idx) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2.5 items-start">
                <div className="col-span-4 flex items-start gap-2">
                  <div className="flex flex-col items-center pt-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        idx === 0 ? 'bg-[#C5A059]' : 'bg-[#64748B]'
                      }`}
                    />
                    {idx < 3 && <span className="w-px h-10 bg-[#EAE3D4] mt-1" />}
                  </div>
                  <div className="tabular-nums text-[11px] text-[#334155]">
                    <div className="font-semibold text-[#0A1629]">{entry.date}</div>
                    <div className="text-[#7D7362]">{entry.time}</div>
                  </div>
                </div>

                <div className="col-span-8 space-y-0.5">
                  <div className="font-semibold text-[#0A1629] leading-snug">{entry.title}</div>
                  <div className="text-[11px] text-[#5C5549]">{entry.actor}</div>
                  <div className="text-[11px] text-[#7D7362]">{entry.version}</div>
                  {entry.details && (
                    <div className="text-[11px] text-[#7D7362] leading-snug">{entry.details}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Audit Trail Modal */}
      {showAllAudit && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                Complete Declaration Audit Trail — Margaret Lewis
              </h3>
              <button
                type="button"
                onClick={() => setShowAllAudit(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3 text-xs">
              {declarationAuditTrail.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-[#0A1629]">
                    <span>{entry.title}</span>
                    <span className="text-[11px] text-[#7D7362] tabular-nums">
                      {entry.date} &bull; {entry.time}
                    </span>
                  </div>
                  <div className="text-[#5C5549]">
                    {entry.actor} &bull; {entry.version}
                  </div>
                  {entry.details && <div className="text-[#7D7362]">{entry.details}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#060D1E] text-white px-4 py-3 rounded-2xl border border-[#D4AF7A] shadow-xl flex items-center gap-2.5 text-xs max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="text-[#EBD8B2] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
