import { useState, useEffect } from "react";
import SectionCard from "./shared/SectionCard";
import StatusBadge from "./shared/StatusBadge";
import { ComplianceDoc } from "../types/carer.types";
import { groupDatesIntoRanges, formatRangeDisplay } from "../utils/date.utils";
import { useAppSelector } from "@/store/hooks";
import CarerRolesCard from "@/components/backup-carer/CarerRolesCard";
import { carerService } from "@/services/carer/carer.service";
import { backupCarerService } from "@/services/backupCarer.service";
import Button from "@/components/Button";
interface DashboardOverviewProps {
  applicationStatus: "pending" | "approved" | "rejected";
  complianceDocs: ComplianceDoc[];
  availability: string[];
  setActiveTab: (tab: any) => void;
  onShareClick?: () => void;
}

export default function DashboardOverview({
  applicationStatus,
  complianceDocs,
  availability,
  setActiveTab,
  onShareClick,
}: DashboardOverviewProps) {
  const profile = useAppSelector((state) => state.carer.profile);

  const [roleCounts, setRoleCounts] = useState({ primary: 0, backup: 0, relief: 0 });

  useEffect(() => {
    Promise.all([
      carerService.getPlacements().catch(() => []),
      backupCarerService.getReliefOpportunities().catch(() => []),
      backupCarerService.getPreferredBackupPlacements(profile?.id).catch(() => []),
      backupCarerService.getConfirmedReliefAssignments().catch(() => []),
    ]).then(([placements, offers, backups, confirmedRelief]) => {
      const primary = placements.filter(
        (p: any) =>
          ["PLACEMENT_CONFIRMED", "PLACEMENT_STARTED", "ACTIVE", "ONGOING"].includes(p.status) &&
          !p.isBackup &&
          (p.carerProfileId === profile?.id || p.myRole === "PRIMARY_CARER")
      ).length;

      const backupFromPlacements = placements.filter(
        (p: any) =>
          ["PLACEMENT_CONFIRMED", "PLACEMENT_STARTED", "ACTIVE", "ONGOING"].includes(p.status) &&
          (p.isBackup ||
            p.preferredBackupCarerProfileId === profile?.id ||
            p.backupCarers?.some((b: any) => b.carerProfileId === profile?.id) ||
            p.myRole === "PREFERRED_BACKUP_CARER" ||
            p.myRole === "SECONDARY_BACKUP_CARER" ||
            Boolean(p.roleTitle && p.roleTitle.toLowerCase().includes("backup")) ||
            Boolean(p.carerProfileId && profile?.id && p.carerProfileId !== profile.id))
      ).length;

      const uniqueBackups = backups.filter(
        (bp: any) => !placements.some((p: any) => p.id === bp.id || `backup-${p.id}` === bp.id)
      ).length;
      const backup = backupFromPlacements + uniqueBackups;

      const reliefAssignmentsCount = Array.isArray(confirmedRelief) ? confirmedRelief.length : 0;
      const reliefPlacementsCount = placements.filter(
        (p: any) =>
          p.myRole === "ACTIVE_RELIEF_CARER" ||
          p.activeReliefCarerProfileId === profile?.id ||
          p.assignments?.some(
            (a: any) =>
              (a.role === "ACTIVE_RELIEF_CARER" || a.role === "RELIEF_CARER") &&
              ["CONFIRMED", "IN_PROGRESS", "ACTIVE"].includes(a.status)
          ) ||
          p.leaveRequests?.some(
            (l: any) =>
              l.status === "COVER_CONFIRMED" &&
              (l.offeredCarerProfileId === profile?.id ||
                p.preferredBackupCarerProfileId === profile?.id ||
                p.backupCarers?.some((b: any) => b.carerProfileId === profile?.id))
          )
      ).length;
      const confirmedOffersCount = offers.filter(
        (o: any) => o.status === "CONFIRMED" || o.status === "ACTIVE" || o.status === "COVERING"
      ).length;

      const relief = Math.max(reliefAssignmentsCount, reliefPlacementsCount, confirmedOffersCount);

      setRoleCounts({ primary, backup, relief });
    });
  }, [profile?.id]);

  const rejectedDocs = complianceDocs.filter(
    (doc) => doc.status === "failed" && doc.rejectionReason,
  );

  return (
    <div className="space-y-6">
      {/* Your Carer Roles - Grace & Goodwill Multi-Tier */}
      <CarerRolesCard
        primaryCount={roleCounts.primary}
        backupCount={roleCounts.backup}
        activeReliefCount={roleCounts.relief}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Application Review Status Badges Widget */}
      <SectionCard className="md:col-span-2 space-y-6">
        <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
          <h3 className="text-lg font-bold text-gold-200">
            Application Progress
          </h3>
          <span className="text-xs text-gold-100/50">
            Status ID: GGW-2026-CARER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-2">
            <p className="text-sm text-gold-100/70">
              Your professional live-in carer application is currently in review
              by our care managers.
            </p>
            <p className="text-xs text-gold-100/50">
              We are currently verifying background reports and licenses
              uploaded.
            </p>
          </div>

          <div className="flex justify-center sm:justify-end">
            <StatusBadge status={applicationStatus} />
          </div>
        </div>
      </SectionCard>


      {/* Share Profile Quick Card */}
      <SectionCard className="space-y-4">
        <div className="flex items-center gap-2 text-gold-200">
          <span className="text-base">🔗</span>
          <h4 className="font-bold text-sm">Share My Profile</h4>
        </div>
        <p className="text-xs text-gold-100/60 leading-relaxed">
          Generate a secure, 30-minute shareable link to introduce your verified profile to prospective clients via WhatsApp, Email, or SMS.
        </p>
        <Button
          id="overview-share-profile-btn"
          variant="primary"
          size="custom"
          onClick={onShareClick || (() => setActiveTab("overview"))}
          className="w-full py-2.5 px-4 gap-2 text-xs !font-medium"
        >
          <span>Share Profile</span>
          <span className="text-xs">→</span>
        </Button>
      </SectionCard>

      {/* Profile completeness Quick Stats widget */}
      <SectionCard className="space-y-4">
        <h4 className="font-bold text-gold-200 text-sm">Dashboard Overview</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4">
            <p className="text-[10px] text-gold-100/50 uppercase tracking-wider font-semibold">
              Docs Uploaded
            </p>
            <p className="text-2xl font-semibold text-gold-50">
              {complianceDocs.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2.5 min-h-[160px] flex flex-col">
            <p className="text-[10px] text-gold-100/50 uppercase tracking-wider font-semibold">
              Selected Dates
            </p>
            {availability.length === 0 ? (
              <p className="text-xs text-gold-100/35 flex-1 flex items-center">
                No availability selected yet
              </p>
            ) : (
              <ul className="text-xs text-gold-100/80 space-y-1.5 overflow-y-auto pr-1 flex-1 scroll-smooth">
                {groupDatesIntoRanges(availability).map((range) => (
                  <li
                    key={`${range.start}-${range.end}`}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT mt-1.5 flex-shrink-0" />
                    <span className="leading-tight">
                      {formatRangeDisplay(range)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Quick links & notifications panel */}
      <SectionCard className="md:col-span-2 space-y-4">
        <h4 className="font-bold text-gold-200 text-sm">Action Required</h4>
        <div className="space-y-3">
          {rejectedDocs.length > 0 ? (
            rejectedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center p-3.5 rounded-xl border border-rose-500/20 bg-rose-950/10"
              >
                <div className="flex items-start gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-rose-300">
                      Rejected: {doc.name}
                    </p>
                    <p className="text-xs text-gold-100/70">
                      Reason :{" "}
                      {doc.rejectionReason ||
                        "Please upload a new version for verification."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("compliance")}
                  className="text-xs font-bold text-gold-DEFAULT hover:text-gold-200 hover:underline px-3.5 py-1.5 rounded-xl border border-gold-300/10 hover:border-gold-300/30 bg-navy-950/40 transition shrink-0 ml-4 animate-none"
                >
                  Update
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-gold-300/10 bg-navy-950/20 text-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mb-2" />
              <p className="text-xs font-bold text-gold-200">
                No Action Required
              </p>
              <p className="text-[11px] text-gold-100/50 mt-1">
                All compliance documents are current and in order.
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  </div>
);
}
