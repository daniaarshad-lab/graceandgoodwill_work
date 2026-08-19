import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { newsletterService, SubscribePayload } from "@/services/newsletter/newsletter.service";

interface NewsletterState {
  isSubscribing: boolean;
  error: string | null;
}

const initialState: NewsletterState = {
  isSubscribing: false,
  error: null,
};

export const subscribeToNewsletter = createAsyncThunk<
  any,
  SubscribePayload,
  { rejectValue: string }
>("newsletter/subscribe", async (payload, { rejectWithValue }) => {
  try {
    const response = await newsletterService.subscribe(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Subscription failed");
  }
});

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.isSubscribing = true;
        state.error = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.isSubscribing = false;
        state.error = null;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.isSubscribing = false;
        state.error = action.payload || "Subscription failed";
      });
  },
});

export const { clearNewsletterError } = newsletterSlice.actions;
export default newsletterSlice.reducer;
