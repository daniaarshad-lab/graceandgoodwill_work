"use client";

import React, { useState } from 'react';
import {
  Home,
  User,
  FileText,
  Plus,
  Pill,
  Heart,
  Shield,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Check,
  Coins,
  Eye,
  X,
  AlertTriangle,
  Calendar,
  PawPrint,
  Cigarette,
  Edit2,
  Camera,
  Trash2,
} from 'lucide-react';
import {
  deriveMainCareNeeds,
  getFinancialVisibility,
  usePlatformStore,
} from "@/data/care-platform/platformStore";
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ActivePlacementViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

export const ActivePlacementView: React.FC<ActivePlacementViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const { placements, careRequests, updatePlacement, setDeclarationStatus } = usePlatformStore();

  // Default to Eleanor Briggs so the original Client Profile view loads seamlessly, with ability to switch clients
  const defaultEleanor = placements.find((p) => p.id === 'pl-eleanor') || placements[0];
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(
    defaultEleanor?.id || 'pl-eleanor'
  );
  const [portalMode, setPortalMode] = useState<'admin-profile' | 'client-portal'>('admin-profile');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'careplan' | 'medication' | 'carers' | 'documents' | 'notes' | 'safety'
  >('medication');
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastSubtitle, setToastSubtitle] = useState('');
  const [previewDocType, setPreviewDocType] = useState<'agreement' | 'statement' | null>(null);
  const [editingClientFee, setEditingClientFee] = useState(false);
  const [editingLifestyle, setEditingLifestyle] = useState(false);
  const [newProfileNote, setNewProfileNote] = useState('');

  const [medications, setMedications] = useState([
    {
      id: 'ap-m1',
      name: 'Amlodipine',
      dose: '5 mg',
      frequency: 'Once daily',
      time: '08:00',
      support: 'Prompt only',
      notes: 'For blood pressure',
    },
    {
      id: 'ap-m2',
      name: 'Metformin',
      dose: '500 mg',
      frequency: 'Twice daily',
      time: '08:00, 18:00',
      support: 'Support to take',
      notes: 'With food',
    },
    {
      id: 'ap-m3',
      name: 'Paracetamol',
      dose: '1 g',
      frequency: 'Up to 4 times daily',
      time: 'As required',
      support: 'Support to take',
      notes: 'For pain relief',
    },
    {
      id: 'ap-m4',
      name: 'Furosemide',
      dose: '40 mg',
      frequency: 'Once daily',
      time: '08:00',
      support: 'Prompt only',
      notes: 'Monitor for swelling',
    },
    {
      id: 'ap-m5',
      name: 'Omeprazole',
      dose: '20 mg',
      frequency: 'Once daily',
      time: '08:00',
      support: 'Prompt only',
      notes: 'Before food',
    },
    {
      id: 'ap-m6',
      name: 'Vitamin D3',
      dose: '800 IU',
      frequency: 'Once daily',
      time: '08:00',
      support: 'Prompt only',
      notes: 'Supplement',
    },
  ]);

  const [medModalOpen, setMedModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [openMedMenuId, setOpenMedMenuId] = useState<string | null>(null);
  const [medForm, setMedForm] = useState({
    name: '',
    dose: '',
    frequency: 'Once daily',
    time: '08:00',
    support: 'Prompt only',
    notes: '',
  });

  const [editingClinical, setEditingClinical] = useState(false);
  const [clinicalSummary, setClinicalSummary] = useState({
    catheter: 'Yes',
    diabetes: 'Type 2',
    physiotherapy: 'Weekly',
    districtNurse: 'Monthly',
    allergies: 'Penicillin',
    notes:
      'Mrs Briggs has a urinary catheter which is changed every 4 weeks by the district nurse. Monitor for signs of infection. Mobility support required. Attends weekly physiotherapy for strength and balance.',
  });

  const selectedPlacement =
    placements.find((p) => p.id === selectedPlacementId) || defaultEleanor || placements[0];

  // Client Profile & Client Portal strictly follow Client financial visibility:
  // ONLY Agreed Grace & Goodwill Client Fee is ever shown here — carer fees NEVER appear on Client Profile, Client Portal, or Client Documents.
  const clientFinancialPolicy = getFinancialVisibility('client');
  const conciseCareNeeds = selectedPlacement
    ? deriveMainCareNeeds(selectedPlacement, careRequests, 4)
    : ['Live-in Companionship & Daily Support'];

  const handleConfirmSubmit = (customMsg?: string) => {
    setToastSubtitle(customMsg || '');
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 4000);
  };

  const clientDisplayName =
    selectedPlacement.id === 'pl-eleanor'
      ? 'Mrs Eleanor Briggs'
      : `${selectedPlacement.clientFirstName} ${selectedPlacement.clientSurname}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 relative overflow-hidden">
      {/* ── Background Grace & Goodwill Logo Watermark (3D Gold Ribbon Knot) ── */}
      <div className="absolute top-0 right-0 w-[420px] sm:w-[540px] lg:w-[620px] h-48 sm:h-56 pointer-events-none select-none z-0 overflow-hidden opacity-[0.20]">
        <img
          src="/website_logo.png"
          alt=""
          className="w-full h-full object-contain object-right filter brightness-110 contrast-110"
        />
      </div>

      {/* Unified Client Section Navigation */}
      {onNavigate && (
        <ClientSectionNav currentView="active-placement" onNavigate={onNavigate} />
      )}

      {/* Top Breadcrumbs + Client Selector + Client Portal View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2 text-[#7D7362]">
          <button onClick={onBack} className="hover:text-[#0A1629] transition-colors cursor-pointer">
            Clients
          </button>
          <span>&gt;</span>
          <span>{clientDisplayName}</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#0A1629]">
            {portalMode === 'client-portal' ? 'Client Portal' : 'Client Profile'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {portalMode === 'admin-profile' && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D4] text-xs">
              <span className="text-[#7D7362]">Client Profile:</span>
              <select
                value={selectedPlacement.id}
                onChange={(e) => setSelectedPlacementId(e.target.value)}
                className="font-semibold text-[#0A1629] bg-transparent focus:outline-none cursor-pointer"
              >
                {placements.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.clientFirstName} {pl.clientSurname} ({pl.location})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center bg-white rounded-xl border border-[#EAE3D4] p-0.5">
            <button
              onClick={() => setPortalMode('admin-profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                portalMode === 'admin-profile'
                  ? 'bg-[#0A1629] text-white'
                  : 'text-[#5C5549] hover:text-[#0A1629]'
              }`}
            >
              Client Profile
            </button>
            <button
              onClick={() => {
                setPortalMode('client-portal');
                setEditingClientFee(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                portalMode === 'client-portal'
                  ? 'bg-[#B88E3E] text-white'
                  : 'text-[#5C5549] hover:text-[#0A1629]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Client Portal View</span>
            </button>
          </div>
        </div>
      </div>

      {portalMode === 'client-portal' && (
        <div className="rounded-xl bg-[#FAF6EE] border border-[#DFD0B4] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#0A1629] relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B88E3E] shrink-0" />
            <span>
              <strong>Grace &amp; Goodwill Client Portal ({clientDisplayName}):</strong> Displays
              your care plan, clinical updates, assigned carer introduction, and your agreed Grace
              &amp; Goodwill weekly care fee (&pound;
              {selectedPlacement.agreedClientWeeklyFee.toLocaleString()}/wk).
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('client-portal-profile')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1629] text-[#EBD8B2] text-xs font-semibold hover:bg-[#132544] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#D4AF7A]" />
                <span>Choose Profile Image &amp; My Profile</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs font-semibold text-[#8C6D2B] hover:text-[#0A1629] underline cursor-pointer"
            >
              View Client Agreements &amp; Fee Statements &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Header Banner Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src={selectedPlacement.avatar}
            alt={clientDisplayName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B88E3E]/40 shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0A1629] tracking-tight">
                {clientDisplayName}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {selectedPlacement.status === 'Active' ? 'Active Placement' : selectedPlacement.status}
              </span>
            </div>
            <div className="text-xs text-[#7D7362] mt-0.5">
              {selectedPlacement.id === 'pl-eleanor'
                ? '84, Manchester'
                : `${selectedPlacement.age}, ${selectedPlacement.location}`}
            </div>
            <div className="text-xs text-[#5C5549] mt-1">
              <span className="font-semibold text-[#0A1629]">Main Care Needs:</span>{' '}
              {conciseCareNeeds.join(', ')}
            </div>
          </div>
        </div>

        {/* Placement & Client Agreed Fee Summary (Zero Carer Remuneration Shown) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E0D5C1] flex items-center justify-center text-[#B88E3E]">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#A39886]">{selectedPlacement.placementType}</div>
              <div className="font-semibold text-[#0A1629]">
                Start: {selectedPlacement.startDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E0D5C1] flex items-center justify-center text-[#B88E3E]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#A39886]">Primary Carer</div>
              <div className="font-semibold text-[#0A1629]">
                {selectedPlacement.id === 'pl-eleanor'
                  ? 'Sophie Williams'
                  : selectedPlacement.primaryCarer.fullName}
              </div>
            </div>
          </div>

          {clientFinancialPolicy.canViewAgreedClientFee && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E0D5C1] flex items-center justify-center text-[#B88E3E]">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#A39886]">Agreed G&amp;G Care Fee</div>
                <div className="font-semibold text-[#0A1629] tabular-nums">
                  &pound;{selectedPlacement.agreedClientWeeklyFee.toLocaleString()} / week
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E0D5C1] flex items-center justify-center text-[#B88E3E]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#A39886]">Care Plan</div>
              <div className="font-semibold text-[#0A1629]">Version 3.2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 border-b border-[#EAE3D4] pb-1 overflow-x-auto text-xs relative z-10">
        {[
          { id: 'overview', label: 'Overview & Agreed Fees' },
          { id: 'careplan', label: 'Care Plan' },
          { id: 'medication', label: 'Medication & Clinical', icon: Pill },
          { id: 'carers', label: 'Carers' },
          { id: 'documents', label: 'Client Documents & Statements' },
          { id: 'notes', label: 'Notes' },
          { id: 'safety', label: 'Safety & Alerts' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-[#B88E3E] text-[#0A1629] bg-white shadow-sm'
                  : 'text-[#7D7362] hover:text-[#0A1629] hover:bg-white/50'
              }`}
            >
              {tab.icon && <Pill className="w-3.5 h-3.5 text-[#B88E3E]" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OVERVIEW & AGREED GRACE & GOODWILL FEES ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 text-xs">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[#0A1629]">
                Client Profile &amp; Live-in Care Arrangement
              </h2>
              <p className="text-[#5C5549] leading-relaxed">{selectedPlacement.aboutClient}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1]">
                  <span className="text-[11px] text-[#7D7362] block">Care Arrangement</span>
                  <strong className="text-[#0A1629]">
                    {selectedPlacement.placementType} ({selectedPlacement.duration})
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1]">
                  <span className="text-[11px] text-[#7D7362] block">Placement Dates</span>
                  <strong className="text-[#0A1629]">
                    Start: {selectedPlacement.startDate} -{' '}
                    {selectedPlacement.endDate === 'Ongoing'
                      ? 'Ongoing'
                      : `End: ${selectedPlacement.endDate}`}
                  </strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1]">
                  <span className="text-[11px] text-[#7D7362] block">Main Care Needs</span>
                  <strong className="text-[#0A1629]">{conciseCareNeeds.join(', ')}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1]">
                  <span className="text-[11px] text-[#7D7362] block">Carer Accommodation</span>
                  <strong className="text-[#0A1629]">
                    {selectedPlacement.accommodation.bedroomType} &bull;{' '}
                    {selectedPlacement.accommodation.bathroomType}
                  </strong>
                </div>
              </div>
            </div>

            {/* Household, Lifestyle & Carer Safety Disclosures on Client Profile */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#F2ECE0]">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#B88E3E]" />
                  <h3 className="text-sm font-bold text-[#0A1629]">
                    Household, Lifestyle &amp; Carer Safety Disclosures
                  </h3>
                </div>
                {portalMode === 'admin-profile' && (
                  <button
                    type="button"
                    onClick={() => setEditingLifestyle(!editingLifestyle)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B88E3E] hover:underline cursor-pointer"
                  >
                    {editingLifestyle ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A1629]">
                    <PawPrint className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Pets in Home</span>
                  </div>
                  {editingLifestyle && portalMode === 'admin-profile' ? (
                    <textarea
                      rows={2}
                      value={selectedPlacement.pets}
                      onChange={(e) =>
                        updatePlacement(selectedPlacement.id, (prev) => ({
                          ...prev,
                          pets: e.target.value,
                        }))
                      }
                      placeholder="e.g. Yes, 2 dogs and 1 cat"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs focus:outline-none focus:border-[#B88E3E]"
                    />
                  ) : (
                    <p className="text-[#475569]">{selectedPlacement.pets || 'No'}</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A1629]">
                    <Cigarette className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Smoking</span>
                  </div>
                  {editingLifestyle && portalMode === 'admin-profile' ? (
                    <textarea
                      rows={2}
                      value={selectedPlacement.smoking}
                      onChange={(e) =>
                        updatePlacement(selectedPlacement.id, (prev) => ({
                          ...prev,
                          smoking: e.target.value,
                        }))
                      }
                      placeholder="e.g. Yes – smokes outdoors"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs focus:outline-none focus:border-[#B88E3E]"
                    />
                  ) : (
                    <p className="text-[#475569]">{selectedPlacement.smoking || 'No'}</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A1629]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>History of Verbal Abuse</span>
                  </div>
                  {editingLifestyle && portalMode === 'admin-profile' ? (
                    <textarea
                      rows={2}
                      value={selectedPlacement.verbalAbuseHistory}
                      onChange={(e) =>
                        updatePlacement(selectedPlacement.id, (prev) => ({
                          ...prev,
                          verbalAbuseHistory: e.target.value,
                        }))
                      }
                      placeholder="Specify verbal abuse history..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs focus:outline-none focus:border-[#B88E3E]"
                    />
                  ) : (
                    <p className="text-[#475569]">
                      {selectedPlacement.verbalAbuseHistory || 'No'}
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A1629]">
                    <Shield className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>History of Racial Abuse</span>
                  </div>
                  {editingLifestyle && portalMode === 'admin-profile' ? (
                    <textarea
                      rows={2}
                      value={selectedPlacement.racialAbuseHistory}
                      onChange={(e) =>
                        updatePlacement(selectedPlacement.id, (prev) => ({
                          ...prev,
                          racialAbuseHistory: e.target.value,
                        }))
                      }
                      placeholder="Specify racial abuse history..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCD2C0] text-[#0A1629] text-xs focus:outline-none focus:border-[#B88E3E]"
                    />
                  ) : (
                    <p className="text-[#475569]">
                      {selectedPlacement.racialAbuseHistory || 'No'}
                    </p>
                  )}
                </div>
              </div>

              {portalMode === 'admin-profile' && (
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newProfileNote}
                    onChange={(e) => setNewProfileNote(e.target.value)}
                    placeholder="Document profile change (e.g. Client got an extra pet / started smoking)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] text-[#0A1629] text-xs focus:outline-none focus:border-[#B88E3E]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const summary = newProfileNote.trim();
                      if (!summary) return;
                      const entryDate = new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });
                      updatePlacement(selectedPlacement.id, (prev) => ({
                        ...prev,
                        lifestyleChangeLog: [
                          {
                            id: `lc-${Date.now()}`,
                            date: entryDate,
                            updatedBy: 'Admin',
                            summary,
                          },
                          ...(prev.lifestyleChangeLog || []),
                        ],
                      }));
                      setNewProfileNote('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#0A1629] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF7A]" />
                    <span>Add to Profile</span>
                  </button>
                </div>
              )}

              {selectedPlacement.lifestyleChangeLog &&
                selectedPlacement.lifestyleChangeLog.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {selectedPlacement.lifestyleChangeLog.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-medium text-[#0A1629]">{entry.summary}</span>
                        <span className="text-[11px] text-[#7D7362]">
                          {entry.date} &bull; {entry.updatedBy}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Client Payment & Agreed Fee Card — Strictly Agreed Grace & Goodwill Fee Only */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#B88E3E]" />
                <h3 className="text-sm font-bold text-[#0A1629]">
                  Agreed Grace &amp; Goodwill Fees
                </h3>
              </div>
              {portalMode === 'admin-profile' && (
                <button
                  onClick={() => setEditingClientFee(!editingClientFee)}
                  className="text-xs font-semibold text-[#B88E3E] hover:underline cursor-pointer"
                >
                  {editingClientFee ? 'Done' : 'Edit'}
                </button>
              )}
            </div>

            <p className="text-[11.5px] text-[#7D7362] leading-relaxed">
              Fees agreed between {clientDisplayName} and Grace &amp; Goodwill for live-in care
              provision.
            </p>

            {editingClientFee && portalMode === 'admin-profile' ? (
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0A1629] block">
                  Agreed Client Weekly Fee (&pound;/wk)
                </label>
                <input
                  type="number"
                  min={0}
                  value={selectedPlacement.agreedClientWeeklyFee}
                  onChange={(e) =>
                    updatePlacement(selectedPlacement.id, (prev) => ({
                      ...prev,
                      agreedClientWeeklyFee: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] font-bold text-[#0A1629] tabular-nums"
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1">
                <span className="text-[11px] text-[#7D7362] block">
                  Weekly Live-in Care Service Fee
                </span>
                <div className="text-xl font-bold text-[#0A1629] tabular-nums">
                  &pound;{selectedPlacement.agreedClientWeeklyFee.toLocaleString()}.00
                  <span className="text-xs font-normal text-[#7D7362]"> / week</span>
                </div>
                <span className="text-[11px] text-[#8C6D2B] font-medium block pt-0.5">
                  Payable directly to Grace &amp; Goodwill
                </span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setPreviewDocType('agreement')}
                className="w-full py-2 px-3.5 rounded-xl border border-[#DFD0B4] bg-[#FAF6EE] hover:bg-white text-xs font-semibold text-[#0A1629] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>View Client Service Agreement</span>
              </button>
              <button
                onClick={() => setPreviewDocType('statement')}
                className="w-full py-2 px-3.5 rounded-xl border border-[#EAE3D4] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>View Weekly Fee Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: CARE PLAN ── */}
      {activeTab === 'careplan' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4 relative z-10 text-xs">
          <h2 className="text-sm font-bold text-[#0A1629]">Approved Live-in Care Plan (v3.2)</h2>
          <p className="text-[#5C5549] leading-relaxed">{selectedPlacement.careGoals}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1">
              <div className="font-bold text-[#0A1629]">Mobility Support</div>
              <div className="text-[#5C5549]">{selectedPlacement.mobilityLevel}</div>
              <p className="text-[11px] text-[#7D7362]">{selectedPlacement.mobilityDetails}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1">
              <div className="font-bold text-[#0A1629]">Personal Care Routines</div>
              <div className="text-[#5C5549]">{selectedPlacement.personalCareNeeds.join(', ')}</div>
              <p className="text-[11px] text-[#7D7362]">{selectedPlacement.personalCareNotes}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] space-y-1">
              <div className="font-bold text-[#0A1629]">Medication Routine</div>
              <p className="text-[#5C5549]">{selectedPlacement.medicationSupport}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: MEDICATION & CLINICAL ── */}
      {activeTab === 'medication' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Left 2 Cols: Medication Table & Clinical Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: Medication Management */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#B88E3E]">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0A1629]">Medication Management</h2>
                    <p className="text-[11px] text-[#7D7362]">
                      Keep medication information up to date to ensure safe, consistent care.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMedId(null);
                    setMedForm({
                      name: '',
                      dose: '',
                      frequency: 'Once daily',
                      time: '08:00',
                      support: 'Prompt only',
                      notes: '',
                    });
                    setMedModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EFE4CC] hover:bg-[#E7D8B6] border border-[#DFCEA8] text-xs font-semibold text-[#0A1629] transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8C6D2B]" />
                  <span>Add Medication</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead>
                    <tr className="border-b border-[#F2ECE0] text-[#7D7362] text-[10.5px] uppercase font-semibold">
                      <th className="pb-3">Medication Name</th>
                      <th className="pb-3">Dose</th>
                      <th className="pb-3">Frequency</th>
                      <th className="pb-3">Time(s)</th>
                      <th className="pb-3">Support Required</th>
                      <th className="pb-3">Notes</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE4]">
                    {medications.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FBF9F5] transition-colors">
                        <td className="py-3 font-semibold text-[#0A1629]">{m.name}</td>
                        <td className="py-3 text-[#7D7362]">{m.dose}</td>
                        <td className="py-3 text-[#7D7362]">{m.frequency}</td>
                        <td className="py-3 text-[#7D7362] font-mono">{m.time}</td>
                        <td className="py-3">
                          <span
                            className={`text-[10.5px] font-semibold ${
                              m.support === 'Prompt only' ? 'text-amber-800' : 'text-blue-800'
                            }`}
                          >
                            {m.support}
                          </span>
                        </td>
                        <td className="py-3 text-[#7D7362]">{m.notes}</td>
                        <td className="py-3 text-right relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMedMenuId(openMedMenuId === m.id ? null : m.id)
                            }
                            className="text-[#A39886] hover:text-[#0A1629] p-1 cursor-pointer"
                          >
                            •••
                          </button>
                          {openMedMenuId === m.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl border border-[#EAE3D4] shadow-lg py-1 z-20 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMedId(m.id);
                                  setMedForm({
                                    name: m.name,
                                    dose: m.dose,
                                    frequency: m.frequency,
                                    time: m.time,
                                    support: m.support,
                                    notes: m.notes,
                                  });
                                  setOpenMedMenuId(null);
                                  setMedModalOpen(true);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-[#0A1629] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3 text-[#B88E3E]" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMedications((prev) => prev.filter((item) => item.id !== m.id));
                                  setOpenMedMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: Clinical Information */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2ECE0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#B88E3E]">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0A1629]">Clinical Information</h2>
                    <p className="text-[11px] text-[#7D7362]">
                      Key clinical information to support safe and informed care.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingClinical(!editingClinical)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#B88E3E]" />
                  <span>{editingClinical ? 'Done Editing' : 'Edit Clinical Information'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-xs">
                {[
                  {
                    key: 'catheter' as const,
                    label: 'Catheter',
                    value: clinicalSummary.catheter,
                    dot: 'bg-sky-500',
                  },
                  {
                    key: 'diabetes' as const,
                    label: 'Diabetes',
                    value: clinicalSummary.diabetes,
                    dot: 'bg-rose-500',
                  },
                  {
                    key: 'physiotherapy' as const,
                    label: 'Physiotherapy',
                    value: clinicalSummary.physiotherapy,
                    dot: 'bg-emerald-500',
                  },
                  {
                    key: 'districtNurse' as const,
                    label: 'District Nurse',
                    value: clinicalSummary.districtNurse,
                    dot: 'bg-purple-500',
                  },
                  {
                    key: 'allergies' as const,
                    label: 'Allergies',
                    value: clinicalSummary.allergies,
                    dot: 'bg-amber-500',
                  },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[#0A1629]">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${tile.dot}`} />
                      <span>{tile.label}</span>
                    </div>
                    {editingClinical ? (
                      <input
                        type="text"
                        value={tile.value}
                        onChange={(e) =>
                          setClinicalSummary((prev) => ({
                            ...prev,
                            [tile.key]: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629]"
                      />
                    ) : (
                      <div className="text-[#5C5549] pl-3.5">{tile.value}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clinical Notes & Key Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E0D5C1] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A1629]">
                    <FileText className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Clinical Notes</span>
                  </div>
                  {editingClinical ? (
                    <textarea
                      rows={3}
                      value={clinicalSummary.notes}
                      onChange={(e) =>
                        setClinicalSummary((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629]"
                    />
                  ) : (
                    <p className="text-[11.5px] text-[#7D7362] leading-relaxed">
                      {clinicalSummary.notes}
                    </p>
                  )}
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E0D5C1] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A1629]">
                    <Phone className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Key Contacts</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-[#0A1629] block text-[11px]">
                        District Nurse Team – Central Manchester
                      </span>
                      <span className="text-[#7D7362] text-[11px]">Tel: 0161 123 4567</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0A1629] block text-[11px]">
                        GP – Dr James Carter (Riverside Medical Centre)
                      </span>
                      <span className="text-[#7D7362] text-[11px]">Tel: 0161 987 6543</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Notifications & Safety Updates + Recent Activity */}
          <div className="space-y-6">
            {/* Notifications & Safety Updates Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE0]">
                <Shield className="w-4 h-4 text-[#B88E3E]" />
                <h3 className="text-xs font-bold text-[#0A1629]">
                  Notifications &amp; Safety Updates
                </h3>
              </div>
              <p className="text-[11px] text-[#7D7362] leading-relaxed">
                Clients and carers are automatically notified when medication or clinical
                information is updated.
              </p>

              {/* Client Notification */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E0D5C1] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A1629] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B88E3E]" /> Client Notification
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                    ● Email Sent
                  </span>
                </div>
                <p className="text-[10.5px] text-[#7D7362]">
                  A confirmation email is sent to {clientDisplayName} when changes are confirmed.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-[#E8DEC9] text-[10.5px] text-slate-700 italic">
                  &ldquo;Your medication information has been updated. Please log in to your Grace
                  &amp; Goodwill client portal to view the changes.&rdquo;
                </div>
                <div className="text-[10px] text-[#A39886] flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Sent: 15 Jan 2024, 14:32
                </div>
              </div>

              {/* Carer Alert */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E0D5C1] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A1629] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B88E3E]" /> Carer Alert
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                    ● Alert Sent
                  </span>
                </div>
                <p className="text-[10.5px] text-[#7D7362]">
                  The allocated carer receives an instant notification when medication or clinical
                  information is updated.
                </p>
                <div className="bg-white p-2.5 rounded-lg border border-[#E8DEC9] text-[10.5px] text-slate-700 italic">
                  &ldquo;Important medication information has been updated. Please log in to review
                  the changes.&rdquo;
                </div>
                <div className="text-[10px] text-[#A39886] flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Sent: 15 Jan 2024, 14:32
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#B88E3E]" />
                  <h3 className="text-xs font-bold text-[#0A1629]">Recent Activity</h3>
                </div>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="text-[11px] text-[#B88E3E] font-medium hover:underline cursor-pointer"
                >
                  View all &rarr;
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {[
                  {
                    dot: 'bg-sky-500',
                    date: '15 Jan 2024, 14:32',
                    actor: 'Jessica Smith (Admin)',
                    title: 'Medication updated',
                    detail: 'Metformin dose changed to 500mg twice daily',
                  },
                  {
                    dot: 'bg-[#B88E3E]',
                    date: '12 Jan 2024, 10:15',
                    actor: 'Sophie Williams (Carer)',
                    title: 'Clinical information updated',
                    detail: 'Physiotherapy frequency updated to weekly',
                  },
                  {
                    dot: 'bg-amber-500',
                    date: '10 Jan 2024, 16:20',
                    actor: 'Dr James Carter (GP)',
                    title: 'Allergies updated',
                    detail: 'Penicillin added as allergy',
                  },
                  {
                    dot: 'bg-emerald-600',
                    date: '08 Jan 2024, 09:14',
                    actor: 'Sophie Williams (Carer)',
                    title: 'Medication confirmed',
                    detail: 'All medications reviewed and confirmed',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${item.dot}`} />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10.5px] text-[#7D7362]">
                        <span>{item.date}</span>
                        <span className="font-medium text-[#0A1629]">{item.actor}</span>
                      </div>
                      <div className="font-semibold text-[#0A1629]">{item.title}</div>
                      <div className="text-[11px] text-[#7D7362]">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CARERS (Client-Safe Carer Introduction — Zero Carer Pay Shown) ── */}
      {activeTab === 'carers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 text-xs">
          <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm flex items-center gap-4">
            <img
              src={selectedPlacement.primaryCarer.avatar}
              alt={selectedPlacement.primaryCarer.name}
              className="w-14 h-14 rounded-full object-cover border border-[#E0D5C1]"
            />
            <div>
              <div className="text-[11px] text-[#7D7362]">Assigned Primary Live-in Carer</div>
              <div className="text-base font-bold text-[#0A1629]">
                {selectedPlacement.id === 'pl-eleanor'
                  ? 'Sophie Williams'
                  : selectedPlacement.primaryCarer.fullName}
              </div>
              <div className="text-[#8C6D2B] font-medium mt-0.5">
                {selectedPlacement.placementType} &bull; DBS &amp; Reference Verified
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm flex items-center gap-4">
            {selectedPlacement.reliefCarer ? (
              <>
                <img
                  src={selectedPlacement.reliefCarer.avatar}
                  alt={selectedPlacement.reliefCarer.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#E0D5C1]"
                />
                <div>
                  <div className="text-[11px] text-[#7D7362]">Assigned Relief Carer</div>
                  <div className="text-base font-bold text-[#0A1629]">
                    {selectedPlacement.reliefCarer.name}
                  </div>
                  <div className="text-[#7D7362] mt-0.5">
                    Confirmed respite cover:{' '}
                    {selectedPlacement.reliefCarer.confirmedDates || 'As scheduled'}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[#7D7362]">
                Single respite block — no relief carer changeover required.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 5: CLIENT DOCUMENTS & AUTO-GENERATED FEE STATEMENTS (Zero Carer Pay Shown) ── */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-4 relative z-10 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2ECE0]">
            <div>
              <h2 className="text-sm font-bold text-[#0A1629]">
                Client Agreements &amp; Automatically Generated Fee Documents
              </h2>
              <p className="text-[11.5px] text-[#7D7362] mt-0.5">
                All client-facing documents display only the fees agreed between the Client and
                Grace &amp; Goodwill.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] flex flex-col justify-between gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8C6D2B]">
                  Auto-Generated Client Agreement
                </div>
                <h3 className="text-sm font-bold text-[#0A1629] mt-1">
                  Grace &amp; Goodwill Client Care Service Agreement &amp; Schedule of Fees
                </h3>
                <p className="text-[11.5px] text-[#5C5549] mt-1 leading-relaxed">
                  Agreed Weekly Care Fee:{' '}
                  <strong className="text-[#0A1629] tabular-nums">
                    &pound;{selectedPlacement.agreedClientWeeklyFee.toLocaleString()}.00 / week
                  </strong>{' '}
                  payable to Grace &amp; Goodwill.
                </p>
              </div>
              <button
                onClick={() => setPreviewDocType('agreement')}
                className="self-start px-3.5 py-2 rounded-xl bg-[#0A1629] text-white font-semibold hover:bg-[#152542] transition-colors cursor-pointer"
              >
                Open Client Service Agreement
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E0D5C1] flex flex-col justify-between gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8C6D2B]">
                  Auto-Generated Client Statement
                </div>
                <h3 className="text-sm font-bold text-[#0A1629] mt-1">
                  Grace &amp; Goodwill Weekly Care Fee Statement
                </h3>
                <p className="text-[11.5px] text-[#5C5549] mt-1 leading-relaxed">
                  Statement of agreed weekly live-in care service charges (&pound;
                  {selectedPlacement.agreedClientWeeklyFee.toLocaleString()}.00/wk) for{' '}
                  {clientDisplayName}.
                </p>
              </div>
              <button
                onClick={() => setPreviewDocType('statement')}
                className="self-start px-3.5 py-2 rounded-xl border border-[#D4AF7A] bg-white hover:bg-[#FAF6EE] text-[#0A1629] font-semibold transition-colors cursor-pointer"
              >
                Open Weekly Fee Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6 & 7: NOTES / SAFETY & ALERTS ── */}
      {(activeTab === 'notes' || activeTab === 'safety') && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm space-y-3 relative z-10 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0A1629]">
            {activeTab === 'safety' ? (
              <AlertTriangle className="w-4 h-4 text-[#B88E3E]" />
            ) : (
              <Clock className="w-4 h-4 text-[#B88E3E]" />
            )}
            <span>
              {activeTab === 'safety'
                ? 'Safeguarding, Allergy & Clinical Alerts'
                : 'Care & Clinical Activity Notes'}
            </span>
          </div>
          <p className="text-[#5C5549] leading-relaxed">
            {activeTab === 'safety'
              ? 'Recorded allergy: Penicillin. District Nurse reviews catheter care every 4 weeks; weekly physiotherapy in place.'
              : 'All medication prompts and daily wellbeing updates are logged and synchronised across authorised care team views.'}
          </p>
        </div>
      )}

      {/* Bottom Action Footer Bar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#EAE3D4] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-[#7D7362]">
          Last updated: 15 Jan 2024, 14:32 by Jessica Smith
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleConfirmSubmit('Changes saved as Draft.')}
            className="px-4 py-2 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] hover:bg-white transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          {portalMode === 'admin-profile' && (
            <button
              type="button"
              onClick={() => {
                setDeclarationStatus('awaiting_client');
                handleConfirmSubmit(
                  `Sent to ${clientDisplayName} for Client Declaration review & authorisation.`
                );
              }}
              className="px-4 py-2 rounded-xl bg-[#EFE2C6] hover:bg-[#E7D5AE] border border-[#D4AF7A] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              Send for Client Review
            </button>
          )}
          <button
            type="button"
            onClick={() => handleConfirmSubmit()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#060D1E] to-[#12244C] text-[#EBD8B2] border border-[#D4AF7A]/50 text-xs font-bold hover:brightness-110 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF7A]" />
            <span>Confirm &amp; Submit</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Medication Modal */}
      {medModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {editingMedId ? 'Edit Medication' : 'Add Medication'}
              </h3>
              <button
                type="button"
                onClick={() => setMedModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!medForm.name.trim()) return;
                if (editingMedId) {
                  setMedications((prev) =>
                    prev.map((m) => (m.id === editingMedId ? { ...medForm, id: editingMedId } : m))
                  );
                } else {
                  setMedications((prev) => [...prev, { ...medForm, id: `ap-m-${Date.now()}` }]);
                }
                setMedModalOpen(false);
                handleConfirmSubmit(`Medication schedule updated for ${clientDisplayName}.`);
              }}
              className="p-6 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  value={medForm.name}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Amlodipine"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Dose</label>
                  <input
                    type="text"
                    required
                    value={medForm.dose}
                    onChange={(e) => setMedForm((prev) => ({ ...prev, dose: e.target.value }))}
                    placeholder="e.g. 5 mg"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Frequency</label>
                  <input
                    type="text"
                    required
                    value={medForm.frequency}
                    onChange={(e) =>
                      setMedForm((prev) => ({ ...prev, frequency: e.target.value }))
                    }
                    placeholder="e.g. Once daily"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Time(s)</label>
                  <input
                    type="text"
                    required
                    value={medForm.time}
                    onChange={(e) => setMedForm((prev) => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g. 08:00"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">
                    Support Required
                  </label>
                  <select
                    value={medForm.support}
                    onChange={(e) => setMedForm((prev) => ({ ...prev, support: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  >
                    <option value="Prompt only">Prompt only</option>
                    <option value="Support to take">Support to take</option>
                    <option value="Independent">Independent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Notes</label>
                <input
                  type="text"
                  value={medForm.notes}
                  onChange={(e) => setMedForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. With food"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMedModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE3D4] font-semibold text-[#5C5549] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0A1629] text-[#EBD8B2] font-semibold cursor-pointer"
                >
                  {editingMedId ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auto-Generated Client Document Preview Modal (Zero Carer Remuneration Included) */}
      {previewDocType && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-[#D4AF7A] font-semibold">
                  Grace &amp; Goodwill &bull; Client-Facing Document
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  {previewDocType === 'agreement'
                    ? 'Client Care Service Agreement & Schedule of Fees'
                    : 'Weekly Live-in Care Service Fee Statement'}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDocType(null)}
                className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#334155]">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4]">
                <div>
                  <span className="text-[10.5px] text-[#7D7362] block">Client</span>
                  <strong className="text-[#0A1629]">{clientDisplayName}</strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#7D7362] block">Care Arrangement</span>
                  <strong className="text-[#0A1629]">{selectedPlacement.placementType}</strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#7D7362] block">Dates</span>
                  <strong className="text-[#0A1629]">
                    Start: {selectedPlacement.startDate} -{' '}
                    {selectedPlacement.endDate === 'Ongoing'
                      ? 'Ongoing'
                      : `End: ${selectedPlacement.endDate}`}
                  </strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-[#7D7362] block">Billing Entity</span>
                  <strong className="text-[#0A1629]">Grace &amp; Goodwill Ltd</strong>
                </div>
              </div>

              <div className="rounded-xl border border-[#DFD0B4] bg-[#FDF9F1] p-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D2B]">
                  Agreed Client Fee (Payable to Grace &amp; Goodwill)
                </div>
                <div className="flex items-baseline justify-between pt-1.5 border-t border-[#EDE3CE]">
                  <span className="font-semibold text-[#0A1629]">
                    {selectedPlacement.placementType} — Weekly Service Fee
                  </span>
                  <span className="text-base font-bold text-[#0A1629] tabular-nums">
                    &pound;{selectedPlacement.agreedClientWeeklyFee.toLocaleString()}.00 / week
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5549] leading-relaxed pt-1">
                  This client document reflects solely the weekly care service fee agreed between
                  the Client and Grace &amp; Goodwill.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setPreviewDocType(null)}
                  className="px-4 py-2 rounded-xl border border-[#E0D5C1] font-semibold text-[#0A1629] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotificationToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#060D1E] text-white p-4 rounded-2xl border border-[#D4AF7A] shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF7A]" />
          <div>
            <p className="font-semibold text-xs text-[#EBD8B2]">
              {toastSubtitle ? 'Profile Update Recorded' : 'Changes Live & Notifications Dispatched'}
            </p>
            <p className="text-[11px] text-slate-300">
              {toastSubtitle ||
                `Confirmation sent to ${clientDisplayName} and ${
                  selectedPlacement.id === 'pl-eleanor'
                    ? 'Sophie Williams'
                    : selectedPlacement.primaryCarer.fullName
                }.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
