"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {
  validateForgotPasswordForm,
  ForgotPasswordFormErrors,
} from "@/lib/validation";
import { authService } from "@/services/auth/auth.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForgotPasswordForm(email);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      // Perform actual API call to forgot-password
      await authService.forgotPassword(email);

      showSuccessToast(
        "Reset Link Sent",
        "If an account exists, you will receive an email with instructions to reset your password."
      );
      setEmail("");
    } catch (error: any) {
      const errorMsg = typeof error === 'string' ? error : error?.message || "Failed to send reset link.";
      showErrorToast("Error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
  );
}
