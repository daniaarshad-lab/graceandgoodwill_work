"use client";

import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Moon,
  Pill,
  Save,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { DEFAULT_ELEANOR_THOMAS_AVATAR } from "@/data/care-platform/clientProfileImages";
import { usePlatformStore } from "@/data/care-platform/platformStore";
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ClientDeclarationPortalViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

interface DeclarationHistoryRow {
  id: string;
  date: string;
  time: string;
  status: 'Awaiting Confirmation' | 'Live' | 'Draft';
  version: string;
}

export const ClientDeclarationPortalView: React.FC<ClientDeclarationPortalViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const {
    clientAvatars,
    declarationStatus,
    setDeclarationStatus,
    declarationDiffs,
    addDeclarationAuditEntry,
  } = usePlatformStore();

  const avatarUrl = clientAvatars['eleanor-thomas'] || DEFAULT_ELEANOR_THOMAS_AVATAR;

  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [historyRows, setHistoryRows] = useState<DeclarationHistoryRow[]>([
    {
      id: 'dh-1',
      date: '04 Oct 2026',
      time: '20:17',
      status: 'Awaiting Confirmation',
      version: 'V3.1',
    },
    {
      id: 'dh-2',
      date: '22 Aug 2026',
      time: '14:32',
      status: 'Live',
      version: 'V3.0',
    },
    {
      id: 'dh-3',
      date: '14 May 2026',
      time: '10:15',
      status: 'Draft',
      version: 'V2.9',
    },
    {
      id: 'dh-4',
      date: '03 Feb 2026',
      time: '16:20',
      status: 'Live',
      version: 'V2.8',
    },
    {
      id: 'dh-5',
      date: '12 Nov 2025',
      time: '11:06',
      status: 'Live',
      version: 'V2.7',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClientConfirmSubmit = () => {
    if (!confirmedCheckbox) {
      showToast('Please tick the declaration confirmation box before submitting.');
      return;
    }
    setDeclarationStatus('live');
    setHistoryRows((prev) =>
      prev.map((row, idx) => (idx === 0 ? { ...row, status: 'Live' } : row))
    );
    addDeclarationAuditEntry({
      id: `aud-client-${Date.now()}`,
      date: '29 Oct 2026',
      time: '09:42',
      title: 'Client confirmed changes',
      actor: 'Confirmed by Eleanor Thomas (Client)',
      version: 'Declaration V3.1 (Live)',
      details: 'Categories: Medication, Night-time Routine, Allergies',
    });
    showToast('Declaration confirmed and submitted — your updated profile is now Live.');
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
        <ClientSectionNav currentView="client-declaration-portal" onNavigate={onNavigate} />
      )}

      {/* Breadcrumbs + Admin View Switcher */}
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
          <span>Eleanor Thomas</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#0A1629]">Declaration</span>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('client-declarations')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EAE3D4] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] shadow-sm transition-colors cursor-pointer"
          >
            <span>Switch to Admin Declarations View</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B88E3E]" />
          </button>
        )}
      </div>

      {/* Page Heading */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Client Information Declaration
        </h1>
        <p className="text-sm text-[#5C5549] mt-1.5 leading-relaxed">
          Please review the declaration below and confirm that the information in your profile is
          accurate, complete and up to date.
        </p>
      </div>

      {/* MAIN DECLARATION CARD */}
      <div className="relative z-10 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Client Portrait */}
        <div className="lg:col-span-4 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE3D4] min-h-[320px]">
          <img
            src={avatarUrl}
            alt="Eleanor Thomas"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Declaration Check & Confirmation Metadata */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Top Status Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0A1629]">
                Declaration
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeclarationStatus('draft')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    declarationStatus === 'draft'
                      ? 'bg-[#F5EFE3] border-[#C5A059] font-semibold text-[#0A1629]'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeclarationStatus('awaiting_client')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    declarationStatus === 'awaiting_client'
                      ? 'bg-[#FDF4DF] border-[#D4AF7A] font-semibold text-[#0A1629]'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Awaiting Client Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeclarationStatus('live')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    declarationStatus === 'live'
                      ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Live</span>
                </button>
              </div>
            </div>

            {/* Checkbox + 4 Declaration Paragraphs */}
            <label className="flex items-start gap-3.5 cursor-pointer select-none pt-1">
              <button
                type="button"
                role="checkbox"
                aria-checked={confirmedCheckbox}
                onClick={() => setConfirmedCheckbox(!confirmedCheckbox)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                  confirmedCheckbox
                    ? 'bg-[#0A1629] border-[#0A1629] text-[#D4AF7A]'
                    : 'bg-white border-[#64748B] hover:border-[#0A1629]'
                }`}
              >
                {confirmedCheckbox && <Check className="w-4 h-4" strokeWidth={3} />}
              </button>

              <div className="space-y-3 text-xs sm:text-[13.5px] text-[#1E293B] leading-relaxed">
                <p>
                  I confirm that I have reviewed the information I am submitting and, to the best of
                  my knowledge, it is accurate, complete and up to date. I understand that Grace
                  &amp; Goodwill and carers considering or undertaking this care arrangement may
                  rely on the information I provide when assessing and carrying out the arrangement.
                </p>
                <p>
                  I understand that I am responsible for informing Grace &amp; Goodwill promptly if
                  any relevant information changes, including medication, allergies, medical or
                  clinical information, mobility, night-time needs, support requirements or home
                  circumstances.
                </p>
                <p>
                  I understand that inaccurate, incomplete or outdated information may affect the
                  suitability or safety of the care arrangement, and I agree to review and update my
                  profile whenever a relevant change occurs.
                </p>
                <p>
                  By ticking this box and submitting, I confirm that the information entered is the
                  information I wish Grace &amp; Goodwill to record and make available to the
                  appropriate people involved in the care arrangement.
                </p>
              </div>
            </label>
          </div>

          {/* Metadata Strip + Action Buttons */}
          <div className="pt-4 border-t border-[#F2ECE0] space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              <div className="sm:border-r border-[#EAE3D4] pr-2">
                <div className="text-[11px] text-[#7D7362]">Name confirming:</div>
                <div className="font-serif text-sm font-semibold text-[#0A1629] mt-0.5">
                  Eleanor Thomas
                </div>
              </div>
              <div className="sm:border-r border-[#EAE3D4] pr-2">
                <div className="text-[11px] text-[#7D7362]">Date:</div>
                <div className="font-serif text-sm font-semibold text-[#0A1629] mt-0.5 tabular-nums">
                  04 Oct 2026
                </div>
              </div>
              <div className="sm:border-r border-[#EAE3D4] pr-2">
                <div className="text-[11px] text-[#7D7362]">Time:</div>
                <div className="font-serif text-sm font-semibold text-[#0A1629] mt-0.5 tabular-nums">
                  20:17
                </div>
              </div>
              <div className="sm:border-r border-[#EAE3D4] pr-2">
                <div className="text-[11px] text-[#7D7362]">Submitted by:</div>
                <div className="font-serif text-sm font-semibold text-[#0A1629] mt-0.5">
                  Client
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#7D7362]">Declaration version:</div>
                <div className="font-serif text-sm font-semibold text-[#0A1629] mt-0.5 tabular-nums">
                  V3.1
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeclarationStatus('draft');
                  showToast('Declaration progress saved as Draft.');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C5A059] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleClientConfirmSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A1629] hover:bg-[#132544] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF7A]" />
                <span>Confirm &amp; Submit Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 3 CARDS: Latest change awaiting approval | Admin-assisted changes | Declaration history */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* 1. Latest change awaiting approval */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
              <FileText className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#0A1629]">
              Latest change awaiting approval
            </h3>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            You have made changes to the following sections. These will be applied once you confirm
            and submit your declaration.
          </p>

          <div className="space-y-2.5">
            {[
              {
                label: 'Medication',
                icon: Pill,
                target: 'medication' as AdminView,
              },
              {
                label: 'Night-time Routine',
                icon: Moon,
                target: 'client-biography' as AdminView,
              },
              {
                label: 'Allergies',
                icon: ShieldAlert,
                target: 'allergies' as AdminView,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate?.(item.target)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE3] border border-[#EAE3D4] text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 font-semibold text-[#0A1629]">
                    <Icon className="w-4 h-4 text-[#0A1629]" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#8C6D2B]">
                      {declarationStatus === 'live' ? 'Live' : 'Updated'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7D7362]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Admin-assisted changes */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
                <Users className="w-4 h-4 text-[#8C6D2B]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">
                Admin-assisted changes
              </h3>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Our team may make updates to your profile on your behalf, for example following a call
              or a review. You can review and authorise these changes here before they go live.
            </p>
          </div>

          {declarationStatus === 'awaiting_client' && declarationDiffs.length > 0 ? (
            <div className="p-4 rounded-xl bg-[#FDF8EC] border border-[#DFD0B4] space-y-2.5 text-xs">
              <div className="font-semibold text-[#0A1629]">
                {declarationDiffs.length} admin-prepared updates awaiting your review:
              </div>
              <ul className="space-y-1 text-[#475569]">
                {declarationDiffs.slice(0, 3).map((d) => (
                  <li key={d.id} className="truncate">
                    &bull; <strong className="text-[#0A1629]">{d.section}:</strong> {d.newDraft}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onNavigate?.('client-declarations')}
                className="text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] underline cursor-pointer"
              >
                Inspect full comparison table &rarr;
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#8C6D2B] shrink-0 mt-0.5" />
              <p className="text-xs text-[#334155] leading-relaxed">
                Any changes made by our team will appear here for your review. You will always be
                asked to confirm before these changes are saved.
              </p>
            </div>
          )}
        </div>

        {/* 3. Declaration history */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
                <Clock className="w-4 h-4 text-[#8C6D2B]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">
                Declaration history
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowFullHistoryModal(true)}
              className="text-xs font-semibold text-[#0A1629] underline hover:text-[#8C6D2B] cursor-pointer"
            >
              View all
            </button>
          </div>

          <p className="text-xs text-[#475569]">
            A record of your previous declarations and changes.
          </p>

          <div className="space-y-2.5 text-xs">
            {historyRows.map((row, idx) => (
              <div key={row.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 tabular-nums">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      row.status === 'Live'
                        ? 'bg-emerald-600'
                        : row.status === 'Awaiting Confirmation'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="font-medium text-[#0A1629]">{row.date}</span>
                  <span className="text-[#7D7362]">{row.time}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-semibold ${
                      row.status === 'Live'
                        ? 'text-emerald-700'
                        : row.status === 'Awaiting Confirmation'
                        ? 'text-amber-700'
                        : 'text-slate-600'
                    }`}
                  >
                    &bull; {idx === 0 && declarationStatus === 'live' ? 'Live' : row.status}
                  </span>
                  <span className="font-semibold text-[#0A1629] tabular-nums">{row.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full History Modal */}
      {showFullHistoryModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                Declaration History — Eleanor Thomas
              </h3>
              <button
                type="button"
                onClick={() => setShowFullHistoryModal(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2.5 text-xs">
              {historyRows.map((row) => (
                <div
                  key={row.id}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-between"
                >
                  <span className="font-semibold text-[#0A1629] tabular-nums">
                    {row.version} &mdash; {row.date} ({row.time})
                  </span>
                  <span
                    className={`font-semibold ${
                      row.status === 'Live'
                        ? 'text-emerald-700'
                        : row.status === 'Awaiting Confirmation'
                        ? 'text-amber-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {row.status}
                  </span>
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
