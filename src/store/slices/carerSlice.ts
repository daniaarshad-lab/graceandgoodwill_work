import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { carerService } from "@/services/carer/carer.service";
import { CarerProfile, UpdateCarerProfilePayload, UpdateAvailabilityPayload } from "@/types/carer.types";
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

export const updateCarerAvailability = createAsyncThunk<
  CarerProfile,
  UpdateAvailabilityPayload,
  { rejectValue: string }
>(
  "carer/updateAvailability",
  async (payload, { rejectWithValue }) => {
    try {
      return await carerService.updateAvailability(payload);
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to update availability"
      );
    }
  }
);

export const deleteCarerDocument = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "carer/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await carerService.deleteDocument(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to delete document"
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
      })

      .addCase(updateCarerAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCarerAvailability.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateCarerAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update availability";
      })

      .addCase(deleteCarerDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteCarerDocument.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.documents = state.documents.filter(
            (doc) => doc.id !== action.payload
          );
        }
      )
      .addCase(deleteCarerDocument.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to delete document";
      });
  },
})

export const { clearCarerProfile } = carerSlice.actions;

export default carerSlice.reducer;