import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ReferralState,
  Referral,
  CarerReferralResponse,
  ClientReferralRequest,
  ClientReferralResponse,
} from "@/types/referral";
import { referralService } from "@/services/referralService";

const initialState: ReferralState = {
  referrals: [],
  clientReferrals: [],
  carerReferrals: [],
  loading: false,
  submitting: false,
  success: false,
  error: null,
  referral: null,
};

export const fetchReferrals = createAsyncThunk(
  "referral/fetchReferrals",
  async (_, { rejectWithValue }) => {
    try {
      return await referralService.getReferrals();
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load referrals");
    }
  },
);

export const fetchClientReferralsThunk = createAsyncThunk(
  "referral/fetchClientReferrals",
  async (status: string, { rejectWithValue }) => {
    try {
      return await referralService.getClientReferrals(status);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load client referrals");
    }
  },
);

export const fetchCarerReferralsThunk = createAsyncThunk(
  "referral/fetchCarerReferrals",
  async (
    { status, type }: { status: string; type?: string },
    { rejectWithValue },
  ) => {
    try {
      return await referralService.getCarerReferrals(status, type);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load carer referrals");
    }
  },
);

export const submitCarerReferralThunk = createAsyncThunk(
  "referral/submitCarerReferral",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await referralService.submitCarerReferral(formData);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to submit carer referral");
    }
  },
);

export const submitClientReferralThunk = createAsyncThunk(
  "referral/submitClientReferral",
  async (payload: ClientReferralRequest, { rejectWithValue }) => {
    try {
      return await referralService.submitClientReferral(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to submit client referral");
    }
  },
);

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    resetReferralStatus(state) {
      state.success = false;
      state.error = null;
      state.referral = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Referrals
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReferrals.fulfilled,
        (state, action: PayloadAction<Referral[]>) => {
          state.loading = false;
          state.referrals = action.payload;
        },
      )
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Client Referrals
      .addCase(fetchClientReferralsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClientReferralsThunk.fulfilled,
        (state, action: PayloadAction<ClientReferralResponse[]>) => {
          state.loading = false;
          state.clientReferrals = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchClientReferralsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Carer Referrals
      .addCase(fetchCarerReferralsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCarerReferralsThunk.fulfilled,
        (state, action: PayloadAction<CarerReferralResponse[]>) => {
          state.loading = false;
          state.carerReferrals = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchCarerReferralsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit Carer Referral
      .addCase(submitCarerReferralThunk.pending, (state) => {
        state.submitting = true;
        state.success = false;
        state.error = null;
        state.referral = null;
      })
      .addCase(
        submitCarerReferralThunk.fulfilled,
        (state, action: PayloadAction<CarerReferralResponse>) => {
          state.submitting = false;
          state.success = true;
          state.referral = action.payload;
          state.error = null;
        },
      )
      .addCase(submitCarerReferralThunk.rejected, (state, action) => {
        state.submitting = false;
        state.success = false;
        state.error = action.payload as string;
        state.referral = null;
      })
      // Submit Client Referral
      .addCase(submitClientReferralThunk.pending, (state) => {
        state.submitting = true;
        state.success = false;
        state.error = null;
        state.referral = null;
      })
      .addCase(
        submitClientReferralThunk.fulfilled,
        (state, action: PayloadAction<ClientReferralResponse>) => {
          state.submitting = false;
          state.success = true;
          state.referral = action.payload;
          state.error = null;
        },
      )
      .addCase(submitClientReferralThunk.rejected, (state, action) => {
        state.submitting = false;
        state.success = false;
        state.error = action.payload as string;
        state.referral = null;
      });
  },
});

export const { resetReferralStatus } = referralSlice.actions;
export default referralSlice.reducer;
