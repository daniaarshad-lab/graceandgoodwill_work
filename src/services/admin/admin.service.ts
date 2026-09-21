import { apiFetch } from "@/lib/api";
import { AdminDashboardStats } from "@/types/admin.types";
import {
  InternalNote,
  CreateInternalNotePayload,
  UpdateInternalNotePayload,
  GetInternalNotesParams,
  InternalNoteHistory,
  AdminPlacementDetail,
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

  async getInternalNotes(params: GetInternalNotesParams): Promise<{
    items: InternalNote[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
    if (params.category) queryParams.append("category", params.category);
    if (params.isPinned !== undefined)
      queryParams.append("isPinned", String(params.isPinned));
    if (params.carerProfileId)
      queryParams.append("carerProfileId", params.carerProfileId);
    if (params.clientProfileId)
      queryParams.append("clientProfileId", params.clientProfileId);
    if (params.placementId)
      queryParams.append("placementId", params.placementId);
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async addInternalNote(
    payload: CreateInternalNotePayload,
  ): Promise<InternalNote> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },

  async updateInternalNote(
    id: string,
    payload: UpdateInternalNotePayload,
  ): Promise<InternalNote> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  },

  async addInternalNoteAttachment(
    id: string,
    file: File,
  ): Promise<InternalNote> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");
    return apiFetch(`/admin/internal-notes/${id}/history`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** GET /admin/profile-updates — get all pending profile update requests */
  async getProfileUpdateRequests(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/profile-updates", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** PATCH /admin/profile-updates/:id/status — approve or reject a profile update request */
  async updateProfileUpdateRequestStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    const body: { status: string; rejectionReason?: string } = { status };
    if (status === "REJECTED" && rejectionReason) {
      body.rejectionReason = rejectionReason;
    }

    return apiFetch(`/admin/profile-updates/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
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

  async getEmergencyCareRequests(
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
    });

    if (status && status !== "ALL") {
      query.append("status", status);
    }

    const response = await apiFetch(
      `/admin/emergency-care-requests?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Backend returns a flat array for emergency care requests
    return {
      items: Array.isArray(response) ? response : [],
      total: Array.isArray(response) ? response.length : 0,
      page,
      limit,
    };
  },

  async updateEmergencyCareRequestStatus(
    id: string,
    status: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/emergency-care-requests/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },

  async getCareRequestApplications(careRequestId: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/care-requests/${careRequestId}/applications`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async reviewInterestList(payload: {
    careRequestId: string;
    clientId: string;
    carerId: string;
    status: "SELECTED" | "REJECTED" | "ASSIGNED";
    adminNotes?: string;
  }): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/interest-list/review", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    internalNotes?: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    const body: { status: string; rejectionReason?: string; internalNotes?: string } = { status };
    if (status === "REJECTED") {
      body.rejectionReason = rejectionReason || "";
    }
    if (internalNotes !== undefined) {
      body.internalNotes = internalNotes;
    }

    return apiFetch(`/admin/carers/document/${docId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  },

  async updateDocumentNotes(docId: string, internalNotes: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/carers/document/${docId}/notes`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ internalNotes }),
    });
  },

  async deleteCarerDocument(docId: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/carers/document/${docId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    async uploadCarerDocument(
    carerId: string,
    formData: FormData,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/carers/${carerId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  async updateCarerPaymentStatus(
    paymentId: string,
    statusOrFormData: string | FormData,
    file?: File,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    let bodyData: FormData;
    if (statusOrFormData instanceof FormData) {
      bodyData = statusOrFormData;
    } else {
      bodyData = new FormData();
      bodyData.append("status", statusOrFormData);
      if (file) {
        bodyData.append("file", file);
      }
    }

    return apiFetch(`/admin/carer-payments/${paymentId}/pay`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bodyData,
    });
  },

  async getCarerPayments(placementId: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/placements/${placementId}/carer-payments`, {
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

  async togglePlacementContactRelease(
    placementId: string,
  ): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/placements/${placementId}/toggle-contact-release`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  // assignCarerToCareRequest removed — endpoint descoped

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

  async updateCarerWeeklyPay(id: string, carerWeeklyPay: number): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No token found");
    }

    return apiFetch(`/admin/clients/${id}/carer-weekly-pay`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ carerWeeklyPay }),
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

  async getClientInterestList(clientId: string, careRequestId?: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    try {
      const url = careRequestId
        ? `/admin/clients/${clientId}/interest-list?careRequestId=${careRequestId}`
        : `/admin/clients/${clientId}/interest-list`;
      const result = await apiFetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(result)
        ? result
        : result?.interestList || result?.data || [];
    } catch (err: any) {
      throw err;
    }
  },

  /** PATCH /admin/care-requests/:id/status — update care request status */
  async updateCareRequestStatus(
    careRequestId: string,
    status: string,
  ): Promise<any> {
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/settings", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateBillingSettings(settings: any): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/billing`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updatePlacementWeeklyFee(id: string, weeklyFee: number): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
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
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/pause-billing`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async resumePlacementBilling(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${id}/resume-billing`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async resendInvoice(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/invoices/${id}/resend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async refundPayment(id: string): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/payments/${id}/refund`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminInvoices(status?: string): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    const query = status ? `?status=${status}` : "";
    return apiFetch(`/admin/invoices${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminTransactions(): Promise<any[]> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch("/admin/transactions", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getPlacementDetail(placementId: string): Promise<AdminPlacementDetail> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(`/admin/placements/${placementId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    event?: string;
    action?: string;
    targetUserId?: string;
    targetEntityType?: string;
  }): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.event) query.append("event", params.event);
    if (params?.action) query.append("action", params.action);
    if (params?.targetUserId) query.append("targetUserId", params.targetUserId);
    if (params?.targetEntityType)
      query.append("targetEntityType", params.targetEntityType);

    return apiFetch(`/admin/audit-logs?${query.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAuditLogsForUser(
    userId: string,
    page: number = 1,
    limit: number = 25,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(
      `/admin/audit-logs/user/${userId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  async getAuditLogsForEntity(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 25,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    return apiFetch(
      `/admin/audit-logs/entity/${entityType}/${entityId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  async searchUsers(params: {
    internalAccountNumber?: string;
    publicProfileId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    query?: string;
  }): Promise<any> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) throw new Error("No token found");

    const queryParams = new URLSearchParams();
    if (params.internalAccountNumber)
      queryParams.append("internalAccountNumber", params.internalAccountNumber);
    if (params.publicProfileId)
      queryParams.append("publicProfileId", params.publicProfileId);
    if (params.fullName) queryParams.append("fullName", params.fullName);
    if (params.email) queryParams.append("email", params.email);
    if (params.phoneNumber)
      queryParams.append("phoneNumber", params.phoneNumber);
    if (params.query) queryParams.append("query", params.query);

    // TODO: Confirm backend URL mapping. This uses '/admin/search' as described in requirements.
    return apiFetch(`/admin/search?${queryParams.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
