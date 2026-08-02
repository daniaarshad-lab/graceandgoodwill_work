"use client"; // force turbopack cache invalidation

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/store/hooks";
import PhoneInput from "@/components/PhoneInput";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { Check, AlertCircle } from "lucide-react";
import { clientService } from "@/services/client/client.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import {
  validateFullName,
  validateEmail,
  validatePhone,
} from "@/lib/validation";

interface EmergencyCareFormProps {
  /** When true, shows toasts alongside inline feedback (client portal context) */
  isAuthenticated?: boolean;
}

export default function EmergencyCareForm({
  isAuthenticated = false,
}: EmergencyCareFormProps) {
  const { user: authUser, isAuthenticated: isContextAuth } = useAuth();
  const { user: reduxUser, isAuthenticated: isReduxAuthenticated } =
    useAppSelector((state) => state.auth);

  // Use context auth preferably, fallback to redux if needed
  const user = authUser || reduxUser;
  const effectiveIsAuthenticated =
    isAuthenticated || isContextAuth || isReduxAuthenticated;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whoNeedsSupport, setWhoNeedsSupport] = useState("parent");
  const [immediateSupport, setImmediateSupport] = useState("yes");
  const [location, setLocation] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");
  const [message, setMessage] = useState("");

  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (effectiveIsAuthenticated && user && !hasPrefilled) {
      // Only prefill for clients
      if (user.role === "client" || user.role === "CLIENT") {
        if (user.email && !email) setEmail(user.email);
        if (user.firstName && user.lastName && !fullName)
          setFullName(`${user.firstName} ${user.lastName}`);
        if (user.phone && !phone) setPhone(user.phone);
      }
      setHasPrefilled(true);
    }
  }, [effectiveIsAuthenticated, user, hasPrefilled, email, fullName, phone]);

  // UX & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    const fullNameError = validateFullName(fullName);
    if (fullNameError) tempErrors.fullName = fullNameError;

    const phoneError = validatePhone(phone);
    if (phoneError) tempErrors.phone = phoneError;

    const emailError = validateEmail(email);
    if (emailError) tempErrors.email = emailError;

    if (!location.trim()) {
      tempErrors.location = "Required (City or Postcode)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await clientService.submitEmergencyCareRequest({
        fullName,
        email,
        phoneNumber: phone,
        whoNeedsSupport,
        location,
        preferredContactMethod: contactMethod,
        additionalEmergencyDetails: message || undefined,
      });

      setIsSubmitted(true);

      if (effectiveIsAuthenticated) {
        showSuccessToast(
          "Request Submitted",
          "Your emergency care request has been submitted. A Matching Specialist will contact you shortly.",
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to submit request. Please try again.";
      setSubmitError(errorMessage);

      if (effectiveIsAuthenticated) {
        showErrorToast("Submission Failed", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setWhoNeedsSupport("parent");
    setImmediateSupport("yes");
    setLocation("");
    setContactMethod("phone");
    setMessage("");
    setErrors({});
    setSubmitError(null);
    setIsSubmitted(false);
  };

  // ── Label helper ──────────────────────────────────────────────────────
  const fieldLabel = (text: string) => (
    <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/70">
      {text}
    </span>
  );

  // ── Input overrides for dark theme ────────────────────────────────────
  const darkInput =
    "!bg-navy-950/50 !border-gold-400/20 !text-gold-100 focus:!border-gold-400/60 focus:!ring-gold-400/20 placeholder:!text-gold-100/30 !shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]";
  const darkSelect =
    "!bg-navy-950/50 !border-gold-400/20 !text-gold-100 focus:!border-gold-400/60 focus:!ring-gold-400/20 !shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]";

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-emerald-300">
            Priority Protocol Activated
          </h3>
          <p className="text-xs text-gold-100/70 leading-relaxed max-w-md mx-auto">
            Your priority application has been transmitted. A Matching
            Specialist is reviewing carer schedules and will call you back at{" "}
            {phone} within 30 minutes.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 text-xs font-semibold text-gold-200 underline hover:text-gold-100"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Inline error banner */}
      {submitError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-300">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={fieldLabel("Full Name")}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName)
              setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          placeholder="Enter your full name"
          error={errors.fullName}
          className={darkInput}
        />
        <Input
          label={fieldLabel("Email Address")}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="name@example.com"
          error={errors.email}
          className={darkInput}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhoneInput
          label={fieldLabel("Phone Number")}
          placeholder="Enter contact number"
          value={phone}
          onChange={(val) => {
            setPhone(val);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          error={errors.phone}
          className={darkInput}
        />
        <Select
          label={fieldLabel("Who Needs Support?")}
          value={whoNeedsSupport}
          onChange={(e) => setWhoNeedsSupport(e.target.value)}
          options={[
            { value: "myself", label: "Myself" },
            { value: "parent", label: "My Parent" },
            { value: "partner", label: "My Partner" },
            { value: "child", label: "My Child" },
            { value: "other", label: "Other Relative" },
          ]}
          className={darkSelect}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={fieldLabel("Location")}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            if (errors.location)
              setErrors((prev) => ({ ...prev, location: "" }));
          }}
          placeholder="e.g. City or Postcode"
          error={errors.location}
          className={darkInput}
        />
        <Select
          label={fieldLabel("Preferred Contact Method")}
          value={contactMethod}
          onChange={(e) => setContactMethod(e.target.value)}
          options={[
            { value: "phone", label: "Phone Call (Highest Priority)" },
            { value: "whatsapp", label: "WhatsApp Message" },
            { value: "email", label: "Email Response" },
          ]}
          className={darkSelect}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/70">
          Additional Emergency Details
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please outline the urgency, key care diagnostics, or hospital discharge schedule details..."
          className="w-full rounded-xl border border-gold-400/20 bg-navy-950/50 px-4 py-3 text-gold-100 outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/20 transition duration-300 text-sm placeholder:text-gold-100/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Activating dispatch...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Submit Emergency Care Request</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
