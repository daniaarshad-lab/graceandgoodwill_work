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

export interface ReferralState {
  referrals: Referral[];
  loading: boolean;
  submitting: boolean;
  success: boolean;
  error: string | null;
}

export interface CreateCarerReferralInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File;
  notes?: string;
}

export interface CreateClientReferralInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
