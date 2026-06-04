import { CareRequest, Enquiry } from "../types/client.types";

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

export const defaultEnquiries: Enquiry[] = [
  {
    id: "ENQ-901",
    subject: "Insurance Coverage Options",
    message:
      "Hello, I would like to check if our private medical insurance covers live-in companion care services.",
    preference: "Email",
    date: "2026-05-24",
    status: "Responded",
  },
  {
    id: "ENQ-902",
    subject: "Dementia Care Certification Details",
    message:
      "Could you please send over details regarding the certifications and training your dementia carers undergo?",
    preference: "Phone Call",
    date: "2026-05-25",
    status: "Received",
  },
];
