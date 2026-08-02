"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCarerDetails,
  updateAdminCarerStatus,
} from "@/store/slices/adminSlice";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import {
  DocumentFileType,
  FileCategory,
  getDocumentFileLabel,
} from "@/types/document.types";
import { formatDateArrayToRanges } from "@/utils/dateRangeFormatter";
import ReadOnlyAvailabilityCalendar from "@/components/ReadOnlyAvailabilityCalendar";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  Heart,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  Camera,
  Video,
  Info,
  History,
} from "lucide-react";
import InternalNotes from "../../components/shared/InternalNotes/InternalNotes";
import UserAuditLogs from "../../components/shared/UserAuditLogs";

// Document categories are determined by the backend response

export default function CarerDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gold-100/60 font-semibold">
            Loading carer records...
          </p>
        </main>
      }
    >
      <CarerDetailsContent />
    </Suspense>
  );
}

function CarerDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const carerId = params.carerId as string;
  const dispatch = useAppDispatch();

  const {
    data: carer,
    loading,
    error,
  } = useAppSelector((state) => state.admin.selectedCarer);

  const initialTab =
    (searchParams.get("tab") as "profile" | "documents" | "media" | "audit") ||
    "profile";
  const [activeTab, setActiveTab] = useState<
    "profile" | "documents" | "media" | "audit"
  >(initialTab);
  const [approvingCarer, setApprovingCarer] = useState(false);

  // Dynamic placement data from backend
  const [carerPlacements, setCarerPlacements] = useState<any[]>([]);
  const [placementsLoading, setPlacementsLoading] = useState(false);

  const getFullMediaUrl = (path: string | null | undefined) => {
    if (!path) return undefined;
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("blob:")
    )
      return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    let baseUrl = apiUrl;
    try {
      baseUrl = new URL(apiUrl).origin;
    } catch (e) {
      baseUrl = apiUrl.replace(/\/api\/?$/, "");
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  useEffect(() => {
    if (carerId) {
      dispatch(fetchCarerDetails(carerId));
    }
  }, [dispatch, carerId]);

  // Fetch real placements for this carer once carer details are loaded
  useEffect(() => {
    const carerProfileId = carer?.id;
    if (!carerProfileId) return;

    const loadPlacements = async () => {
      setPlacementsLoading(true);
      try {
        const allPlacements = await adminService.getPlacements();
        const filtered = (allPlacements || []).filter(
          (p: any) => p.carerProfileId === carerProfileId,
        );
        setCarerPlacements(filtered);
      } catch (err) {
        console.error("Failed to load carer placements:", err);
        setCarerPlacements([]);
      } finally {
        setPlacementsLoading(false);
      }
    };

    loadPlacements();
  }, [carer?.id]);

  // Duration calculation for "How long carer has been with Grace & Goodwill"
  const getDurationWithUs = (dateString: string) => {
    if (!dateString) return "N/A";
    const start = new Date(dateString);
    const now = new Date();

    const totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    if (totalMonths < 1) {
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} Month${months === 1 ? "" : "s"}`;
    }

    return `${years} Year${years === 1 ? "" : "s"}${
      months > 0 ? ` ${months} Month${months === 1 ? "" : "s"}` : ""
    }`;
  };

  const getStatusBadgeStyles = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    switch (cleanStatus) {
      case "VERIFIED":
      case "APPROVED":
      case "ACTIVE":
      case "AVAILABLE":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
      case "FAILED":
      case "SUSPENDED":
      case "UNAVAILABLE":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "UNDER_REVIEW":
      case "PARTIALLY AVAILABLE":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "PENDING":
      case "UPLOADED":
      default:
        return "bg-gold/10 text-gold border border-gold/20";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold animate-pulse">
          Fetching carer records...
        </p>
      </main>
    );
  }

  if (error || !carer) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold">Failed to Load Carer Record</h2>
          <p className="text-xs text-red-500/80">
            {error || "The requested carer could not be found."}
          </p>
          <button
            onClick={() => router.push("/admin?tab=carers")}
            className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // Resolve carer mapping details
  const profile = carer.carerProfile || {};
  const carerName =
    `${carer.user?.firstName || carer.firstName || ""} ${carer.user?.lastName || carer.lastName || ""}`.trim() ||
    "Unknown";
  // Registration date from real backend data
  const registrationDate =
    profile.createdAt || carer.user?.createdAt || carer.createdAt;

  // Compute Location Text (Safe fallback to carer object directly)
  const addressVal = profile.address || carer.address || carer.user?.address;
  const cityVal = profile.city || carer.city || carer.user?.city;
  const locationText =
    [addressVal, cityVal].filter(Boolean).join(", ") || "Unknown";

  // Compute Experience
  const expYears =
    profile.experienceYears ||
    carer.experienceYears ||
    carer.user?.experienceYears;
  const expStr =
    profile.experience || carer.experience || carer.user?.experience;
  const displayExperience =
    expStr || (expYears ? `${expYears} Years` : "No experience listed");

  // Compute Biography
  const bioSource =
    profile.bio ||
    profile.summary ||
    carer.bio ||
    carer.summary ||
    carer.user?.bio ||
    carer.user?.summary ||
    "No biography available.";

  // Compute Hourly Rate
  const hourlyRateSource =
    profile.hourlyRate || carer.hourlyRate || carer.user?.hourlyRate;

  // Compute specialties list
  const careSpecSource =
    profile.careSpecialties ||
    carer.careSpecialties ||
    carer.user?.careSpecialties;
  let specialtiesList: string[] = [];
  if (careSpecSource) {
    specialtiesList = Array.isArray(careSpecSource)
      ? careSpecSource
      : typeof careSpecSource === "string"
        ? careSpecSource
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
  } else if (profile.careTypes && Array.isArray(profile.careTypes)) {
    specialtiesList = profile.careTypes;
  }

  // Availability mapping
  const availSource =
    profile.availability || carer.availability || carer.user?.availability;
  let availabilityStr = "No availability configured";
  let availabilityStatus = "Not configured";
  let consecutiveDays = "0 Days";
  let availableHours = "[Backend Required]";

  if (availSource && Array.isArray(availSource)) {
    if (availSource.length > 0 && typeof availSource[0] === "string") {
      availabilityStr = formatDateArrayToRanges(availSource).join(", ");

      // Calculate consecutive available days from the date array
      const sortedDates = availSource
        .map((d: string) => new Date(d).getTime())
        .filter((t: number) => !isNaN(t))
        .sort((a: number, b: number) => a - b);

      if (sortedDates.length > 0) {
        let maxConsecutive = 1;
        let currentConsecutive = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const diffDays = Math.round(
            (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24),
          );
          if (diffDays === 1) {
            currentConsecutive++;
            if (currentConsecutive > maxConsecutive)
              maxConsecutive = currentConsecutive;
          } else if (diffDays > 1) {
            currentConsecutive = 1;
          }
        }
        consecutiveDays = `${maxConsecutive} Days`;
        availabilityStatus =
          maxConsecutive >= 5 ? "Available" : "Partially Available";
      } else {
        consecutiveDays = "0 Days";
      }
    } else {
      const activeDays = availSource
        .filter((d: any) => d.enabled)
        .map((d: any) => {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return dayNames[d.dayOfWeek] || `Day ${d.dayOfWeek}`;
        });
      if (activeDays.length > 0) {
        availabilityStr = `${activeDays.join(", ")}`;
        consecutiveDays = `${activeDays.length} Days`;
        availabilityStatus =
          activeDays.length >= 5 ? "Available" : "Partially Available";
      }
    }
  }

  // DBS status computation
  let dbsStatus = "Pending";
  // Robustly extract documents from various possible backend paths
  const extractDocuments = () => {
    if (Array.isArray(profile.documents) && profile.documents.length > 0)
      return profile.documents;
    if (Array.isArray(carer.documents) && carer.documents.length > 0)
      return carer.documents;
    if (
      Array.isArray(carer.complianceDocuments) &&
      carer.complianceDocuments.length > 0
    )
      return carer.complianceDocuments;
    if (
      Array.isArray(profile.complianceDocuments) &&
      profile.complianceDocuments.length > 0
    )
      return profile.complianceDocuments;
    if (Array.isArray(carer.complianceDocs) && carer.complianceDocs.length > 0)
      return carer.complianceDocs;
    if (
      Array.isArray(profile.complianceDocs) &&
      profile.complianceDocs.length > 0
    )
      return profile.complianceDocs;
    return profile.documents || carer.documents || [];
  };

  const rawDocs = extractDocuments();

  const dbsDoc = rawDocs.find(
    (d: any) =>
      d.fileType === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.fileCategory === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.type === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.category === DocumentFileType.ENHANCED_DBS_CERTIFICATE,
  );
  if (dbsDoc) {
    if (dbsDoc.status === "VERIFIED" || dbsDoc.status === "Verified")
      dbsStatus = "Verified";
    else if (dbsDoc.status === "REJECTED" || dbsDoc.status === "Rejected")
      dbsStatus = "Failed";
  }

  // Duration with us
  const durationWithUs = getDurationWithUs(registrationDate);

  // --- Approve Carer validation ---
  const isCarerAlreadyApproved =
    carer?.user?.status === "APPROVED" || carer?.status === "APPROVED";

  // Notes and Feedback (Checking all possible nestings)
  const carerNotes = carer.notes || profile.notes || carer.user?.notes || [];
  const carerFeedback =
    carer.feedbacks ||
    carer.feedback ||
    profile.feedbacks ||
    profile.feedback ||
    carer.user?.feedbacks ||
    carer.user?.feedback ||
    [];

  // Payment Method
  const paymentMethod =
    profile.paymentMethod ||
    carer.paymentMethod ||
    carer.user?.paymentMethod ||
    "[Backend Required: paymentMethod]";

  const documentValidation = (() => {
    const docs: any[] = rawDocs;
    if (docs.length === 0)
      return {
        allVerified: false,
        message: "No compliance documents uploaded.",
      };

    const unverifiedCount = docs.filter((d) => d.status !== "VERIFIED").length;
    const allVerified = unverifiedCount === 0;

    let message = "";
    if (!allVerified) {
      message = `${unverifiedCount} document(s) not yet verified. All compliance documents must be approved before approving this carer.`;
    }

    return { allVerified, message };
  })();

  const canApproveCarer =
    !isCarerAlreadyApproved && documentValidation.allVerified;

  const handleApproveCarer = async () => {
    if (!canApproveCarer || approvingCarer) return;
    setApprovingCarer(true);
    try {
      await dispatch(
        updateAdminCarerStatus({
          carerId: carer.user?.id || carer.id,
          status: "APPROVED",
        }),
      ).unwrap();
      showSuccessToast(
        "Carer Approved",
        `${carerName} has been approved successfully.`,
      );
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast(
        "Approval Failed",
        err || "Failed to approve carer. Please try again.",
      );
    } finally {
      setApprovingCarer(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8 max-w-7xl mx-auto px-4">
        {/* --- PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            {(() => {
              const getBackNavigation = () => {
                switch (source) {
                  case "interest-list":
                    const listClientId = searchParams.get("clientId");
                    if (listClientId) {
                      return {
                        href: `/admin/clients/${listClientId}/interest-list`,
                        label: "Back to Client Interest List",
                      };
                    }
                    return {
                      href: "/admin?tab=carers",
                      label: "Back to Carer Applications",
                    };
                  case "client-care-requests":
                    return {
                      href: "/admin?tab=requests",
                      label: "Back to Client Care Requests",
                    };
                  case "carer-applications":
                  default:
                    return {
                      href: "/admin?tab=carers",
                      label: "Back to Carer Applications",
                    };
                }
              };
              const { href: backHref, label: backLabel } = getBackNavigation();
              return (
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
                </Link>
              );
            })()}
            <h1 className="text-xl tracking-tight text-gold-200 sm:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold" /> Carer Details
            </h1>
            <p className="text-xs text-gold-100/50 max-w-2xl leading-relaxed mt-1">
              Audit carer credentials, background clearance status, placement
              history, and verification files
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full lg:w-auto shrink-0">
            {/* Carer identity badge */}
            <div className="flex items-center gap-4 bg-navy-900/40 px-4 py-3 rounded-xl border border-gold-300/5 w-full md:w-auto">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-bold uppercase">
                {carerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gold-200 truncate">
                  {carerName}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeStyles(
                      carer.user?.status || carer.status,
                    )}`}
                  >
                    {carer.user?.status || carer.status}
                  </span>
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeStyles(
                      dbsStatus,
                    )}`}
                  >
                    DBS: {dbsStatus}
                  </span>
                  {carer.user?.internalAccountNumber && (
                    <span className="text-[8px] font-bold font-mono text-gold-200 bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20">
                      {carer.user.internalAccountNumber}
                    </span>
                  )}
                  {carer.user?.publicProfileId && (
                    <span className="text-[8px] font-bold font-mono text-gold-200/80 bg-gold-300/10 px-1.5 py-0.5 rounded border border-gold-300/20">
                      {carer.user.publicProfileId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Approve Carer Button */}
            {isCarerAlreadyApproved ? (
              <div className="flex justify-center md:justify-start items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl w-full md:w-auto">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Approved
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-stretch md:items-end gap-1 w-full md:w-auto">
                <button
                  onClick={handleApproveCarer}
                  disabled={!canApproveCarer || approvingCarer}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full md:w-auto ${
                    canApproveCarer && !approvingCarer
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer"
                      : "bg-navy-800/60 text-gold-100/30 border border-gold-300/10 cursor-not-allowed"
                  }`}
                >
                  {approvingCarer ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Approve Carer
                    </>
                  )}
                </button>
                {!canApproveCarer && documentValidation?.message && (
                  <p className="text-[10px] text-gold md:text-right text-center mt-1.5 max-w-[250px] leading-snug">
                    <AlertTriangle className="h-3 w-3 inline-block mb-0.5 mr-1 shrink-0" />
                    {documentValidation.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        {/* --- NAVIGATION TABS BAR --- */}
        <nav className="flex items-center gap-1 border-b border-gold-300/10 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "profile"
                ? "border-b-2 border-gold text-gold bg-gold/5"
                : "text-gold-200/60 hover:text-gold-50"
            }`}
          >
            Profile Dossier
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "documents"
                ? "border-b-2 border-gold text-gold bg-gold/5"
                : "text-gold-200/60 hover:text-gold-50"
            }`}
          >
            Compliance Documents ({rawDocs.length})
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "media"
                ? "border-b-2 border-gold text-gold bg-gold/5"
                : "text-gold-200/60 hover:text-gold-50"
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "audit"
                ? "border-b-2 border-gold text-gold bg-gold/5"
                : "text-gold-200/60 hover:text-gold-50"
            }`}
          >
            Audit Logs
          </button>
        </nav>

        {/* --- TABS CONTENT --- */}
        <div className="transition-all duration-300">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* TWO COLUMN TOP SECTION */}
              <div className="space-y-6">
                {/* ROW 1: Profile & Experience */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Information (col 1) */}
                  <div className="lg:col-span-1 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col h-[340px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2 shrink-0">
                      <User className="h-4 w-4 text-gold/60" /> Profile
                      Information
                    </h3>

                    <div className="space-y-4 text-xs flex-1 overflow-y-auto pr-2 mt-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {carer.user?.internalAccountNumber && (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-gold/5 border border-gold-300/10">
                          <ShieldCheck className="h-4 w-4 text-gold flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                              Internal Account No.
                            </span>
                            <span className="font-bold text-gold-200 font-mono text-xs block">
                              {carer.user.internalAccountNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {carer.user?.publicProfileId && (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-gold/5 border border-gold-300/10">
                          <User className="h-4 w-4 text-gold flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                              Public Profile ID
                            </span>
                            <span className="font-bold text-gold-200 font-mono text-xs block">
                              {carer.user.publicProfileId}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                        <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                            Email Address
                          </span>
                          <span
                            className="font-semibold text-gold-200 truncate block"
                            title={carer.user?.email || carer.email}
                          >
                            {carer.user?.email ||
                              carer.email ||
                              "No email listed"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                        <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                            Phone Number
                          </span>
                          <span className="font-semibold text-gold-200 block">
                            {carer.user?.phoneNumber ||
                              carer.phoneNumber ||
                              "No phone listed"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                        <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                            City & Address
                          </span>
                          <span
                            className="font-semibold text-gold-200 truncate block"
                            title={locationText}
                          >
                            {locationText}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gold-300/5 pt-3">
                        <span className="text-gold-100/40 font-semibold flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gold/60" />{" "}
                          Registered:
                        </span>
                        <span className="text-gold-200 font-bold font-mono">
                          {new Date(registrationDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gold-100/40 font-semibold flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gold/60" />{" "}
                          Duration:
                        </span>
                        <span className="text-gold-200 font-bold italic">
                          {durationWithUs}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Specialties (col 2) */}
                  <div className="lg:col-span-2 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col h-[340px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2 shrink-0">
                      <Briefcase className="h-4 w-4 text-gold/60" /> Experience
                      & Specialties
                    </h3>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 mt-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <div className="text-xs flex items-center gap-2">
                        <span className="text-gold-100/40 font-semibold">
                          Years of Experience:
                        </span>
                        <span className="font-bold text-gold-200 bg-gold/10 px-2 py-0.5 rounded-md border border-gold/20">
                          {displayExperience}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                          Specialties & Care Categories
                        </span>
                        {specialtiesList.length === 0 ? (
                          <span className="text-xs text-gold-100/30">
                            No specialties listed.
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {specialtiesList.map((spec) => (
                              <span
                                key={spec}
                                className="text-[9px] font-bold text-gold bg-navy-950 px-2.5 py-1 rounded-lg border border-gold-300/10"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 border-t border-gold-300/5 pt-3">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">
                          Biography
                        </span>
                        <p className="text-xs text-gold-100/70 leading-relaxed italic">
                          "{bioSource}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: Availability & Placements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Availability (col 1) */}
                  <div className="lg:col-span-1 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col h-[340px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2 shrink-0">
                      <Calendar className="h-4 w-4 text-gold/60" /> Availability
                    </h3>

                    <div className="space-y-3 text-xs flex-1 overflow-y-auto pr-2 mt-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <div className="flex items-center justify-between">
                        <span className="text-gold-100/40 font-semibold">
                          Availability Status:
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(availabilityStatus)}`}
                        >
                          {availabilityStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gold-100/40 font-semibold">
                          Consecutive Days:
                        </span>
                        <span className="text-gold-200 font-bold">
                          {consecutiveDays}
                        </span>
                      </div>

                      {/* <div className="flex items-center justify-between">
                        <span className="text-gold-100/40 font-semibold">Available Hours:</span>
                        <span className="text-rose-400 font-bold font-mono text-[10px]">
                          {availableHours}
                        </span>
                      </div> */}

                      <div className="border-t border-gold-300/5 pt-3 mt-4">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block mb-2">
                          Standard Schedule
                        </span>
                        <ReadOnlyAvailabilityCalendar
                          availability={availSource}
                          wrapperClassName="w-full flex flex-col -mx-2 px-2"
                          hideHeader={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Placement History (col 2) */}
                  <div className="lg:col-span-2 rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col h-[340px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2 shrink-0">
                      <Award className="h-4 w-4 text-gold/60" /> Care Placement
                      History
                    </h3>

                    <div className="flex-1 overflow-x-auto overflow-y-auto pr-2 mt-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <table className="w-full min-w-[500px] text-left text-xs text-gold-100/70 border-collapse">
                        <thead className="sticky top-0 bg-navy-900/90 backdrop-blur z-10 shadow-[0_1px_0_rgba(234,179,8,0.1)]">
                          <tr className="text-[10px] font-bold uppercase tracking-wider text-gold-100/40">
                            <th className="py-2.5 px-2">Client Name</th>
                            <th className="py-2.5 px-2">Physical Location</th>
                            <th className="py-2.5 px-2">Start Date</th>
                            <th className="py-2.5 px-2">End Date</th>
                            <th className="py-2.5 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-300/5">
                          {placementsLoading ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-8 text-center text-gold-100/30 font-semibold"
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-4 w-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                  Loading placements...
                                </div>
                              </td>
                            </tr>
                          ) : carerPlacements.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-8 text-center text-gold-100/30 font-semibold"
                              >
                                No placement history available
                              </td>
                            </tr>
                          ) : (
                            carerPlacements.map(
                              (placement: any, idx: number) => {
                                const clientUser =
                                  placement.clientProfile?.user || {};
                                const clientName =
                                  `${clientUser.firstName || ""} ${clientUser.lastName || ""}`.trim() ||
                                  "Unknown Client";
                                const clientAddress =
                                  placement.clientProfile?.address ||
                                  placement.clientProfile?.city ||
                                  "Address not available";
                                const startDate = placement.startDate;
                                const endDate = placement.endDate;
                                const status = placement.status || "ACTIVE";

                                return (
                                  <tr
                                    key={placement.id || idx}
                                    className="hover:bg-navy-900/20 transition duration-150"
                                  >
                                    <td className="py-3 px-2 font-bold text-gold-200">
                                      {clientName}
                                    </td>
                                    <td
                                      className="py-3 px-2 font-semibold text-gold-100/75 truncate max-w-[150px]"
                                      title={clientAddress}
                                    >
                                      {clientAddress}
                                    </td>
                                    <td className="py-3 px-2 font-mono font-semibold text-gold-100/50">
                                      {startDate
                                        ? new Date(
                                            startDate,
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "Pending"}
                                    </td>
                                    <td className="py-3 px-2 font-mono font-semibold text-gold-100/50">
                                      {!endDate || status === "ACTIVE"
                                        ? "Ongoing"
                                        : new Date(endDate).toLocaleDateString(
                                            "en-GB",
                                            {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            },
                                          )}
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                      <span
                                        className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(status)}`}
                                      >
                                        {status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              },
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* FULL WIDTH BOTTOM SECTIONS: NOTES & FEEDBACK */}
              <div className="space-y-6">
                {/* Internal Notes Timeline */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md">
                  {carer?.id && (
                    <InternalNotes entityId={carer.id} entityType="CARER" />
                  )}
                </div>

                {/* Feedback History */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gold/60" /> Feedback History
                  </h3>

                  {!carerFeedback || carerFeedback.length === 0 ? (
                    <p className="text-xs text-gold-100/30 text-center py-4">
                      No feedback has been submitted for this carer yet.
                    </p>
                  ) : (
                    <div className="space-y-4 relative pl-4 border-l border-gold-300/10 text-xs">
                      {carerFeedback.map((fb: any, idx: number) => {
                        const rating = fb.rating || 0;
                        const clientName = fb.clientProfile?.user
                          ? `${fb.clientProfile.user.firstName} ${fb.clientProfile.user.lastName}`
                          : "Client";
                        const startDate = fb.placement?.startDate
                          ? new Date(
                              fb.placement.startDate,
                            ).toLocaleDateString()
                          : "";
                        const endDate = fb.placement?.endDate
                          ? new Date(fb.placement.endDate).toLocaleDateString()
                          : "Ongoing";
                        const placementDates = startDate
                          ? `${startDate} - ${endDate}`
                          : "";
                        const timestamp = fb.createdAt
                          ? new Date(fb.createdAt).toLocaleDateString()
                          : "";

                        return (
                          <div
                            key={fb.id || idx}
                            className="relative space-y-2 pb-2"
                          >
                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gold border border-navy-950" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= rating ? "text-gold fill-gold" : "text-gold-300/30"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-[10px] text-gold-100/40 font-semibold">
                                {timestamp}
                              </span>
                            </div>
                            <p className="text-gold-100/80 leading-relaxed italic border-l border-gold/30 pl-3 py-0.5">
                              "{fb.message || fb.content || fb.text || ""}"
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 text-[10px] text-gold-100/50 pt-1">
                              {clientName && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-gold/40" />{" "}
                                  {clientName}
                                </span>
                              )}
                              {placementDates && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-gold/40" />{" "}
                                  {placementDates}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md flex flex-col h-[400px] lg:h-[600px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2 shrink-0">
                <FileText className="h-4 w-4 text-gold/60" /> Compliance
                Documents Log
              </h3>

              <div className="flex-1 overflow-x-auto overflow-y-auto pr-2 mt-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full min-w-[800px] text-left text-xs text-gold-100/70 border-collapse">
                  <thead className="sticky top-0 bg-navy-900/95 z-10 shadow-[0_1px_0_rgba(234,179,8,0.1)]">
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-gold-100/40 whitespace-nowrap">
                      <th className="py-3 px-4">Document Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Upload Date</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5">
                    {rawDocs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gold-100/40 text-xs"
                        >
                          No compliance documents found.
                        </td>
                      </tr>
                    ) : (
                      rawDocs.map((uploaded: any, index: number) => {
                        const typeSource =
                          uploaded.fileType || uploaded.type || uploaded.name;
                        const catSource =
                          uploaded.fileCategory || uploaded.category;

                        let fileCategoryClean = catSource
                          ? catSource
                              .split("_")
                              .map(
                                (w: string) =>
                                  w.charAt(0).toUpperCase() +
                                  w.slice(1).toLowerCase(),
                              )
                              .join(" ")
                          : "Document";

                        let displayName =
                          uploaded.fileName || "Unnamed Document";

                        if (
                          typeSource === DocumentFileType.ADDITIONAL_REFERENCE
                        ) {
                          displayName = `Additional Reference ${index + 1}`;
                          fileCategoryClean = "Compliance";
                        } else if (typeSource) {
                          displayName =
                            getDocumentFileLabel(
                              typeSource as DocumentFileType,
                            ) || displayName;
                        }

                        const finalUploadDate = uploaded.createdAt
                          ? new Date(uploaded.createdAt)
                              .toISOString()
                              .split("T")[0]
                          : "Unknown";

                        const finalExpiryDate = "N/A";

                        const statusLabel =
                          uploaded.status === "VERIFIED"
                            ? "Verified"
                            : uploaded.status === "REJECTED"
                              ? "Rejected"
                              : "Uploaded";

                        return (
                          <tr
                            key={uploaded.id || index}
                            className="hover:bg-navy-900/20 transition duration-150"
                          >
                            <td className="py-3.5 px-4 font-bold text-gold-200">
                              {displayName}
                            </td>
                            <td className="py-3.5 px-4 text-gold-100/60 font-semibold">
                              {fileCategoryClean}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gold-100/50">
                              {finalUploadDate}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gold-100/50">
                              {finalExpiryDate}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(
                                  statusLabel,
                                )}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/admin/carers/${carer.userId || carer.id}/document-review?documentId=${uploaded.id}`}
                                className="inline-flex items-center gap-1 rounded-xl bg-gold text-navy-950 font-bold px-3 py-1 text-[10px] whitespace-nowrap hover:bg-gold-200 transition duration-200 cursor-pointer"
                              >
                                Review Document{" "}
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "media" &&
            (() => {
              const activeProfilePhotoUrl =
                profile.profilePhotoUrl ||
                carer.profilePhotoUrl ||
                carer.user?.profilePhotoUrl;
              const activeIntroVideoUrl =
                profile.introVideoUrl ||
                carer.introVideoUrl ||
                carer.user?.introVideoUrl;

              return (
                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-200">
                        Read-Only View
                      </h4>
                      <p className="text-xs text-blue-100/70 mt-1">
                        This is the currently approved media for this carer.
                        Carers cannot modify these directly; they must submit a
                        media update request. You can review and approve any
                        pending media updates in the Profile Update Requests
                        section.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center shadow-soft">
                      <h4 className="text-sm font-semibold text-gold-50 mb-6">
                        Current Profile Picture
                      </h4>
                      <div className="relative w-32 h-32 mb-6">
                        {activeProfilePhotoUrl ? (
                          <img
                            src={getFullMediaUrl(activeProfilePhotoUrl)}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-navy-950 shadow-xl"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-navy-950 flex flex-col items-center justify-center border-4 border-navy-950 shadow-xl">
                            <Camera className="w-8 h-8 text-gold-DEFAULT/40" />
                            <span className="text-[10px] text-gold-DEFAULT/40 mt-2 font-medium tracking-wider">
                              NO PHOTO
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center shadow-soft">
                      <h4 className="text-sm font-semibold text-gold-50 mb-6">
                        Current Introduction Video
                      </h4>
                      <div className="w-full max-w-[240px] h-32 mb-6 rounded-2xl border-2 border-dashed border-gold-DEFAULT/20 bg-black flex flex-col items-center justify-center relative overflow-hidden group-hover:border-gold-DEFAULT/40 transition-colors">
                        {activeIntroVideoUrl ? (
                          <video
                            src={getFullMediaUrl(activeIntroVideoUrl)}
                            className="w-full h-full object-cover"
                            controls
                            controlsList="nodownload"
                          />
                        ) : (
                          <>
                            <Video className="w-8 h-8 text-gold-DEFAULT/30 mb-2" />
                            <span className="text-[10px] text-gold-DEFAULT/40 font-medium tracking-wider text-center px-4">
                              NO VIDEO
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          {activeTab === "audit" && (
            <UserAuditLogs
              userId={carer.user?.id || carer.userId}
              title="Carer Audit Trail"
              subtitle={`Governance and activity log history for ${carerName}`}
            />
          )}
        </div>
      </div>
    </main>
  );
}
