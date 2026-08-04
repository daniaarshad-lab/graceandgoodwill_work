import SectionCard from "./shared/SectionCard";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import {
  Users,
  ClipboardList,
  Calendar,
  MessageSquare,
  UserCheck,
} from "lucide-react";

interface AdminOverviewProps {
  stats: UseAdminPortalReturn["stats"];
  activities: UseAdminPortalReturn["activities"];
  setActiveTab: UseAdminPortalReturn["setActiveTab"];
  isLiveActive: boolean;
  setIsLiveActive: (active: boolean) => void;
}

export default function AdminOverview({
  stats,
  activities,
  setActiveTab,
  isLiveActive,
  setIsLiveActive,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      {/* 5-Card responsive grid (symmetrical layout) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {/* Card 1: Total Clients */}
        <div
          onClick={() => setActiveTab("clients")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 flex flex-col justify-between lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/60">
                Total Clients
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gold-200">
                {stats.totalClients}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Users className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-gold-100/40">
            Registered client accounts
          </p>
        </div>

        {/* Card 2: Total Carers */}
        <div
          onClick={() => setActiveTab("carers")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 flex flex-col justify-between lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/60">
                Total Carers
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gold-200">
                {stats.totalCarers}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <UserCheck className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-gold-100/40">
            Registered carer profiles
          </p>
        </div>

        {/* Card 3: Pending Approvals */}
        <div
          onClick={() => setActiveTab("carers")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 flex flex-col justify-between sm:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/60">
                Pending Approvals
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gold-DEFAULT">
                {stats.pendingCarers}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-DEFAULT">
              <ClipboardList className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-gold-DEFAULT/60">
            Carer applications awaiting review
          </p>
        </div>

        {/* Card 4: Active Placements */}
        <div
          onClick={() => setActiveTab("placements")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 flex flex-col justify-between lg:col-span-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/60">
                Active Placements
              </p>
              <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                {stats.activePlacements}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-emerald-400/60">
            Matched care schedules in progress
          </p>
        </div>

        {/* Card 5: Emergency Cases */}
        {/*
        <div
          onClick={() => setActiveTab("emergency")}
          className="relative cursor-pointer overflow-hidden rounded-2xl border border-rose-500/20 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-rose-500/40 flex flex-col justify-between"
        >
          {stats.emergencyCases > 0 && (
            <span className="absolute right-3 top-3 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
            </span>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Emergency Care requests
              </p>
              <h3 className="mt-2 text-3xl font-bold text-rose-400">
                {stats.emergencyCases}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-rose-400/60">
            High priority care cases awaiting action
          </p>
        </div>
        */}

        {/* Card 6: Open Support Enquiries */}
        <div
          onClick={() => setActiveTab("enquiries")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 flex flex-col justify-between sm:col-span-2 lg:col-span-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/60">
                Open Support Enquiries
              </p>
              <h3 className="mt-2 text-3xl font-bold text-amber-500">
                {stats.unreadEnquiries}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <MessageSquare className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-amber-500/60">
            Client enquiries requiring attention
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-stretch">
        {/* Left 2 Columns: Live Activities Log */}
        <div className="lg:col-span-2">
          <SectionCard className="flex flex-col h-auto lg:h-[450px] lg:min-h-[450px] lg:max-h-[450px] overflow-hidden">
            {/* Fixed header */}
            <div className="mb-6 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gold-200">
                  Recent System Events
                </h3>
                <p className="text-xs text-gold-100/50">
                  Audit logs of matches, overrides, and carer verifications
                </p>
              </div>
              <button
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-semibold border transition duration-300 cursor-pointer ${
                  isLiveActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {isLiveActive && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${isLiveActive ? "bg-emerald-500" : "bg-amber-500"}`}
                  ></span>
                </span>
                <span>{isLiveActive ? "Live Active" : "Live Paused"}</span>
              </button>
            </div>

            {/* Scrollable events list */}
            <div
              className="flex-1 min-h-0 overflow-y-auto pr-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(160,128,84,0.18) transparent",
              }}
            >
              <style>{`
                .events-scroll::-webkit-scrollbar { width: 4px; }
                .events-scroll::-webkit-scrollbar-track { background: transparent; }
                .events-scroll::-webkit-scrollbar-thumb { background-color: rgba(160,128,84,0.18); border-radius: 20px; }
                .events-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(160,128,84,0.36); }
              `}</style>
              <div className="flow-root events-scroll">
                <ul className="-my-5 divide-y divide-gold-300/5">
                  {activities.map((act) => (
                    <li key={act.id} className="py-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 flex-shrink-0">
                          {act.type === "success" && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                          )}
                          {act.type === "warning" && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-gold"></span>
                          )}
                          {act.type === "error" && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                          )}
                          {act.type === "info" && (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-gold-100/40"></span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-gold-100/90">
                            {act.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gold-100/40">
                            <span>{act.timestamp}</span>
                            <span>•</span>
                            <span className="font-semibold text-gold-200/70">
                              By: {act.adminName || "System"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right 1 Column: Direct Shortcuts */}
        <div>
          <SectionCard className="flex flex-col space-y-6 h-auto lg:h-[450px] lg:min-h-[450px] lg:max-h-[450px]">
            <div>
              <h3 className="text-lg font-bold text-gold-200">
                Placement Action Board
              </h3>
              <p className="text-xs text-gold-100/50">
                Quick jumps to operational panels
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("profile-updates")}
                className="flex w-full items-center justify-between rounded-xl bg-navy-950 p-4 border border-gold-300/10 text-left transition hover:border-gold-300/30 hover:bg-navy-950/80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Review Profile Updates
                  </h4>
                  <p className="text-xs text-gold-100/50">
                    Review and approve carer media
                  </p>
                </div>
                <span className="text-gold">➔</span>
              </button>

              <button
                onClick={() => setActiveTab("carers")}
                className="flex w-full items-center justify-between rounded-xl bg-navy-950 p-4 border border-gold-300/10 text-left transition hover:border-gold-300/30 hover:bg-navy-950/80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Review Credentials
                  </h4>
                  <p className="text-xs text-gold-100/50">
                    Check DBS & document validations
                  </p>
                </div>
                <span className="text-gold">➔</span>
              </button>

              {/* <button
                onClick={() => setActiveTab("placements")}
                className="flex w-full items-center justify-between rounded-xl bg-navy-950 p-4 border border-gold-300/10 text-left transition hover:border-gold-300/30 hover:bg-navy-950/80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Manage Placements
                  </h4>
                  <p className="text-xs text-gold-100/50">
                    Track schedules & overrides
                  </p>
                </div>
                <span className="text-gold">➔</span>
              </button> */}
            </div>

            {/* Quick platform status widget */}
            <div className="rounded-xl bg-navy-950/50 p-4 border border-gold-300/5 mt-auto">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-200/60 mb-2">
                Operational Status
              </h4>
              <div className="flex items-center space-x-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>All platform services running normally</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Extended Platform Statistics Section */}
      <SectionCard>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gold-200">
            Extended Platform Statistics
          </h3>
          <p className="text-xs text-gold-100/50">
            Real-time tracking of registration metrics, user counts, and
            membership breakdown
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Active Clients */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/10">
            <p className="text-xs font-medium text-gold-200/60 uppercase tracking-wider">
              Active Clients
            </p>
            <p className="mt-2 text-2xl font-bold text-gold-200">
              {stats.activeClients ?? 0}
            </p>
          </div>

          {/* Active Carers */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/10">
            <p className="text-xs font-medium text-gold-200/60 uppercase tracking-wider">
              Active Carers
            </p>
            <p className="mt-2 text-2xl font-bold text-gold-200">
              {stats.activeCarers ?? 0}
            </p>
          </div>

          {/* Total Referral Partners */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/10">
            <p className="text-xs font-medium text-gold-200/60 uppercase tracking-wider">
              Total Referral Partners
            </p>
            <p className="mt-2 text-2xl font-bold text-gold-200">
              {stats.totalReferralPartners ?? 0}
            </p>
          </div>

          {/* Lifetime Platform Members */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/10">
            <p className="text-xs font-medium text-gold-200/60 uppercase tracking-wider">
              Lifetime Members
            </p>
            <p className="mt-2 text-2xl font-bold text-gold-200">
              {stats.lifetimePlatformMembers ?? 0}
            </p>
          </div>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-1">
          {/* Registrations This Year */}
          <div className="rounded-xl bg-navy-950 p-4 border border-gold-300/10 col-span-1">
            <h4 className="text-sm font-semibold text-gold-200 mb-4">
              Registrations This Year
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gold-100/70">
                  Clients Registered This Year
                </span>
                <span className="font-bold text-gold-200">
                  {stats.clientsRegisteredThisYear ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-gold-300/5 pt-2">
                <span className="text-gold-100/70">
                  Carers Registered This Year
                </span>
                <span className="font-bold text-gold-200">
                  {stats.carersRegisteredThisYear ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-gold-300/5 pt-2">
                <span className="text-gold-100/70">
                  Referral Partners Registered This Year
                </span>
                <span className="font-bold text-gold-200">
                  {stats.referralPartnersRegisteredThisYear ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
