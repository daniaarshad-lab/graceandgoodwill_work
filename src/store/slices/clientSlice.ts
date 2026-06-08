import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "@/services/client/client.service";
import {
  ClientProfile,
  ClientState,
  CreateCareRequestPayload,
  CareRequest,
  IntroductionRequestPayload,
  IntroductionRequest,
} from "@/types/client.types";
import { CreateEnquiryPayload } from "@/types/client.types";
import { Carer } from "@/app/(protected)/client/types/client-ui.types";
import { mapCarerProfileToUICarer } from "@/utils/mappers/carerMapper";

const initialState: ClientState = {
  profile: null,
  careRequests: [],
  carers: [],

  enquiries: [],
  selectedEnquiry: null,

  loading: false,
  error: null,
};

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

export const updateClientProfile = createAsyncThunk<
  ClientProfile,
  Partial<ClientProfile>,
  { rejectValue: string }
>("client/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await clientService.updateProfile(payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update client profile");
  }
});

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

export const requestIntroduction = createAsyncThunk<
  IntroductionRequest,
  IntroductionRequestPayload,
  { rejectValue: string }
>("client/requestIntroduction", async (payload, { rejectWithValue }) => {
  try {
    const response = await clientService.requestIntroduction(payload);
    return response;
  } catch (error: any) {
    console.error("[Thunk: requestIntroduction] Error:", error);
    return rejectWithValue(error?.message || "Failed to request introduction");
  }
});

export const fetchCarers = createAsyncThunk<
  Carer[],
  void,
  { rejectValue: string }
>("client/fetchCarers", async (_, { rejectWithValue }) => {
  try {
    const response = await clientService.getCarers();
    const mapped = response.map(mapCarerProfileToUICarer);
    return mapped;
  } catch (error: any) {
    console.error("[Thunk: fetchCarers] Error:", error);
    return rejectWithValue(error?.message || "Failed to fetch carers");
  }
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientProfile(state) {
      state.profile = null;
      state.careRequests = [];

      state.enquiries = [];
      state.selectedEnquiry = null;

      state.error = null;
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
    builder.addCase(requestIntroduction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(requestIntroduction.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(requestIntroduction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to request introduction";
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

export const { clearClientProfile } = clientSlice.actions;

export default clientSlice.reducer;
