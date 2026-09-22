import { apiFetch } from "@/lib/api";
import {
  NotificationItem,
  PaginatedNotifications,
} from "@/types/notification.types";

function getToken(): string {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("token")
      : null;
  if (!token) throw new Error("No auth token found");
  return token;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export const notificationService = {
  /** GET /notifications — paginated list */
  async getNotifications(
    params: GetNotificationsParams = {}
  ): Promise<PaginatedNotifications> {
    const token = getToken();
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.isRead !== undefined) query.set("isRead", String(params.isRead));
    if (params.type) query.set("type", params.type);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const raw = await apiFetch(`/notifications${qs}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Backend returns: { items, total, page, limit, totalPages }
    // Normalise to our PaginatedNotifications shape
    const items: NotificationItem[] = raw.items ?? raw.data ?? [];
    const total: number = raw.total ?? raw.totalCount ?? items.length;
    const page: number = raw.page ?? 1;
    const limit: number = raw.limit ?? items.length;
    const totalPages: number = raw.totalPages ?? Math.ceil(total / (limit || 1));

    return {
      items,
      totalCount: total,
      page,
      limit,
      hasMore: page < totalPages,
    };
  },

  /** GET /notifications/unread-count */
  async getUnreadCount(): Promise<{ count: number }> {
    const token = getToken();
    return apiFetch("/notifications/unread-count", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** PATCH /notifications/:id/read */
  async markAsRead(id: string): Promise<void> {
    const token = getToken();
    return apiFetch(`/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** PATCH /notifications/:id/unread */
  async markAsUnread(id: string): Promise<void> {
    const token = getToken();
    return apiFetch(`/notifications/${id}/unread`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** PATCH /notifications/read-all */
  async markAllRead(): Promise<void> {
    const token = getToken();
    return apiFetch("/notifications/read-all", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** DELETE /notifications/:id */
  async deleteNotification(id: string): Promise<void> {
    const token = getToken();
    return apiFetch(`/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** DELETE /notifications */
  async deleteAllNotifications(): Promise<void> {
    const token = getToken();
    return apiFetch("/notifications", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
