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
}

export interface ClientRequest {
  id: string;
  clientProfileId?: string;
  clientId?: string;
  clientName: string;
  careType: string; // e.g., "Live-in Care", "Hourly Care"
  location: string;
  urgency: "Standard" | "High" | "Emergency";
  startDate: string;
  notes: string;
  status:
    | "NEW_ENQUIRY"
    | "AWAITING_CONSULTATION"
    | "OPEN_FOR_APPLICATIONS"
    | "UNDER_REVIEW"
    | "CLIENT_INTERVIEW_STAGE"
    | "CARER_SELECTED"
    | "CANCELLED"
    | string;
  email: string;
  phone: string;
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
    | "PLACEMENT_CONFIRMED"
    | "PLACEMENT_STARTED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED"
    | string;
  contactDetailsReleased: boolean;
  startDate: string;
  timeline: PlacementTimelineEvent[];
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface InternalNoteAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface InternalNoteHistory {
  id: string;
  editorName: string;
  previousTitle: string;
  updatedTitle: string;
  editedAt: string;
}

export interface InternalNote {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  isPinned: boolean;
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
  isPinned?: boolean;
  carerProfileId?: string;
  clientProfileId?: string;
  placementId?: string;
}

export interface UpdateInternalNotePayload {
  title?: string;
  content?: string;
  priority?: string;
  isPinned?: boolean;
}

export interface GetInternalNotesParams {
  search?: string;
  status?: string;
  priority?: string;
  isPinned?: boolean;
  carerProfileId?: string;
  clientProfileId?: string;
  placementId?: string;
  page?: number;
  limit?: number;
}
