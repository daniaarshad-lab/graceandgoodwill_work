export interface AdminDashboardStats {
  totalUsers: number;
  totalCarers: number;
  totalClients: number;
  activePlacements: number;
  pendingVerifications: number;
}

export interface PaginationData<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  status: string;
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  stats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
  carers: PaginationData<any>;
  careRequests: PaginationData<any>;
  clients: PaginationData<any>;
  selectedCarer: {
    data: any | null;
    loading: boolean;
    error: string | null;
  };
}
