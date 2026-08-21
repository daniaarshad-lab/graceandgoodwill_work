"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  UserCheck,
  User,
  Check,
  Briefcase,
  Layers,
} from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

/** Status styling */
const AVATAR_BG_CLASSES = [
  "bg-amber-500/20 text-amber-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-blue-500/20 text-blue-300",
  "bg-purple-500/20 text-purple-300",
  "bg-rose-500/20 text-rose-300",
  "bg-teal-500/20 text-teal-300",
  "bg-indigo-500/20 text-indigo-300",
  "bg-cyan-500/20 text-cyan-300",
];

function getAvatarBg(idx: number): string {
  return AVATAR_BG_CLASSES[idx % AVATAR_BG_CLASSES.length];
}

/** The care request status that enables the Assign workflow */
const ASSIGN_ELIGIBLE_STATUS = "INFORM_CLIENT_TO_AVAILABLE_CARER";

// Types
interface InterestListCarer {
  id: string;
  carerProfileId: string;
  userId?: string;
  name: string;
  experience: string;
  specialties: string;
  availability: string;
  bio: string;
  profilePhotoUrl: string | null;
  avatarBg: string;
  isAssigned?: boolean;
  isSelected?: boolean;
}

interface CarerCardProps {
  carer: InterestListCarer;
  index: number;
  clientId: string;
  canAssign: boolean;
  assigningId: string | null;
  onAssign: (carerId: string) => void;
  onApprove: (carerId: string) => void;
  hasSelectedCarer?: boolean;
}

function CarerCard({
  carer,
  index,
  clientId,
  canAssign,
  assigningId,
  onAssign,
  onApprove,
  hasSelectedCarer,
}: CarerCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const initials = carer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarBg = carer.avatarBg || getAvatarBg(index);
  const routingId = carer.userId || carer.carerProfileId || carer.id;

  return (
    <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 flex flex-col justify-between space-y-6 hover:border-gold-300/20 transition-all duration-200">
      <div className="space-y-4">
        {/* Header with Avatar and Availability */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`h-16 w-16 rounded-2xl overflow-hidden border border-gold-300/20 flex-shrink-0 ${
              !carer.profilePhotoUrl ? avatarBg : ""
            }`}
          >
            {carer.profilePhotoUrl && !imgError ? (
              <img
                src={carer.profilePhotoUrl}
                alt={carer.name}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className={`h-full w-full flex items-center justify-center text-2xl font-bold ${avatarBg}`}
              >
                {initials}
              </div>
            )}
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
              carer.availability === "Available"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : carer.availability === "Unavailable"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {carer.availability || "Unknown"}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-bold text-gold-50">{carer.name}</h4>
          <p className="text-xs text-gold-100/50 mt-0.5">
            Professional Experience: {carer.experience}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {carer.isSelected && (
              <>
                <div className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  Selected
                </div>
                <div className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  Waiting for Carer Acceptance
                </div>
              </>
            )}
            {carer.isAssigned && !carer.isSelected && (
              <div className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                Selected by Admin
              </div>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gold-300">
            Specialties
          </p>
          <p className="text-xs text-gold-100/80 leading-relaxed line-clamp-2">
            {carer.specialties}
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs text-gold-100/60 leading-relaxed pt-2 border-t border-gold-300/10 line-clamp-2">
          {carer.bio}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        {/* Assign & Approve Buttons */}
        {canAssign && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(carer.carerProfileId ?? carer.id)}
              disabled={
                assigningId === (carer.carerProfileId ?? carer.id) ||
                (hasSelectedCarer && !carer.isSelected) ||
                carer.isSelected
              }
              title={
                hasSelectedCarer && !carer.isSelected
                  ? "Another carer is currently selected and awaiting acceptance"
                  : carer.isSelected
                    ? "This carer is currently selected"
                    : "Approve and create placement offer"
              }
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                (hasSelectedCarer && !carer.isSelected) || carer.isSelected
                  ? "bg-navy-950/60 text-gold-100/30 border border-gold-300/10 cursor-not-allowed opacity-50"
                  : "border border-gold bg-gold text-navy-950 hover:bg-gold-200 cursor-pointer"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {assigningId === (carer.carerProfileId ?? carer.id)
                ? "..."
                : carer.isSelected
                  ? "Selected"
                  : "Approve"}
            </button>
            <button
              onClick={() => onAssign(carer.carerProfileId ?? carer.id)}
              disabled={
                assigningId === (carer.carerProfileId ?? carer.id) ||
                carer.isAssigned
              }
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              {carer.isAssigned
                ? "Assigned"
                : assigningId === (carer.carerProfileId ?? carer.id)
                  ? "..."
                  : "Assign"}
            </button>
          </div>
        )}

        {/* View Carer Details */}
        <button
          onClick={() =>
            router.push(
              `/admin/carers/${routingId}?source=interest-list&clientId=${clientId}`,
            )
          }
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gold-300/30 px-4 py-2.5 text-xs font-semibold text-gold-200 hover:bg-gold-300/10 transition-colors cursor-pointer"
        >
          <User className="w-3 h-3" />
          View Carer Details
        </button>
      </div>
    </div>
  );
}

// Main page wrapper (Suspense boundary for useSearchParams)
export default function AdminClientInterestListPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gold-100/60 font-semibold">
            Loading interest list...
          </p>
        </main>
      }
    >
      <AdminClientInterestListContent />
    </Suspense>
  );
}

// Page content
function AdminClientInterestListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clientId = params.id as string;
  const clientName = searchParams.get("clientName") ?? "Client";
  const initialCareRequestId = searchParams.get("careRequestId");

  const [carers, setCarers] = useState<InterestListCarer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canAssign, setCanAssign] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [careRequestId, setCareRequestId] = useState<string | null>(initialCareRequestId);
  const [clientRequests, setClientRequests] = useState<any[]>([]);

  const loadData = useCallback(async (targetReqId?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch care requests and client details in parallel
      const [careRequestsData, clientDetails] =
        await Promise.all([
          adminService
            .getCareRequests(1, 100, "ALL")
            .catch(() => ({ data: [] })),
          adminService.getClientDetails(clientId).catch(() => null),
        ]);

      const actualClientProfileId = clientDetails?.id;
      const actualUserId = clientDetails?.userId;

      const allRequests = Array.isArray(careRequestsData)
        ? careRequestsData
        : (careRequestsData?.items ??
          careRequestsData?.data ??
          careRequestsData?.careRequests ??
          []);

      const filteredClientRequests = allRequests.filter(
        (req: any) =>
          req.clientProfileId === clientId ||
          req.clientProfile?.id === clientId ||
          req.clientProfile?.userId === clientId ||
          req.clientId === clientId ||
          (actualClientProfileId &&
            req.clientProfileId === actualClientProfileId) ||
          (actualClientProfileId &&
            req.clientProfile?.id === actualClientProfileId) ||
          (actualUserId && req.clientProfile?.userId === actualUserId),
      );

      setClientRequests(filteredClientRequests);

      // Determine which care request to bind to:
      // Priority 1: explicitly requested targetReqId or initialCareRequestId
      // Priority 2: eligible request matching INFORM_CLIENT_TO_AVAILABLE_CARER
      // Priority 3: first non-fulfilled request or first request in list
      const desiredId = targetReqId || initialCareRequestId;
      const eligibleRequest =
        (desiredId
          ? filteredClientRequests.find((req: any) => req.id === desiredId)
          : null) ||
        filteredClientRequests.find(
          (req: any) => req.status === ASSIGN_ELIGIBLE_STATUS,
        ) ||
        filteredClientRequests.find((req: any) => req.status !== "CARER_SELECTED") ||
        filteredClientRequests[0] ||
        null;

      const selectedId = eligibleRequest?.id || null;
      setCareRequestId(selectedId);
      setCanAssign(!!selectedId);

      // Update URL query string with the active careRequestId to survive refreshes
      if (selectedId && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("careRequestId", selectedId);
        if (clientName && clientName !== "Client") {
          url.searchParams.set("clientName", clientName);
        }
        window.history.replaceState(null, "", url.toString());
      }

      // Fetch interest list and applications for this selected care request
      const [interestData, appsData] = await Promise.all([
        adminService.getClientInterestList(clientId, selectedId || undefined).catch(() => []),
        selectedId ? adminService.getCareRequestApplications(selectedId).catch(() => []) : Promise.resolve([]),
      ]);

      const appsList = Array.isArray(appsData) ? appsData : [];
      const assignedCarerIds = appsList
        .filter((app: any) => app.isAssignedByAdmin && app.status === "PENDING")
        .map((app: any) => app.carerProfileId || app.carerProfile?.id);

      const selectedCarerIds = appsList
        .filter((app: any) => app.status === "SELECTED")
        .map((app: any) => app.carerProfileId || app.carerProfile?.id);

      // Normalise the API response - ONLY mark isAssigned / isSelected if matching the CURRENT care request
      const normalised: InterestListCarer[] = (
        Array.isArray(interestData) ? interestData : []
      ).map((item: any, idx: number) => {
        const profile = item.carerProfile ?? item;
        const firstName = profile.firstName || profile.user?.firstName;
        const lastName = profile.lastName || profile.user?.lastName || "";
        const carerProfileId = profile.id ?? item.carerProfileId;

        const isAssigned = assignedCarerIds.includes(carerProfileId);
        const isSelected = selectedCarerIds.includes(carerProfileId);

        return {
          id: profile.id ?? item.id,
          carerProfileId: carerProfileId,
          userId: profile.userId ?? item.userId,
          name:
            profile.fullName ??
            (firstName
              ? `${firstName} ${lastName}`.trim()
              : (profile.name ?? "Unknown")),
          experience: profile.experienceYears
            ? `${profile.experienceYears} years`
            : (profile.experience ?? "—"),
          specialties: profile.careSpecialties ?? profile.specialties ?? "—",
          availability:
            profile.availabilityStatus ?? profile.availability ?? "Unknown",
          bio: profile.summary ?? profile.bio ?? "No biography provided.",
          profilePhotoUrl: profile.profilePhotoUrl ?? null,
          avatarBg: getAvatarBg(idx),
          isAssigned,
          isSelected,
        };
      });

      setCarers(normalised);
    } catch (err: any) {
      setError(
        "Something went wrong while loading the Interest List. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [clientId, initialCareRequestId, clientName]);

  useEffect(() => {
    loadData(initialCareRequestId);
  }, [loadData, initialCareRequestId]);

  const handleRequestChange = (newCareRequestId: string) => {
    setCareRequestId(newCareRequestId);
    loadData(newCareRequestId);
  };

  /**
   * Handler for directly approving a carer and creating a placement.
   */
  const handleApprove = async (carerId: string) => {
    if (!careRequestId) {
      showErrorToast(
        "Approval Failed",
        "Could not identify the target Care Request.",
      );
      return;
    }

    setAssigningId(carerId);
    try {
      await adminService.reviewInterestList({
        careRequestId,
        clientId,
        carerId,
        status: "SELECTED",
      });
      showSuccessToast("Approved", "Placement has been created successfully.");
      await loadData(careRequestId);
    } catch (err: any) {
      showErrorToast(
        "Approval Failed",
        err?.message || "Failed to approve carer.",
      );
    } finally {
      setAssigningId(null);
    }
  };

  /**
   * Handler for assigning a carer to a care request.
   */
  const handleAssign = async (carerId: string) => {
    if (!careRequestId) {
      showErrorToast(
        "Assignment Failed",
        "Could not identify the target Care Request.",
      );
      return;
    }

    setAssigningId(carerId);
    try {
      await adminService.reviewInterestList({
        careRequestId,
        clientId,
        carerId,
        status: "ASSIGNED",
      });
      showSuccessToast(
        "Assigned",
        "Carer has been assigned to the care request (awaiting client approval).",
      );
      await loadData(careRequestId);
    } catch (err: any) {
      showErrorToast(
        "Assignment Failed",
        err?.message || "Failed to assign carer.",
      );
    } finally {
      setAssigningId(null);
    }
  };

  const selectedRequest = clientRequests.find((r) => r.id === careRequestId);

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Navigation */}
        <Link
          href={`/admin/clients/${clientId}${careRequestId ? `?careRequestId=${careRequestId}` : ""}`}
          className="inline-flex items-center gap-2 text-sm text-gold-100/60 hover:text-gold-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Client Profile
        </Link>

        {/* Page Header */}
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                <h1 className="text-2xl font-bold text-gold-50">
                  Client Interest List
                </h1>
              </div>
              <p className="text-sm text-gold-100/60">
                Shortlisted carers for{" "}
                <span className="text-gold-200 font-semibold">
                  {clientName}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-sm font-bold text-gold-50 bg-navy-950 px-4 py-2 rounded-lg border border-gold-DEFAULT/30">
                {loading ? "—" : carers.length} / 8 Selected
              </div>
              <p className="text-[10px] text-gold-100/40 font-medium uppercase tracking-wider">
                Admin Assignment Mode
              </p>
            </div>
          </div>

          {/* Care Request Selection Bar */}
          {clientRequests.length > 0 && (
            <div className="pt-4 border-t border-gold-300/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-950/50 p-4 rounded-xl border border-gold-300/5">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300/60 block">
                    Target Care Request for Assignment
                  </span>
                  <span className="text-xs font-semibold text-gold-100">
                    {selectedRequest
                      ? `${Array.isArray(selectedRequest.careCategory) ? selectedRequest.careCategory.join(", ") : (selectedRequest.careCategory || selectedRequest.careType || "Care Request")}`
                      : "No request selected"}
                  </span>
                </div>
              </div>

              {clientRequests.length > 1 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gold-100/50 font-medium whitespace-nowrap">Switch Request:</span>
                  <select
                    value={careRequestId || ""}
                    onChange={(e) => handleRequestChange(e.target.value)}
                    className="rounded-xl border border-gold-300/20 bg-navy-900 px-3 py-1.5 text-xs font-semibold text-gold-100 outline-none focus:border-gold cursor-pointer"
                  >
                    {clientRequests.map((req) => (
                      <option key={req.id} value={req.id}>
                        {Array.isArray(req.careCategory) ? req.careCategory.join(", ") : (req.careCategory || req.careType || "Care Request")} - {req.status} ({req.startDate ? new Date(req.startDate).toLocaleDateString() : "Flexible"})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                selectedRequest && (
                  <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    Status: {selectedRequest.status}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gold-100/60 font-semibold animate-pulse">
              Fetching interest list...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-10 text-center space-y-3">
            <p className="text-sm font-bold text-red-400">
              Failed to Load Interest List
            </p>
            <p className="text-xs text-red-400/70">{error}</p>
          </div>
        ) : carers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gold-300/20 rounded-2xl bg-navy-950/40">
            <div className="w-16 h-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-gold-300/40" />
            </div>
            <h3 className="text-lg font-bold text-gold-200 mb-2">
              No Shortlisted Carers
            </h3>
            <p className="text-sm text-gold-100/50 max-w-sm mx-auto">
              This client has not shortlisted any carers yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carers.map((carer, idx) => (
              <CarerCard
                key={carer.id}
                carer={carer}
                index={idx}
                clientId={clientId}
                canAssign={canAssign}
                assigningId={assigningId}
                onAssign={handleAssign}
                onApprove={handleApprove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
