"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin/admin.service";
import { backupCarerService } from "@/services/backupCarer.service";
import {
  User,
  AlertCircle,
  X,
  Shield,
  CheckCircle2,
  Heart,
  Users,
  Check,
  Clock,
} from "lucide-react";
import ThinSpinner from "@/components/ThinSpinner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useAppDispatch } from "@/store/hooks";
import { reviewInterestList } from "@/store/slices/adminSlice";

interface AdminApplicationsModalProps {
  careRequestId?: string | null;
  clientProfileId: string;
  clientName?: string;
  placementId?: string;
  initialTab?: "applicants" | "interest-list";
  onClose: () => void;
  onStatusUpdated?: () => void;
  onBackupSelected?: (carer: any) => void;
}

type TabType = "applicants" | "interest-list";

export default function AdminApplicationsModal({
  careRequestId,
  clientProfileId,
  clientName,
  placementId,
  initialTab = "applicants",
  onClose,
  onStatusUpdated,
  onBackupSelected,
}: AdminApplicationsModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [applications, setApplications] = useState<any[]>([]);
  const [interestList, setInterestList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(
    placementId || careRequestId || ""
  );
  const [designatedBackupCarerId, setDesignatedBackupCarerId] = useState<string | null>(null);

  // Lock outer scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Support ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    loadAll();
  }, [careRequestId, clientProfileId]);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises: Promise<any>[] = [];

      // 1. Load Applications if careRequestId provided
      if (careRequestId) {
        promises.push(
          adminService.getCareRequestApplications(careRequestId).catch(() => [])
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      // 2. Load Client Interest List if clientProfileId provided
      if (clientProfileId) {
        promises.push(
          adminService.getClientInterestList(clientProfileId, careRequestId || undefined).catch(() => [])
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      const [appsData, interestData] = await Promise.all(promises);

      setApplications(Array.isArray(appsData) ? appsData : []);

      if (appsData && appsData.length > 0) {
        const withPlacement = appsData.find((d: any) => d.placementId || d.placement?.id);
        if (withPlacement && !placementId) {
          setSelectedPlacementId(withPlacement.placementId || withPlacement.placement?.id);
        }
      }

      const normalizedInterest = Array.isArray(interestData)
        ? interestData
        : interestData?.interestList || interestData?.data || [];
      setInterestList(normalizedInterest);
    } catch (err: any) {
      setError(err.message || "Failed to load candidates data");
    } finally {
      setLoading(false);
    }
  };

  const selectedApp = applications.find((app) => app.status === "SELECTED");
  const hasSelectedCarer = Boolean(selectedApp);
  const selectedCarerProfileId = selectedApp?.carerProfileId;

  // Handle approving or rejecting an applicant
  const handleUpdateStatus = async (carerProfileId: string, status: string) => {
    if (!carerProfileId || !careRequestId) return;
    setUpdatingId(carerProfileId);
    try {
      await dispatch(
        reviewInterestList({
          careRequestId,
          clientId: clientProfileId,
          carerId: carerProfileId,
          status: status as any,
        })
      ).unwrap();
      showSuccessToast(
        "Application Updated",
        `Carer status successfully set to ${status}.`
      );
      await loadAll();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: any) {
      showErrorToast(
        "Action Failed",
        err.message || "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle selecting a carer from the Client Interest List as Primary
  const handleSelectFromInterestList = async (carerProfileId: string, carerName: string) => {
    if (!careRequestId) {
      showErrorToast("Error", "No care request associated with this selection.");
      return;
    }
    setUpdatingId(carerProfileId);
    try {
      await dispatch(
        reviewInterestList({
          careRequestId,
          clientId: clientProfileId,
          carerId: carerProfileId,
          status: "SELECTED",
        })
      ).unwrap();
      showSuccessToast(
        "Carer Selected as Primary",
        `${carerName} is now selected as the Primary Carer. A placement offer has been created.`
      );
      await loadAll();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: any) {
      showErrorToast("Selection Failed", err.message || "Failed to select carer as primary.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle designating as Preferred Backup Carer
  const handleDesignateBackup = async (carerProfileId: string, carerName: string, rawCarer?: any) => {
    setUpdatingId(carerProfileId);
    const targetPlacementId = selectedPlacementId || placementId || careRequestId || "";
    try {
      await backupCarerService.designatePreferredBackup(
        targetPlacementId,
        carerProfileId
      );
      setDesignatedBackupCarerId(carerProfileId);
      showSuccessToast(
        "Preferred Backup Carer Designated!",
        `${carerName} is now designated as the Preferred Backup Carer. Zero extra charge.`
      );

      if (onBackupSelected) {
        onBackupSelected({
          id: carerProfileId,
          userId: rawCarer?.userId || carerProfileId,
          name: carerName,
          firstName: rawCarer?.firstName || carerName.split(" ")[0],
          lastName: rawCarer?.lastName || carerName.split(" ")[1] || "",
        });
      }

      await loadAll();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err: any) {
      showErrorToast("Action Failed", err.message || "Failed to designate backup carer.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications;
  const filteredInterest = interestList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl rounded-2xl border border-gold-300/25 bg-navy-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* ========================================================= */}
        {/* 1. MODAL HEADER                                           */}
        {/* ========================================================= */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-gold-300/15 bg-navy-950/70 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full border border-gold-400/20">
                Care Request Candidate Hub
              </span>
              {clientName && (
                <span className="text-xs text-gold-100/60">
                  Client: <strong className="text-white">{clientName}</strong>
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Candidates, Applicants & Client Interest List
            </h3>
            <p className="text-xs text-gold-100/60 mt-0.5">
              Review carers who applied directly or were shortlisted in the client’s interest list to allocate Primary or Preferred Backup Carers.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="text-gold-200/60 hover:text-white p-2 rounded-xl hover:bg-gold-300/10 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. TAB NAVIGATION BAR                                     */}
        {/* ========================================================= */}
        <div className="shrink-0 bg-navy-950 border-b border-gold-300/10 px-5 sm:px-6 flex items-center justify-start gap-2">
          {/* Tab 1: Applicants */}
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
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-navy-800 border border-gold-300/20 text-gold-200 font-mono">
              {applications.length}
            </span>
          </button>

          {/* Tab 2: Client Interest List */}
          <button
            onClick={() => setActiveTab("interest-list")}
            className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "interest-list"
                ? "border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                : "border-transparent text-gold-100/60 hover:text-gold-200"
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Client Interest List</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-navy-800 border border-gold-300/20 text-gold-200 font-mono">
              {interestList.length}
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. TAB CONTENT AREA                                       */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <ThinSpinner size="lg" text="Loading candidates & interest list..." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6 text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <>
              {/* =================================================== */}
              {/* TAB 1: APPLICANTS                                   */}
              {/* =================================================== */}
              {activeTab === "applicants" && (
                <div className="space-y-4">
                  {filteredApps.length === 0 ? (
                    <div className="text-center py-14 rounded-2xl border border-gold-300/10 bg-navy-950/40 space-y-2">
                      <Users className="w-8 h-8 text-gold-DEFAULT/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No Direct Applications Yet</h4>
                      <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                        No carers have submitted applications for this care request. You can check the{" "}
                        <button
                          onClick={() => setActiveTab("interest-list")}
                          className="text-gold-DEFAULT underline font-semibold hover:text-gold-200"
                        >
                          Client Interest List
                        </button>{" "}
                        tab to allocate preferred candidates.
                      </p>
                    </div>
                  ) : (
                    filteredApps.map((app) => {
                      const carerProfileId = app.carerProfileId;
                      const carerName =
                        `${app.carerProfile?.user?.firstName || ""} ${app.carerProfile?.user?.lastName || ""}`.trim() ||
                        "Carer";
                      const isAccepted = Boolean(
                        app.isAccepted ||
                          app.placementStatus === "PLACEMENT_CONFIRMED" ||
                          app.placementStatus === "ACTIVE" ||
                          app.placementStatus === "ONGOING"
                      );
                      const isSelected = app.status === "SELECTED";
                      const isPreferredBackup =
                        designatedBackupCarerId === carerProfileId;

                      return (
                        <div
                          key={app.id}
                          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border gap-4 transition-all ${
                            isSelected
                              ? "border-emerald-500/35 bg-emerald-950/15 shadow-md"
                              : isPreferredBackup
                              ? "border-amber-500/35 bg-amber-950/15 shadow-md"
                              : "border-gold-300/15 bg-navy-950/50 hover:border-gold-300/30"
                          }`}
                        >
                          {/* Carer identity */}
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
                                {app.isAssignedByAdmin && (
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                    Assigned by Admin
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    app.status === "PENDING"
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                      : isSelected
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  }`}
                                >
                                  {app.status}
                                </span>

                                {isSelected && (
                                  isAccepted ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Offer Accepted • Primary Carer
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-400" /> Awaiting Carer Acceptance
                                    </span>
                                  )
                                )}

                                {isPreferredBackup && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-amber-400" /> Preferred Backup Carer
                                  </span>
                                )}

                                <span className="text-[11px] text-gold-100/50">
                                  Applied on {new Date(app.createdAt).toLocaleDateString("en-GB")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                            {/* Approve as Primary */}
                            {app.status === "PENDING" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  fullWidth={false}
                                  disabled={updatingId === carerProfileId}
                                  onClick={() => handleUpdateStatus(carerProfileId, "REJECTED")}
                                  className="!border-rose-500/30 !text-rose-400 hover:!bg-rose-500/10 text-xs"
                                >
                                  {updatingId === carerProfileId ? "..." : "Reject"}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  fullWidth={false}
                                  disabled={updatingId === carerProfileId || hasSelectedCarer}
                                  title={
                                    hasSelectedCarer
                                      ? "Another carer is already selected. You can set this carer as the Preferred Backup Carer."
                                      : "Approve and send placement offer as Primary Carer"
                                  }
                                  onClick={() => handleUpdateStatus(carerProfileId, "SELECTED")}
                                  className={`text-xs flex items-center gap-1.5 ${
                                    hasSelectedCarer
                                      ? "!border-gray-700 !text-gray-500 !opacity-40 !cursor-not-allowed"
                                      : "!border-emerald-500/40 !text-emerald-300 hover:!bg-emerald-500/15 font-bold"
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{updatingId === carerProfileId ? "..." : "Approve as Primary"}</span>
                                </Button>
                              </>
                            )}

                            {/* Set as Preferred Backup Carer */}
                            {!isSelected && (
                              <Button
                                variant="outline"
                                size="sm"
                                fullWidth={false}
                                disabled={updatingId === carerProfileId || isPreferredBackup}
                                onClick={() => handleDesignateBackup(carerProfileId, carerName, app.carerProfile)}
                                className="!border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15 text-xs flex items-center gap-1 font-semibold"
                                title="Designate this applicant as the Preferred Backup Carer"
                              >
                                <Shield className="w-3 h-3 text-amber-400" />
                                <span>{isPreferredBackup ? "Designated Backup" : "Set as Backup"}</span>
                              </Button>
                            )}

                            {/* View Carer Details */}
                            <Button
                              variant="ghost-gold"
                              size="sm"
                              fullWidth={false}
                              onClick={() =>
                                router.push(
                                  `/admin/carers/${app.carerProfile?.user?.id || app.carerProfile?.userId || carerProfileId}?source=client-care-requests`
                                )
                              }
                              className="text-xs"
                            >
                              View Carer
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* =================================================== */}
              {/* TAB 2: CLIENT INTEREST LIST                         */}
              {/* =================================================== */}
              {activeTab === "interest-list" && (
                <div className="space-y-4">
                  {filteredInterest.length === 0 ? (
                    <div className="text-center py-14 rounded-2xl border border-gold-300/10 bg-navy-950/40 space-y-2">
                      <Heart className="w-8 h-8 text-rose-400/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No Carers in Client Interest List</h4>
                      <p className="text-xs text-gold-100/50 max-w-sm mx-auto">
                        This client hasn’t shortlisted any carers from their portal yet.
                      </p>
                    </div>
                  ) : (
                    filteredInterest.map((carer: any, idx: number) => {
                      const carerProfileId = carer.carerProfileId || carer.id;
                      const carerName =
                        `${carer.firstName || ""} ${carer.lastName || ""} ${carer.name || ""}`.trim() ||
                        "Shortlisted Carer";
                      const isSelected =
                        selectedCarerProfileId === carerProfileId ||
                        carer.isSelected;
                      const isPreferredBackup =
                        designatedBackupCarerId === carerProfileId;
                      const availability =
                        carer.availabilityStatus || carer.availability || "Available";

                      const specialties = Array.isArray(carer.careSpecialties)
                        ? carer.careSpecialties
                        : Array.isArray(carer.specialties)
                        ? carer.specialties
                        : typeof carer.careSpecialties === "string"
                        ? carer.careSpecialties.split(",")
                        : [];

                      return (
                        <div
                          key={carerProfileId || idx}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                            isSelected
                              ? "border-emerald-500/35 bg-emerald-950/15 shadow-md"
                              : isPreferredBackup
                              ? "border-amber-500/35 bg-amber-950/15 shadow-md"
                              : "border-gold-300/15 bg-navy-950/50 hover:border-gold-300/30"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Carer Header Information */}
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
                                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                    <Heart className="w-2.5 h-2.5 fill-rose-400" /> Shortlisted by Client
                                  </span>
                                  {carer.isAssigned && (
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                      Assigned
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {/* Availability badge */}
                                  <span
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      availability.toLowerCase().includes("avail")
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-slate-700/30 text-slate-300 border border-slate-700/50"
                                    }`}
                                  >
                                    ● {availability}
                                  </span>

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

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                              {/* Select as Primary */}
                              <Button
                                variant="outline"
                                size="sm"
                                fullWidth={false}
                                disabled={updatingId === carerProfileId || (hasSelectedCarer && !isSelected)}
                                title={
                                  hasSelectedCarer && !isSelected
                                    ? "Another carer is currently selected as primary. You can designate this carer as Preferred Backup Carer."
                                    : isSelected
                                    ? "This carer is currently selected"
                                    : "Select this carer as the Primary Carer and generate placement offer"
                                }
                                onClick={() => handleSelectFromInterestList(carerProfileId, carerName)}
                                className={`text-xs flex items-center gap-1.5 ${
                                  isSelected
                                    ? "!border-emerald-500/40 !bg-emerald-500/20 !text-emerald-300 font-bold"
                                    : hasSelectedCarer
                                    ? "!border-gray-700 !text-gray-500 !opacity-40 !cursor-not-allowed"
                                    : "!border-emerald-500/40 !text-emerald-300 hover:!bg-emerald-500/15 font-bold"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>
                                  {updatingId === carerProfileId
                                    ? "..."
                                    : isSelected
                                    ? "Selected as Primary"
                                    : "Select as Primary"}
                                </span>
                              </Button>

                              {/* Set as Preferred Backup Carer */}
                              <Button
                                variant="outline"
                                size="sm"
                                fullWidth={false}
                                disabled={updatingId === carerProfileId || isSelected || isPreferredBackup}
                                onClick={() => handleDesignateBackup(carerProfileId, carerName, carer)}
                                className={`text-xs flex items-center gap-1 font-semibold ${
                                  isPreferredBackup
                                    ? "!border-amber-500/40 !bg-amber-500/20 !text-amber-300"
                                    : "!border-amber-500/40 !text-amber-300 hover:!bg-amber-500/15"
                                }`}
                                title="Designate this shortlisted carer as the Preferred Backup Carer"
                              >
                                <Shield className="w-3 h-3 text-amber-400" />
                                <span>{isPreferredBackup ? "Designated Backup" : "Set as Backup"}</span>
                              </Button>

                              {/* View Carer Profile */}
                              <Button
                                variant="ghost-gold"
                                size="sm"
                                fullWidth={false}
                                onClick={() =>
                                  router.push(
                                    `/admin/carers/${carer.userId || carer.carerProfileId || carer.id}?source=interest-list&clientId=${clientProfileId}`
                                  )
                                }
                                className="text-xs"
                              >
                                View Carer
                              </Button>
                            </div>
                          </div>

                          {/* Specialties Pills & Bio Snippet */}
                          {(specialties.length > 0 || carer.summary || carer.bio) && (
                            <div className="pt-2 border-t border-gold-300/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              {specialties.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] uppercase font-bold text-gold-100/40">
                                    Specialties:
                                  </span>
                                  {specialties.slice(0, 4).map((s: string, sIdx: number) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded-md bg-navy-900 border border-gold-300/10 text-gold-200 text-[10px]"
                                    >
                                      {String(s).trim()}
                                    </span>
                                  ))}
                                  {specialties.length > 4 && (
                                    <span className="text-[10px] text-gold-100/40">
                                      +{specialties.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}

                              {(carer.summary || carer.bio) && (
                                <p className="text-gold-100/60 line-clamp-1 italic max-w-md">
                                  "{carer.summary || carer.bio}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. MODAL FOOTER                                           */}
        {/* ========================================================= */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-gold-300/15 bg-navy-950/80 flex flex-col sm:flex-row sm:items-center gap-3">

          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
