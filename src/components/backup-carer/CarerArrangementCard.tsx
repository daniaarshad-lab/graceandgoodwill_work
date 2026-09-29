"use client";

import { useState } from "react";
import {
  User,
  Shield,
  UserCheck,
  CalendarClock,
  Info,
  MoreVertical,
  ArrowUpRight,
  UserPlus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Button from "@/components/Button";
import { CarerMiniProfile } from "@/types/backupCarer.types";

interface CarerArrangementCardProps {
  primaryCarer?: CarerMiniProfile | null;
  preferredBackupCarer?: CarerMiniProfile | null;
  activeReliefCarer?: CarerMiniProfile | null;
  activeReliefDates?: {
    startDate: string;
    endDate: string;
  } | null;
  placementStartDate?: string;
  isAdmin?: boolean;
  onViewProfile?: (carerProfileId: string) => void;
  onSelectBackupClick?: () => void;
  onPromoteBackupClick?: () => void;
  onAssignReliefClick?: () => void;
  className?: string;
}

export default function CarerArrangementCard({
  primaryCarer,
  preferredBackupCarer,
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
            Unified single-placement multi-carer continuity model
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
                  alt={primaryCarer.user.firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {primaryCarer
                    ? `${primaryCarer.user.firstName} ${primaryCarer.user.lastName}`
                    : "Not Assigned"}
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
              {preferredBackupCarer?.profilePhotoUrl ? (
                <img
                  src={preferredBackupCarer.profilePhotoUrl}
                  alt={preferredBackupCarer.user.firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCheck className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {preferredBackupCarer
                    ? `${preferredBackupCarer.user.firstName} ${preferredBackupCarer.user.lastName}`
                    : "Preferred Backup Carer"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    preferredBackupCarer
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      preferredBackupCarer ? "bg-amber-400" : "bg-slate-400"
                    }`}
                  />
                  {preferredBackupCarer ? "Preferred Backup Carer • Active" : "Not Allocated"}
                </span>
              </div>
              <p className="text-xs text-gold-100/70 mt-0.5">
                {preferredBackupCarer
                  ? "Available for future relief opportunities (Not allocated to specific dates) • Zero Extra Charge"
                  : "No preferred backup carer designated yet. Select a preferred backup carer from the interest list."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {preferredBackupCarer ? (
              <>
                {onViewProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProfile(preferredBackupCarer.id)}
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
                    title="Promote backup carer to become the primary carer if primary leaves"
                  >
                    Promote to Primary
                  </Button>
                )}
              </>
            ) : (
              onSelectBackupClick && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSelectBackupClick}
                  className="text-xs py-1.5 font-bold shadow-md shadow-gold/20"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1" />
                  Select Backup Carer
                </Button>
              )
            )}
          </div>
        </div>

        {/* 3. Active Relief Carer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 hover:border-blue-500/40 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {activeReliefCarer?.profilePhotoUrl ? (
                <img
                  src={activeReliefCarer.profilePhotoUrl}
                  alt={activeReliefCarer.user.firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CalendarClock className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {activeReliefCarer
                    ? `${activeReliefCarer.user.firstName} ${activeReliefCarer.user.lastName}`
                    : "Active Relief Carer"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    activeReliefCarer
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeReliefCarer ? "bg-blue-400" : "bg-slate-400"
                    }`}
                  />
                  {activeReliefCarer ? "Covering" : "Not Active"}
                </span>
              </div>
              <p className="text-xs text-gold-100/70 mt-0.5">
                {activeReliefCarer
                  ? `Providing relief care: ${formatReliefDates() || "Scheduled period"}`
                  : "No active relief carer at the moment"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {activeReliefCarer ? (
              onViewProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProfile(activeReliefCarer.id)}
                  className="text-xs py-1.5"
                >
                  View Profile
                </Button>
              )
            ) : (
              isAdmin &&
              onAssignReliefClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAssignReliefClick}
                  className="text-xs py-1.5"
                >
                  Assign Relief
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Explanatory note (Mockup 2 #1) */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gold-300/5 border border-gold-300/10 text-xs text-gold-100/70">
        <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          Having a Preferred Relief/Backup Carer does not automatically allocate them to dates. They
          will only become an Active Relief Carer once they accept a specific relief placement offer.
        </p>
      </div>
    </div>
  );
}
