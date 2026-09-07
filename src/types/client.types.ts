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

  isLifetimeFeePaid?: boolean;
  isLifetimeFeeWaived?: boolean;
  lifetimeFeeWaiverCutoff?: string;
  lifetimeFeeInvoiceId?: string | null;
  defaultWeeklyFee?: number | null;
  gocardlessCustomerId?: string | null;
  gocardlessMandateId?: string | null;

  careNote?: string | null;
  careStartDate?: string | null;
  careEndDate?: string | null;
  carePostcode?: string | null;
  careAddress?: string | null;

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
  careNote?: string | null;
  careStartDate?: string | null;
  careEndDate?: string | null;
  carePostcode?: string | null;
  careAddress?: string | null;
}

export interface CreateCareRequestPayload {
  postcode?: string;
  city?: string;
  address: string;

  careCategory: string[];
  requirements: string;
  scheduleNotes?: string;

  requestorName: string;
  requestorEmail: string;
  requestorPhone: string;

  startDate: string;
  endDate?: string | null;
  durationCategory: "PERMANENT" | "SHORT_DURATION";

  additionalNotes?: string;
  shiftType: string;

  /** Weekly pay range for the placement */
  weeklyPayRange?: string;
}

export interface ClientPlacement {
  id: string;
  carerProfileId: string;
  clientProfileId: string;
  careRequestId: string | null;
  hourlyRate: string | number;
  status:
    | "PENDING_ACCEPTANCE"
    | "PLACEMENT_CONFIRMED"
    | "REJECTED_BY_CARER"
    | "PLACEMENT_STARTED"
    | "ACTIVE"
    | "COMPLETED"
    | "TERMINATED"
    | "CANCELLED"
    | "PENDING"
    | "MATCHING"
    | "APPROVED"
    | "ONGOING"
    | string;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  acceptedAt?: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  weeklyFee?: number | string | null;
  billingStatus?: string;
  gocardlessMandateId?: string | null;
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
  hasSubmittedFeedback?: boolean;
  invoices?: Invoice[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  dueDate: string;
  pdfUrl: string | null;
  receiptUrl: string | null;
}

export interface FeedbackPayload {
  rating: number;
  message: string;
}

export interface ClientFeedback {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
  placement?: {
    id: string;
    startDate: string;
    endDate: string | null;
  };
  carerProfile?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  clientProfile?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
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

  /** Applications for care requests mapped by careRequestId */
  applications: Record<string, CareRequestApplication[]>;
  applicationsLoading: boolean;
  applicationsError: string | null;

  loading: boolean;
  error: string | null;

  feedbacks: ClientFeedback[];
  feedbacksLoading: boolean;
  feedbacksError: string | null;
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

  /** Whether this care request is for ongoing/permanent care */
  isOngoing?: boolean;
  /** Weekly pay range for the placement */
  weeklyPayRange?: { min: number; max: number } | null;

  createdAt: string;
  updatedAt: string;
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
  isAssignedByAdmin?: boolean;
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

export interface EmergencyCareRequestPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  whoNeedsSupport: string;
  location: string;
  preferredContactMethod: string;
  additionalEmergencyDetails?: string;
}
