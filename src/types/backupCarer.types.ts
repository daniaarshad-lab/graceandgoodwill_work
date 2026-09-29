export type PlacementCarerRole =
  | "PRIMARY_CARER"
  | "PREFERRED_BACKUP_CARER"
  | "ACTIVE_RELIEF_CARER";

export type AssignmentStatus =
  | "SCHEDULED"
  | "OFFER_PENDING"
  | "OFFER_DECLINED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "WITHDRAWN";

export type LeaveStatus =
  | "PENDING_RELIEF"
  | "OFFERED_TO_BACKUP"
  | "COVER_CONFIRMED"
  | "NO_COVER_NEEDED"
  | "CANCELLED"
  | "COMPLETED";

export interface CarerMiniProfile {
  id: string;
  userId: string;
  profilePhotoUrl?: string | null;
  experienceYears?: number | null;
  hourlyRate?: number | string | null;
  city?: string | null;
  postcode?: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    status?: string;
  };
}

export interface CarerLeaveRequest {
  id: string;
  placementId: string;
  carerProfileId: string;
  carerProfile?: CarerMiniProfile;
  startDate: string;
  endDate: string;
  reason?: string | null;
  status: LeaveStatus;
  reliefAssignmentId?: string | null;
  adminNotes?: string | null;
  requestedAt: string;
  updatedAt: string;
}

export interface PlacementCarerAssignment {
  id: string;
  placementId: string;
  carerProfileId: string;
  carerProfile?: CarerMiniProfile;
  role: PlacementCarerRole;
  status: AssignmentStatus;
  startDate: string;
  endDate?: string | null;
  totalDaysServed?: number | null;
  dailyRate?: number | string | null;
  totalPayEarned?: number | string | null;
  leaveRequestId?: string | null;
  offerSentAt?: string | null;
  acceptedAt?: string | null;
  declinedAt?: string | null;
  declineReason?: string | null;
  withdrawnAt?: string | null;
  withdrawalReason?: string | null;
  clientCarerAgreementSigned?: boolean;
}

export interface UnifiedPlacement {
  id: string;
  clientProfileId: string;
  careRequestId?: string | null;
  carerProfileId: string; // Primary carer
  preferredBackupCarerProfileId?: string | null;
  activeReliefCarerProfileId?: string | null;

  carerProfile: CarerMiniProfile;
  preferredBackupCarer?: CarerMiniProfile | null;
  activeReliefCarer?: CarerMiniProfile | null;

  clientProfile: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      phoneNumber?: string | null;
    };
  };

  careRequest?: {
    id: string;
    careCategory?: string | string[];
    requirements?: string;
    city?: string | null;
    address?: string | null;
    postcode?: string | null;
    startDate?: string;
    endDate?: string | null;
    isOngoing?: boolean;
    isEmergency?: boolean;
    additionalNotes?: string | null;
  } | null;

  hourlyRate?: number | string;
  weeklyFee?: number | string | null;
  dailyRate?: number | string | null;
  status: string;
  startDate: string;
  endDate?: string | null;
  contactDetailsReleased?: boolean;
  contactDetailsReleasedAt?: string | null;

  assignments?: PlacementCarerAssignment[];
  leaveRequests?: CarerLeaveRequest[];
  carerPayments?: any[];
  invoices?: any[];

  // Helper flags for UI rendering
  myRole?: PlacementCarerRole;
  pendingOffer?: {
    assignmentId: string;
    leaveRequestId?: string;
    startDate: string;
    endDate: string;
    nightsCount: number;
    clientName: string;
    location: string;
    dailyRate?: number | string;
  } | null;
}

export interface ReliefOffer {
  id: string;
  placementId: string;
  assignmentId: string;
  leaveRequestId?: string;
  clientName: string;
  clientProfilePhotoUrl?: string | null;
  location: string;
  startDate: string;
  endDate: string;
  nightsCount: number;
  dailyRate?: number | string;
  weeklyFee?: number | string;
  requirements?: string;
  status: AssignmentStatus;
  offeredAt: string;
}

export type WithdrawalTier = "ALLOWED" | "RESTRICTED_3_DAYS" | "COMMENCED_LOCKED";

export interface WithdrawalEligibility {
  tier: WithdrawalTier;
  hoursUntilStart: number;
  daysUntilStart: number;
  canWithdrawOnPlatform: boolean;
  message: string;
  phoneSupportNumber: string;
}

export interface PreferredBackupDesignation {
  id: string;
  clientProfileId?: string;
  clientName: string;
  city: string;
  postcode?: string;
  careCategory?: string | string[];
  startDateText?: string;
  status: string;
  isPreferredBackup: true;
  designatedAt?: string;
  notes?: string;
}
