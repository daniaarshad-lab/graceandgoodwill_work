import React, { useState } from 'react';
import {
  Bandage,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  FileText,
  Hand,
  Leaf,
  List,
  MoreHorizontal,
  MoreVertical,
  Pill,
  Plus,
  Save,
  Shield,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface AllergiesViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

interface AllergyItem {
  id: string;
  type: string;
  allergen: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'High';
  notes: string;
}

interface AllergyUpdateRow {
  id: string;
  date: string;
  time: string;
  updatedBy: string;
  change: string;
  status: 'Draft' | 'Live';
}

export const AllergiesView: React.FC<AllergiesViewProps> = ({ onBack, onNavigate }) => {
  const [allergies, setAllergies] = useState<AllergyItem[]>([
    {
      id: '1',
      type: 'Food allergy',
      allergen: 'Shellfish',
      reaction: 'Rash and swelling',
      severity: 'Moderate',
      notes: 'Avoid prawns and shellfish-based stocks.',
    },
    {
      id: '2',
      type: 'Medication allergy',
      allergen: 'Penicillin',
      reaction: 'Hives',
      severity: 'High',
      notes: 'Reported historic allergic reaction.',
    },
    {
      id: '3',
      type: 'Adhesive allergy',
      allergen: 'Medical adhesive',
      reaction: 'Skin irritation',
      severity: 'Mild',
      notes: 'Sensitive to strong dressings.',
    },
    {
      id: '4',
      type: 'Environmental allergy',
      allergen: 'Dust',
      reaction: 'Sneezing and watery eyes',
      severity: 'Mild',
      notes: 'Worse during cleaning.',
    },
  ]);

  const [recentUpdates, setRecentUpdates] = useState<AllergyUpdateRow[]>([
    {
      id: 'au-1',
      date: '12 Mar 2025',
      time: '14:32',
      updatedBy: 'Sarah Mitchell',
      change: 'Added dust allergy',
      status: 'Draft',
    },
    {
      id: 'au-2',
      date: '03 Mar 2025',
      time: '10:15',
      updatedBy: 'James Carter',
      change: 'Updated penicillin reaction',
      status: 'Live',
    },
    {
      id: 'au-3',
      date: '21 Feb 2025',
      time: '16:08',
      updatedBy: 'Sarah Mitchell',
      change: 'Added shellfish allergy',
      status: 'Live',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formState, setFormState] = useState<Omit<AllergyItem, 'id'>>({
    type: 'Medication allergy',
    allergen: '',
    reaction: '',
    severity: 'Moderate',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const openAddModalWithType = (typeLabel: string) => {
    setEditingId(null);
    setFormState({
      type: typeLabel === 'Other – please specify' ? 'Other allergy' : typeLabel,
      allergen: '',
      reaction: '',
      severity: 'Moderate',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (item: AllergyItem) => {
    setEditingId(item.id);
    setFormState({
      type: item.type,
      allergen: item.allergen,
      reaction: item.reaction,
      severity: item.severity,
      notes: item.notes,
    });
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleSaveAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.allergen.trim()) return;

    if (editingId) {
      setAllergies((prev) =>
        prev.map((a) => (a.id === editingId ? { ...formState, id: editingId } : a))
      );
      setRecentUpdates((prev) => [
        {
          id: `au-${Date.now()}`,
          date: '29 Oct 2026',
          time: '09:50',
          updatedBy: 'Jessica Smith',
          change: `Updated ${formState.allergen.toLowerCase()} allergy`,
          status: 'Draft',
        },
        ...prev,
      ]);
      showToast(`Updated ${formState.allergen} allergy record.`);
    } else {
      setAllergies((prev) => [...prev, { ...formState, id: `alg-${Date.now()}` }]);
      setRecentUpdates((prev) => [
        {
          id: `au-${Date.now()}`,
          date: '29 Oct 2026',
          time: '09:50',
          updatedBy: 'Jessica Smith',
          change: `Added ${formState.allergen.toLowerCase()} allergy`,
          status: 'Draft',
        },
        ...prev,
      ]);
      showToast(`Added ${formState.allergen} allergy to recorded allergies.`);
    }
    setModalOpen(false);
  };

  const renderAllergyTypeIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('food')) return <Utensils className="w-4 h-4 text-[#8C6D2B]" />;
    if (lower.includes('medication')) return <Pill className="w-4 h-4 text-[#8C6D2B]" />;
    if (lower.includes('latex')) return <Hand className="w-4 h-4 text-[#8C6D2B]" />;
    if (lower.includes('adhesive')) return <Bandage className="w-4 h-4 text-[#8C6D2B]" />;
    if (lower.includes('environmental')) return <Leaf className="w-4 h-4 text-[#8C6D2B]" />;
    return <MoreHorizontal className="w-4 h-4 text-[#8C6D2B]" />;
  };

  const allergyTypes = [
    { label: 'Medication allergy', icon: Pill },
    { label: 'Food allergy', icon: Utensils },
    { label: 'Latex allergy', icon: Hand },
    { label: 'Adhesive allergy', icon: Bandage },
    { label: 'Environmental allergy', icon: Leaf },
    { label: 'Other – please specify', icon: MoreHorizontal },
  ];

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
      {onNavigate && <ClientSectionNav currentView="allergies" onNavigate={onNavigate} />}

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
        <span className="font-semibold text-[#0A1629]">Allergies</span>
      </div>

      {/* Page Title */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Allergies
        </h1>
        <p className="text-sm text-[#5C5549] mt-1.5 leading-relaxed">
          Accurate allergy information is essential to help ensure the client&apos;s safety and
          wellbeing. Carers may rely on this information when providing support.
        </p>
      </div>

      {/* Recorded Allergies Table Card */}
      <div className="relative z-10 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#F2ECE0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629]">
              <Shield className="w-5 h-5 text-[#8C6D2B]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#0A1629]">
              Recorded allergies
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => openAddModalWithType('Food allergy')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Add allergy</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Allergy updates saved as draft.')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1629] hover:bg-[#132544] text-[#EBD8B2] text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRecentUpdates((prev) =>
                  prev.map((row) => ({ ...row, status: 'Live' }))
                );
                showToast('Allergy records confirmed and now Live across care profiles.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#C5A059] hover:brightness-105 text-[#0A1629] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.6} />
              <span>Confirm &amp; Submit Changes</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D4] text-[#0A1629] font-semibold">
                <th className="py-3 px-3.5 rounded-l-xl">Allergy type</th>
                <th className="py-3 px-3.5">Allergen</th>
                <th className="py-3 px-3.5">Reaction</th>
                <th className="py-3 px-3.5">Severity</th>
                <th className="py-3 px-3.5">Additional information / Notes</th>
                <th className="py-3 px-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0]">
              {allergies.map((allergy) => (
                <tr key={allergy.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-3.5">
                    <div className="inline-flex items-center gap-2 font-semibold text-[#0A1629]">
                      {renderAllergyTypeIcon(allergy.type)}
                      <span>{allergy.type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3.5 font-medium text-[#0A1629]">{allergy.allergen}</td>
                  <td className="py-3.5 px-3.5 text-[#334155]">{allergy.reaction}</td>
                  <td className="py-3.5 px-3.5">
                    <span
                      className={`font-semibold ${
                        allergy.severity === 'High'
                          ? 'text-rose-800'
                          : allergy.severity === 'Moderate'
                          ? 'text-amber-800'
                          : 'text-emerald-800'
                      }`}
                    >
                      {allergy.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-[#334155]">{allergy.notes}</td>
                  <td className="py-3.5 px-3.5 text-right relative">
                    <div className="inline-flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(allergy)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE3D4] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-[#8C6D2B]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === allergy.id ? null : allergy.id)
                        }
                        className="p-1.5 rounded-lg text-[#5C5549] hover:text-[#0A1629] hover:bg-[#FAF7F2] cursor-pointer"
                        aria-label={`More actions for ${allergy.allergen}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {openMenuId === allergy.id && (
                      <div className="absolute right-4 mt-1 w-32 bg-white rounded-xl border border-[#EAE3D4] shadow-lg py-1 z-20 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setAllergies((prev) => prev.filter((item) => item.id !== allergy.id));
                            setOpenMenuId(null);
                            showToast(`Removed ${allergy.allergen} allergy.`);
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

      {/* Bottom 2-Column Layout: Left = Allergy Types | Right Stacked = Care Notes + Recent Updates */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Allergy types */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
              <List className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Allergy types</h3>
              <p className="text-xs text-[#5C5549] mt-0.5">Select the type of allergy to add.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {allergyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => openAddModalWithType(type.label)}
                  className="p-3.5 rounded-2xl border border-[#EAE3D4] bg-[#FAF7F2] hover:bg-white hover:border-[#B88E3E] text-left text-xs font-semibold text-[#0A1629] flex items-center gap-3 transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-[#8C6D2B] shrink-0" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Stacked: Care notes + Recent updates */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          {/* Care notes */}
          <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#8C6D2B]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Care notes</h3>
            </div>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed">
              Allergy information helps carers make safer choices and plan appropriate care
              arrangements. It supports risk assessment, meal preparation, medication management and
              the use of suitable products and equipment. Please keep this information up to date
              and inform us immediately of any changes.
            </p>
          </div>

          {/* Recent updates */}
          <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#8C6D2B]" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Recent updates</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F2ECE0] bg-[#FAF7F2] text-[#0A1629] font-semibold">
                    <th className="py-2 px-2.5 rounded-l-lg">Date</th>
                    <th className="py-2 px-2.5">Time</th>
                    <th className="py-2 px-2.5">Updated by</th>
                    <th className="py-2 px-2.5">Change</th>
                    <th className="py-2 px-2.5 text-right rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE4]">
                  {recentUpdates.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2.5 px-2.5 text-[#334155] tabular-nums">{row.date}</td>
                      <td className="py-2.5 px-2.5 text-[#5C5549] font-mono text-[11px]">
                        {row.time}
                      </td>
                      <td className="py-2.5 px-2.5 font-medium text-[#0A1629]">{row.updatedBy}</td>
                      <td className="py-2.5 px-2.5 text-[#334155]">{row.change}</td>
                      <td className="py-2.5 px-2.5 text-right">
                        <span
                          className={`font-semibold ${
                            row.status === 'Live' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          &bull; {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Allergy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {editingId ? 'Edit Allergy Record' : 'Add Allergy'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAllergy} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Allergy Type</label>
                <select
                  value={formState.type}
                  onChange={(e) => setFormState((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                >
                  <option value="Medication allergy">Medication allergy</option>
                  <option value="Food allergy">Food allergy</option>
                  <option value="Latex allergy">Latex allergy</option>
                  <option value="Adhesive allergy">Adhesive allergy</option>
                  <option value="Environmental allergy">Environmental allergy</option>
                  <option value="Other allergy">Other allergy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Allergen</label>
                <input
                  type="text"
                  required
                  value={formState.allergen}
                  onChange={(e) => setFormState((prev) => ({ ...prev, allergen: e.target.value }))}
                  placeholder="e.g. Peanuts, Ibuprofen, Latex..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Reaction</label>
                  <input
                    type="text"
                    required
                    value={formState.reaction}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, reaction: e.target.value }))
                    }
                    placeholder="e.g. Hives, swelling"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A1629] mb-1">Severity</label>
                  <select
                    value={formState.severity}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        severity: e.target.value as AllergyItem['severity'],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629]"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">
                  Additional Information / Notes
                </label>
                <textarea
                  rows={3}
                  value={formState.notes}
                  onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Precautions or care guidance for carers..."
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
                  {editingId ? 'Save Changes' : 'Add Allergy'}
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
