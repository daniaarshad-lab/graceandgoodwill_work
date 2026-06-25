import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { carerService } from "@/services/carer/carer.service";
import {
  CarerProfile,
  UpdateCarerProfilePayload,
  UpdateAvailabilityPayload,
  CarerCareRequest,
  CarerCareRequestDetail,
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

  /** Placement opportunities */
  careRequests: CarerCareRequest[];
  careRequestsLoading: boolean;
  careRequestsError: string | null;
  selectedCareRequest: CarerCareRequestDetail | null;
  selectedCareRequestLoading: boolean;
  applyingToCareRequest: boolean;
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

  careRequests: [],
  careRequestsLoading: false,
  careRequestsError: null,
  selectedCareRequest: null,
  selectedCareRequestLoading: false,
  applyingToCareRequest: false,
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

export const updateCarerStep2 = createAsyncThunk<
  CarerProfile,
  any,
  { rejectValue: string }
>("carer/updateStep2", async (payload, { rejectWithValue }) => {
  try {
    return await carerService.updateStep2(payload);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to update step 2 preferences");
  }
});

export const updateCarerStep3 = createAsyncThunk<
  CarerProfile,
  any,
  { rejectValue: string }
>("carer/updateStep3", async (payload, { rejectWithValue }) => {
  try {
    return await carerService.updateStep3(payload);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to update professional information");
  }
});

export const updateCarerStep10 = createAsyncThunk<
  CarerProfile,
  any,
  { rejectValue: string }
>("carer/updateStep10", async (payload, { rejectWithValue }) => {
  try {
    return await carerService.updateStep10(payload);
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to update declarations");
  }
});

export const submitCarerProfile = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("carer/submitProfile", async (_, { rejectWithValue }) => {
  try {
    return await carerService.submitProfile();
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to submit profile");
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

export const uploadCarerStepDocuments = createAsyncThunk<
  CarerDocument[],
  { step: number; files: Record<string, File>; textFields?: Record<string, string> },
  { rejectValue: string }
>("carer/uploadStepDocuments", async ({ step, files, textFields }, { rejectWithValue }) => {
  try {
    return await carerService.uploadStepDocuments(step, files, textFields);
  } catch (error: any) {
    return rejectWithValue(error?.message || `Failed to upload documents for step ${step}`);
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

// --- Placement Opportunities Thunks ---
export const fetchCarerCareRequests = createAsyncThunk<
  CarerCareRequest[],
  void,
  { rejectValue: string }
>("carer/fetchCareRequests", async (_, { rejectWithValue }) => {
  try {
    const data = await carerService.getCareRequests();
    
    // Safely extract the array whether it's wrapped in data, items, or returned directly
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object") {
      // Look for any property that is an array
      const arrayValue = Object.values(data).find(Array.isArray);
      if (arrayValue) return arrayValue as CarerCareRequest[];
    }
    
    return [];
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch placement opportunities");
  }
});

export const fetchCarerCareRequestById = createAsyncThunk<
  CarerCareRequestDetail,
  string,
  { rejectValue: string }
>("carer/fetchCareRequestById", async (id, { rejectWithValue }) => {
  try {
    return await carerService.getCareRequestById(id);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch placement details");
  }
});

export const applyToCarerCareRequest = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("carer/applyToCareRequest", async (careRequestId, { rejectWithValue }) => {
  try {
    return await carerService.applyToCareRequest(careRequestId);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to apply to placement");
  }
});

const carerSlice = createSlice({
  name: "carer",
  initialState,
  reducers: {
    clearCarerProfile(state) {
      state.profile = null;
      state.error = null;
    },
    clearSelectedCareRequest(state) {
      state.selectedCareRequest = null;
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

      .addCase(updateCarerStep2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCarerStep2.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(updateCarerStep2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update step 2";
      })

      .addCase(updateCarerStep3.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCarerStep3.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(updateCarerStep3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update step 3";
      })

      .addCase(updateCarerStep10.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCarerStep10.fulfilled,
        (state, action: PayloadAction<CarerProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(updateCarerStep10.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update declarations";
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

      .addCase(uploadCarerStepDocuments.pending, (state) => {
        state.batchUploading = true;
        state.error = null;
      })
      .addCase(
        uploadCarerStepDocuments.fulfilled,
        (state) => {
          state.batchUploading = false;
        },
      )
      .addCase(uploadCarerStepDocuments.rejected, (state, action) => {
        state.batchUploading = false;
        state.error = action.payload || "Failed to upload step documents";
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
      })

      // --- Placement Opportunities ---
      .addCase(fetchCarerCareRequests.pending, (state) => {
        state.careRequestsLoading = true;
        state.careRequestsError = null;
      })
      .addCase(fetchCarerCareRequests.fulfilled, (state, action: PayloadAction<CarerCareRequest[]>) => {
        state.careRequestsLoading = false;
        state.careRequests = action.payload;
      })
      .addCase(fetchCarerCareRequests.rejected, (state, action) => {
        state.careRequestsLoading = false;
        state.careRequestsError = action.payload || "Failed to fetch placement opportunities";
      })

      .addCase(fetchCarerCareRequestById.pending, (state) => {
        state.selectedCareRequestLoading = true;
      })
      .addCase(fetchCarerCareRequestById.fulfilled, (state, action: PayloadAction<CarerCareRequestDetail>) => {
        state.selectedCareRequestLoading = false;
        state.selectedCareRequest = action.payload;
      })
      .addCase(fetchCarerCareRequestById.rejected, (state, action) => {
        state.selectedCareRequestLoading = false;
      })

      .addCase(applyToCarerCareRequest.pending, (state) => {
        state.applyingToCareRequest = true;
      })
      .addCase(applyToCarerCareRequest.fulfilled, (state) => {
        state.applyingToCareRequest = false;
      })
      .addCase(applyToCarerCareRequest.rejected, (state) => {
        state.applyingToCareRequest = false;
      });
  },
});

export const { clearCarerProfile, clearSelectedCareRequest } = carerSlice.actions;

export default carerSlice.reducer;
