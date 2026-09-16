"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Upload,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import ThinSpinner from "@/components/ThinSpinner";

export interface AdminUploadCarerDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  carerId: string;
  carerName?: string;
  documentId?: string;
  initialCategory?: string;
  initialType?: string;
  isLocked?: boolean;
  onUploadSuccess: (newDocument: any) => void;
}

export const DOCUMENT_CATEGORIES = [
  {
    id: "IDENTITY",
    label: "Identity Documents",
    types: [
      { value: "Passport", label: "Passport" },
      { value: "Driving Licence (Front)", label: "Driving Licence (Front)" },
      { value: "Driving Licence (Back)", label: "Driving Licence (Back)" },
      { value: "Driving Licence", label: "Driving Licence (Full / Combined)" },
      { value: "Proof of Address", label: "Proof of Address" },
      { value: "Right to Work in the UK", label: "Right to Work in the UK" },
      { value: "Proof of National Insurance Number", label: "Proof of National Insurance Number" },
    ],
  },
  {
    id: "MANDATORY_TRAINING",
    label: "Mandatory Care Training",
    types: [
      { value: "Safeguarding Adults", label: "Safeguarding Adults" },
      { value: "Moving and Handling", label: "Moving and Handling" },
      { value: "Medication Administration", label: "Medication Administration" },
      { value: "Basic Life Support / First Aid", label: "Basic Life Support / First Aid" },
      { value: "Infection Prevention and Control", label: "Infection Prevention and Control" },
      { value: "Health and Safety", label: "Health and Safety" },
      { value: "Fire Safety", label: "Fire Safety" },
      { value: "Food Hygiene", label: "Food Hygiene" },
      { value: "GDPR / Data Protection", label: "GDPR / Data Protection" },
    ],
  },
  {
    id: "COMPLIANCE",
    label: "Compliance & References",
    types: [
      { value: "Enhanced DBS Certificate", label: "Enhanced DBS Certificate" },
      { value: "CV / Resume", label: "CV / Resume" },
      { value: "Professional Reference 1", label: "Professional Reference 1" },
      { value: "Professional Reference 2", label: "Professional Reference 2" },
      { value: "Additional Reference", label: "Additional Reference" },
    ],
  },
  {
    id: "INSURANCE",
    label: "Insurance & Business",
    types: [
      { value: "Public Liability Insurance", label: "Public Liability Insurance" },
      { value: "Professional Indemnity Insurance", label: "Professional Indemnity Insurance" },
      { value: "Business Insurance", label: "Business Use Insurance Cover" },
      { value: "UTR Certificate", label: "UTR Certificate" },
      { value: "Self-Employment Registration", label: "Self-Employment Registration" },
      { value: "Certificate of Incorporation", label: "Certificate of Incorporation" },
      { value: "VAT Registration Certificate", label: "VAT Registration Certificate" },
    ],
  },
  {
    id: "ADDITIONAL_TRAINING",
    label: "Additional Qualifications & Training",
    types: [
      { value: "NVQ Level 2", label: "NVQ Level 2" },
      { value: "NVQ Level 3", label: "NVQ Level 3" },
      { value: "NVQ Level 4", label: "NVQ Level 4" },
      { value: "Nursing Qualifications", label: "Nursing Qualifications" },
      { value: "University Qualifications", label: "University Qualifications" },
      { value: "Dementia Training", label: "Dementia Training" },
      { value: "End of Life Care Training", label: "End of Life Care Training" },
      { value: "Catheter Care Training", label: "Catheter Care Training" },
      { value: "PEG Feeding Training", label: "PEG Feeding Training" },
      { value: "Stoma Care Training", label: "Stoma Care Training" },
      { value: "Complex Care Training", label: "Complex Care Training" },
      { value: "Medication Competency Assessments", label: "Medication Competency Assessments" },
      { value: "Any Other Relevant Certificates", label: "Any Other Relevant Certificates" },
      { value: "Other", label: "Other / Custom Document" },
    ],
  },
];

const KNOWN_TYPE_MAPPINGS: Record<
  string,
  { catId: string; catLabel: string; typeValue: string; typeLabel: string }
> = {
  // Identity
  PASSPORT: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Passport", typeLabel: "Passport" },
  DRIVING_LICENCE: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Driving Licence", typeLabel: "Driving Licence (Full / Combined)" },
  DRIVING_LICENCE_FRONT: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Driving Licence (Front)", typeLabel: "Driving Licence (Front)" },
  DRIVING_LICENCE_BACK: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Driving Licence (Back)", typeLabel: "Driving Licence (Back)" },
  PROOF_OF_ADDRESS: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Proof of Address", typeLabel: "Proof of Address" },
  RIGHT_TO_WORK: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Right to Work in the UK", typeLabel: "Right to Work in the UK" },
  NATIONAL_INSURANCE_PROOF: { catId: "IDENTITY", catLabel: "Identity Documents", typeValue: "Proof of National Insurance Number", typeLabel: "Proof of National Insurance Number" },

  // Mandatory Training
  SAFEGUARDING_ADULTS: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Safeguarding Adults", typeLabel: "Safeguarding Adults" },
  MOVING_AND_HANDLING: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Moving and Handling", typeLabel: "Moving and Handling" },
  MEDICATION_ADMINISTRATION: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Medication Administration", typeLabel: "Medication Administration" },
  BASIC_LIFE_SUPPORT_FIRST_AID: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Basic Life Support / First Aid", typeLabel: "Basic Life Support / First Aid" },
  INFECTION_PREVENTION_AND_CONTROL: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Infection Prevention and Control", typeLabel: "Infection Prevention and Control" },
  HEALTH_AND_SAFETY: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Health and Safety", typeLabel: "Health and Safety" },
  FIRE_SAFETY: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Fire Safety", typeLabel: "Fire Safety" },
  FOOD_HYGIENE: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "Food Hygiene", typeLabel: "Food Hygiene" },
  GDPR_DATA_PROTECTION: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training", typeValue: "GDPR / Data Protection", typeLabel: "GDPR / Data Protection" },

  // Compliance
  ENHANCED_DBS_CERTIFICATE: { catId: "COMPLIANCE", catLabel: "Compliance & References", typeValue: "Enhanced DBS Certificate", typeLabel: "Enhanced DBS Certificate" },
  CV_RESUME: { catId: "COMPLIANCE", catLabel: "Compliance & References", typeValue: "CV / Resume", typeLabel: "CV / Resume" },
  PROFESSIONAL_REFERENCE_1: { catId: "COMPLIANCE", catLabel: "Compliance & References", typeValue: "Professional Reference 1", typeLabel: "Professional Reference 1" },
  PROFESSIONAL_REFERENCE_2: { catId: "COMPLIANCE", catLabel: "Compliance & References", typeValue: "Professional Reference 2", typeLabel: "Professional Reference 2" },
  ADDITIONAL_REFERENCE: { catId: "COMPLIANCE", catLabel: "Compliance & References", typeValue: "Additional Reference", typeLabel: "Additional Reference" },

  // Insurance
  PUBLIC_LIABILITY_INSURANCE: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "Public Liability Insurance", typeLabel: "Public Liability Insurance" },
  PROFESSIONAL_INDEMNITY_INSURANCE: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "Professional Indemnity Insurance", typeLabel: "Professional Indemnity Insurance" },
  BUSINESS_INSURANCE: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "Business Insurance", typeLabel: "Business Use Insurance Cover" },
  UTR_CERTIFICATE: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "UTR Certificate", typeLabel: "UTR Certificate" },
  SELF_EMPLOYMENT_REGISTRATION: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "Self-Employment Registration", typeLabel: "Self-Employment Registration" },
  CERTIFICATE_OF_INCORPORATION: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "Certificate of Incorporation", typeLabel: "Certificate of Incorporation" },
  VAT_REGISTRATION_CERTIFICATE: { catId: "INSURANCE", catLabel: "Insurance & Business", typeValue: "VAT Registration Certificate", typeLabel: "VAT Registration Certificate" },

  // Additional Training
  NVQ_2: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "NVQ Level 2", typeLabel: "NVQ Level 2" },
  NVQ_3: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "NVQ Level 3", typeLabel: "NVQ Level 3" },
  NVQ_4: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "NVQ Level 4", typeLabel: "NVQ Level 4" },
  NURSING_QUALIFICATION: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Nursing Qualifications", typeLabel: "Nursing Qualifications" },
  UNIVERSITY_QUALIFICATION: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "University Qualifications", typeLabel: "University Qualifications" },
  DEMENTIA_TRAINING: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Dementia Training", typeLabel: "Dementia Training" },
  END_OF_LIFE_CARE: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "End of Life Care Training", typeLabel: "End of Life Care Training" },
  CATHETER_CARE: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Catheter Care Training", typeLabel: "Catheter Care Training" },
  PEG_FEEDING: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "PEG Feeding Training", typeLabel: "PEG Feeding Training" },
  STOMA_CARE: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Stoma Care Training", typeLabel: "Stoma Care Training" },
  COMPLEX_CARE: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Complex Care Training", typeLabel: "Complex Care Training" },
  MEDICATION_COMPETENCY: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Medication Competency Assessments", typeLabel: "Medication Competency Assessments" },
  OTHER_RELEVANT: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Any Other Relevant Certificates", typeLabel: "Any Other Relevant Certificates" },
  OTHER: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training", typeValue: "Other", typeLabel: "Other / Custom Document" },
};

const CATEGORY_MAP: Record<string, { catId: string; catLabel: string }> = {
  IDENTITY: { catId: "IDENTITY", catLabel: "Identity Documents" },
  RIGHT_TO_WORK: { catId: "IDENTITY", catLabel: "Identity Documents" },
  MANDATORY_TRAINING: { catId: "MANDATORY_TRAINING", catLabel: "Mandatory Care Training" },
  COMPLIANCE: { catId: "COMPLIANCE", catLabel: "Compliance & References" },
  MEDICAL: { catId: "COMPLIANCE", catLabel: "Compliance & References" },
  PREVIOUS_EMPLOYMENT: { catId: "COMPLIANCE", catLabel: "Compliance & References" },
  INSURANCE: { catId: "INSURANCE", catLabel: "Insurance & Business" },
  ADDITIONAL_TRAINING: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training" },
  MISC: { catId: "ADDITIONAL_TRAINING", catLabel: "Additional Qualifications & Training" },
};

export function resolveCategoryAndType(catInput?: string, typeInput?: string) {
  const norm = (s?: string) => (s || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // 1. Direct match on KNOWN_TYPE_MAPPINGS
  if (typeInput) {
    const rawKey = typeInput.toUpperCase().trim();
    if (KNOWN_TYPE_MAPPINGS[rawKey]) {
      return KNOWN_TYPE_MAPPINGS[rawKey];
    }

    const normType = norm(typeInput);
    for (const [k, v] of Object.entries(KNOWN_TYPE_MAPPINGS)) {
      if (
        norm(k) === normType ||
        norm(v.typeValue) === normType ||
        norm(v.typeLabel) === normType
      ) {
        return v;
      }
    }

    // Keyword heuristics for filenames or partial strings
    if (normType.includes("passport")) {
      return KNOWN_TYPE_MAPPINGS.PASSPORT;
    }
    if (normType.includes("driving") || normType.includes("license") || normType.includes("licence")) {
      if (normType.includes("front")) return KNOWN_TYPE_MAPPINGS.DRIVING_LICENCE_FRONT;
      if (normType.includes("back")) return KNOWN_TYPE_MAPPINGS.DRIVING_LICENCE_BACK;
      return KNOWN_TYPE_MAPPINGS.DRIVING_LICENCE;
    }
    if (normType.includes("address")) {
      return KNOWN_TYPE_MAPPINGS.PROOF_OF_ADDRESS;
    }
    if (normType.includes("righttowork") || normType.includes("rtw")) {
      return KNOWN_TYPE_MAPPINGS.RIGHT_TO_WORK;
    }
    if (normType.includes("nationalinsurance") || normType.includes("nino")) {
      return KNOWN_TYPE_MAPPINGS.NATIONAL_INSURANCE_PROOF;
    }
    if (normType.includes("safeguard")) {
      return KNOWN_TYPE_MAPPINGS.SAFEGUARDING_ADULTS;
    }
    if (normType.includes("moving") || normType.includes("handling")) {
      return KNOWN_TYPE_MAPPINGS.MOVING_AND_HANDLING;
    }
    if (normType.includes("medication") && normType.includes("admin")) {
      return KNOWN_TYPE_MAPPINGS.MEDICATION_ADMINISTRATION;
    }
    if (normType.includes("firstaid") || normType.includes("lifesupport")) {
      return KNOWN_TYPE_MAPPINGS.BASIC_LIFE_SUPPORT_FIRST_AID;
    }
    if (normType.includes("infection")) {
      return KNOWN_TYPE_MAPPINGS.INFECTION_PREVENTION_AND_CONTROL;
    }
    if (normType.includes("health") && normType.includes("safety")) {
      return KNOWN_TYPE_MAPPINGS.HEALTH_AND_SAFETY;
    }
    if (normType.includes("fire")) {
      return KNOWN_TYPE_MAPPINGS.FIRE_SAFETY;
    }
    if (normType.includes("food")) {
      return KNOWN_TYPE_MAPPINGS.FOOD_HYGIENE;
    }
    if (normType.includes("gdpr") || normType.includes("dataprotection")) {
      return KNOWN_TYPE_MAPPINGS.GDPR_DATA_PROTECTION;
    }
    if (normType.includes("dbs") || normType.includes("crb")) {
      return KNOWN_TYPE_MAPPINGS.ENHANCED_DBS_CERTIFICATE;
    }
    if (normType.includes("cv") || normType.includes("resume")) {
      return KNOWN_TYPE_MAPPINGS.CV_RESUME;
    }
    if (normType.includes("reference") && normType.includes("1")) {
      return KNOWN_TYPE_MAPPINGS.PROFESSIONAL_REFERENCE_1;
    }
    if (normType.includes("reference") && normType.includes("2")) {
      return KNOWN_TYPE_MAPPINGS.PROFESSIONAL_REFERENCE_2;
    }
    if (normType.includes("liability")) {
      return KNOWN_TYPE_MAPPINGS.PUBLIC_LIABILITY_INSURANCE;
    }
    if (normType.includes("indemnity")) {
      return KNOWN_TYPE_MAPPINGS.PROFESSIONAL_INDEMNITY_INSURANCE;
    }
    if (normType.includes("dementia")) {
      return KNOWN_TYPE_MAPPINGS.DEMENTIA_TRAINING;
    }
  }

  // 2. Match based on category input
  if (catInput) {
    const rawCatKey = catInput.toUpperCase().trim();
    if (CATEGORY_MAP[rawCatKey]) {
      const catId = CATEGORY_MAP[rawCatKey].catId;
      const catObj = DOCUMENT_CATEGORIES.find((c) => c.id === catId);
      if (catObj && catObj.types.length > 0) {
        return {
          catId: catObj.id,
          catLabel: catObj.label,
          typeValue: catObj.types[0].value,
          typeLabel: catObj.types[0].label,
        };
      }
    }
  }

  // 3. Fallback default to Passport in Identity Documents
  return {
    catId: "IDENTITY",
    catLabel: "Identity Documents",
    typeValue: "Passport",
    typeLabel: "Passport",
  };
}

export default function AdminUploadCarerDocumentModal({
  isOpen,
  onClose,
  carerId,
  carerName,
  documentId,
  initialCategory,
  initialType,
  isLocked = true,
  onUploadSuccess,
}: AdminUploadCarerDocumentModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const initialResolved = resolveCategoryAndType(initialCategory, initialType);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialResolved.catId);
  const [selectedType, setSelectedType] = useState<string>(initialResolved.typeValue);
  const [resolvedMeta, setResolvedMeta] = useState(initialResolved);
  const [customDocumentType, setCustomDocumentType] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      const resolved = resolveCategoryAndType(initialCategory, initialType);
      setResolvedMeta(resolved);
      setSelectedCategory(resolved.catId);
      setSelectedType(resolved.typeValue);
      setSelectedFile(null);
      setInternalNotes("");
      setErrorMsg(null);
    }
  }, [isOpen, initialCategory, initialType]);

  // Lock body scroll and handle Escape key to prevent background moving
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isSubmitting) {
          handleClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, isSubmitting]);

  if (!isOpen || !mounted) return null;

  const currentCategoryObj =
    DOCUMENT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    DOCUMENT_CATEGORIES[0];

  const currentTypeObj =
    currentCategoryObj.types.find((t) => t.value === selectedType) || {
      value: selectedType,
      label: selectedType,
    };

  const handleCategoryChange = (catId: string) => {
    if (isLocked) return;
    setSelectedCategory(catId);
    const cat = DOCUMENT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.types.length > 0) {
      setSelectedType(cat.types[0].value);
    }
    setErrorMsg(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    const validExtensions = ["pdf", "jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(ext)) {
      setErrorMsg(
        "Invalid file format. Please upload a PDF or Image (PNG, JPG, JPEG, WebP)."
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum permitted file size is 25MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    if (!carerId) {
      setErrorMsg("Missing carer identification.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // When locked, strictly use the resolved metadata
      const catToSend = isLocked ? resolvedMeta.catId : selectedCategory;
      const typeToSend = isLocked ? resolvedMeta.typeValue : selectedType;
      
      let finalCategory = catToSend;
      if (finalCategory === "Insurance & Business") finalCategory = "INSURANCE";
      else if (finalCategory === "Identity & Right to Work") finalCategory = "IDENTITY";
      else if (finalCategory === "Mandatory Care Training") finalCategory = "MANDATORY_TRAINING";
      else if (finalCategory === "Compliance & Background Checks") finalCategory = "COMPLIANCE";
      else if (finalCategory === "Additional Training (Optional)") finalCategory = "ADDITIONAL_TRAINING";

      let finalType = typeToSend;
      const typeMap: Record<string, string> = {
        "Public Liability Insurance": "PUBLIC_LIABILITY_INSURANCE",
        "Professional Indemnity Insurance": "PROFESSIONAL_INDEMNITY_INSURANCE",
        "UTR Certificate": "UTR_CERTIFICATE",
        "Self-Employment Registration": "SELF_EMPLOYMENT_REGISTRATION",
        "Certificate of Incorporation": "LIMITED_COMPANY_CERTIFICATE",
        "Business Insurance": "BUSINESS_INSURANCE",
        "VAT Registration Certificate": "VAT_CERTIFICATE",
        "Passport": "PASSPORT",
        "Driving Licence": "DRIVING_LICENCE",
        "Driving Licence (Front)": "DRIVING_LICENCE_FRONT",
        "Driving Licence (Back)": "DRIVING_LICENCE_BACK",
        "Proof of Address": "PROOF_OF_ADDRESS",
        "Right to Work in the UK": "RIGHT_TO_WORK",
        "Proof of National Insurance Number": "NATIONAL_INSURANCE_PROOF",
        "Safeguarding Adults": "SAFEGUARDING_ADULTS",
        "Moving and Handling": "MOVING_AND_HANDLING",
        "Medication Administration": "MEDICATION_ADMINISTRATION",
        "Basic Life Support / First Aid": "BASIC_LIFE_SUPPORT_FIRST_AID",
        "Infection Prevention and Control": "INFECTION_PREVENTION_AND_CONTROL",
        "Health and Safety": "HEALTH_AND_SAFETY",
        "Fire Safety": "FIRE_SAFETY",
        "Food Hygiene": "FOOD_HYGIENE",
        "GDPR / Data Protection": "GDPR_DATA_PROTECTION",
        "Enhanced DBS Certificate": "ENHANCED_DBS_CERTIFICATE",
        "CV / Resume": "CV_RESUME",
        "Professional Reference 1": "PROFESSIONAL_REFERENCE_1",
        "Professional Reference 2": "PROFESSIONAL_REFERENCE_2",
        "Additional Reference": "ADDITIONAL_REFERENCE"
      };
      if (typeMap[typeToSend]) finalType = typeMap[typeToSend];

      formData.append("category", finalCategory);
      formData.append("type", finalType);

      if (documentId) {
        formData.append("documentId", documentId);
        formData.append("replaceExisting", "true");
      }

      if (customDocumentType.trim()) {
        formData.append("customDocumentType", customDocumentType.trim());
      }

      if (internalNotes.trim()) {
        formData.append("internalNotes", internalNotes.trim());
      }

      // Explicitly set to PENDING per user requirement
      formData.append("status", "PENDING");

      const res = await adminService.uploadCarerDocument(carerId, formData);

      showSuccessToast(
        documentId ? "Document Replaced" : "Document Uploaded",
        `Document "${selectedFile.name}" has been ${documentId ? "replaced" : "uploaded"} successfully for ${carerName || "the carer"} and queued for compliance review.`
      );

      onUploadSuccess(res);
      handleClose();
    } catch (err: any) {
      console.error("Failed to upload document on behalf of carer:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload document. Please try again.";
      setErrorMsg(msg);
      showErrorToast("Upload Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedFile(null);
    setCustomDocumentType("");
    setInternalNotes("");
    setErrorMsg(null);
    onClose();
  };

  const modalElement = (
    <div
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ margin: 0, top: 0, left: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-gold-300/20 bg-gradient-to-b from-navy-900 to-[#0a0f1d] p-6 text-gold-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold-300/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gold-200">
                {documentId ? "Replace Compliance Document" : "Upload Compliance Document"}
              </h2>
            </div>
            <p className="text-xs text-gold-100/60">
              {documentId ? (
                <>
                  Replace existing compliance document with an updated file for{" "}
                  <span className="text-gold-200 font-semibold">
                    {carerName || "this carer"}
                  </span>
                  .
                </>
              ) : (
                <>
                  Upload a compliance, identity, or training record on behalf of{" "}
                  <span className="text-gold-200 font-semibold">
                    {carerName || "this carer"}
                  </span>
                  .
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-gold-100/40 hover:text-gold-200 hover:bg-gold/10 transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Document Category — Clean Auto-filled & Non-changeable (no lock icon or badges) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gold-200/80">
              Document Category
            </label>
            {isLocked ? (
              <div className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-200 font-semibold select-none shadow-inner">
                <span className="truncate">{resolvedMeta.catLabel}</span>
              </div>
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none transition"
              >
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-navy-950 text-gold-100">
                    {cat.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Specific Document Type — Clean Auto-filled & Non-changeable (no lock icon or badges) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gold-200/80">
              Specific Document Type
            </label>
            {isLocked ? (
              <div className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-200 font-semibold select-none shadow-inner">
                <span className="truncate">{resolvedMeta.typeLabel}</span>
              </div>
            ) : (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-100 focus:border-gold focus:outline-none transition"
              >
                {currentCategoryObj.types.map((type) => (
                  <option key={type.value} value={type.value} className="bg-navy-950 text-gold-100">
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Custom Document Name if "Other" or custom certificate */}
          {!isLocked && (selectedType === "Other" ||
            selectedType === "Any Other Relevant Certificates" ||
            selectedType === "Additional Training") && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gold-200/80">
                Custom Document Title / Certificate Name
              </label>
              <input
                type="text"
                value={customDocumentType}
                onChange={(e) => setCustomDocumentType(e.target.value)}
                placeholder="e.g. Specialized Dementia Care Certificate"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-100 placeholder-gold-100/30 focus:border-gold focus:outline-none transition"
              />
            </div>
          )}

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gold-200/80">
              Internal Admin Notes (Optional)
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder='e.g. "Verified with Home Office checking service on 16/09/2026."'
              disabled={isSubmitting}
              rows={2}
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950/80 px-3.5 py-2.5 text-xs text-gold-100 placeholder-gold-100/30 focus:border-gold focus:outline-none transition resize-none"
            />
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gold-200/80">
              Upload File (PDF or Image)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition duration-200 ${
                  isDragging
                    ? "border-gold bg-gold/10"
                    : "border-gold-300/20 bg-navy-950/40 hover:border-gold-300/40 hover:bg-navy-950/60"
                }`}
              >
                <Upload className="w-8 h-8 text-gold/60 mb-2" />
                <p className="text-xs font-semibold text-gold-200">
                  Click to select or drag and drop document
                </p>
                <p className="text-[10px] text-gold-100/40 mt-1">
                  Supports PDF, PNG, JPG, JPEG, WebP (Max 25MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/60 border border-gold-300/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gold-200 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-gold-100/50">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  disabled={isSubmitting}
                  className="p-1 rounded-lg text-gold-100/40 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold-300/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gold-100/70 hover:text-gold-200 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-[#F5D4A0] via-[#D4AF37] to-[#C99232] hover:brightness-110 shadow-md shadow-gold/20 flex items-center gap-2 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <ThinSpinner size="xs" spinnerClassName="border-navy-950" className="inline-flex flex-row space-y-0" />
                  {documentId ? "Replacing..." : "Uploading..."}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {documentId ? "Replace Document" : "Upload Document"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalElement, document.body) : null;
}
