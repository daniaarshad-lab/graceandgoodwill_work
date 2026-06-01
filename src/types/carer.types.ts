export interface CarerUser {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
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

export interface CarerProfile {
  id: string;
  userId: string;
  user?: CarerUser;

  bio: string | null;
  summary: string | null;
  profilePhotoUrl: string | null;

  experienceYears: number | null;
  experience: string | null;

  hourlyRate: string | null;

  postcode: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
  address: string | null;

  careSpecialties: string | null;

  availability: AvailabilityDay[];

  careTypes: string[];

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

  availability?: AvailabilityDay[];

  careTypes?: string[];

  profilePhotoUrl?: string;

  careSpecialties?: string;
  experience?: string;
  summary?: string;

  state?: string;
  pincode?: string;
}

export type UpdateAvailabilityPayload = AvailabilityDay[];
