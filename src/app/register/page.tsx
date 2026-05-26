"use client";

import { useState } from "react";
import Link from "next/link";

import CenteredLayout from "@/components/CenteredLayout";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateRegisterForm, RegisterFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
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
      console.log("Register attempt with payload:", { firstName, lastName, email, phone, password });
      
      // Attempt registration using useAuth register wrapper
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Register error:", error);
      setApiError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <CenteredLayout
        title="Account Created"
        subtitle="Your care management account is ready."
      >
        <Card className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
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
            <h3 className="text-xl font-semibold text-gold-200">Registration Successful!</h3>
            <p className="text-sm text-gold-100/70">
              Welcome to Grace & Goodwill. You have successfully created your account.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-navy-950 shadow-elegant transition hover:opacity-90 hover:translate-y-[-2px]"
          >
            Go to Login
          </Link>
        </Card>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout
      title="Create Account"
      subtitle="Register to access the care management platform."
    >
      <Card>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {apiError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              {apiError}
            </div>
          )}

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

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            text={isLoading ? "Creating Account..." : "Create Account"}
            disabled={isLoading}
          />

          <p className="text-center text-sm">
            Already have an account?{" "}
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
