"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const trimmedEmail = email.trim();

      const response = await login({
        email: trimmedEmail,
        password,
      });

      const role = response.user?.role?.toUpperCase();

      let route = "/unauthorized";
      if (role === "ADMIN") {
        route = "/admin";
      } else if (role === "CARER") {
        route = "/carer";
      } else if (role === "CLIENT") {
        route = "/client";
      }

      showSuccessToast("Login Successful", "Welcome back to Grace & Goodwill.");

      router.push(route);
    } catch (error: any) {
      const errorMsg =
        typeof error === "string" ? error : error?.message || "Login failed.";
      showErrorToast("Login Failed", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="off"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
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
          href="/register"
          className="text-gold-muted font-medium hover:text-[#b8915e] hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
