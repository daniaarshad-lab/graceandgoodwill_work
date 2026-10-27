"use client";

import React from 'react';
import {
  Pill,
  Plus,
  Save,
  CheckCircle2,
  Clock,
  Info,
  Check,
  X,
  Edit2,
  MoreVertical,
} from 'lucide-react';

interface MedicationViewProps {
  onBack: () => void;
}

export const MedicationView: React.FC<MedicationViewProps> = ({ onBack }) => {
  const medicationsList = [
    {
      name: 'Paracetamol',
      purpose: 'Pain relief',
      dose: '500mg',
      frequency: '4 times daily',
      time: '08:00 / 12:00 / 18:00 / 22:00',
      type: 'Tablet',
      support: 'Prompt / reminder',
      supportBadgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      notes: 'For arthritis pain.',
    },
    {
      name: 'Ramipril',
      purpose: 'Blood pressure',
      dose: '5mg',
      frequency: 'Once daily',
      time: '08:00',
      type: 'Capsule',
      support: 'Assistance required',
      supportBadgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
      notes: 'Taken with breakfast.',
    },
    {
      name: 'Vitamin D3',
      purpose: 'Bone health',
      dose: '1000 IU',
      frequency: 'Once daily',
      time: '09:00',
      type: 'Tablet',
      support: 'Independent',
      supportBadgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      notes: 'Family supplies weekly.',
    },
    {
      name: 'Laxido',
      purpose: 'Constipation relief',
      dose: '1 sachet',
      frequency: 'As directed',
      time: '20:00',
      type: 'Sachet',
      support: 'Managed by family',
      supportBadgeStyle: 'bg-sky-50 text-sky-800 border-sky-200',
      notes: 'Only if required.',
    },
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
        <span className="font-semibold text-[#0A1629]">Medication</span>
      </div>

      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#0A1629] tracking-tight">
            Medication
          </h1>
          <p className="text-sm text-[#7D7362] mt-1">
            Keep medication entries accurate and up to date to ensure safe, consistent and high-quality care.
          </p>
        </div>
      </div>

      {/* Client Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
            alt="Eleanor Thomas"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B88E3E]/40 shrink-0"
          />
          <div>
            <h2 className="text-2xl font-bold text-[#0A1629] tracking-tight">Eleanor Thomas</h2>
            <div className="flex items-center gap-2 text-xs text-[#7D7362] mt-0.5">
              <span>Age 82</span>
              <span>|</span>
              <span>Chelsea, London</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Live profile
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                Client updated
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Carer notified
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E0D5C1] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Add medication</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E0D5C1] bg-[#0A1629] text-[#EBD8B2] hover:bg-[#12244C] text-xs font-semibold transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
            <span>Save Draft</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF7A] to-[#C5A059] text-[#0A1629] text-xs font-bold hover:brightness-105 transition-all shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm &amp; Submit Changes</span>
          </button>
        </div>
      </div>

      {/* Main Medication Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F2ECE0] text-[#7D7362] text-[10.5px] uppercase font-semibold">
                <th className="pb-3">Medication</th>
                <th className="pb-3">Dose</th>
                <th className="pb-3">Frequency</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Type / Route</th>
                <th className="pb-3">Support required</th>
                <th className="pb-3">Notes</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE4]">
              {medicationsList.map((med, idx) => (
                <tr key={idx} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3">
                    <div className="font-semibold text-[#0A1629]">{med.name}</div>
                    <div className="text-[10.5px] text-[#A39886]">{med.purpose}</div>
                  </td>
                  <td className="py-3 text-[#7D7362]">{med.dose}</td>
                  <td className="py-3 text-[#7D7362]">{med.frequency}</td>
                  <td className="py-3 text-[#7D7362] font-mono">{med.time}</td>
                  <td className="py-3 text-[#7D7362]">{med.type}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${med.supportBadgeStyle}`}
                    >
                      {med.support}
                    </span>
                  </td>
                  <td className="py-3 text-[#7D7362]">{med.notes}</td>
                  <td className="py-3 text-right">
                    <button className="p-1 text-[#A39886] hover:text-[#0A1629]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3 Cards: Support Options Legend | Recent Medication Updates | About Records Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Options Legend */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#B88E3E]" />
              <h3 className="text-xs font-bold text-[#0A1629]">Support options</h3>
            </div>
            <button className="text-[11px] text-[#B88E3E] font-medium hover:underline flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <p className="text-[10.5px] text-[#7D7362]">Select the level of support required for each medication.</p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Independent:</span>
                <span className="text-[#7D7362] ml-1">Client can take independently.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Prompt / reminder:</span>
                <span className="text-[#7D7362] ml-1">Needs a prompt or reminder.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Assistance required:</span>
                <span className="text-[#7D7362] ml-1">Requires some assistance.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Administration required:</span>
                <span className="text-[#7D7362] ml-1">Carer to administer medication.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Managed by family:</span>
                <span className="text-[#7D7362] ml-1">Managed by family member.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Managed by healthcare professional:</span>
                <span className="text-[#7D7362] ml-1">Managed by nurse or GP.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-[#0A1629]">Not part of carer responsibilities:</span>
                <span className="text-[#7D7362] ml-1">Not part of carer role.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Medication Updates */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE0]">
            <Clock className="w-4 h-4 text-[#B88E3E]" />
            <h3 className="text-xs font-bold text-[#0A1629]">Recent medication updates</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F2ECE0] text-[#7D7362] text-[10px] uppercase font-semibold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Changed by</th>
                  <th className="pb-2 text-center">Client</th>
                  <th className="pb-2 text-center">Carer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE4]">
                <tr>
                  <td className="py-2 text-[#7D7362]">14 Apr 2025</td>
                  <td className="py-2 text-[#A39886] font-mono">10:24</td>
                  <td className="py-2 font-semibold text-[#0A1629]">Sarah M.</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#7D7362]">10 Apr 2025</td>
                  <td className="py-2 text-[#A39886] font-mono">15:12</td>
                  <td className="py-2 font-semibold text-[#0A1629]">James T.</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#7D7362]">02 Apr 2025</td>
                  <td className="py-2 text-[#A39886] font-mono">09:08</td>
                  <td className="py-2 font-semibold text-[#0A1629]">Dr. Patel</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                  <td className="py-2 text-center text-rose-500 font-bold">● No</td>
                </tr>
                <tr>
                  <td className="py-2 text-[#7D7362]">28 Mar 2025</td>
                  <td className="py-2 text-[#A39886] font-mono">16:45</td>
                  <td className="py-2 font-semibold text-[#0A1629]">Sarah M.</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                  <td className="py-2 text-center text-emerald-600 font-bold">● Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* About Medication Records Guidance */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8DEC9]">
            <Info className="w-4 h-4 text-[#B88E3E]" />
            <h3 className="text-xs font-bold text-[#0A1629]">About medication records</h3>
          </div>
          <p className="text-[11.5px] text-[#7D7362] leading-relaxed">
            You can search for a medication using the search box, which includes autocomplete suggestions, or add a medication manually if it is not listed.
          </p>
          <p className="text-[11.5px] text-[#7D7362] leading-relaxed pt-2">
            Please ensure all medication details, including dose, frequency, time and support requirements, are kept accurate and up to date. Any changes should be confirmed and submitted so the client and allocated carer are notified.
          </p>
          <div className="p-3 bg-white rounded-xl border border-[#E0D5C1] text-[11px] text-[#8C6D2B] font-medium flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#B88E3E] shrink-0 mt-0.5" />
            <span>Live-in carers do not undertake clinical treatments or tasks reserved for registered healthcare professionals.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
