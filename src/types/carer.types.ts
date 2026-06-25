export interface CarerUser {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  dateOfBirth?: string;
}

export interface CarerProfile {
  dateOfBirth: any;
  id: string;
  userId: string;
  user?: CarerUser;

  bio: string | null;
  summary: string | null;
  profilePhotoUrl: string | null;
  introVideoUrl: string | null;

  experienceYears: number | null;
  experience: string | null;

  hourlyRate: string | null;

  postcode: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
  address: string | null;

  careSpecialties: string | null;

  /** ISO date strings, e.g. ["2026-06-10", "2026-06-12"] */
  availability: string[];

  careTypes: string[];

  canDrive?: boolean | null;
  hasBusinessInsurance?: boolean | null;

  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  emergencyContactRelation?: string | null;
  drivingPreferences?: string[];
  dbsUpdateServiceNumber?: string | null;
  employmentHistory?: any;
  declarations?: any;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateCarerProfilePayload {
  bio?: string;
  experienceYears?: number;
  hourlyRate?: number;

  postcode?: string;
  city?: string;
  address?: string;

  availability?: string[];

  careTypes?: string[];

  profilePhotoUrl?: string;

  careSpecialties?: string;
  experience?: string;
  summary?: string;

  state?: string;
  pincode?: string;

  canDrive?: boolean;
  hasBusinessInsurance?: boolean;

  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  drivingPreferences?: string[];
  dbsUpdateServiceNumber?: string;
  employmentHistory?: any;
  declarations?: any;
}

/** Array of ISO date strings sent to PUT /carer/profile/availability */
export type UpdateAvailabilityPayload = string[];

/** Care request as returned by GET /carer/care-requests */
export interface CarerCareRequest {
  id: string;
  clientProfileId: string;
  startDate: string;
  duration: string;
  endDate?: string | null;
  isOngoing?: boolean;
  weeklyPayRange?: { min: number; max: number } | null;
  careCategory: string;
  requirements: string;
  address: string;
  city?: string | null;
  postcode?: string | null;
  status: string;
  shiftType: string;
  adminMatching?: boolean;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Full detail for a single care request: GET /carer/care-request/:id */
export interface CarerCareRequestDetail extends CarerCareRequest {
  requestorName?: string;
  requestorEmail?: string;
  requestorPhone?: string;
  additionalNotes?: string | null;
  scheduleNotes?: string | null;
  clientProfile?: {
    id: string;
    city?: string | null;
    postcode?: string | null;
    address?: string | null;
  };
  [key: string]: any; // allow additional backend fields
}

/** Payload for POST /carer/care-requests/:id/apply (body may be empty) */
export interface CarerApplicationPayload {
  coverNote?: string;
}
