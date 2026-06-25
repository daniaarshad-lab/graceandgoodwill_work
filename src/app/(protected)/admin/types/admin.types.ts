export interface DocumentStatus {
  id?: string;
  name: string;
  status: "Uploaded" | "Missing" | "Verified" | "Rejected";
  fileCategory?: string;
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
