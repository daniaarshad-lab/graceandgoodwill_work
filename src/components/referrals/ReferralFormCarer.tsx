import React, { useState, useRef } from "react";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
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

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      tempErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        tempErrors.email = "Please enter a valid email address";
      }
    }

    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    }

    if (!resume) {
      tempErrors.resume = "Please upload a CV/Resume";
    } else if (fileError) {
      tempErrors.resume = fileError;
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.email;
          return copy;
        });
      } else {
        if (errors.email) {
          setErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address",
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
      const msg = "Invalid format. Please upload PDF, DOC, or DOCX";
      setFileError(msg);
      setResume(null);
      setErrors((prev) => ({ ...prev, resume: msg }));
      return;
    }

    // Check size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const msg = "File size exceeds 10MB limit";
      setFileError(msg);
      setResume(null);
      setErrors((prev) => ({ ...prev, resume: msg }));
      return;
    }

    setFileError("");
    setResume(file);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
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
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: "Please upload a CV/Resume" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("email", email.trim());
    formData.append("phoneNumber", phone.trim());
    formData.append("cv", resume!);
    if (notes.trim()) {
      formData.append("notes", notes.trim());
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
      setErrors({});
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col justify-between rounded-3xl border border-gold-300/10 bg-navy-900/40 p-4 sm:p-6 lg:p-8 shadow-elegant backdrop-blur-md space-y-6"
    >
      <div className="space-y-6 flex-grow flex flex-col">
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
          <Input
            label="First Name *"
            placeholder="e.g. Robert"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            disabled={submitting}
            error={errors.firstName}
          />

          <Input
            label="Last Name *"
            placeholder="e.g. Downey"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            disabled={submitting}
            error={errors.lastName}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. robert.d@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={submitting}
            error={errors.email}
          />

          <PhoneInput
            label="Phone Number *"
            placeholder="e.g. +44 7700 900088"
            value={phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            disabled={submitting}
          />
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
                  Supports PDF, DOC, DOCX up to 10MB.
                </p>
              </div>
            )}
          </div>
          {errors.resume && (
            <p className="text-[10px] font-semibold text-rose-400 mt-1">
              ⚠️ {errors.resume}
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
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="md"
          fullWidth
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent animate-spin rounded-full"></span>
              Submitting...
            </span>
          ) : (
            "Submit Referral"
          )}
        </Button>
      </div>
    </form>
  );
}
