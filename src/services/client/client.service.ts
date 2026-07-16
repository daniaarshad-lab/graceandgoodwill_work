import { apiFetch } from "@/lib/api";
import {
  ClientProfile,
  CreateCareRequestPayload,
  CareRequest,
  CreateEnquiryPayload,
  CareRequestApplication,
  UpdateClientProfilePayload,
  ClientPlacement,
  ClientFeedback,
  FeedbackPayload,
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

  /** POST /client/matches — create a match between a care request and a carer */
  async createMatch(careRequestId: string, carerProfileId: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/client/matches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ careRequestId, carerProfileId }),
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

  async submitFeedback(placementId: string, payload: FeedbackPayload): Promise<ClientFeedback> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/placements/${placementId}/feedback`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async getClientFeedbacks(): Promise<ClientFeedback[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/feedbacks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  /** GET /client/care-requests/:id/applications — get applications for a care request */
  async getCareRequestApplications(careRequestId: string): Promise<CareRequestApplication[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/client/care-requests/${careRequestId}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  async getPlacementDetail(placementId: string): Promise<ClientPlacement> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/placements/${placementId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getInterestList() {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/interest-list", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async addToInterestList(carerProfileId: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/interest-list", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ carerProfileId }),
    });
  },

  async reorderInterestList(carerProfileIds: string[]) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/interest-list/reorder", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ carerProfileIds }),
    });
  },

  async removeFromInterestList(carerProfileId: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/interest-list/${carerProfileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getInvoices(): Promise<any[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/invoices", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createLifetimeFeeCheckout(successUrl: string, cancelUrl: string): Promise<{ url: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/client/billing/lifetime-fee/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ successUrl, cancelUrl }),
    });
  },

  async subscribeToPlacement(placementId: string, successUrl: string, cancelUrl: string): Promise<{ url: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/placements/${placementId}/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ successUrl, cancelUrl }),
    });
  },

  async approveApplication(applicationId: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/applications/${applicationId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },

  async rejectApplication(applicationId: string, reason: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/client/applications/${applicationId}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
  },
};
