"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  ReactNode,
} from "react";
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
} from "@/store/slices/authSlice";

import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);
  const {
    user,
    isAuthenticated,
    loading: isLoading,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        setIsInitializing(false);
        return;
      }
      try {
        await dispatch(getProfile()).unwrap();
      } catch (e) {
        console.error("Hydration getProfile failed:", e);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  const combinedLoading = isLoading || isInitializing;

  const login = useCallback(
    async (payload: LoginPayload) => {
      const resultAction = await dispatch(loginThunk(payload));
      if (loginThunk.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error((resultAction.payload as string) || "Login failed");
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const resultAction = await dispatch(registerThunk(payload));
      if (registerThunk.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || "Registration failed",
        );
      }
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  const hasRole = useCallback(
    (allowedRoles: string[]) => {
      if (!user || !user.role) return false;
      return allowedRoles
        .map((r) => r.toLowerCase())
        .includes(user.role.toLowerCase());
    },
    [user],
  );

  const refreshUser = useCallback(async () => {
    await dispatch(getProfile());
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: combinedLoading,
      login,
      register,
      logout,
      hasRole,
      refreshUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isAuthenticated, login, register, logout, hasRole, refreshUser],
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
