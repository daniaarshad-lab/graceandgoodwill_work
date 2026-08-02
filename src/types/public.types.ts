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
