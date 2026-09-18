// ─── Notification item (matches backend schema) ─────────────────────────────

export type NotificationType =
  | "COMPLIANCE"
  | "DOCUMENT"
  | "MATCH"
  | "PAYMENT"
  | "SYSTEM"
  | "MESSAGE"
  | "ALERT"
  | "INFO";

export type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
}

// ─── Paginated response ──────────────────────────────────────────────────────

export interface PaginatedNotifications {
  items: NotificationItem[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Redux state ─────────────────────────────────────────────────────────────

export interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

// ─── SSE event payloads ──────────────────────────────────────────────────────

export interface SSEConnectedEvent {
  type: "CONNECTED";
  unreadCount: number;
}

export interface SSENotificationCreatedEvent {
  type: "NOTIFICATION_CREATED";
  unreadCount: number;
  notification: NotificationItem;
}

export interface SSENotificationReadEvent {
  type: "NOTIFICATION_READ";
  notificationId: string;
  unreadCount: number;
}

export interface SSENotificationUnreadEvent {
  type: "NOTIFICATION_UNREAD";
  notificationId: string;
  unreadCount: number;
}

export interface SSEPingEvent {
  type: "PING";
}

export type SSEEvent =
  | SSEConnectedEvent
  | SSENotificationCreatedEvent
  | SSENotificationReadEvent
  | SSENotificationUnreadEvent
  | SSEPingEvent;
