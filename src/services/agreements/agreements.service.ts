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
  acceptedAt: string;
  signatureName: string;
  ipAddress: string;
  userAgent: string;
  agreement: LegalAgreement;
}

export const agreementsService = {
  getHeaders() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
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

  async signAgreement(
    agreementId: string,
    signatureName: string,
  ): Promise<any> {
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

  async downloadSignedPdf(signedAgreementId: string, title = "Signed_Contract") {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/agreements/download/${signedAgreementId}`,
      {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      },
    );
    if (!response.ok) throw new Error("Failed to download PDF document");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async getPlacementAgreement(placementId: string): Promise<any> {
    return apiFetch(`/agreements/placement/${placementId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  },

  async signPlacementAgreement(
    placementId: string,
    signatureName: string,
  ): Promise<any> {
    return apiFetch(`/agreements/placement/${placementId}/sign`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ signatureName }),
    });
  },

  async downloadPlacementPdf(placementId: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/agreements/placement/${placementId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      },
    );
    if (!response.ok) throw new Error("Failed to download Placement PDF");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Placement_Agreement_${placementId.substring(0, 8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
