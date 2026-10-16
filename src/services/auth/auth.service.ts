import { apiFetch } from "@/lib/api";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from "@/types/auth.types";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const sanitizedPayload = {
      ...payload,
      email: payload.email.trim(),
    };
    const body = JSON.stringify(sanitizedPayload);
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body,
    });
    const token = data.accessToken || (data as any).token;
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const sanitizedPayload = {
      ...payload,
      email: payload.email.trim(),
    };
    const body = JSON.stringify(sanitizedPayload);
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body,
    });
    const token = data.accessToken || (data as any).token;
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }
    return data;
  },

  async logout(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("carer_onboarding_step");
    localStorage.removeItem("carer_onboarding_done");
    sessionStorage.removeItem("auth_redirect");
  },

  async getMe() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      return null;
    }
    try {
      return await apiFetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("carer_onboarding_step");
        localStorage.removeItem("carer_onboarding_done");
      }
      throw error;
    }
  },

  async forgotPassword(email: string) {
    return apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password?: string) {
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },
};
