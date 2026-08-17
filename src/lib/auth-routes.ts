/**
 * Single source of truth for the public Client vs Carer entry points.
 *
 * Login is role-agnostic by design: /login authenticates against one endpoint
 * and redirects using the role stored on the account (see login/page.tsx). The
 * `role` query param below therefore only frames the page — it never changes
 * authentication behaviour. Registration is different: `role` pre-selects the
 * account type, which is what stops a carer creating a client account.
 */

export type PublicRole = "client" | "carer";

export const AUTH_ROUTES = {
  login: {
    client: "/login?role=client",
    carer: "/login?role=carer",
  },
  register: {
    client: "/register?role=client",
    carer: "/register?role=carer",
  },
  carerRecruitment: "/join-as-carer",
} as const;

/** Normalises an untrusted `?role=` value. Defaults to client. */
export function parseRole(value: string | undefined): PublicRole {
  return value?.toLowerCase() === "carer" ? "carer" : "client";
}

export const RECRUITMENT_EMAIL = "admin@graceandgoodwill.co.uk";
