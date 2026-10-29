import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  CloudRain,
  Droplets,
  Ear,
  Edit2,
  Eye,
  Heart,
  Home,
  MessageSquare,
  Move,
  Plus,
  Save,
  Search,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ClientHealthConditionsViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

interface SelectedConditionItem {
  id: string;
  name: string;
  notes: string;
  iconKey: 'brain' | 'bone' | 'walk' | 'fall' | 'ear' | 'heart';
}

interface ConditionUpdateRecord {
  id: string;
  dateTime: string;
  updatedBy: string;
  changes: string;
  status: 'Live' | 'Draft';
}

const MASTER_CONDITION_SUGGESTIONS = [
  { name: 'Dementia', iconKey: 'brain' as const },
  { name: "Parkinson's Disease", iconKey: 'walk' as const },
  { name: 'Multiple Sclerosis', iconKey: 'heart' as const },
  { name: 'Stroke', iconKey: 'brain' as const },
  { name: 'Acquired Brain Injury', iconKey: 'brain' as const },
  { name: 'Spinal Cord Injury', iconKey: 'bone' as const },
  { name: 'Diabetes', iconKey: 'heart' as const },
  { name: 'Epilepsy', iconKey: 'heart' as const },
  { name: 'Cancer', iconKey: 'heart' as const },
  { name: 'Visual Impairment', iconKey: 'ear' as const },
  { name: 'Anxiety', iconKey: 'heart' as const },
  { name: 'Depression', iconKey: 'heart' as const },
];

export const ClientHealthConditionsView: React.FC<ClientHealthConditionsViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const [selectedConditions, setSelectedConditions] = useState<SelectedConditionItem[]>([
    {
      id: 'c-stroke',
      name: 'Stroke',
      notes: 'Speech becomes more difficult when tired. Reduced use of right arm and right leg.',
      iconKey: 'brain',
    },
    {
      id: 'c-arthritis',
      name: 'Arthritis',
      notes: 'Pain worse in mornings and cold weather.',
      iconKey: 'bone',
    },
    {
      id: 'c-mobility',
      name: 'Reduced Mobility',
      notes: 'Needs assistance for longer distances.',
      iconKey: 'walk',
    },
    {
      id: 'c-falls',
      name: 'Falls',
      notes: '1 fall in the last 6 months, caution when transferring.',
      iconKey: 'fall',
    },
    {
      id: 'c-hearing',
      name: 'Hearing Impairment',
      notes: 'Wears bilateral hearing aids.',
      iconKey: 'ear',
    },
  ]);

  const [editingNotes, setEditingNotes] = useState(false);
  const [quickAddSearch, setQuickAddSearch] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [updateHistory, setUpdateHistory] = useState<ConditionUpdateRecord[]>([
    {
      id: 'uh-1',
      dateTime: '12 Jan 2025, 10:24',
      updatedBy: 'Sarah Mitchell',
      changes: 'Added Hearing Impairment',
      status: 'Live',
    },
    {
      id: 'uh-2',
      dateTime: '03 Dec 2024, 14:17',
      updatedBy: 'Sarah Mitchell',
      changes: 'Updated Falls (1 fall in last 6 months)',
      status: 'Live',
    },
    {
      id: 'uh-3',
      dateTime: '18 Oct 2024, 09:32',
      updatedBy: 'James Carter',
      changes: 'Added Reduced Mobility and Arthritis',
      status: 'Live',
    },
    {
      id: 'uh-4',
      dateTime: '02 Aug 2024, 16:11',
      updatedBy: 'Emily Ross',
      changes: 'Initial conditions record created (Stroke)',
      status: 'Draft',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const renderConditionIcon = (key: SelectedConditionItem['iconKey']) => {
    switch (key) {
      case 'brain':
        return <Brain className="w-4 h-4 text-[#0A1629]" />;
      case 'bone':
        return <Activity className="w-4 h-4 text-[#0A1629]" />;
      case 'walk':
        return <UserCheck className="w-4 h-4 text-[#0A1629]" />;
      case 'fall':
        return <AlertTriangle className="w-4 h-4 text-[#0A1629]" />;
      case 'ear':
        return <Ear className="w-4 h-4 text-[#0A1629]" />;
      default:
        return <Heart className="w-4 h-4 text-[#0A1629]" />;
    }
  };

  const renderLibraryIcon = (name: string) => {
    if (name.includes('Dementia') || name.includes('Stroke') || name.includes('Brain')) {
      return <Brain className="w-3.5 h-3.5 text-[#8C6D2B]" />;
    }
    if (name.includes('Diabetes')) {
      return <Droplets className="w-3.5 h-3.5 text-[#8C6D2B]" />;
    }
    if (name.includes('Visual')) {
      return <Eye className="w-3.5 h-3.5 text-[#8C6D2B]" />;
    }
    if (name.includes('Depression')) {
      return <CloudRain className="w-3.5 h-3.5 text-[#8C6D2B]" />;
    }
    if (name.includes('Anxiety') || name.includes('Sclerosis')) {
      return <Sparkles className="w-3.5 h-3.5 text-[#8C6D2B]" />;
    }
    return <Activity className="w-3.5 h-3.5 text-[#8C6D2B]" />;
  };

  const addCondition = (name: string, notes = 'Recorded on client profile — add care notes as needed.') => {
    const exists = selectedConditions.some(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      showToast(`${name} is already recorded for Eleanor Thomas.`);
      return;
    }
    const newItem: SelectedConditionItem = {
      id: `cond-${Date.now()}`,
      name: name.trim(),
      notes,
      iconKey: 'heart',
    };
    setSelectedConditions((prev) => [...prev, newItem]);
    setUpdateHistory((prev) => [
      {
        id: `uh-${Date.now()}`,
        dateTime: '29 Oct 2026, 09:15',
        updatedBy: 'Jessica Smith',
        changes: `Added ${name.trim()}`,
        status: 'Draft',
      },
      ...prev,
    ]);
    showToast(`Added "${name.trim()}" to selected conditions.`);
  };

  const removeCondition = (cond: SelectedConditionItem) => {
    setSelectedConditions((prev) => prev.filter((item) => item.id !== cond.id));
    setUpdateHistory((prev) => [
      {
        id: `uh-${Date.now()}`,
        dateTime: '29 Oct 2026, 09:15',
        updatedBy: 'Jessica Smith',
        changes: `Removed ${cond.name}`,
        status: 'Draft',
      },
      ...prev,
    ]);
    showToast(`Removed "${cond.name}" (saved in draft until confirmed).`);
  };

  const quickMatches = MASTER_CONDITION_SUGGESTIONS.filter(
    (item) =>
      quickAddSearch.trim().length > 0 &&
      item.name.toLowerCase().includes(quickAddSearch.trim().toLowerCase()) &&
      !selectedConditions.some((s) => s.name.toLowerCase() === item.name.toLowerCase())
  );

  const filteredMasterList = MASTER_CONDITION_SUGGESTIONS.filter((item) =>
    item.name.toLowerCase().includes(librarySearch.trim().toLowerCase())
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
      {onNavigate && (
        <ClientSectionNav currentView="client-health-conditions" onNavigate={onNavigate} />
      )}

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
        <span className="font-semibold text-[#0A1629]">Health Conditions</span>
      </div>

      {/* Page Heading */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Health Conditions
        </h1>
        <p className="text-sm text-[#5C5549] mt-1.5 leading-relaxed">
          Understand the client&apos;s current and historical health conditions. This information
          helps us create safe, personalised care and identify the right support.
        </p>
      </div>

      {/* CARD 1: SELECTED CONDITIONS */}
      <div className="relative z-10 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center text-[#0A1629] shrink-0">
              <Activity className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#0A1629]">
                Selected conditions
              </h2>
              <p className="text-xs text-[#5C5549] mt-0.5">
                These conditions are currently recorded for Eleanor. You can edit, add or remove
                conditions as needed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEditingNotes(!editingNotes)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>{editingNotes ? 'Done Editing' : 'Edit Conditions'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingNotes(false);
                showToast('Health conditions saved as draft.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1629] hover:bg-[#132544] text-[#EBD8B2] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingNotes(false);
                setUpdateHistory((prev) =>
                  prev.map((item) => ({ ...item, status: 'Live' }))
                );
                showToast('Health conditions confirmed and live across client & carer views.');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#C5A059] hover:brightness-105 text-[#0A1629] text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm &amp; Submit Changes</span>
            </button>
          </div>
        </div>

        {/* Search to Add Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A8175] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={quickAddSearch}
            onChange={(e) => setQuickAddSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && quickAddSearch.trim()) {
                e.preventDefault();
                addCondition(quickAddSearch.trim());
                setQuickAddSearch('');
              }
            }}
            placeholder="Search to add a health condition..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs sm:text-[13px] text-[#0A1629] placeholder-[#8A8175] outline-none"
          />

          {quickMatches.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-[#EAE3D4] rounded-xl shadow-lg py-1.5 z-20 max-h-48 overflow-y-auto">
              {quickMatches.map((match) => (
                <button
                  key={match.name}
                  type="button"
                  onClick={() => {
                    addCondition(match.name);
                    setQuickAddSearch('');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#0A1629] hover:bg-[#FAF7F2] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold">{match.name}</span>
                  <span className="text-[#8C6D2B] font-medium">+ Add condition</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5 Selected Condition Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {selectedConditions.map((cond) => (
            <div
              key={cond.id}
              className="rounded-2xl border border-[#EAE3D4] bg-[#FDFBF7] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="px-3.5 py-2.5 bg-[#F5EFE3] border-b border-[#EAE3D4] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#E9D7B2] flex items-center justify-center shrink-0">
                      {renderConditionIcon(cond.iconKey)}
                    </div>
                    <span className="font-serif text-[15px] font-semibold text-[#0A1629] truncate">
                      {cond.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCondition(cond)}
                    aria-label={`Remove ${cond.name}`}
                    className="text-[#7D7362] hover:text-rose-700 p-0.5 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 space-y-1">
                  <div className="text-[11px] font-semibold text-[#8C6D2B]">Notes</div>
                  {editingNotes ? (
                    <textarea
                      rows={3}
                      value={cond.notes}
                      onChange={(e) =>
                        setSelectedConditions((prev) =>
                          prev.map((item) =>
                            item.id === cond.id ? { ...item, notes: e.target.value } : item
                          )
                        )
                      }
                      className="w-full p-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] leading-relaxed focus:outline-none focus:border-[#B88E3E]"
                    />
                  ) : (
                    <p className="text-xs text-[#334155] leading-relaxed">{cond.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE ROW: Searchable Master Library | Related Care Implications */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Searchable Master Library */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                Searchable master library
              </h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Search and add additional health conditions from our comprehensive list.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A8175] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search conditions..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs text-[#0A1629] placeholder-[#8A8175] outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {filteredMasterList.map((cond) => {
              const alreadyAdded = selectedConditions.some(
                (item) => item.name.toLowerCase() === cond.name.toLowerCase()
              );
              return (
                <button
                  key={cond.name}
                  type="button"
                  onClick={() => addCondition(cond.name)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    alreadyAdded
                      ? 'bg-[#F5EBD6] border-[#D4AF7A] text-[#0A1629] font-semibold'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#0A1629] hover:bg-white hover:border-[#B88E3E]'
                  }`}
                >
                  {renderLibraryIcon(cond.name)}
                  <span>{cond.name}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-[#B88E3E] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Other &ndash; please specify</span>
            </button>
          </div>
        </div>

        {/* Right: Related Care Implications */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-[#8C6D2B]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                Related care implications
              </h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Key support considerations based on selected conditions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#F2ECE0] text-xs">
            {[
              {
                label: 'Communication',
                icon: MessageSquare,
                desc: 'Allow extra time for conversation, speak clearly and face Eleanor. Ensure hearing aids are in place and working.',
              },
              {
                label: 'Mobility',
                icon: UserCheck,
                desc: 'Support with longer distances, provide rest breaks and consider mobility aids as required.',
              },
              {
                label: 'Transfers',
                icon: Move,
                desc: 'Use safe moving and handling techniques. Take extra care when transferring due to fall risk and reduced mobility.',
              },
              {
                label: 'Appointments',
                icon: Calendar,
                desc: 'Support attendance at medical appointments and help with preparation, including transport and any communication needs.',
              },
              {
                label: 'Home Safety',
                icon: Home,
                desc: 'Maintain a clear, clutter-free environment, good lighting and consider additional safety measures to reduce the risk of falls.',
              },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  <div className="sm:col-span-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#8C6D2B] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[#0A1629]">{row.label}</span>
                  </div>
                  <p className="sm:col-span-8 text-[#475569] leading-relaxed">{row.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: Update History */}
      <div className="relative z-10 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F5EBD6] border border-[#E2D3B3] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-[#8C6D2B]" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Update history</h3>
            <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
              Track changes to Eleanor&apos;s health conditions record.
            </p>
          </div>
        </div>

        <div className="lg:col-span-9 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F2ECE0] text-[#5C5549] font-semibold">
                <th className="pb-2.5 pr-4">Date &amp; Time</th>
                <th className="pb-2.5 pr-4">Updated By</th>
                <th className="pb-2.5 pr-4">Changes</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE4]">
              {updateHistory.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-2.5 pr-4 text-[#334155] tabular-nums">{row.dateTime}</td>
                  <td className="py-2.5 pr-4 font-medium text-[#0A1629]">{row.updatedBy}</td>
                  <td className="py-2.5 pr-4 text-[#334155]">{row.changes}</td>
                  <td className="py-2.5 text-right">
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

      {/* Add Custom Condition Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE3D4] max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#0A1629] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">Specify Health Condition</h3>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">Condition Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Osteoporosis"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629] outline-none focus:border-[#B88E3E]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0A1629] mb-1">
                  Care Notes &amp; Support Considerations
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Describe symptoms, triggers or daily support notes..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] text-[#0A1629] outline-none focus:border-[#B88E3E]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE3D4] font-semibold text-[#5C5549] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!customName.trim()) return;
                    addCondition(
                      customName.trim(),
                      customNotes.trim() || 'Recorded custom condition — monitor as advised.'
                    );
                    setCustomName('');
                    setCustomNotes('');
                    setCustomModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0A1629] text-[#EBD8B2] font-semibold cursor-pointer"
                >
                  Add Condition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#060D1E] text-white px-4 py-3 rounded-2xl border border-[#D4AF7A] shadow-xl flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="text-[#EBD8B2] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
