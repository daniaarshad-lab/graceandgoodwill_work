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

  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  sortCode?: string | null;
  nationalInsuranceNumber?: string | null;

  drivingPreferences?: string[];
  dbsUpdateServiceNumber?: string | null;
  employmentHistory?: any;
  declarations?: any;
  onboardingStep?: number;
  hasMediaConsent?: boolean;

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

  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  nationalInsuranceNumber?: string;

  drivingPreferences?: string[];
  dbsUpdateServiceNumber?: string;
  employmentHistory?: any;
  declarations?: any;
  onboardingStep?: number;
  hasMediaConsent?: boolean;
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

export interface CarerApplicationPayload {
  coverNote?: string;
}

export interface CarerPlacement {
  id: string;
  carerProfileId: string;
  clientProfileId: string;
  careRequestId: string | null;
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
  hourlyRate?: number | string;
  weeklyFee?: number | string | null;
  dailyRate?: number | string | null;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  acceptedAt?: string | null;
  contactDetailsReleased?: boolean;
  contactDetailsReleasedAt?: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  clientProfile: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phoneNumber?: string;
    };
  };
  careRequest: {
    id: string;
    careCategory: string | string[];
    requirements: string;
    city?: string | null;
    address?: string | null;
    postcode?: string | null;
    startDate: string;
    endDate?: string | null;
    isOngoing?: boolean;
    isEmergency?: boolean;
    additionalNotes?: string | null;
  } | null;
  myRole?: string;
  roleTitle?: string;
  roleDescription?: string;
  isBackup?: boolean;
  backupPriority?: number | null;
  preferredBackupCarerProfileId?: string | null;
  backupCarers?: any[];
  [key: string]: any;
}

export interface CarerPayment {
  id: string;
  placementId: string;
  carerProfileId: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: string | number;
  status: "UNPAID" | "PAID" | "OVERDUE";
  paidAt: string | null;
  transactionProofUrl: string | null;
}
