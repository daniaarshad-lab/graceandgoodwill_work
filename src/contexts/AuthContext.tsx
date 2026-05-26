"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, RegisterPayload, LoginPayload, AuthResponse } from "@/services/auth/auth.service";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: string;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and validate session on mount
  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
          const userData = await authService.getMe();
          if (userData && userData.user) {
            setUser(userData.user);
          } else if (userData) {
            // Support direct user shape returning from API
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Tokens are already wiped by authService.getMe() catch block, so just set user to null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      if (response && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      if (response && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (allowedRoles: string[]) => {
    if (!user || !user.role) return false;
    return allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase());
  };

  const refreshUser = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token) {
        const userData = await authService.getMe();
        if (userData && userData.user) {
          setUser(userData.user);
        } else if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user context:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
