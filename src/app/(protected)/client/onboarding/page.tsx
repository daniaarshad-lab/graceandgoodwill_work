"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { CheckCircle } from "lucide-react";

import PhoneInput from "@/components/PhoneInput";
import { submitClientDetails } from "@/store/slices/clientSlice";

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

    const formErrors: Record<string, string> = {};
    if (!firstName.trim()) formErrors.firstName = "First Name is required";
    if (!lastName.trim()) formErrors.lastName = "Last Name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      formErrors.email = "Valid Email is required";
    if (!phone.trim()) formErrors.phone = "Phone number is required";
    if (!careStartDate.trim()) formErrors.careStartDate = "Start Date is required";
    if (!carePostcode.trim()) formErrors.carePostcode = "Postcode is required";
    if (!careNote.trim()) formErrors.careNote = "Note is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    await dispatch(
      submitClientDetails({
        firstName,
        lastName,
        email,
        phone,
        location: carePostcode,
        careNote,
        careStartDate: new Date(careStartDate).toISOString(),
        careEndDate: isOngoing ? undefined : (careEndDate ? new Date(careEndDate).toISOString() : undefined),
        carePostcode,
        careAddress: careAddress || undefined,
      })
    );
  };

  if (showPendingScreen) {
    return (
      <main className="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-navy-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-DEFAULT/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-md w-full">
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
              <p className="text-sm text-gold-100/70 leading-relaxed">
                Thank you for completing your details. Our care administration team will review your registration shortly.
              </p>
              <p className="text-xs text-gold-100/40 mt-4">
                You will be notified once your portal access is granted.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-navy-900/50 border border-gold-300/10 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-navy-900 border-b border-gold-300/10 px-8 py-8 sm:px-12">
          <h1 className="text-2xl font-bold text-gold-200">
            Complete Your Details
          </h1>
          <p className="text-sm text-gold-100/70 mt-2 leading-relaxed max-w-xl">
            Please provide your details below. Our team will review your registration and configure your dedicated client portal.
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 py-10 sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="First Name"
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
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors({ ...errors, lastName: "" });
                }}
                error={errors.lastName}
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                error={errors.email}
              />
              <PhoneInput
                label="Phone Number"
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                error={errors.phone}
              />
            </div>

            {/* Date Fields with Ongoing Checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Start Date"
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
                  label="End Date"
                  type="date"
                  min={careStartDate && careStartDate > todayStr ? careStartDate : todayStr}
                  value={careEndDate}
                  disabled={isOngoing}
                  onChange={(e) => setCareEndDate(e.target.value)}
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
                      }
                    }}
                    className="w-4 h-4 rounded border-gold-300/20 bg-navy-950 text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-offset-navy-950"
                  />
                  Ongoing
                </label>
              </div>
            </div>

            {/* Location & Postcode Fields */}
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
                label="Location"
                type="text"
                placeholder="e.g. 10 Downing Street, London"
                value={careAddress}
                onChange={(e) => setCareAddress(e.target.value)}
              />
            </div>

            {/* Note Field (at the bottom) */}
            <div className="space-y-2">
              <label className="form-label">
                Note <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  placeholder="Please provide any details or specific requirements..."
                  value={careNote}
                  onChange={(e) => {
                    setCareNote(e.target.value);
                    if (errors.careNote) setErrors({ ...errors, careNote: "" });
                  }}
                  rows={4}
                  className={`w-full rounded-xl border py-3 px-4 outline-none focus:ring-2 focus:ring-primary resize-none ${
                    errors.careNote ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.careNote && (
                <p className="form-help text-red-500">{errors.careNote}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gold-300/10">
              <p className="text-[11px] font-medium tracking-wide text-gold-100/40 uppercase order-2 sm:order-1">
                Secure & Confidential
              </p>
              <Button
                type="submit"
                text={loading ? "Submitting..." : "Submit Details"}
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3 order-1 sm:order-2"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
