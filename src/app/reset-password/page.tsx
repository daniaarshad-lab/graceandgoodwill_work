"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {
  validateResetPasswordForm,
  ResetPasswordFormErrors,
} from "@/lib/validation";
import { authService } from "@/services/auth/auth.service";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("RESET PASSWORD SUBMIT");
    setApiError(null);

    if (!token) {
      setApiError(
        "Invalid password reset session. Missing token. Please request a new link.",
      );
      return;
    }

    // Validate form
    const formErrors = validateResetPasswordForm(newPassword, confirmPassword);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      console.log("Reset password attempt...");

      // Perform actual API call to reset password
      await authService.resetPassword(token, newPassword);

      setSubmitted(true);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setApiError(
        error.message ||
          "Your password reset link is invalid or has expired. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthSplitLayout
        title="Password Reset"
        subtitle="Your password has been successfully reset."
      >
        <div className="space-y-4 text-center">
          <p className="text-sm text-gold-100/70">
            You can now login with your new password.
          </p>
          <Link
            href="/login"
            className="block rounded-xl py-3 font-medium transition-all bg-gold-muted text-navy-950 hover:bg-[#b8915e] text-center"
          >
            Go to Login
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title="Reset Password"
      subtitle="Create a new secure password."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {apiError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {apiError}
          </div>
        )}

        {!token && (
          <div className="rounded-xl border border-gold-muted/25 bg-gold-muted/8 p-3 body-small text-gold-muted space-y-2">
            <p>
              Warning: No password reset token found in your browser URL query
              parameters.
            </p>
            <Link
              href="/forgot-password"
              className="block text-xs font-semibold underline hover:opacity-85"
            >
              Request new password reset link
            </Link>
          </div>
        )}

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button
          text={isLoading ? "Updating..." : "Update Password"}
          disabled={isLoading || !token}
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
    </AuthSplitLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthSplitLayout
          title="Loading Session..."
          subtitle="Please wait while we set up password reset form."
        >
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-muted"></div>
          </div>
        </AuthSplitLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
