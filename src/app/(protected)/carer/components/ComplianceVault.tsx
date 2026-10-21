"use client";

import SectionCard from "./shared/SectionCard";
import { ComplianceDoc } from "../types/carer.types";
import { DocumentFileType, getDocumentFileLabel } from "@/types/document.types";
import React, { useState, useMemo } from "react";
import {
  FileText,
  Trash2,
  Eye,
  ArrowLeft,
  ArrowRight,
  Upload,
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  FolderOpen,
} from "lucide-react";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import FullScreenLoader from "@/components/FullScreenLoader";

interface ComplianceVaultProps {
  complianceDocs: ComplianceDoc[];
  documentsLoading: boolean;
  deletingDocumentId: string | null;
  isOnboarding: boolean;
  handleUpdateDoc: (
    id: string,
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
    categoryName?: string,
  ) => void;
  handleUploadNewDoc?: (
    file: File,
    category: string,
    type: string,
    options?: { replaceExisting?: boolean; documentId?: string },
  ) => Promise<void>;
  setPreviewDoc: (doc: ComplianceDoc) => void;
  setDocToDelete: (id: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

interface SlotDefinition {
  slotKey: string;
  slotTitle: string;
  slotSubtitle: string;
  fileType: string;
  category: string;
  fallbackTypes?: string[];
}

interface CategoryDefinition {
  id: string;
  title: string;
  subtitle: string;
  section: "dual" | "driving" | "training" | "other";
  slots: SlotDefinition[];
}

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  // 1. Seven Two-File Document Categories
  {
    id: "enhanced_dbs",
    title: "Enhanced DBS Certificate",
    subtitle: "Original DBS certificate & official check verification confirmation",
    section: "dual",
    slots: [
      {
        slotKey: "dbs_doc1",
        slotTitle: "Document 1: Original DBS Certificate",
        slotSubtitle: "Original Enhanced DBS Certificate issued by the DBS agency",
        fileType: DocumentFileType.ENHANCED_DBS_CERTIFICATE,
        category: "COMPLIANCE",
        fallbackTypes: ["enhanced_dbs", "CRIMINAL_RECORD_CHECK", "criminal_record_check"],
      },
      {
        slotKey: "dbs_doc2",
        slotTitle: "Supporting Document 2: DBS Verification / Check Confirmation",
        slotSubtitle: "DBS Update Service check result, online status check, or umbrella body confirmation",
        fileType: DocumentFileType.ENHANCED_DBS_SUPPORTING,
        category: "COMPLIANCE",
        fallbackTypes: ["enhanced_dbs_supporting", "dbs_verification"],
      },
    ],
  },
  {
    id: "right_to_work",
    title: "Right to Work in the UK",
    subtitle: "Original evidence & GOV.UK / Home Office verification confirmation",
    section: "dual",
    slots: [
      {
        slotKey: "rtw_doc1",
        slotTitle: "Document 1: Original Right to Work Evidence",
        slotSubtitle: "UK/Irish Passport, Biometric Residence Permit (BRP), or Settled Status document",
        fileType: DocumentFileType.RIGHT_TO_WORK,
        category: "IDENTITY",
        fallbackTypes: ["right_to_work"],
      },
      {
        slotKey: "rtw_doc2",
        slotTitle: "Supporting Document 2: GOV.UK / Home Office Verification Confirmation",
        slotSubtitle: "Official Home Office online right to work check confirmation letter or PDF share code proof",
        fileType: DocumentFileType.RIGHT_TO_WORK_SUPPORTING,
        category: "IDENTITY",
        fallbackTypes: ["right_to_work_supporting", "rtw_verification"],
      },
    ],
  },
  {
    id: "public_liability",
    title: "Public Liability Insurance",
    subtitle: "Insurance certificate & policy schedule / supporting documentation",
    section: "dual",
    slots: [
      {
        slotKey: "pli_doc1",
        slotTitle: "Document 1: Insurance Certificate",
        slotSubtitle: "Valid Public Liability Insurance Certificate (minimum £1,000,000 coverage)",
        fileType: DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
        category: "INSURANCE",
        fallbackTypes: ["public_liability", "public_liability_insurance"],
      },
      {
        slotKey: "pli_doc2",
        slotTitle: "Supporting Document 2: Policy Schedule / Supporting Documentation",
        slotSubtitle: "Current insurance schedule detailing indemnity limits, dates, and terms",
        fileType: DocumentFileType.PUBLIC_LIABILITY_SUPPORTING,
        category: "INSURANCE",
        fallbackTypes: ["public_liability_supporting", "policy_schedule"],
      },
    ],
  },
  {
    id: "professional_indemnity",
    title: "Professional Indemnity Insurance",
    subtitle: "Insurance certificate & supporting policy documentation",
    section: "dual",
    slots: [
      {
        slotKey: "pii_doc1",
        slotTitle: "Document 1: Insurance Certificate",
        slotSubtitle: "Professional Indemnity Insurance policy certificate",
        fileType: DocumentFileType.PROFESSIONAL_INDEMNITY_INSURANCE,
        category: "INSURANCE",
        fallbackTypes: ["professional_indemnity", "professional_indemnity_insurance"],
      },
      {
        slotKey: "pii_doc2",
        slotTitle: "Supporting Document 2: Supporting Policy Documentation",
        slotSubtitle: "Indemnity policy breakdown, schedule, or underwriter confirmation",
        fileType: DocumentFileType.PROFESSIONAL_INDEMNITY_SUPPORTING,
        category: "INSURANCE",
        fallbackTypes: ["professional_indemnity_supporting"],
      },
    ],
  },
  {
    id: "professional_references",
    title: "Professional References",
    subtitle: "Original practitioner references & verification confirmations",
    section: "dual",
    slots: [
      {
        slotKey: "ref_doc1",
        slotTitle: "Document 1: Original Reference 1",
        slotSubtitle: "Primary written reference from a former healthcare employer, client, or supervisor",
        fileType: DocumentFileType.PROFESSIONAL_REFERENCE_1,
        category: "COMPLIANCE",
        fallbackTypes: ["reference_1", "professional_reference_1"],
      },
      {
        slotKey: "ref_doc2",
        slotTitle: "Supporting Document 2: Reference 2 / Verification Confirmation",
        slotSubtitle: "Secondary reference or referee contact verification confirmation",
        fileType: DocumentFileType.PROFESSIONAL_REFERENCE_2,
        category: "COMPLIANCE",
        fallbackTypes: [
          DocumentFileType.PROFESSIONAL_REFERENCE_SUPPORTING,
          "reference_2",
          "professional_reference_2",
          "professional_reference_supporting",
        ],
      },
    ],
  },
  {
    id: "cv_employment",
    title: "CV / Employment History",
    subtitle: "Comprehensive curriculum vitae & supporting employment documentation",
    section: "dual",
    slots: [
      {
        slotKey: "cv_doc1",
        slotTitle: "Document 1: CV / Resume",
        slotSubtitle: "Full curriculum vitae showing complete work history and care experience",
        fileType: DocumentFileType.CV_RESUME,
        category: "COMPLIANCE",
        fallbackTypes: ["cv", "cv_resume"],
      },
      {
        slotKey: "cv_doc2",
        slotTitle: "Supporting Document 2: Supporting Employment History Documentation",
        slotSubtitle: "Prior employer references, gap explanations, or service records",
        fileType: DocumentFileType.CV_SUPPORTING,
        category: "COMPLIANCE",
        fallbackTypes: ["cv_supporting", "employment_history_supporting"],
      },
    ],
  },
  {
    id: "proof_of_address",
    title: "Proof of Address",
    subtitle: "Original proof of address & additional supporting residence evidence",
    section: "dual",
    slots: [
      {
        slotKey: "poa_doc1",
        slotTitle: "Document 1: Original Proof of Address",
        slotSubtitle: "Utility bill, council tax statement, or bank statement (dated within last 3 months)",
        fileType: DocumentFileType.PROOF_OF_ADDRESS,
        category: "IDENTITY",
        fallbackTypes: ["proof_of_address"],
      },
      {
        slotKey: "poa_doc2",
        slotTitle: "Supporting Document 2: Additional Supporting Evidence",
        slotSubtitle: "Secondary proof of residence or tenancy agreement where required",
        fileType: DocumentFileType.PROOF_OF_ADDRESS_SUPPORTING,
        category: "IDENTITY",
        fallbackTypes: ["proof_of_address_supporting"],
      },
    ],
  },

  // 2. Driving Licence (Front and Back strictly separate)
  {
    id: "driving_licence_front",
    title: "Driving Licence (Front)",
    subtitle: "Front face of photocard driving licence showing photo and personal details",
    section: "driving",
    slots: [
      {
        slotKey: "dl_front",
        slotTitle: "Driving Licence (Front)",
        slotSubtitle: "Colour photo scan of the front of your UK/EU photocard licence",
        fileType: DocumentFileType.DRIVING_LICENCE_FRONT,
        category: "IDENTITY",
        fallbackTypes: ["drivers_license_front", "driving_licence_front", "DRIVING_LICENCE_FRONT"],
      },
    ],
  },
  {
    id: "driving_licence_back",
    title: "Driving Licence (Back)",
    subtitle: "Back face of photocard driving licence showing vehicle categories and codes",
    section: "driving",
    slots: [
      {
        slotKey: "dl_back",
        slotTitle: "Driving Licence (Back)",
        slotSubtitle: "Colour photo scan of the back of your UK/EU photocard licence",
        fileType: DocumentFileType.DRIVING_LICENCE_BACK,
        category: "IDENTITY",
        fallbackTypes: ["drivers_license_back", "driving_licence_back", "DRIVING_LICENCE_BACK"],
      },
    ],
  },

  // 3. Mandatory Training Certificates (One current document with history)
  {
    id: "training_safeguarding",
    title: "Safeguarding Adults",
    subtitle: "Safeguarding adults certification (Level 2 or 3)",
    section: "training",
    slots: [
      {
        slotKey: "train_safeguarding",
        slotTitle: "Current Certificate",
        slotSubtitle: "Valid safeguarding adults training certificate",
        fileType: DocumentFileType.SAFEGUARDING_ADULTS,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_moving",
    title: "Moving and Handling",
    subtitle: "People moving & handling practical / theory certificate",
    section: "training",
    slots: [
      {
        slotKey: "train_moving",
        slotTitle: "Current Certificate",
        slotSubtitle: "Moving & handling of people training certificate",
        fileType: DocumentFileType.MOVING_AND_HANDLING,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_medication",
    title: "Medication Administration",
    subtitle: "Safe handling and administration of medicines certificate",
    section: "training",
    slots: [
      {
        slotKey: "train_medication",
        slotTitle: "Current Certificate",
        slotSubtitle: "Medication management and administration certificate",
        fileType: DocumentFileType.MEDICATION_ADMINISTRATION,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_bls",
    title: "Basic Life Support / First Aid",
    subtitle: "CPR and basic life support certification",
    section: "training",
    slots: [
      {
        slotKey: "train_bls",
        slotTitle: "Current Certificate",
        slotSubtitle: "Emergency first aid / basic life support certificate",
        fileType: DocumentFileType.BASIC_LIFE_SUPPORT_FIRST_AID,
        category: "MANDATORY_TRAINING",
        fallbackTypes: ["basic_life_support"],
      },
    ],
  },
  {
    id: "training_infection",
    title: "Infection Prevention and Control",
    subtitle: "Infection control, clinical hygiene, and PPE certificate",
    section: "training",
    slots: [
      {
        slotKey: "train_infection",
        slotTitle: "Current Certificate",
        slotSubtitle: "Infection prevention and control training certificate",
        fileType: DocumentFileType.INFECTION_PREVENTION_AND_CONTROL,
        category: "MANDATORY_TRAINING",
        fallbackTypes: ["infection_prevention"],
      },
    ],
  },
  {
    id: "training_health_safety",
    title: "Health and Safety",
    subtitle: "Workplace health & safety in domiciliary and live-in care",
    section: "training",
    slots: [
      {
        slotKey: "train_health_safety",
        slotTitle: "Current Certificate",
        slotSubtitle: "Health and safety certification",
        fileType: DocumentFileType.HEALTH_AND_SAFETY,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_fire",
    title: "Fire Safety",
    subtitle: "Fire safety awareness and emergency response",
    section: "training",
    slots: [
      {
        slotKey: "train_fire",
        slotTitle: "Current Certificate",
        slotSubtitle: "Fire safety certificate",
        fileType: DocumentFileType.FIRE_SAFETY,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_food",
    title: "Food Hygiene",
    subtitle: "Food hygiene and food safety for carers (Level 2)",
    section: "training",
    slots: [
      {
        slotKey: "train_food",
        slotTitle: "Current Certificate",
        slotSubtitle: "Food hygiene certification",
        fileType: DocumentFileType.FOOD_HYGIENE,
        category: "MANDATORY_TRAINING",
      },
    ],
  },
  {
    id: "training_gdpr",
    title: "GDPR / Data Protection",
    subtitle: "Information governance and confidential record-keeping",
    section: "training",
    slots: [
      {
        slotKey: "train_gdpr",
        slotTitle: "Current Certificate",
        slotSubtitle: "Data protection and GDPR compliance certificate",
        fileType: DocumentFileType.GDPR_DATA_PROTECTION,
        category: "MANDATORY_TRAINING",
        fallbackTypes: ["gdpr"],
      },
    ],
  },

  // 4. Other Identity & Qualification Documents
  {
    id: "identity_passport",
    title: "Passport",
    subtitle: "National passport photo and information page",
    section: "other",
    slots: [
      {
        slotKey: "other_passport",
        slotTitle: "Current Passport",
        slotSubtitle: "Original passport scan",
        fileType: DocumentFileType.PASSPORT,
        category: "IDENTITY",
      },
    ],
  },
  {
    id: "identity_ni_proof",
    title: "Proof of National Insurance",
    subtitle: "HMRC letter, P45/P60, or National Insurance card",
    section: "other",
    slots: [
      {
        slotKey: "other_ni",
        slotTitle: "National Insurance Document",
        slotSubtitle: "Official document showing NI number",
        fileType: DocumentFileType.NATIONAL_INSURANCE_PROOF,
        category: "IDENTITY",
        fallbackTypes: ["ni_proof"],
      },
    ],
  },
];

export default function ComplianceVault({
  complianceDocs,
  documentsLoading,
  deletingDocumentId,
  isOnboarding,
  handleUpdateDoc,
  handleUploadNewDoc,
  setPreviewDoc,
  setDocToDelete,
  onNext,
  onBack,
}: ComplianceVaultProps) {
  const [activeSectionTab, setActiveSectionTab] = useState<
    "dual" | "driving" | "training" | "other" | "all"
  >("dual");

  // Track expanded history drawers by slotKey
  const [expandedHistorySlots, setExpandedHistorySlots] = useState<
    Record<string, boolean>
  >({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingDocLabel, setUploadingDocLabel] = useState<string>("");

  const toggleHistory = (slotKey: string) => {
    setExpandedHistorySlots((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey],
    }));
  };

  // Group all documents for each slot
  // Match by fileType or fallbackTypes, sorted newest first
  const slotDocumentsMap = useMemo(() => {
    const map = new Map<string, ComplianceDoc[]>();

    CATEGORY_DEFINITIONS.forEach((cat) => {
      cat.slots.forEach((slot) => {
        const typesToMatch = [
          slot.fileType.toLowerCase(),
          ...(slot.fallbackTypes?.map((t) => t.toLowerCase()) || []),
        ];

        const matching = complianceDocs.filter((d) => {
          const docType = (d.type || d.fileType || "").toLowerCase();
          const docCat = (d.category || "").toLowerCase();
          return typesToMatch.includes(docType) || typesToMatch.includes(docCat);
        });

        // Sort descending by upload date (newest first)
        matching.sort((a, b) => {
          const timeA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
          const timeB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
          return timeB - timeA;
        });

        map.set(slot.slotKey, matching);
      });
    });

    return map;
  }, [complianceDocs]);

  // Handle direct file selection for a slot
  const handleSlotFileSelected = async (
    slot: SlotDefinition,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadingDocLabel(slot.slotTitle || file.name);
    try {
      if (handleUploadNewDoc) {
        await handleUploadNewDoc(file, slot.category, slot.fileType, {
          replaceExisting: false,
        });
      } else {
        await handleUpdateDoc("", slot.fileType, e, slot.category);
      }
    } finally {
      setIsUploading(false);
      setUploadingDocLabel("");
      e.target.value = "";
    }
  };

  const filteredCategories = CATEGORY_DEFINITIONS.filter((cat) => {
    if (activeSectionTab === "all") return true;
    return cat.section === activeSectionTab;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Uploading Custom Loader Overlay */}
      <FullScreenLoader
        isVisible={isUploading}
        message={`Uploading ${uploadingDocLabel || "document"}...`}
        isOverlay={true}
      />
      {/* Onboarding Navigation Row */}
      {isOnboarding && (
        <div className="flex justify-between items-center w-full pb-2">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gold-300/10 bg-navy-900/30 backdrop-blur-md text-gold-200/80 text-[12.5px] font-medium tracking-wide hover:bg-navy-800/40 hover:border-gold-300/20 hover:text-gold-50 hover:-translate-y-[1px] transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {onNext && (
            <button
              onClick={onNext}
              disabled={complianceDocs.length === 0}
              className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20 text-navy-950 text-[12.5px] font-semibold tracking-wide shadow-[0_2px_8px_rgba(245,212,160,0.15)] hover:shadow-[0_4px_12px_rgba(245,212,160,0.25)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 ml-auto"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Vault Header & Category Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-300/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gold-200 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-gold-DEFAULT" />
            Compliance Records Vault
          </h2>
          <p className="text-xs text-gold-100/60 mt-1 max-w-2xl leading-relaxed">
            Manage your verified documents, upload required supporting evidence, and inspect your full historical version audit trail.
          </p>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-navy-900/60 p-1.5 rounded-xl border border-gold-300/10 text-xs">
          <button
            onClick={() => setActiveSectionTab("dual")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSectionTab === "dual"
                ? "bg-gold-DEFAULT/20 text-gold-200 border border-gold-DEFAULT/40 shadow-sm"
                : "text-gold-100/60 hover:text-gold-100 hover:bg-navy-800/40"
            }`}
          >
            Core Dual-Document Vault (7)
          </button>
          <button
            onClick={() => setActiveSectionTab("driving")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSectionTab === "driving"
                ? "bg-gold-DEFAULT/20 text-gold-200 border border-gold-DEFAULT/40 shadow-sm"
                : "text-gold-100/60 hover:text-gold-100 hover:bg-navy-800/40"
            }`}
          >
            Driving Licence (Front & Back)
          </button>
          <button
            onClick={() => setActiveSectionTab("training")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSectionTab === "training"
                ? "bg-gold-DEFAULT/20 text-gold-200 border border-gold-DEFAULT/40 shadow-sm"
                : "text-gold-100/60 hover:text-gold-100 hover:bg-navy-800/40"
            }`}
          >
            Mandatory Training
          </button>
          <button
            onClick={() => setActiveSectionTab("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSectionTab === "all"
                ? "bg-gold-DEFAULT/20 text-gold-200 border border-gold-DEFAULT/40 shadow-sm"
                : "text-gold-100/60 hover:text-gold-100 hover:bg-navy-800/40"
            }`}
          >
            View All Categories
          </button>
        </div>
      </div>

      {/* Main Categories Container */}
      {documentsLoading ? (
        <div className="py-20 text-center">
          <ThinSpinner size="lg" text="Loading compliance records vault..." />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const isDualCategory = category.section === "dual";

            return (
              <SectionCard
                key={category.id}
                className="p-5 md:p-6 border border-gold-300/10 bg-navy-900/30 backdrop-blur-md space-y-4"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-300/10 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-gold-100 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-gold-300/80" />
                      {category.title}
                      {isDualCategory && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20">
                          Two Independent Documents Required
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gold-100/50 mt-0.5">
                      {category.subtitle}
                    </p>
                  </div>
                </div>

                {/* Slots Grid */}
                <div
                  className={`grid gap-4 ${
                    isDualCategory
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {category.slots.map((slot) => {
                    const docs = slotDocumentsMap.get(slot.slotKey) || [];
                    const currentDoc = docs[0] || null;
                    const historyDocs = docs.slice(1);
                    const isHistoryOpen = !!expandedHistorySlots[slot.slotKey];
                    const isDeleting =
                      currentDoc && deletingDocumentId === currentDoc.id;

                    return (
                      <div
                        key={slot.slotKey}
                        className="rounded-xl border border-gold-300/10 bg-navy-950/60 p-4 flex flex-col justify-between space-y-3 shadow-inner"
                      >
                        {/* Slot Header */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-gold-200">
                                {slot.slotTitle}
                              </h4>
                              <p className="text-[10px] text-gold-100/50 mt-0.5 leading-relaxed">
                                {slot.slotSubtitle}
                              </p>
                            </div>
                            {currentDoc ? (
                              <div className="shrink-0">
                                {currentDoc.status === "verified" ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Verified
                                  </span>
                                ) : currentDoc.status === "failed" ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    Rejected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/20">
                                    <Clock className="w-2.5 h-2.5" />
                                    Pending Review
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-navy-900 px-2 py-0.5 text-[9px] font-medium text-gold-100/40 border border-gold-300/10">
                                Not Uploaded
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Current Document Record Body */}
                        {currentDoc ? (
                          <div
                            className={`rounded-lg bg-navy-900/60 border border-gold-300/10 p-3 flex flex-col gap-2 ${
                              isDeleting
                                ? "opacity-40 pointer-events-none"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="shrink-0 h-9 w-9 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5
                                  className="text-xs font-semibold text-gold-50 truncate"
                                  title={currentDoc.name}
                                >
                                  {currentDoc.name}
                                </h5>
                                <p className="text-[10px] text-gold-100/50 mt-0.5 truncate">
                                  Uploaded on{" "}
                                  {currentDoc.uploadDate
                                    ? new Date(
                                        currentDoc.uploadDate,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Recently"}{" "}
                                  • {currentDoc.size}
                                  {currentDoc.dbsCertificateNumber && (
                                    <span className="ml-1 text-gold-200/80 font-mono">
                                      • DBS: #{currentDoc.dbsCertificateNumber}
                                    </span>
                                  )}
                                </p>
                              </div>

                              {/* Document Action Icons */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc(currentDoc)}
                                  className="p-1.5 text-gold-200 hover:text-gold-50 hover:bg-navy-800 rounded transition-colors"
                                  title="View / Download Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDocToDelete(currentDoc.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                  title="Delete Document Record"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? (
                                    <ThinSpinner
                                      size="xs"
                                      spinnerClassName="border-red-400 shrink-0"
                                    />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Rejection Feedback Note */}
                            {currentDoc.status === "failed" &&
                              currentDoc.rejectionReason && (
                                <div className="mt-1 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] leading-relaxed">
                                  <strong className="font-semibold block text-rose-200">
                                    Rejection Notice:
                                  </strong>
                                  {currentDoc.rejectionReason}
                                </div>
                              )}

                            {/* Expiry Alerts */}
                            {(() => {
                              if (!currentDoc.expiryDate) return null;
                              const expiry = new Date(currentDoc.expiryDate);
                              const now = new Date();
                              const msPerDay = 24 * 60 * 60 * 1000;
                              const daysRemaining = Math.ceil(
                                (expiry.getTime() - now.getTime()) / msPerDay,
                              );
                              const formatted = expiry.toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              );

                              if (currentDoc.isExpired || daysRemaining < 0) {
                                return (
                                  <div className="mt-1 px-2 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-semibold">
                                    Expired on {formatted} — Please upload a renewed document
                                  </div>
                                );
                              }
                              if (daysRemaining <= 30) {
                                return (
                                  <div className="mt-1 px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                                    Expires in {daysRemaining} days ({formatted})
                                  </div>
                                );
                              }
                              return (
                                <div className="text-[10px] text-gold-100/50 mt-0.5">
                                  Expiry:{" "}
                                  <strong className="text-gold-200 font-medium">
                                    {formatted}
                                  </strong>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          /* Empty Slot State */
                          <div className="rounded-lg border border-dashed border-gold-300/20 bg-navy-900/30 p-5 text-center flex flex-col items-center justify-center gap-2">
                            <Upload className="w-5 h-5 text-gold-300/40" />
                            <p className="text-[11px] text-gold-100/60 font-medium">
                              No file uploaded yet for this slot.
                            </p>
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-DEFAULT/15 hover:bg-gold-DEFAULT/25 border border-gold-DEFAULT/30 text-gold-200 text-xs font-semibold transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              Select File to Upload
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                disabled={isUploading}
                                onChange={(e) =>
                                  handleSlotFileSelected(slot, e)
                                }
                              />
                            </label>
                          </div>
                        )}

                        {/* Upload Replacement Control */}
                        {currentDoc && (
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gold-300/5">
                            <label className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 border border-gold-300/15 text-gold-200 text-[11px] font-medium transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                              <Upload className="w-3 h-3 text-gold-300" />
                              Upload Replacement / New Version
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                disabled={isUploading}
                                onChange={(e) =>
                                  handleSlotFileSelected(slot, e)
                                }
                              />
                            </label>

                            {/* Version History Toggle */}
                            {historyDocs.length > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleHistory(slot.slotKey)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-gold-DEFAULT hover:text-gold-200 transition-colors"
                              >
                                <History className="w-3 h-3" />
                                {isHistoryOpen
                                  ? "Hide History"
                                  : `History (${historyDocs.length} prior)`}
                                {isHistoryOpen ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Collapsible Version History Drawer */}
                        {historyDocs.length > 0 && isHistoryOpen && (
                          <div className="rounded-lg bg-navy-950/80 border border-gold-300/10 p-3 space-y-2 mt-2 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between border-b border-gold-300/10 pb-1.5">
                              <span className="text-[10px] font-bold text-gold-200 uppercase tracking-wider flex items-center gap-1">
                                <History className="w-3 h-3 text-gold-DEFAULT" />
                                Document Version History
                              </span>
                              <span className="text-[9px] text-gold-100/40">
                                Previous revisions are permanently retained
                              </span>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                              {historyDocs.map((histDoc, idx) => {
                                const isHistDeleting =
                                  deletingDocumentId === histDoc.id;

                                return (
                                  <div
                                    key={histDoc.id}
                                    className={`p-2 rounded bg-navy-900/50 border border-gold-300/5 flex items-center justify-between gap-3 text-xs ${
                                      isHistDeleting ? "opacity-30" : ""
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-gold-100/50">
                                          v{historyDocs.length - idx}
                                        </span>
                                        <span
                                          className="text-gold-100 text-[11px] truncate font-medium"
                                          title={histDoc.name}
                                        >
                                          {histDoc.name}
                                        </span>
                                        {histDoc.status === "verified" ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Verified
                                          </span>
                                        ) : histDoc.status === "failed" ? (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                            Rejected
                                          </span>
                                        ) : (
                                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                            Archived
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[9px] text-gold-100/40 mt-0.5 flex flex-wrap gap-x-2">
                                        <span>
                                          Uploaded:{" "}
                                          {histDoc.uploadDate
                                            ? new Date(
                                                histDoc.uploadDate,
                                              ).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })
                                            : "N/A"}
                                        </span>
                                        <span>• {histDoc.size}</span>
                                        {histDoc.rejectionReason && (
                                          <span className="text-rose-400 block w-full mt-0.5 italic">
                                            Reason: {histDoc.rejectionReason}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewDoc(histDoc)}
                                        className="p-1 text-gold-200 hover:text-gold-50"
                                        title="View Historical Version"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setDocToDelete(histDoc.id)
                                        }
                                        className="p-1 text-red-400 hover:text-red-300"
                                        title="Delete Historical Record"
                                        disabled={isHistDeleting}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
