import React from 'react';
import {
  Home,
  Users,
  User,
  FileText,
  CreditCard,
  MessageSquare,
  BookOpen,
  BarChart3,
  Calendar,
  Settings,
  Globe,
  X,
} from 'lucide-react';

export type AdminView =
  | 'dashboard'
  | 'carer-review'
  | 'active-placement'
  | 'health-conditions'
  | 'medication'
  | 'allergies'
  | 'declarations'
  | 'carer-accommodation'
  | 'expired-link';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  websiteHref?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onViewChange,
  isOpenOnMobile = false,
  onCloseMobile,
  websiteHref,
}) => {
  // Navigation strictly matching client mockup:
  // Icons: Home, Users, User, FileText, CreditCard (Placements), MessageSquare, BookOpen, BarChart3, Calendar, Settings
  const navItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: Home },
    { id: 'carer-review' as AdminView, label: 'Carers', icon: Users },
    { id: 'active-placement' as AdminView, label: 'Clients', icon: User },
    { id: 'declarations' as AdminView, label: 'Care Requests', icon: FileText },
    { id: 'carer-accommodation' as AdminView, label: 'Placements', icon: CreditCard },
    { id: 'dashboard' as AdminView, label: 'Messages', icon: MessageSquare },
    { id: 'health-conditions' as AdminView, label: 'Master Libraries', icon: BookOpen },
    { id: 'dashboard' as AdminView, label: 'Reports', icon: BarChart3 },
    { id: 'dashboard' as AdminView, label: 'Calendar', icon: Calendar },
    { id: 'dashboard' as AdminView, label: 'Settings', icon: Settings },
  ];

  const isItemActive = (label: string) => {
    if (label === 'Dashboard') return currentView === 'dashboard';
    if (label === 'Carers') return currentView === 'carer-review';
    if (label === 'Clients') return currentView === 'active-placement';
    if (label === 'Care Requests') return currentView === 'declarations';
    if (label === 'Placements') return currentView === 'carer-accommodation';
    if (label === 'Master Libraries') {
      return (
        currentView === 'health-conditions' ||
        currentView === 'medication' ||
        currentView === 'allergies'
      );
    }
    return false;
  };

  const sidebarContent = (
    <aside className="w-56 lg:w-[228px] xl:w-60 bg-[#060D1E] text-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto overflow-x-hidden select-none z-40 border-r border-[#D4AF7A]/15">
      {/* Top Section: Brand + Main Navigation */}
      <div className="shrink-0">
        {/* Top Brand Block (Bigger logo, NO line underneath) */}
        <div className="pt-5 pb-3 px-5 flex flex-col items-center text-center relative">
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => {
              onViewChange('dashboard');
              onCloseMobile?.();
            }}
            className="flex flex-col items-center group focus:outline-none cursor-pointer"
          >
            {/* Official Grace & Goodwill 3D Gold Knot Logo */}
            <div className="w-16 h-16 mb-2 transition-transform group-hover:scale-105">
              <img
                src="/assets/website_logo_dark_clean.png"
                alt="Grace & Goodwill Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_6px_14px_rgba(212,175,122,0.4)]"
              />
            </div>

            <span className="font-cinzel tracking-[0.22em] text-[#D4AF7A] text-[13px] font-semibold uppercase leading-tight">
              GRACE &amp; GOODWILL
            </span>
            <span className="text-[7.5px] tracking-[0.22em] uppercase text-[#D4AF7A]/80 font-medium mt-1">
              — CARE DEFINED BY INTEGRITY —
            </span>
          </button>
        </div>

        {/* Main Navigation List */}
        <div className="px-3 space-y-0.5 mt-0.5">
          {navItems.map((item) => {
            const active = isItemActive(item.label);
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onViewChange(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[13px] transition-all text-left cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#DFC289] to-[#CFA65B] text-[#0A1629] font-semibold shadow-sm'
                    : 'text-slate-300/80 hover:text-white hover:bg-white/[0.05] font-normal'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? 'text-[#0A1629]' : 'text-slate-300/70'
                  }`}
                  strokeWidth={active ? 2.3 : 1.8}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {websiteHref && (
            <div className="pt-2 mt-2 border-t border-[#D4AF7A]/15">
              <a
                href={websiteHref}
                className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[12.5px] text-[#D4AF7A] hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <Globe className="w-4 h-4 shrink-0 text-[#D4AF7A]" strokeWidth={1.8} />
                <span className="truncate">Main Website</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer: Large Grace & Goodwill 3D Gold Knot Logo anchored flush at the bottom end of the sidebar */}
      <div className="shrink-0 w-full mt-auto pt-3 pb-0 px-0 flex items-end justify-center overflow-hidden select-none pointer-events-none bg-[#060D1E]">
        <img
          src="/assets/website_logo_dark_clean.png"
          alt="Grace & Goodwill Emblem"
          className="w-[104%] max-w-none aspect-square object-contain block -mb-2 filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]"
        />
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 bg-[#060D1E]">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex z-50 bg-[#060D1E]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
