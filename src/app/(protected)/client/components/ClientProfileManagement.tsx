"use client";

import { FormEvent, useEffect, useState } from "react";
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

export default function ClientProfileManagement() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => {
    console.log(
      "[ClientProfileManagement] Redux profile state selector:",
      state.client.profile,
    );
    return state.client;
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Dispatch profile fetch on mount
  useEffect(() => {
    console.log(
      "[ClientProfileManagement] Component mounted, fetching profile...",
    );
    dispatch(fetchClientProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "[ClientProfileManagement] useEffect triggered with profile:",
      profile,
    );
    if (profile) {
      console.log("[ClientProfileManagement] Populating form default values:", {
        firstName: profile.user?.firstName,
        lastName: profile.user?.lastName,
        email: profile.user?.email,
        phoneNumber: profile.user?.phoneNumber,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      });

      setFirstName(profile.user?.firstName || "");
      setLastName(profile.user?.lastName || "");
      setEmail(profile.user?.email || "");
      setPhoneNumber(profile.user?.phoneNumber || "");

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
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          city,
          state: stateField,
          pincode,
          postcode: pincode, // Backend often expects one or both depending on schema
          profilePhotoUrl: profile?.profilePhotoUrl || null,
        }),
      ).unwrap();

      showSuccessToast(
        "Profile Updated",
        "Profile details successfully updated!",
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
