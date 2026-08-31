"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { CheckCircle, Phone, AlertCircle } from "lucide-react";

import PhoneInput from "@/components/PhoneInput";
import { submitClientDetails } from "@/store/slices/clientSlice";
import {
  validateClientOnboardingForm,
  scrollToFirstError,
} from "../utils/validation";

export default function ClientOnboardingPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const clientProfile = useAppSelector((state) => state.client.profile);
  const loading = useAppSelector((state) => state.client.loading);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [careStartDate, setCareStartDate] = useState("");
  const [careEndDate, setCareEndDate] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);
  const [carePostcode, setCarePostcode] = useState("");
  const [careAddress, setCareAddress] = useState("");
  const [careNote, setCareNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const rawUser = (clientProfile?.user || user) as any;
    if (rawUser) {
      if (rawUser.firstName) setFirstName(rawUser.firstName);
      if (rawUser.lastName) setLastName(rawUser.lastName);
      if (rawUser.email) setEmail(rawUser.email);
      const rawPhone = rawUser.phoneNumber || rawUser.phone || (clientProfile as any)?.phone || "";
      if (rawPhone) setPhone(rawPhone);
    }
  }, [user, clientProfile]);

  // Real-time validation after first submit attempt
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const formErrors = validateClientOnboardingForm({
        firstName,
        lastName,
        email,
        phone,
        startDate: careStartDate,
        endDate: careEndDate,
        isOngoing,
        postcode: carePostcode,
        location: careAddress,
        note: careNote,
      });
      setErrors(formErrors);
    }
  }, [
    firstName,
    lastName,
    email,
    phone,
    careStartDate,
    careEndDate,
    isOngoing,
    carePostcode,
    careAddress,
    careNote,
    hasAttemptedSubmit,
  ]);

  const showPendingScreen = clientProfile?.status === "PENDING_APPROVAL" || clientProfile?.status === "UNDER_REVIEW";

  useEffect(() => {
    if (showPendingScreen) {
      import("@/services/auth/auth.service").then(({ authService }) => {
        authService.logout();
      });
    }
  }, [showPendingScreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const formErrors = validateClientOnboardingForm({
      firstName,
      lastName,
      email,
      phone,
      startDate: careStartDate,
      endDate: careEndDate,
      isOngoing,
      postcode: carePostcode,
      location: careAddress,
      note: careNote,
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      scrollToFirstError();
      return;
    }

    setErrors({});
    await dispatch(
      submitClientDetails({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: careAddress.trim(),
        careNote: careNote.trim(),
        careStartDate: new Date(careStartDate).toISOString(),
        careEndDate: isOngoing
          ? undefined
          : careEndDate
            ? new Date(careEndDate).toISOString()
            : undefined,
        carePostcode: carePostcode.trim().toUpperCase(),
        careAddress: careAddress.trim(),
      })
    );
  };

  if (showPendingScreen) {
    return (
      <main className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-navy-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-DEFAULT/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-2xl w-full">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-DEFAULT/50 to-transparent absolute top-0 left-0 rounded-t-2xl z-10" />

          <div className="rounded-2xl border border-gold-300/10 bg-gradient-to-b from-navy-900/80 to-navy-950/90 p-10 shadow-2xl backdrop-blur-xl text-center space-y-8">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gold-DEFAULT/20 rounded-full animate-ping opacity-75" />
              <div className="relative w-full h-full bg-gradient-to-b from-gold-300/20 to-gold-DEFAULT/10 rounded-full flex items-center justify-center border border-gold-DEFAULT/30 shadow-inner shadow-gold-DEFAULT/20">
                <CheckCircle className="w-12 h-12 text-gold-DEFAULT drop-shadow-md" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gold-200">
                Application Received
              </h1>
              <div className="h-px w-16 bg-gold-DEFAULT/30 mx-auto" />
              <div className="space-y-4 text-sm text-gold-100/80 leading-relaxed px-2">
                <p>
                  Thank you for completing your details and for choosing Grace & Goodwill.
                </p>
                <p>
                  One of our team members will call you as soon as possible to guide you through the next steps and answer any questions you may have.
                </p>
                <div className="py-2 my-2 flex items-start justify-center gap-3">
                  <span className="text-xl leading-none drop-shadow-[0_0_12px_rgba(247,215,116,0.8)] animate-pulse shrink-0 mt-0.5">🚨</span>
                  <p className="text-sm font-medium text-gold-100/90 text-center">
                    If your request is urgent, please use one of the options below to speak to us straight away:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 sm:px-2">
                <a
                  href="tel:02045240108"
                  className="group relative flex items-center justify-center h-10 px-4 rounded-xl bg-[#c2a278] hover:bg-[#b09268] transition-all duration-300 w-full shadow-lg hover:shadow-[0_0_15px_rgba(194,162,120,0.3)] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2.5 w-full">
                    <Phone className="w-4 h-4 text-[#2d2110] shrink-0" />
                    <span className="text-[#2d2110] font-semibold text-[13px] tracking-wide whitespace-nowrap">
                      Call Now – 020 4524 0108
                    </span>
                  </div>
                </a>

                <a
                  href="https://wa.me/447462931949"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center h-10 px-4 rounded-xl bg-[#063D24] hover:bg-[#085230] transition-all duration-300 w-full shadow-lg hover:shadow-[0_0_15px_rgba(0,198,83,0.2)] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2.5 w-full">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#00C653] shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span className="text-[#E0F8EA] font-semibold text-[13px] tracking-wide whitespace-nowrap">
                      WhatsApp Us
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 flex flex-col items-center pb-12 sm:pb-16">
      {/* Header Section (Outside Box) */}
      <div className="w-full px-4 py-4 sm:py-5 text-center relative lg:sticky lg:top-20 z-40 bg-navy-950/95 lg:backdrop-blur-xl backdrop-blur-md border-b border-gold-300/10 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-DEFAULT to-gold-400 drop-shadow-sm mb-2">
            Complete Your Details
          </h1>
          <p className="text-sm sm:text-[15px] text-gold-100/80 leading-relaxed max-w-2xl mx-auto font-medium px-4">
            Please provide your details below. Our team will review your registration and carefully configure your dedicated client portal.
          </p>
        </div>
      </div>

      {/* Form Box */}
      <div className="w-full max-w-6xl px-4 sm:px-8 mt-6 sm:mt-10">
        <div className="bg-navy-900/60 backdrop-blur-xl border border-gold-300/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-DEFAULT/50 to-transparent opacity-70 rounded-t-2xl" />
          <div className="px-6 py-8 sm:px-12 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Line 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Input
                label={
                  <span>
                    First Name <span className="text-red-400">*</span>
                  </span>
                }
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors({ ...errors, firstName: "" });
                }}
                error={errors.firstName}
              />
              <Input
                label={
                  <span>
                    Last Name <span className="text-red-400">*</span>
                  </span>
                }
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors({ ...errors, lastName: "" });
                }}
                error={errors.lastName}
              />
              <Input
                label={
                  <span>
                    Email Address <span className="text-red-400">*</span>
                  </span>
                }
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
              />
            </div>

            {/* Line 2: Phone, Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PhoneInput
                label={
                  <span>
                    Phone Number <span className="text-red-400">*</span>
                  </span>
                }
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                error={errors.phone}
              />
              <Input
                label={
                  <span>
                    Start Date <span className="text-red-400">*</span>
                  </span>
                }
                type="date"
                min={todayStr}
                value={careStartDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setCareStartDate(val);
                  if (errors.careStartDate) setErrors({ ...errors, careStartDate: "" });
                  if (careEndDate && val && careEndDate < val) {
                    setCareEndDate("");
                  }
                }}
                error={errors.careStartDate}
              />

              <div>
                <Input
                  label={
                    <span>
                      End Date {!isOngoing && <span className="text-red-400">*</span>}
                    </span>
                  }
                  type="date"
                  min={
                    careStartDate
                      ? (() => {
                          const start = new Date(careStartDate);
                          start.setDate(start.getDate() + 2);
                          return start.toISOString().split("T")[0];
                        })()
                      : todayStr
                  }
                  value={careEndDate}
                  disabled={isOngoing}
                  onChange={(e) => {
                    setCareEndDate(e.target.value);
                    if (errors.careEndDate) setErrors({ ...errors, careEndDate: "" });
                  }}
                  error={errors.careEndDate}
                  className={isOngoing ? "opacity-40 cursor-not-allowed" : ""}
                />
                <label className="flex items-center gap-2 text-sm text-gold-200 mt-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isOngoing}
                    onChange={(e) => {
                      setIsOngoing(e.target.checked);
                      if (e.target.checked) {
                        setCareEndDate("");
                        if (errors.careEndDate) setErrors({ ...errors, careEndDate: "" });
                      }
                    }}
                    className="w-4 h-4 rounded border-gold-300/30 bg-navy-950 text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-offset-navy-950 transition-colors"
                  />
                  Ongoing
                </label>
              </div>
            </div>

            {/* Line 3: Postcode & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label={
                  <span>
                    Postcode <span className="text-red-400">*</span>
                  </span>
                }
                type="text"
                placeholder="e.g. SW1A 1AA"
                value={carePostcode}
                onChange={(e) => {
                  setCarePostcode(e.target.value);
                  if (errors.carePostcode) setErrors({ ...errors, carePostcode: "" });
                }}
                error={errors.carePostcode}
              />

              <Input
                label={
                  <span>
                    Location <span className="text-red-400">*</span>
                  </span>
                }
                type="text"
                placeholder="e.g. 10 Downing Street, London"
                value={careAddress}
                onChange={(e) => {
                  setCareAddress(e.target.value);
                  if (errors.careAddress) setErrors({ ...errors, careAddress: "" });
                }}
                error={errors.careAddress}
              />
            </div>

            {/* Note Field (at the bottom) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gold-200/90 tracking-wide">
                Note <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  placeholder="Please provide any details or specific requirements (minimum 10 characters)..."
                  value={careNote}
                  onChange={(e) => {
                    setCareNote(e.target.value);
                    if (errors.careNote) setErrors({ ...errors, careNote: "" });
                  }}
                  rows={4}
                  className={`w-full bg-navy-900/50 rounded-xl border border-gold-300/20 py-3 px-4 outline-none focus:ring-2 focus:ring-gold-DEFAULT/50 text-gold-100 placeholder-gold-100/30 resize-none transition-all duration-300 ${
                    errors.careNote ? "border-red-500/50 focus:ring-red-500/30" : "hover:border-gold-300/40"
                  }`}
                />
              </div>
              {errors.careNote && (
                <p className="form-help text-red-500">{errors.careNote}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gold-300/10">
              <p className="text-[11px] font-medium tracking-wide text-gold-100/40 uppercase order-2 sm:order-1 mt-2 sm:mt-0">
                Secure & Confidential
              </p>
              <Button
                type="submit"
                text={loading ? "Submitting..." : "Submit Details"}
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3 order-1 sm:order-2 shadow-lg"
              />
            </div>
          </form>
        </div>
      </div>
      </div>
    </main>
  );
}
