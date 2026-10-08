"use client";

import { useState } from "react";
import {
  User,
  Shield,
  UserCheck,
  CalendarClock,
  UserPlus,
  RefreshCw,
  Sparkles,
  Info,
} from "lucide-react";
import Button from "@/components/Button";

interface CarerArrangementCardProps {
  primaryCarer?: any;
  preferredBackupCarer?: any;
  secondaryBackupCarer?: any; // kept for backwards compatibility, not displayed
  backupCarers?: any[];
  activeReliefCarer?: any;
  activeReliefDates?: {
    startDate: string;
    endDate: string;
  } | null;
  placementStartDate?: string;
  isAdmin?: boolean;
  onViewProfile?: (carerProfileId: string) => void;
  onSelectBackupClick?: (priority?: number) => void;
  onPromoteBackupClick?: () => void;
  onAssignReliefClick?: () => void;
  className?: string;
}

export default function CarerArrangementCard({
  primaryCarer,
  preferredBackupCarer,
  backupCarers = [],
  activeReliefCarer,
  activeReliefDates,
  placementStartDate,
  isAdmin = false,
  onViewProfile,
  onSelectBackupClick,
  onPromoteBackupClick,
  onAssignReliefClick,
  className = "",
}: CarerArrangementCardProps) {
  const formatReliefDates = () => {
    if (!activeReliefDates?.startDate) return "";
    const s = new Date(activeReliefDates.startDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const e = activeReliefDates.endDate
      ? new Date(activeReliefDates.endDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Ongoing";
    return `${s} – ${e}`;
  };

  const getCarerName = (carer: any, defaultText: string) => {
    if (!carer) return defaultText;
    if (carer.user) {
      const full = `${carer.user.firstName || ""} ${carer.user.lastName || ""}`.trim();
      if (full) return full;
    }
    if (carer.firstName || carer.lastName) {
      return `${carer.firstName || ""} ${carer.lastName || ""}`.trim();
    }
    return carer.name || defaultText;
  };

  // Resolve preferred backup carer
  const backup =
    backupCarers.find((b) => b.priority === 1)?.carerProfile ||
    preferredBackupCarer ||
    null;

  const primaryName = getCarerName(primaryCarer, "Not Assigned");
  const backupName = getCarerName(backup, "Preferred Relief / Backup Carer");
  const reliefName = getCarerName(activeReliefCarer, "Active Relief Carer");

  return (
    <div
      className={`rounded-2xl border border-gold-300/20 bg-navy-900/60 p-6 shadow-xl space-y-4 relative ${className}`}
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-gold-200">
            {isAdmin ? "Carer Arrangement" : "Carers for this Placement"}
          </h3>
          <p className="text-xs text-gold-100/60 mt-0.5">
            Unified single-placement continuity model (Primary Carer + Preferred Backup Carer)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* 1. Primary Carer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {primaryCarer?.profilePhotoUrl ? (
                <img
                  src={primaryCarer.profilePhotoUrl}
                  alt={primaryName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {primaryCarer ? primaryName : "Not Assigned"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    primaryCarer
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      primaryCarer ? "bg-emerald-400" : "bg-slate-400"
                    }`}
                  />
                  {primaryCarer ? "Primary Carer • Current" : "Not Assigned"}
                </span>
              </div>
              <p className="text-xs text-gold-100/70 mt-0.5">
                {primaryCarer ? "Main carer for this placement" : "No primary carer assigned yet."}
                {primaryCarer && placementStartDate
                  ? ` (Started ${new Date(placementStartDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })})`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {primaryCarer?.id && onViewProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(primaryCarer.id)}
                className="text-xs py-1.5"
              >
                View Profile
              </Button>
            )}
          </div>
        </div>

        {/* 2. Preferred Relief / Backup Carer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {backup?.profilePhotoUrl ? (
                <img
                  src={backup.profilePhotoUrl}
                  alt={backupName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCheck className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {backup ? backupName : "Preferred Relief / Backup Carer"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    backup
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      backup ? "bg-amber-400" : "bg-slate-400"
                    }`}
                  />
                  {backup ? "Preferred Backup Carer" : "Not Allocated"}
                </span>
              </div>
              <p className="text-xs text-gold-100/70 mt-0.5">
                {backup
                  ? "Available for future relief opportunities • Zero extra charge"
                  : "The client's preferred person for future relief, not yet allocated to specific dates."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {backup ? (
              <>
                {onViewProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProfile(backup.id || backup.carerProfileId)}
                    className="text-xs py-1.5"
                  >
                    View Profile
                  </Button>
                )}
                {isAdmin && onPromoteBackupClick && (
                  <Button
                    variant="ghost-gold"
                    size="sm"
                    onClick={onPromoteBackupClick}
                    className="text-xs py-1.5 text-amber-300 hover:text-amber-200"
                    title="Promote backup carer to become primary carer"
                  >
                    Promote to Primary
                  </Button>
                )}
                {onSelectBackupClick && (
                  <Button
                    variant="ghost-gold"
                    size="sm"
                    onClick={() => onSelectBackupClick(1)}
                    className="text-xs py-1.5 text-gold-100/70 hover:text-gold-200"
                  >
                    Change Backup Carer
                  </Button>
                )}
              </>
            ) : (
              onSelectBackupClick && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectBackupClick(1)}
                  className="text-xs py-1.5 font-bold shadow-md shadow-gold/20"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  Assign Preferred Backup
                </Button>
              )
            )}
          </div>
        </div>

        {/* 3. Active Relief Carer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-teal-500/20 bg-teal-950/20 hover:border-teal-500/40 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {activeReliefCarer?.profilePhotoUrl ? (
                <img
                  src={activeReliefCarer.profilePhotoUrl}
                  alt={reliefName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CalendarClock className="w-5 h-5 text-teal-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {activeReliefCarer ? reliefName : "Active Relief Carer"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    activeReliefCarer
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                      : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeReliefCarer ? "bg-teal-400" : "bg-slate-400"
                    }`}
                  />
                  {activeReliefCarer ? "Active Relief Carer • Covering" : "Not Active"}
                </span>
              </div>
              <p className="text-xs text-gold-100/70 mt-0.5">
                {activeReliefCarer
                  ? `Providing live-in care: ${formatReliefDates() || "Scheduled period"}`
                  : "No active relief carer at the moment"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {activeReliefCarer && onViewProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(activeReliefCarer.id || activeReliefCarer.carerProfileId)}
                className="text-xs py-1.5"
              >
                View Profile
              </Button>
            )}
            {!activeReliefCarer && onAssignReliefClick && (
              <Button
                variant="ghost-gold"
                size="sm"
                onClick={onAssignReliefClick}
                className="text-xs py-1.5"
              >
                Assign
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Info Callout Box matching Step 1 workflow */}
      <div className="p-3.5 rounded-xl bg-gold-300/5 border border-gold-300/15 flex items-start gap-2.5 text-xs text-gold-100/70">
        <Info className="w-4 h-4 text-gold-DEFAULT shrink-0 mt-0.5" />
        <span>
          The preferred relief/backup carer is not automatically allocated to any dates. They will be offered specific dates when relief is required and can choose to accept or decline.
        </span>
      </div>
    </div>
  );
}
