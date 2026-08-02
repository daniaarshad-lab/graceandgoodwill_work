import { apiFetch } from "@/lib/api";
import { ContactRequest, ContactResponse } from "@/types/public.types";

export const publicService = {
  async submitContactForm(payload: ContactRequest): Promise<ContactResponse> {
    const response = await apiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response as ContactResponse;
  },
};
