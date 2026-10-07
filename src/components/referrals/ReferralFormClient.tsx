import React, { useState } from "react";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
} from "@/lib/validation";

interface ReferralFormClientProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  }) => Promise<boolean>;
  submitting: boolean;
  hidePhone?: boolean;
}

export default function ReferralFormClient({
  onSubmit,
  submitting,
  hidePhone = false,
}: ReferralFormClientProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    const firstNameError = validateFirstName(firstName);
    if (firstNameError) {
      tempErrors.firstName = firstNameError;
    }

    const lastNameError = validateLastName(lastName);
    if (lastNameError) {
      tempErrors.lastName = lastNameError;
    }

    if (email.trim()) {
      const emailError = validateEmail(email);
      if (emailError) {
        tempErrors.email = emailError;
      }
    }

    if (!hidePhone) {
      if (!phone.trim()) {
        tempErrors.phone = "Phone number is required";
      } else {
        const phoneError = validatePhone(phone);
        if (phoneError) {
          tempErrors.phone = phoneError;
        }
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.firstName;
        return copy;
      });
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.lastName;
        return copy;
      });
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const trimmed = val.trim();
    if (trimmed) {
      const emailError = validateEmail(trimmed);
      if (!emailError) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.email;
          return copy;
        });
      } else {
        if (errors.email) {
          setErrors((prev) => ({
            ...prev,
            email: emailError,
          }));
        }
      }
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (errors.phone && val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
      phone: phone.trim(),
    };

    const success = await onSubmit(payload);
    if (success) {
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setErrors({});
    }
  };

  return (
    <div className="h-full flex flex-col rounded-3xl border border-gold-300/10 bg-navy-900/40 p-4 sm:p-6 lg:p-8 shadow-[0_0_30px_rgba(212,175,122,0.03)] backdrop-blur-md">
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
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
                Help families discover trusted independent carers through Grace
                & Goodwill.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="rounded-2xl p-4 bg-navy-950/50 border border-gold-300/20 shadow-inner">
              <p className="text-sm text-gold-100/90 font-medium leading-relaxed">
                Please tell us the name of the friend you would like to refer to us.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name *"
                placeholder="e.g. Eleanor"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                disabled={submitting}
                error={errors.firstName}
              />

              <Input
                label="Last Name *"
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                disabled={submitting}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="e.g. eleanor.v@example.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={submitting}
              error={errors.email}
            />

            {!hidePhone && (
              <PhoneInput
                label="Phone Number *"
                placeholder="e.g. +44 7700 900555"
                value={phone}
                onChange={handlePhoneChange}
                error={errors.phone}
                disabled={submitting}
              />
            )}
          </div>
        </div>

        {/* Action Button & Benefits Section */}
        <div className="space-y-6 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full relative overflow-hidden group rounded-xl px-5 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 transform select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-DEFAULT/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-gradient-to-r from-gold-300 via-gold-DEFAULT to-gold-200 text-navy-950 shadow-[0_4px_12px_rgba(212,175,122,0.15)] hover:shadow-[0_6px_20px_rgba(212,175,122,0.3)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent animate-spin rounded-full"></span>
                Submitting...
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
