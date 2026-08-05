export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  subject?: string | null;
  message: string;
}

export interface PublicLegalAgreement {
  id: string;
  title: string;
  type: string;
  content: string;
  version: string;
  isActive: boolean;
  targetRole: string;
  createdAt: string;
  updatedAt: string;
}
