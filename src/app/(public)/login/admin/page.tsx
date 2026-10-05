"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, logout, isAuthenticated, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const role = user.role.toUpperCase();
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if (role === "CLIENT") {
        router.push("/client");
      } else if (role === "CARER") {
        router.push("/carer");
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
      // Clear any stale auth session before logging in
      await logout();

      await login({
        email,
        password,
        role: "ADMIN",
      });
      showSuccessToast("Login Successful", "Welcome to the Admin Portal.");
    } catch (error: any) {
      console.error(error);
      showErrorToast(
        "Login Failed",
        error.message || "Invalid email, password, or permissions. Please try again.",
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
      title="Login as Admin"
      subtitle="Login to your admin account to manage operations and placements."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your admin email"
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
      </form>

      <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <img src="/website_logo.png" alt="Logo" className="h-16 w-auto mb-2" />
      </div>
    </AuthSplitLayout>
  );
}
