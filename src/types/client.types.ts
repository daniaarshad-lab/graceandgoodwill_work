export interface ClientProfile {
  id: string;
  userId: string;
  address?: string;
  careRequirements?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  status: "active" | "inactive";
}

export interface ClientState {
  profile: ClientProfile | null;
  loading: boolean;
  error: string | null;
}
