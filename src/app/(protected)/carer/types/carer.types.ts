export interface ComplianceDoc {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "verified" | "pending" | "failed";
  size: string;
  previewUrl?: string;
}

export interface DayAvailability {
  enabled: boolean;
  shifts: {
    morning: boolean; // 8:00 AM - 12:00 PM
    afternoon: boolean; // 12:00 PM - 5:00 PM
    night: boolean; // 5:00 PM - 10:00 PM
  };
}

export interface WeeklyAvailability {
  [key: string]: DayAvailability;
}

export interface AvailabilitySlot {
  shiftType: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityDay {
  dayOfWeek: number;
  enabled: boolean;
  slots: AvailabilitySlot[];
}

export interface UpdateCarerProfilePayload {
  bio: string;
  experienceYears: number;
  hourlyRate: number;

  postcode: string;
  city: string;
  address: string;

  availability: AvailabilityDay[];

  careTypes: string[];

  profilePhotoUrl: string;

  careSpecialties: string;
  experience: string;
  summary: string;

  state: string;
  pincode: string;
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
