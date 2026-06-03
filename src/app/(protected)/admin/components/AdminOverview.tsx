import SectionCard from "./shared/SectionCard";
import { UseAdminPortalReturn } from "../hooks/useAdminPortal";
import { Users, ClipboardList, Calendar, AlertTriangle } from "lucide-react";

interface AdminOverviewProps {
  stats: UseAdminPortalReturn["stats"];
  activities: UseAdminPortalReturn["activities"];
  setActiveTab: UseAdminPortalReturn["setActiveTab"];
}

export default function AdminOverview({
  stats,
  activities,
  setActiveTab,
}: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      {/* 4-Column Grid Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Carers */}
        <div
          onClick={() => setActiveTab("carers")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30"
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
              <Users className="h-6 w-6" strokeWidth={2} />
            </div>
          </div>
          <p className="mt-4 text-xs text-gold-100/40">
            Registered carer pool profiles
          </p>
        </div>

        {/* Card 2: Pending Reviews */}
        <div
          onClick={() => setActiveTab("carers")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30"
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
            Carer applications awaiting DBS review
          </p>
        </div>

        {/* Card 3: Active Placements */}
        <div
          onClick={() => setActiveTab("placements")}
          className="cursor-pointer rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-300/30"
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

        {/* Card 4: Emergency Cases */}
        <div
          onClick={() => setActiveTab("emergency")}
          className="relative cursor-pointer overflow-hidden rounded-2xl border border-rose-500/20 bg-navy-900/60 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-rose-500/40"
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
                Emergency Cases
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
            High priority care cases awaiting assignment
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Live Activities Log */}
        <div className="lg:col-span-2">
          <SectionCard className="h-full">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gold-200">
                  Recent System Events
                </h3>
                <p className="text-xs text-gold-100/50">
                  Audit logs of matches, overrides, and carer verifications
                </p>
              </div>
              <span className="rounded-full bg-navy-950 px-3 py-1 text-xs text-gold-DEFAULT border border-gold-300/10">
                Live Audit
              </span>
            </div>

            <div className="flow-root">
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
                        <p className="text-xs text-gold-100/40">
                          {act.timestamp}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </div>

        {/* Right 1 Column: Direct Shortcuts */}
        <div>
          <SectionCard className="space-y-6">
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
                onClick={() => setActiveTab("matching")}
                className="flex w-full items-center justify-between rounded-xl bg-navy-950 p-4 border border-gold-300/10 text-left transition hover:border-gold-300/30 hover:bg-navy-950/80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Match New Client
                  </h4>
                  <p className="text-xs text-gold-100/50">
                    Pair unmatched requests to carers
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

              <button
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
              </button>
            </div>

            {/* Quick platform status widget */}
            <div className="rounded-xl bg-navy-950/50 p-4 border border-gold-300/5">
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
    </div>
  );
}
