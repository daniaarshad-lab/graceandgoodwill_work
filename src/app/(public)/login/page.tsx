"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { AUTH_ROUTES, parseRole } from "@/lib/auth-routes";

/**
 * useSearchParams needs a Suspense boundary during prerender — same pattern as
 * src/app/(protected)/admin/page.tsx.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

/**
 * Reading search params opts this page out of prerendering, so the static HTML
 * is the fallback. It must not be `null`, or the page is blank until JS loads —
 * this matches the spinner the page already shows while auth is resolving.
 */
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
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();

  /* Framing only. Authentication is role-agnostic: the account's own role
     decides where the redirect below sends the user, exactly as before. */
  const searchParams = useSearchParams();
  const isCarer = parseRole(searchParams.get("role") ?? undefined) === "carer";

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const role = user.role.toUpperCase();
      if (role === "CLIENT") {
        router.push("/client");
      } else if (role === "CARER") {
        router.push("/carer");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

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
      await login({
        email,
        password,
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-950 text-gold-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT"></div>
          <p className="text-sm tracking-wider text-gold-200">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthSplitLayout
      title={isCarer ? "Carer Login" : "Welcome Back"}
      subtitle={
        isCarer
          ? "Login to your carer account to manage onboarding and placements."
          : "Login to continue accessing your care platform."
      }
    >
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

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            /* Keep the journey: a carer on the carer login goes to carer signup. */
            href={
              isCarer ? AUTH_ROUTES.register.carer : AUTH_ROUTES.register.client
            }
            className="text-gold-muted font-medium hover:text-[#b8915e] hover:underline"
          >
            Register
          </Link>
        </p>
      </form>

      <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <img src="/website_logo.png" alt="Logo" className="h-16 w-auto mb-2" />
      </div>
    </AuthSplitLayout>
  );
}
