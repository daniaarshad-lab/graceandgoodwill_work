"use client";

import { useState } from "react";
import Link from "next/link";

import AuthSplitLayout from "@/components/AuthSplitLayout";
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
      setApiError(
        error.message ||
          "Something went wrong. Please check your network and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthSplitLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email address."
      >
        <div className="space-y-4 text-center">
          <p className="text-sm text-gold-100/70">
            If an account exists for <strong>{email}</strong>, you will receive
            an email with instructions to reset your password.
          </p>
          <p className="text-sm text-gold-100/70">
            If you don&apos;t see the email, please check your spam folder.
          </p>
          <Link
            href="/login"
            className="block rounded-xl py-3 font-medium transition-all bg-gold-muted text-navy-950 hover:bg-[#b8915e] text-center"
          >
            Back to Login
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
    >
      <form className="space-y-5 " onSubmit={handleSubmit}>
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
          type="submit"
          text={isLoading ? "Sending..." : "Send Reset Link"}
          disabled={isLoading}
        />

        <p className="text-center text-sm">
          Back to{" "}
          <Link
            href="/login"
            className="text-gold-muted font-medium hover:text-[#b8915e] hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
       <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <img
          src="/website_logo.png"
          alt="Logo"
          className="h-16 w-auto mb-2"
        />

        <div className="flex items-center w-full justify-center mt-2">
          <div className="h-px w-4 sm:w-11 bg-gradient-to-r from-transparent to-[#b8915e]/60" />

          <p
            className="mx-2 text-base font-medium  text-gold-muted tracking-wide"
            style={{ letterSpacing: "-0.01em" }}
          >
            Care Defined By Integrity
          </p>

          <div className="h-px w-4 sm:w-11 bg-gradient-to-l from-transparent to-[#b8915e]/60" />
        </div>
      </div>
    </AuthSplitLayout>
  );
}
