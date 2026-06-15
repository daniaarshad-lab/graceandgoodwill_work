import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack?: () => void;
}

export default function StepPersonalInfo({ portal, onNext, onBack }: Props) {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    email, setEmail,
    dateOfBirth, setDateOfBirth,
    address, setAddress,
    postcode, setPostcode,
    emergencyContactName, setEmergencyContactName,
    emergencyContactNumber, setEmergencyContactNumber,
    emergencyContactRelation, setEmergencyContactRelation,
  } = portal;

  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePostcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostcode(val);

    if (val.length > 2) {
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${val}/autocomplete`);
        const data = await res.json();
        if (data.status === 200) {
          setPostcodeSuggestions(data.result || []);
          setShowSuggestions(true);
        } else {
          setPostcodeSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Postcode fetch error", err);
      }
    } else {
      setPostcodeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!firstName?.trim() || !lastName?.trim()) {
      showErrorToast("Validation Error", "Full Name is required.");
      return;
    }
    if (!dateOfBirth) {
      showErrorToast("Validation Error", "Date of Birth is required.");
      return;
    }
    if (!address?.trim()) {
      showErrorToast("Validation Error", "Address is required.");
      return;
    }
    if (!postcode?.trim()) {
      showErrorToast("Validation Error", "Postcode is required.");
      return;
    }
    if (!email?.trim()) {
      showErrorToast("Validation Error", "Email Address is required.");
      return;
    }
    if (!phone?.trim()) {
      showErrorToast("Validation Error", "Mobile Number is required.");
      return;
    }
    if (!emergencyContactName?.trim()) {
      showErrorToast("Validation Error", "Emergency Contact Name is required.");
      return;
    }
    if (!emergencyContactNumber?.trim()) {
      showErrorToast("Validation Error", "Emergency Contact Number is required.");
      return;
    }
    if (!emergencyContactRelation?.trim()) {
      showErrorToast("Validation Error", "Emergency Contact Relationship is required.");
      return;
    }

    const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
    const success = await portal.handleSaveProfile(syntheticEvent, 2);
    if (success) {
      onNext();
    }
  };

  const getLocalYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const maxDate = getLocalYesterdayDateString();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Personal Information
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">All items marked with * are compulsory.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            value={`${firstName || ''} ${lastName || ''}`.trim()}
            onChange={(e) => {
              const parts = e.target.value.split(' ');
              setFirstName(parts[0] || '');
              setLastName(parts.slice(1).join(' ') || '');
            }}
            placeholder="Full Name"
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={dateOfBirth ? dateOfBirth.split('T')[0] : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val && val > maxDate) {
                showErrorToast("Validation Error", "Date of Birth cannot be today or a future date.");
                return;
              }
              setDateOfBirth(val);
            }}
            placeholder="DD/MM/YYYY"
            max={maxDate}
          />
          <Input label="Address *" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
          <div className="relative">
            <Input label="Postcode *" value={postcode} onChange={handlePostcodeChange} placeholder="Postcode" />
            {showSuggestions && postcodeSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-navy-900 border border-gold-300/20 rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-h-48 overflow-y-auto">
                {postcodeSuggestions.map((p) => (
                  <li
                    key={p}
                    className="px-4 py-2 text-sm text-gold-100 hover:bg-gold-DEFAULT/10 cursor-pointer"
                    onClick={() => {
                      setPostcode(p);
                      setShowSuggestions(false);
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <PhoneInput label="Mobile Number *" value={phone} onChange={setPhone} placeholder="Mobile Number" />
        </div>

        <div className="pt-6 mt-6 border-t border-gold-300/10">
          <h4 className="text-lg font-semibold text-gold-200 mb-4">Emergency Contact Details *</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Contact Name *" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Name" />
            <PhoneInput label="Contact Number *" value={emergencyContactNumber} onChange={setEmergencyContactNumber} placeholder="Phone" />
            <Input label="Relationship *" value={emergencyContactRelation} onChange={(e) => setEmergencyContactRelation(e.target.value)} placeholder="e.g. Spouse, Parent" />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        {onBack ? (
          <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        ) : <div />}
        <Button type="button" variant="primary" onClick={handleNext}>Save & Continue</Button>
      </div>
    </div>
  );
}
