import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { notificationService } from "@/services/notification/notification.service";
import {
  NotificationItem,
  NotificationState,
} from "@/types/notification.types";

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  NotificationItem[],
  void,
  { rejectValue: string }
>("notification/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    return await notificationService.getNotifications();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch notifications");
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
    return rejectWithValue(
      error?.message || "Failed to mark notification as read",
    );
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<NotificationItem[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter((item) => !item.read).length;
      },
    );
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch notifications";
    });

    // Mark Read
    builder.addCase(
      markNotificationRead.fulfilled,
      (state, action: PayloadAction<string>) => {
        const item = state.items.find((item) => item.id === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      },
    );
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
