export interface DocumentStatus {
  name: string;
  status: "Uploaded" | "Missing" | "Verified";
}

export interface CarerApplication {
  id: string;
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
  clientName: string;
  careType: string; // e.g., "Live-in Care", "Hourly Care"
  location: string;
  urgency: "Standard" | "High" | "Emergency";
  startDate: string;
  notes: string;
  status: "Unmatched" | "Matched" | "Reviewing" | "Emergency";
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
    | "Pending"
    | "Reviewing"
    | "Matched"
    | "Active"
    | "Completed"
    | "Emergency";
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
