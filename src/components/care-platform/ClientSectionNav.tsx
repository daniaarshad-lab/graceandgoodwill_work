"use client";

import React from 'react';
import {
  User,
  BedDouble,
  BookOpen,
  HeartPulse,
  Pill,
  ShieldAlert,
  FileCheck2,
  ClipboardCheck,
  Home,
} from 'lucide-react';
import { AdminView } from './AdminSidebar';

interface ClientSectionNavProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
}

export const ClientSectionNav: React.FC<ClientSectionNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const sections: {
    id: AdminView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'active-placement', label: 'Active Placement', icon: Home },
    { id: 'client-portal-profile', label: 'Client Profile & Photo', icon: User },
    { id: 'client-carer-accommodation', label: 'Carer Accommodation', icon: BedDouble },
    { id: 'client-biography', label: 'Biography', icon: BookOpen },
    { id: 'client-health-conditions', label: 'Health Conditions', icon: HeartPulse },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'allergies', label: 'Allergies', icon: ShieldAlert },
    { id: 'client-declaration-portal', label: 'Client Declaration', icon: FileCheck2 },
    { id: 'client-declarations', label: 'Admin Declarations', icon: ClipboardCheck },
  ];

  return (
    <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto bg-white/90 border border-[#EAE3D4] rounded-2xl p-1.5 shadow-sm">
      {sections.map((sec) => {
        const Icon = sec.icon;
        const active = currentView === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => onNavigate(sec.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              active
                ? 'bg-[#0A1629] text-[#EBD8B2] shadow-sm'
                : 'text-[#5C5549] hover:text-[#0A1629] hover:bg-[#FAF7F2]'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 shrink-0 ${
                active ? 'text-[#D4AF7A]' : 'text-[#B88E3E]'
              }`}
            />
            <span>{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
};
