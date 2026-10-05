/**
 * Single source of truth for public Client, Carer, and Admin entry points.
 */

export type PublicRole = "client" | "carer" | "admin";

export const AUTH_ROUTES = {
  login: {
    client: "/login?role=client",
    carer: "/login?role=carer",
    admin: "/login?role=admin",
  },
  register: {
    client: "/register?role=client",
    carer: "/register?role=carer",
  },
  carerRecruitment: "/join-as-carer",
} as const;

/** Normalises an untrusted `?role=` value. Defaults to client. */
export function parseRole(value: string | undefined): PublicRole {
  const norm = value?.toLowerCase();
  if (norm === "carer") return "carer";
  if (norm === "admin") return "admin";
  return "client";
}

export const RECRUITMENT_EMAIL = "admin@graceandgoodwill.co.uk";
