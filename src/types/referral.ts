export type ReferralStatus =
  | "PENDING"
  | "EMAIL_SENT"
  | "REGISTERED"
  | "APPROVED"
  | "REJECTED";

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type: "CARER" | "CLIENT";
  status: ReferralStatus;
  submittedDate: string;
  notes?: string;
  resumeName?: string;
}

export interface CarerReferralRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cv: File;
}

export interface CarerReferralResponse {
  id: string;
  referrerId: string;
  type: "CARER" | "CLIENT";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cvUrl: string;
  createdAt: string;
  status: string;
}

export interface ClientReferralRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ClientReferralResponse {
  id: string;
  referrerId: string;
  type: "CARER" | "CLIENT";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  cvUrl: string | null;
  createdAt: string;
  status: string;
}

export interface ReferralState {
  referrals: Referral[];
  clientReferrals: ClientReferralResponse[];
  carerReferrals: CarerReferralResponse[];
  loading: boolean;
  submitting: boolean;
  success: boolean;
  error: string | null;
  referral: CarerReferralResponse | ClientReferralResponse | null;
}

export interface CreateClientReferralInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
