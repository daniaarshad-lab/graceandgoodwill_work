"use client";

import { useState } from "react";
import Link from "next/link";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {
  validateForgotPasswordForm,
  ForgotPasswordFormErrors,
} from "@/lib/validation";
import { authService } from "@/services/auth/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FORGOT PASSWORD SUBMIT");
    setApiError(null);

    // Validate form
    const formErrors = validateForgotPasswordForm(email);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      console.log("Forgot password attempt:", { email });
      
      // Perform actual API call to forgot-password
      await authService.forgotPassword(email);
      
      setSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setApiError(error.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <CenteredLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email address."
      >
        <Card>
          <div className="space-y-4 text-center">
            <p className="text-sm text-gold-100/70">
              If an account exists for <strong>{email}</strong>, you will
              receive an email with instructions to reset your password.
            </p>
            <p className="text-sm text-gold-100/70">
              If you don&apos;t see the email, please check your spam folder.
            </p>
            <Link
              href="/login"
              className="block rounded-xl py-3 font-medium transition-all bg-gold text-navy-950 hover:opacity-90 text-center"
            >
              Back to Login
            </Link>
          </div>
        </Card>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
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

          <Button
            text={isLoading ? "Sending..." : "Send Reset Link"}
            disabled={isLoading}
          />

          <p className="text-center text-sm">
            Back to{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </Card>
    </CenteredLayout>
  );
}
