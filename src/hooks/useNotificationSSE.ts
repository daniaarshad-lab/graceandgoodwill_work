"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { notificationSSEService } from "@/services/notification/notification.sse";
import {
  sseConnected,
  sseNotificationCreated,
  sseNotificationRead,
  sseNotificationUnread,
  fetchUnreadCount,
} from "@/store/slices/notificationSlice";
import { SSEEvent } from "@/types/notification.types";

/**
 * Connects to the SSE stream when the user is authenticated.
 * Call once inside a component that is always mounted while logged in
 * (e.g. AuthenticatedHeader).
 */
export function useNotificationSSE(isAuthenticated: boolean) {
  const dispatch = useAppDispatch();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      notificationSSEService.disconnect();
      connectedRef.current = false;
      return;
    }

    if (connectedRef.current) return; // already connected

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;

    if (!token) return;

    connectedRef.current = true;

    notificationSSEService.connect(token, {
      onConnected: () => {
        // Fetch authoritative unread count on (re)connect
        dispatch(fetchUnreadCount());
      },
      onDisconnected: () => {
        connectedRef.current = false;
      },
      onEvent: (event: SSEEvent) => {
        switch (event.type) {
          case "CONNECTED":
            dispatch(sseConnected({ unreadCount: event.unreadCount }));
            break;

          case "NOTIFICATION_CREATED":
            dispatch(
              sseNotificationCreated({
                notification: event.notification,
                unreadCount: event.unreadCount,
              })
            );
            // Browser notification (if permission granted)
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification(event.notification.title, {
                body: event.notification.message,
                icon: "/website_logo.png",
              });
            }
            break;

          case "NOTIFICATION_READ":
            dispatch(
              sseNotificationRead({
                notificationId: event.notificationId,
                unreadCount: event.unreadCount,
              })
            );
            break;

          case "NOTIFICATION_UNREAD":
            dispatch(
              sseNotificationUnread({
                notificationId: event.notificationId,
                unreadCount: event.unreadCount,
              })
            );
            break;

          case "PING":
            // Keep-alive — no action needed
            break;
        }
      },
    });

    return () => {
      // Only disconnect on full unmount (page unload), not re-renders
      // The singleton stays alive between re-renders
    };
  }, [isAuthenticated, dispatch]);
}
