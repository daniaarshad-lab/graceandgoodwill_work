"use client";

import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Shield, ShieldCheck, Check, Menu } from 'lucide-react';
import { useOptionalPlatformStore } from '@/data/care-platform/platformStore';

interface AdminHeaderProps {
  onSearch?: (query: string) => void;
  onOpenMobileMenu?: () => void;
  searchPlaceholder?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onSearch,
  onOpenMobileMenu,
  searchPlaceholder = 'Search carers, clients, placements...',
}) => {
  const store = useOptionalPlatformStore();
  const adminRole = store?.adminRole ?? 'admin';
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isSuperAdmin = adminRole === 'super_admin';

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-transparent flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Mobile Hamburger Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl bg-white/80 border border-[#EAE2D2] text-[#0A1629] hover:bg-[#F6F1E7] transition-colors focus:outline-none shrink-0"
        >
          <Menu className="w-5 h-5 text-[#0A1629]" />
        </button>
      </div>

      {/* Right Controls: Search pill + Bell with 3 + Divider + Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Search Input Pill */}
        <div className="relative w-56 sm:w-72 md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71685A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3.5 py-1.5 bg-white/85 hover:bg-white focus:bg-white text-xs sm:text-[13px] text-[#1E293B] placeholder-[#8A8175] rounded-full border border-[#DFD5C2] focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Notifications Icon with Badge 3 */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="w-9 h-9 rounded-full hover:bg-black/5 text-[#0A1629] flex items-center justify-center relative transition-colors focus:outline-none cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#0A1629]" />
            <span className="absolute 0.5 top-1 right-1 w-3.5 h-3.5 bg-[#C5A059] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#EAE2D2] p-4 text-xs z-50">
              <div className="font-semibold text-sm text-[#0A1629] mb-3 pb-2 border-b border-slate-100 flex justify-between items-center">
                <span>Recent Notifications</span>
                <span className="text-[11px] text-[#C5A059] font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">New care request received</p>
                    <p className="text-slate-500 text-[11px]">Margaret Lewis - Live-in care (Chester)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Carer profile updated</p>
                    <p className="text-slate-500 text-[11px]">Sophie Williams</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Placement confirmation required</p>
                    <p className="text-slate-500 text-[11px]">David Thompson</p>
                  </div>
                </div>
                <a
                  href="/admin"
                  className="w-full text-left px-3.5 py-1.5 text-slate-700 hover:bg-[#F6F1E7] flex items-center gap-2 border-t border-slate-100 mt-1 pt-2"
                >
                  <span>&larr; Classic Admin Console</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-[#D6CCA8]/60 shrink-0" />

        {/* Admin Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-black/5 transition-colors focus:outline-none group cursor-pointer"
          >
            {/* Camel/Gold Initials Circle */}
            <div className="w-8 h-8 rounded-full bg-[#C8A86B] text-[#0A1629] font-semibold text-xs flex items-center justify-center shadow-sm shrink-0">
              JS
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#0A1629] leading-tight">
                Jessica Smith
              </div>
              <div className="text-[11px] text-[#786F62] font-normal leading-tight">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#786F62] group-hover:text-[#0A1629] transition-transform duration-200" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EAE2D2] py-1.5 text-xs z-50">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">Jessica Smith</p>
                <p className="text-slate-500 text-[10px]">admin@graceandgoodwill.co.uk</p>
              </div>
              <div className="py-1">
                <div className="px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Access Level
                </div>
                <button
                  onClick={() => {
                    store?.setAdminRole('admin');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-slate-700 hover:bg-[#F6F1E7] flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Regular Admin</span>
                  </span>
                  {!isSuperAdmin && <Check className="w-3.5 h-3.5 text-[#0A1629]" />}
                </button>
                <button
                  onClick={() => {
                    store?.setAdminRole('super_admin');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-slate-700 hover:bg-[#F6F1E7] flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A1629]" />
                    <span>Super Admin</span>
                  </span>
                  {isSuperAdmin && <Check className="w-3.5 h-3.5 text-[#0A1629]" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
