import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { carerService } from "@/services/carer/carer.service";
import { CarerProfile, UpdateCarerProfilePayload } from "@/types/carer.types";
import { CarerDocument } from "@/app/carer/types/carer.types";

interface CarerState {
  profile: CarerProfile | null;
  documents: CarerDocument[];

  loading: boolean;
  error: string | null;
}

const initialState: CarerState = {
  profile: null,
  documents: [],
  loading: false,
  error: null,
};

export const fetchCarerProfile = createAsyncThunk<
  CarerProfile,
  void,
  { rejectValue: string }
>(
  "carer/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await carerService.getProfile();
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch carer profile"
      );
    }
  }
);

export const updateCarerProfile = createAsyncThunk<
  CarerProfile,
  UpdateCarerProfilePayload,
  { rejectValue: string }
>(
  "carer/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await carerService.updateProfile(payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to update carer profile"
      );
    }
  }
);

export const fetchCarerDocuments = createAsyncThunk<
  CarerDocument[],
  void,
  { rejectValue: string }
>(
  "carer/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      return await carerService.getDocuments();
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch documents"
      );
    }
  }
);

const carerSlice = createSlice({
  name: "carer",
  initialState,
  reducers: {
    clearCarerProfile(state) {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCarerProfile.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(fetchCarerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch carer profile";
      })

      .addCase(updateCarerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCarerProfile.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateCarerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update carer profile";
      })
      .addCase(fetchCarerDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchCarerDocuments.fulfilled,
        (state, action: PayloadAction<CarerDocument[]>) => {
          state.loading = false;
          state.documents = action.payload;
        }
      )

      .addCase(fetchCarerDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch documents";
      });
  },
})

export const { clearCarerProfile } = carerSlice.actions;

export default carerSlice.reducer;