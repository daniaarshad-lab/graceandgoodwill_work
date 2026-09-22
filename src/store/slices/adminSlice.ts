import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminService } from "@/services/admin/admin.service";
import {
  AdminDashboardStats,
  AdminState,
  AdminCareRequestApplication,
  EmergencyCareRequestStatusValue,
} from "@/types/admin.types";

const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null,
  activeTab: "overview",
  isSearchModalOpen: false,
  globalSearchQuery: "",
  globalSearchResults: null,
  isSearchingGlobal: false,
  globalSearchError: null,
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
  emergencyCareRequests: {
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
>(
  "admin/fetchCareRequests",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      return await adminService.getCareRequests(page, limit, status);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch care requests");
    }
  },
);

export const fetchAdminEmergencyCareRequests = createAsyncThunk<
  { items: any[]; total: number; page: number; limit: number },
  { page: number; limit: number; status: string },
  { rejectValue: string }
>(
  "admin/fetchEmergencyCareRequests",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      return await adminService.getEmergencyCareRequests(page, limit, status);
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch emergency care requests",
      );
    }
  },
);

export const fetchAdminClients = createAsyncThunk<
  { items: any[]; total: number; page: number; limit: number },
  { page: number; limit: number; status: string },
  { rejectValue: string }
>(
  "admin/fetchClients",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      return await adminService.getClients(page, limit, status);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch clients");
    }
  },
);

/** Update carer account status (e.g. APPROVED) */
export const updateAdminCarerStatus = createAsyncThunk<
  { id: string; status: string },
  { carerId: string; status: string },
  { rejectValue: string }
>(
  "admin/updateCarerStatus",
  async ({ carerId, status }, { rejectWithValue }) => {
    try {
      const result = await adminService.updateCarerStatus(carerId, status);
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update carer status");
    }
  },
);

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
  {
    docId: string;
    notes?: string;
    expiryDate?: string | null;
    dbsCertificateNumber?: string | null;
  },
  { rejectValue: string }
>(
  "admin/verifyDocument",
  async ({ docId, notes, expiryDate, dbsCertificateNumber }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateDocumentStatus(
        docId,
        "VERIFIED",
        undefined,
        notes,
        expiryDate,
        dbsCertificateNumber,
      );
      return { docId, status: "VERIFIED", data: response };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to verify document");
    }
  },
);

export const updateDocumentMetadataThunk = createAsyncThunk<
  { docId: string; data?: any },
  {
    docId: string;
    expiryDate?: string | null;
    dbsCertificateNumber?: string | null;
    internalNotes?: string | null;
  },
  { rejectValue: string }
>(
  "admin/updateDocumentMetadata",
  async ({ docId, expiryDate, dbsCertificateNumber, internalNotes }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateDocumentMetadata(docId, {
        expiryDate,
        dbsCertificateNumber,
        internalNotes,
      });
      return { docId, data: response };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update document metadata");
    }
  },
);

export const rejectDocument = createAsyncThunk<
  { docId: string; status: string; data?: any },
  { docId: string; rejectionReason: string },
  { rejectValue: string }
>(
  "admin/rejectDocument",
  async ({ docId, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateDocumentStatus(
        docId,
        "REJECTED",
        rejectionReason,
      );
      return { docId, status: "REJECTED", data: response };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to reject document");
    }
  },
);

export const updateDocumentNotesThunk = createAsyncThunk<
  { docId: string; internalNotes: string; data?: any },
  { docId: string; internalNotes: string },
  { rejectValue: string }
>(
  "admin/updateDocumentNotes",
  async ({ docId, internalNotes }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateDocumentNotes(docId, internalNotes);
      return { docId, internalNotes, data: response };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update document notes");
    }
  },
);

export const deleteDocumentThunk = createAsyncThunk<
  { docId: string; data?: any },
  { docId: string },
  { rejectValue: string }
>(
  "admin/deleteDocument",
  async ({ docId }, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteCarerDocument(docId);
      return { docId, data: response };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete document");
    }
  },
);

/** Fetch applications for a specific care request */
export const fetchAdminCareRequestApplications = createAsyncThunk<
  AdminCareRequestApplication[],
  string,
  { rejectValue: string }
>(
  "admin/fetchCareRequestApplications",
  async (careRequestId, { rejectWithValue }) => {
    try {
      const data = await adminService.getCareRequestApplications(careRequestId);
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch applications");
    }
  },
);

/** Review interest list application (Approve/Reject) */
export const reviewInterestList = createAsyncThunk<
  any,
  {
    careRequestId: string;
    clientId: string;
    carerId: string;
    status: "SELECTED" | "REJECTED" | "ASSIGNED";
    adminNotes?: string;
  },
  { rejectValue: string }
>("admin/reviewInterestList", async (payload, { rejectWithValue }) => {
  try {
    return await adminService.reviewInterestList(payload);
  } catch (error: any) {
    return rejectWithValue(
      error?.message || "Failed to review interest list application",
    );
  }
});

/** Update care request status */
export const updateAdminCareRequestStatus = createAsyncThunk<
  { careRequestId: string; status: string },
  { careRequestId: string; status: string },
  { rejectValue: string }
>(
  "admin/updateCareRequestStatus",
  async ({ careRequestId, status }, { rejectWithValue }) => {
    try {
      await adminService.updateCareRequestStatus(careRequestId, status);
      return { careRequestId, status };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to update care request status",
      );
    }
  },
);

/** Update emergency care request status */
export const updateAdminEmergencyCareRequestStatus = createAsyncThunk<
  { id: string; status: EmergencyCareRequestStatusValue },
  { id: string; status: string },
  { rejectValue: string }
>(
  "admin/updateEmergencyCareRequestStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await adminService.updateEmergencyCareRequestStatus(id, status);
      return { id, status: status as EmergencyCareRequestStatusValue };
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to update emergency care request status",
      );
    }
  },
);

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

export const fetchGlobalSearchResults = createAsyncThunk<
  any[],
  string,
  { rejectValue: string }
>("admin/fetchGlobalSearchResults", async (query, { rejectWithValue }) => {
  try {
    const response: any = await adminService.searchUsers({ query });

    // Safely unwrap the response if it's nested inside an object
    let resultsArray: any[] = [];
    if (Array.isArray(response)) {
      resultsArray = response;
    } else if (response) {
      resultsArray =
        response.data ||
        response.content ||
        response.items ||
        response.results ||
        response.users ||
        [];
    }

    return resultsArray;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to search users");
  }
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
    let found = false;
    if (updateDocsArray(data.documents)) found = true;
    if (updateDocsArray(data.complianceDocuments)) found = true;
    if (updateDocsArray(data.complianceDocs)) found = true;
    if (data.carerProfile) {
      if (updateDocsArray(data.carerProfile.documents)) found = true;
      if (updateDocsArray(data.carerProfile.complianceDocuments)) found = true;
      if (updateDocsArray(data.carerProfile.complianceDocs)) found = true;
    }

    // If not found in existing arrays (e.g. newly uploaded document), insert it!
    if (!found) {
      const targetArray =
        data.carerProfile?.documents ||
        data.documents ||
        data.complianceDocuments ||
        data.carerProfile?.complianceDocuments;
      if (Array.isArray(targetArray)) {
        targetArray.unshift({ id: docId, ...updates });
      }
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

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setSearchModalOpen(state, action: PayloadAction<boolean>) {
      state.isSearchModalOpen = action.payload;
    },
    setGlobalSearchQuery(state, action: PayloadAction<string>) {
      state.globalSearchQuery = action.payload;
    },
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
    setEmergencyCareRequestsPage(state, action: PayloadAction<number>) {
      state.emergencyCareRequests.page = action.payload;
    },
    setEmergencyCareRequestsStatus(state, action: PayloadAction<string>) {
      state.emergencyCareRequests.status = action.payload;
      state.emergencyCareRequests.page = 1;
    },
    setEmergencyCareRequestsLimit(state, action: PayloadAction<number>) {
      state.emergencyCareRequests.limit = action.payload;
      state.emergencyCareRequests.page = 1;
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

    updateDocumentInStore(state, action: PayloadAction<{ docId: string; updates: any }>) {
      applyDocumentUpdate(state, action.payload.docId, action.payload.updates);
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
      state.carers.totalPages = Math.ceil(
        (action.payload.total || 0) / state.carers.limit,
      );
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
      state.careRequests.totalPages = Math.ceil(
        (action.payload.total || 0) / state.careRequests.limit,
      );
    });
    builder.addCase(fetchAdminCareRequests.rejected, (state, action) => {
      state.careRequests.loading = false;
      state.careRequests.error =
        action.payload || "Failed to fetch care requests";
    });

    // fetchAdminEmergencyCareRequests
    builder.addCase(fetchAdminEmergencyCareRequests.pending, (state) => {
      state.emergencyCareRequests.loading = true;
      state.emergencyCareRequests.error = null;
    });
    builder.addCase(
      fetchAdminEmergencyCareRequests.fulfilled,
      (state, action) => {
        state.emergencyCareRequests.loading = false;
        state.emergencyCareRequests.items = action.payload.items || [];
        state.emergencyCareRequests.totalItems = action.payload.total || 0;
        state.emergencyCareRequests.totalPages = Math.ceil(
          (action.payload.total || 0) / state.emergencyCareRequests.limit,
        );
      },
    );
    builder.addCase(
      fetchAdminEmergencyCareRequests.rejected,
      (state, action) => {
        state.emergencyCareRequests.loading = false;
        state.emergencyCareRequests.error =
          action.payload || "Failed to fetch emergency care requests";
      },
    );

    // updateAdminEmergencyCareRequestStatus
    builder.addCase(
      updateAdminEmergencyCareRequestStatus.fulfilled,
      (state, action) => {
        const item = state.emergencyCareRequests.items.find(
          (r) => r.id === action.payload.id,
        );
        if (item) {
          item.status = action.payload.status;
        }
      },
    );
    // fetchAdminClients
    builder.addCase(fetchAdminClients.pending, (state) => {
      state.clients.loading = true;
      state.clients.error = null;
    });
    builder.addCase(fetchAdminClients.fulfilled, (state, action) => {
      state.clients.loading = false;
      state.clients.items = action.payload.items || [];
      state.clients.totalItems = action.payload.total || 0;
      state.clients.totalPages = Math.ceil(
        (action.payload.total || 0) / state.clients.limit,
      );
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
    builder.addCase(
      fetchCarerDetails.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.selectedCarer.loading = false;
        state.selectedCarer.data = action.payload;
      },
    );
    builder.addCase(fetchCarerDetails.rejected, (state, action) => {
      state.selectedCarer.loading = false;
      state.selectedCarer.error =
        action.payload || "Failed to fetch carer details";
    });
    
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

    // updateDocumentMetadataThunk
    builder.addCase(updateDocumentMetadataThunk.fulfilled, (state, action) => {
      const { docId, data } = action.payload;
      applyDocumentUpdate(state, docId, data);
    });

    // fetchAdminCareRequestApplications
    builder.addCase(fetchAdminCareRequestApplications.pending, (state) => {
      state.applicationsLoading = true;
      state.applicationsError = null;
    });
    builder.addCase(
      fetchAdminCareRequestApplications.fulfilled,
      (state, action: PayloadAction<AdminCareRequestApplication[]>) => {
        state.applicationsLoading = false;
        state.selectedCareRequestApplications = action.payload;
      },
    );
    builder
      .addCase(fetchAdminCareRequestApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload as string;
      })

      // Fetch Global Search Results
      .addCase(fetchGlobalSearchResults.pending, (state) => {
        state.isSearchingGlobal = true;
        state.globalSearchError = null;
      })
      .addCase(fetchGlobalSearchResults.fulfilled, (state, action) => {
        state.isSearchingGlobal = false;
        state.globalSearchResults = action.payload;
      })
      .addCase(fetchGlobalSearchResults.rejected, (state, action) => {
        state.isSearchingGlobal = false;
        state.globalSearchError = action.payload as string;
      });
  },
});

export const {
  setActiveTab,
  setSearchModalOpen,
  setGlobalSearchQuery,
  clearAdminStats,
  setCarersPage,
  setCarersStatus,
  setCarersLimit,
  setCareRequestsPage,
  setCareRequestsStatus,
  setCareRequestsLimit,
  setEmergencyCareRequestsPage,
  setEmergencyCareRequestsStatus,
  setEmergencyCareRequestsLimit,
  setClientsPage,
  setClientsStatus,
  setClientsLimit,

  updateDocumentInStore,
  clearCareRequestApplications,
} = adminSlice.actions;

export default adminSlice.reducer;
