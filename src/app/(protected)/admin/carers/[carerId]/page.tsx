"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarerDetails, updateAdminCarerStatus } from "@/store/slices/adminSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { DocumentFileType, FileCategory, getDocumentFileLabel } from "@/types/document.types";
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
} from "lucide-react";

// Types for carer extended details
interface CarerExtended {
  registrationDate: string;
  availableFrom: string;
  availableUntil: string;
  consecutiveDays: string;
  availabilityStatus: string;
  biography: string;
  placements: {
    clientName: string;
    clientAddress: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  notes: {
    title: string;
    timestamp: string;
    content: string;
    adminName: string;
  }[];
  feedback: {
    type: string;
    timestamp: string;
    content: string;
  }[];
}

const getMockDocDetails = (category: string) => {
  const types: Record<string, { type: string; uploadDate: string; expiryDate: string }> = {
    "CRIMINAL_RECORD_CHECK": {
      type: "Criminal Record Check",
      uploadDate: "2026-05-10",
      expiryDate: "2029-05-10",
    },
    "DRIVERS_LICENSE": {
      type: "Identification",
      uploadDate: "2026-05-12",
      expiryDate: "2031-11-20",
    },
    "DEMENTIA_SUPPORT": {
      type: "Certification",
      uploadDate: "2026-05-14",
      expiryDate: "Lifetime",
    },
    "NURSES_REGISTRY": {
      type: "Professional License",
      uploadDate: "2026-05-15",
      expiryDate: "2027-03-31",
    },
    "PASSPORT": {
      type: "Identification",
      uploadDate: "2026-05-08",
      expiryDate: "2036-05-08",
    },
    "RIGHT_TO_WORK": {
      type: "Compliance Check",
      uploadDate: "2026-05-08",
      expiryDate: "N/A",
    },
    "PROOF_OF_ADDRESS": {
      type: "Identification Verification",
      uploadDate: "2026-05-09",
      expiryDate: "N/A",
    },
  };
  return types[category] || {
    type: "Verification Document",
    uploadDate: "2026-05-16",
    expiryDate: "N/A",
  };
};

const getCarerExtendedDetails = (carerId: string): CarerExtended => {
  const db: Record<string, CarerExtended> = {
    // Helena Rostova
    "carer-1": {
      registrationDate: "2026-06-04T10:00:00.000Z",
      availableFrom: "08:00 AM",
      availableUntil: "08:00 PM",
      consecutiveDays: "5 Days (Mon - Fri)",
      availabilityStatus: "Available",
      biography: "Compassionate and dedicated carer with over 5 years of experience in elderly care, specialized in post-operative recovery, personal hygiene, and emotional support.",
      placements: [
        {
          clientName: "Winston Churchill",
          clientAddress: "10 Downing Street, London, SW1A 2AA",
          startDate: "2026-05-29",
          endDate: "Ongoing",
          status: "Active",
        },
        {
          clientName: "Arthur Pendelton",
          clientAddress: "42 Baker Street, London, NW1 6XE",
          startDate: "2026-01-15",
          endDate: "2026-04-30",
          status: "Completed",
        }
      ],
      notes: [
        {
          title: "Performance Review",
          timestamp: "24 Jun 2026 - 10:35 AM",
          content: "Client reported excellent communication and reliability.",
          adminName: "Sarah Connor"
        },
        {
          title: "Initial Document Audit",
          timestamp: "04 Jun 2026 - 02:15 PM",
          content: "DBS and professional licenses verified successfully during registry check.",
          adminName: "James Bond"
        }
      ],
      feedback: [
        {
          type: "Client Feedback",
          timestamp: "22 Jun 2026 - 04:30 PM",
          content: "Helena was extremely patient and supportive during Churchill's morning session. Family expressed sincere gratitude."
        },
        {
          type: "Concerns Raised",
          timestamp: "10 Jun 2026 - 11:00 AM",
          content: "Slight delay reported in arrival due to local transport strike. Issue resolved with prompt notification."
        },
        {
          type: "Follow-up Actions",
          timestamp: "05 Jun 2026 - 09:00 AM",
          content: "Conducted onboarding telephone verification with the carer to review guidelines."
        }
      ]
    },
    // Eleanor Vance
    "carer-2": {
      registrationDate: "2026-05-15T09:00:00.000Z",
      availableFrom: "09:00 AM",
      availableUntil: "06:00 PM",
      consecutiveDays: "3 Days (Tue - Thu)",
      availabilityStatus: "Partially Available",
      biography: "Specialist in dementia care and physical support, committed to promoting independence and dignity in comfortable residential environments.",
      placements: [
        {
          clientName: "Arthur Pendelton",
          clientAddress: "42 Baker Street, London, NW1 6XE",
          startDate: "2026-06-01",
          endDate: "Ongoing",
          status: "Active",
        }
      ],
      notes: [
        {
          title: "Dementia Cert Verification",
          timestamp: "18 May 2026 - 11:00 AM",
          content: "Verified dementia certificate from Alzheimer's Society.",
          adminName: "Sarah Connor"
        }
      ],
      feedback: [
        {
          type: "Client Feedback",
          timestamp: "15 Jun 2026 - 02:00 PM",
          content: "Eleanor is fantastic. Arthur really connects with her and feels much more confident during walks."
        }
      ]
    }
  };

  return db[carerId] || {
    registrationDate: "2026-06-10T12:00:00.000Z",
    availableFrom: "09:00 AM",
    availableUntil: "05:00 PM",
    consecutiveDays: "4 Days (Mon - Thu)",
    availabilityStatus: "Available",
    biography: "Professional carer dedicated to providing exceptional support, daily assistance, and specialized therapeutic companionship.",
    placements: [],
    notes: [
      {
        title: "Profile Created",
        timestamp: "10 Jun 2026 - 12:00 PM",
        content: "Initial carer profile created and awaiting review.",
        adminName: "James Bond"
      }
    ],
    feedback: []
  };
};

const REQUIRED_DOCUMENT_CATEGORIES = [
  { category: DocumentFileType.ENHANCED_DBS_CERTIFICATE, label: "Enhanced DBS Certificate", type: FileCategory.COMPLIANCE },
  { category: DocumentFileType.PASSPORT, label: "Passport", type: FileCategory.IDENTITY },
  { category: DocumentFileType.DRIVING_LICENCE, label: "Driving Licence", type: FileCategory.IDENTITY },
  { category: DocumentFileType.PROOF_OF_ADDRESS, label: "Proof of Address", type: FileCategory.IDENTITY },
  { category: DocumentFileType.RIGHT_TO_WORK, label: "Right to Work", type: FileCategory.RIGHT_TO_WORK },
  { category: DocumentFileType.NATIONAL_INSURANCE_PROOF, label: "National Insurance", type: FileCategory.IDENTITY },
  { category: DocumentFileType.PUBLIC_LIABILITY_INSURANCE, label: "Public Liability Insurance", type: FileCategory.INSURANCE },
  { category: DocumentFileType.PROFESSIONAL_INDEMNITY_INSURANCE, label: "Professional Indemnity Insurance", type: FileCategory.INSURANCE },
  { category: DocumentFileType.CV_RESUME, label: "CV / Resume", type: FileCategory.PREVIOUS_EMPLOYMENT },
  { category: DocumentFileType.PROFESSIONAL_REFERENCE_1, label: "Professional Reference 1", type: FileCategory.COMPLIANCE },
  { category: DocumentFileType.PROFESSIONAL_REFERENCE_2, label: "Professional Reference 2", type: FileCategory.COMPLIANCE },
];

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
  const carerId = params.carerId as string;
  const dispatch = useAppDispatch();

  const { data: carer, loading, error } = useAppSelector(
    (state) => state.admin.selectedCarer
  );

  const [activeTab, setActiveTab] = useState<"profile" | "documents">("profile");
  const [approvingCarer, setApprovingCarer] = useState(false);

  useEffect(() => {
    if (carerId) {
      dispatch(fetchCarerDetails(carerId));
    }
  }, [dispatch, carerId]);

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
  const carerName = `${carer.firstName} ${carer.lastName}`;
  const ext = getCarerExtendedDetails(carer.id);

  // Compute specialties list
  let specialtiesList: string[] = [];
  if (profile.careSpecialties) {
    specialtiesList = Array.isArray(profile.careSpecialties)
      ? profile.careSpecialties
      : typeof profile.careSpecialties === "string"
        ? profile.careSpecialties
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
  } else if (profile.careTypes && Array.isArray(profile.careTypes)) {
    specialtiesList = profile.careTypes;
  }

  // Availability string mapping
  let availabilityStr = "Not configured";
  if (profile.availability) {
    if (typeof profile.availability === "string") {
      availabilityStr = profile.availability;
    } else if (Array.isArray(profile.availability)) {
      const activeDays = profile.availability
        .filter((d: any) => d.enabled)
        .map((d: any) => {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return dayNames[d.dayOfWeek] || `Day ${d.dayOfWeek}`;
        });
      if (activeDays.length > 0) {
        availabilityStr = `${activeDays.join(", ")}`;
      }
    }
  }

  // DBS status computation
  let dbsStatus = "Pending";
  // Robustly extract documents from various possible backend paths
  const extractDocuments = () => {
    if (Array.isArray(profile.documents) && profile.documents.length > 0) return profile.documents;
    if (Array.isArray(carer.documents) && carer.documents.length > 0) return carer.documents;
    if (Array.isArray(carer.complianceDocuments) && carer.complianceDocuments.length > 0) return carer.complianceDocuments;
    if (Array.isArray(profile.complianceDocuments) && profile.complianceDocuments.length > 0) return profile.complianceDocuments;
    if (Array.isArray(carer.complianceDocs) && carer.complianceDocs.length > 0) return carer.complianceDocs;
    if (Array.isArray(profile.complianceDocs) && profile.complianceDocs.length > 0) return profile.complianceDocs;
    return profile.documents || carer.documents || [];
  };
  
  const rawDocs = extractDocuments();

  const dbsDoc = rawDocs.find(
    (d: any) => 
      d.fileType === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.fileCategory === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.type === DocumentFileType.ENHANCED_DBS_CERTIFICATE ||
      d.category === DocumentFileType.ENHANCED_DBS_CERTIFICATE
  );
  if (dbsDoc) {
    if (dbsDoc.status === "VERIFIED" || dbsDoc.status === "Verified") dbsStatus = "Verified";
    else if (dbsDoc.status === "REJECTED" || dbsDoc.status === "Rejected") dbsStatus = "Failed";
  }

  // Duration with us
  const durationWithUs = getDurationWithUs(ext.registrationDate || profile.createdAt || carer.createdAt);

  // --- Approve Carer validation ---
  const isCarerAlreadyApproved = carer?.user?.status === "APPROVED" || carer?.status === "APPROVED";

  const documentValidation = (() => {
    const docs: any[] = rawDocs;
    const missingCategories: string[] = [];
    const unverifiedCategories: string[] = [];

    for (const req of REQUIRED_DOCUMENT_CATEGORIES) {
      const found = docs.find((d: any) => 
        d.fileType === req.category ||
        d.fileCategory === req.category ||
        d.type === req.category ||
        d.category === req.category
      );
      if (!found) {
        missingCategories.push(req.label);
      } else if (found.status !== "VERIFIED") {
        unverifiedCategories.push(req.label);
      }
    }

    const allVerified = missingCategories.length === 0 && unverifiedCategories.length === 0;
    let message = "";
    if (missingCategories.length > 0) {
      message = `Missing required documents: ${missingCategories.join(", ")}.`;
    } else if (unverifiedCategories.length > 0) {
      message = `Documents not yet verified: ${unverifiedCategories.join(", ")}.`;
    }
    if (!allVerified && !message) {
      message = "All required compliance documents must be approved before approving this carer.";
    }

    return { allVerified, message };
  })();

  const canApproveCarer = !isCarerAlreadyApproved && documentValidation.allVerified;

  const handleApproveCarer = async () => {
    if (!canApproveCarer || approvingCarer) return;
    setApprovingCarer(true);
    try {
      await dispatch(
        updateAdminCarerStatus({ carerId: carer.user?.id || carer.id, status: "APPROVED" })
      ).unwrap();
      showSuccessToast("Carer Approved", `${carerName} has been approved successfully.`);
      dispatch(fetchCarerDetails(carerId));
    } catch (err: any) {
      showErrorToast("Approval Failed", err || "Failed to approve carer. Please try again.");
    } finally {
      setApprovingCarer(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8 max-w-7xl mx-auto px-4">
        {/* --- PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin?tab=carers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Carer Applications
            </Link>
            <h1 className="text-xl tracking-tight text-gold-200 sm:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold" /> Carer Details
            </h1>
            <p className="text-xs text-gold-100/50">
              Audit carer credentials, background clearance status, placement history, and verification files
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Carer identity badge */}
            <div className="flex items-center gap-4 bg-navy-900/40 px-4 py-3 rounded-xl border border-gold-300/5">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 font-bold uppercase">
                {carerName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-gold-200">{carerName}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeStyles(
                      carer.status
                    )}`}
                  >
                    {carer.status}
                  </span>
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getStatusBadgeStyles(
                      dbsStatus
                    )}`}
                  >
                    DBS: {dbsStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Approve Carer Button */}
            {isCarerAlreadyApproved ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleApproveCarer}
                  disabled={!canApproveCarer || approvingCarer}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    canApproveCarer && !approvingCarer
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer"
                      : "bg-navy-800/60 text-gold-100/30 border border-gold-300/10 cursor-not-allowed"
                  }`}
                >
                  {approvingCarer ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Carer
                    </>
                  )}
                </button>
                {!canApproveCarer && documentValidation.message && (
                  <p className="text-[9px] text-amber-400/80 font-semibold max-w-[280px] text-right leading-tight">
                    <AlertTriangle className="h-3 w-3 inline mr-0.5 -mt-0.5" />
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
        </nav>

        {/* --- TABS CONTENT --- */}
        <div className="transition-all duration-300">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* LEFT SIDEBAR: PROFILE & AVAILABILITY */}
              <aside className="lg:col-span-1 space-y-6 flex flex-col">
                
                {/* Profile Information */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-gold/60" /> Profile Information
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                      <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">Email Address</span>
                        <span className="font-semibold text-gold-200 truncate block" title={carer.email}>{carer.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                      <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">Phone Number</span>
                        <span className="font-semibold text-gold-200 block">{carer.phoneNumber || "No phone listed"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-navy-950/40 border border-gold-300/5">
                      <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">City & Address</span>
                        <span className="font-semibold text-gold-200 truncate block" title={profile.city || "Unknown"}>
                          {profile.address || profile.city || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gold-300/5 pt-3">
                      <span className="text-gold-100/40 font-semibold flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gold/60" /> Registered:
                      </span>
                      <span className="text-gold-200 font-bold font-mono">
                        {new Date(ext.registrationDate || profile.createdAt || carer.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gold-100/40 font-semibold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gold/60" /> Duration:
                      </span>
                      <span className="text-gold-200 font-bold italic">{durationWithUs}</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold/60" /> Availability
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gold-100/40 font-semibold">Availability Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(ext.availabilityStatus)}`}>
                        {ext.availabilityStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gold-100/40 font-semibold">Consecutive Days:</span>
                      <span className="text-gold-200 font-bold">{ext.consecutiveDays}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gold-100/40 font-semibold">Available Hours:</span>
                      <span className="text-gold-200 font-bold font-mono">
                        {ext.availableFrom} - {ext.availableUntil}
                      </span>
                    </div>

                    <div className="border-t border-gold-300/5 pt-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block mb-1">Standard Schedule</span>
                      <p className="text-gold-200 font-semibold leading-relaxed">
                        {availabilityStr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Communication & Fee */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gold/60" /> Communication & Fee
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block mb-1">Agreed Hourly Rate</span>
                      <div className="text-2xl font-black text-gold">£15.00/hr</div>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block mb-1">Payment Method</span>
                      <div className="text-gold-200 font-bold">Bank Transfer (BACS)</div>
                    </div>

                    <div className="border-t border-gold-300/5 pt-3">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block mb-1">Compliance Notes</span>
                      <p className="text-[11px] text-gold-100/50 italic leading-relaxed">
                        Carer complies with tier 1 insurance requirements. Right to work audited. DBS record checked and verified.
                      </p>
                    </div>
                  </div>
                </div>

              </aside>

              {/* RIGHT MAIN PANEL: EXPERIENCE, PLACEMENTS, NOTES, FEEDBACK */}
              <section className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                
                {/* Experience & Specialties */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gold/60" /> Experience & Specialties
                  </h3>

                  <div className="space-y-4">
                    <div className="text-xs flex items-center gap-2">
                      <span className="text-gold-100/40 font-semibold">Years of Experience:</span>
                      <span className="font-bold text-gold-200 bg-gold/10 px-2 py-0.5 rounded-md border border-gold/20">
                        {profile.experience || (profile.experienceYears ? `${profile.experienceYears} Years` : "No experience listed")}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">Specialties & Care Categories</span>
                      {specialtiesList.length === 0 ? (
                        <span className="text-xs text-gold-100/30">No specialties listed.</span>
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
                      <span className="text-[9px] uppercase font-bold tracking-wider text-gold-100/40 block">Biography</span>
                      <p className="text-xs text-gold-100/70 leading-relaxed italic">
                        "{ext.biography}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placement History */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-gold/60" /> Care Placement History
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gold-100/70 border-collapse">
                      <thead>
                        <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-wider text-gold-100/40">
                          <th className="py-2.5 px-2">Client Name</th>
                          <th className="py-2.5 px-2">Physical Location</th>
                          <th className="py-2.5 px-2">Start Date</th>
                          <th className="py-2.5 px-2">End Date</th>
                          <th className="py-2.5 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-300/5">
                        {ext.placements.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gold-100/30 font-semibold">
                              No placement history available
                            </td>
                          </tr>
                        ) : (
                          ext.placements.map((hist, idx) => (
                            <tr key={`${hist.clientName}-${idx}`} className="hover:bg-navy-900/20 transition duration-150">
                              <td className="py-3 px-2 font-bold text-gold-200">{hist.clientName}</td>
                              <td className="py-3 px-2 font-semibold text-gold-100/75 truncate max-w-[150px]" title={hist.clientAddress}>
                                {hist.clientAddress}
                              </td>
                              <td className="py-3 px-2 font-mono font-semibold text-gold-100/50">
                                {new Date(hist.startDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-3 px-2 font-mono font-semibold text-gold-100/50">
                                {hist.endDate === "Ongoing"
                                  ? "Ongoing"
                                  : new Date(hist.endDate).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <span className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(hist.status)}`}>
                                  {hist.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Internal Notes Timeline */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gold/60" /> Internal Notes Timeline
                  </h3>

                  {ext.notes.length === 0 ? (
                    <p className="text-xs text-gold-100/30 text-center py-4">No internal notes written yet.</p>
                  ) : (
                    <div className="space-y-4 relative pl-4 border-l border-gold-300/10 text-xs">
                      {ext.notes.map((note, idx) => (
                        <div key={`${note.title}-${idx}`} className="relative space-y-1">
                          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gold border border-navy-950" />
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-gold-200">{note.title}</span>
                            <span className="text-[10px] text-gold-100/40 font-semibold">{note.timestamp}</span>
                          </div>
                          <p className="text-gold-100/60 leading-relaxed">{note.content}</p>
                          <span className="text-[10px] text-gold/50 block font-semibold">Author: {note.adminName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback History */}
                <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gold/60" /> Feedback History
                  </h3>

                  {ext.feedback.length === 0 ? (
                    <p className="text-xs text-gold-100/30 text-center py-4">No feedback logs recorded.</p>
                  ) : (
                    <div className="space-y-4 relative pl-4 border-l border-gold-300/10 text-xs">
                      {ext.feedback.map((fb, idx) => {
                        let indicatorBg = "bg-gold";
                        if (fb.type.includes("Concern")) {
                          indicatorBg = "bg-rose-500";
                        } else if (fb.type.includes("Actions")) {
                          indicatorBg = "bg-blue-500";
                        }
                        return (
                          <div key={`${fb.type}-${idx}`} className="relative space-y-1">
                            <span className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${indicatorBg} border border-navy-950`} />
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-bold text-gold-200">{fb.type}</span>
                              <span className="text-[10px] text-gold-100/40 font-semibold">{fb.timestamp}</span>
                            </div>
                            <p className="text-gold-100/60 leading-relaxed">"{fb.content}"</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </section>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold/60" /> Compliance Documents Log
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gold-100/70 border-collapse">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-wider text-gold-100/40">
                      <th className="py-3 px-4">Document Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Upload Date</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5">
                    {REQUIRED_DOCUMENT_CATEGORIES.map((reqDoc) => {
                      const uploaded = rawDocs.find(
                        (d: any) => 
                          d.fileType === reqDoc.category ||
                          d.fileCategory === reqDoc.category ||
                          d.type === reqDoc.category ||
                          d.category === reqDoc.category ||
                          d.name === reqDoc.label
                      );

                      const mockMeta = getMockDocDetails(reqDoc.category);
                      const finalUploadDate = uploaded?.createdAt
                        ? new Date(uploaded.createdAt).toISOString().split("T")[0]
                        : mockMeta.uploadDate;

                      const finalExpiryDate = mockMeta.expiryDate;
                      const statusLabel = uploaded
                        ? uploaded.status === "VERIFIED"
                          ? "Verified"
                          : uploaded.status === "REJECTED"
                            ? "Rejected"
                            : "Uploaded"
                        : "Missing";

                      return (
                        <tr
                          key={reqDoc.category}
                          className="hover:bg-navy-900/20 transition duration-150"
                        >
                          <td className="py-3.5 px-4 font-bold text-gold-200">
                            {reqDoc.label}
                          </td>
                          <td className="py-3.5 px-4 text-gold-100/60 font-semibold">
                            {reqDoc.type}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gold-100/50">
                            {uploaded ? finalUploadDate : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gold-100/50">
                            {uploaded ? finalExpiryDate : "N/A"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(
                                statusLabel
                              )}`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {uploaded ? (
                              <Link
                                href={`/admin/carers/${carer.userId || carer.id}/document-review?documentId=${uploaded.id}`}
                                className="inline-flex items-center gap-1 rounded-xl bg-gold text-navy-950 font-bold px-3 py-1 text-[10px] hover:bg-gold-200 transition duration-200 cursor-pointer"
                              >
                                Review Document <ChevronRight className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className="text-[10px] font-bold text-gold-100/20 italic">
                                Awaiting Upload
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Show other documents uploaded by carer that are not in the default required list */}
                    {(() => {
                      let additionalRefCounter = 1;
                      return rawDocs
                        .filter(
                          (d: any) =>
                            !REQUIRED_DOCUMENT_CATEGORIES.some(
                              (req) => 
                                req.category === d.fileType || 
                                req.category === d.fileCategory || 
                                req.category === d.type || 
                                req.category === d.category || 
                                req.label === d.name
                            )
                        )
                        .map((uploaded: any) => {
                          const rawCat = uploaded.fileType || uploaded.fileCategory || uploaded.type || uploaded.category || uploaded.name;
                          let fileCategoryClean = rawCat
                            ? rawCat
                                .split("_")
                                .map(
                                  (w: string) =>
                                    w.charAt(0).toUpperCase() +
                                    w.slice(1).toLowerCase()
                                )
                                .join(" ")
                            : "Custom Verification Document";

                          let displayName = uploaded.fileName || fileCategoryClean;
                          
                          if (rawCat === DocumentFileType.ADDITIONAL_REFERENCE) {
                            displayName = `Additional Reference ${additionalRefCounter}`;
                            fileCategoryClean = "Compliance";
                            additionalRefCounter++;
                          } else if (rawCat) {
                            displayName = getDocumentFileLabel(rawCat as DocumentFileType) || displayName;
                          }

                          const finalUploadDate = uploaded.createdAt
                            ? new Date(uploaded.createdAt).toISOString().split("T")[0]
                            : "N/A";

                          const statusLabel =
                            uploaded.status === "VERIFIED"
                              ? "Verified"
                              : uploaded.status === "REJECTED"
                                ? "Rejected"
                                : "Uploaded";

                          return (
                            <tr
                              key={uploaded.id || Math.random()}
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
                                N/A
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(
                                    statusLabel
                                  )}`}
                                >
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Link
                                  href={`/admin/carers/${carer.userId || carer.id}/document-review?documentId=${uploaded.id}`}
                                  className="inline-flex items-center gap-1 rounded-xl bg-gold text-navy-950 font-bold px-3 py-1 text-[10px] hover:bg-gold-200 transition duration-200 cursor-pointer"
                                >
                                  Review Document <ChevronRight className="h-3 w-3" />
                                </Link>
                              </td>
                            </tr>
                          );
                        });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
