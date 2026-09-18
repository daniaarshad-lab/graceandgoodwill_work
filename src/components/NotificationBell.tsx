"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, Circle, X, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
} from "@/store/slices/notificationSlice";
import { NotificationItem, NotificationType, NotificationPriority } from "@/types/notification.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const TYPE_ICONS: Record<NotificationType, string> = {
  COMPLIANCE: "🛡️",
  DOCUMENT: "📄",
  MATCH: "🤝",
  PAYMENT: "💳",
  SYSTEM: "⚙️",
  MESSAGE: "💬",
  ALERT: "⚠️",
  INFO: "ℹ️",
};

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#6b7280",
};

// ─── Single notification row ──────────────────────────────────────────────────

interface NotificationRowProps {
  item: NotificationItem;
  onToggleRead: (id: string, isRead: boolean) => void;
}

function NotificationRow({ item, onToggleRead }: NotificationRowProps) {
  return (
    <div
      className={`notification-row ${!item.isRead ? "unread" : ""}`}
      onClick={() => !item.isRead && onToggleRead(item.id, item.isRead)}
    >
      {/* Priority dot */}
      <div
        className="priority-dot"
        style={{ backgroundColor: PRIORITY_COLORS[item.priority] ?? "#6b7280" }}
      />

      {/* Type icon */}
      <span className="type-icon" aria-hidden="true">
        {TYPE_ICONS[item.type] ?? "🔔"}
      </span>

      {/* Content */}
      <div className="notification-content">
        <p className="notification-title">{item.title}</p>
        <p className="notification-message">{item.message}</p>
        <span className="notification-time">{relativeTime(item.createdAt)}</span>
      </div>

      {/* Toggle read/unread button */}
      <button
        className="toggle-read-btn"
        title={item.isRead ? "Mark as unread" : "Mark as read"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleRead(item.id, item.isRead);
        }}
      >
        {item.isRead ? (
          <Circle className="w-3.5 h-3.5" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// ─── Main bell component ──────────────────────────────────────────────────────

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const { items, unreadCount, loading, loadingMore, hasMore, page } =
    useAppSelector((state) => state.notification);

  const [open, setOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // ── Close on outside click ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch on first open ──
  useEffect(() => {
    if (open && !hasFetched) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
      setHasFetched(true);
    }
  }, [open, hasFetched, dispatch]);

  const handleToggleRead = useCallback(
    (id: string, isRead: boolean) => {
      if (isRead) {
        dispatch(markNotificationUnread(id));
      } else {
        dispatch(markNotificationRead(id));
      }
    },
    [dispatch]
  );

  const handleMarkAll = useCallback(async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    await dispatch(markAllNotificationsRead());
    setMarkingAll(false);
  }, [dispatch, markingAll, unreadCount]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    dispatch(fetchNotifications({ page: page + 1, limit: 20 }));
  }, [dispatch, loadingMore, hasMore, page]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <>
      {/* ── Styles ──────────────────────────────────────────────────────── */}
      <style>{`
        .notif-bell-wrapper {
          position: relative;
        }

        .notif-bell-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 122, 0.15);
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          color: rgba(212, 175, 122, 0.7);
        }
        .notif-bell-btn:hover {
          background: rgba(212, 175, 122, 0.08);
          border-color: rgba(212, 175, 122, 0.35);
          color: rgb(212, 175, 122);
        }
        .notif-bell-btn.has-unread {
          animation: bell-wiggle 3s ease-in-out infinite;
        }
        @keyframes bell-wiggle {
          0%, 90%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-12deg); }
          96% { transform: rotate(12deg); }
          98% { transform: rotate(-6deg); }
        }

        .notif-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          line-height: 1;
          border: 2px solid #0b1120;
          animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badge-pop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* ── Panel ──────────────────────────────────────────────────────── */
        .notif-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          width: 380px;
          max-width: calc(100vw - 24px);
          background: #0d1627;
          border: 1px solid rgba(212, 175, 122, 0.12);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,122,0.05);
          overflow: hidden;
          z-index: 1000;
          animation: panel-slide-in 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes panel-slide-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .notif-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 12px;
          border-bottom: 1px solid rgba(212, 175, 122, 0.08);
        }
        .notif-panel-title {
          font-size: 14px;
          font-weight: 700;
          color: #D4AF7A;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .notif-panel-count {
          font-size: 11px;
          font-weight: 600;
          background: rgba(239,68,68,0.15);
          color: #ef4444;
          border-radius: 10px;
          padding: 1px 7px;
        }
        .notif-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .notif-action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(212,175,122,0.6);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .notif-action-btn:hover:not(:disabled) {
          color: #D4AF7A;
          background: rgba(212,175,122,0.08);
        }
        .notif-action-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ── List ───────────────────────────────────────────────────────── */
        .notif-list {
          max-height: 440px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        .notif-list::-webkit-scrollbar {
          width: 4px;
        }
        .notif-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .notif-list::-webkit-scrollbar-thumb {
          background: rgba(212,175,122,0.2);
          border-radius: 2px;
        }

        .notification-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(212,175,122,0.05);
          cursor: default;
          transition: background 0.15s;
          position: relative;
        }
        .notification-row:last-child {
          border-bottom: none;
        }
        .notification-row.unread {
          background: rgba(212,175,122,0.04);
          cursor: pointer;
        }
        .notification-row:hover {
          background: rgba(212,175,122,0.07);
        }

        .priority-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .type-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }
        .notification-title {
          font-size: 13px;
          font-weight: 600;
          color: #e8dcc8;
          margin: 0 0 3px;
          line-height: 1.35;
        }
        .notification-row.unread .notification-title {
          color: #f5e9d2;
        }
        .notification-message {
          font-size: 12px;
          color: rgba(212,175,122,0.6);
          margin: 0 0 5px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .notification-time {
          font-size: 10px;
          color: rgba(212,175,122,0.35);
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        .toggle-read-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: none;
          border: 1px solid rgba(212,175,122,0.15);
          color: rgba(212,175,122,0.4);
          cursor: pointer;
          transition: all 0.15s;
          opacity: 0;
          margin-top: 2px;
        }
        .notification-row:hover .toggle-read-btn {
          opacity: 1;
        }
        .toggle-read-btn:hover {
          background: rgba(212,175,122,0.12);
          color: #D4AF7A;
          border-color: rgba(212,175,122,0.4);
        }

        /* ── States ─────────────────────────────────────────────────────── */
        .notif-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 48px 24px;
          color: rgba(212,175,122,0.4);
          text-align: center;
        }
        .notif-empty-icon {
          font-size: 36px;
          opacity: 0.5;
        }
        .notif-empty-text {
          font-size: 13px;
          font-weight: 500;
        }

        .notif-skeleton {
          padding: 12px 16px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid rgba(212,175,122,0.05);
        }
        .skeleton-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(212,175,122,0.1);
          flex-shrink: 0;
          margin-top: 5px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
        .skeleton-icon {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: rgba(212,175,122,0.08);
          flex-shrink: 0;
          animation: skeleton-pulse 1.5s ease-in-out infinite 0.1s;
        }
        .skeleton-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .skeleton-line {
          height: 10px;
          border-radius: 5px;
          background: rgba(212,175,122,0.08);
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .load-more-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(212,175,122,0.6);
          background: none;
          border: none;
          border-top: 1px solid rgba(212,175,122,0.06);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
        }
        .load-more-btn:hover:not(:disabled) {
          color: #D4AF7A;
          background: rgba(212,175,122,0.05);
        }
        .load-more-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Bell button ──────────────────────────────────────────────────── */}
      <div className="notif-bell-wrapper">
        <button
          ref={bellRef}
          id="notification-bell-btn"
          className={`notif-bell-btn${unreadCount > 0 ? " has-unread" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          {unreadCount > 0 && (
            <span className="notif-badge" aria-hidden="true">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* ── Dropdown panel ───────────────────────────────────────────── */}
        {open && (
          <div
            ref={panelRef}
            className="notif-panel"
            role="dialog"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="notif-panel-header">
              <div className="notif-panel-title">
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="notif-panel-count">{unreadCount} new</span>
                )}
              </div>
              <div className="notif-header-actions">
                <button
                  className="notif-action-btn"
                  onClick={handleRefresh}
                  disabled={loading}
                  title="Refresh"
                >
                  <RefreshCw
                    style={{ width: 12, height: 12 }}
                    className={loading ? "spinning" : ""}
                  />
                </button>
                {unreadCount > 0 && (
                  <button
                    className="notif-action-btn"
                    onClick={handleMarkAll}
                    disabled={markingAll}
                  >
                    <CheckCheck style={{ width: 12, height: 12 }} />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="notif-list" id="notification-list">
              {loading && items.length === 0 ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="notif-skeleton">
                    <div className="skeleton-dot" />
                    <div className="skeleton-icon" />
                    <div className="skeleton-body">
                      <div className="skeleton-line" style={{ width: "60%" }} />
                      <div className="skeleton-line" style={{ width: "85%" }} />
                      <div className="skeleton-line" style={{ width: "30%" }} />
                    </div>
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="notif-empty">
                  <span className="notif-empty-icon">🔕</span>
                  <p className="notif-empty-text">You&apos;re all caught up!</p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      onToggleRead={handleToggleRead}
                    />
                  ))}
                  {hasMore && (
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <RefreshCw
                          style={{ width: 12, height: 12, marginRight: 6 }}
                          className="spinning"
                        />
                      ) : null}
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
