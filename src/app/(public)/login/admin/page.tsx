import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth-routes";

/**
 * Legacy admin login URL. The single source of truth is /login?role=admin.
 */
export default function LegacyAdminLoginRedirect() {
  redirect(AUTH_ROUTES.login.admin);
}
