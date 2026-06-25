import { apiFetch } from "@/lib/api";
import {
  CarerProfile,
  UpdateCarerProfilePayload,
  UpdateAvailabilityPayload,
} from "@/types/carer.types";

export const carerService = {
  async getProfile(): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProfile(
    payload: UpdateCarerProfilePayload,
  ): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async uploadProfilePhoto(file: File): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("photo", file);

    return apiFetch("/carer/profile/photo", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async uploadDocument(file: File, category: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("category", category);

    return apiFetch("/carer/profile/document", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },
  async uploadDocuments(files: Record<string, File>) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    return apiFetch("/carer/profile/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async uploadStepDocuments(step: number, files: Record<string, File>, textFields?: Record<string, string>) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    if (textFields) {
      Object.entries(textFields).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });
    }

    return apiFetch(`/carer/profile/documents/step-${step}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async getDocuments() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/documents", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateAvailability(
    payload: UpdateAvailabilityPayload,
  ): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/availability", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async deleteDocument(id: string): Promise<void> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/carer/profile/document/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  async updateDocument(id: string, file: File, category: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    return apiFetch(`/carer/profile/document/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async uploadProfileMedia(
    photo?: File,
    video?: File
  ): Promise<CarerProfile> {
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    if (video) {
      formData.append("video", video);
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/media", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async updateStep2(payload: any): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/step-2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  async updateStep3(payload: any): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/step-3", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  async updateStep10(payload: any): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/step-10", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  async submitProfile(): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** GET /carer/care-requests — list all available placement opportunities */
  async getCareRequests(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/care-requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** GET /carer/care-request/:id — get full placement details */
  async getCareRequestById(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/carer/care-request/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** POST /carer/care-requests/:id/apply — apply to a care request */
  async applyToCareRequest(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/carer/care-requests/${id}/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
