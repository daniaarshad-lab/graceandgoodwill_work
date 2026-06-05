export interface ClientUser {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

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
}

export interface ClientState {
  profile: ClientProfile | null;
  careRequests: CareRequest[];

  enquiries: any[];
  selectedEnquiry: any | null;

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