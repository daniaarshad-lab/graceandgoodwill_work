"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  User,
} from "@/types/auth.types";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  login as loginThunk,
  register as registerThunk,
  getProfile,
  logout as logoutThunk,
  loadPersistedAuth,
} from "@/store/slices/authSlice";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  hasRole: (allowedRoles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    loading: isLoading,
  } = useAppSelector((state) => state.auth);

  // Initialize and validate session on mount
  useEffect(() => {
    dispatch(loadPersistedAuth());
    dispatch(getProfile());
  }, [dispatch]);

  const login = async (payload: LoginPayload) => {
    const resultAction = await dispatch(loginThunk(payload));
    if (loginThunk.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error((resultAction.payload as string) || "Login failed");
    }
  };

  const register = async (payload: RegisterPayload) => {
    const resultAction = await dispatch(registerThunk(payload));
    if (registerThunk.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(
        (resultAction.payload as string) || "Registration failed",
      );
    }
  };

  const logout = async () => {
    await dispatch(logoutThunk());
  };

  const hasRole = (allowedRoles: string[]) => {
    if (!user || !user.role) return false;
    return allowedRoles
      .map((r) => r.toLowerCase())
      .includes(user.role.toLowerCase());
  };

  const refreshUser = async () => {
    await dispatch(getProfile());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
