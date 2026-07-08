import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminService } from "@/services/admin/admin.service";
import { AdminDashboardStats, AdminState, AdminCareRequestApplication } from "@/types/admin.types";

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
  clients: {
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

  selectedCareRequestApplications: [],
  applicationsLoading: false,
  applicationsError: null,
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

export const fetchAdminClients = createAsyncThunk<
  { items: any[]; total: number; page: number; limit: number },
  { page: number; limit: number; status: string },
  { rejectValue: string }
>("admin/fetchClients", async ({ page, limit, status }, { rejectWithValue }) => {
  try {
    return await adminService.getClients(page, limit, status);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch clients");
  }
});

/** Update carer account status (e.g. APPROVED) */
export const updateAdminCarerStatus = createAsyncThunk<
  { id: string; status: string },
  { carerId: string; status: string },
  { rejectValue: string }
>("admin/updateCarerStatus", async ({ carerId, status }, { rejectWithValue }) => {
  try {
    const result = await adminService.updateCarerStatus(carerId, status);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update carer status");
  }
});

export const fetchCarerDetails = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("admin/fetchCarerDetails", async (carerId, { rejectWithValue }) => {
  try {
    const carer = await adminService.getCarerDetails(carerId);
    if (!carer) {
      throw new Error("Carer not found");
    }
    return carer;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch carer details");
  }
});

export const verifyDocument = createAsyncThunk<
  { docId: string; status: string; data?: any },
  { docId: string; notes?: string },
  { rejectValue: string }
>("admin/verifyDocument", async ({ docId, notes }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateDocumentStatus(docId, "VERIFIED", notes);
    return { docId, status: "VERIFIED", data: response };
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to verify document");
  }
});

export const rejectDocument = createAsyncThunk<
  { docId: string; status: string; data?: any },
  { docId: string; rejectionReason: string },
  { rejectValue: string }
>("admin/rejectDocument", async ({ docId, rejectionReason }, { rejectWithValue }) => {
  try {
    const response = await adminService.updateDocumentStatus(docId, "REJECTED", rejectionReason);
    return { docId, status: "REJECTED", data: response };
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to reject document");
  }
});

/** Fetch applications for a specific care request */
export const fetchAdminCareRequestApplications = createAsyncThunk<
  AdminCareRequestApplication[],
  string,
  { rejectValue: string }
>("admin/fetchCareRequestApplications", async (careRequestId, { rejectWithValue }) => {
  try {
    const data = await adminService.getCareRequestApplications(careRequestId);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch applications");
  }
});

/** Update care request status */
export const updateAdminCareRequestStatus = createAsyncThunk<
  { careRequestId: string; status: string },
  { careRequestId: string; status: string },
  { rejectValue: string }
>("admin/updateCareRequestStatus", async ({ careRequestId, status }, { rejectWithValue }) => {
  try {
    await adminService.updateCareRequestStatus(careRequestId, status);
    return { careRequestId, status };
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update care request status");
  }
});

/** Trigger billing run */
export const triggerAdminBillingRun = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("admin/triggerBillingRun", async (_, { rejectWithValue }) => {
  try {
    return await adminService.triggerBillingRun();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to trigger billing run");
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
    setClientsPage(state, action: PayloadAction<number>) {
      state.clients.page = action.payload;
    },
    setClientsStatus(state, action: PayloadAction<string>) {
      state.clients.status = action.payload;
      state.clients.page = 1;
    },
    setClientsLimit(state, action: PayloadAction<number>) {
      state.clients.limit = action.payload;
      state.clients.page = 1;
    },
    clearCareRequestApplications(state) {
      state.selectedCareRequestApplications = [];
      state.applicationsError = null;
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

    // fetchAdminClients
    builder.addCase(fetchAdminClients.pending, (state) => {
      state.clients.loading = true;
      state.clients.error = null;
    });
    builder.addCase(fetchAdminClients.fulfilled, (state, action) => {
      state.clients.loading = false;
      state.clients.items = action.payload.items || [];
      state.clients.totalItems = action.payload.total || 0;
      state.clients.totalPages = Math.ceil((action.payload.total || 0) / state.clients.limit);
    });
    builder.addCase(fetchAdminClients.rejected, (state, action) => {
      state.clients.loading = false;
      state.clients.error = action.payload || "Failed to fetch clients";
    });

    // fetchCarerDetails
    builder.addCase(fetchCarerDetails.pending, (state) => {
      state.selectedCarer.loading = true;
      state.selectedCarer.error = null;
    });
    builder.addCase(fetchCarerDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.selectedCarer.loading = false;
      state.selectedCarer.data = action.payload;
    });
    builder.addCase(fetchCarerDetails.rejected, (state, action) => {
      state.selectedCarer.loading = false;
      state.selectedCarer.error = action.payload || "Failed to fetch carer details";
    });

    const applyDocumentUpdate = (state: any, docId: string, updates: any) => {
      // Helper to update a document within an array
      const updateDocsArray = (docs: any[] | undefined) => {
        if (!Array.isArray(docs)) return false;
        const doc = docs.find((d: any) => d.id === docId);
        if (doc) {
          Object.assign(doc, updates);
          return true;
        }
        return false;
      };

      // 1. Update selectedCarer
      if (state.selectedCarer.data) {
        const data = state.selectedCarer.data;
        updateDocsArray(data.documents);
        updateDocsArray(data.complianceDocuments);
        updateDocsArray(data.complianceDocs);
        if (data.carerProfile) {
          updateDocsArray(data.carerProfile.documents);
          updateDocsArray(data.carerProfile.complianceDocuments);
          updateDocsArray(data.carerProfile.complianceDocs);
        }
      }

      // 2. Update carers list
      if (Array.isArray(state.carers.items)) {
        state.carers.items.forEach((user: any) => {
          updateDocsArray(user.documents);
          if (user.carerProfile) {
            updateDocsArray(user.carerProfile.documents);
          }
        });
      }
    };

    // verifyDocument
    builder.addCase(verifyDocument.fulfilled, (state, action) => {
      const { docId, status, data } = action.payload;
      applyDocumentUpdate(state, docId, { status, ...data });
    });

    // rejectDocument
    builder.addCase(rejectDocument.fulfilled, (state, action) => {
      const { docId, status, data } = action.payload;
      applyDocumentUpdate(state, docId, { status, ...data });
    });



    // fetchAdminCareRequestApplications
    builder.addCase(fetchAdminCareRequestApplications.pending, (state) => {
      state.applicationsLoading = true;
      state.applicationsError = null;
    });
    builder.addCase(fetchAdminCareRequestApplications.fulfilled, (state, action: PayloadAction<AdminCareRequestApplication[]>) => {
      state.applicationsLoading = false;
      state.selectedCareRequestApplications = action.payload;
    });
    builder.addCase(fetchAdminCareRequestApplications.rejected, (state, action) => {
      state.applicationsLoading = false;
      state.applicationsError = action.payload || "Failed to fetch applications";
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
  setClientsPage,
  setClientsStatus,
  setClientsLimit,
  clearCareRequestApplications,
} = adminSlice.actions;

export default adminSlice.reducer;
