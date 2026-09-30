"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Search,
  X,
  Check,
  Sparkles,
  Users,
  Loader2,
  Trash2,
  Shield,
  Heart,
  Compass,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import Button from "@/components/Button";
import { backupCarerService } from "@/services/backupCarer.service";
import { clientService } from "@/services/client/client.service";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export interface CandidateCarer {
  id: string;
  name: string;
  experienceYears?: number;
  hourlyRate?: number;
  city?: string;
  specialties?: string[];
  email?: string;
  phoneNumber?: string;
  carerProfileId?: string;
  profilePhotoUrl?: string | null;
  bio?: string;
  availabilityStatus?: string;
}

export interface SelectBackupCarerModalProps {
  placementId: string;
  careRequestId?: string | null;
  clientId?: string | null;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  currentBackupCarers?: any[];
  preferredBackupCarer?: any;
  targetPriority?: number; // 1 or 2
  candidates?: CandidateCarer[];
  onBackupSelected?: (carer: CandidateCarer, priority: number) => void;
  onBackupRemoved?: (carerProfileId: string, priority: number) => void;
}

export default function SelectBackupCarerModal({
  placementId,
  careRequestId,
  clientId,
  clientName,
  isOpen,
  onClose,
  isAdmin = false,
  currentBackupCarers = [],
  preferredBackupCarer,
  targetPriority = 1,
  candidates = [],
  onBackupSelected,
  onBackupRemoved,
}: SelectBackupCarerModalProps) {
  const [activePriority, setActivePriority] = useState<number>(targetPriority || 1);
  const [candidateSourceTab, setCandidateSourceTab] = useState<"interest-list" | "browse" | "applicants">("interest-list");

  const [interestListCarers, setInterestListCarers] = useState<CandidateCarer[]>([]);
  const [browseCarers, setBrowseCarers] = useState<CandidateCarer[]>([]);
  const [applicantCarers, setApplicantCarers] = useState<CandidateCarer[]>([]);

  const [selectedCarerId, setSelectedCarerId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemovingId, setIsRemovingId] = useState<string | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Sync priority when targetPriority prop changes
  useEffect(() => {
    if (targetPriority) {
      setActivePriority(targetPriority);
    }
  }, [targetPriority]);

  // Extract current 1st and 2nd backup carer designations
  const backup1 =
    currentBackupCarers.find((b) => b.priority === 1)?.carerProfile ||
    (currentBackupCarers.find((b) => b.priority === 1) as any) ||
    preferredBackupCarer ||
    null;

  const backup2 =
    currentBackupCarers.find((b) => b.priority === 2)?.carerProfile ||
    (currentBackupCarers.find((b) => b.priority === 2) as any) ||
    null;

  const currentForActivePriority = activePriority === 1 ? backup1 : backup2;

  const getCarerDisplayName = (carer: any) => {
    if (!carer) return "";
    if (carer.user) {
      return `${carer.user.firstName || ""} ${carer.user.lastName || ""}`.trim();
    }
    if (carer.firstName || carer.lastName) {
      return `${carer.firstName || ""} ${carer.lastName || ""}`.trim();
    }
    return carer.name || "Designated Backup Carer";
  };

  const formatCarer = (item: any): CandidateCarer => {
    const cp = item.carerProfile || item;
    const u = cp.user || item.user || {};
    const name =
      `${u.firstName || cp.firstName || item.firstName || ""} ${u.lastName || cp.lastName || item.lastName || ""}`.trim() ||
      cp.name ||
      item.name ||
      "Candidate Carer";

    return {
      id: cp.id || item.carerProfileId || item.id,
      carerProfileId: cp.id || item.carerProfileId || item.id,
      name,
      city: cp.city || u.city || item.city || item.location || "",
      experienceYears: cp.experienceYears ?? item.experienceYears ?? 5,
      hourlyRate: cp.hourlyRate ? Number(cp.hourlyRate) : item.hourlyRate ? Number(item.hourlyRate) : undefined,
      specialties: Array.isArray(cp.careSpecialties)
        ? cp.careSpecialties
        : Array.isArray(cp.specialties)
        ? cp.specialties
        : typeof cp.careSpecialties === "string"
        ? cp.careSpecialties.split(",")
        : typeof cp.specialties === "string"
        ? cp.specialties.split(",")
        : [],
      profilePhotoUrl: cp.profilePhotoUrl || u.profilePhotoUrl || item.profilePhotoUrl || null,
      bio: cp.bio || cp.summary || item.bio || item.summary || "",
      availabilityStatus: cp.availabilityStatus || item.availabilityStatus || cp.availability || item.availability || "Available",
    };
  };

  const dedupe = (arr: CandidateCarer[]): CandidateCarer[] => {
    const seen = new Set<string>();
    return arr.filter((c) => {
      const id = c.carerProfileId || c.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // Fetch candidates from Interest List, Browse All Carers, and Applications
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchAllCandidates = async () => {
      try {
        setLoadingCandidates(true);

        // Run fetch in parallel for fast loading
        const [interestData, browseData, appsData] = await Promise.all([
          // 1. Fetch Interest List
          (async () => {
            try {
              if (isAdmin) {
                if (clientId) {
                  const data = await adminService.getClientInterestList(clientId, careRequestId || undefined);
                  return Array.isArray(data) ? data : (data as any)?.interestList || (data as any)?.data || [];
                }
              }
              const data = await clientService.getInterestList();
              return Array.isArray(data) ? data : (data as any)?.interestList || (data as any)?.data || [];
            } catch {
              return [];
            }
          })(),

          // 2. Fetch Browse Carers (All available platform vetted carers)
          (async () => {
            try {
              if (isAdmin) {
                const carersData = await adminService.getCarers(1, 50, "ACTIVE").catch(() => null);
                return Array.isArray(carersData)
                  ? carersData
                  : carersData?.carers || carersData?.items || carersData?.data || [];
              }
              const carersData = await clientService.getCarers();
              return Array.isArray(carersData) ? carersData : [];
            } catch {
              return [];
            }
          })(),

          // 3. Fetch Care Request Applications
          (async () => {
            if (!careRequestId) return [];
            try {
              if (isAdmin) {
                const apps = await adminService.getCareRequestApplications(careRequestId);
                return Array.isArray(apps) ? apps.map((a: any) => a.carerProfile || a) : [];
              }
              const apps = await clientService.getCareRequestApplications(careRequestId);
              return Array.isArray(apps) ? apps.map((a: any) => a.carerProfile || a) : [];
            } catch {
              return [];
            }
          })(),
        ]);

        if (!isMounted) return;

        const formattedInterest = dedupe(interestData.map(formatCarer));
        const formattedBrowse = dedupe(browseData.map(formatCarer));
        const formattedApps = dedupe(appsData.map(formatCarer));

        // Incorporate any explicitly passed candidates prop into interest list
        const initialInterest = candidates && candidates.length > 0
          ? dedupe([...candidates, ...formattedInterest])
          : formattedInterest;

        setInterestListCarers(initialInterest);
        setBrowseCarers(formattedBrowse);
        setApplicantCarers(formattedApps);

        // If interest list is empty but browse has carers, automatically open browse so client immediately sees options
        if (initialInterest.length === 0 && formattedBrowse.length > 0) {
          setCandidateSourceTab("browse");
        }
      } catch (err) {
        console.error("Failed to fetch backup carer candidates", err);
      } finally {
        if (isMounted) setLoadingCandidates(false);
      }
    };

    fetchAllCandidates();
    return () => {
      isMounted = false;
    };
  }, [isOpen, isAdmin, clientId, careRequestId, candidates]);

  if (!isOpen) return null;

  // Active candidate list based on active sub-tab
  const activeCandidatesList =
    candidateSourceTab === "interest-list"
      ? interestListCarers
      : candidateSourceTab === "browse"
      ? browseCarers
      : applicantCarers;

  // Filter out carer already designated in the OTHER slot
  const otherSlotCarerId =
    activePriority === 1
      ? backup2?.carerProfileId || backup2?.id
      : backup1?.carerProfileId || backup1?.id;

  const filteredCandidates = activeCandidatesList
    .filter((c) => (c.carerProfileId || c.id) !== otherSlotCarerId)
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchesName = c.name?.toLowerCase().includes(q) || false;
      const matchesCity = c.city ? c.city.toLowerCase().includes(q) : false;
      const matchesSpec = c.specialties
        ? c.specialties.some((s) => s.toLowerCase().includes(q))
        : false;
      return matchesName || matchesCity || matchesSpec;
    });

  const handleConfirm = async () => {
    // Find chosen carer in current list or across all candidate pools
    const chosen =
      activeCandidatesList.find((c) => c.id === selectedCarerId) ||
      interestListCarers.find((c) => c.id === selectedCarerId) ||
      browseCarers.find((c) => c.id === selectedCarerId) ||
      applicantCarers.find((c) => c.id === selectedCarerId);
    if (!chosen) return;

    setIsSubmitting(true);
    try {
      const targetCarerId = chosen.carerProfileId || chosen.id;
      await backupCarerService.designateBackupCarer(
        placementId,
        targetCarerId,
        activePriority
      );

      showSuccessToast(
        `${activePriority === 1 ? "1st Choice" : "2nd Choice"} Backup Carer Designated`,
        `${chosen.name} has been set as the ${
          activePriority === 1 ? "1st Choice Preferred" : "2nd Choice Secondary"
        } Backup Carer for ${clientName}. Zero extra fees.`
      );

      if (onBackupSelected) {
        onBackupSelected(chosen, activePriority);
      }
      setSelectedCarerId("");
      onClose();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to designate backup carer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExisting = async (carerProfileId: string, priority: number) => {
    if (
      !confirm(
        `Are you sure you want to remove this ${
          priority === 1 ? "1st Choice" : "2nd Choice"
        } Backup Carer?`
      )
    ) {
      return;
    }

    setIsRemovingId(carerProfileId);
    try {
      await backupCarerService.removeBackupCarer(placementId, carerProfileId);
      showSuccessToast(
        "Backup Carer Removed",
        `${priority === 1 ? "1st Choice" : "2nd Choice"} Backup Carer removed successfully.`
      );
      if (onBackupRemoved) {
        onBackupRemoved(carerProfileId, priority);
      }
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to remove backup carer.");
    } finally {
      setIsRemovingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl p-6 relative space-y-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Designate Backup Carer (Up to 2)
            </h3>
            <p className="text-xs text-gold-100/60">
              Placement: <span className="text-gold-200 font-semibold">{clientName}</span>
            </p>
          </div>
        </div>

        {/* Priority Slot Selection Tabs (1st Choice vs 2nd Choice) */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-navy-950/80 border border-gold-300/15 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActivePriority(1);
              setSelectedCarerId("");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activePriority === 1
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md"
                : "text-gold-100/60 hover:text-gold-100 border border-transparent"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>1st Choice (Preferred)</span>
            {backup1 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Allocated" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePriority(2);
              setSelectedCarerId("");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activePriority === 2
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md"
                : "text-gold-100/60 hover:text-gold-100 border border-transparent"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>2nd Choice (Secondary)</span>
            {backup2 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Allocated" />
            )}
          </button>
        </div>

        {/* Currently Allocated Carer Card for this Slot */}
        {currentForActivePriority ? (
          <div className="p-3 rounded-xl bg-navy-950/70 border border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                {currentForActivePriority.profilePhotoUrl ? (
                  <img
                    src={currentForActivePriority.profilePhotoUrl}
                    alt="Current Backup"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getCarerDisplayName(currentForActivePriority).charAt(0) || "B"
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {getCarerDisplayName(currentForActivePriority)}
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Currently Assigned
                  </span>
                </div>
                <p className="text-[11px] text-gold-100/60">
                  {activePriority === 1
                    ? "First in line when primary carer is on leave"
                    : "Second in line if first choice is unavailable"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleRemoveExisting(
                  currentForActivePriority.carerProfileId ||
                    currentForActivePriority.id,
                  activePriority
                )
              }
              disabled={isRemovingId === (currentForActivePriority.carerProfileId || currentForActivePriority.id)}
              className="text-xs !border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10 shrink-0"
              title="Remove this backup carer from this slot"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-gold-300/5 border border-gold-300/15 text-xs text-gold-100/70 flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4 text-gold-DEFAULT shrink-0" />
            <span>
              Select a carer below to assign as your{" "}
              <strong className="text-white">
                {activePriority === 1 ? "1st Choice Preferred" : "2nd Choice Secondary"}
              </strong>{" "}
              Backup Carer. Zero extra fees.
            </span>
          </div>
        )}

        {/* Source Selection Tabs: Interest List vs Browse All Carers (and Applicants if available) */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-300/10 pb-2 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Tab 1: Interest List */}
            <button
              type="button"
              onClick={() => {
                setCandidateSourceTab("interest-list");
                setSelectedCarerId("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                candidateSourceTab === "interest-list"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                  : "text-gold-100/60 hover:text-gold-200 border border-transparent"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Your Interest List</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-navy-950 border border-gold-300/20 text-gold-200 font-mono">
                {interestListCarers.length}
              </span>
            </button>

            {/* Tab 2: Browse Carers */}
            <button
              type="button"
              onClick={() => {
                setCandidateSourceTab("browse");
                setSelectedCarerId("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                candidateSourceTab === "browse"
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/40 shadow-sm"
                  : "text-gold-100/60 hover:text-gold-200 border border-transparent"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-gold-DEFAULT" />
              <span>Browse All Carers</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-navy-950 border border-gold-300/20 text-gold-200 font-mono">
                {browseCarers.length}
              </span>
            </button>

            {/* Tab 3: Applicants (if careRequestId applications exist) */}
            {applicantCarers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCandidateSourceTab("applicants");
                  setSelectedCarerId("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  candidateSourceTab === "applicants"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                    : "text-gold-100/60 hover:text-gold-200 border border-transparent"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Applicants</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-navy-950 border border-gold-300/20 text-gold-200 font-mono">
                  {applicantCarers.length}
                </span>
              </button>
            )}
          </div>

          {/* Quick link to full browse carers directory */}
          <Link
            href={isAdmin ? "/admin/carers" : "/client/browse-carers"}
            target="_blank"
            className="text-[11px] text-gold-DEFAULT hover:text-gold-200 flex items-center gap-1 font-semibold transition-colors shrink-0"
            title="Open full carers directory in a new tab"
          >
            <span>Full Directory</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-gold-100/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              candidateSourceTab === "interest-list"
                ? `Search shortlisted carers in your interest list...`
                : candidateSourceTab === "browse"
                ? `Search all vetted carers by name, city, specialty...`
                : `Search applicants by name, specialty...`
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold-300/20 bg-navy-950 pl-9 pr-3 py-2 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none"
          />
        </div>

        {/* Candidates List Area */}
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[170px] max-h-[300px]">
          {loadingCandidates ? (
            <div className="text-center py-10 px-4 rounded-xl bg-navy-950/40 border border-gold-300/10 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
              <p className="text-xs text-gold-100/70">
                Loading available carer candidates...
              </p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl bg-navy-950/40 border border-gold-300/10 space-y-3">
              {candidateSourceTab === "interest-list" ? (
                <>
                  <Heart className="w-8 h-8 text-rose-400/40 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs text-gold-100/80 font-bold">
                      No Carers in Your Interest List Yet
                    </p>
                    <p className="text-[11px] text-gold-100/50 max-w-sm mx-auto">
                      You haven't shortlisted any carers to your interest list yet. You can browse all vetted professional carers directly here to designate your backup carer.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setCandidateSourceTab("browse");
                        setSearchQuery("");
                      }}
                      className="text-xs font-bold"
                    >
                      <Compass className="w-3.5 h-3.5 mr-1.5" />
                      Browse All Carers ({browseCarers.length})
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Users className="w-8 h-8 text-gold-100/30 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs text-gold-100/70 font-medium">
                      No candidates match your search.
                    </p>
                    <p className="text-[11px] text-gold-100/40">
                      Try adjusting your keywords or clearing the search box.
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            filteredCandidates.map((carer) => {
              const isSelected = selectedCarerId === carer.id;
              const isAlreadyThisSlot =
                (currentForActivePriority?.carerProfileId || currentForActivePriority?.id) ===
                (carer.carerProfileId || carer.id);

              return (
                <div
                  key={carer.id}
                  onClick={() => setSelectedCarerId(carer.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-gold bg-gold-300/15 text-white ring-1 ring-gold shadow-md"
                      : isAlreadyThisSlot
                      ? "border-amber-500/30 bg-amber-950/15 text-gold-100"
                      : "border-gold-300/10 bg-navy-950/60 text-gold-100/80 hover:border-gold-300/30 hover:bg-navy-950/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Carer Photo / Initial */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-gold-300/20 text-gold-200 border border-gold-300/30 flex items-center justify-center font-bold text-sm shrink-0">
                      {carer.profilePhotoUrl ? (
                        <img
                          src={carer.profilePhotoUrl}
                          alt={carer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        carer.name.charAt(0) || "C"
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">
                          {carer.name}
                        </span>
                        {carer.experienceYears !== undefined && (
                          <span className="text-[10px] text-gold-400 font-semibold bg-gold-300/10 px-2 py-0.5 rounded-full shrink-0">
                            {carer.experienceYears} yrs exp
                          </span>
                        )}
                        {carer.availabilityStatus && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                              carer.availabilityStatus.toLowerCase().includes("avail")
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : "bg-slate-700/30 text-slate-300 border border-slate-700/50"
                            }`}
                          >
                            ● {carer.availabilityStatus}
                          </span>
                        )}
                        {isAlreadyThisSlot && (
                          <span className="text-[9px] font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                            Current Choice
                          </span>
                        )}
                      </div>

                      {(carer.city || carer.hourlyRate) && (
                        <p className="text-[11px] text-gold-100/60 flex items-center gap-2">
                          {carer.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gold-DEFAULT" /> {carer.city}
                            </span>
                          )}
                          {carer.hourlyRate && (
                            <span className="text-gold-200 font-mono font-semibold">
                              £{carer.hourlyRate}/hr
                            </span>
                          )}
                        </p>
                      )}

                      {carer.specialties && carer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {carer.specialties.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] bg-navy-900 border border-gold-300/10 text-gold-200/80 px-1.5 py-0.2 rounded"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection Radio / Checkmark */}
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-gold bg-gold text-navy-950 font-bold"
                        : "border-gold-300/20 bg-navy-950 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gold-300/10 shrink-0">
          <p className="text-[11px] text-gold-100/50">
            {activePriority === 1 ? "Configuring 1st Choice" : "Configuring 2nd Choice"}
          </p>

          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost-gold"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={isSubmitting || !selectedCarerId || filteredCandidates.length === 0}
              className="font-bold shadow-md shadow-gold/20 text-xs"
            >
              {isSubmitting
                ? "Assigning..."
                : `Confirm as ${activePriority === 1 ? "1st Choice" : "2nd Choice"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
