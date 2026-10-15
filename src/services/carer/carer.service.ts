import { apiFetch, getRequiredAuthToken } from "@/lib/api";
import {
  CarerProfile,
  UpdateCarerProfilePayload,
  UpdateAvailabilityPayload,
} from "@/types/carer.types";

export const carerService = {
  async getProfile(): Promise<CarerProfile> {
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

    return apiFetch("/carer/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async uploadDocument(
    file: File,
    category: string,
    type: string,
    options?: {
      replaceExisting?: boolean;
      documentId?: string;
      expiryDate?: string;
      dbsCertificateNumber?: string;
    },
  ) {
    const token = getRequiredAuthToken();

    const formData = new FormData();

    formData.append("file", file);
    if (category) formData.append("category", category);
    if (type) formData.append("type", type);

    if (options?.replaceExisting !== undefined) {
      formData.append("replaceExisting", options.replaceExisting ? "true" : "false");
    }
    if (options?.documentId) {
      formData.append("documentId", options.documentId);
    }
    if (options?.expiryDate) {
      formData.append("expiryDate", options.expiryDate);
    }
    if (options?.dbsCertificateNumber) {
      formData.append("dbsCertificateNumber", options.dbsCertificateNumber);
    }

    return apiFetch("/carer/profile/document", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async uploadDocumentsMulti(
    files: File[],
    category?: string,
    type?: string,
  ) {
    const token = getRequiredAuthToken();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (category) formData.append("category", category);
    if (type) formData.append("type", type);

    return apiFetch("/carer/profile/documents/multi", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },
  async uploadDocuments(files: Record<string, File>) {
    const token = getRequiredAuthToken();

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      let mappedKey = key;
      if (mappedKey === "national_insurance_proof") mappedKey = "ni_proof";
      if (mappedKey === "driving_licence") mappedKey = "drivers_license";

      // Insurance documents mappings
      if (mappedKey === "public_liability_insurance")
        mappedKey = "public_liability";
      if (mappedKey === "professional_indemnity_insurance")
        mappedKey = "professional_indemnity";

      // Training documents mappings
      if (mappedKey === "basic_life_support_first_aid")
        mappedKey = "basic_life_support";
      if (mappedKey === "infection_prevention_and_control")
        mappedKey = "infection_prevention";
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

  async uploadStepDocuments(
    step: number,
    files: Record<string, File>,
    textFields?: Record<string, string>,
  ) {
    const token = getRequiredAuthToken();
    const formData = new FormData();

    // Strictly map and filter fields for the specific step endpoint
    Object.entries(files).forEach(([key, file]) => {
      const lowerKey = key.toLowerCase();

      if (step === 2) {
        // Step 2: Identity, Right to Work & Vehicle Insurance
        if (lowerKey === "passport") {
          formData.append("passport", file);
        } else if (lowerKey === "driving_licence_front") {
          formData.append("driving_licence_front", file);
        } else if (lowerKey === "driving_licence_back") {
          formData.append("driving_licence_back", file);
        } else if (
          lowerKey === "driving_licence" ||
          lowerKey === "drivers_license"
        ) {
          formData.append("drivers_license", file);
        } else if (lowerKey === "proof_of_address") {
          formData.append("proof_of_address", file);
        } else if (lowerKey === "proof_of_address_supporting") {
          formData.append("proof_of_address", file);
        } else if (lowerKey === "right_to_work") {
          formData.append("right_to_work", file);
        } else if (lowerKey === "right_to_work_supporting") {
          formData.append("right_to_work", file);
        } else if (
          lowerKey === "national_insurance_proof" ||
          lowerKey === "ni_proof"
        ) {
          formData.append("ni_proof", file);
        } else if (
          lowerKey === "business_insurance" ||
          lowerKey === "business_insurance_certificate"
        ) {
          formData.append("business_insurance", file);
        }
      } else if (step === 5) {
        // Step 5: Mandatory Care Training
        const trainingMap: Record<string, string> = {
          safeguarding_adults: "safeguarding_adults",
          moving_and_handling: "moving_and_handling",
          medication_administration: "medication_administration",
          basic_life_support_first_aid: "basic_life_support",
          basic_life_support: "basic_life_support",
          infection_prevention_and_control: "infection_prevention",
          infection_prevention: "infection_prevention",
          health_and_safety: "health_and_safety",
          fire_safety: "fire_safety",
          food_hygiene: "food_hygiene",
          gdpr_data_protection: "gdpr",
          gdpr: "gdpr",
        };
        const mapped = trainingMap[lowerKey];
        if (mapped) {
          formData.append(mapped, file);
        }
      } else if (step === 6) {
        // Step 6: Compliance & DBS & References & CV
        if (
          lowerKey === "enhanced_dbs_certificate" ||
          lowerKey === "enhanced_dbs"
        ) {
          formData.append("enhanced_dbs", file);
        } else if (lowerKey === "enhanced_dbs_supporting") {
          formData.append("enhanced_dbs", file);
        } else if (lowerKey === "cv_resume" || lowerKey === "cv") {
          formData.append("cv", file);
        } else if (lowerKey === "cv_supporting") {
          formData.append("cv", file);
        } else if (
          lowerKey === "professional_reference_1" ||
          lowerKey === "reference_1"
        ) {
          formData.append("reference_1", file);
        } else if (
          lowerKey === "professional_reference_2" ||
          lowerKey === "reference_2"
        ) {
          formData.append("reference_2", file);
        } else if (
          lowerKey === "professional_reference_supporting" ||
          lowerKey === "reference_supporting"
        ) {
          formData.append("reference_1", file);
        } else if (lowerKey.startsWith("additional_reference")) {
          formData.append("additional_reference", file);
        }
      } else if (step === 7) {
        // Step 7: Insurance Documents
        if (
          lowerKey === "public_liability_insurance" ||
          lowerKey === "public_liability"
        ) {
          formData.append("public_liability", file);
        } else if (lowerKey === "public_liability_supporting") {
          formData.append("public_liability", file);
        } else if (
          lowerKey === "professional_indemnity_insurance" ||
          lowerKey === "professional_indemnity"
        ) {
          formData.append("professional_indemnity", file);
        } else if (lowerKey === "professional_indemnity_supporting") {
          formData.append("professional_indemnity", file);
        }
      } else if (step === 8) {
        // Step 8: Additional Qualifications
        const qualKeys = [
          "nvq_2",
          "nvq_3",
          "nvq_4",
          "nursing_qualification",
          "university_qualification",
          "dementia_training",
          "end_of_life_care",
          "other_relevant",
        ];
        if (qualKeys.includes(lowerKey)) {
          formData.append(lowerKey, file);
        }
      }
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
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

    return apiFetch("/carer/profile/availability", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  async deleteDocument(id: string): Promise<void> {
    const token = getRequiredAuthToken();

    return apiFetch(`/carer/profile/document/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  async updateDocument(id: string, file: File, category: string) {
    const token = getRequiredAuthToken();

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
    video?: File,
    hasConsented?: boolean,
  ): Promise<CarerProfile> {
    const formData = new FormData();

    if (photo) {
      formData.append("photo", photo);
    }

    if (video) {
      formData.append("video", video);
    }

    if (hasConsented !== undefined) {
      formData.append("hasConsented", String(hasConsented));
    }

    const token = getRequiredAuthToken();

    return apiFetch("/carer/profile/media", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  /** POST /carer/profile-updates — submit a profile picture / intro video update request */
  async submitProfileUpdateRequest(
    photo?: File,
    video?: File,
    updateReason?: string,
  ): Promise<any> {
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

    return apiFetch("/carer/profile-updates", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateStep2(payload: any): Promise<CarerProfile> {
    const token = getRequiredAuthToken();

    const formData = new FormData();
    if (payload.canDrive !== undefined && payload.canDrive !== "") {
      formData.append("canDrive", payload.canDrive);
    }
    if (
      payload.hasBusinessInsurance !== undefined &&
      payload.hasBusinessInsurance !== ""
    ) {
      formData.append("hasBusinessInsurance", payload.hasBusinessInsurance);
    }
    if (
      payload.drivingPreferences &&
      Array.isArray(payload.drivingPreferences)
    ) {
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
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

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
    const token = getRequiredAuthToken();

    return apiFetch("/carer/profile/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** GET /carer/care-requests — list all available placement opportunities */
  async getCareRequests(): Promise<any[]> {
    const token = getRequiredAuthToken();

    return apiFetch("/carer/care-requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** GET /carer/care-request/:id — get full placement details */
  async getCareRequestById(id: string): Promise<any> {
    const token = getRequiredAuthToken();

    return apiFetch(`/carer/care-request/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** POST /carer/care-requests/:id/apply — apply to a care request */
  async applyToCareRequest(id: string): Promise<any> {
    const token = getRequiredAuthToken();

    return apiFetch(`/carer/care-requests/${id}/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCarerApplications(): Promise<any[]> {
    const token = getRequiredAuthToken();

    return apiFetch("/carer/applications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCarerApplicationHistory(): Promise<any[]> {
    const token = getRequiredAuthToken();

    return apiFetch("/carer/applications/history", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getSubscriptionInfo(): Promise<any> {
    const token = getRequiredAuthToken();
    return apiFetch("/carer/subscription", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createCheckoutSession(
    tier: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<any> {
    const token = getRequiredAuthToken();
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
    const token = getRequiredAuthToken();
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
    const token = getRequiredAuthToken();
    return apiFetch("/carer/subscription/cancel", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getSubscriptionInvoices(): Promise<any[]> {
    const token = getRequiredAuthToken();
    return apiFetch("/carer/subscription/invoices", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async saveStep9Plan(tier: string): Promise<any> {
    const token = getRequiredAuthToken();
    return apiFetch("/carer/profile/step-9", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tier }),
    });
  },

  async getPlacements(): Promise<any[]> {
    const token = getRequiredAuthToken();
    return apiFetch("/carer/placements", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getPlacementDetail(placementId: string): Promise<any> {
    const token = getRequiredAuthToken();
    return apiFetch(`/carer/placements/${placementId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getPlacementPayments(placementId: string): Promise<any[]> {
    const token = getRequiredAuthToken();
    return apiFetch(`/carer/placements/${placementId}/payments`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async acceptPlacement(placementId: string): Promise<any> {
    const token = getRequiredAuthToken();
    return apiFetch(`/carer/placements/${placementId}/accept`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async rejectPlacement(placementId: string, reason?: string): Promise<any> {
    const token = getRequiredAuthToken();
    return apiFetch(`/carer/placements/${placementId}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
  },
};
