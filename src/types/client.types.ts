export interface ClientUser {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

import { Carer } from "@/app/(protected)/client/types/client-ui.types";

export interface ClientProfile {
  id: string;
  userId: string;

  postcode?: string | null;
  pincode?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;

  profilePhotoUrl?: string | null;

  status: string;
  createdAt: string;
  updatedAt: string;

  user?: ClientUser;
}

export interface UpdateClientProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  postcode?: string | null;
  profilePhotoUrl?: string | null;
}

export interface CreateCareRequestPayload {
  postcode?: string;
  city?: string;
  address: string;

  careCategory: string;
  requirements: string;
  scheduleNotes?: string;

  requestorName: string;
  requestorEmail: string;
  requestorPhone: string;

  startDate: string;
  duration: string;

  additionalNotes?: string;
  shiftType: string;

  /** Whether this is an ongoing/permanent placement */
  isOngoing?: boolean;
  /** Weekly pay range for the placement */
  weeklyPayRange?: string;
}

export interface ClientPlacement {
  id: string;
  carerProfileId: string;
  clientProfileId: string;
  careRequestId: string | null;
  hourlyRate: string | number;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED" | "CANCELLED" | "PENDING" | "MATCHING" | "APPROVED" | "ONGOING";
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  carerProfile: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
  careRequest: CareRequest | null;
}

export interface ClientState {
  profile: ClientProfile | null;
  careRequests: CareRequest[];
  carers: Carer[];
  placements: ClientPlacement[];
  placementsLoading: boolean;
  placementsError: string | null;

  interestList: any[]; // The backend might return carer objects or joined entities. We'll map them to UI Carer objects later if needed.
  interestListLoading: boolean;

  enquiries: any[];
  selectedEnquiry: any | null;

  /** Applications for a selected care request */
  applications: CareRequestApplication[];
  applicationsLoading: boolean;
  applicationsError: string | null;

  loading: boolean;
  error: string | null;
}
export interface CareRequest {
  id: string;
  clientProfileId: string;
  progress?: number;

  requestorName: string;
  requestorEmail: string;
  requestorPhone: string;

  startDate: string;
  duration: string;
  /** Computed or set end date for the care request */
  endDate?: string | null;

  additionalNotes?: string | null;

  shiftType: string;

  postcode?: string | null;
  city?: string | null;
  address: string;

  careCategory: string;
  requirements: string;
  scheduleNotes?: string | null;

  status: string;
  isEmergency: boolean;
  adminMatching?: boolean;

  /** Whether this care request is for ongoing/permanent care */
  isOngoing?: boolean;
  /** Weekly pay range for the placement */
  weeklyPayRange?: { min: number; max: number } | null;

  createdAt: string;
  updatedAt: string;

  introductions: any[];
}

export interface CreateEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/** Application submitted by a carer for a care request */
export interface CareRequestApplication {
  id: string;
  careRequestId: string;
  carerProfileId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  carerProfile?: {
    id: string;
    bio: string | null;
    summary: string | null;
    profilePhotoUrl: string | null;
    experienceYears: number | null;
    experience: string | null;
    careSpecialties: string | null;
    availability: string[];
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export interface CarerProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  introVideoUrl?: string | null;
  experienceYears: number | null;
  hourlyRate: number | null;
  availability: string | null;
  careTypes: string[];
  careSpecialties: string[] | null;
  experience: string | null;
  summary: string | null;
}
