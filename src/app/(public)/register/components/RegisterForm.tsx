"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import PhoneInput from "@/components/PhoneInput";
import { validateRegisterForm, RegisterFormErrors } from "@/lib/validation";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

type RegisterRole = "CLIENT" | "CARER";

interface RegisterFormProps {
  /**
   * Which account type the form opens on. Driven by ?role= on the register
   * page so "Register as a Carer" lands on the carer option rather than
   * defaulting to client — the cause of carers registering as clients.
   */
  initialRole?: RegisterRole;
}

export default function RegisterForm({
  initialRole = "CLIENT",
}: RegisterFormProps) {
  const { register, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RegisterRole>(initialRole);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      password,
      role: selectedRole,
    };

    // Clear any stale auth session before registering
    await logout();

    try {
      // Attempt registration using useAuth register wrapper
      await register(payload);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      /* Reset to whichever journey the user entered through, not hard-coded
         CLIENT — otherwise a failed-then-retried carer signup silently flips. */
      setSelectedRole(initialRole);
      setErrors({});

      showSuccessToast(
        "Registration Successful!",
        "Welcome to Grace & Goodwill. You have successfully created your account.",
      );
      if (selectedRole === "CARER") {
        router.push("/carer?onboarding=true");
      } else {
        router.push("/agreements?onboarding=true");
      }
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Registration failed.";
      showErrorToast("Registration Failed", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5 pb-16" onSubmit={handleSubmit}>
      {/* Premium Segmented Role Selection */}
      <div className="space-y-2">
        <label className="form-label text-gold-muted/80">
          I want to register as a:
        </label>
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-navy-950/60 border border-gold-muted/20 backdrop-blur-sm">
          <Button
            type="button"
            onClick={() => setSelectedRole("CLIENT")}
            variant="selectable"
            isSelected={selectedRole === "CLIENT"}
            size="sm"
            fullWidth
            className="py-2.5 rounded-lg font-semibold"
          >
            Family or Client
          </Button>
          <Button
            type="button"
            onClick={() => setSelectedRole("CARER")}
            variant="selectable"
            isSelected={selectedRole === "CARER"}
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
        autoComplete="new-password"
      />

      <Button
        type="submit"
        text={isLoading ? "Creating Account..." : "Create Account"}
        disabled={isLoading}
      />

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link
          /* Carry the journey through so a carer stays framed as a carer. */
          href={
            selectedRole === "CARER"
              ? AUTH_ROUTES.login.carer
              : AUTH_ROUTES.login.client
          }
          className="text-gold-muted font-medium hover:text-[#b8915e] hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
