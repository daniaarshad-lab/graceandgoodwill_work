import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Save,
  CheckCircle2,
  Clock,
  Edit2,
  MoreVertical,
  Utensils,
  Pill,
  Sparkles,
  TreeDeciduous,
  FileText,
} from 'lucide-react';

interface AllergiesViewProps {
  onBack: () => void;
}

export const AllergiesView: React.FC<AllergiesViewProps> = ({ onBack }) => {
  const [allergies, setAllergies] = useState([
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

  const allergyTypes = [
    { label: 'Medication allergy', icon: Pill },
    { label: 'Food allergy', icon: Utensils },
    { label: 'Latex allergy', icon: Sparkles },
    { label: 'Adhesive allergy', icon: FileText },
    { label: 'Environmental allergy', icon: TreeDeciduous },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#7D7362]">
        <button onClick={onBack} className="hover:text-[#0A1629] transition-colors">
          Clients
        </button>
        <span>&gt;</span>
        <span>Eleanor Thomas</span>
        <span>&gt;</span>
        <span className="font-semibold text-[#0A1629]">Allergies</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#0A1629] tracking-tight">
          Allergies
        </h1>
        <p className="text-sm text-[#7D7362] mt-1">
          Accurate allergy information is essential to help ensure the client&apos;s safety and wellbeing. Carers may rely on this information when providing support.
        </p>
      </div>

      {/* Recorded Allergies Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#B88E3E]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#0A1629]">Recorded allergies</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors shadow-2xs">
              <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Add allergy</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E0D5C1] bg-[#0A1629] text-[#EBD8B2] hover:bg-[#12244C] text-xs font-semibold transition-colors shadow-2xs">
              <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
              <span>Save Draft</span>
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#C5A059] text-[#0A1629] text-xs font-bold hover:brightness-105 transition-all shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm &amp; Submit Changes</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F2ECE0] text-[#7D7362] text-[10.5px] uppercase font-semibold">
                <th className="pb-3">Allergy type</th>
                <th className="pb-3">Allergen</th>
                <th className="pb-3">Reaction</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Additional information / Notes</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE4]">
              {allergies.map((allergy) => (
                <tr key={allergy.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 font-semibold text-[#0A1629]">{allergy.type}</td>
                  <td className="py-3 text-[#0A1629]">{allergy.allergen}</td>
                  <td className="py-3 text-[#7D7362]">{allergy.reaction}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        allergy.severity === 'High'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : allergy.severity === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {allergy.severity}
                    </span>
                  </td>
                  <td className="py-3 text-[#7D7362]">{allergy.notes}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[11px] text-[#B88E3E] hover:underline flex items-center gap-1 font-medium">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button className="p-1 text-[#A39886] hover:text-[#0A1629]">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3 Cards: Allergy Types | Care Notes | Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allergy Types Chips */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE0]">
            <ShieldAlert className="w-4 h-4 text-[#B88E3E]" />
            <h3 className="text-xs font-bold text-[#0A1629]">Allergy types</h3>
          </div>
          <p className="text-[10.5px] text-[#7D7362]">Select the type of allergy to add.</p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {allergyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.label}
                  className="p-2.5 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] hover:bg-white hover:border-[#B88E3E] text-left text-xs font-semibold text-[#0A1629] flex items-center gap-2 transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span className="truncate">{type.label}</span>
                </button>
              );
            })}
            <button className="p-2.5 rounded-xl border border-dashed border-[#B88E3E] text-[#B88E3E] hover:bg-[#FAF7F2] text-left text-xs font-medium flex items-center gap-1.5 transition-all">
              <Plus className="w-3.5 h-3.5" /> Other – please specify
            </button>
          </div>
        </div>

        {/* Care Notes */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE0]">
            <FileText className="w-4 h-4 text-[#B88E3E]" />
            <h3 className="text-xs font-bold text-[#0A1629]">Care notes</h3>
          </div>
          <p className="text-[11.5px] text-[#7D7362] leading-relaxed">
            Allergy information helps carers make safer choices and plan appropriate care arrangements. It supports risk assessment, meal preparation, medication management and the use of suitable products and equipment. Please keep this information up to date and inform us immediately of any changes.
          </p>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE0]">
            <Clock className="w-4 h-4 text-[#B88E3E]" />
            <h3 className="text-xs font-bold text-[#0A1629]">Recent updates</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[#F5EFE4]">
              <div>
                <span className="text-[10px] text-[#A39886] block">12 Mar 2025, 14:32</span>
                <span className="font-semibold text-[#0A1629]">Sarah Mitchell</span>
                <span className="text-[11px] text-[#7D7362] block">Added dust allergy</span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Draft
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F5EFE4]">
              <div>
                <span className="text-[10px] text-[#A39886] block">03 Mar 2025, 10:15</span>
                <span className="font-semibold text-[#0A1629]">James Carter</span>
                <span className="text-[11px] text-[#7D7362] block">Updated penicillin reaction</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-[10px] text-[#A39886] block">21 Feb 2025, 16:08</span>
                <span className="font-semibold text-[#0A1629]">Sarah Mitchell</span>
                <span className="text-[11px] text-[#7D7362] block">Added shellfish allergy</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
