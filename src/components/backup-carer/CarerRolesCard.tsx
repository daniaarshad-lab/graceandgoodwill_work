"use client";

import { useState } from "react";
import {
  UserCheck,
  Shield,
  CalendarClock,
  Info,
  X,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";

interface CarerRolesCardProps {
  primaryCount?: number;
  backupCount?: number;
  activeReliefCount?: number;
  className?: string;
}

export default function CarerRolesCard({
  primaryCount = 0,
  backupCount = 0,
  activeReliefCount = 0,
  className = "",
}: CarerRolesCardProps) {
  const [showDefinitionsModal, setShowDefinitionsModal] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 to-navy-950 p-6 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Decorative Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gold-200">Your Carer Roles</h3>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-100/50 bg-gold-300/10 px-2 py-0.5 rounded-full border border-gold-300/20">
              Grace & Goodwill Multi-Tier
            </span>
          </div>
          <p className="text-xs text-gold-100/60 mt-0.5">
            Understand your active placement designations and upcoming relief opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDefinitionsModal(true)}
          className="inline-flex items-center gap-1.5 text-xs text-gold-200/80 hover:text-gold-200 bg-gold-300/10 hover:bg-gold-300/20 px-3 py-1.5 rounded-xl border border-gold-300/20 transition-all font-medium cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-gold-400" />
          <span>Status Definitions</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {/* Role 1: Primary Carer */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 transition-all">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-white">Primary Carer</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  primaryCount > 0
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-700/40 text-slate-400 border border-slate-700/50"
                }`}
              >
                {primaryCount > 0 ? "Current" : "Available"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/70 leading-relaxed">
              Currently allocated/main carer for an active client placement.
            </p>
            <span
              className={`inline-block text-[10px] font-semibold pt-0.5 ${
                primaryCount > 0 ? "text-emerald-400" : "text-gold-100/40"
              }`}
            >
              ● {primaryCount} active {primaryCount === 1 ? "engagement" : "engagements"}
            </span>
          </div>
        </div>

        {/* Role 2: Preferred Relief / Backup Carer */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 transition-all">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-white">
                Preferred Backup Carer
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  backupCount > 0
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-slate-700/40 text-slate-400 border border-slate-700/50"
                }`}
              >
                {backupCount > 0 ? "Active" : "Not Designated"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/70 leading-relaxed">
              Preferred person for future relief, but not booked or guaranteed.
            </p>
            <span
              className={`inline-block text-[10px] font-semibold pt-0.5 ${
                backupCount > 0 ? "text-amber-300/90" : "text-gold-100/40"
              }`}
            >
              ● {backupCount} client {backupCount === 1 ? "designation" : "designations"}
            </span>
          </div>
        </div>

        {/* Role 3: Active Relief Carer */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 hover:border-blue-500/40 transition-all">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-white">Active Relief Carer</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeReliefCount > 0
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-slate-700/40 text-slate-400 border border-slate-700/50"
                }`}
              >
                {activeReliefCount > 0 ? "Covering" : "Not Active"}
              </span>
            </div>
            <p className="text-[11px] text-gold-100/70 leading-relaxed">
              Backup carer who has accepted specific relief dates and is covering.
            </p>
            <span
              className={`inline-block text-[10px] font-semibold pt-0.5 ${
                activeReliefCount > 0 ? "text-blue-400" : "text-gold-100/40"
              }`}
            >
              ● {activeReliefCount} active relief cover
            </span>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gold-300/5 border border-gold-300/10 text-xs text-gold-100/80">
        <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong className="text-gold-200">Flexible Multi-Placement System:</strong> You can be a
          primary carer on one placement and a preferred relief/backup carer on other placements. You
          will only be offered relief dates when you are available on your calendar.
        </p>
      </div>

      {/* Status Definitions Modal (Mockup 3 #5) */}
      {showDefinitionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-5">
            <button
              onClick={() => setShowDefinitionsModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gold-300/10 pb-3">
              <div className="p-2.5 rounded-xl bg-gold-300/10 text-gold-300 border border-gold-300/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gold-200">Placement Status Definitions</h3>
                <p className="text-xs text-gold-100/60">
                  Clear guidance for Admin, Clients, and Carers
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Primary Definition */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Primary Carer
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-normal">
                      Current
                    </span>
                  </h4>
                  <p className="text-xs text-gold-100/70 mt-1 leading-relaxed">
                    The client’s main/current ongoing carer providing regular care support.
                  </p>
                </div>
              </div>

              {/* Preferred Backup Definition */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Preferred Backup Carer
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-normal">
                      Active
                    </span>
                  </h4>
                  <p className="text-xs text-gold-100/70 mt-1 leading-relaxed">
                    The client’s preferred person for future relief, but not yet allocated to specific
                    dates. <strong>Zero extra charge to client.</strong>
                  </p>
                </div>
              </div>

              {/* Active Relief Definition */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Active Relief Carer
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-normal">
                      Covering
                    </span>
                  </h4>
                  <p className="text-xs text-gold-100/70 mt-1 leading-relaxed">
                    A backup carer who has accepted specific relief dates and is providing the
                    service for that designated period during primary carer holiday or absence.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDefinitionsModal(false)}
                className="px-4 py-2 rounded-xl bg-gold text-navy-950 text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
