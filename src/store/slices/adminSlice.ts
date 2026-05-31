import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminService } from "@/services/admin/admin.service";
import { AdminDashboardStats, AdminState } from "@/types/admin.types";

const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchAdminDashboardStats = createAsyncThunk<AdminDashboardStats, void, { rejectValue: string }>(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch admin stats");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminStats(state) {
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdminDashboardStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminDashboardStats.fulfilled, (state, action: PayloadAction<AdminDashboardStats>) => {
      state.loading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchAdminDashboardStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch admin stats";
    });
  },
});

export const { clearAdminStats } = adminSlice.actions;
export default adminSlice.reducer;
