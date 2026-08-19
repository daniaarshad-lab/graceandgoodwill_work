import { apiFetch } from "@/lib/api";

export interface SubscribePayload {
  fullName: string;
  firstName: string;
  name: string;
  email: string;
  source: string;
}

export const newsletterService = {
  async subscribe(payload: SubscribePayload): Promise<any> {
    const body = JSON.stringify(payload);
    const data = await apiFetch("/newsletter/subscribe", {
      method: "POST",
      body,
    });
    return data;
  },
};
