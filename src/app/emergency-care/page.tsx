"use client";

import React, { useState } from "react";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";

export default function EmergencyCarePage() {
  // Form Fields State
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

  return (
    <main className="min-h-[calc(100vh-80px)] bg-navy-950 py-16 text-gold-100 flex items-center">
      <div className="container-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Urgent Content & Priority Assistance */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-200 border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Priority Response Flow</span>
            </div>

            {/* Dynamic Heading & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-gold-50 sm:text-5xl">
                Urgent Live In Care Support When You Need It Most
              </h1>
              <p className="text-gold-200/80 leading-relaxed text-base">
                Our team is here to help families arrange urgent care support
                quickly, professionally, and with compassion. Facing a sudden
                change in health, a hospital discharge schedule, or a carer
                emergency is highly stressful. We coordinate rapid-response
                placements with absolute integrity and speed.
              </p>
            </div>

            {/* Emergency Indicators */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-200">
                    24–48 Hour Deploys
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    Rapid scheduling matching ensures trained professional
                    carers are deployed within 24 to 48 hours UK-wide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-gold-muted/5 border border-gold-muted/10">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gold-muted/10 text-gold-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gold-200">
                    Duty Placement Desk
                  </h4>
                  <p className="text-xs text-gold-100/60 leading-normal mt-0.5">
                    Our critical operations office organizes complete,
                    structured, and clinically sound carers handovers.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Priority Contact Card */}
            <div className="p-6 rounded-[1.75rem] border border-amber-500/20 bg-amber-500/5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-amber-200">
                  Priority Hotline
                </h3>
                <p className="text-xs text-amber-100/60 mt-1">
                  Connect instantly with our Duty Coordinator on call 24 hours a
                  day.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+15551234567"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500 text-navy-950 text-xs font-bold hover:bg-amber-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Priority Line: 0800 Urgent
                </a>

                <a
                  href="https://wa.me/447700000000?text=URGENT%3A%20I%20need%20to%20chat%20about%20an%20immediate%20live%20in%20care%20placement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-emerald-300 text-xs font-bold hover:bg-emerald-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium glassmorphic priority form card */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-amber-500/20 bg-navy-900/50 p-8 lg:p-10 shadow-[0_20px_50px_rgba(245,158,11,0.05)] backdrop-blur-xl space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h2 className="text-xl font-bold text-amber-200">
                  Priority Placement Request
                </h2>
                <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
                  This form routes directly to our critical placement queue. A
                  duty officer will review details immediately.
                </p>
              </div>

              {/* Submit Success State */}
              {isSubmitted ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-emerald-300">
                      Priority Protocol Activated
                    </h3>
                    <p className="text-xs text-gold-100/70 leading-relaxed max-w-md mx-auto">
                      Your priority application has been transmitted. A Senior
                      Operations Coordinator is reviewing carer schedules and
                      will call you back at {phone} within 30 minutes.
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
              ) : (
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
                          errors.fullName
                            ? "border-red-500"
                            : "border-gold-muted/20"
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
                          errors.email
                            ? "border-red-500"
                            : "border-gold-muted/20"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Input Group (Uses custom-styled component) */}
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
                          errors.location
                            ? "border-red-500"
                            : "border-gold-muted/20"
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
                        <option value="phone">
                          Phone Call (Highest Priority)
                        </option>
                        <option value="whatsapp">WhatsApp Message</option>
                        <option value="email">Email Response</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Emergency Details */}
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

                  {/* Submit priority button */}
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
                          <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Request Immediate Support</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
