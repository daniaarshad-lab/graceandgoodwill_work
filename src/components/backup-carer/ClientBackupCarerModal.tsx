"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Shield,
  Heart,
  Check,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import { clientService } from "@/services/client/client.service";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import CompatibilityBreakdown, { MatchScoreBadge } from "@/components/matching/CompatibilityBreakdown";

interface ClientBackupCarerModalProps {
  placementId: string;
  careRequestId?: string | null;
  clientProfileId?: string;
  targetPriority?: number;
  preferredBackupCarerId?: string | null;
  backupCarers?: any[];
  onClose: () => void;
  onBackupSelected?: (carer: any) => void;
}

export default function ClientBackupCarerModal({
  placementId,
  careRequestId,
  targetPriority = 1,
  preferredBackupCarerId,
  backupCarers = [],
  onClose,
  onBackupSelected,
}: ClientBackupCarerModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [interestList, setInterestList] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [smartMatches, setSmartMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"interest-list" | "applicants" | "smart-matches">(
    "interest-list"
  );
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const current1stBackupId =
    preferredBackupCarerId ||
    backupCarers?.find((b: any) => b.priority === 1)?.carerProfileId ||
    backupCarers?.find((b: any) => b.priority === 1)?.carerProfile?.id;

  const current2ndBackupId =
    backupCarers?.find((b: any) => b.priority === 2)?.carerProfileId ||
    backupCarers?.find((b: any) => b.priority === 2)?.carerProfile?.id;

  const currentTargetBackupId =
    targetPriority === 2 ? current2ndBackupId : current1stBackupId;

  const [designatedId, setDesignatedId] = useState<string | null>(
    currentTargetBackupId || null
  );

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    loadData();
  }, [placementId, careRequestId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [iList, apps, matches] = await Promise.all([
        clientService.getInterestList(careRequestId || undefined).catch(() => []),
        careRequestId
          ? clientService.getCareRequestApplications(careRequestId).catch(() => [])
          : Promise.resolve([]),
        careRequestId
          ? clientService.getCareRequestMatches(careRequestId).catch(() => [])
          : Promise.resolve([]),
      ]);

      const normalised = Array.isArray(iList)
        ? iList
        : (iList as any)?.interestList || (iList as any)?.data || [];
      setInterestList(normalised);

      const appsList = Array.isArray(apps) ? apps : [];
      setApplications(appsList);

      const matchesList = Array.isArray(matches)
        ? matches
        : (matches as any)?.matches || (matches as any)?.data || [];
      setSmartMatches(matchesList);

      if (normalised.length === 0 && appsList.length > 0) {
        setActiveTab("applicants");
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleDesignate = async (
    carerProfileId: string,
    carerName: string,
    rawCarer?: any
  ) => {
    setUpdatingId(carerProfileId);
    try {
      if (targetPriority === 2) {
        await backupCarerService.designateBackupCarer(
          placementId,
          carerProfileId,
          2
        );
      } else {
        await backupCarerService.designatePreferredBackup(
          placementId,
          carerProfileId
        );
        await backupCarerService
          .designateBackupCarer(placementId, carerProfileId, 1)
          .catch(() => {});
      }
      setDesignatedId(carerProfileId);
      showSuccessToast(
        `${targetPriority === 2 ? "2nd Choice" : "Preferred"} Backup Carer Designated!`,
        `${carerName} is now your ${targetPriority === 2 ? "2nd Choice" : "Preferred"} Backup Carer. Zero extra charge.`
      );
      if (onBackupSelected) {
        onBackupSelected({
          id: carerProfileId,
          name: carerName,
          firstName: rawCarer?.firstName || rawCarer?.user?.firstName || carerName.split(" ")[0],
          lastName:
            rawCarer?.lastName ||
            rawCarer?.user?.lastName ||
            carerName.split(" ")[1] ||
            "",
        });
      }
      await loadData();
    } catch (err: any) {
      showErrorToast("Action Failed", err.message || "Failed to designate backup carer.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (carerProfileId: string, carerName: string) => {
    setUpdatingId(carerProfileId);
    try {
      await backupCarerService.removeBackupCarer(placementId, carerProfileId);
      setDesignatedId(null);
      showSuccessToast("Backup Carer Removed", `${carerName} removed from backup role.`);
      await loadData();
    } catch (err: any) {
      showErrorToast("Action Failed", err.message || "Failed to remove backup carer.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getCarerName = (c: any) =>
    (
      c.user
        ? `${c.user.firstName || ""} ${c.user.lastName || ""}`
        : (c.firstName || c.lastName)
        ? `${c.firstName || ""} ${c.lastName || ""}`
        : c.name || ""
    ).trim() || "Carer";

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 sm:p-6 pt-20 sm:pt-24 pb-6 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl rounded-2xl border border-gold-300/25 bg-navy-900 shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-gold-300/15 bg-navy-950/70 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-gold-400/10 px-2.5 py-0.5 rounded-full border border-gold-400/20">
                Client Portal
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Designating Preferred Backup
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Choose Preferred Backup Carer
            </h3>
            <p className="text-xs text-gold-100/60 mt-0.5">
              Select from your interest list or applicants. Zero extra charge.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gold-200/60 hover:text-white p-2 rounded-xl hover:bg-gold-300/10 transition-colors cursor-pointer self-end sm:self-auto"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="shrink-0 bg-navy-950 border-b border-gold-300/10 px-5 sm:px-6 flex items-center justify-start gap-2">
          <button
            onClick={() => setActiveTab("interest-list")}
            className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "interest-list"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Your Interest List</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-navy-800 border border-gold-300/20 text-gold-200 font-mono">
              {interestList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "applicants"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Users className="w-4 h-4 text-gold-400" />
            <span>Applicants</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-navy-800 border border-gold-300/20 text-gold-200 font-mono">
              {applications.length}
            </span>
          </button>
          {careRequestId && (
            <button
              onClick={() => setActiveTab("smart-matches")}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "smart-matches"
                  ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                  : "border-transparent text-gold-100/60 hover:text-gold-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Smart Matches</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-navy-800 border border-gold-300/20 text-gold-200 font-mono">
                {smartMatches.length}
              </span>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <ThinSpinner size="lg" text="Loading carers..." />
            </div>
          ) : (
            <>
              {/* Interest List Tab */}
              {activeTab === "interest-list" && (
                <div className="space-y-4">
                  {interestList.length === 0 ? (
                    <div className="text-center py-14 rounded-2xl border border-gold-300/10 bg-navy-950/40 space-y-2">
                      <Heart className="w-8 h-8 text-rose-400/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        No Carers in Your Interest List
                      </h4>
                      <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                        You haven't shortlisted any carers yet. Browse carers from the{" "}
                        <button
                          onClick={() => router.push("/client/browse-carers")}
                          className="text-gold-DEFAULT underline font-semibold"
                        >
                          Browse Carers
                        </button>{" "}
                        section to build your list.
                      </p>
                    </div>
                  ) : (
                    interestList.map((carer: any, idx: number) => {
                      const carerProfileId = carer.carerProfileId || carer.id;
                      const carerName = getCarerName(carer);
                      const isCurrentBackup =
                        designatedId === carerProfileId ||
                        currentTargetBackupId === carerProfileId;
                      const specialties = Array.isArray(carer.careSpecialties)
                        ? carer.careSpecialties
                        : Array.isArray(carer.specialties)
                        ? carer.specialties
                        : [];

                      return (
                        <div
                          key={carerProfileId || idx}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                            isCurrentBackup
                              ? "border-amber-500/35 bg-amber-950/15 shadow-md"
                              : "border-gold-300/15 bg-navy-950/50 hover:border-gold-300/30"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Carer info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              {carer.profilePhotoUrl ? (
                                <img
                                  src={carer.profilePhotoUrl}
                                  alt={carerName}
                                  className="w-12 h-12 rounded-2xl object-cover border border-gold-300/20 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-300 font-bold border border-rose-500/25 shrink-0">
                                  {carerName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-white truncate">
                                    {carerName}
                                  </h4>
                                  <MatchScoreBadge score={carer.matchScore} />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {carer.experienceYears !== undefined && (
                                    <span className="text-xs text-gold-100/60 font-medium">
                                      {carer.experienceYears} yrs exp
                                    </span>
                                  )}
                                  {carer.hourlyRate && (
                                    <span className="text-xs text-gold-DEFAULT font-mono font-bold">
                                      £{carer.hourlyRate}/hr
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              {isCurrentBackup ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 flex items-center gap-1">
                                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                                    {targetPriority === 2
                                      ? "2nd Backup"
                                      : "Preferred Backup"}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth={false}
                                    disabled={updatingId === carerProfileId}
                                    onClick={() =>
                                      handleRemove(carerProfileId, carerName)
                                    }
                                    className="!border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                                  >
                                    {updatingId === carerProfileId
                                      ? "..."
                                      : "Remove"}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  fullWidth={false}
                                  disabled={!!updatingId}
                                  onClick={() =>
                                    handleDesignate(
                                      carerProfileId,
                                      carerName,
                                      carer
                                    )
                                  }
                                  className="text-xs flex items-center gap-1 font-semibold !border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                                >
                                  <Shield className="w-3 h-3 text-amber-400" />
                                  <span>
                                    {updatingId === carerProfileId
                                      ? "Saving..."
                                      : "Set as Preferred Backup"}
                                  </span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Specialties */}
                          {specialties.length > 0 && (
                            <div className="pt-2 border-t border-gold-300/10 flex flex-wrap gap-1.5">
                              {specialties.slice(0, 4).map((s: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-gold-200/60 border border-gold-300/10"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Compatibility Breakdown */}
                          <CompatibilityBreakdown score={carer.matchScore} breakdown={carer.matchBreakdown} />
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Applicants Tab */}
              {activeTab === "applicants" && (
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-14 rounded-2xl border border-gold-300/10 bg-navy-950/40 space-y-2">
                      <Users className="w-8 h-8 text-gold-DEFAULT/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        No Applicants Yet
                      </h4>
                      <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                        No carers have applied to this care request yet. Check your{" "}
                        <button
                          onClick={() => setActiveTab("interest-list")}
                          className="text-gold-DEFAULT underline font-semibold"
                        >
                          Interest List
                        </button>{" "}
                        to designate a backup from there.
                      </p>
                    </div>
                  ) : (
                    applications.map((app: any) => {
                      const carerProfileId = app.carerProfileId;
                      const carerName = getCarerName(
                        app.carerProfile || app
                      );
                      const isSelected = app.status === "SELECTED";
                      const isCurrentBackup =
                        designatedId === carerProfileId ||
                        currentTargetBackupId === carerProfileId;

                      return (
                        <div
                          key={app.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                            isSelected
                              ? "border-emerald-500/35 bg-emerald-950/15 shadow-md"
                              : isCurrentBackup
                              ? "border-amber-500/35 bg-amber-950/15 shadow-md"
                              : "border-gold-300/15 bg-navy-950/50 hover:border-gold-300/30"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 min-w-0">
                              {app.carerProfile?.profilePhotoUrl ? (
                                <img
                                  src={app.carerProfile.profilePhotoUrl}
                                  alt={carerName}
                                  className="w-12 h-12 rounded-2xl object-cover border border-gold-300/20 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/15 flex items-center justify-center text-gold-DEFAULT font-bold border border-gold-500/25 shrink-0">
                                  {carerName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-white truncate">
                                    {carerName}
                                  </h4>
                                  <MatchScoreBadge score={app.matchScore} />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {isSelected && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Primary Carer
                                    </span>
                                  )}
                                  {isCurrentBackup && (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                      <Shield className="w-3 h-3" /> Preferred Backup
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              {isSelected ? (
                                <span className="text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-1">
                                  <Check className="w-4 h-4" /> Primary Carer
                                </span>
                              ) : isCurrentBackup ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 flex items-center gap-1">
                                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                                    Preferred Backup
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth={false}
                                    disabled={updatingId === carerProfileId}
                                    onClick={() => handleRemove(carerProfileId, carerName)}
                                    className="!border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                                  >
                                    {updatingId === carerProfileId ? "..." : "Remove"}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  fullWidth={false}
                                  disabled={!!updatingId}
                                  onClick={() =>
                                    handleDesignate(carerProfileId, carerName, app.carerProfile)
                                  }
                                  className="text-xs flex items-center gap-1 font-semibold !border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                                >
                                  <Shield className="w-3 h-3 text-amber-400" />
                                  <span>
                                    {updatingId === carerProfileId
                                      ? "Saving..."
                                      : "Set as Preferred Backup"}
                                  </span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Compatibility Breakdown */}
                          <CompatibilityBreakdown score={app.matchScore} breakdown={app.matchBreakdown} />
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* =================================================== */}
              {/* TAB 3: SMART MATCHES                                */}
              {/* =================================================== */}
              {activeTab === "smart-matches" && (
                <div className="space-y-4">
                  {smartMatches.length === 0 ? (
                    <div className="text-center py-14 rounded-2xl border border-gold-300/10 bg-navy-950/40 space-y-2">
                      <Sparkles className="w-8 h-8 text-gold-400/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No Smart Matches Found</h4>
                      <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                        No carers currently meet the compatibility thresholds for this care request.
                      </p>
                    </div>
                  ) : (
                    smartMatches.map((carer: any, idx: number) => {
                      const carerProfileId = carer.carerProfileId || carer.id;
                      const carerName = carer.name || getCarerName(carer);
                      const isCurrentBackup =
                        designatedId === carerProfileId ||
                        currentTargetBackupId === carerProfileId;
                      const specialties = Array.isArray(carer.careSpecialties)
                        ? carer.careSpecialties
                        : Array.isArray(carer.specialties)
                        ? carer.specialties
                        : [];

                      return (
                        <div
                          key={carerProfileId || idx}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                            isCurrentBackup
                              ? "border-amber-500/35 bg-amber-950/15 shadow-md"
                              : "border-gold-300/15 bg-navy-950/50 hover:border-gold-300/30"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Carer info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              {carer.profilePhotoUrl ? (
                                <img
                                  src={carer.profilePhotoUrl}
                                  alt={carerName}
                                  className="w-12 h-12 rounded-2xl object-cover border border-gold-300/20 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-gold-500/15 flex items-center justify-center text-gold-300 font-bold border border-gold-500/25 shrink-0">
                                  {carerName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-white truncate">
                                    {carerName}
                                  </h4>
                                  {carer.isApplicant && (
                                    <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                      Applicant
                                    </span>
                                  )}
                                  {carer.isShortlisted && (
                                    <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                      Shortlisted
                                    </span>
                                  )}
                                  <MatchScoreBadge score={carer.matchScore} />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {carer.experienceYears !== undefined && (
                                    <span className="text-xs text-gold-100/60 font-medium">
                                      {carer.experienceYears} yrs exp
                                    </span>
                                  )}
                                  {carer.hourlyRate && (
                                    <span className="text-xs text-gold-DEFAULT font-mono font-bold">
                                      £{carer.hourlyRate}/hr
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              {isCurrentBackup ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 flex items-center gap-1">
                                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                                    Preferred Backup
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    fullWidth={false}
                                    disabled={updatingId === carerProfileId}
                                    onClick={() =>
                                      handleRemove(carerProfileId, carerName)
                                    }
                                    className="!border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                                  >
                                    {updatingId === carerProfileId
                                      ? "..."
                                      : "Remove"}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  fullWidth={false}
                                  disabled={!!updatingId}
                                  onClick={() =>
                                    handleDesignate(
                                      carerProfileId,
                                      carerName,
                                      carer
                                    )
                                  }
                                  className="text-xs flex items-center gap-1 font-semibold !border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                                >
                                  <Shield className="w-3 h-3 text-amber-400" />
                                  <span>
                                    {updatingId === carerProfileId
                                      ? "Saving..."
                                      : "Set as Preferred Backup"}
                                  </span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Specialties */}
                          {specialties.length > 0 && (
                            <div className="pt-2 border-t border-gold-300/10 flex flex-wrap gap-1.5">
                              {specialties.slice(0, 4).map((s: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-gold-200/60 border border-gold-300/10"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Compatibility Breakdown */}
                          <CompatibilityBreakdown score={carer.matchScore} breakdown={carer.matchBreakdown} />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-gold-300/15 bg-navy-950/80">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
