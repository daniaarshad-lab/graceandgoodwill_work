import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "@/services/client/client.service";
import {
  ClientProfile,
  ClientState,
  CreateCareRequestPayload,
  CareRequest,
  CareRequestApplication,
  UpdateClientProfilePayload,
  ClientPlacement,
  ClientFeedback,
  FeedbackPayload,
} from "@/types/client.types";
import { CreateEnquiryPayload } from "@/types/client.types";
import { Carer } from "@/app/(protected)/client/types/client-ui.types";
import { mapCarerProfileToUICarer } from "@/utils/mappers/carerMapper";

const initialState: ClientState = {
  profile: null,
  careRequests: [],
  carers: [],
  placements: [],
  placementsLoading: false,
  placementsError: null,

  interestList: [],
  interestListLoading: false,

  enquiries: [],
  selectedEnquiry: null,

  applications: {},
  applicationsLoading: false,
  applicationsError: null,



  feedbacks: [],
  feedbacksLoading: false,
  feedbacksError: null,

  loading: false,
  error: null,
};

// ... existing thunks ...
export const fetchClientProfile = createAsyncThunk<
  ClientProfile,
  void,
  { rejectValue: string }
>("client/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    return await clientService.getProfile();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch client profile");
  }
});

// Add interest list thunks here:
export const fetchInterestList = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("client/fetchInterestList", async (_, { rejectWithValue }) => {
  try {
    const response = await clientService.getInterestList();
    console.log("fetchInterestList response:", response);
    const list = response.interestList;
    console.log("extracted list:", list);
    if (!Array.isArray(list)) return [];

    // Check if the backend returned nested carer profiles or direct objects
    const interestListCarers = list
      .filter((item: any) => item !== null && item !== undefined)
      .map((item: any) => {
        const carerData = item.carerProfile || item.carer;
        let mapped;
        if (carerData) {
          mapped = mapCarerProfileToUICarer(carerData);
        } else {
          mapped = mapCarerProfileToUICarer(item);
        }

        // The user says the response contains carerProfileId
        if (item.carerProfileId) {
          mapped.id = item.carerProfileId;
        }

        return mapped;
      });

    return interestListCarers;
  } catch (error: any) {
    console.error("Failed to fetch interest list:", error);
    return rejectWithValue(error?.message || "Failed to fetch interest list");
  }
});

export const addToInterestList = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("client/addToInterestList", async (carerProfileId, { dispatch, rejectWithValue }) => {
  try {
    await clientService.addToInterestList(carerProfileId);
    dispatch(fetchInterestList()); // Refresh interest list
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to add to interest list");
  }
});

export const removeFromInterestList = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("client/removeFromInterestList", async (carerProfileId, { dispatch, rejectWithValue }) => {
  try {
    await clientService.removeFromInterestList(carerProfileId);
    dispatch(fetchInterestList()); // Refresh interest list
    return carerProfileId;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to remove from interest list");
  }
});

export const updateClientProfile = createAsyncThunk<
  ClientProfile,
  UpdateClientProfilePayload,
  { rejectValue: string }
>("client/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await clientService.updateProfile(payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update client profile");
  }
});

/** Create a match: POST /client/matches */
export const createClientMatch = createAsyncThunk<
  any,
  { careRequestId: string; carerProfileId: string },
  { rejectValue: string }
>(
  "client/createMatch",
  async ({ careRequestId, carerProfileId }, { rejectWithValue }) => {
    try {
      return await clientService.createMatch(careRequestId, carerProfileId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create match");
    }
  }
);

export const uploadClientProfilePhoto = createAsyncThunk<
  ClientProfile,
  File,
  { rejectValue: string }
>("client/uploadProfilePhoto", async (file, { rejectWithValue }) => {
  try {
    return await clientService.uploadProfilePhoto(file);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to upload profile photo");
  }
});

export const createCareRequest = createAsyncThunk<
  any,
  CreateCareRequestPayload,
  { rejectValue: string }
>("client/createCareRequest", async (payload, { rejectWithValue }) => {
  try {
    return await clientService.createCareRequest(payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to create care request");
  }
});

export const createEnquiry = createAsyncThunk<
  any,
  CreateEnquiryPayload,
  { rejectValue: string }
>("client/createEnquiry", async (payload, { rejectWithValue }) => {
  try {
    const res = await clientService.createEnquiry(payload);
    return res;
  } catch (error: any) {
    console.error("[Thunk: createEnquiry] Error:", error);
    return rejectWithValue(error?.message || "Failed to create enquiry");
  }
});

export const fetchCareRequests = createAsyncThunk<
  CareRequest[],
  void,
  { rejectValue: string }
>("client/fetchCareRequests", async (_, { rejectWithValue }) => {
  try {
    return await clientService.getCareRequests();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch care requests");
  }
});

/** Fetch applications for a specific care request */
export const fetchClientCareRequestApplications = createAsyncThunk<
  { careRequestId: string; data: CareRequestApplication[] },
  string,
  { rejectValue: string }
>("client/fetchCareRequestApplications", async (careRequestId, { rejectWithValue }) => {
  try {
    const data = await clientService.getCareRequestApplications(careRequestId);
    return { careRequestId, data: Array.isArray(data) ? data : [] };
  } catch (error: any) {
    console.error(`[fetchClientCareRequestApplications] Error fetching applications for ${careRequestId}:`, error);
    return rejectWithValue(error?.message || "Failed to fetch applications");
  }
});


export const approveApplication = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("client/approveApplication", async (applicationId, { rejectWithValue }) => {
  try {
    return await clientService.approveApplication(applicationId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to approve application");
  }
});

export const rejectApplication = createAsyncThunk<
  any,
  { applicationId: string; reason: string },
  { rejectValue: string }
>("client/rejectApplication", async ({ applicationId, reason }, { rejectWithValue }) => {
  try {
    return await clientService.rejectApplication(applicationId, reason);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to reject application");
  }
});

export const fetchCarers = createAsyncThunk<
  Carer[],
  void,
  { rejectValue: string }
>("client/fetchCarers", async (_, { rejectWithValue }) => {
  try {
    const response = await clientService.getCarers();
    if (!response || !Array.isArray(response)) {
      return [];
    }
    const mapped = response.map(mapCarerProfileToUICarer);
    return mapped;
  } catch (error: any) {
    console.error("Failed to fetch carers from API:", error);
    return rejectWithValue(error?.message || "Failed to fetch carers");
  }
});

export const submitFeedback = createAsyncThunk<
  ClientFeedback,
  { placementId: string; payload: FeedbackPayload },
  { rejectValue: string }
>("client/submitFeedback", async ({ placementId, payload }, { rejectWithValue }) => {
  try {
    return await clientService.submitFeedback(placementId, payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to submit feedback");
  }
});

export const fetchClientFeedbacks = createAsyncThunk<
  ClientFeedback[],
  void,
  { rejectValue: string }
>("client/fetchFeedbacks", async (_, { rejectWithValue }) => {
  try {
    return await clientService.getClientFeedbacks();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch feedbacks");
  }
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientProfile(state) {
      state.profile = null;
      state.careRequests = [];
      state.placements = [];
      state.placementsLoading = false;
      state.placementsError = null;

      state.enquiries = [];
      state.selectedEnquiry = null;

      state.applications = [];
      state.applicationsLoading = false;
      state.applicationsError = null;

      state.error = null;
    },
    clearApplications(state) {
      state.applications = [];
      state.applicationsError = null;
    },
  },
  extraReducers: (builder) => {
    // Profile
    builder.addCase(fetchClientProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchClientProfile.fulfilled,
      (state, action: PayloadAction<ClientProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      },
    );

    builder.addCase(fetchClientProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch client profile";
    });

    // Update Profile
    builder.addCase(updateClientProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      updateClientProfile.fulfilled,
      (state, action: PayloadAction<ClientProfile>) => {
        state.loading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        } else {
          state.profile = action.payload;
        }
      },
    );

    builder.addCase(updateClientProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update client profile";
    });


    // Upload Profile Photo
    builder.addCase(uploadClientProfilePhoto.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      uploadClientProfilePhoto.fulfilled,
      (state, action: PayloadAction<ClientProfile>) => {
        state.loading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        } else {
          state.profile = action.payload;
        }
      },
    );

    builder.addCase(uploadClientProfilePhoto.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to upload profile photo";
    });

    // Care Requests
    builder.addCase(fetchCareRequests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchCareRequests.fulfilled,
      (state, action: PayloadAction<CareRequest[]>) => {
        state.loading = false;
        state.careRequests = action.payload;
      },
    );

    builder.addCase(fetchCareRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch care requests";
    });

    builder.addCase(createEnquiry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(createEnquiry.fulfilled, (state, action) => {
      state.loading = false;
      state.enquiries.unshift(action.payload);
    });

    builder.addCase(createEnquiry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create enquiry";
    });

    builder.addCase(fetchEnquiries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchEnquiries.fulfilled, (state, action) => {
      state.loading = false;
      state.enquiries = action.payload;
    });

    builder.addCase(fetchEnquiries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch enquiries";
    });
    builder.addCase(fetchEnquiryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchEnquiryById.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.selectedEnquiry = action.payload;
      }
    });

    builder.addCase(fetchEnquiryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch enquiry details";
    });
    builder.addCase(sendEnquiryMessage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(sendEnquiryMessage.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(sendEnquiryMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to send enquiry message";
    });

    builder.addCase(fetchCarers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchCarers.fulfilled,
      (state, action: PayloadAction<Carer[]>) => {
        state.loading = false;
        state.carers = action.payload;
      },
    );

    builder.addCase(fetchCarers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch carers";
    });

    // getClientPlacements
    builder.addCase(getClientPlacements.pending, (state) => {
      state.placementsLoading = true;
      state.placementsError = null;
    });

    builder.addCase(
      getClientPlacements.fulfilled,
      (state, action: PayloadAction<ClientPlacement[]>) => {
        state.placementsLoading = false;
        state.placements = action.payload;
      },
    );

    builder.addCase(getClientPlacements.rejected, (state, action) => {
      state.placementsLoading = false;
      state.placementsError = action.payload || "Failed to fetch placements";
    });

    // Interest List
    builder.addCase(fetchInterestList.pending, (state) => {
      state.interestListLoading = true;
      state.error = null;
    });
    builder.addCase(fetchInterestList.fulfilled, (state, action) => {
      state.interestListLoading = false;
      state.interestList = action.payload;
    });
    builder.addCase(fetchInterestList.rejected, (state, action) => {
      state.interestListLoading = false;
      state.error = action.payload || "Failed to fetch interest list";
    });

    // Care Request Applications
    builder.addCase(fetchClientCareRequestApplications.pending, (state) => {
      state.applicationsLoading = true;
      state.applicationsError = null;
    });
    builder.addCase(fetchClientCareRequestApplications.fulfilled, (state, action) => {
      state.applicationsLoading = false;
      state.applications[action.payload.careRequestId] = action.payload.data;
    });
    builder.addCase(fetchClientCareRequestApplications.rejected, (state, action) => {
      state.applicationsLoading = false;
      state.applicationsError = action.payload || "Failed to fetch applications";
    });

    builder.addCase(approveApplication.fulfilled, (state, action) => {
      // Find the application and update its status
      for (const careRequestId in state.applications) {
        const idx = state.applications[careRequestId].findIndex(app => app.id === action.meta.arg);
        if (idx !== -1) {
          state.applications[careRequestId][idx].status = 'APPROVED';
          break;
        }
      }
    });

    builder.addCase(rejectApplication.fulfilled, (state, action) => {
      for (const careRequestId in state.applications) {
        const idx = state.applications[careRequestId].findIndex(app => app.id === action.meta.arg.applicationId);
        if (idx !== -1) {
          state.applications[careRequestId][idx].status = 'REJECTED';
          break;
        }
      }
    });

    // Feedback
    builder.addCase(submitFeedback.fulfilled, (state, action) => {
      const placementId = action.payload.placement?.id || action.meta.arg.placementId;
      if (placementId) {
        const placement = state.placements.find(p => p.id === placementId);
        if (placement) {
          placement.hasSubmittedFeedback = true;
        }
      }
      state.feedbacks.unshift(action.payload);
    });

    builder.addCase(fetchClientFeedbacks.pending, (state) => {
      state.feedbacksLoading = true;
      state.feedbacksError = null;
    });
    builder.addCase(fetchClientFeedbacks.fulfilled, (state, action: PayloadAction<ClientFeedback[]>) => {
      state.feedbacksLoading = false;
      state.feedbacks = action.payload;
    });
    builder.addCase(fetchClientFeedbacks.rejected, (state, action) => {
      state.feedbacksLoading = false;
      state.feedbacksError = action.payload || "Failed to fetch feedbacks";
    });
  },
});

export const fetchEnquiries = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("client/fetchEnquiries", async (_, { rejectWithValue }) => {
  try {
    const res = await clientService.getEnquiries();
    return res;
  } catch (error: any) {
    console.error("[Thunk: fetchEnquiries] Error:", error);
    return rejectWithValue(error?.message || "Failed to fetch enquiries");
  }
});

export const fetchEnquiryById = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("client/fetchEnquiryById", async (id, { rejectWithValue }) => {
  try {
    return await clientService.getEnquiryById(id);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch enquiry details");
  }
});

export const sendEnquiryMessage = createAsyncThunk<
  any,
  {
    enquiryId: string;
    message: string;
  },
  { rejectValue: string }
>(
  "client/sendEnquiryMessage",
  async ({ enquiryId, message }, { rejectWithValue }) => {
    try {
      return await clientService.sendEnquiryMessage(enquiryId, message);
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to send enquiry message",
      );
    }
  },
);

export const getClientPlacements = createAsyncThunk<
  ClientPlacement[],
  void,
  { rejectValue: string }
>("client/getClientPlacements", async (_, { rejectWithValue }) => {
  try {
    return await clientService.getPlacements();
  } catch (error: any) {
    console.error("[Thunk: getClientPlacements] Error:", error);
    return rejectWithValue(error?.message || "Failed to fetch client placements");
  }
});

export const { clearClientProfile, clearApplications } = clientSlice.actions;

export default clientSlice.reducer;
