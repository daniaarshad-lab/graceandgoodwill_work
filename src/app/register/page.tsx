"use client";

import { useState } from "react";
import Link from "next/link";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import PhoneInput from "@/components/PhoneInput";
import { validateRegisterForm, RegisterFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState<"CLIENT" | "CARER" | string>("CLIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("REGISTER SUBMIT");
    setApiError(null);

    // Validate form
    const formErrors = validateRegisterForm(
      firstName,
      lastName,
      email,
      phone,
      password,
    );
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsLoading(true);

    try {
      console.log("Register attempt with payload:", {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      // Attempt registration using useAuth register wrapper
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Register error:", error);
      const err = error as { message?: string };
      setApiError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthSplitLayout
        title="Account Created"
        subtitle="Your care management account is ready."
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-muted/10 text-gold-muted">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gold-muted">
              Registration Successful!
            </h3>
            <p className="body-small text-gold-muted/50">
              Welcome to Grace &amp; Goodwill. You have successfully created
              your account.
            </p>
          </div>

          <Button asChild className="hover:text-[#0a1128]">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      title="Create Account"
      subtitle="Register to access the care management platform."
    >
      <form className="space-y-5 pb-16" onSubmit={handleSubmit}>
        {apiError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {apiError}
          </div>
        )}

        {/* Premium Segmented Role Selection */}
        <div className="space-y-2">
          <label className="form-label text-gold-muted/80">
            I want to register as a:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-navy-950/60 border border-gold-muted/20 backdrop-blur-sm">
            <Button
              type="button"
              onClick={() => setRole("CLIENT")}
              variant="selectable"
              isSelected={role === "CLIENT"}
              size="sm"
              fullWidth
              className="py-2.5 rounded-lg font-semibold"
            >
              Family / Client
            </Button>
            <Button
              type="button"
              onClick={() => setRole("CARER")}
              variant="selectable"
              isSelected={role === "CARER"}
              size="sm"
              fullWidth
              className="py-2.5 rounded-lg font-semibold"
            >
              Professional Carer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PhoneInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button
          type="submit"
          text={isLoading ? "Creating Account..." : "Create Account"}
          disabled={isLoading}
        />

        <p className="text-center text-sm">
          Already have an account?{" "}
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
