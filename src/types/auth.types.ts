export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: string;
  status?: string;
}

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
