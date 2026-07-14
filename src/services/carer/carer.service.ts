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


  async uploadDocument(file: File, category: string, type: string) {
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
    formData.append("type", type);

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
      let mappedKey = key;
      if (mappedKey === "national_insurance_proof") mappedKey = "ni_proof";
      if (mappedKey === "driving_licence") mappedKey = "drivers_license";
      
      // Insurance documents mappings
      if (mappedKey === "public_liability_insurance") mappedKey = "public_liability";
      if (mappedKey === "professional_indemnity_insurance") mappedKey = "professional_indemnity";
      
      // Training documents mappings
      if (mappedKey === "basic_life_support_first_aid") mappedKey = "basic_life_support";
      if (mappedKey === "infection_prevention_and_control") mappedKey = "infection_prevention";
      if (mappedKey === "gdpr_data_protection") mappedKey = "gdpr";

      // Compliance documents mappings
      if (mappedKey === "enhanced_dbs_certificate") mappedKey = "enhanced_dbs";
      if (mappedKey === "cv_resume") mappedKey = "cv";
      if (mappedKey === "professional_reference_1") mappedKey = "reference_1";
      if (mappedKey === "professional_reference_2") mappedKey = "reference_2";

      formData.append(mappedKey, file);
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
      let mappedKey = key;
      if (mappedKey === "national_insurance_proof") mappedKey = "ni_proof";
      if (mappedKey === "driving_licence") mappedKey = "drivers_license";
      
      // Insurance documents mappings
      if (mappedKey === "public_liability_insurance") {
        mappedKey = step === 2 ? "business_insurance" : "public_liability";
      }
      if (mappedKey === "professional_indemnity_insurance") {
        mappedKey = "professional_indemnity";
      }
      
      // Training documents mappings
      if (mappedKey === "basic_life_support_first_aid") mappedKey = "basic_life_support";
      if (mappedKey === "infection_prevention_and_control") mappedKey = "infection_prevention";
      if (mappedKey === "gdpr_data_protection") mappedKey = "gdpr";

      // Compliance documents mappings
      if (mappedKey === "enhanced_dbs_certificate") mappedKey = "enhanced_dbs";
      if (mappedKey === "cv_resume") mappedKey = "cv";
      if (mappedKey === "professional_reference_1") mappedKey = "reference_1";
      if (mappedKey === "professional_reference_2") mappedKey = "reference_2";


      formData.append(mappedKey, file);
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

  /** POST /carer/profile-updates — submit a profile picture / intro video update request */
  async submitProfileUpdateRequest(photo?: File, video?: File, updateReason?: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    const formData = new FormData();
    if (photo) formData.append("photo", photo);
    if (video) formData.append("video", video);
    if (updateReason) formData.append("updateReason", updateReason);

    return apiFetch("/carer/profile-updates", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  },

  /** GET /carer/profile-updates — get all previous profile update requests */
  async getProfileUpdateRequests(): Promise<any[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/carer/profile-updates", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
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

    const formData = new FormData();
    if (payload.canDrive !== undefined && payload.canDrive !== "") {
      formData.append("canDrive", payload.canDrive);
    }
    if (payload.hasBusinessInsurance !== undefined && payload.hasBusinessInsurance !== "") {
      formData.append("hasBusinessInsurance", payload.hasBusinessInsurance);
    }
    if (payload.drivingPreferences && Array.isArray(payload.drivingPreferences)) {
      payload.drivingPreferences.forEach((pref: string) => {
        // Append with [] so backend parses it as an array even if it has only one element
        formData.append("drivingPreferences[]", pref);
      });
    }

    // Log the FormData entries before sending, as requested
    console.log("--- FormData Entries for Step 2 ---");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("-----------------------------------");

    return apiFetch("/carer/profile/step-2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

  async updateStep11(payload: any): Promise<CarerProfile> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/profile/step-11", {
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

  async getCarerApplications(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/carer/applications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getSubscriptionInfo(): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/subscription", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createCheckoutSession(tier: string, successUrl: string, cancelUrl: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/subscription/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier, successUrl, cancelUrl }),
    });
  },

  async createPortalSession(returnUrl: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/subscription/portal", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ returnUrl }),
    });
  },

  async cancelSubscription(): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/subscription/cancel", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getSubscriptionInvoices(): Promise<any[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/subscription/invoices", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async saveStep9Plan(tier: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch("/carer/profile/step-9", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier }),
    });
  },
};
