export interface Carer {
  id: string;
  name: string;
  experience: string;
  specialties: string;
  availability: "Available" | "Limited Availability" | "Unavailable";
  bio: string;
  avatarBg: string;
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

export interface Enquiry {
  id: string;
  subject: string;
  message: string;
  preference: string;
  date: string;
  status: "Received" | "Responded";
}
