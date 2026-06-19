import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ReferralState, Referral } from "@/types/referral";
import { referralService } from "@/services/referralService";

const initialState: ReferralState = {
  referrals: [],
  loading: false,
  submitting: false,
  success: false,
  error: null,
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

export const createCarerReferral = createAsyncThunk(
  "referral/createCarerReferral",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await referralService.submitCarerReferral(formData);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to submit carer referral");
    }
  },
);

export const createClientReferral = createAsyncThunk(
  "referral/createClientReferral",
  async (
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await referralService.submitClientReferral(data);
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
      // Create Carer Referral
      .addCase(createCarerReferral.pending, (state) => {
        state.submitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(
        createCarerReferral.fulfilled,
        (state, action: PayloadAction<Referral>) => {
          state.submitting = false;
          state.success = true;
          state.referrals = [action.payload, ...state.referrals];
        },
      )
      .addCase(createCarerReferral.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      // Create Client Referral
      .addCase(createClientReferral.pending, (state) => {
        state.submitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(
        createClientReferral.fulfilled,
        (state, action: PayloadAction<Referral>) => {
          state.submitting = false;
          state.success = true;
          state.referrals = [action.payload, ...state.referrals];
        },
      )
      .addCase(createClientReferral.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReferralStatus } = referralSlice.actions;
export default referralSlice.reducer;
