import { apiFetch } from "@/lib/api";
import {
  Referral,
  CarerReferralResponse,
  ClientReferralRequest,
  ClientReferralResponse,
} from "@/types/referral";

export const referralService = {
  async getReferrals(): Promise<Referral[]> {
    return [];
  },

  async submitCarerReferral(
    formData: FormData,
  ): Promise<CarerReferralResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch("/carer/referral", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response as CarerReferralResponse;
  },

  async submitClientReferral(
    payload: ClientReferralRequest,
  ): Promise<ClientReferralResponse> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch("/client/referral", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return response as ClientReferralResponse;
  },

  async getClientReferrals(status: string): Promise<ClientReferralResponse[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch(`/client/referrals?status=${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response as ClientReferralResponse[];
  },

  async getCarerReferrals(status: string): Promise<CarerReferralResponse[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch(`/carer/referrals?status=${status}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response as CarerReferralResponse[];
  },
};
