import { apiFetch } from "@/lib/api";
import {
  ClientProfile,
  CreateCareRequestPayload,
  CareRequest,
  CreateEnquiryPayload,
  IntroductionRequestPayload,
  IntroductionRequest,
  UpdateClientProfilePayload,
  ClientPlacement,
} from "@/types/client.types";

export const clientService = {
  async getProfile(): Promise<ClientProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProfile(payload: UpdateClientProfilePayload): Promise<ClientProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async uploadProfilePhoto(file: File): Promise<ClientProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("photo", file);

    return apiFetch("/client/profile/photo", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },
  async createCareRequest(payload: CreateCareRequestPayload): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/care-request", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async getCareRequests(): Promise<CareRequest[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/care-requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async createEnquiry(payload: CreateEnquiryPayload): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/enquiry", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async getEnquiries() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/enquiry", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getEnquiryById(id: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/client/enquiry/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async sendEnquiryMessage(enquiryId: string, message: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/client/enquiry/${enquiryId}/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
      }),
    });
  },

  async requestIntroduction(
    payload: IntroductionRequestPayload,
  ): Promise<IntroductionRequest> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch("/client/introduction", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return response;
  },

  async getCarers() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const response = await apiFetch("/client/carers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  async getPlacements(): Promise<ClientPlacement[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/placements", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
