import { ClientRequest } from "../types/admin.types";

export const mockClientRequests: ClientRequest[] = [
  {
    id: "req-1",
    clientName: "Arthur Pendelton",
    careType: "Live-in Care",
    location: "London",
    urgency: "High",
    startDate: "2026-06-01",
    notes:
      "Requires full-time support following hip replacement surgery. Dementia specialty preferred.",
    status: "Unmatched",
    email: "a.pendelton@gmail.com",
    phone: "+44 7700 910901",
  },
  {
    id: "req-2",
    clientName: "Margaret Thatcher (Family)",
    careType: "Hourly Care (4h/day)",
    location: "Manchester",
    urgency: "Standard",
    startDate: "2026-06-05",
    notes:
      "Assistance with meal prep and light housekeeping. Prefers companionship.",
    status: "Unmatched",
    email: "thatcher.family@yahoo.com",
    phone: "+44 7700 910344",
  },
  {
    id: "req-3",
    clientName: "Jonathan Harker",
    careType: "Overnight Care",
    location: "London",
    urgency: "Emergency",
    startDate: "2026-05-27",
    notes:
      "URGENT: Patient returning from hospital tonight. Requires overnight monitoring and medication admin.",
    status: "Emergency",
    email: "harker.j@harker-solicitors.co.uk",
    phone: "+44 7700 910112",
  },
  {
    id: "req-4",
    clientName: "Penelope Featherington",
    careType: "Weekly Check-ins",
    location: "Bath",
    urgency: "Standard",
    startDate: "2026-06-10",
    notes:
      "Weekly social visits and grocery shopping support. Mobility support needed.",
    status: "Unmatched",
    email: "p.featherington@whistledown.com",
    phone: "+44 7700 910887",
  },
  {
    id: "req-5",
    clientName: "Winston Churchill",
    careType: "24/7 Live-in Support",
    location: "London",
    urgency: "High",
    startDate: "2026-05-29",
    notes:
      "Post-stroke physical therapy support. Carer must have stroke recovery experience.",
    status: "Matched",
    email: "w.churchill@downingstreet.gov.uk",
    phone: "+44 7700 910777",
  },
];
