import { CareRequest } from "../types/client-ui.types";

export const defaultCareRequests = (userFullName: string): CareRequest[] => [
  {
    id: "REQ-001",
    fullName: userFullName,
    careType: "24/7 Live-in Companion Support",
    startDate: "2026-06-01",
    duration: "3 Months",
    status: "Reviewing",
    progress: 45,
  },
  {
    id: "REQ-002",
    fullName: userFullName,
    careType: "Post-Operative Rehabilitation",
    startDate: "2026-05-28",
    duration: "2 Weeks",
    status: "Matched",
    progress: 75,
  },
  {
    id: "REQ-003",
    fullName: userFullName,
    careType: "Elderly Dementia Support",
    startDate: "2026-05-15",
    duration: "Ongoing",
    status: "Completed",
    progress: 100,
  },
];
