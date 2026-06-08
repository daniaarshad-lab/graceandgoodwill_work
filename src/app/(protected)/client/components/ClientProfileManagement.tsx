"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateClientProfile,
} from "@/store/slices/clientSlice";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export default function ClientProfileManagement() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.client);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");

  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

    try {
      await dispatch(
        updateClientProfile({
          address,
          city,
          state: stateField,
          pincode,
        }),
      ).unwrap();

      showSuccessToast("Profile Updated", "Profile location details successfully updated!");
    } catch (err: any) {
      showErrorToast("Update Failed", err || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard className="max-w-3xl mx-auto space-y-6">
      <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
        Client Profile Management
      </h3>

      <div className="space-y-4 text-sm text-gold-100/70 border-b border-gold-300/10 pb-6 mt-4">
        <h4 className="font-semibold text-gold-50">Personal Details</h4>
        <p>
          Name:{" "}
          <span className="text-gold-200">
            {profile?.user?.firstName} {profile?.user?.lastName}
          </span>
        </p>
        <p>
          Email: <span className="text-gold-200">{profile?.user?.email}</span>
        </p>
        <p>
          Phone:{" "}
          <span className="text-gold-200">{profile?.user?.phoneNumber}</span>
        </p>
        <p className="text-xs text-gold-100/40 italic">
          Note: Personal details are managed through your account settings and
          cannot be edited here.
        </p>
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
