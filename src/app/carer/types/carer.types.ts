export interface ComplianceDoc {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "verified" | "pending" | "failed";
  size: string;
  previewUrl?: string;
}

export interface DayAvailability {
  enabled: boolean;
  shifts: {
    morning: boolean; // 8:00 AM - 12:00 PM
    afternoon: boolean; // 12:00 PM - 5:00 PM
    night: boolean; // 5:00 PM - 10:00 PM
  };
}

export interface WeeklyAvailability {
  [key: string]: DayAvailability;
}
