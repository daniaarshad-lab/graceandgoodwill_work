"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, User, UserCheck } from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

/** The care request status that enables the Assign workflow */
const ASSIGN_ELIGIBLE_STATUS = "INFORM_CLIENT_TO_AVAILABLE_CARER";

// ── Types ──────────────────────────────────────────────────────────────────
interface InterestListCarer {
  id: string;
  name: string;
  experience: string;
  specialties: string;
  availability: string;
  bio: string;
  profilePhotoUrl?: string | null;
  avatarBg?: string;
  carerProfileId?: string;
  userId?: string;
}

// ── SafeImage helper (same pattern as client portal) ───────────────────────
function SafeImage({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const [error, setError] = useState(false);
  if (error) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

// ── Avatar background colours (cycle if not provided by API) ───────────────
const AVATAR_COLORS = [
  "bg-gold-DEFAULT/20 text-gold-200",
  "bg-emerald-600/20 text-emerald-300",
  "bg-violet-600/20 text-violet-300",
  "bg-rose-600/20 text-rose-300",
  "bg-sky-600/20 text-sky-300",
];

function getAvatarBg(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ── Carer Card ─────────────────────────────────────────────────────────────
function CarerCard({
  carer,
  index,
  clientId,
  canAssign,
  assigningId,
  onAssign,
}: {
  carer: InterestListCarer;
  index: number;
  clientId: string;
  canAssign: boolean;
  assigningId: string | null;
  onAssign: (carerId: string) => void;
}) {
  const router = useRouter();
  const avatarBg = carer.avatarBg ?? getAvatarBg(index);
  const initials = carer.name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("");

  // The admin carer details page requires the userId, not the carerProfileId
  const routingId = carer.userId ?? carer.carerProfileId ?? carer.id;

  return (
    <div className="flex flex-col justify-between space-y-6 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 hover:border-gold-300/25 transition-all duration-200">
      <div className="space-y-4">
        {/* Avatar & Availability */}
        <div className="flex justify-between items-start">
          <div
            className={`relative h-16 w-16 rounded-full border-2 shrink-0 shadow overflow-hidden bg-navy-950 ${
              !carer.profilePhotoUrl ? "border-gold-300/20" : "border-gold-300/20"
            }`}
          >
            {carer.profilePhotoUrl ? (
              <SafeImage
                src={carer.profilePhotoUrl}
                alt={carer.name}
                fallback={
                  <div
                    className={`h-full w-full flex items-center justify-center text-2xl font-bold ${avatarBg}`}
                  >
                    {initials}
                  </div>
                }
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

        {/* Name & Experience */}
        <div>
          <h4 className="text-lg font-bold text-gold-50">{carer.name}</h4>
          <p className="text-xs text-gold-100/50 mt-0.5">
            Professional Experience: {carer.experience}
          </p>
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
        {/* Assign Button */}
        {canAssign && (
          <button
            onClick={() => onAssign(carer.carerProfileId ?? carer.id)}
            disabled={assigningId === (carer.carerProfileId ?? carer.id)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {assigningId === (carer.carerProfileId ?? carer.id) ? "Assigning..." : "Assign to Care Request"}
          </button>
        )}

        <button
          onClick={() => router.push(`/admin/carers/${routingId}?source=interest-list&clientId=${clientId}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gold-300/30 px-4 py-2.5 text-xs font-semibold text-gold-200 hover:bg-gold-300/10 transition-colors"
        >
          <User className="w-3 h-3" />
          View Carer Details
        </button>
      </div>
    </div>
  );
}

// ── Main page wrapper (Suspense boundary for useSearchParams) ──────────────
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

// ── Page content ───────────────────────────────────────────────────────────
function AdminClientInterestListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clientId = params.id as string;
  const clientName = searchParams.get("clientName") ?? "Client";

  const [carers, setCarers] = useState<InterestListCarer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canAssign, setCanAssign] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [careRequestId, setCareRequestId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch interest list, care requests, and client details in parallel
        const [interestData, careRequestsData, clientDetails] = await Promise.all([
          adminService.getClientInterestList(clientId),
          adminService.getCareRequests(1, 100, "ALL").catch(() => ({ data: [] })),
          adminService.getClientDetails(clientId).catch(() => null),
        ]);

        const actualClientProfileId = clientDetails?.id;
        const actualUserId = clientDetails?.userId;

        // Check if any care request for this client has the assign-eligible status
        const allRequests = Array.isArray(careRequestsData)
          ? careRequestsData
          : careRequestsData?.items ?? careRequestsData?.data ?? careRequestsData?.careRequests ?? [];
          
        console.log("[InterestList] All Requests:", allRequests);
        console.log("[InterestList] Checking against clientId:", clientId, "actualClientProfileId:", actualClientProfileId, "actualUserId:", actualUserId);

        const clientRequests = allRequests.filter(
          (req: any) => 
            req.clientProfileId === clientId || 
            req.clientProfile?.id === clientId ||
            req.clientProfile?.userId === clientId ||
            req.clientId === clientId ||
            (actualClientProfileId && req.clientProfileId === actualClientProfileId) ||
            (actualClientProfileId && req.clientProfile?.id === actualClientProfileId) ||
            (actualUserId && req.clientProfile?.userId === actualUserId)
        );
        
        console.log("[InterestList] Filtered Client Requests:", clientRequests);
        
        const eligibleRequest = clientRequests.find((req: any) => req.status === ASSIGN_ELIGIBLE_STATUS);

        console.log("[InterestList] Eligible Request Found:", eligibleRequest);

        if (eligibleRequest) {
          setCanAssign(true);
          setCareRequestId(eligibleRequest.id);
        } else {
          setCanAssign(false);
          setCareRequestId(null);
        }

        // Normalise the API response — handle both flat and nested shapes
        const normalised: InterestListCarer[] = (Array.isArray(interestData) ? interestData : []).map(
          (item: any, idx: number) => {
            const profile = item.carerProfile ?? item;
            
            const firstName = profile.firstName || profile.user?.firstName;
            const lastName = profile.lastName || profile.user?.lastName || "";
            const carerProfileId = profile.id ?? item.carerProfileId;
            
            return {
              id: profile.id ?? item.id,
              carerProfileId: carerProfileId,
              userId: profile.userId ?? item.userId,
              name:
                profile.fullName ??
                (firstName ? `${firstName} ${lastName}`.trim() : profile.name ?? "Unknown"),
              experience: profile.experienceYears
                ? `${profile.experienceYears} years`
                : profile.experience ?? "—",
              specialties:
                profile.careSpecialties ?? profile.specialties ?? "—",
              availability: profile.availabilityStatus ?? profile.availability ?? "Unknown",
              bio:
                profile.summary ??
                profile.bio ??
                "No biography provided.",
              profilePhotoUrl: profile.profilePhotoUrl ?? null,
              avatarBg: getAvatarBg(idx),
            };
          }
        );
        setCarers(normalised);
      } catch (err: any) {
        setError("Something went wrong while loading the Interest List. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clientId]);

  /**
   * Handler for assigning a carer to a care request.
   */
  const handleAssign = async (carerId: string) => {
    if (!careRequestId) {
      showErrorToast("Assignment Failed", "Could not identify the target Care Request.");
      return;
    }

    setAssigningId(carerId);
    try {
      await adminService.reviewInterestList({
        careRequestId,
        clientId,
        carerId,
        status: "APPROVED"
      });
      showSuccessToast("Assigned", "Carer has been assigned to the care request.");
      
      // Refresh the page to reflect the new state
      window.location.reload();
    } catch (err: any) {
      showErrorToast("Assignment Failed", err?.message || "Failed to assign carer.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Navigation */}
        <Link
          href={`/admin/clients/${clientId}`}
          className="inline-flex items-center gap-2 text-sm text-gold-100/60 hover:text-gold-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Client Profile
        </Link>

        {/* Page Header */}
        <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 md:p-8">
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
                <span className="text-gold-200 font-semibold">{clientName}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-sm font-bold text-gold-50 bg-navy-950 px-4 py-2 rounded-lg border border-gold-DEFAULT/30">
                {loading ? "—" : carers.length} / 8 Selected
              </div>
              <p className="text-[10px] text-gold-100/40 font-medium uppercase tracking-wider">
                View Only • Admin
              </p>
            </div>
          </div>
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
            <p className="text-sm font-bold text-red-400">Failed to Load Interest List</p>
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
              <CarerCard key={carer.id} carer={carer} index={idx} clientId={clientId} canAssign={canAssign} assigningId={assigningId} onAssign={handleAssign} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
