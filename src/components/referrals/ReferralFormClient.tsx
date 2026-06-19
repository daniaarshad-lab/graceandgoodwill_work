import React, { useState } from "react";
import { toast } from "sonner";

interface ReferralFormClientProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => Promise<boolean>;
  submitting: boolean;
}

export default function ReferralFormClient({
  onSubmit,
  submitting,
}: ReferralFormClientProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (val: string) => {
    if (!val) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhone = (val: string) => {
    if (!val) {
      setPhoneError("");
      return true;
    }
    const phoneRegex = /^[+\s()0-9]{7,20}$/;
    if (!phoneRegex.test(val)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Form validity check
  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    !emailError &&
    !phoneError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);

    if (!isEmailValid || !isPhoneValid) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone: phone.trim() !== "" ? phone : undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-[0_0_30px_rgba(212,175,122,0.03)] backdrop-blur-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 flex-grow flex flex-col justify-between"
      >
        <div className="space-y-6">
          {/* Top Intro Section */}
          <div className="flex items-start gap-4 pb-4 border-b border-gold-300/5">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-gold-300/20 to-gold-200/5 border border-gold-300/20 flex items-center justify-center text-xl text-gold-DEFAULT shadow-[0_0_15px_rgba(212,175,122,0.1)]">
              👥
            </div>
            <div>
              <h3 className="text-xl font-bold text-gold-200 tracking-tight">
                Refer a Friend
              </h3>
              <p className="text-xs text-gold-100/50 mt-0.5 leading-relaxed">
                Help families discover trusted care services through Grace &
                Goodwill.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gold-200 uppercase tracking-widest">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 focus:ring-1 focus:ring-gold-DEFAULT/20"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gold-200 uppercase tracking-widest">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vance"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 focus:ring-1 focus:ring-gold-DEFAULT/20"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gold-200 uppercase tracking-widest">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. eleanor.v@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                disabled={submitting}
                className={`w-full rounded-xl bg-navy-950/80 border px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 focus:ring-1 ${
                  emailError
                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-gold-300/15 focus:border-gold focus:ring-gold-DEFAULT/20"
                }`}
              />
              {emailError && (
                <p className="text-[10px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {emailError}
                </p>
              )}
            </div>

            {/* Phone Number (Optional) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gold-200 uppercase tracking-widest">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. +44 7700 900555"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) validatePhone(e.target.value);
                }}
                onBlur={(e) => validatePhone(e.target.value)}
                disabled={submitting}
                className={`w-full rounded-xl bg-navy-950/80 border px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 focus:ring-1 ${
                  phoneError
                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-gold-300/15 focus:border-gold focus:ring-gold-DEFAULT/20"
                }`}
              />
              {phoneError && (
                <p className="text-[10px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {phoneError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button & Benefits Section */}
        <div className="space-y-6 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className="w-full relative overflow-hidden group rounded-xl px-5 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 transform select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-DEFAULT/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-gradient-to-r from-gold-300 via-gold-DEFAULT to-gold-200 text-navy-950 shadow-[0_4px_12px_rgba(212,175,122,0.15)] hover:shadow-[0_6px_20px_rgba(212,175,122,0.3)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent animate-spin rounded-full"></span>
                Sending Referral...
              </span>
            ) : (
              "Send Referral"
            )}
          </button>

          {/* Benefits Section */}
          <div className="border-t border-gold-300/5 pt-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-200/40 mb-3">
              Why Refer?
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-gold-100/50 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-gold shrink-0">✔</span> Help families
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold shrink-0">✔</span> Fast onboarding
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold shrink-0">✔</span> Dedicated support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold shrink-0">✔</span> Premium matching
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
