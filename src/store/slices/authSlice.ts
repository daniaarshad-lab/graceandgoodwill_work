import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth/auth.service";
import {
  User,
  AuthState,
  AuthResponse,
  RegisterPayload,
  LoginPayload,
} from "@/types/auth.types";

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.login(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Login failed");
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.register(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Registration failed");
  }
});

export const getProfile = createAsyncThunk<
  User,
  { skipGlobalToast?: boolean } | void,
  { rejectValue: string }
>("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const userData = await authService.getMe();
    if (!userData) {
      return rejectWithValue("No user session found");
    }
    return userData.user || userData;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch profile");
  }
});

export const forgotPassword = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Forgot password request failed");
  }
});

export const resetPassword = createAsyncThunk<
  any,
  { token: string; password?: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(token, password);
  } catch (error: any) {
    return rejectWithValue(error?.message || "Reset password failed");
  }
});

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadPersistedAuth(state) {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("accessToken");
          const userStr = localStorage.getItem("user");
          if (token) {
            state.token = token;
            state.isAuthenticated = true;
            if (userStr) {
              const user = JSON.parse(userStr);
              state.user = user;
              state.role = user.role || null;
            }
          }
        } catch (e) {
          console.error("[authSlice] Failed to load persisted auth", e);
        }
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        const user = action.payload.user || (action.payload as any);
        state.user = user;
        state.role = user?.role || null;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", action.payload.accessToken);

          localStorage.setItem("refreshToken", action.payload.refreshToken);

          localStorage.setItem("user", JSON.stringify(user));
        }
      },
    );
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
    });

    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        const user = action.payload.user || (action.payload as any);
        state.user = user;
        state.role = user?.role || null;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", action.payload.accessToken);
          localStorage.setItem("refreshToken", action.payload.refreshToken);
          localStorage.setItem("user", JSON.stringify(user));
        }
      },
    );
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration failed";
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
    });

    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getProfile.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.role = action.payload.role || null;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      },
    );
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      if (action.payload !== "No user session found") {
        state.error = action.payload || "Failed to load profile";
      }
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    });
  },
});

export const { loadPersistedAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
