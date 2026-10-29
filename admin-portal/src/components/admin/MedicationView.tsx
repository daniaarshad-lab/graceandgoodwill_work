import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  MapPin,
  MoreHorizontal,
  Pill,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { DEFAULT_ELEANOR_THOMAS_AVATAR } from '../../data/clientProfileImages';
import { usePlatformStore } from '../../data/platformStore';
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface MedicationViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

interface MedicationRecord {
  id: string;
  name: string;
  purpose: string;
  dose: string;
  frequency: string;
  time: string;
  type: 'Tablet' | 'Capsule' | 'Softgel' | 'Sachet' | 'Liquid' | 'Drops';
  support: string;
  notes: string;
}

interface MedicationUpdateLog {
  id: string;
  date: string;
  time: string;
  changedBy: string;
  clientNotified: boolean;
  carerNotified: boolean;
}

const AUTOCOMPLETE_MEDICATIONS = [
  { name: 'Paracetamol', purpose: 'Pain relief', defaultDose: '500mg', defaultType: 'Tablet' as const },
  { name: 'Ramipril', purpose: 'Blood pressure', defaultDose: '5mg', defaultType: 'Capsule' as const },
  { name: 'Vitamin D3', purpose: 'Bone health', defaultDose: '1000 IU', defaultType: 'Softgel' as const },
  { name: 'Laxido', purpose: 'Constipation relief', defaultDose: '1 sachet', defaultType: 'Sachet' as const },
  { name: 'Amlodipine', purpose: 'Blood pressure', defaultDose: '5mg', defaultType: 'Tablet' as const },
  { name: 'Metformin', purpose: 'Type 2 diabetes', defaultDose: '500mg', defaultType: 'Tablet' as const },
  { name: 'Omeprazole', purpose: 'Acid reflux', defaultDose: '20mg', defaultType: 'Capsule' as const },
  { name: 'Furosemide', purpose: 'Fluid retention', defaultDose: '40mg', defaultType: 'Tablet' as const },
  { name: 'Atorvastatin', purpose: 'Cholesterol', defaultDose: '20mg', defaultType: 'Tablet' as const },
  { name: 'Apixaban', purpose: 'Anticoagulant', defaultDose: '2.5mg', defaultType: 'Tablet' as const },
];

export const MedicationView: React.FC<MedicationViewProps> = ({ onBack, onNavigate }) => {
  const { clientAvatars } = usePlatformStore();
  const avatarUrl = clientAvatars['eleanor-thomas'] || DEFAULT_ELEANOR_THOMAS_AVATAR;

  const [medications, setMedications] = useState<MedicationRecord[]>([
    {
      id: 'm1',
      name: 'Paracetamol',
      purpose: 'Pain relief',
      dose: '500mg',
      frequency: '4 times daily',
      time: '08:00 / 12:00 / 18:00 / 22:00',
      type: 'Tablet',
      support: 'Prompt / reminder',
      notes: 'For arthritis pain.',
    },
    {
      id: 'm2',
      name: 'Ramipril',
      purpose: 'Blood pressure',
      dose: '5mg',
      frequency: 'Once daily',
      time: '08:00',
      type: 'Capsule',
      support: 'Assistance required',
      notes: 'Taken with breakfast.',
    },
    {
      id: 'm3',
      name: 'Vitamin D3',
      purpose: 'Bone health',
      dose: '1000 IU',
      frequency: 'Once daily',
      time: '09:00',
      type: 'Softgel',
      support: 'Independent',
      notes: 'Family supplies weekly.',
    },
    {
      id: 'm4',
      name: 'Laxido',
      purpose: 'Constipation relief',
      dose: '1 sachet',
      frequency: 'As directed',
      time: '20:00',
      type: 'Sachet',
      support: 'Managed by family',
      notes: 'Only if required.',
    },
  ]);

  const [supportOptions, setSupportOptions] = useState([
    {
      id: 's1',
      label: 'Independent',
      dotColor: 'bg-emerald-600',
      textColor: 'text-emerald-800',
      desc: 'Client can take independently.',
    },
    {
      id: 's2',
      label: 'Prompt / reminder',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-800',
      desc: 'Needs a prompt or reminder.',
    },
    {
      id: 's3',
      label: 'Assistance required',
      dotColor: 'bg-rose-500',
      textColor: 'text-rose-800',
      desc: 'Requires some assistance.',
    },
    {
      id: 's4',
      label: 'Administration required',
      dotColor: 'bg-red-600',
      textColor: 'text-red-800',
      desc: 'Carer to administer medication.',
    },
    {
      id: 's5',
      label: 'Managed by family',
      dotColor: 'bg-sky-600',
      textColor: 'text-sky-800',
      desc: 'Managed by family member.',
    },
    {
      id: 's6',
      label: 'Managed by healthcare professional',
      dotColor: 'bg-purple-600',
      textColor: 'text-purple-800',
      desc: 'Managed by nurse or GP.',
    },
    {
      id: 's7',
      label: 'Not part of carer responsibilities',
      dotColor: 'bg-slate-500',
      textColor: 'text-slate-700',
      desc: 'Not part of carer role.',
    },
    {
      id: 's8',
      label: 'Other',
      dotColor: 'bg-[#B88E3E]',
      textColor: 'text-[#8C6D2B]',
      desc: 'Specify in notes.',
    },
  ]);

  const [editingSupportLegend, setEditingSupportLegend] = useState(false);

  const [updatesLog, setUpdatesLog] = useState<MedicationUpdateLog[]>([
    { id: 'u1', date: '14 Apr 2025', time: '10:24', changedBy: 'Sarah M.', clientNotified: true, carerNotified: true },
    { id: 'u2', date: '10 Apr 2025', time: '15:12', changedBy: 'James T.', clientNotified: true, carerNotified: true },
    { id: 'u3', date: '02 Apr 2025', time: '09:08', changedBy: 'Dr. Patel', clientNotified: true, carerNotified: false },
    { id: 'u4', date: '28 Mar 2025', time: '16:45', changedBy: 'Sarah M.', clientNotified: true, carerNotified: true },
    { id: 'u5', date: '15 Mar 2025', time: '11:30', changedBy: 'Emma L.', clientNotified: false, carerNotified: true },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formState, setFormState] = useState<Omit<MedicationRecord, 'id'>>({
    name: '',
    purpose: '',
    dose: '',
    frequency: 'Once daily',
    time: '08:00',
    type: 'Tablet',
    support: 'Prompt / reminder',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const openAddModal = () => {
    setEditingMedId(null);
    setMedSearchQuery('');
    setFormState({
      name: '',
      purpose: '',
      dose: '',
      frequency: 'Once daily',
      time: '08:00',
      type: 'Tablet',
      support: 'Prompt / reminder',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (med: MedicationRecord) => {
    setEditingMedId(med.id);
    setMedSearchQuery(med.name);
    setFormState({
      name: med.name,
      purpose: med.purpose,
      dose: med.dose,
      frequency: med.frequency,
      time: med.time,
      type: med.type,
      support: med.support,
      notes: med.notes,
    });
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    if (editingMedId) {
      setMedications((prev) =>
        prev.map((m) => (m.id === editingMedId ? { ...formState, id: editingMedId } : m))
      );
      showToast(`Updated ${formState.name} in medication schedule.`);
    } else {
      setMedications((prev) => [
        ...prev,
        {
          ...formState,
          id: `med-${Date.now()}`,
          purpose: formState.purpose.trim() || 'Recorded medication',
        },
      ]);
      showToast(`Added ${formState.name} to medication schedule.`);
    }
    setModalOpen(false);
  };

  const renderMedFormVisual = (type: MedicationRecord['type']) => {
    if (type === 'Capsule') {
      return (
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center shrink-0">
          <span className="w-5 h-2.5 rounded-full bg-gradient-to-r from-[#C87D6A] via-[#C87D6A] to-[#F1D5C9] -rotate-35 block border border-[#B56A57]/40" />
        </div>
      );
    }
    if (type === 'Softgel') {
      return (
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center shrink-0">
          <span className="w-4 h-3 rounded-full bg-gradient-to-tr from-[#C8962E] to-[#F3D27A] -rotate-25 block shadow-inner" />
        </div>
      );
    }
    if (type === 'Sachet') {
      return (
        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center shrink-0">
          <span className="w-4 h-4 rounded-sm bg-white border border-[#CBD5E1] shadow-sm block" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center shrink-0">
        <span className="w-4 h-3 rounded-full bg-gradient-to-b from-white to-[#E2E8F0] border border-[#CBD5E1] block" />
      </div>
    );
  };

  const getSupportTextStyle = (support: string) => {
    const matched = supportOptions.find(
      (opt) => opt.label.toLowerCase() === support.toLowerCase()
    );
    return matched ? matched.textColor : 'text-[#0A1629]';
  };

  const filteredAutocomplete = AUTOCOMPLETE_MEDICATIONS.filter(
    (item) =>
      medSearchQuery.trim().length > 0 &&
      item.name.toLowerCase().includes(medSearchQuery.trim().toLowerCase()) &&
      item.name.toLowerCase() !== formState.name.toLowerCase()
  );

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
      {onNavigate && <ClientSectionNav currentView="medication" onNavigate={onNavigate} />}

      {/* Breadcrumbs */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-[#7D7362]">
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
        <span className="font-semibold text-[#0A1629]">Medication</span>
      </div>

      {/* Page Title */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Medication
        </h1>
        <p className="text-sm text-[#5C5549] mt-1.5 leading-relaxed">
          Keep medication entries accurate and up to date to ensure safe, consistent and
          high-quality care.
        </p>
      </div>

      {/* Client Profile & Main Medication Table Container */}
      <div className="relative z-10 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#F2ECE0]">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="Eleanor Thomas"
              className="w-20 h-20 rounded-2xl object-cover border border-[#EAE3D4] shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0A1629]">
                  Eleanor Thomas
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Live profile
                  </span>
                  <span className="text-[#D5CBB8]" aria-hidden="true">
                    &middot;
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-sky-800">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    Client updated
                  </span>
                  <span className="text-[#D5CBB8]" aria-hidden="true">
                    &middot;
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Carer notified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#334155] mt-1.5">
                <span>Age 82</span>
                <span className="text-[#D5CBB8]" aria-hidden="true">
                  |
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>Chelsea, London</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Add medication</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Medication entries saved as draft.')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A1629] hover:bg-[#132544] text-[#EBD8B2] text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUpdatesLog((prev) => [
                  {
                    id: `u-${Date.now()}`,
                    date: '29 Oct 2026',
                    time: '09:45',
                    changedBy: 'Jessica S.',
                    clientNotified: true,
                    carerNotified: true,
                  },
                  ...prev,
                ]);
                showToast(
                  'Medication schedule confirmed & submitted. Client and allocated carer notified.'
                );
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#C5A059] hover:brightness-105 text-[#0A1629] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.6} />
              <span>Confirm &amp; Submit Changes</span>
            </button>
          </div>
        </div>

        {/* Medication Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-[#F2ECE0] bg-[#FAF7F2] text-[#0A1629] font-semibold">
                <th className="py-3 px-3 rounded-l-xl">Medication</th>
                <th className="py-3 px-3">Dose</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Type / Route</th>
                <th className="py-3 px-3">Support required</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0]">
              {medications.map((med) => (
                <tr key={med.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      {renderMedFormVisual(med.type)}
                      <div>
                        <div className="font-serif text-base font-semibold text-[#0A1629]">
                          {med.name}
                        </div>
                        <div className="text-[11px] text-[#7D7362]">{med.purpose}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#0A1629] tabular-nums">
                    {med.dose}
                  </td>
                  <td className="py-3.5 px-3 text-[#334155]">{med.frequency}</td>
                  <td className="py-3.5 px-3 text-[#334155] font-mono text-[11.5px] max-w-[140px]">
                    {med.time}
                  </td>
                  <td className="py-3.5 px-3 text-[#334155]">
                    {med.type === 'Softgel' ? 'Tablet' : med.type}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`font-semibold ${getSupportTextStyle(med.support)}`}>
                      {med.support}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#334155]">{med.notes}</td>
                  <td className="py-3.5 px-3 text-right relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === med.id ? null : med.id)
                      }
                      className="p-1.5 rounded-lg text-[#5C5549] hover:text-[#0A1629] hover:bg-[#FAF7F2] cursor-pointer"
                      aria-label={`Actions for ${med.name}`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {openMenuId === med.id && (
                      <div className="absolute right-3 mt-1 w-36 bg-white rounded-xl border border-[#EAE3D4] shadow-lg py-1 z-20 text-left">
                        <button
                          type="button"
                          onClick={() => openEditModal(med)}
                          className="w-full px-3 py-1.5 text-xs text-[#0A1629] hover:bg-[#FAF7F2] flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#B88E3E]" />
                          <span>Edit entry</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMedications((prev) => prev.filter((item) => item.id !== med.id));
                            setOpenMenuId(null);
                            showToast(`Removed ${med.name} from medication list.`);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Bottom 3 Cards: Support options | Recent medication updates | About medication records */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. Support options */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
                <Pill className="w-4 h-4 text-[#8C6D2B]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Support options</h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingSupportLegend(!editingSupportLegend)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#0A1629] underline hover:text-[#8C6D2B] cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingSupportLegend ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <p className="text-xs text-[#5C5549]">
            Select the level of support required for each medication.
          </p>

          <div className="space-y-2.5 text-xs">
            {supportOptions.map((opt) => (
              <div key={opt.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                  <span className={`font-semibold ${opt.textColor}`}>{opt.label}</span>
                </div>
                <div className="col-span-6 text-[#475569]">
                  {editingSupportLegend ? (
                    <input
                      type="text"
                      value={opt.desc}
                      onChange={(e) =>
                        setSupportOptions((prev) =>
                          prev.map((item) =>
                            item.id === opt.id ? { ...item, desc: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-2 py-1 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629]"
                    />
                  ) : (
                    opt.desc
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Recent medication updates */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F2ECE0]">
            <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
              <Clock className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
              Recent medication updates
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F2ECE0] text-[#0A1629] font-semibold">
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">Time</th>
                  <th className="pb-2.5">Changed by</th>
                  <th className="pb-2.5 text-center leading-tight">
                    Client
                    <br />
                    notified
                  </th>
                  <th className="pb-2.5 text-center leading-tight">
                    Carer
                    <br />
                    notified
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE4]">
                {updatesLog.slice(0, 5).map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 text-[#334155] tabular-nums">{log.date}</td>
                    <td className="py-2.5 text-[#5C5549] font-mono text-[11px]">{log.time}</td>
                    <td className="py-2.5 font-medium text-[#0A1629]">{log.changedBy}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`font-semibold ${
                          log.clientNotified ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        &bull; {log.clientNotified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`font-semibold ${
                          log.carerNotified ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        &bull; {log.carerNotified ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. About medication records */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#F2ECE0]">
            <div className="w-8 h-8 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
              <BookOpen className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
              About medication records
            </h3>
          </div>

          <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed">
            You can search for a medication using the search box, which includes autocomplete
            suggestions, or add a medication manually if it is not listed.
          </p>

          <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed pt-2 border-t border-[#F2ECE0]">
            Please ensure all medication details, including dose, frequency, time and support
            requirements, are kept accurate and up to date. Any changes should be confirmed and
            submitted so the client and allocated carer are notified.
          </p>
        </div>
      </div>

      {/* Add / Edit Medication Modal with Autocomplete */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {editingMedId ? 'Edit Medication Entry' : 'Add Medication'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedication} className="p-6 space-y-4 text-xs">
              <div className="relative">
                <label className="block font-semibold text-[#0A1629] mb-1">
                  Search or Enter Medication Name
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8A8175] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => {
                      setFormState((prev) => ({ ...prev, name: e.target.value }));
                      setMedSearchQuery(e.target.value);
                    }}
                    placeholder="Type medication name (e.g. Amlodipine)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629] outline-none focus:border-[#B88E3E]"
                  />
                </div>
                {filteredAutocomplete.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-[#EAE3D4] rounded-xl shadow-lg py-1 z-20 max-h-36 overflow-y-auto">
                    {filteredAutocomplete.map((sug) => (
                      <button
                        key={sug.name}
                        type="button"
                        onClick={() => {
                          setFormState((prev) => ({
                            ...prev,
                            name: sug.name,
                            purpose: sug.purpose,
                            dose: sug.defaultDose,
                            type: sug.defaultType,
                          }));
                          setMedSearchQuery('');
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-[#0A1629]">{sug.name}</span>
                        <span className="text-[11px] text-[#7D7362]">
                          {sug.purpose} &bull; {sug.defaultDose}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">
                    Purpose / Indication
                  </label>
                  <input
                    type="text"
                    value={formState.purpose}
                    onChange={(e) => setFormState((prev) => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g. Blood pressure"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Dose</label>
                  <input
                    type="text"
                    required
                    value={formState.dose}
                    onChange={(e) => setFormState((prev) => ({ ...prev, dose: e.target.value }))}
                    placeholder="e.g. 5mg"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Frequency</label>
                  <input
                    type="text"
                    required
                    value={formState.frequency}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, frequency: e.target.value }))
                    }
                    placeholder="e.g. Once daily"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Time(s)</label>
                  <input
                    type="text"
                    required
                    value={formState.time}
                    onChange={(e) => setFormState((prev) => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g. 08:00"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Type / Route</label>
                  <select
                    value={formState.type}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        type: e.target.value as MedicationRecord['type'],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Softgel">Softgel</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Drops">Drops</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">
                    Support Required
                  </label>
                  <select
                    value={formState.support}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, support: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  >
                    {supportOptions.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Notes</label>
                <input
                  type="text"
                  value={formState.notes}
                  onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Taken with breakfast."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE3D4] font-semibold text-[#5C5549] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A1629] text-[#EBD8B2] font-semibold cursor-pointer"
                >
                  {editingMedId ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
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
