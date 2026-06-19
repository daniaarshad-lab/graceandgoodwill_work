import { apiFetch } from "@/lib/api";
import {
  Referral,
  CarerReferralResponse,
  ClientReferralRequest,
  ClientReferralResponse,
} from "@/types/referral";

// Retrieve list from localStorage or fallback to empty array
const getPersistedReferrals = (): Referral[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("grace_goodwill_referrals");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savePersistedReferrals = (referrals: Referral[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("grace_goodwill_referrals", JSON.stringify(referrals));
  } catch (err) {
    console.error("Failed to save referrals to localStorage", err);
  }
};

export const referralService = {
  async getReferrals(): Promise<Referral[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getPersistedReferrals();
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

    const typedResponse = response as CarerReferralResponse;

    // Map response and append to mock referrals list so that it dynamically populates lists
    const mapped: Referral = {
      id: typedResponse.id,
      firstName: typedResponse.firstName,
      lastName: typedResponse.lastName,
      email: typedResponse.email,
      phone: typedResponse.phoneNumber,
      type: "CARER",
      status: "PENDING",
      submittedDate: typedResponse.createdAt,
      resumeName: typedResponse.cvUrl.split("/").pop() || "cv.pdf",
    };

    const currentList = getPersistedReferrals();
    savePersistedReferrals([mapped, ...currentList]);

    return typedResponse;
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

    const typedResponse = response as ClientReferralResponse;

    const mapped: Referral = {
      id: typedResponse.id,
      firstName: typedResponse.firstName,
      lastName: typedResponse.lastName,
      email: typedResponse.email,
      phone: typedResponse.phoneNumber || undefined,
      type: "CLIENT",
      status: "PENDING",
      submittedDate: typedResponse.createdAt,
    };

    const currentList = getPersistedReferrals();
    savePersistedReferrals([mapped, ...currentList]);

    return typedResponse;
  },
};
