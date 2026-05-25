import { apiFetch } from "@/lib/api";

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role?: string;
  };
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  async getMe() {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
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
