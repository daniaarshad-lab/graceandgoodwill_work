export interface AdminDashboardStats {
  totalUsers: number;
  totalCarers: number;
  totalClients: number;
  activePlacements: number;
  pendingVerifications: number;
}

export interface AdminState {
  stats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
}
