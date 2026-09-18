import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { notificationService } from "@/services/notification/notification.service";
import {
  NotificationItem,
  NotificationState,
  PaginatedNotifications,
} from "@/types/notification.types";

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  totalCount: 0,
  page: 1,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: null,
};

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk<
  PaginatedNotifications,
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>(
  "notification/fetchNotifications",
  async (params = { page: 1, limit: 20 }, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(params);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch notifications");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("notification/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const res = await notificationService.getUnreadCount();
    return res.count;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch unread count");
  }
});

export const markNotificationRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/markRead", async (id, { rejectWithValue }) => {
  try {
    await notificationService.markAsRead(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to mark notification as read");
  }
});

export const markNotificationUnread = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/markUnread", async (id, { rejectWithValue }) => {
  try {
    await notificationService.markAsUnread(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to mark notification as unread");
  }
});

export const markAllNotificationsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notification/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await notificationService.markAllRead();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to mark all as read");
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // ── SSE sync actions ────────────────────────────────────────────────────
    sseConnected(state, action: PayloadAction<{ unreadCount: number }>) {
      state.unreadCount = action.payload.unreadCount;
    },
    sseNotificationCreated(
      state,
      action: PayloadAction<{ notification: NotificationItem; unreadCount: number }>
    ) {
      // Prepend to list only if already loaded (avoid phantom items before first fetch)
      const exists = state.items.some((i) => i.id === action.payload.notification.id);
      if (!exists && state.items.length > 0) {
        state.items.unshift(action.payload.notification);
        state.totalCount += 1;
      }
      state.unreadCount = action.payload.unreadCount;
    },
    sseNotificationRead(
      state,
      action: PayloadAction<{ notificationId: string; unreadCount: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.notificationId);
      if (item) item.isRead = true;
      state.unreadCount = action.payload.unreadCount;
    },
    sseNotificationUnread(
      state,
      action: PayloadAction<{ notificationId: string; unreadCount: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.notificationId);
      if (item) item.isRead = false;
      state.unreadCount = action.payload.unreadCount;
    },

    // ── General ─────────────────────────────────────────────────────────────
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.totalCount = 0;
      state.page = 1;
      state.hasMore = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder.addCase(fetchNotifications.pending, (state, action) => {
      const page = action.meta.arg?.page ?? 1;
      if (page === 1) {
        state.loading = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    });
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<PaginatedNotifications>) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.payload.page === 1) {
          state.items = action.payload.items;
        } else {
          // Append, deduplicating
          const existingIds = new Set(state.items.map((i) => i.id));
          const newItems = action.payload.items.filter((i) => !existingIds.has(i.id));
          state.items = [...state.items, ...newItems];
        }
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      }
    );
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload || "Failed to fetch notifications";
    });

    // fetchUnreadCount
    builder.addCase(
      fetchUnreadCount.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.unreadCount = action.payload;
      }
    );

    // markNotificationRead
    builder.addCase(
      markNotificationRead.fulfilled,
      (state, action: PayloadAction<string>) => {
        const item = state.items.find((i) => i.id === action.payload);
        if (item && !item.isRead) {
          item.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    );

    // markNotificationUnread
    builder.addCase(
      markNotificationUnread.fulfilled,
      (state, action: PayloadAction<string>) => {
        const item = state.items.find((i) => i.id === action.payload);
        if (item && item.isRead) {
          item.isRead = false;
          state.unreadCount += 1;
        }
      }
    );

    // markAllNotificationsRead
    builder.addCase(markAllNotificationsRead.fulfilled, (state) => {
      state.items.forEach((item) => {
        item.isRead = true;
      });
      state.unreadCount = 0;
    });
  },
});

export const {
  clearNotifications,
  sseConnected,
  sseNotificationCreated,
  sseNotificationRead,
  sseNotificationUnread,
} = notificationSlice.actions;

export default notificationSlice.reducer;
