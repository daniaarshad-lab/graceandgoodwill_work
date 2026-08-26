export interface AdminDashboardStats {
  totalUsers?: number;
  totalCarers?: number;
  totalClients?: number;
  pendingApprovals?: number;
  pendingCarers?: number;
  activePlacements?: number;
  openSupportEnquiries?: number;
  unreadEnquiries?: number;
  emergencyCases?: number;
  pendingVerifications?: number;

  // Extended statistics fields
  activeClients?: number;
  activeCarers?: number;
  totalReferralPartners?: number;
  clientsRegisteredThisYear?: number;
  carersRegisteredThisYear?: number;
  referralPartnersRegisteredThisYear?: number;
  lifetimePlatformMembers?: number;
  membershipBreakdown?: {
    [key: string]: number;
  };
}

export interface AdminSearchResultItem {
  fullName: string;
  userType: string;
  internalAccountNumber?: string;
  publicProfileId?: string;
  membershipStatus?: string;
  active?: boolean;
  createdAt: string;
}

export interface PaginationData<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  status: string;
  loading: boolean;
  error: string | null;
}

/** Application submitted by a carer, as seen by admin */
export interface AdminCareRequestApplication {
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

/** Supported care request statuses for admin workflow */
export type CareRequestStatusValue =
  | "NEW_ENQUIRY"
  | "OPEN_FOR_APPLICATIONS"
  | "UNDER_REVIEW"
  | "INFORM_CLIENT_TO_AVAILABLE_CARER"
  | "CARER_SELECTED";

export const CARE_REQUEST_STATUS_OPTIONS: {
  value: CareRequestStatusValue;
  label: string;
}[] = [
  { value: "NEW_ENQUIRY", label: "New Enquiry" },
  { value: "OPEN_FOR_APPLICATIONS", label: "Open for Carer Applicants" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  {
    value: "INFORM_CLIENT_TO_AVAILABLE_CARER",
    label: "Inform Client to Available Carer",
  },
  { value: "CARER_SELECTED", label: "Carer Selected" },
];

export type EmergencyCareRequestStatusValue =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export const EMERGENCY_CARE_REQUEST_STATUS_OPTIONS: {
  value: EmergencyCareRequestStatusValue;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export interface EmergencyCareRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whoNeedsSupport: string;
  location: string;
  preferredContactMethod: string;
  additionalEmergencyDetails?: string;
  status: EmergencyCareRequestStatusValue;
  createdAt: string;
  updatedAt: string;
}

export interface AdminState {
  stats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
  activeTab: string;
  isSearchModalOpen: boolean;
  globalSearchQuery: string;
  globalSearchResults: AdminSearchResultItem[] | null;
  isSearchingGlobal: boolean;
  globalSearchError: string | null;
  carers: PaginationData<any>;
  careRequests: PaginationData<any>;
  emergencyCareRequests: PaginationData<EmergencyCareRequest>;
  clients: PaginationData<any>;
  selectedCarer: {
    data: any | null;
    loading: boolean;
    error: string | null;
  };

  /** Applications for a specific care request */
  selectedCareRequestApplications: AdminCareRequestApplication[];
  applicationsLoading: boolean;
  applicationsError: string | null;
}
