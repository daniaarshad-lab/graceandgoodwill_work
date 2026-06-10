import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { carerService } from "@/services/carer/carer.service";
import {
  CarerProfile,
  UpdateCarerProfilePayload,
  UpdateAvailabilityPayload,
} from "@/types/carer.types";
import { CarerDocument } from "@/app/(protected)/carer/types/carer.types";

interface CarerState {
  profile: CarerProfile | null;
  documents: CarerDocument[];

  loading: boolean;
  error: string | null;

  documentsLoading: boolean;
  uploadingDocument: boolean;
  batchUploading: boolean;
  deletingDocumentId: string | null;
}

const initialState: CarerState = {
  profile: null,
  documents: [],
  loading: false,
  error: null,
  documentsLoading: false,
  uploadingDocument: false,
  batchUploading: false,
  deletingDocumentId: null,
};

export const fetchCarerProfile = createAsyncThunk<
  CarerProfile,
  void,
  { rejectValue: string }
>("carer/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    return await carerService.getProfile();
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch carer profile",
    );
  }
});

export const updateCarerProfile = createAsyncThunk<
  CarerProfile,
  UpdateCarerProfilePayload,
  { rejectValue: string }
>("carer/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await carerService.updateProfile(payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update carer profile");
  }
});

export const uploadCarerProfilePhoto = createAsyncThunk<
  CarerProfile,
  File,
  { rejectValue: string }
>("carer/uploadProfilePhoto", async (file, { rejectWithValue }) => {
  try {
    return await carerService.uploadProfilePhoto(file);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to upload profile photo",
    );
  }
});

export const fetchCarerDocuments = createAsyncThunk<
  CarerDocument[],
  void,
  { rejectValue: string }
>("carer/fetchDocuments", async (_, { rejectWithValue }) => {
  try {
    return await carerService.getDocuments();
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch documents");
  }
});

export const updateCarerAvailability = createAsyncThunk<
  CarerProfile,
  UpdateAvailabilityPayload,
  { rejectValue: string }
>("carer/updateAvailability", async (payload, { rejectWithValue }) => {
  try {
    return await carerService.updateAvailability(payload);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update availability");
  }
});


export const uploadCarerDocument = createAsyncThunk<
  CarerDocument,
  { file: File; category: string },
  { rejectValue: string }
>("carer/uploadDocument", async ({ file, category }, { rejectWithValue }) => {
  try {
    return await carerService.uploadDocument(file, category);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to upload document");
  }
});

export const uploadCarerDocuments = createAsyncThunk<
  CarerDocument[],
  Record<string, File>,
  { rejectValue: string }
>("carer/uploadDocuments", async (files, { rejectWithValue }) => {
  try {
    return await carerService.uploadDocuments(files);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to upload documents");
  }
});

export const updateCarerDocument = createAsyncThunk<
  CarerDocument,
  { id: string; file: File; category: string },
  { rejectValue: string }
>("carer/updateDocument", async ({ id, file, category }, { rejectWithValue }) => {
  try {
    return await carerService.updateDocument(id, file, category);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update document");
  }
});

export const deleteCarerDocument = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("carer/deleteDocument", async (id, { rejectWithValue }) => {
  try {
    await carerService.deleteDocument(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to delete document");
  }
});


export const uploadProfileMedia = createAsyncThunk<
  CarerProfile,
  {
    photo?: File;
    video?: File;
  },
  {
    rejectValue: string;
  }
>(
  "carer/uploadProfileMedia",
  async ({ photo, video }, { rejectWithValue }) => {
    try {
      return await carerService.uploadProfileMedia(photo, video);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload profile media"
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
        },
      )
      .addCase(fetchCarerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch carer profile";
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
        },
      )
      .addCase(updateCarerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update carer profile";
      })

      .addCase(uploadCarerProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadCarerProfilePhoto.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(uploadCarerProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload profile photo";
      })
      .addCase(fetchCarerDocuments.pending, (state) => {
        state.documentsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCarerDocuments.fulfilled,
        (state, action: PayloadAction<CarerDocument[]>) => {
          state.documentsLoading = false;
          state.documents = action.payload;
        },
      )
      .addCase(fetchCarerDocuments.rejected, (state, action) => {
        state.documentsLoading = false;
        state.error = action.payload || "Failed to fetch documents";
      })

      .addCase(uploadCarerDocument.pending, (state) => {
        state.uploadingDocument = true;
        state.error = null;
      })
      .addCase(
        uploadCarerDocument.fulfilled,
        (state, action: PayloadAction<CarerDocument>) => {
          state.uploadingDocument = false;
          state.documents.push(action.payload);
        },
      )
      .addCase(uploadCarerDocument.rejected, (state, action) => {
        state.uploadingDocument = false;
        state.error = action.payload || "Failed to upload document";
      })

      .addCase(uploadCarerDocuments.pending, (state) => {
        state.batchUploading = true;
        state.error = null;
      })
      .addCase(
        uploadCarerDocuments.fulfilled,
        (state) => {
          state.batchUploading = false;
        },
      )
      .addCase(uploadCarerDocuments.rejected, (state, action) => {
        state.batchUploading = false;
        state.error = action.payload || "Failed to upload documents";
      })

      .addCase(updateCarerDocument.pending, (state) => {
        state.uploadingDocument = true;
        state.error = null;
      })
      .addCase(
        updateCarerDocument.fulfilled,
        (state, action: PayloadAction<CarerDocument>) => {
          state.uploadingDocument = false;
          const index = state.documents.findIndex(
            (doc) => doc.id === action.payload.id,
          );
          if (index !== -1) {
            state.documents[index] = action.payload;
          }
        },
      )
      .addCase(updateCarerDocument.rejected, (state, action) => {
        state.uploadingDocument = false;
        state.error = action.payload || "Failed to update document";
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
        },
      )
      .addCase(updateCarerAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update availability";
      })

      .addCase(deleteCarerDocument.pending, (state, action) => {
        state.deletingDocumentId = action.meta.arg;
        state.error = null;
      })
      .addCase(
        deleteCarerDocument.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deletingDocumentId = null;
          state.documents = state.documents.filter(
            (doc) => doc.id !== action.payload,
          );
        },
      )
      .addCase(deleteCarerDocument.rejected, (state, action) => {
        state.deletingDocumentId = null;
        state.error = action.payload || "Failed to delete document";
      })
      .addCase(uploadProfileMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadProfileMedia.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(uploadProfileMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload profile media";
      });
  },
});

export const { clearCarerProfile } = carerSlice.actions;

export default carerSlice.reducer;
