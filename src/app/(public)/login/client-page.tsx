"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import ThinSpinner from "@/components/ThinSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { AUTH_ROUTES, parseRole } from "@/lib/auth-routes";

/**
 * useSearchParams needs a Suspense boundary during prerender.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center bg-navy-950 text-gold-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm tracking-wider text-gold-200">Loading...</p>
      </div>
    </div>
  );
}

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    login,
    logout,
    isAuthenticated,
    user,
    isLoading: authLoading,
  } = useAuth();

  const searchParams = useSearchParams();
  const currentRole = parseRole(searchParams.get("role") ?? undefined);
  const isCarer = currentRole === "carer";
  const isAdmin = currentRole === "admin";

  // Clear the "logging out" marker set by logout so protected routes work again.
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_logging_out");
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user?.role) {
      const role = user.role.toUpperCase();

      const roleMatchesPortal =
        currentRole === "admin"
          ? role === "ADMIN" || role === "SUPER_ADMIN"
          : role === currentRole.toUpperCase();

      // Existing session belongs to a different portal: clear it and show
      // the login form for the role requested in the URL.
      if (!roleMatchesPortal) {
        sessionStorage.removeItem("auth_redirect");
        logout();
        return;
      }

      const redirectParam = searchParams.get("redirect");
      const storedRedirect =
        typeof window !== "undefined"
          ? sessionStorage.getItem("auth_redirect")
          : null;
      const targetDestination = redirectParam || storedRedirect;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_redirect");
      }

      if (
        targetDestination &&
        targetDestination.startsWith("/") &&
        !targetDestination.startsWith("/login")
      ) {
        // Only follow the redirect if it matches the user's portal access
        const isTargetValid =
          ((role === "ADMIN" || role === "SUPER_ADMIN") && targetDestination.startsWith("/admin")) ||
          (role === "CARER" && targetDestination.startsWith("/carer")) ||
          (role === "CLIENT" && targetDestination.startsWith("/client"));

        if (isTargetValid) {
          router.push(targetDestination);
          return;
        }
      }

      if (role === "CLIENT") {
        router.push("/client");
      } else if (role === "CARER") {
        router.push("/carer");
      } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router, searchParams, currentRole, authLoading, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateLoginForm(email, password);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // Always start from a clean session; backend validates role.
      await logout();
      await login({
        email,
        password,
        role: currentRole.toUpperCase(),
      });
      showSuccessToast("Login Successful", "Welcome back to Grace & Goodwill.");
    } catch (error: any) {
      console.error(error);
      showErrorToast(
        "Login Failed",
        error.message || "Invalid email or password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent form render while checking auth or redirecting
  if (authLoading || isAuthenticated) {
    return <ThinSpinner fullScreen text="Redirecting..." size="xl" />;
  }

  const pageTitle = isAdmin
    ? "Login as Admin"
    : isCarer
      ? "Login as a Carer"
      : "Login as a Client";

  const pageSubtitle = isAdmin
    ? "Login to your admin account to manage operations and placements."
    : isCarer
      ? "Login to your carer account to manage onboarding and placements."
      : "Login to continue accessing your care platform.";

  return (
    <AuthSplitLayout title={pageTitle} subtitle={pageSubtitle}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="body-small text-gold-muted hover:text-[#b8915e] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          text={isLoading ? "Logging in..." : "Login"}
          disabled={isLoading}
        />

        {!isAdmin && (
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={
                isCarer
                  ? AUTH_ROUTES.register.carer
                  : AUTH_ROUTES.register.client
              }
              className="text-gold-muted font-medium hover:text-[#b8915e] hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </form>

      <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <img src="/website_logo.png" alt="Logo" className="h-16 w-auto mb-2" />
      </div>
    </AuthSplitLayout>
  );
}
