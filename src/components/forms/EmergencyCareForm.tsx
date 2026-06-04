"use client";

import React, { useState } from "react";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { Check, AlertCircle } from "lucide-react";

export default function EmergencyCareForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whoNeedsSupport, setWhoNeedsSupport] = useState("parent");
  const [immediateSupport, setImmediateSupport] = useState("yes");
  const [location, setLocation] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");
  const [message, setMessage] = useState("");

  // UX & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = "Full name is required";

    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    }

    if (!email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Enter a valid email address";
    }

    if (!location.trim()) {
      tempErrors.location = "Required (City or Postcode)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
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
    setIsSubmitted(false);
  };

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
            Your priority application has been transmitted. A Senior Operations
            Coordinator is reviewing carer schedules and will call you back at{" "}
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name & Email Input Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm ${
              errors.fullName ? "border-red-500" : "border-gold-muted/20"
            }`}
          />
          {errors.fullName && (
            <p className="text-[10px] text-red-500 font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm ${
              errors.email ? "border-red-500" : "border-gold-muted/20"
            }`}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-medium">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <PhoneInput
          label="Phone Number"
          placeholder="Enter contact number"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
      </div>

      {/* Who Needs Support & Is Immediate Support Required? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Who Needs Support?
          </label>
          <select
            value={whoNeedsSupport}
            onChange={(e) => setWhoNeedsSupport(e.target.value)}
            className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm"
          >
            <option value="myself">Myself</option>
            <option value="parent">My Parent</option>
            <option value="partner">My Partner</option>
            <option value="child">My Child</option>
            <option value="other">Other Relative</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Is Immediate Support Required?
          </label>
          <select
            value={immediateSupport}
            onChange={(e) => setImmediateSupport(e.target.value)}
            className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm"
          >
            <option value="yes">Yes - within 24-48 hours</option>
            <option value="soon">Soon - within next 7 days</option>
            <option value="no">Not urgent</option>
          </select>
        </div>
      </div>

      {/* Location & Preferred Contact Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. City or Postcode"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm ${
              errors.location ? "border-red-500" : "border-gold-muted/20"
            }`}
          />
          {errors.location && (
            <p className="text-[10px] text-red-500 font-medium">
              {errors.location}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
            Preferred Contact Method
          </label>
          <select
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm"
          >
            <option value="phone">Phone Call (Highest Priority)</option>
            <option value="whatsapp">WhatsApp Message</option>
            <option value="email">Email Response</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90">
          Additional Emergency Details
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please outline the urgency, key care diagnostics, or hospital discharge schedule details..."
          className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-amber-500/40 transition duration-300 text-sm"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          fullWidth
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Activating dispatch...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 fill-current" />
              <span>Request Immediate Support</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
