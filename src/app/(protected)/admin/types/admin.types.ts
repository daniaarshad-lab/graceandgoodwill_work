export interface DocumentStatus {
  id?: string;
  name: string;
  status: "Uploaded" | "Missing" | "Verified" | "Rejected";
  fileCategory?: string;
  fileType?: string;
  fileUrl?: string;
}

export interface CarerApplication {
  id: string;
  carerProfileId?: string;
  internalAccountNumber?: string;
  publicProfileId?: string;
  name: string;
  experience: string; // e.g., "5 years"
  city: string;
  dbsStatus: "Pending" | "Verified" | "Failed";
  specialties: string[];
  documents: DocumentStatus[];
  availability: string; // e.g., "Full-time", "Weekends"
  status: "Pending" | "Approved" | "Rejected";
  email: string;
  phone: string;
  registrationDate?: string;
}

export interface ClientRequest {
  id: string;
  clientProfileId?: string;
  clientId?: string;
  internalAccountNumber?: string;
  publicProfileId?: string;
  clientName: string;
  careType: string; // e.g., "Live-in Care", "Hourly Care"
  location: string;
  exactAddress?: string;
  postcode?: string;
  city?: string;
  urgency: "Standard" | "High" | "Emergency";
  startDate: string;
  endDate?: string | null;
  isOngoing?: boolean;
  notes: string;
  status:
    | "NEW_ENQUIRY"
    | "OPEN_FOR_APPLICATIONS"
    | "UNDER_REVIEW"
    | "INFORM_CLIENT_TO_AVAILABLE_CARER"
    | "CARER_SELECTED"
    | string;
  email: string;
  phone: string;
  interestListCount?: number;
  clientStatus?: "PENDING" | "APPROVED" | "SUSPENDED" | "ACTIVE" | string;
  clientAgreedWeeklyFee?: number | null;
  placement?: {
    id: string;
    status: string;
    rejectionReason?: string | null;
    rejectedAt?: string | null;
    acceptedAt?: string | null;
    carerProfile?: {
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phoneNumber?: string;
      };
    };
  } | null;
}

export interface PlacementTimelineEvent {
  title: string;
  timestamp: string;
  description: string;
}

export interface Placement {
  id: string;
  clientId: string;
  clientName: string;
  carerId: string;
  carerName: string;
  careType: string;
  location: string;
  urgency: "Standard" | "High" | "Emergency";
  status:
    | "PENDING_ACCEPTANCE"
    | "PLACEMENT_CONFIRMED"
    | "REJECTED_BY_CARER"
    | "PLACEMENT_STARTED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED"
    | string;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  acceptedAt?: string | null;
  contactDetailsReleased: boolean;
  startDate: string;
  timeline: PlacementTimelineEvent[];
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  adminName?: string;
}

export interface InternalNoteAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileKey?: string;
}

export interface InternalNoteHistory {
  id: string;
  noteId: string;
  editorId: string;
  editor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  oldTitle: string;
  newTitle: string;
  oldContent: string;
  newContent: string;

  oldStatus?: string;
  newStatus?: string;
  oldPriority?: string;
  newPriority?: string;

  oldIsPinned?: boolean;
  newIsPinned?: boolean;

  oldCategory?: string;
  newCategory?: string;
  oldTaggedAdminId?: string;
  newTaggedAdminId?: string;
  oldTaggedAdminName?: string;
  newTaggedAdminName?: string;
  oldFollowUpDate?: string;
  newFollowUpDate?: string;

  createdAt: string;
}

export interface InternalNote {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  category?: string;
  isPinned: boolean;
  followUpDate?: string;
  taggedAdmins?: string[];
  author: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  attachments?: InternalNoteAttachment[];
  history?: InternalNoteHistory[];
}

export interface CreateInternalNotePayload {
  title: string;
  content: string;
  status?: string;
  priority?: string;
  category?: string;
  isPinned?: boolean;
  followUpDate?: string;
  taggedAdmins?: string[];
  carerProfileId?: string;
  clientProfileId?: string;
  placementId?: string;
}

export interface UpdateInternalNotePayload {
  title?: string;
  content?: string;
  priority?: string;
  status?: string;
  category?: string;
  isPinned?: boolean;
  followUpDate?: string;
  taggedAdmins?: string[];
}

export interface GetInternalNotesParams {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  isPinned?: boolean;
  carerProfileId?: string;
  clientProfileId?: string;
  placementId?: string;
  page?: number;
  limit?: number;
}

export interface AdminPlacementDetail {
  id: string;
  carerProfileId: string;
  clientProfileId: string;
  careRequestId: string | null;
  status: string;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  acceptedAt?: string | null;
  contactDetailsReleased?: boolean;
  contactDetailsReleasedAt?: string | null;
  releaseNotificationSent?: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  carerProfile: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      status: string;
    };
    documents: any[];
  };
  clientProfile: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
  careRequest: any | null;
  invoices: any[];
  carerPayments?: CarerPayment[];
  internalNotes: InternalNote[];
  preferredBackupCarerProfileId?: string | null;
  preferredBackupCarer?: any | null;
  activeReliefCarer?: any | null;
  backupCarers?: any[] | null;
  leaveRequests?: any[] | null;
}

export interface CarerPayment {
  id: string;
  placementId: string;
  carerProfileId: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: string | number; // Decimal string
  status: "UNPAID" | "PAID" | "OVERDUE";
  paidAt: string | null;
  transactionProofUrl: string | null;
}

export interface CarerComplianceDocument {
  id: string;
  carerProfileId: string;
  fileName: string;
  fileUrl: string;
  fileKey?: string;
  fileSize: number;
  fileCategory: string;
  fileType: string;
  mimeType?: string;
  status: "PENDING" | "VERIFIED" | "FAILED" | "REJECTED";
  rejectionReason?: string | null;
  internalNotes?: string | null;
  customDocumentType?: string | null;
  expiryDate?: string | null;
  dbsCertificateNumber?: string | null;
  isExpired?: boolean;
  reminderMilestonesSent?: number[];
  lastReminderSentAt?: string | null;
  uploadedByRole?: string;
  uploadedById?: string;
  uploadedByName?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string | null;
  rejectedById?: string;
  rejectedByName?: string;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
