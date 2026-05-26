"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Select from "@/components/Select";

// Interface for Mock Carers
interface Carer {
  id: string;
  name: string;
  experience: string;
  specialties: string;
  availability: "Available" | "Limited Availability" | "Unavailable";
  bio: string;
  avatarBg: string;
}

// Interface for Care Requests
interface CareRequest {
  id: string;
  fullName: string;
  careType: string;
  startDate: string;
  duration: string;
  status: "Pending" | "Reviewing" | "Matched" | "Completed";
  progress: number; // 0-100 percentage
}

// Interface for Enquiries
interface Enquiry {
  id: string;
  subject: string;
  message: string;
  preference: string;
  date: string;
  status: "Received" | "Responded";
}

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "request" | "carers" | "enquiry" | "tracking"
  >("overview");

  // --- STATE FOR MOCK DATA ---
  const [careRequests, setCareRequests] = useState<CareRequest[]>([
    {
      id: "REQ-001",
      fullName: `${user?.firstName || "Jane"} ${user?.lastName || "Doe"}`,
      careType: "24/7 Live-in Companion Support",
      startDate: "2026-06-01",
      duration: "3 Months",
      status: "Reviewing",
      progress: 45,
    },
    {
      id: "REQ-002",
      fullName: `${user?.firstName || "Jane"} ${user?.lastName || "Doe"}`,
      careType: "Post-Operative Rehabilitation",
      startDate: "2026-05-28",
      duration: "2 Weeks",
      status: "Matched",
      progress: 75,
    },
    {
      id: "REQ-003",
      fullName: `${user?.firstName || "Jane"} ${user?.lastName || "Doe"}`,
      careType: "Elderly Dementia Support",
      startDate: "2026-05-15",
      duration: "Ongoing",
      status: "Completed",
      progress: 100,
    },
  ]);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: "ENQ-901",
      subject: "Insurance Coverage Options",
      message:
        "Hello, I would like to check if our private medical insurance covers live-in companion care services.",
      preference: "Email",
      date: "2026-05-24",
      status: "Responded",
    },
    {
      id: "ENQ-902",
      subject: "Dementia Care Certification Details",
      message:
        "Could you please send over details regarding the certifications and training your dementia carers undergo?",
      preference: "Phone Call",
      date: "2026-05-25",
      status: "Received",
    },
  ]);

  const mockCarers: Carer[] = [
    {
      id: "carer-1",
      name: "Sarah Jenkins",
      experience: "7 Years",
      specialties: "Dementia Care, Palliative Support, Nutrition",
      availability: "Available",
      bio: "Compassionate live-in carer dedicated to creating a warm, safe, and engaging environment. Specialized in sensory therapies for late-stage cognitive support.",
      avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "carer-2",
      name: "Michael Chen",
      experience: "5 Years",
      specialties: "Elderly Mobility, Post-Stroke Rehab, Companionship",
      availability: "Available",
      bio: "Active and enthusiastic carer with a background in physical therapy support. Focused on helping clients maintain their daily independence and happiness.",
      avatarBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      id: "carer-3",
      name: "Eleanor Vance",
      experience: "10 Years",
      specialties: "End of Life Support, Palliative Care, Medical Companion",
      availability: "Limited Availability",
      bio: "Highly experienced professional companion nurse focusing on peaceful, empathetic palliative care. Dedicated to support families holistically through complex journeys.",
      avatarBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
  ];

  // --- FORM STATES: CARE REQUEST ---
  const [careFullName, setCareFullName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`,
  );
  const [careEmail, setCareEmail] = useState(user?.email || "");
  const [carePhone, setCarePhone] = useState(user?.phone || "");
  const [careType, setCareType] = useState("Companion Support");
  const [careSupport, setCareSupport] = useState("");
  const [careStartDate, setCareStartDate] = useState("");
  const [careDuration, setCareDuration] = useState("");
  const [careAddress, setCareAddress] = useState("");
  const [careNotes, setCareNotes] = useState("");

  const [careErrors, setCareErrors] = useState<Record<string, string>>({});
  const [isCareSubmitting, setIsCareSubmitting] = useState(false);
  const [careSuccess, setCareSuccess] = useState(false);

  // --- FORM STATES: GENERAL ENQUIRIES ---
  const [enquirySubject, setEnquirySubject] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryPreference, setEnquiryPreference] = useState("Email");

  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>(
    {},
  );
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // --- STATE FOR REQUEST INTRODUCTION ---
  const [selectedCarer, setSelectedCarer] = useState<Carer | null>(null);
  const [introSuccessMsg, setIntroSuccessMsg] = useState<string | null>(null);

  // --- HANDLERS: CARE REQUEST SUBMISSION ---
  const handleCareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCareErrors({});
    setCareSuccess(false);

    const errors: Record<string, string> = {};

    if (!careFullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (careFullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    if (!careEmail.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(careEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!carePhone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(carePhone.trim())) {
      errors.phone = "Please enter a valid phone number (7-15 digits).";
    }

    if (!careSupport.trim()) {
      errors.support = "Please describe the required support.";
    } else if (careSupport.trim().length < 10) {
      errors.support = "Description must be at least 10 characters.";
    }

    if (!careStartDate) {
      errors.startDate = "Preferred start date is required.";
    }

    if (!careDuration.trim()) {
      errors.duration = "Please specify the duration of care.";
    }

    if (!careAddress.trim()) {
      errors.address = "Physical care address is required.";
    }

    if (Object.keys(errors).length > 0) {
      setCareErrors(errors);
      return;
    }

    setIsCareSubmitting(true);

    setTimeout(() => {
      setIsCareSubmitting(false);
      setCareSuccess(true);

      // Add to list
      const newReq: CareRequest = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        fullName: careFullName,
        careType: careType,
        startDate: careStartDate,
        duration: careDuration,
        status: "Pending",
        progress: 15,
      };

      setCareRequests((prev) => [newReq, ...prev]);

      // Reset form
      setCareSupport("");
      setCareStartDate("");
      setCareDuration("");
      setCareAddress("");
      setCareNotes("");

      setTimeout(() => setCareSuccess(false), 5000);
    }, 1200);
  };

  // --- HANDLERS: ENQUIRY SUBMISSION ---
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryErrors({});
    setEnquirySuccess(false);

    const errors: Record<string, string> = {};

    if (!enquirySubject.trim()) {
      errors.subject = "Subject is required.";
    } else if (enquirySubject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters.";
    }

    if (!enquiryMessage.trim()) {
      errors.message = "Message details are required.";
    } else if (enquiryMessage.trim().length < 15) {
      errors.message = "Message must be at least 15 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      return;
    }

    setIsEnquirySubmitting(true);

    setTimeout(() => {
      setIsEnquirySubmitting(false);
      setEnquirySuccess(true);

      // Add to list
      const newEnq: Enquiry = {
        id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
        subject: enquirySubject,
        message: enquiryMessage,
        preference: enquiryPreference,
        date: new Date().toISOString().split("T")[0],
        status: "Received",
      };

      setEnquiries((prev) => [newEnq, ...prev]);

      // Reset form
      setEnquirySubject("");
      setEnquiryMessage("");

      setTimeout(() => setEnquirySuccess(false), 5000);
    }, 1200);
  };

  // --- HANDLERS: REQUEST INTRODUCTION ---
  const handleRequestIntro = (carer: Carer) => {
    setSelectedCarer(carer);
  };

  const confirmIntroRequest = () => {
    if (!selectedCarer) return;

    setIntroSuccessMsg(
      `Your introduction request for ${selectedCarer.name} has been submitted! Our care coordinator will contact you shortly.`,
    );
    setSelectedCarer(null);

    // Auto fade banner
    setTimeout(() => setIntroSuccessMsg(null), 6000);
  };

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-10 md:px-8 text-gold-100">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Hero Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-2xl font-bold text-gold-DEFAULT">
              {user?.firstName?.charAt(0) || "C"}
              {user?.lastName?.charAt(0) || "P"}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-300">
                Family & Client Portal
              </p>
              <h1 className="text-3xl font-semibold text-gold-50 mt-1">
                Welcome back, {user?.firstName || "Family"}{" "}
                {user?.lastName || ""}
              </h1>
              <p className="text-sm text-gold-100/60 mt-1">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT transition hover:bg-gold-DEFAULT/10 hover:border-gold-DEFAULT"
          >
            Log Out
          </button>
        </section>

        {/* Tab Menu Navigation */}
        <div className="flex border-b border-gold-300/10 pb-1 overflow-x-auto gap-2">
          {[
            { id: "overview", label: "Dashboard Overview" },
            { id: "request", label: "Submit Care Request" },
            { id: "carers", label: "Carer Profiles" },
            { id: "tracking", label: "Track Requests" },
            { id: "enquiry", label: "Support & Enquiries" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap duration-300 ${
                activeTab === tab.id
                  ? "border-b-2 border-gold-DEFAULT text-gold-DEFAULT bg-gold-DEFAULT/5"
                  : "text-gold-200/60 hover:text-gold-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- INTRODUCTION REQUEST NOTIFICATION BANNER --- */}
        {introSuccessMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {introSuccessMsg}
          </div>
        )}

        {/* Dynamic Panels */}
        <div className="transition-all duration-300">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Info & Stats */}
              <Card className="md:col-span-2 space-y-6">
                <div className="border-b border-gold-300/10 pb-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gold-200">
                    Active Care Operations
                  </h3>
                  <span className="text-xs text-gold-100/50">
                    Secure Node Coverage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gold-100/50">
                      Total Submissions
                    </p>
                    <p className="text-3xl font-bold text-gold-DEFAULT">
                      {careRequests.length}
                    </p>
                    <p className="text-[10px] text-gold-100/40">
                      Care requirements requested so far.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gold-100/50">
                      Matched Matches
                    </p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {
                        careRequests.filter((r) => r.status === "Matched")
                          .length
                      }
                    </p>
                    <p className="text-[10px] text-gold-100/40">
                      Carer placement confirmed and operational.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gold-300/10 bg-navy-950/20 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gold-50">
                    Latest Request Update
                  </h4>
                  {careRequests.length > 0 ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-gold-200">
                          {careRequests[0].careType}
                        </p>
                        <p className="text-[10px] text-gold-100/50 mt-1">
                          Started: {careRequests[0].startDate} • Duration:{" "}
                          {careRequests[0].duration}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          careRequests[0].status === "Matched"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : careRequests[0].status === "Reviewing"
                              ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20"
                              : "bg-navy-950 text-gold-100/40 border border-gold-300/10"
                        }`}
                      >
                        {careRequests[0].status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gold-100/40">
                      No requests registered.
                    </p>
                  )}
                </div>
              </Card>

              {/* Fast Enquiries Summary card */}
              <Card className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
                    Support Coverage
                  </h3>

                  <div className="space-y-3">
                    {enquiries.slice(0, 2).map((enq) => (
                      <div
                        key={enq.id}
                        className="p-3 rounded-xl border border-gold-300/10 bg-navy-950/20 space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-gold-50 truncate max-w-[150px]">
                            {enq.subject}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                              enq.status === "Responded"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-gold-DEFAULT/10 text-gold-DEFAULT"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gold-100/40">
                          Preference: {enq.preference} • Date: {enq.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("enquiry")}
                  className="w-full rounded-xl bg-gold-DEFAULT py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
                >
                  Create New Enquiry
                </button>
              </Card>

              {/* Recent Portal Actions */}
              <Card className="md:col-span-3 space-y-4">
                <h4 className="text-sm font-bold text-gold-200">
                  Recent Portal Activity
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <p className="text-xs text-gold-100/70">
                      Enquiry{" "}
                      <span className="font-semibold">
                        {enquiries[0]?.id || "ENQ-901"}
                      </span>{" "}
                      has been marked as completed/responded by Grace & Goodwill
                      support staff.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
                    <span className="h-2 w-2 rounded-full bg-gold-DEFAULT shrink-0"></span>
                    <p className="text-xs text-gold-100/70">
                      New live-in carer application tracking index requested for
                      client {user?.firstName} {user?.lastName}.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: SUBMIT CARE REQUEST */}
          {activeTab === "request" && (
            <Card className="max-w-3xl mx-auto space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h3 className="text-lg font-bold text-gold-200">
                  Submit Care Requirements
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                  Specify details about the care needed. Our matching system
                  automatically aligns compatible profiles.
                </p>
              </div>

              {careSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  Care request submitted successfully! Tracking initiated in
                  dashboard.
                </div>
              )}

              <form onSubmit={handleCareSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name of Requestor"
                    value={careFullName}
                    onChange={(e) => setCareFullName(e.target.value)}
                    placeholder="Enter full name"
                    error={careErrors.fullName}
                  />

                  <Input
                    label="Contact Email"
                    value={careEmail}
                    onChange={(e) => setCareEmail(e.target.value)}
                    placeholder="Enter contact email"
                    type="email"
                    error={careErrors.email}
                  />

                  <Input
                    label="Contact Phone"
                    value={carePhone}
                    onChange={(e) => setCarePhone(e.target.value)}
                    placeholder="Enter phone number"
                    type="tel"
                    error={careErrors.phone}
                  />

                  <Select
                    label="Care Type Required"
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    options={[
                      {
                        value: "Companion Support",
                        label: "Companion Support",
                      },
                      {
                        value: "24/7 Live-in Companion Support",
                        label: "24/7 Live-in Care",
                      },
                      {
                        value: "Post-Operative Rehabilitation",
                        label: "Rehabilitation Care",
                      },
                      {
                        value: "Elderly Dementia Support",
                        label: "Dementia Support",
                      },
                    ]}
                  />

                  <Input
                    label="Preferred Start Date"
                    value={careStartDate}
                    onChange={(e) => setCareStartDate(e.target.value)}
                    type="date"
                    error={careErrors.startDate}
                  />

                  <Input
                    label="Expected Duration of Care"
                    value={careDuration}
                    onChange={(e) => setCareDuration(e.target.value)}
                    placeholder="e.g. 3 Months, Ongoing"
                    error={careErrors.duration}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    Describe the Required Support
                  </label>
                  <textarea
                    rows={4}
                    value={careSupport}
                    onChange={(e) => setCareSupport(e.target.value)}
                    placeholder="Describe specific client details, medication support, mobility support, and daily routines..."
                    className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                      careErrors.support
                        ? "border-red-500"
                        : "border-gray-300/20"
                    }`}
                  ></textarea>
                  {careErrors.support && (
                    <p className="text-xs text-red-500 font-medium">
                      {careErrors.support}
                    </p>
                  )}
                </div>

                <Input
                  label="Physical Care Address"
                  value={careAddress}
                  onChange={(e) => setCareAddress(e.target.value)}
                  placeholder="Enter full physical address where care will take place"
                  error={careErrors.address}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    Additional Family Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={careNotes}
                    onChange={(e) => setCareNotes(e.target.value)}
                    placeholder="Special dietary preferences, pets, or hobbies..."
                    className="w-full rounded-xl border border-gray-300/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="rounded-xl border border-gold-DEFAULT/20 px-6 py-3 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCareSubmitting}
                    className="rounded-xl bg-gold-DEFAULT px-6 py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCareSubmitting
                      ? "Submitting Request..."
                      : "Submit Care Request"}
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: CARER PROFILES */}
          {activeTab === "carers" && (
            <div className="space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h3 className="text-lg font-bold text-gold-200">
                  Pre-screened Carers Index
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                  Browse profiles verified by Grace & Goodwill. You can request
                  introductions directly below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockCarers.map((carer) => (
                  <Card
                    key={carer.id}
                    className="flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Avatar & Availability Badge */}
                      <div className="flex justify-between items-start">
                        <div
                          className={`h-16 w-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold shrink-0 shadow-soft ${carer.avatarBg}`}
                        >
                          {carer.name
                            .split(" ")
                            .map((n) => n.charAt(0))
                            .join("")}
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            carer.availability === "Available"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {carer.availability}
                        </span>
                      </div>

                      {/* Header details */}
                      <div>
                        <h4 className="text-lg font-bold text-gold-50">
                          {carer.name}
                        </h4>
                        <p className="text-xs text-gold-100/50 mt-0.5">
                          Professional Experience: {carer.experience}
                        </p>
                      </div>

                      {/* Specialties list */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gold-300">
                          Specialties
                        </p>
                        <p className="text-xs text-gold-100/80 leading-relaxed truncate">
                          {carer.specialties}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-gold-100/60 leading-relaxed pt-2 border-t border-gold-300/10">
                        {carer.bio}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRequestIntro(carer)}
                      className="w-full text-center rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 py-2.5 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/20 transition duration-300"
                    >
                      Request Introduction
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REQUEST TRACKING */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <div className="border-b border-gold-300/10 pb-4">
                <h3 className="text-lg font-bold text-gold-200">
                  Care Placement Progress
                </h3>
                <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                  Track requirements review and carer pairing processes in real
                  time.
                </p>
              </div>

              <div className="space-y-6">
                {careRequests.map((req) => (
                  <Card key={req.id} className="space-y-6">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-300/10 pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-300 font-bold">
                          Tracking ID: {req.id}
                        </span>
                        <h4 className="text-lg font-bold text-gold-50 mt-0.5">
                          {req.careType}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gold-100/50">
                          Expected Placement: {req.startDate}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            req.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : req.status === "Matched"
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : req.status === "Reviewing"
                                  ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/20"
                                  : "bg-navy-950 text-gold-100/40 border border-gold-300/10"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    {/* Timeline progress line */}
                    <div className="space-y-4">
                      <div className="relative flex justify-between">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-950 -translate-y-1/2 z-0 border-t border-gold-300/10"></div>
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-gold-DEFAULT -translate-y-1/2 z-0 transition-all duration-500"
                          style={{ width: `${req.progress}%` }}
                        ></div>

                        {/* Status Checkpoints */}
                        {[
                          { label: "Pending", threshold: 15 },
                          { label: "Reviewing", threshold: 45 },
                          { label: "Matched", threshold: 75 },
                          { label: "Completed", threshold: 100 },
                        ].map((cp) => {
                          const isActive = req.progress >= cp.threshold;
                          return (
                            <div
                              key={cp.label}
                              className="relative z-10 flex flex-col items-center"
                            >
                              <div
                                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                  isActive
                                    ? "bg-navy-950 border-gold-DEFAULT text-gold-DEFAULT shadow-soft"
                                    : "bg-navy-950 border-gray-300/20 text-gold-100/20"
                                }`}
                              >
                                {isActive ? "✓" : "•"}
                              </div>
                              <span
                                className={`text-[10px] font-bold mt-2 tracking-wider ${
                                  isActive
                                    ? "text-gold-200"
                                    : "text-gold-100/20"
                                }`}
                              >
                                {cp.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Summary statistics */}
                      <div className="flex justify-between items-center text-xs text-gold-100/50 pt-2 border-t border-gold-300/10">
                        <span>Allocated Duration: {req.duration}</span>
                        <span>
                          Overall Placement Completeness: {req.progress}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT & ENQUIRIES */}
          {activeTab === "enquiry" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Submission Form */}
              <Card className="md:col-span-2 space-y-6">
                <div className="border-b border-gold-300/10 pb-4">
                  <h3 className="text-lg font-bold text-gold-200">
                    Submit Support Enquiries
                  </h3>
                  <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
                    Send general inquiries or medical companion queries directly
                    to our operations office.
                  </p>
                </div>

                {enquirySuccess && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                    Enquiry message transmitted successfully! Tracking
                    initialized.
                  </div>
                )}

                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  <Input
                    label="Subject / Topic"
                    value={enquirySubject}
                    onChange={(e) => setEnquirySubject(e.target.value)}
                    placeholder="Enter short descriptive subject"
                    error={enquiryErrors.subject}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gold-200">
                      Message Details
                    </label>
                    <textarea
                      rows={5}
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Write your questions, queries, or assistance requests..."
                      className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                        enquiryErrors.message
                          ? "border-red-500"
                          : "border-gray-300/20"
                      }`}
                    ></textarea>
                    {enquiryErrors.message && (
                      <p className="text-xs text-red-500 font-medium">
                        {enquiryErrors.message}
                      </p>
                    )}
                  </div>

                  <Select
                    label="Preferred Contact Preference"
                    value={enquiryPreference}
                    onChange={(e) => setEnquiryPreference(e.target.value)}
                    options={[
                      { value: "Email", label: "Email" },
                      { value: "Phone Call", label: "Phone Call" },
                      { value: "Text Message", label: "SMS Text" },
                    ]}
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="rounded-xl border border-gold-DEFAULT/20 px-6 py-3 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEnquirySubmitting}
                      className="rounded-xl bg-gold-DEFAULT px-6 py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnquirySubmitting ? "Transmitting..." : "Send Enquiry"}
                    </button>
                  </div>
                </form>
              </Card>

              {/* History index sidebar */}
              <Card className="space-y-4">
                <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
                  Enquiry Log Book
                </h3>

                <div className="space-y-4">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-gold-50 truncate max-w-[140px]">
                          {enq.subject}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                            enq.status === "Responded"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-gold-DEFAULT/10 text-gold-DEFAULT"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>

                      <p className="text-[10px] text-gold-100/60 leading-relaxed line-clamp-2">
                        {enq.message}
                      </p>

                      <div className="flex justify-between items-center text-[8px] font-semibold text-gold-100/30 pt-1 border-t border-gold-300/5">
                        <span>Pref: {enq.preference}</span>
                        <span>Date: {enq.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* --- CONFIRMATION DIALOG MODAL FOR REQUESTING INTRODUCTION --- */}
      {selectedCarer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-gold-300/20 bg-navy-900 p-6 space-y-6 shadow-elegant">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gold-50">
                Confirm Introduction Request
              </h3>
              <p className="text-xs text-gold-100/60 leading-relaxed">
                You are requesting an introduction with **{selectedCarer.name}
                **. Our care placement manager will review your client profile
                and contact you to set up the introductory call.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg font-bold shrink-0 ${selectedCarer.avatarBg}`}
              >
                {selectedCarer.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gold-50">
                  {selectedCarer.name}
                </h4>
                <p className="text-xs text-gold-100/50">
                  {selectedCarer.experience} Experience •{" "}
                  {selectedCarer.availability}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCarer(null)}
                className="rounded-xl border border-gold-DEFAULT/20 px-5 py-2.5 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmIntroRequest}
                className="rounded-xl bg-gold-DEFAULT px-5 py-2.5 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
