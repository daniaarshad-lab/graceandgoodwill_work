import { WeeklyAvailability } from "../types/carer.types";

export const defaultAvailability: WeeklyAvailability = {
  Monday: {
    enabled: true,
    shifts: { morning: true, afternoon: true, night: false },
  },
  Tuesday: {
    enabled: true,
    shifts: { morning: true, afternoon: false, night: false },
  },
  Wednesday: {
    enabled: true,
    shifts: { morning: true, afternoon: true, night: true },
  },
  Thursday: {
    enabled: false,
    shifts: { morning: false, afternoon: false, night: false },
  },
  Friday: {
    enabled: true,
    shifts: { morning: false, afternoon: true, night: true },
  },
  Saturday: {
    enabled: false,
    shifts: { morning: false, afternoon: false, night: false },
  },
  Sunday: {
    enabled: false,
    shifts: { morning: false, afternoon: false, night: false },
  },
};
