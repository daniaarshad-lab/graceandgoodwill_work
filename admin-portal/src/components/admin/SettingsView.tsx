import React, { useState } from 'react';
import {
  Settings,
  Shield,
  User,
  Users,
  DollarSign,
  Mail,
  MessageSquare,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';
import { usePlatformStore, PlatformSettings } from '../../data/platformStore';

export const SettingsView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, adminRole, setAdminRole, auditEntries } =
    usePlatformStore();

  const [activeTab, setActiveTab] = useState<'staff' | 'pricing' | 'templates' | 'logs'>('staff');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form states
  const [standardFloorFee, setStandardFloorFee] = useState<number>(
    platformSettings.standardWeeklyPriceFloor || 1200
  );
  const [carerMinRate, setCarerMinRate] = useState<number>(850);
  const [approvalEmailSubject, setApprovalEmailSubject] = useState<string>(
    platformSettings.approvalEmailTemplateSubject ||
      'Action required: review and approve your Grace & Goodwill profile and care request'
  );
  const [approvalEmailBody, setApprovalEmailBody] = useState<string>(
    platformSettings.approvalEmailTemplateBody || ''
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState<string>(
    platformSettings.whatsappNotificationTemplate || ''
  );

  const handleSavePricing = () => {
    updatePlatformSettings((prev) => ({
      ...prev,
      standardWeeklyPriceFloor: standardFloorFee,
    }));
    setSuccessNotice('Pricing thresholds updated and logged in compliance audit.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleSaveTemplates = () => {
    updatePlatformSettings((prev) => ({
      ...prev,
      approvalEmailTemplateSubject: approvalEmailSubject,
      approvalEmailTemplateBody: approvalEmailBody,
      whatsappNotificationTemplate: whatsappTemplate,
    }));
    setSuccessNotice('Email and WhatsApp communication templates saved.');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const staffMembers = [
    {
      id: 'staff-1',
      name: 'Jessica Smith',
      email: 'jessica.smith@graceandgoodwill.co.uk',
      role: 'Admin',
      canApprovePricing: false,
      canBroadcastCareRequests: true,
      canAccessInternalNotes: true,
    },
    {
      id: 'staff-2',
      name: 'Aurea Neto',
      email: 'aurea.neto@graceandgoodwill.co.uk',
      role: 'Super Admin',
      canApprovePricing: true,
      canBroadcastCareRequests: true,
      canAccessInternalNotes: true,
    },
    {
      id: 'staff-3',
      name: 'Daniel Carter',
      email: 'daniel.carter@graceandgoodwill.co.uk',
      role: 'Admin',
      canApprovePricing: false,
      canBroadcastCareRequests: true,
      canAccessInternalNotes: true,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif text-[#060D1E] font-medium tracking-tight">
              Platform Administration & Settings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#B88E3E] font-medium border border-[#D4AF7A]/30">
              Role & Policy Controls
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative personnel, pricing floors, automated templates and regulatory governance parameters.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#F1EAD9] p-1 rounded-xl border border-[#D4AF7A]/20">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff & Roles
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Pricing Thresholds
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                : 'text-slate-700 hover:text-[#060D1E]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Log
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Staff & Roles Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-serif font-bold text-base text-[#060D1E]">
                Active Administrative Personnel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Role-based access determines who can create requests, negotiate pricing, broadcast placements, and access confidential notes.
              </p>
            </div>

            <div className="divide-y divide-[#F1EAD9]">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="py-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#060D1E] text-[#D4AF7A] flex items-center justify-center font-bold text-xs border border-[#D4AF7A]/30">
                      {staff.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#060D1E]">
                          {staff.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            staff.role === 'Super Admin'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {staff.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{staff.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#B88E3E]" />
                      <span>Pricing Floor Override: {staff.canApprovePricing ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#B88E3E]" />
                      <span>Internal Notes: Permitted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Session Role Selector */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D4AF7A]/40 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-xs text-[#060D1E]">
                Simulate Current Logged-in Staff Role
              </h3>
              <p className="text-[11px] text-slate-500">
                Switching active role allows testing permission boundaries (e.g. Super Admin pricing override vs standard Admin).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdminRole('admin')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                  adminRole === 'admin'
                    ? 'bg-[#060D1E] text-white border-[#060D1E]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Admin (Jessica Smith)
              </button>
              <button
                onClick={() => setAdminRole('super_admin')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                  adminRole === 'super_admin'
                    ? 'bg-[#060D1E] text-white border-[#060D1E]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Super Admin (Aurea Neto)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Thresholds Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif font-bold text-base text-[#060D1E]">
              Care Request Pricing Floors & Guardrails
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              To preserve quality of care and fair carer remuneration, agreed fees below standard thresholds require documented justification and audit recording.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] space-y-2">
              <label className="block text-xs font-semibold text-[#060D1E]">
                Standard Client Weekly Floor Fee (£/week)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">£</span>
                <input
                  type="number"
                  value={standardFloorFee}
                  onChange={(e) => setStandardFloorFee(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Any care request entered with an agreed weekly charge under £{standardFloorFee} requires a mandatory reason and Super Admin review.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] space-y-2">
              <label className="block text-xs font-semibold text-[#060D1E]">
                Carer Minimum Weekly Remuneration (£/week)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">£</span>
                <input
                  type="number"
                  value={carerMinRate}
                  onChange={(e) => setCarerMinRate(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#D4AF7A]/40 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Baseline pay offered to self-employed live-in carers before agreed food allowances.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSavePricing}
              className="px-5 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 text-[#D4AF7A]" />
              Save Pricing Thresholds
            </button>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif font-bold text-base text-[#060D1E]">
              Client Approval & Communication Templates
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verbatim templates required by operational and legal standards. Dynamic placeholders like [Client Name], [Care Request Reference] and [Version] are populated automatically.
            </p>
          </div>

          {/* Email Subject & Body */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval Email Subject
              </label>
              <input
                type="text"
                value={approvalEmailSubject}
                onChange={(e) => setApprovalEmailSubject(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval Email Body (Statutory Legal Text)
              </label>
              <textarea
                rows={10}
                value={approvalEmailBody}
                onChange={(e) => setApprovalEmailBody(e.target.value)}
                className="w-full p-3 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Sharing Notice Template
              </label>
              <textarea
                rows={5}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                className="w-full p-3 bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-none"
              />
              <p className="text-[11px] text-amber-800 mt-1">
                Note: Operational policy mandates that WhatsApp messages state clearly: "A reply on WhatsApp does not constitute approval."
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveTemplates}
              className="px-5 py-2.5 bg-[#060D1E] hover:bg-[#1E293B] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 text-[#D4AF7A]" />
              Save Communication Templates
            </button>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#E2D8C3] p-6 shadow-xs space-y-4">
          <div>
            <h2 className="font-serif font-bold text-base text-[#060D1E]">
              Settings & Policy Revision Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              History of changes to platform configurations, thresholds, and administrative assignments.
            </p>
          </div>

          <div className="divide-y divide-[#F1EAD9] text-xs">
            {auditEntries
              .filter((e) => e.actionType === 'pricing_agreement' || e.actionType === 'settings_updated')
              .slice(0, 10)
              .map((entry) => (
                <div key={entry.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#060D1E]">{entry.description}</div>
                    <div className="text-[11px] text-slate-500">
                      Modified by {entry.adminName} ({entry.adminRole}) at {entry.timestamp}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {entry.newValue || 'Updated'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
