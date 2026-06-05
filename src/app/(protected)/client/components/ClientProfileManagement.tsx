"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateClientProfile, uploadClientProfilePhoto } from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ClientProfileManagement() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.client);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const getPhotoUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${apiUrl}${url}`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoUploading(true);

    try {
      await dispatch(uploadClientProfilePhoto(file)).unwrap();
    } catch (err: any) {
      setPhotoError(err || "Failed to upload photo");
    } finally {
      setPhotoUploading(false);
      // Reset input so the same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (profile) {
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setStateField(profile.state || "");
      setPincode(profile.pincode || "");
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);
    setIsSaving(true);

    try {
      await dispatch(
        updateClientProfile({
          address,
          city,
          state: stateField,
          pincode,
        })
      ).unwrap();
      
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard className="max-w-3xl mx-auto space-y-6">
      <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
        Client Profile Management
      </h3>

      {/* Photo Upload Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-gold-300/10 bg-navy-950/30">
        <div className="relative group">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT shadow-soft">
            {profile?.profilePhotoUrl ? (
              <Image
                src={getPhotoUrl(profile.profilePhotoUrl)}
                alt="Profile Avatar"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              (profile?.user?.firstName?.[0] || "") + (profile?.user?.lastName?.[0] || "") || "CL"
            )}
          </div>

          {photoUploading && (
            <div className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center p-2">
              <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
            </div>
          )}
        </div>

        <div className="space-y-2 flex-grow text-center sm:text-left">
          <h4 className="text-sm font-semibold text-gold-50">Profile Picture</h4>
          <p className="text-xs text-gold-100/50">
            Upload a professional high-resolution headshot. Supports JPEG, PNG formats.
          </p>
          {photoError && (
            <p className="text-xs text-red-500 font-medium">{photoError}</p>
          )}
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 px-4 py-2 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/20 transition-all duration-300">
            {photoUploading ? "Uploading..." : "Upload New Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={photoUploading}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4 text-sm text-gold-100/70 border-b border-gold-300/10 pb-6">
        <h4 className="font-semibold text-gold-50">Personal Details</h4>
        <p>Name: <span className="text-gold-200">{profile?.user?.firstName} {profile?.user?.lastName}</span></p>
        <p>Email: <span className="text-gold-200">{profile?.user?.email}</span></p>
        <p>Phone: <span className="text-gold-200">{profile?.user?.phoneNumber}</span></p>
        <p className="text-xs text-gold-100/40 italic">Note: Personal details are managed through your account settings and cannot be edited here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h4 className="font-semibold text-gold-50 text-sm">Location Details</h4>
        
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full physical address"
          disabled={loading || isSaving}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <Input
            label="Pincode / Postcode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="e.g. SW1A 1AA"
            disabled={loading || isSaving}
          />
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Profile location details successfully updated!
          </div>
        )}

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
