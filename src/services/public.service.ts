import { apiFetch } from "@/lib/api";
import { ContactRequest, ContactResponse, PublicLegalAgreement } from "@/types/public.types";

export const publicService = {
  async submitContactForm(payload: ContactRequest): Promise<ContactResponse> {
    const response = await apiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response as ContactResponse;
  },

  async getPublicAgreement(type: string): Promise<PublicLegalAgreement | null> {
    try {
      const response = await apiFetch(`/agreements/public/${type}`, {
        method: "GET",
      });
      return response as PublicLegalAgreement;
    } catch (error) {
      console.warn(`Failed to fetch public agreement for type "${type}":`, error);
      return null;
    }
  },
};
