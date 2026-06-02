"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthSplitLayout from "@/components/AuthSplitLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLoginForm, LoginFormErrors } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

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

      const response = await login({
        email,
        password,
      });

      console.log("LOGIN SUCCESS", response);

      // Perform smart redirect to home which will dynamically navigate based on portal link
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setApiError(
        error.message || "Invalid email or password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Login to continue managing care services."
    >
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

      {/* ── Branded Placeholder ── */}
      <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#e8ba7a] tracking-widest mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          GRACE &amp; GOODWILL
        </h2>

        <div className="flex items-center gap-4 mb-2">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#b8915e]/70" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#b8915e]/70" />
        </div>


      </div>
    </AuthSplitLayout>
  );
}
