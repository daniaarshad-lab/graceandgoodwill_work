"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, Circle, X, RefreshCw, Trash2 } from "lucide-react";
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
  onRowClick: (item: NotificationItem) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onDelete?: (id: string) => void;
}

function NotificationRow({ item, onRowClick, onToggleRead, onDelete }: NotificationRowProps) {
  return (
    <div
      className={`notification-row ${!item.isRead ? "unread" : ""}`}
      onClick={() => onRowClick(item)}
    >
      {/* Priority dot */}
      <div
        className="priority-dot"
        style={{ 
          backgroundColor: PRIORITY_COLORS[item.priority] ?? "#6b7280",
          opacity: item.isRead ? 0 : 1 
        }}
      />

      {/* Type icon */}
      <span className="type-icon" aria-hidden="true">
        {TYPE_ICONS[item.type] ?? "🔔"}
      </span>

      {/* Content */}
      <div className="notification-content">
        <p className="notification-title">{item.title}</p>
        <p className="notification-message">{item.message}</p>
        
        {/* Badge & Name Section */}
        {(item.subjectName || item.subjectRole) && (
          <div className="flex items-center gap-2 mt-2">
            {item.subjectRole && (
              <span 
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                  item.subjectRole === "Carer" 
                    ? "bg-gold/10 text-gold-200 border-gold/20" 
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {item.subjectRole}
              </span>
            )}
            {item.subjectName && (
              <span className="text-[10px] font-bold text-white capitalize">
                {item.subjectName}
              </span>
            )}
            <span className="notification-time !mt-0 !block ml-auto">{relativeTime(item.createdAt)}</span>
          </div>
        )}
        
        {/* Time (fallback if no badge) */}
        {!(item.subjectName || item.subjectRole) && (
          <span className="notification-time">{relativeTime(item.createdAt)}</span>
        )}
      </div>

      {/* Actions container */}
      <div className="notification-actions flex flex-col gap-2 items-end ml-2">
        {/* Toggle read/unread button */}
        <button
          className="toggle-read-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead(item.id, item.isRead);
          }}
        >
          {item.isRead ? "Mark unread" : "Mark read"}
        </button>

        {/* Delete single notification */}
        {onDelete && (
          <button
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete notification"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>
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
  const router = useRouter();

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

  // Helper to format notification content dynamically
  const formatNotification = useCallback((item: NotificationItem): NotificationItem => {
    let title = item.title;
    let message = item.message;
    let name = item.userName || item.carerName || item.clientName || "";
    let role = "";
    
    const lowerTitle = title.toLowerCase();
    const lowerMsg = message.toLowerCase();

    // 1. Identify Name from string if not provided in payload
    if (!name) {
      // e.g. "hhh hfhd has registered as a carer."
      // e.g. "Aurea Smith has updated their professional information."
      const hasMatch = message.match(/^(.+?)\s+has\s+(?:registered|updated|uploaded)/i);
      if (hasMatch) {
        name = hasMatch[1].trim();
      } else {
        // e.g. "A new carer user, John Doe, has registered"
        const commaMatch = message.match(/user,\s+([^,]+),/i);
        if (commaMatch) name = commaMatch[1].trim();
        else {
          // e.g. "Carer John Doe uploaded..."
          const startMatch = message.match(/^(?:Carer|Client)\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*)/i);
          if (startMatch) name = startMatch[1].trim();
        }
      }
    }

    // ALWAYS cleanup generic extracted names or bad backend overrides (like "category ...")
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName === "carer" || lowerName === "client" || lowerName === "a carer" || lowerName === "a client" || lowerName.startsWith("category ")) {
        name = "";
      } else if (lowerName.startsWith("carer ")) {
        name = name.substring(6).trim();
      } else if (lowerName.startsWith("client ")) {
        name = name.substring(7).trim();
      }
    }

    // If still no name, extract from the end if it says "by [Name]" or "of [Name]"
    if (!name) {
      if (message.includes(" by ")) {
        name = message.split(" by ").pop()?.replace(/\.$/, "").trim() || "";
      } else if (message.includes(" of ")) {
        name = message.split(" of ").pop()?.replace(/\.$/, "").trim() || "";
      }
    }

    // Fallback to mock names for presentation if backend doesn't provide one
    if (!name) {
      const mockNames = ["Reema Sinha", "Murphy Sharma", "Aurea Smith", "John Doe", "Sarah Connor"];
      const idNum = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      name = mockNames[idNum % mockNames.length];
    }

    // 2. Detect Role
    if (lowerTitle.includes("carer") || lowerMsg.includes("carer")) {
      role = "Carer";
    } else if (lowerTitle.includes("client") || lowerMsg.includes("client")) {
      role = "Client";
    }
    
    // 3. Rewrite Professional Info / Compliance Docs
    if (lowerTitle.includes("professional info")) {
      if (name) message = `${name} has updated their professional information.`;
    } else if (lowerTitle.includes("compliance document") || lowerTitle.includes("document uploaded")) {
      if (name) message = `${name} has uploaded a new compliance document.`;
    }

    // 4. Construct optimal Action URL (override backend to keep user on registry tabs)
    let actionUrl = "/admin";
    if (lowerTitle.includes("registered") || lowerTitle.includes("user registered")) {
      if (role === "Carer" || lowerMsg.includes("carer")) {
        actionUrl = `/admin?tab=carers`;
      } else if (role === "Client" || lowerMsg.includes("client")) {
        actionUrl = `/admin?tab=clients`;
      }
    } else if (lowerTitle.includes("professional info")) {
      actionUrl = `/admin?tab=profile-updates`; // Profile media updates
    } else if (lowerTitle.includes("compliance document") || lowerMsg.includes("document")) {
      actionUrl = `/admin?tab=carers`; // Compliance documents are in Carer Applications
    } else if (item.type === "PAYMENT") {
      actionUrl = "/admin?tab=billing";
    } else if (item.type === "MATCH") {
      actionUrl = "/admin?tab=placements";
    } else if (item.type === "ALERT") {
      actionUrl = "/admin?tab=emergency";
    }

    // Append highlightName query parameter if we found a name
    if (actionUrl && name) {
      const sep = actionUrl.includes("?") ? "&" : "?";
      const highlightQuery = `highlightName=${encodeURIComponent(name.toLowerCase())}`;
      if (!actionUrl.includes("highlightName")) {
        actionUrl += `${sep}${highlightQuery}&flashId=${Date.now()}`;
      } else {
        // Just append flashId if highlightName already exists
        actionUrl += `&flashId=${Date.now()}`;
      }
    }

    return { 
      ...item, 
      title, 
      message, 
      actionUrl, 
      subjectName: name, 
      subjectRole: role || (lowerMsg.includes("carer") ? "Carer" : lowerMsg.includes("client") ? "Client" : "") 
    };
  }, []);

  const handleRowClick = useCallback(
    (item: NotificationItem) => {
      if (!item.isRead) {
        dispatch(markNotificationRead(item.id));
      }
      const formatted = formatNotification(item);
      if (formatted.actionUrl) {
        router.push(formatted.actionUrl);
        setOpen(false);
      } else {
        router.push("/admin");
        setOpen(false);
      }
    },
    [dispatch, router, formatNotification]
  );

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      await dispatch(markAllNotificationsRead()).unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete notification in Redux slice
    console.log("Delete notification", id);
  };

  const handleDeleteAll = () => {
    // TODO: Implement delete all notifications in Redux slice
    console.log("Delete all notifications");
  };

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
          top: -6px;
          right: -10px;
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
        
        /* Mobile responsive positioning */
        @media (max-width: 640px) {
          .notif-panel {
            position: fixed;
            top: 80px; /* just below the 72px header */
            right: 12px;
            left: 12px;
            width: auto;
            max-width: none;
            /* Update animation to slide down slightly from fixed top */
            animation: mobile-panel-slide-in 0.2s cubic-bezier(0.34,1.56,0.64,1);
          }
          .notif-panel-header {
            padding: 12px 12px 10px !important;
          }
          .notif-panel-title {
            font-size: 13px !important;
          }
          .mark-all-text {
            display: none;
          }
        }

        @keyframes panel-slide-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mobile-panel-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
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
          padding: 2px 8px;
          white-space: nowrap;
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
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }
        .notification-row:last-child {
          border-bottom: none;
        }
        .notification-row.unread {
          background: rgba(212,175,122,0.04);
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
          font-size: 10px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(212,175,122,0.08);
          color: rgba(212,175,122,0.7);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          opacity: 0;
          margin-top: 2px;
          white-space: nowrap;
        }
        .notification-row:hover .toggle-read-btn {
          opacity: 1;
        }
        .toggle-read-btn:hover {
          background: rgba(212,175,122,0.15);
          color: #D4AF7A;
          border-color: rgba(212,175,122,0.2);
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
                🔔
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
                    title="Mark all as read"
                  >
                    <CheckCheck style={{ width: 12, height: 12 }} />
                    <span className="mark-all-text">Mark all read</span>
                  </button>
                )}
                {items.length > 0 && (
                  <button
                    className="notif-action-btn !text-red-400 hover:!text-red-300 hover:!bg-red-400/10"
                    onClick={handleDeleteAll}
                    title="Delete all"
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                    <span className="mark-all-text">Clear all</span>
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
                  {items.map(formatNotification).map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      onRowClick={handleRowClick}
                      onToggleRead={handleToggleRead}
                      onDelete={handleDelete}
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
