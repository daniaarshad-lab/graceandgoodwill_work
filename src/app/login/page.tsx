"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import { authService } from "@/services/auth/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LOGIN SUBMIT");
    setApiError(null);

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
      console.log("Login attempt:", { email });
      
      const response = await authService.login({
        email,
        password,
      });

      console.log("LOGIN SUCCESS", response);

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredLayout
      title="Welcome Back"
      subtitle="Login to continue managing care services."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {apiError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              {apiError}
            </div>
          )}

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
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            text={isLoading ? "Logging in..." : "Login"}
            disabled={isLoading}
          />

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </Card>
    </CenteredLayout>
  );
}
