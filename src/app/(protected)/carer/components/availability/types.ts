export interface LocalRange {
  id: string;
  start: string;
  end: string;
  colorIndex: number;
}

export type BookingType =
  | "BOOKED_PLACEMENT"
  | "BOOKED_ONGOING"
  | "LEAVE"
  | "RELIEF_COVER";

export interface CalendarBooking {
  dateStr: string;
  type: BookingType;
  title: string;
  clientName: string;
  placementId?: string;
  isOngoing?: boolean;
  status?: string;
  leaveReason?: string;
}

export interface ActivePlacementSummary {
  id: string;
  clientName: string;
  status: string;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  leavePeriods: Array<{
    startDate: string;
    endDate: string;
    reason?: string;
    status: string;
  }>;
}
