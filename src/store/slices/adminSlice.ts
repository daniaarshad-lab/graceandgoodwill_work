import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminService } from "@/services/admin/admin.service";
import { AdminDashboardStats, AdminState } from "@/types/admin.types";

const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null,
  carers: {
    items: [],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    status: "ALL",
    loading: false,
    error: null,
  },
  careRequests: {
    items: [],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    status: "ALL",
    loading: false,
    error: null,
  },
  selectedCarer: {
    data: null,
    loading: false,
    error: null,
  },
};

export const fetchAdminDashboardStats = createAsyncThunk<
  AdminDashboardStats,
  void,
  { rejectValue: string }
>("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    return await adminService.getDashboardStats();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch admin stats");
  }
});

export const fetchAdminCarers = createAsyncThunk<
  { items: any[]; total: number; page: number; limit: number },
  { page: number; limit: number; status: string },
  { rejectValue: string }
>("admin/fetchCarers", async ({ page, limit, status }, { rejectWithValue }) => {
  try {
    return await adminService.getCarers(page, limit, status);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch carers");
  }
});

export const fetchAdminCareRequests = createAsyncThunk<
  { items: any[]; total: number; page: number; limit: number },
  { page: number; limit: number; status: string },
  { rejectValue: string }
>("admin/fetchCareRequests", async ({ page, limit, status }, { rejectWithValue }) => {
  try {
    return await adminService.getCareRequests(page, limit, status);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch care requests");
  }
});

export const fetchDocumentDetails = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("admin/fetchDocumentDetails", async (carerId, { rejectWithValue }) => {
  try {
    const response = await adminService.getCarers(1, 1000, "ALL");
    const carer = response.items.find((c: any) => c.id === carerId);
    if (!carer) {
      throw new Error("Carer not found");
    }
    return carer;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch carer details");
  }
});

export const verifyDocument = createAsyncThunk<
  { docId: string; status: string },
  { docId: string; notes?: string },
  { rejectValue: string }
>("admin/verifyDocument", async ({ docId, notes }, { rejectWithValue }) => {
  try {
    await adminService.updateDocumentStatus(docId, "VERIFIED", notes);
    return { docId, status: "Verified" };
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to verify document");
  }
});

export const rejectDocument = createAsyncThunk<
  { docId: string; status: string },
  { docId: string; rejectionReason: string },
  { rejectValue: string }
>("admin/rejectDocument", async ({ docId, rejectionReason }, { rejectWithValue }) => {
  try {
    await adminService.updateDocumentStatus(docId, "REJECTED", rejectionReason);
    return { docId, status: "Rejected" };
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to reject document");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminStats(state) {
      state.stats = null;
      state.error = null;
    },
    setCarersPage(state, action: PayloadAction<number>) {
      state.carers.page = action.payload;
    },
    setCarersStatus(state, action: PayloadAction<string>) {
      state.carers.status = action.payload;
      state.carers.page = 1;
    },
    setCarersLimit(state, action: PayloadAction<number>) {
      state.carers.limit = action.payload;
      state.carers.page = 1;
    },
    setCareRequestsPage(state, action: PayloadAction<number>) {
      state.careRequests.page = action.payload;
    },
    setCareRequestsStatus(state, action: PayloadAction<string>) {
      state.careRequests.status = action.payload;
      state.careRequests.page = 1;
    },
    setCareRequestsLimit(state, action: PayloadAction<number>) {
      state.careRequests.limit = action.payload;
      state.careRequests.page = 1;
    },
  },
  extraReducers: (builder) => {
    // fetchAdminDashboardStats
    builder.addCase(fetchAdminDashboardStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAdminDashboardStats.fulfilled,
      (state, action: PayloadAction<AdminDashboardStats>) => {
        state.loading = false;
        state.stats = action.payload;
      },
    );
    builder.addCase(fetchAdminDashboardStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch admin stats";
    });

    // fetchAdminCarers
    builder.addCase(fetchAdminCarers.pending, (state) => {
      state.carers.loading = true;
      state.carers.error = null;
    });
    builder.addCase(fetchAdminCarers.fulfilled, (state, action) => {
      state.carers.loading = false;
      state.carers.items = action.payload.items || [];
      state.carers.totalItems = action.payload.total || 0;
      state.carers.totalPages = Math.ceil((action.payload.total || 0) / state.carers.limit);
    });
    builder.addCase(fetchAdminCarers.rejected, (state, action) => {
      state.carers.loading = false;
      state.carers.error = action.payload || "Failed to fetch carers";
    });

    // fetchAdminCareRequests
    builder.addCase(fetchAdminCareRequests.pending, (state) => {
      state.careRequests.loading = true;
      state.careRequests.error = null;
    });
    builder.addCase(fetchAdminCareRequests.fulfilled, (state, action) => {
      state.careRequests.loading = false;
      state.careRequests.items = action.payload.items || [];
      state.careRequests.totalItems = action.payload.total || 0;
      state.careRequests.totalPages = Math.ceil((action.payload.total || 0) / state.careRequests.limit);
    });
    builder.addCase(fetchAdminCareRequests.rejected, (state, action) => {
      state.careRequests.loading = false;
      state.careRequests.error = action.payload || "Failed to fetch care requests";
    });

    // fetchDocumentDetails
    builder.addCase(fetchDocumentDetails.pending, (state) => {
      state.selectedCarer.loading = true;
      state.selectedCarer.error = null;
    });
    builder.addCase(fetchDocumentDetails.fulfilled, (state, action) => {
      state.selectedCarer.loading = false;
      state.selectedCarer.data = action.payload;
    });
    builder.addCase(fetchDocumentDetails.rejected, (state, action) => {
      state.selectedCarer.loading = false;
      state.selectedCarer.error = action.payload || "Failed to fetch document details";
    });

    // verifyDocument
    builder.addCase(verifyDocument.fulfilled, (state, action) => {
      const { docId } = action.payload;

      // Optimistic update for selectedCarer
      if (state.selectedCarer.data) {
        const profile = state.selectedCarer.data.carerProfile;
        if (profile && profile.documents) {
          const doc = profile.documents.find((d: any) => d.id === docId);
          if (doc) {
            doc.status = "VERIFIED";
          }
        }
      }

      // Optimistic update for carers list
      state.carers.items = state.carers.items.map((user: any) => {
        const profile = user.carerProfile;
        if (profile && profile.documents) {
          const hasDoc = profile.documents.some((d: any) => d.id === docId);
          if (hasDoc) {
            return {
              ...user,
              carerProfile: {
                ...profile,
                documents: profile.documents.map((d: any) =>
                  d.id === docId ? { ...d, status: "VERIFIED" } : d
                ),
              },
            };
          }
        }
        return user;
      });
    });

    // rejectDocument
    builder.addCase(rejectDocument.fulfilled, (state, action) => {
      const { docId } = action.payload;

      // Optimistic update for selectedCarer
      if (state.selectedCarer.data) {
        const profile = state.selectedCarer.data.carerProfile;
        if (profile && profile.documents) {
          const doc = profile.documents.find((d: any) => d.id === docId);
          if (doc) {
            doc.status = "REJECTED";
          }
        }
      }

      // Optimistic update for carers list
      state.carers.items = state.carers.items.map((user: any) => {
        const profile = user.carerProfile;
        if (profile && profile.documents) {
          const hasDoc = profile.documents.some((d: any) => d.id === docId);
          if (hasDoc) {
            return {
              ...user,
              carerProfile: {
                ...profile,
                documents: profile.documents.map((d: any) =>
                  d.id === docId ? { ...d, status: "REJECTED" } : d
                ),
              },
            };
          }
        }
        return user;
      });
    });
  },
});

export const {
  clearAdminStats,
  setCarersPage,
  setCarersStatus,
  setCarersLimit,
  setCareRequestsPage,
  setCareRequestsStatus,
  setCareRequestsLimit,
} = adminSlice.actions;

export default adminSlice.reducer;
