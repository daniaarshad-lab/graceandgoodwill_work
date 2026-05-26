"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/Card";
import Input from "@/components/Input";

// Typings for our carer state
interface ComplianceDoc {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "verified" | "pending" | "failed";
  size: string;
  previewUrl?: string;
}

interface DayAvailability {
  enabled: boolean;
  shifts: {
    morning: boolean;   // 8:00 AM - 12:00 PM
    afternoon: boolean; // 12:00 PM - 5:00 PM
    night: boolean;     // 5:00 PM - 10:00 PM
  };
}

interface WeeklyAvailability {
  [key: string]: DayAvailability;
}

export default function CarerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "compliance" | "availability">("overview");

  // Mock State 1: Profile Information
  const [firstName, setFirstName] = useState(user?.firstName || "Alex");
  const [lastName, setLastName] = useState(user?.lastName || "Mercer");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 123-4567");
  const [email, setEmail] = useState(user?.email || "alex.mercer@graceandgoodwill.com");
  const [bio, setBio] = useState(
    "Compassionate and dedicated carer with over 5 years of professional experience in live-in care support. Specialized in palliative care, cognitive support, and elderly wellness."
  );
  const [specialties, setSpecialties] = useState("Elderly Care, Palliative, Dementia Support");
  const [experience, setExperience] = useState("5"); // Numeric only (years)
  const [address, setAddress] = useState("123 Grace Lane, Westminster, London, SW1A 1AA");
  
  // States for Profile photo upload
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  // Validation States for Profile Form
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Mock State 2: Application Review Status & Membership Card
  const [applicationStatus, setApplicationStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [membershipActive, setMembershipActive] = useState(true);
  const [membershipExpiry, setMembershipExpiry] = useState("2027-05-25");

  // Mock State 3: Compliance Documents Vault
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>([
    {
      id: "doc-1",
      name: "Driver_License_2026.pdf",
      type: "Driver's License",
      uploadDate: "2026-05-20",
      status: "verified",
      size: "1.2 MB",
      previewUrl: "/api/placeholder/license"
    },
    {
      id: "doc-2",
      name: "CRB_Background_Check.pdf",
      type: "Criminal Record Check",
      uploadDate: "2026-05-22",
      status: "pending",
      size: "2.4 MB",
      previewUrl: "/api/placeholder/crb"
    }
  ]);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);
  
  // Compliance Upload Validation States
  const [complianceError, setComplianceError] = useState<string | null>(null);
  const [complianceSuccess, setComplianceSuccess] = useState<string | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null); // elegant delete confirmation

  // Mock State 4: Weekly Availability Grid
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    Monday: { enabled: true, shifts: { morning: true, afternoon: true, night: false } },
    Tuesday: { enabled: true, shifts: { morning: true, afternoon: false, night: false } },
    Wednesday: { enabled: true, shifts: { morning: true, afternoon: true, night: true } },
    Thursday: { enabled: false, shifts: { morning: false, afternoon: false, night: false } },
    Friday: { enabled: true, shifts: { morning: false, afternoon: true, night: true } },
    Saturday: { enabled: false, shifts: { morning: false, afternoon: false, night: false } },
    Sunday: { enabled: false, shifts: { morning: false, afternoon: false, night: false } }
  });
  
  // Availability Save Validation States
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [availabilitySuccess, setAvailabilitySuccess] = useState(false);
  const [isAvailabilitySaving, setIsAvailabilitySaving] = useState(false);

  // Action 1: Save Profile Form Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(false);

    const errors: { [key: string]: string } = {};

    // First Name validation
    if (!firstName.trim()) {
      errors.firstName = "First name is required.";
    } else if (firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters.";
    }

    // Last Name validation
    if (!lastName.trim()) {
      errors.lastName = "Last name is required.";
    } else if (lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters.";
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    // Phone validation
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else {
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone.trim())) {
        errors.phone = "Please enter a valid phone number.";
      }
    }

    // Professional Experience validation (numeric check)
    if (!experience.trim()) {
      errors.experience = "Experience is required.";
    } else if (!/^\d+$/.test(experience.trim())) {
      errors.experience = "Experience must contain numeric years only.";
    }

    // Bio validation
    if (!bio.trim()) {
      errors.bio = "Biographical summary is required.";
    } else if (bio.trim().length < 20) {
      errors.bio = "Biographical summary must be at least 20 characters.";
    } else if (bio.trim().length > 500) {
      errors.bio = "Biographical summary cannot exceed 500 characters.";
    }

    // Address validation
    if (!address.trim()) {
      errors.address = "Address is required.";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setProfileErrorMsg("Please correct the errors in the profile form before saving.");
      return;
    }

    // Clear errors if validation passes
    setProfileErrors({});
    setIsProfileSaving(true);

    setTimeout(() => {
      setIsProfileSaving(false);
      setProfileSuccessMsg(true);
      setTimeout(() => setProfileSuccessMsg(false), 4000);
    }, 1200);
  };

  // Action 2: Simulate Photo Upload with Validation
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);

    if (file) {
      // Validate File Formats (JPG, JPEG, PNG only)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setPhotoError("Unsupported format. Please upload JPG, JPEG, or PNG headshots.");
        return;
      }

      // Validate File Size (Maximum size allowed is 5 MB)
      const maxPhotoSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxPhotoSize) {
        setPhotoError("File too large. Maximum size allowed is 5 MB.");
        return;
      }

      setPhotoUploading(true);
      setPhotoProgress(0);

      // Simulate a nice incremental progress bar
      const interval = setInterval(() => {
        setPhotoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhotoUploading(false);
            setProfilePhoto(URL.createObjectURL(file));
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
  };

  // Action 3: Document Upload Simulator with Validation
  const handleDocUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setComplianceError(null);
    setComplianceSuccess(null);

    if (file) {
      // Validate File Formats (PDF only)
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setComplianceError("Invalid file type. Only PDF document uploads are allowed.");
        return;
      }

      // Validate File Size (Maximum size allowed is 10 MB)
      const maxDocSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxDocSize) {
        setComplianceError(`File "${file.name}" is too large. Maximum allowed size is 10 MB.`);
        return;
      }

      setUploadingDocType(type);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingDocType(null);
            
            // Add document dynamically to vault list
            const newDoc: ComplianceDoc = {
              id: `doc-${Date.now()}`,
              name: file.name,
              type: type,
              uploadDate: new Date().toISOString().split("T")[0],
              status: "pending",
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              previewUrl: "/api/placeholder/custom"
            };
            setComplianceDocs((prevDocs) => [...prevDocs, newDoc]);
            setComplianceSuccess(`Document "${file.name}" uploaded successfully!`);
            setTimeout(() => setComplianceSuccess(null), 4000);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  // Action 4: Delete Document
  const handleDeleteDoc = (id: string) => {
    setComplianceDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Action 5: Save Availability Schedule with Validation
  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityError(null);
    setAvailabilitySuccess(false);

    // Validate Constraint: Ensure at least one active slot before save
    let isSchedulePopulated = false;
    for (const day of Object.keys(availability)) {
      const dayData = availability[day];
      if (dayData.enabled) {
        if (dayData.shifts.morning || dayData.shifts.afternoon || dayData.shifts.night) {
          isSchedulePopulated = true;
          break;
        }
      }
    }

    if (!isSchedulePopulated) {
      setAvailabilityError("Validation Failed: Please configure at least one active day and time slot before saving.");
      return;
    }

    setIsAvailabilitySaving(true);

    setTimeout(() => {
      setIsAvailabilitySaving(false);
      setAvailabilitySuccess(true);
      setTimeout(() => setAvailabilitySuccess(false), 4000);
    }, 1200);
  };

  // Action 6: Toggle Day Availability
  const handleToggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        shifts: !prev[day].enabled
          ? { morning: true, afternoon: true, night: false } // default active shifts when turning day on
          : { morning: false, afternoon: false, night: false }
      }
    }));
  };

  // Action 7: Toggle Day Shift Slot
  const handleToggleShift = (day: string, shift: "morning" | "afternoon" | "night") => {
    if (!availability[day].enabled) return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: {
          ...prev[day].shifts,
          [shift]: !prev[day].shifts[shift]
        }
      }
    }));
  };

  return (
    <main className="min-h-screen bg-navy-950 px-4 py-10 md:px-8 text-gold-100">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Hero Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 md:p-8 shadow-elegant backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-3xl font-bold text-gold-DEFAULT shadow-soft">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Avatar Preview" className="h-full w-full object-cover" />
                ) : (
                  `${firstName.charAt(0)}${lastName.charAt(0)}`
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                <span className="text-[10px] text-gold-DEFAULT font-semibold">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={photoUploading} />
              </label>
            </div>
            
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Carer Dashboard</p>
              <h1 className="text-3xl font-semibold text-gold-50 mt-1">{firstName} {lastName}</h1>
              <p className="text-sm text-gold-100/60 mt-1">{email} • {phone}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="rounded-xl border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT transition hover:bg-gold-DEFAULT/10 hover:border-gold-DEFAULT"
          >
            Log Out
          </button>
        </section>

        {/* Tabbed Menu Navigation */}
        <div className="flex border-b border-gold-300/10 pb-1 overflow-x-auto gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "profile", label: "My Profile" },
            { id: "compliance", label: "Compliance Vault" },
            { id: "availability", label: "Availability" }
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

        {/* Dynamic Panels */}
        <div className="transition-all duration-500">
          
          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Application Review Status Badges Widget */}
              <Card className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
                  <h3 className="text-lg font-bold text-gold-200">Application Progress</h3>
                  <span className="text-xs text-gold-100/50">Status ID: GGW-2026-CARER</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  
                  {/* Status Indicator Badger */}
                  <div className="sm:col-span-2 space-y-2">
                    <p className="text-sm text-gold-100/70">
                      Your professional live-in carer application is currently in review by our care managers.
                    </p>
                    <p className="text-xs text-gold-100/50">
                      We are currently verifying background reports and licenses uploaded.
                    </p>
                  </div>
                  
                  <div className="flex justify-center sm:justify-end">
                    {applicationStatus === "pending" && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-gold-DEFAULT/30 bg-gold-DEFAULT/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-DEFAULT">
                        <span className="h-2.5 w-2.5 rounded-full bg-gold-DEFAULT animate-pulse"></span>
                        Pending Review
                      </span>
                    )}
                    {applicationStatus === "approved" && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                        Approved
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar visual indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gold-100/50">
                    <span>Credentials Validation</span>
                    <span>75% Verified</span>
                  </div>
                  <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-gold-300/10">
                    <div className="h-full bg-gold-DEFAULT rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </Card>

              {/* Membership Status elegant card UI */}
              <Card className="border-gold-300/20 bg-gradient-to-br from-navy-900/60 to-navy-950/80 shadow-elegant flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gold-300">Grace & Goodwill</p>
                      <h4 className="text-lg font-bold text-gold-50 mt-1">Carer Premium Node</h4>
                    </div>
                    {membershipActive ? (
                      <span className="rounded-full bg-gold-DEFAULT/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-DEFAULT border border-gold-DEFAULT/30">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-500/30">
                        Expired
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gold-100/50">Expiry Date:</span>
                      <span className="text-gold-200 font-semibold">{membershipExpiry}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gold-100/50">Billing Node:</span>
                      <span className="text-gold-200 font-semibold">Annual Coverage</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert("Billing portal connection is in mockup simulation state.")}
                  className="w-full text-center rounded-xl bg-gold-DEFAULT py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
                >
                  Renew / Review Plan
                </button>
              </Card>

              {/* Profile completeness Quick Stats widget */}
              <Card className="space-y-4">
                <h4 className="font-bold text-gold-200 text-sm">Dashboard Overview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 text-center">
                    <p className="text-2xl font-semibold text-gold-50">{complianceDocs.length}</p>
                    <p className="text-[10px] text-gold-100/50 mt-1 uppercase tracking-wider">Docs Uploaded</p>
                  </div>
                  <div className="rounded-2xl border border-gold-300/10 bg-navy-950/40 p-4 text-center">
                    <p className="text-2xl font-semibold text-gold-50">
                      {Object.values(availability).filter(day => day.enabled).length} Days
                    </p>
                    <p className="text-[10px] text-gold-100/50 mt-1 uppercase tracking-wider">Available / Wk</p>
                  </div>
                </div>
              </Card>

              {/* Quick links & notifications panel */}
              <Card className="md:col-span-2 space-y-4">
                <h4 className="font-bold text-gold-200 text-sm">Action Required</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-gold-DEFAULT"></span>
                      <span className="text-xs text-gold-100/80">Submit your final CRB Criminal Record Check document for verification.</span>
                    </div>
                    <button onClick={() => setActiveTab("compliance")} className="text-xs font-semibold text-gold-DEFAULT hover:underline">
                      Upload
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl border border-gold-300/10 bg-navy-950/30">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-xs text-gold-100/80">Specialty training certification verified by support team!</span>
                    </div>
                    <span className="text-[10px] text-gold-100/40 font-semibold">Verified</span>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {/* TAB 2: PROFILE PANEL (CREATE & EDIT PROFILE + PHOTO UPLOADER) */}
          {activeTab === "profile" && (
            <Card className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">Personal Profile Management</h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-gold-300/10 bg-navy-950/30">
                  <div className="relative group">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT shadow-soft">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile Avatar" className="h-full w-full object-cover" />
                      ) : (
                        `${firstName.charAt(0)}${lastName.charAt(0)}`
                      )}
                    </div>
                    
                    {photoUploading && (
                      <div className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center p-2">
                        <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-[9px] text-gold-DEFAULT mt-1">{photoProgress}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-grow text-center sm:text-left">
                    <h4 className="text-sm font-semibold text-gold-50">Profile Picture</h4>
                    <p className="text-xs text-gold-100/50">Upload a professional high-resolution headshot. Supports JPEG, PNG formats.</p>
                    {photoError && <p className="text-xs text-red-500 font-medium">{photoError}</p>}
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/20 transition-all duration-300">
                      Upload New Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={photoUploading} />
                    </label>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    error={profileErrors.firstName}
                  />

                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    error={profileErrors.lastName}
                  />

                  <Input
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    type="email"
                    error={profileErrors.email}
                  />

                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    type="tel"
                    error={profileErrors.phone}
                  />

                  <Input
                    label="Care Specialties"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    placeholder="e.g. Cognitive Support, Elderly Care"
                  />

                  <Input
                    label="Professional Experience (Years)"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5"
                    error={profileErrors.experience}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">Biographical Summary</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a warm, compassionate bio for matching with care recipients..."
                    className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                      profileErrors.bio ? "border-red-500" : "border-gray-300/20"
                    }`}
                  ></textarea>
                  {profileErrors.bio && <p className="text-xs text-red-500 font-medium">{profileErrors.bio}</p>}
                </div>

                <Input
                  label="Contact Address Details"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full physical address"
                  error={profileErrors.address}
                />

                {profileErrorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                    {profileErrorMsg}
                  </div>
                )}

                {profileSuccessMsg && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                    Profile successfully updated and saved in memory!
                  </div>
                )}

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
                    disabled={isProfileSaving}
                    className="rounded-xl bg-gold-DEFAULT px-6 py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProfileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: COMPLIANCE VAULT PANEL (COMPLIANCE DOCUMENTS UPLOAD & LISTS) */}
          {activeTab === "compliance" && (
            <div className="space-y-6">
              
              {complianceError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500 max-w-4xl mx-auto">
                  {complianceError}
                </div>
              )}

              {complianceSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400 max-w-4xl mx-auto">
                  {complianceSuccess}
                </div>
              )}

              {/* Main Document Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File Upload Dropzones Card */}
                <Card className="space-y-6">
                  <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">Compliance Document Upload</h3>
                  <p className="text-xs text-gold-100/60 leading-relaxed">
                    Upload official PDF scans of your credentials to become a verified live-in carer. Ensure documents are clearly readable.
                  </p>
                  
                  {/* Reusable document type uploads */}
                  {[
                    "Driver's License",
                    "Criminal Record Check",
                    "Dementia Support Certificate",
                    "Nurses Registry License"
                  ].map((docType) => {
                    const isDocUploading = uploadingDocType === docType;
                    return (
                      <div key={docType} className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <h4 className="text-xs font-semibold text-gold-50">{docType}</h4>
                          <p className="text-[10px] text-gold-100/50">Required for credential validation</p>
                        </div>

                        {isDocUploading ? (
                          <div className="w-full sm:w-auto flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-navy-950 rounded-full overflow-hidden border border-gold-300/10">
                              <div className="h-full bg-gold-DEFAULT rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-gold-DEFAULT font-bold">{uploadProgress}%</span>
                          </div>
                        ) : (
                          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 px-3.5 py-1.5 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/20 transition-all duration-300">
                            Upload PDF
                            <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleDocUpload(docType, e)} />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </Card>
 
                {/* Vault Documents Uploaded List */}
                <Card className="space-y-6">
                  <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">Compliance Records Vault</h3>
                  
                  {complianceDocs.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <div className="mx-auto h-12 w-12 rounded-full border border-dashed border-gold-300/30 flex items-center justify-center text-gold-100/40">
                        📄
                      </div>
                      <p className="text-xs text-gold-100/40">No documents uploaded yet. Upload items on the left to populate vault.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complianceDocs.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="shrink-0 h-10 w-10 rounded-lg bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-lg text-gold-DEFAULT">
                              📄
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-semibold text-gold-50 truncate">{doc.name}</h4>
                              <p className="text-[9px] text-gold-100/40 mt-0.5">{doc.type} • {doc.size}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.status === "verified" ? (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                                Verified
                              </span>
                            ) : (
                              <span className="rounded-full bg-gold-DEFAULT/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold-DEFAULT border border-gold-DEFAULT/20">
                                Pending
                              </span>
                            )}
                            
                            {/* Actions buttons */}
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-1.5 text-xs text-gold-200 hover:text-gold-50"
                              title="Preview"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => setDocToDelete(doc.id)}
                              className="p-1.5 text-xs text-red-500 hover:text-red-400"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

              </div>

              {/* PDF Preview Modal Overlay */}
              {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
                  <div className="w-full max-w-2xl rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant space-y-4">
                    <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-gold-50">{previewDoc.name}</h4>
                        <p className="text-[10px] text-gold-100/50 mt-0.5">{previewDoc.type} • Mock Document Previewer</p>
                      </div>
                      <button onClick={() => setPreviewDoc(null)} className="text-lg text-gold-200 hover:text-gold-50">
                        ✕
                      </button>
                    </div>

                    {/* Mock document visual scan placeholder */}
                    <div className="h-80 w-full rounded-xl border border-gold-300/10 bg-navy-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center text-4xl text-gold-DEFAULT">
                        📄
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-semibold text-gold-200">Grace & Goodwill Document Scanner</h5>
                        <p className="text-xs text-gold-100/60 max-w-sm mx-auto">
                          [Mocked PDF rendering of {previewDoc.type}]. Secure storage node confirmed. Credential verification matches user registry.
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 rounded-full">
                        Secure SSL Validated
                      </span>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setPreviewDoc(null)}
                        className="rounded-xl bg-gold-DEFAULT px-5 py-2.5 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Styled Confirmation Dialog Modal */}
              {docToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
                  <div className="w-full max-w-sm rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant space-y-4">
                    <h4 className="text-base font-bold text-gold-50">Confirm Deletion</h4>
                    <p className="text-xs text-gold-100/70">
                      Are you sure you want to permanently delete this compliance document? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setDocToDelete(null)}
                        className="rounded-xl border border-gold-300/20 text-gold-200 px-4 py-2 text-xs font-semibold hover:bg-gold-300/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteDoc(docToDelete);
                          setDocToDelete(null);
                          setComplianceSuccess("Document successfully deleted.");
                          setTimeout(() => setComplianceSuccess(null), 4000);
                        }}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: AVAILABILITY Grid Management */}
          {activeTab === "availability" && (
            <Card className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-gold-300/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gold-200">Weekly Availability Schedule</h3>
                  <p className="text-xs text-gold-100/50 mt-1">Configure your weekly slots and shift preferences for client assignment.</p>
                </div>
                <button
                  onClick={handleSaveAvailability}
                  disabled={isAvailabilitySaving}
                  className="rounded-xl bg-gold-DEFAULT px-5 py-2.5 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAvailabilitySaving ? "Saving..." : "Save Schedule"}
                </button>
              </div>

              {availabilityError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                  {availabilityError}
                </div>
              )}

              {availabilitySuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  Availability schedule successfully updated and saved in memory!
                </div>
              )}

              {/* Weekly grid map */}
              <div className="space-y-4">
                {Object.keys(availability).map((day) => {
                  const dayData = availability[day];
                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-2xl border transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        dayData.enabled
                          ? "border-gold-300/20 bg-navy-950/40"
                          : "border-gold-300/5 bg-navy-950/10 opacity-60"
                      }`}
                    >
                      {/* Day and Toggle switch */}
                      <div className="flex items-center gap-4 min-w-[150px]">
                        <button
                          disabled={isAvailabilitySaving}
                          onClick={() => handleToggleDay(day)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            dayData.enabled ? "bg-gold-DEFAULT" : "bg-navy-800"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-navy-950 shadow ring-0 transition duration-200 ease-in-out ${
                              dayData.enabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          ></span>
                        </button>
                        <div>
                          <h4 className="text-sm font-semibold text-gold-50">{day}</h4>
                          <p className="text-[10px] text-gold-100/40">
                            {dayData.enabled ? "Available for Shifts" : "Unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* Shift Options */}
                      <div className="flex-grow grid grid-cols-3 gap-3 w-full md:w-auto">
                        {[
                          { id: "morning", label: "Morning", time: "8am - 12pm" },
                          { id: "afternoon", label: "Afternoon", time: "12pm - 5pm" },
                          { id: "night", label: "Night", time: "5pm - 10pm" }
                        ].map((shift) => {
                          const isSelected = dayData.shifts[shift.id as "morning" | "afternoon" | "night"];
                          return (
                            <button
                              key={shift.id}
                              disabled={!dayData.enabled || isAvailabilitySaving}
                              onClick={() => handleToggleShift(day, shift.id as any)}
                              className={`p-3 rounded-xl border text-center transition-all duration-300 select-none ${
                                !dayData.enabled
                                  ? "border-gold-300/5 bg-transparent cursor-not-allowed text-gold-100/20"
                                  : isSelected
                                  ? "border-gold-DEFAULT bg-gold-DEFAULT/10 text-gold-DEFAULT"
                                  : "border-gold-300/10 bg-navy-900/40 text-gold-200/60 hover:border-gold-DEFAULT/40"
                              }`}
                            >
                              <h5 className="text-xs font-semibold">{shift.label}</h5>
                              <p className="text-[9px] mt-0.5 opacity-60">{shift.time}</p>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            </Card>
          )}

        </div>

      </div>
    </main>
  );
}
