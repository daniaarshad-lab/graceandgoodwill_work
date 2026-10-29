"use client";

import React from 'react';
import {
  Users,
  User,
  FileText,
  FilePlus,
  Home,
  ChevronRight,
  TrendingUp,
  Globe,
  Pill,
  UserPlus,
  Upload,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Bell,
  Mail,
  Zap,
  Database,
  Heart,
} from 'lucide-react';
import { AdminView } from './AdminSidebar';
import { usePlatformStore } from "@/data/care-platform/platformStore";

interface AdminDashboardProps {
  onNavigate: (view: AdminView) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { totalCarersCount, careRequests, placements } = usePlatformStore();

  // Reactive dashboard metrics derived from platform activity (+ baseline historical records)
  const clientCareRequestsCount = 32 + careRequests.length;
  const pendingConfirmationsCount =
    10 + careRequests.filter((r) => r.stage !== 'Finalised').length;
  const activePlacementsCount =
    80 +
    placements.filter(
      (p) =>
        p.status === 'Active' ||
        p.status === 'Emergency' ||
        p.status === 'In Progress' ||
        p.status === 'Confirmed'
    ).length;

  // Sparkline SVG helper matching client mockup
  const renderSparkline = (color: string) => (
    <svg className="w-16 h-5 stroke-current shrink-0" viewBox="0 0 70 20" fill="none">
      <path
        d="M2 15 C 14 14, 22 6, 35 11 C 48 16, 55 3, 68 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-5 space-y-4 sm:space-y-5 relative select-none">
      {/* ── Background Grace & Goodwill Logo Watermark (3D Gold Ribbon Knot positioned right where date starts) ── */}
      <div className="absolute top-[-12px] right-2 sm:right-6 md:right-10 lg:right-16 w-[420px] sm:w-[540px] lg:w-[640px] h-48 sm:h-56 pointer-events-none select-none z-0 overflow-hidden opacity-[0.24]">
        <img
          src="/website_logo.png"
          alt=""
          className="w-full h-full object-contain object-right filter brightness-110 contrast-115"
        />
      </div>

      {/* ── Top Welcome Banner ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 pt-1">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-semibold text-[#0B1528] tracking-tight leading-tight">
            Welcome back, Jessica
          </h1>
          <p className="text-xs sm:text-[14.5px] text-[#5C5549] mt-1 font-sans">
            Here&apos;s what&apos;s happening across Grace &amp; Goodwill today.
          </p>
        </div>
      </div>

      {/* ── ROW 1: 4 Top KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
        {/* Total Carers */}
        <div
          onClick={() => onNavigate('carer-review')}
          className="bg-white rounded-2xl p-5 border border-[#EFE8DE] shadow-sm hover:shadow-md hover:border-[#D4AF7A]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EAE2D2] flex items-center justify-center text-[#B88E3E] group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#C5BBAA] group-hover:text-[#0A1629] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium text-[#71685A]">Total Carers</div>
            <div className="text-[26px] font-bold text-[#0A1629] mt-0.5 leading-tight">
              {totalCarersCount}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F4EFE6]">
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 12%</span>
            </div>
            {renderSparkline('#10B981')}
          </div>
        </div>

        {/* Client Care Requests */}
        <div
          onClick={() => onNavigate('declarations')}
          className="bg-white rounded-2xl p-5 border border-[#EFE8DE] shadow-sm hover:shadow-md hover:border-[#D4AF7A]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EAE2D2] flex items-center justify-center text-[#B88E3E] group-hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#C5BBAA] group-hover:text-[#0A1629] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium text-[#71685A]">Client Care Requests</div>
            <div className="text-[26px] font-bold text-[#0A1629] mt-0.5 leading-tight">
              {clientCareRequestsCount}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F4EFE6]">
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 20%</span>
            </div>
            {renderSparkline('#10B981')}
          </div>
        </div>

        {/* Pending Confirmations */}
        <div
          onClick={() => onNavigate('client-declarations')}
          className="bg-white rounded-2xl p-5 border border-[#EFE8DE] shadow-sm hover:shadow-md hover:border-[#D4AF7A]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EAE2D2] flex items-center justify-center text-[#B88E3E] group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#C5BBAA] group-hover:text-[#0A1629] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium text-[#71685A]">Pending Confirmations</div>
            <div className="text-[26px] font-bold text-[#0A1629] mt-0.5 leading-tight">
              {pendingConfirmationsCount}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F4EFE6]">
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-[#B88E3E]">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 8%</span>
            </div>
            {renderSparkline('#B88E3E')}
          </div>
        </div>

        {/* Active Placements */}
        <div
          onClick={() => onNavigate('carer-accommodation')}
          className="bg-white rounded-2xl p-5 border border-[#EFE8DE] shadow-sm hover:shadow-md hover:border-[#D4AF7A]/60 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#EAE2D2] flex items-center justify-center text-[#B88E3E] group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-[#B88E3E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#C5BBAA] group-hover:text-[#0A1629] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium text-[#71685A]">Active Placements</div>
            <div className="text-[26px] font-bold text-[#0A1629] mt-0.5 leading-tight">
              {activePlacementsCount}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F4EFE6]">
            <div className="flex items-center gap-1 text-[11.5px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 6%</span>
            </div>
            {renderSparkline('#10B981')}
          </div>
        </div>
      </div>

      {/* ── ROW 2: 3 Main Cards (Recent Care Requests | Upcoming Confirmations | Notifications) ── */}
      {/* 3 cards side-by-side on desktop strictly matching client mockup image_1c9017cb.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 xl:gap-4.5 relative z-10 items-stretch">
        {/* 1. Recent Care Requests */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Recent Care Requests</h3>
              </div>
              <button
                onClick={() => onNavigate('declarations')}
                className="text-xs text-[#1E293B] hover:text-[#B88E3E] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFD5C2] hover:border-[#B88E3E] transition-all shrink-0 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#F6F0E6] mt-1">
              {[
                {
                  id: '1',
                  name: 'Doris',
                  care: 'Live-in Ongoing Care',
                  city: 'Hertfordshire',
                  status: 'New',
                  time: '1h ago',
                  avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '2',
                  name: 'Margaret Lewis',
                  care: 'Live-in Ongoing Care',
                  city: 'Chester',
                  status: 'In Review',
                  time: '2h ago',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '3',
                  name: 'Edward Langley',
                  care: 'Live-in Respite Care',
                  city: 'Cotswolds',
                  status: 'New',
                  time: '4h ago',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '4',
                  name: 'Mr Richard',
                  care: 'Live-in Ongoing Care',
                  city: 'Cheshire',
                  status: 'Matching',
                  time: '1d ago',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '5',
                  name: 'Eleanor Briggs',
                  care: 'Live-in Respite Care',
                  city: 'Manchester',
                  status: 'In Review',
                  time: '2d ago',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
                },
              ].map((req) => (
                <div
                  key={req.id}
                  onClick={() => onNavigate('declarations')}
                  className="py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-2 hover:bg-[#FAF7F2] px-1.5 sm:px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 ring-1 ring-[#EAE2D2]"
                    />
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="text-[12px] sm:text-[12.5px] xl:text-[13px] font-semibold text-[#0A1629] group-hover:text-[#B88E3E] transition-colors truncate">
                        {req.name}
                      </div>
                      <div className="text-[10px] sm:text-[10.5px] text-[#71685A] truncate mt-0.5">
                        {req.care} | {req.city}
                      </div>
                    </div>
                  </div>

                  {/* Status badge next to name, followed by time & chevron with guaranteed separation */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-medium whitespace-nowrap shrink-0 ${
                        req.status === 'New'
                          ? 'bg-[#E8F0F8] text-[#1D4ED8]'
                          : req.status === 'In Review'
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#E0F2FE] text-[#0369A1]'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-[#8C827A] whitespace-nowrap shrink-0">
                      {req.time}
                    </span>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5BBAA] group-hover:text-[#0A1629] transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Upcoming Confirmations */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Upcoming Confirmations</h3>
              </div>
              <button
                onClick={() => onNavigate('carer-accommodation')}
                className="text-xs text-[#1E293B] hover:text-[#B88E3E] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFD5C2] hover:border-[#B88E3E] transition-all shrink-0 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#F6F0E6] mt-1">
              {[
                {
                  id: '1',
                  name: 'Sophie Williams',
                  role: 'Live-in Ongoing Care',
                  tag: 'Awaiting client',
                  day: 'Today',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '2',
                  name: 'Daniel Carter',
                  role: 'Live-in Respite Care',
                  tag: 'Awaiting carer',
                  day: 'Today',
                  tagColor: 'bg-[#E2E8F0] text-[#334155]',
                  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '3',
                  name: 'Amelia Khan',
                  role: 'Live-in Ongoing Care',
                  tag: 'Documents',
                  day: 'Tomorrow',
                  tagColor: 'bg-[#FEF9C3] text-[#854D0E]',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '4',
                  name: 'Thomas Green',
                  role: 'Live-in Ongoing Care',
                  tag: 'Reference check',
                  day: 'Tomorrow',
                  tagColor: 'bg-[#E0F2FE] text-[#0369A1]',
                  avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '5',
                  name: 'Olivia Brown',
                  role: 'Live-in Respite Care',
                  tag: 'DBS check',
                  day: '28 Oct',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
                },
              ].map((conf) => (
                <div
                  key={conf.id}
                  onClick={() => onNavigate('carer-review')}
                  className="py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-2 hover:bg-[#FAF7F2] px-1.5 sm:px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <img
                      src={conf.avatar}
                      alt={conf.name}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 ring-1 ring-[#EAE2D2]"
                    />
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="text-[12px] sm:text-[12.5px] xl:text-[13px] font-semibold text-[#0A1629] group-hover:text-[#B88E3E] transition-colors truncate">
                        {conf.name}
                      </div>
                      <div className="text-[10px] sm:text-[10.5px] text-[#71685A] truncate mt-0.5">{conf.role}</div>
                    </div>
                  </div>

                  {/* Vertically Stacked Tag & Day next to chevron with guaranteed separation */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-1">
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-medium whitespace-nowrap ${conf.tagColor}`}
                      >
                        {conf.tag}
                      </span>
                      <span className="text-[9px] sm:text-[9.5px] text-[#8C827A] mt-0.5 leading-tight whitespace-nowrap">
                        {conf.day}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5BBAA] group-hover:text-[#0A1629] transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Notifications</h3>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs text-[#1E293B] hover:text-[#B88E3E] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFD5C2] hover:border-[#B88E3E] transition-all shrink-0 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#F6F0E6] mt-1">
              {[
                {
                  id: '1',
                  isGoldDot: true,
                  title: 'New care request received',
                  subtitle: 'Margaret Lewis – Live-in care (Chester)',
                  time: '2h ago',
                },
                {
                  id: '2',
                  isGoldDot: false,
                  title: 'Carer profile updated',
                  subtitle: 'Sophie Williams',
                  time: '3h ago',
                },
                {
                  id: '3',
                  isGoldDot: false,
                  title: 'Placement confirmation required',
                  subtitle: 'David Thompson',
                  time: '4h ago',
                },
                {
                  id: '4',
                  isGoldDot: false,
                  title: 'New document uploaded',
                  subtitle: 'Eleanor Briggs – Medical information',
                  time: '6h ago',
                },
                {
                  id: '5',
                  isGoldDot: false,
                  title: 'Reference check completed',
                  subtitle: 'Thomas Green',
                  time: '1d ago',
                },
                {
                  id: '6',
                  isGoldDot: false,
                  title: 'New message from client',
                  subtitle: 'Patricia Evans',
                  time: '1d ago',
                },
              ].map((notif) => (
                <div
                  key={notif.id}
                  className="py-3 flex items-start gap-2.5 hover:bg-[#FAF7F2] px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      notif.isGoldDot ? 'bg-[#E5A83B]' : 'bg-[#0B1528]'
                    }`}
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[12.5px] font-semibold text-[#0A1629] group-hover:text-[#B88E3E] transition-colors leading-snug">
                      {notif.title}
                    </p>
                    <p className="text-[11.5px] text-[#71685A] mt-0.5 leading-snug">{notif.subtitle}</p>
                  </div>
                  <span className="text-[10.5px] text-[#8C827A] whitespace-nowrap shrink-0">
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Bottom 3 Cards (Master Libraries | Review Queue | Quick Actions) ── */}
      {/* 3 cards side-by-side on desktop strictly matching client mockup image_1c9017cb.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 xl:gap-4.5 relative z-10 items-stretch">
        {/* 1. Master Libraries */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Master Libraries</h3>
              </div>
              <button
                onClick={() => onNavigate('health-conditions')}
                className="text-xs text-[#1E293B] hover:text-[#B88E3E] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFD5C2] hover:border-[#B88E3E] transition-all shrink-0 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#F6F0E6] mt-1">
              {[
                {
                  id: 'req',
                  title: 'Requirements Library',
                  desc: 'Care needs, conditions and support requirements',
                  icon: FileText,
                  nav: 'health-conditions' as AdminView,
                },
                {
                  id: 'env',
                  title: 'Home Environment Library',
                  desc: 'Property types, facilities and accessibility',
                  icon: Home,
                  nav: 'carer-accommodation' as AdminView,
                },
                {
                  id: 'int',
                  title: 'Interests & Hobbies Library',
                  desc: 'Activities, interests and lifestyle preferences',
                  icon: Heart,
                  nav: 'health-conditions' as AdminView,
                },
                {
                  id: 'lang',
                  title: 'Languages Library',
                  desc: 'Languages spoken by carers and clients',
                  icon: Globe,
                  nav: 'health-conditions' as AdminView,
                },
                {
                  id: 'med',
                  title: 'Medication Library',
                  desc: 'Medications, dosages and administration notes',
                  icon: Pill,
                  nav: 'medication' as AdminView,
                },
              ].map((lib) => {
                const IconComponent = lib.icon;
                return (
                  <div
                    key={lib.id}
                    onClick={() => onNavigate(lib.nav)}
                    className="py-2.5 sm:py-3 flex items-center justify-between hover:bg-[#FAF7F2] px-1.5 sm:px-2 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg bg-[#FAF6EE] flex items-center justify-center shrink-0 text-[#B88E3E]">
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] sm:text-[13px] font-semibold text-[#0A1629] group-hover:text-[#B88E3E] transition-colors truncate">
                          {lib.title}
                        </div>
                        <div className="text-[10.5px] sm:text-[11px] text-[#71685A] truncate">{lib.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5BBAA] group-hover:text-[#0A1629] transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Review Queue */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Review Queue</h3>
              </div>
              <button
                onClick={() => onNavigate('carer-review')}
                className="text-xs text-[#1E293B] hover:text-[#B88E3E] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#DFD5C2] hover:border-[#B88E3E] transition-all shrink-0 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#F6F0E6] mt-1">
              {[
                {
                  id: '1',
                  name: 'Sophie Williams',
                  sub: 'New carer profile',
                  tag: 'Profile Review',
                  time: '2h ago',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '2',
                  name: 'Daniel Carter',
                  sub: 'Updated documents',
                  tag: 'Documents',
                  time: '5h ago',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '3',
                  name: 'Olivia Brown',
                  sub: 'Reference check',
                  tag: 'Background Check',
                  time: '1d ago',
                  tagColor: 'bg-[#E0F2FE] text-[#0369A1]',
                  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '4',
                  name: 'Matthew Lewis',
                  sub: 'Training certificate',
                  tag: 'Training',
                  time: '1d ago',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
                },
                {
                  id: '5',
                  name: 'Chloe Adams',
                  sub: 'New carer profile',
                  tag: 'Profile Review',
                  time: '2d ago',
                  tagColor: 'bg-[#FEF3C7] text-[#B45309]',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('carer-review')}
                  className="py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-2 hover:bg-[#FAF7F2] px-1.5 sm:px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 ring-1 ring-[#EAE2D2]"
                    />
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="text-[12px] sm:text-[12.5px] xl:text-[13px] font-semibold text-[#0A1629] group-hover:text-[#B88E3E] transition-colors truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] sm:text-[10.5px] text-[#71685A] truncate mt-0.5">{item.sub}</div>
                    </div>
                  </div>

                  {/* Status Tag & Time positioned clearly at right with ample gap, no overlap, no clipping */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-medium whitespace-nowrap shrink-0 ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-[#8C827A] whitespace-nowrap shrink-0">
                      {item.time}
                    </span>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C5BBAA] group-hover:text-[#0A1629] transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Quick Actions strictly matching client mockup (6 cards in 2x3 grid) */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 xl:p-5 border border-[#EFE8DE] shadow-sm flex flex-col justify-between h-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAF6EE] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[14.5px] text-[#0A1629]">Quick Actions</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => onNavigate('carer-review')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Add New Carer</span>
              </button>

              <button
                onClick={() => onNavigate('active-placement')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <Users className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Add New Client</span>
              </button>

              <button
                onClick={() => onNavigate('declarations')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <FilePlus className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Create Care Request</span>
              </button>

              <button
                onClick={() => onNavigate('carer-accommodation')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <Home className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Record Placement</span>
              </button>

              <button
                onClick={() => onNavigate('carer-accommodation')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <Upload className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Upload Document</span>
              </button>

              <button
                onClick={() => onNavigate('declarations')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-[#EAE2D2] bg-[#FAF6EE] hover:bg-white hover:border-[#B88E3E] hover:shadow-sm transition-all group text-center cursor-pointer"
              >
                <Mail className="w-5 h-5 text-[#8C6D2B] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[12px] font-semibold text-[#0A1629]">Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
