import { apiFetch } from "@/lib/api";
import { AdminDashboardStats } from "@/types/admin.types";
import {
  AdminActivity,
  InternalNote,
  CreateInternalNotePayload,
  UpdateInternalNotePayload,
  GetInternalNotesParams,
  InternalNoteHistory,
} from "@/app/(protected)/admin/types/admin.types";

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getInternalNotes(params: GetInternalNotesParams): Promise<{ items: InternalNote[]; total: number; page: number; limit: number; totalPages: number }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
    if (params.isPinned !== undefined) queryParams.append("isPinned", String(params.isPinned));
    if (params.carerProfileId) queryParams.append("carerProfileId", params.carerProfileId);
    if (params.clientProfileId) queryParams.append("clientProfileId", params.clientProfileId);
    if (params.placementId) queryParams.append("placementId", params.placementId);
    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));

    return apiFetch(`/admin/internal-notes?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getInternalNote(id: string): Promise<InternalNote> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async addInternalNote(payload: CreateInternalNotePayload): Promise<InternalNote> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },

  async updateInternalNote(id: string, payload: UpdateInternalNotePayload): Promise<InternalNote> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },

  async addInternalNoteAttachment(id: string, file: File): Promise<InternalNote> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch(`/admin/internal-notes/${id}/attachments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async getInternalNoteHistory(id: string): Promise<InternalNoteHistory[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}/history`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getCarers(
    page: number = 1,
    limit: number = 10,
    status: string = "ALL",
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();

    return apiFetch(`/admin/carers?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCarerDetails(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/carers/${id}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCareRequests(
    page: number = 1,
    limit: number = 10,
    status: string = "ALL",
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();

    return apiFetch(`/admin/care-requests?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateCarerStatus(carerId: string, status: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/carers/${carerId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },

  async updateDocumentStatus(
    docId: string,
    status: string,
    rejectionReason?: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const body: { status: string; rejectionReason?: string } = { status };
    if (status === "REJECTED") {
      body.rejectionReason = rejectionReason || "";
    }

    return apiFetch(`/admin/carers/document/${docId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  },

  async getClients(
    page: number = 1,
    limit: number = 10,
    status: string = "ALL",
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();

    return apiFetch(`/admin/clients?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getPlacements(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/placements", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async createPlacement(dto: {
    carerProfileId: string;
    clientProfileId: string;
    careRequestId?: string;
    hourlyRate: number;
    startDate: string;
  }): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/placement", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },

  async updatePlacementStatus(
    placementId: string,
    status: string,
    endDate?: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/placements/${placementId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, endDate }),
    });
  },

  async replaceCarerInPlacement(
    placementId: string,
    carerUserId: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    console.log("Replace Payload", {
      carerUserId,
      placementId,
    });

    try {
      const response = await apiFetch("/admin/placements/replace", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carerUserId, placementId }),
      });
      console.log("Replace API Success", response);
      return response;
    } catch (err: any) {
      console.error("Replace API Error", err);
      throw err;
    }
  },

  async updateIntroductionStatus(
    introId: string,
    status: string,
    adminNotes?: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/introductions/${introId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  async createDirectMatch(dto: {
    careRequestId: string;
    carerProfileId: string;
  }): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/matches/direct", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  },

  async getSuggestions(careRequestId: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/care-requests/${careRequestId}/suggestions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async assignCarerToCareRequest(
    careRequestId: string,
    carerUserId: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/matches/care-request", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ careRequestId, carerUserId }),
    });
  },

  async getEnquiries(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/enquiries", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getEnquiryDetails(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/enquiries/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async respondToEnquiry(id: string, message: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/enquiries/${id}/respond`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });
  },

  async updateEnquiryStatus(id: string, status: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/enquiries/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },

  async getClientDetails(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/clients/${id}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateClientWeeklyFee(id: string, weeklyFee: number): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/clients/${id}/weekly-fee`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weeklyFee }),
    });
  },

  async approveClient(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/clients/${id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** GET /admin/care-requests/:id/applications — list applications for a care request */
  async getCareRequestApplications(careRequestId: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/care-requests/${careRequestId}/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /** PATCH /admin/care-requests/:id/status — update care request status */
  async updateCareRequestStatus(careRequestId: string, status: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/care-requests/${careRequestId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },

  /** POST /admin/invoices/trigger-billing-run — trigger a billing run */
  async triggerBillingRun(): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch("/admin/invoices/trigger-billing-run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getBillingSettings(): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/settings", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateBillingSettings(settings: any): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/settings", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
  },

  async getPlacementBilling(id: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/billing`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updatePlacementWeeklyFee(id: string, weeklyFee: number): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/weekly-fee`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weeklyFee }),
    });
  },

  async pausePlacementBilling(id: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/pause-billing`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async resumePlacementBilling(id: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/resume-billing`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async resendInvoice(id: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/invoices/${id}/resend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async refundPayment(id: string): Promise<any> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/payments/${id}/refund`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminInvoices(status?: string): Promise<any[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    const query = status ? `?status=${status}` : "";
    return apiFetch(`/admin/invoices${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminTransactions(): Promise<any[]> {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/transactions", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
