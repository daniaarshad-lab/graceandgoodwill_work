import { apiFetch } from "@/lib/api";

export interface LegalAgreement {
  id: string;
  title: string;
  content: string;
  version: string;
  targetRole: string;
  isActive: boolean;
  createdAt: string;
}

export interface SignedAgreement {
  id: string;
  agreementId: string;
  versionAccepted: string;
  signedAt: string;
  signatureName: string;
  ipAddress: string;
  userAgent: string;
  agreement: LegalAgreement;
}

export const agreementsService = {
  getHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    };
  },

  async getPendingAgreements(): Promise<LegalAgreement[]> {
    return apiFetch("/agreements/pending", {
      method: "GET",
      headers: this.getHeaders(),
    });
  },

  async signAgreement(agreementId: string, signatureName: string): Promise<any> {
    return apiFetch("/agreements/sign", {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ agreementId, signatureName }),
    });
  },

  async getSignedHistory(): Promise<SignedAgreement[]> {
    return apiFetch("/agreements/history", {
      method: "GET",
      headers: this.getHeaders(),
    });
  },

  async getSignaturesAudit(): Promise<any[]> {
    return apiFetch("/agreements/audit", {
      method: "GET",
      headers: this.getHeaders(),
    });
  },
};
