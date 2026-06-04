import { ChangeEvent, FormEvent } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import UploadPhotoSection from "./UploadPhotoSection";
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
  profilePhoto: string | null;
  photoUploading: boolean;
  photoProgress: number;
  photoError: string | null;
  handlePhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  errorMsg: string | null;
  successMsg: boolean;
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
  profilePhoto,
  photoUploading,
  photoProgress,
  photoError,
  handlePhotoChange,
  errors,
  errorMsg,
  successMsg,
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
        <UploadPhotoSection
          profilePhoto={profilePhoto}
          photoUploading={photoUploading}
          photoProgress={photoProgress}
          photoError={photoError}
          handlePhotoChange={handlePhotoChange}
        />

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

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Profile successfully updated and saved in memory!
          </div>
        )}

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
