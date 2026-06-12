import React from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepProfessionalInfo({ portal, onNext, onBack }: Props) {
  const {
    bio, setBio,
    experience, setExperience,
    specialties, setSpecialties,
  } = portal;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Professional Information
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gold-200">
              Professional Summary / About Me *
            </label>
            <div className="text-xs text-gold-100/60 mb-3 space-y-1">
              <p>Please use this section to tell prospective clients and families about:</p>
              <ul className="list-disc pl-4 space-y-0.5 mt-1">
                <li>Your care experience</li>
                <li>Your personality and values</li>
                <li>Your hobbies and interests</li>
                <li>Why you enjoy working in care</li>
                <li>The type of people you enjoy supporting</li>
              </ul>
            </div>
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your professional summary here..."
              className="w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm border-gray-300/20"
            />
            <p className="text-xs text-gold-100/60 mt-2">
              This information will appear on your public carer profile and will be visible to prospective clients and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Years of Care Experience *" 
              type="number"
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              placeholder="e.g. 5" 
            />
            <Input 
              label="Care Specialisms *" 
              value={specialties} 
              onChange={(e) => setSpecialties(e.target.value)} 
              placeholder="e.g. Dementia, Palliative" 
            />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={onNext}>Save & Continue</Button>
      </div>
    </div>
  );
}
