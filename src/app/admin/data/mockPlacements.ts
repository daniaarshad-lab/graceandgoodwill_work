import { Placement } from "../types/admin.types";

export const mockPlacements: Placement[] = [
  {
    id: "place-1",
    clientId: "req-5",
    clientName: "Winston Churchill",
    carerId: "carer-5",
    carerName: "Helena Rostova",
    careType: "24/7 Live-in Support",
    location: "London",
    urgency: "High",
    status: "Active",
    contactDetailsReleased: true,
    startDate: "2026-05-29",
    timeline: [
      {
        title: "Match Created",
        timestamp: "2026-05-25 10:00",
        description: "Admin assigned Helena Rostova to Winston Churchill.",
      },
      {
        title: "Contacts Approved & Released",
        timestamp: "2026-05-25 14:30",
        description: "Admin approved contact detail sharing.",
      },
      {
        title: "Care Activated",
        timestamp: "2026-05-29 08:00",
        description: "First home care check-in completed by Helena.",
      },
    ],
  },
  {
    id: "place-2",
    clientId: "req-1",
    clientName: "Arthur Pendelton",
    carerId: "carer-1",
    carerName: "Eleanor Vance",
    careType: "Live-in Care",
    location: "London",
    urgency: "High",
    status: "Matched",
    contactDetailsReleased: false,
    startDate: "2026-06-01",
    timeline: [
      {
        title: "Match Created",
        timestamp: "2026-05-26 12:00",
        description: "Admin suggested Eleanor Vance for Arthur Pendelton.",
      },
      {
        title: "Awaiting Contact Release",
        timestamp: "2026-05-26 12:05",
        description:
          "Placement pending admin approval for contact detail release.",
      },
    ],
  },
];
