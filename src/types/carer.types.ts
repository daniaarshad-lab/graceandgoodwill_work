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
