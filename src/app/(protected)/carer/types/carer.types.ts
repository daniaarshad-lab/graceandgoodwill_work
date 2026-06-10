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
  | "DRIVERS_LICENSE"
  | "CRIMINAL_RECORD_CHECK"
  | "DEMENTIA_SUPPORT"
  | "NURSES_REGISTRY";

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

