import { ChangeEvent, FormEvent } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";

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
  canDrive: "yes" | "no" | "";
  setCanDrive: (val: "yes" | "no" | "") => void;
  hasBusinessInsurance: "yes" | "no" | "";
  setHasBusinessInsurance: (val: "yes" | "no" | "") => void;
  handleDocUpload: (type: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingDocType: string | null;
  uploadProgress: number;
  errors: Record<string, string>;
  isProfileSaving: boolean;
  onSubmit: (e: FormEvent) => void;
  setActiveTab: (
    tab: "overview" | "profile" | "compliance" | "availability",
  ) => void;
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
}: ProfileManagementProps) {
  return (
    <SectionCard className="max-w-3xl mx-auto space-y-6">
      <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
        Personal Profile Management
      </h3>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            error={errors.lastName}
          />

          <Input
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            type="email"
            error={errors.email}
          />

          <PhoneInput
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
            error={errors.phone}
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
            error={errors.experience}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Biographical Summary
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a warm, compassionate bio for matching with care recipients..."
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
              errors.bio ? "border-red-500" : "border-gray-300/20"
            }`}
          ></textarea>
          {errors.bio && (
            <p className="text-xs text-red-500 font-medium">{errors.bio}</p>
          )}
        </div>

        <Input
          label="Contact Address Details"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full physical address"
          error={errors.address}
        />

        <div className="space-y-4 border-t border-gold-300/10 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gold-200">
              Do you drive?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gold-100">
                <input
                  type="radio"
                  name="canDrive"
                  value="yes"
                  checked={canDrive === "yes"}
                  onChange={() => setCanDrive("yes")}
                  className="text-gold-DEFAULT focus:ring-gold-DEFAULT bg-navy-950 border-gray-300/20"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-gold-100">
                <input
                  type="radio"
                  name="canDrive"
                  value="no"
                  checked={canDrive === "no"}
                  onChange={() => setCanDrive("no")}
                  className="text-gold-DEFAULT focus:ring-gold-DEFAULT bg-navy-950 border-gray-300/20"
                />
                No
              </label>
            </div>
          </div>

          {canDrive === "yes" && (
            <div className="space-y-2 pl-4 border-l-2 border-gold-300/20">
              <label className="text-sm font-medium text-gold-200">
                Do you have business insurance?
              </label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-gold-100">
                  <input
                    type="radio"
                    name="hasBusinessInsurance"
                    value="yes"
                    checked={hasBusinessInsurance === "yes"}
                    onChange={() => setHasBusinessInsurance("yes")}
                    className="text-gold-DEFAULT focus:ring-gold-DEFAULT bg-navy-950 border-gray-300/20"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-gold-100">
                  <input
                    type="radio"
                    name="hasBusinessInsurance"
                    value="no"
                    checked={hasBusinessInsurance === "no"}
                    onChange={() => setHasBusinessInsurance("no")}
                    className="text-gold-DEFAULT focus:ring-gold-DEFAULT bg-navy-950 border-gray-300/20"
                  />
                  No
                </label>
              </div>

              {hasBusinessInsurance === "yes" && (
                <div className="mt-4 p-4 border border-gold-300/20 rounded-xl bg-navy-900/50">
                  <label className="text-sm font-medium text-gold-200 block mb-2">
                    Upload Business Insurance Certificate
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleDocUpload("Business Insurance", e)}
                      className="hidden"
                      id="business-insurance-upload"
                      disabled={uploadingDocType === "Business Insurance"}
                    />
                    <label
                      htmlFor="business-insurance-upload"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gold-DEFAULT text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-colors rounded-lg text-sm font-medium"
                    >
                      {uploadingDocType === "Business Insurance"
                        ? "Uploading..."
                        : "Select File"}
                    </label>
                    {uploadingDocType === "Business Insurance" && (
                      <div className="flex-1 max-w-xs">
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
                <div className="mt-4 p-4 border border-blue-500/30 rounded-xl bg-blue-500/10">
                  <p className="text-sm text-blue-200">
                    We recommend carers to get business insurance if they are happy to drive a client. We pay extra for carers who drive.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={() => setActiveTab("overview")}
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isProfileSaving}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            {isProfileSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
