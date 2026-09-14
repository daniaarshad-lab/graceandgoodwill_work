import { ChangeEvent, FormEvent, useState } from "react";
import { Pencil, Share2 } from "lucide-react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
import { DocumentFileType } from "@/types/document.types";

interface ProfileManagementProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  specialties: string;
  setSpecialties: (val: string) => void;
  experience: string;
  setExperience: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  bankName?: string;
  setBankName?: (val: string) => void;
  accountName?: string;
  setAccountName?: (val: string) => void;
  accountNumber?: string;
  setAccountNumber?: (val: string) => void;
  sortCode?: string;
  setSortCode?: (val: string) => void;
  nationalInsuranceNumber?: string;
  setNationalInsuranceNumber?: (val: string) => void;
  canDrive: "yes" | "no" | "";
  setCanDrive: (val: "yes" | "no" | "") => void;
  hasBusinessInsurance: "yes" | "no" | "";
  setHasBusinessInsurance: (val: "yes" | "no" | "") => void;
  handleDocUpload: (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  uploadingDocType: string | null;
  uploadProgress: number;
  errors: Record<string, string>;
  isProfileSaving: boolean;
  onSubmit: (e: FormEvent) => void;
  setActiveTab: (tab: any) => void;
  complianceDocs?: ComplianceDoc[];
  onShareClick?: () => void;
}

export default function ProfileManagement({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  bio,
  setBio,
  specialties,
  setSpecialties,
  experience,
  setExperience,
  address,
  setAddress,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  sortCode,
  setSortCode,
  nationalInsuranceNumber,
  setNationalInsuranceNumber,
  canDrive,
  setCanDrive,
  hasBusinessInsurance,
  setHasBusinessInsurance,
  handleDocUpload,
  uploadingDocType,
  uploadProgress,
  errors,
  isProfileSaving,
  onSubmit,
  setActiveTab,
  complianceDocs = [],
}: ProfileManagementProps) {
  const [activeSection, setActiveSection] = useState<
    "personal" | "professional" | "financial"
  >("personal");
  const [isEditing, setIsEditing] = useState(false);

  const hasBusinessInsuranceDoc = complianceDocs?.some(
    (d: ComplianceDoc) =>
      d.type === DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24">
      <SectionCard className="w-full space-y-6">
        <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
          <h3 className="text-lg font-bold text-gold-200">
            Personal Profile Management
          </h3>
          <div className="flex items-center gap-3">
            <button
              id="profile-section-share-btn"
              type="button"
              onClick={onShareClick || (() => setActiveTab("profile"))}
              style={{
                background: "linear-gradient(135deg, #F5D4A0 0%, #D4AF37 50%, #C99232 100%)",
                color: "#0A1128",
                border: "1px solid rgba(253, 230, 196, 0.5)",
              }}
              className="px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-[0_4px_15px_rgba(212,175,55,0.35)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Share Public Profile"
            >
              <Share2 className="w-4 h-4 text-[#0A1128]" />
              <span className="font-bold text-[#0A1128]">Share Profile</span>
            </button>
            <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium border ${
              isEditing
                ? "bg-gold-DEFAULT/10 border-gold-DEFAULT/30 text-gold-DEFAULT shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "bg-navy-900 border-gold-300/10 text-gold-200/60 hover:text-gold-100 hover:border-gold-300/30 hover:bg-navy-800"
            }`}
            title={isEditing ? "Stop Editing" : "Edit Profile"}
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? "Editing Mode" : "Edit Profile"}
          </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 border-b border-gold-300/10 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveSection("personal")}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === "personal"
                ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gold-200/50 hover:bg-navy-900 hover:text-gold-100 border border-transparent"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Personal Details
            {(errors.firstName ||
              errors.lastName ||
              errors.address ||
              errors.bio) && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-navy-950 animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("professional")}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === "professional"
                ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gold-200/50 hover:bg-navy-900 hover:text-gold-100 border border-transparent"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Professional Profile
            {errors.experience && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-navy-950 animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("financial")}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeSection === "financial"
                ? "bg-gold-DEFAULT/10 text-gold-DEFAULT border border-gold-DEFAULT/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "text-gold-200/50 hover:bg-navy-900 hover:text-gold-100 border border-transparent"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Financial & Legal
            {(errors.bankName ||
              errors.accountName ||
              errors.accountNumber ||
              errors.sortCode) && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-navy-950 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="min-h-[400px]">
          {/* PERSONAL SECTION */}
          {activeSection === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                error={errors.firstName}
                disabled={!isEditing}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                error={errors.lastName}
                disabled={!isEditing}
              />
              <div>
                <Input
                  label="Email Address"
                  value={email}
                  onChange={() => {}} // Read-only
                  placeholder="Enter email"
                  type="email"
                  disabled
                />
                <p className="text-[10px] text-gold-200/50 mt-1.5">
                  Cannot be changed after registration.
                </p>
              </div>
              <div>
                <PhoneInput
                  label="Phone Number"
                  value={phone}
                  onChange={() => {}} // Read-only
                  placeholder="Enter phone number"
                  disabled
                />
                <p className="text-[10px] text-gold-200/50 mt-1.5">
                  Cannot be changed after registration.
                </p>
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Home Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full physical address"
                  error={errors.address}
                  disabled={!isEditing}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gold-200">
                  Biographical Summary
                </label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a warm, compassionate bio for matching with care recipients..."
                  disabled={!isEditing}
                  className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${errors.bio ? "border-red-500" : "border-gray-300/20"} ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                ></textarea>
                {errors.bio && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.bio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PROFESSIONAL SECTION */}
          {activeSection === "professional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Input
                label="Care Specialties"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="e.g. Cognitive Support, Elderly Care"
                disabled={!isEditing}
              />
              <Input
                label="Professional Experience (Years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5"
                error={errors.experience}
                disabled={!isEditing}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold-200">
                  Do you drive?
                </label>
                <div
                  className={`flex h-[42px] items-center gap-6 px-4 rounded-xl border border-gray-300/20 bg-navy-950 text-sm ${!isEditing ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <label className="flex items-center gap-2 text-gold-100 cursor-pointer">
                    <input
                      type="radio"
                      name="canDrive"
                      value="yes"
                      checked={canDrive === "yes"}
                      onChange={(e) => setCanDrive(e.target.value as any)}
                      className="accent-gold-DEFAULT"
                      disabled={!isEditing}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-gold-100 cursor-pointer">
                    <input
                      type="radio"
                      name="canDrive"
                      value="no"
                      checked={canDrive === "no"}
                      onChange={(e) => setCanDrive(e.target.value as any)}
                      className="accent-gold-DEFAULT"
                      disabled={!isEditing}
                    />
                    No
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold-200">
                  Do you have business insurance?
                </label>
                <div
                  className={`flex h-[42px] items-center gap-6 px-4 rounded-xl border border-gray-300/20 bg-navy-950 text-sm ${!isEditing ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <label className="flex items-center gap-2 text-gold-100 cursor-pointer">
                    <input
                      type="radio"
                      name="hasBusinessInsurance"
                      value="yes"
                      checked={hasBusinessInsurance === "yes"}
                      onChange={(e) =>
                        setHasBusinessInsurance(e.target.value as any)
                      }
                      className="accent-gold-DEFAULT"
                      disabled={!isEditing}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-gold-100 cursor-pointer">
                    <input
                      type="radio"
                      name="hasBusinessInsurance"
                      value="no"
                      checked={hasBusinessInsurance === "no"}
                      onChange={(e) =>
                        setHasBusinessInsurance(e.target.value as any)
                      }
                      className="accent-gold-DEFAULT"
                      disabled={!isEditing}
                    />
                    No
                  </label>
                </div>
              </div>
              {hasBusinessInsurance === "yes" && (
                <div className="md:col-span-2 mt-2 p-5 border border-gold-300/20 rounded-xl bg-navy-900/30">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gold-200">
                      Business Insurance Certificate
                    </label>
                    {hasBusinessInsuranceDoc && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        File Uploaded
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleDocUpload("Business Insurance", e)}
                      className="hidden"
                      id="business-insurance-upload"
                      disabled={
                        uploadingDocType === "Business Insurance" || !isEditing
                      }
                    />
                    <label
                      htmlFor="business-insurance-upload"
                      className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gold-DEFAULT text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-colors rounded-lg text-sm font-medium ${!isEditing ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {uploadingDocType === "Business Insurance"
                        ? "Uploading..."
                        : hasBusinessInsuranceDoc
                          ? "Replace Document"
                          : "Select File"}
                    </label>
                    {uploadingDocType === "Business Insurance" && (
                      <div className="flex-1 max-w-[200px]">
                        <div className="h-2 bg-navy-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-DEFAULT transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {hasBusinessInsurance === "no" && (
                <div className="md:col-span-2 mt-2 p-4 border border-blue-500/30 rounded-xl bg-blue-500/10 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-blue-200 leading-relaxed">
                    We recommend carers to get business insurance if they are
                    happy to drive a client. We pay extra for carers who drive.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FINANCIAL SECTION */}
          {activeSection === "financial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {setBankName ? (
                <>
                  <Input
                    label="Bank Name"
                    value={bankName || ""}
                    onChange={(e) => setBankName?.(e.target.value)}
                    placeholder="e.g. Barclays"
                    error={errors.bankName}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Name on the Account"
                    value={accountName || ""}
                    onChange={(e) => setAccountName?.(e.target.value)}
                    placeholder="e.g. John Smith"
                    error={errors.accountName}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Account Number"
                    value={accountNumber || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setAccountNumber?.(val);
                    }}
                    placeholder="8-digit Account Number"
                    error={errors.accountNumber}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Sort Code"
                    value={sortCode || ""}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      if (val.length > 4)
                        val = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
                      else if (val.length > 2)
                        val = `${val.slice(0, 2)}-${val.slice(2)}`;
                      setSortCode?.(val);
                    }}
                    placeholder="XX-XX-XX"
                    error={errors.sortCode}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="National Insurance Number"
                      value={nationalInsuranceNumber || ""}
                      onChange={() => {}} // Read-only
                      disabled
                      placeholder="e.g. AB123456C"
                    />
                    <p className="text-[10px] text-gold-200/50 mt-1.5">
                      National Insurance Number cannot be changed after
                      registration. Please contact the administrator if this
                      information needs updating.
                    </p>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2 py-8 text-center text-gold-200/50">
                  Banking details are managed securely via your payment portal.
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ACTIONS - Below the card */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-xs text-gold-200/50">
          {Object.keys(errors).length > 0 && (
            <span className="text-red-400 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Please resolve the errors highlighted above.
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setActiveTab("overview");
            }}
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
            disabled={!isEditing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e: any) => {
              onSubmit(e);
              setIsEditing(false);
            }}
            disabled={isProfileSaving || !isEditing}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            {isProfileSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
