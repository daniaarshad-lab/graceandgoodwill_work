export interface Carer {
  id: string;
  name: string;
  experience: string;
  specialties: string;
  availability: "Available" | "Limited Availability" | "Unavailable";
  bio: string;
  avatarBg: string;
  introVideoUrl?: string | null;
  location?: string;
  qualifications?: string;
  profilePhotoUrl?: string | null;
  fullBiography?: string;
  experienceDetails?: string;
  availabilityDetails?: string[];
  rawAvailability?: string[];
  email?: string;
  phone?: string;
  address?: string;
  feedbacks?: any[];
}

export interface CareRequest {
  id: string;
  fullName: string;
  careType: string;
  startDate: string;
  duration: string;
  status: "Pending" | "Reviewing" | "Matched" | "Completed";
  progress: number;

}

// Enquiry statuses matching backend lifecycle
export type EnquiryStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESPONDED"
  | "RESOLVED"
  | "CLOSED"
  | string;

// Individual message in a conversation thread
export interface EnquiryMessage {
  id: string;
  enquiryId: string;
  senderId: string;
  message: string;
  createdAt: string; // ISO datetime
}

// Full enquiry with conversation history
export interface Enquiry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  messages: EnquiryMessage[];
}
