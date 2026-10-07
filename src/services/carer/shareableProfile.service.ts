import { apiFetch } from "@/lib/api";

export interface ShareTokenStatus {
  hasActiveToken: boolean;
  shareUrl?: string;
  generatedAt?: string;
  expiresAt?: string;
  expirationDate?: string;
  expiresInSeconds?: number;
  isActive?: boolean;
  id?: string;
  token?: string;
}

export interface AvailabilityRange {
  startDate: string;
  endDate: string;
  formatted?: string;
  totalDays?: number;
}

export interface PublicCarerReview {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
  clientFirstName: string;
}

export interface PublicCarerProfile {
  displayName: string;
  photoUrl?: string;
  introVideoUrl?: string;
  summary?: string;
  experienceYears?: number;
  careSpecialties?: string[];
  languages?: string[];
  availability?: AvailabilityRange[] | any[];
  availabilityRanges?: AvailabilityRange[];
  isComplianceChecked: boolean;
  brandName: string;
  isActive?: boolean;
  expiresAt?: string;
  reviews?: PublicCarerReview[];
  averageRating?: number | null;
  totalReviews?: number;
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
    return apiFetch("/carer/profile/share-token", { 
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
  },

  async getPublicProfile(token: string): Promise<PublicCarerProfile> {
    const API_URL = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://graceandgoodwill.co.uk"
    ).replace(/\/api\/?$/, "");
    const response = await fetch(`${API_URL}/api/public/carer/${token}`);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || `Error ${response.status}`);
    }
    return response.json();
  },
};

export default shareableProfileService;
