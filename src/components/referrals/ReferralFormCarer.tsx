import React, { useState, useRef } from "react";
import Button from "@/components/Button";
import { toast } from "sonner";

interface ReferralFormCarerProps {
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export default function ReferralFormCarer({
  onSubmit,
  submitting,
}: ReferralFormCarerProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  // Validation error states
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [fileError, setFileError] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!val) return true;
    // Simple phone pattern check: at least 7 digits, allowed chars: +, space, digits, brackets
    const phoneRegex = /^[+\s()0-9]{7,20}$/;
    if (!phoneRegex.test(val)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFile = (file: File) => {
    const validExtensions = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setFileError("Invalid format. Please upload PDF, DOC, or DOCX");
      setResume(null);
      return;
    }

    // Check size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit");
      setResume(null);
      return;
    }

    setFileError("");
    setResume(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResume(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission check
  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    resume !== null &&
    !emailError &&
    !phoneError &&
    !fileError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !resume) return;

    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);

    if (!isEmailValid || !isPhoneValid) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("resume", resume);
    if (notes) {
      formData.append("notes", notes);
    }

    const success = await onSubmit(formData);
    if (success) {
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setResume(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gold-300/10 bg-navy-900/40 p-6 sm:p-8 shadow-elegant backdrop-blur-md space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-gold-200 tracking-tight">
          Refer a Colleague (Carer Referral)
        </h3>
        <p className="text-xs text-gold-100/50 mt-1">
          Introduce qualified carer candidates to Grace & Goodwill and track
          their onboard progress.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
            First Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Robert"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
            Last Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Downey"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. robert.d@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            onBlur={(e) => validateEmail(e.target.value)}
            disabled={submitting}
            className={`w-full rounded-xl bg-navy-950/80 border px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 ${
              emailError
                ? "border-rose-500/50 focus:border-rose-500"
                : "border-gold-300/15 focus:border-gold"
            }`}
          />
          {emailError && (
            <p className="text-[10px] font-semibold text-rose-400 mt-1">
              ⚠️ {emailError}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +44 7700 900088"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) validatePhone(e.target.value);
            }}
            onBlur={(e) => validatePhone(e.target.value)}
            disabled={submitting}
            className={`w-full rounded-xl bg-navy-950/80 border px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 ${
              phoneError
                ? "border-rose-500/50 focus:border-rose-500"
                : "border-gold-300/15 focus:border-gold"
            }`}
          />
          {phoneError && (
            <p className="text-[10px] font-semibold text-rose-400 mt-1">
              ⚠️ {phoneError}
            </p>
          )}
        </div>
      </div>

      {/* Drag & Drop Resume Upload */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
          CV/Resume Upload (PDF, DOC, DOCX) *
        </label>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-gold bg-gold/5 scale-[1.01]"
              : resume
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-gold-300/20 bg-navy-950/50 hover:bg-navy-950/80 hover:border-gold-300/45"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
            disabled={submitting}
          />

          {resume ? (
            <div className="space-y-3 w-full max-w-xs">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                📄
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 truncate">
                  {resume.name}
                </p>
                <p className="text-[10px] text-gold-100/40 mt-0.5">
                  {(resume.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 underline"
              >
                Change File
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">📤</div>
              <div className="text-xs font-semibold text-gold-200">
                Drag and drop resume here, or{" "}
                <span className="text-gold border-b border-gold/40 hover:border-gold">
                  browse files
                </span>
              </div>
              <p className="text-[10px] text-gold-100/30">
                Supports PDF, DOC, DOCX up to 5MB.
              </p>
            </div>
          )}
        </div>
        {fileError && (
          <p className="text-[10px] font-semibold text-rose-400 mt-1">
            ⚠️ {fileError}
          </p>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Enter details about their credentials, experience, or relationship..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={submitting}
          className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isFormValid || submitting}
          variant="primary"
          size="md"
          fullWidth
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent animate-spin rounded-full"></span>
              Submitting Referral...
            </span>
          ) : (
            "Submit Referral"
          )}
        </Button>
      </div>
    </form>
  );
}
