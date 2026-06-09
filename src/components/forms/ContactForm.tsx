"use client";

import React, { useState } from "react";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { showSuccessToast } from "@/utils/toast";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [careFor, setCareFor] = useState("parent");
  const [supportType, setSupportType] = useState("dementia");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");

  // UX & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = "Full name is required";

    if (!email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Enter a valid email address";
    }

    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    }

    if (!location.trim()) {
      tempErrors.location = "Required (City or Postcode)";
    }

    if (!startDate) {
      tempErrors.startDate = "Preferred start date is required";
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
      showSuccessToast(
        "Request Received",
        "Thank you for reaching out. One of our consultants will contact you within the next two hours.",
      );
      resetForm();
    }, 1200);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setCareFor("parent");
    setSupportType("dementia");
    setLocation("");
    setStartDate("");
    setMessage("");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name & Email Input Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
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
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
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

      {/* Care Needed For & Type of Support Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Care Needed For
          </label>
          <select
            value={careFor}
            onChange={(e) => setCareFor(e.target.value)}
            className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
          >
            <option value="myself">Myself</option>
            <option value="parent">My Parent</option>
            <option value="partner">My Partner</option>
            <option value="child">My Child</option>
            <option value="other">Other Relative</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Type of Support Required
          </label>
          <select
            value={supportType}
            onChange={(e) => setSupportType(e.target.value)}
            className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
          >
            <option value="companion">General Companion Care</option>
            <option value="dementia">Dementia & Complex Care</option>
            <option value="palliative">Palliative Care</option>
            <option value="rehab">Post-Operative / Rehab</option>
            <option value="other">Other Specialist Support</option>
          </select>
        </div>
      </div>

      {/* Location & Preferred Start Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. London, Manchester"
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
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
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
            Preferred Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
              errors.startDate ? "border-red-500" : "border-gold-muted/20"
            }`}
          />
          {errors.startDate && (
            <p className="text-[10px] text-red-500 font-medium">
              {errors.startDate}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
          Additional Details / Message
        </label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share details about the carer match requirements, daily routines, or expectations..."
          className="w-full rounded-xl border border-gold-muted/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
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
              <span>Submitting...</span>
            </div>
          ) : (
            <span>Submit Enquiry & Search Carers</span>
          )}
        </Button>
      </div>
    </form>
  );
}
