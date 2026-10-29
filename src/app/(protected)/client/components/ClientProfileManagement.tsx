"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, Check, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateClientProfile,
  fetchClientProfile,
} from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import GoogleAddressAutocomplete from "@/components/GoogleAddressAutocomplete";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import {
  CLIENT_PROFILE_AVATAR_PRESETS,
  DEFAULT_MARGARET_AVATAR,
} from "@/data/care-platform/clientProfileImages";

export default function ClientProfileManagement() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.client);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchClientProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.user?.firstName || "");
      setLastName(profile.user?.lastName || "");
      setEmail(profile.user?.email || "");
      setPhoneNumber(profile.user?.phoneNumber || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setStateField(profile.state || "");
      setPincode(profile.pincode || "");
      if (profile.profilePhotoUrl) {
        setSelectedPhotoUrl(profile.profilePhotoUrl);
      }
    }
  }, [profile]);

  const activePhoto =
    selectedPhotoUrl || profile?.profilePhotoUrl || DEFAULT_MARGARET_AVATAR;
  const totalPhotosCount = Math.min(10, Math.max(1, 1 + uploadedPhotos.length));

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const dataUrl = reader.result;
          setUploadedPhotos((prev) =>
            prev.length >= 9 ? prev : [...prev, dataUrl]
          );
          if (idx === 0) {
            setSelectedPhotoUrl(dataUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(
        updateClientProfile({
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          city,
          state: stateField,
          pincode,
          postcode: pincode,
          profilePhotoUrl: selectedPhotoUrl || profile?.profilePhotoUrl || null,
        })
      ).unwrap();
      showSuccessToast(
        "Profile Updated",
        "Profile details and profile image successfully updated!"
      );
    } catch (err: any) {
      showErrorToast("Update Failed", err || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard className="space-y-6">
      <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
        Client Profile Management
      </h3>

      {/* Choose a profile image — Client Portal Avatar Selector */}
      <div className="rounded-2xl bg-[#FAF7F2] text-[#0A1629] border border-[#E5DEC9] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D4]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activePhoto}
                alt="Client profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#F6EFE2] border-2 border-[#D4AF7A]/70 shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-[#D4AF7A] shadow-sm flex items-center justify-center text-[#8C6D2B] hover:bg-[#FAF6EE]"
                title="Upload profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#0A1629]">
                Choose a profile image
              </h4>
              <p className="text-xs text-[#6B6254] mt-0.5">
                Pick one of our suggestions or upload your own photo (up to 10 photos).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-[#7D7362]">
              {totalPhotosCount} of 10 photos
            </span>
            <div className="w-20 h-2 rounded-full bg-[#EDE6D8] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C89E4C] to-[#D4AF7A] transition-all"
                style={{ width: `${(totalPhotosCount / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 pt-1">
          {CLIENT_PROFILE_AVATAR_PRESETS.map((preset) => {
            const isSelected = activePhoto === preset.url;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPhotoUrl(preset.url)}
                className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 transition-all ${
                    isSelected
                      ? "ring-2 ring-[#C59B38] bg-[#FAF3E3] scale-105 shadow-md"
                      : "ring-1 ring-[#E2D9C6] hover:ring-[#C59B38]/60 hover:scale-105"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C59B38] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] text-center leading-tight ${
                    isSelected
                      ? "font-bold text-[#0A1629]"
                      : "text-[#5C5549] group-hover:text-[#0A1629]"
                  }`}
                >
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5EFE2] border border-[#E4DAC6] text-xs font-semibold text-[#0A1629] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#B88E3E]" />
            <span>Upload your own photo</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <h4 className="font-semibold text-gold-50 text-sm">Personal Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            disabled={loading || isSaving}
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            disabled={loading || isSaving}
            required
          />
          <Input
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            type="email"
            disabled={loading || isSaving}
            required
          />
          <PhoneInput
            label="Phone Number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter phone number"
            disabled={loading || isSaving}
          />
        </div>

        <h4 className="font-semibold text-gold-50 text-sm pt-4 border-t border-gold-300/10">
          Location Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GoogleAddressAutocomplete
            label="Address"
            value={address}
            onChange={(val) => setAddress(val)}
            onAddressSelect={(parsed) => {
              if (parsed.formattedAddress) setAddress(parsed.formattedAddress);
              if (parsed.postcode) setPincode(parsed.postcode);
              if (parsed.city) setCity(parsed.city);
              if (parsed.state) setStateField(parsed.state);
            }}
            placeholder="Search address or postcode..."
            disabled={loading || isSaving}
          />
          <Input
            label="Postcode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="e.g. SW1A 1AA"
            disabled={loading || isSaving}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. London"
            disabled={loading || isSaving}
          />
          <Input
            label="State/Region"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            placeholder="e.g. Greater London"
            disabled={loading || isSaving}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving || loading}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
