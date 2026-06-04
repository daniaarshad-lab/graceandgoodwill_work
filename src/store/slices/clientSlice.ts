import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "@/services/client/client.service";
import { ClientProfile, ClientState } from "@/types/client.types";

const initialState: ClientState = {
  profile: null,
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

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClientProfile(state) {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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

    builder.addCase(updateClientProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateClientProfile.fulfilled,
      (state, action: PayloadAction<ClientProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      },
    );
    builder.addCase(updateClientProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update client profile";
    });
  },
});

export const { clearClientProfile } = clientSlice.actions;
export default clientSlice.reducer;
