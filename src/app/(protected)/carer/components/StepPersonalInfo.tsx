import React from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";

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
    emergencyContactName, setEmergencyContactName,
    emergencyContactNumber, setEmergencyContactNumber,
    emergencyContactRelation, setEmergencyContactRelation,
  } = portal;

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
          <Input label="Date of Birth *" type="date" value={dateOfBirth ? dateOfBirth.split('T')[0] : ''} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="DD/MM/YYYY" />
          <Input label="Address *" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" />
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
        <Button type="button" variant="primary" onClick={onNext}>Save & Continue</Button>
      </div>
    </div>
  );
}
