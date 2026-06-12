export interface ComplianceDoc {
  id: string;
  name: string;
  type: string;
  fileType: string;
  uploadDate: string;
  status: "verified" | "pending" | "failed";
  size: string;
  previewUrl?: string;
}

export type DocumentCategory =
  | "PASSPORT"
  | "DRIVERS_LICENSE"
  | "PROOF_OF_ADDRESS"
  | "RIGHT_TO_WORK"
  | "NI_PROOF"
  | "SAFEGUARDING_ADULTS"
  | "MOVING_AND_HANDLING"
  | "MEDICATION_ADMINISTRATION"
  | "BASIC_LIFE_SUPPORT"
  | "INFECTION_PREVENTION"
  | "HEALTH_AND_SAFETY"
  | "FIRE_SAFETY"
  | "FOOD_HYGIENE"
  | "GDPR"
  | "ENHANCED_DBS"
  | "CV"
  | "REFERENCE_1"
  | "REFERENCE_2"
  | "PUBLIC_LIABILITY"
  | "PROFESSIONAL_INDEMNITY"
  | "BUSINESS_INSURANCE"
  | "NVQ_2"
  | "NVQ_3"
  | "NVQ_4"
  | "NURSING_QUALIFICATION"
  | "UNIVERSITY_QUALIFICATION"
  | "DEMENTIA_TRAINING"
  | "END_OF_LIFE_CARE"
  | "CATHETER_CARE"
  | "PEG_FEEDING"
  | "STOMA_CARE"
  | "COMPLEX_CARE"
  | "MEDICATION_COMPETENCY"
  | "OTHER_RELEVANT"
  | "ADDITIONAL_TRAINING";

export interface CarerDocument {
  id: string;
  carerProfileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileCategory: string;
  fileType: string;
  status: "PENDING" | "VERIFIED" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

