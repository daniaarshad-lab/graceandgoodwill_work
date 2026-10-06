import { expandRange, toISODateString } from "./date.utils";
import {
  CalendarBooking,
  ActivePlacementSummary,
} from "../components/availability/types";

export interface PlacementBookingsHelper {
  getBookingForDate: (dateStr: string) => CalendarBooking | undefined;
  activePlacementsList: ActivePlacementSummary[];
  isDateBooked: (dateStr: string) => boolean;
}

const ACTIVE_STATUSES = new Set([
  "PLACEMENT_CONFIRMED",
  "PLACEMENT_STARTED",
  "ONGOING",
  "ACTIVE",
]);

const ACTIVE_LEAVE_STATUSES = new Set([
  "COVER_CONFIRMED",
  "PENDING_RELIEF",
  "NO_COVER_NEEDED",
]);

function toCleanIso(val: string | Date | undefined | null): string | null {
  if (!val) return null;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return toISODateString(d);
  } catch {
    return null;
  }
}

export function getPlacementBookings(
  placements: any[] | undefined | null,
): PlacementBookingsHelper {
  const fixedBookingsMap = new Map<string, CalendarBooking>();
  const leaveMap = new Map<string, CalendarBooking>();
  const ongoingPlacements: Array<{
    id: string;
    startDate: string;
    clientName: string;
    status: string;
  }> = [];
  const activePlacementsList: ActivePlacementSummary[] = [];

  if (!Array.isArray(placements) || placements.length === 0) {
    return {
      getBookingForDate: () => undefined,
      activePlacementsList: [],
      isDateBooked: () => false,
    };
  }

  for (const p of placements) {
    if (!p) continue;
    const status = String(p.status || "").toUpperCase();
    if (!ACTIVE_STATUSES.has(status)) continue;

    const startDate = toCleanIso(p.startDate);
    if (!startDate) continue;

    const clientUser = p.clientProfile?.user;
    const clientName = clientUser
      ? `${clientUser.firstName || ""} ${clientUser.lastName || ""}`.trim() ||
        "Client"
      : "Client";

    const isOngoing =
      !p.endDate ||
      p.careRequest?.isOngoing === true ||
      p.careRequest?.durationCategory === "PERMANENT";
    const endDate = isOngoing ? null : toCleanIso(p.endDate);

    const leavePeriods: Array<{
      startDate: string;
      endDate: string;
      reason?: string;
      status: string;
    }> = [];

    // Process Leave Requests (Hole Punching)
    if (Array.isArray(p.leaveRequests)) {
      for (const lr of p.leaveRequests) {
        const lrStatus = String(lr.status || "").toUpperCase();
        if (!ACTIVE_LEAVE_STATUSES.has(lrStatus)) continue;

        const lrStart = toCleanIso(lr.startDate);
        const lrEnd = toCleanIso(lr.endDate);
        if (!lrStart || !lrEnd) continue;

        leavePeriods.push({
          startDate: lrStart,
          endDate: lrEnd,
          reason: lr.reason || undefined,
          status: lr.status,
        });

        const leaveDays = expandRange(lrStart, lrEnd);
        for (const day of leaveDays) {
          leaveMap.set(day, {
            dateStr: day,
            type: "LEAVE",
            title: `Approved Leave (${lr.status === "COVER_CONFIRMED" ? "Cover Confirmed" : "Time Off"})`,
            clientName,
            placementId: p.id,
            status: lr.status,
            leaveReason: lr.reason || "Time Off",
          });
        }
      }
    }

    // Process Primary Placement
    if (isOngoing) {
      ongoingPlacements.push({
        id: p.id,
        startDate,
        clientName,
        status: p.status,
      });
    } else if (endDate) {
      const placementDays = expandRange(startDate, endDate);
      for (const day of placementDays) {
        // Leave takes precedence (hole punched)
        if (!leaveMap.has(day)) {
          fixedBookingsMap.set(day, {
            dateStr: day,
            type: "BOOKED_PLACEMENT",
            title: `Placement with ${clientName}`,
            clientName,
            placementId: p.id,
            isOngoing: false,
            status: p.status,
          });
        }
      }
    }

    // Process Relief Assignments (if carer is covering for someone else)
    if (Array.isArray(p.assignments)) {
      for (const asg of p.assignments) {
        const asgStatus = String(asg.status || "").toUpperCase();
        if (asgStatus === "CONFIRMED" || asgStatus === "IN_PROGRESS") {
          const asgStart = toCleanIso(asg.startDate);
          const asgEnd = toCleanIso(asg.endDate);
          if (asgStart && asgEnd) {
            const asgDays = expandRange(asgStart, asgEnd);
            for (const day of asgDays) {
              if (!leaveMap.has(day)) {
                fixedBookingsMap.set(day, {
                  dateStr: day,
                  type: "RELIEF_COVER",
                  title: `Relief Cover with ${clientName}`,
                  clientName,
                  placementId: p.id,
                  isOngoing: false,
                  status: asg.status,
                });
              }
            }
          }
        }
      }
    }

    activePlacementsList.push({
      id: p.id,
      clientName,
      status: p.status,
      startDate,
      endDate,
      isOngoing,
      leavePeriods,
    });
  }

  const getBookingForDate = (dateStr: string): CalendarBooking | undefined => {
    // 1. Check if on approved leave
    if (leaveMap.has(dateStr)) {
      return leaveMap.get(dateStr);
    }

    // 2. Check if in fixed placement or relief cover
    if (fixedBookingsMap.has(dateStr)) {
      return fixedBookingsMap.get(dateStr);
    }

    // 3. Check if in ongoing placement (from startDate onward)
    for (const ongoing of ongoingPlacements) {
      if (dateStr >= ongoing.startDate) {
        return {
          dateStr,
          type: "BOOKED_ONGOING",
          title: `Ongoing Care with ${ongoing.clientName}`,
          clientName: ongoing.clientName,
          placementId: ongoing.id,
          isOngoing: true,
          status: ongoing.status,
        };
      }
    }

    return undefined;
  };

  const isDateBooked = (dateStr: string): boolean => {
    return getBookingForDate(dateStr) !== undefined;
  };

  return {
    getBookingForDate,
    activePlacementsList,
    isDateBooked,
  };
}
