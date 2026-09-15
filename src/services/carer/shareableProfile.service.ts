import { apiFetch } from "@/lib/api";

export interface ShareTokenStatus {
  hasActiveToken: boolean;
  shareUrl?: string;
  generatedAt?: string;
  expiresAt?: string;
  expiresInSeconds?: number;
}

export interface PublicCarerProfile {
  displayName: string;
  photoUrl?: string;
  introVideoUrl?: string;
  summary?: string;
  experienceYears?: number;
  careSpecialties?: string[];
  languages?: string[];
  availability?: AvailabilityDay[];
  isComplianceChecked: boolean;
  brandName: string;
}

export interface AvailabilityDay {
  dayName: string;
  enabled: boolean;
  slots: { shiftType: string }[];
}

const shareableProfileService = {
  async generateShareToken(consentGiven: boolean): Promise<ShareTokenStatus> {
    return apiFetch("/carer/profile/share-token", {
      method: "POST",
      body: JSON.stringify({ consentGiven }),
    });
  },

  async getShareTokenStatus(): Promise<ShareTokenStatus> {
    return apiFetch("/carer/profile/share-token", { method: "GET" });
  },

  async getPublicProfile(token: string): Promise<PublicCarerProfile> {
    const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
    const response = await fetch(`${API_URL}/api/public/carer/${token}`);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || `Error ${response.status}`);
    }
    return response.json();
  },
};

export default shareableProfileService;
