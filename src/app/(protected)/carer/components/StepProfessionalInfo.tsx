import React, { useState, useRef, useEffect } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { showErrorToast } from "@/utils/toast";
import { Check, ChevronDown } from "lucide-react";

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

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!bio || bio.trim().length < 50) {
      showErrorToast("Validation Error", "Professional Summary / About Me is required (minimum 50 characters).");
      return;
    }
    if (experience === undefined || experience === null || experience === "" || parseInt(experience, 10) < 0) {
      showErrorToast("Validation Error", "Years of Care Experience must be a non-negative number.");
      return;
    }
    const selectedArray = (specialties as string || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    if (selectedArray.length === 0) {
      showErrorToast("Validation Error", "Please select at least one Care Specialism.");
      return;
    }

    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    const success = await portal.handleSaveProfile(syntheticEvent, 4);
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Professional Information
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-base font-bold text-gold-200 flex items-center gap-2">
              Professional Summary / About Me <span className="text-red-400">*</span>
            </label>
            
            <div className="bg-navy-900/50 p-4 rounded-xl border border-gold-300/10 shadow-inner">
              <p className="text-[13px] font-semibold text-gold-100 mb-2">Helpful tips for a great summary:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pl-4 list-disc marker:text-gold-500/50 text-xs text-gold-100/70">
                <li>Your care experience & qualifications</li>
                <li>Your personality and core values</li>
                <li>Your hobbies and personal interests</li>
                <li>Why you are passionate about care</li>
                <li>The types of clients you excel at supporting</li>
              </ul>
            </div>

            <textarea
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="This information will appear on your public carer profile and will be visible to prospective clients and families."
              className="w-full rounded-xl border bg-navy-950/80 px-4 py-4 text-gold-100 outline-none focus:ring-2 focus:ring-gold-400/50 transition duration-300 text-sm border-gold-300/20 shadow-inner hover:border-gold-300/40 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Years of Care Experience *" 
              type="number"
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              placeholder="e.g. 5" 
            />
            <MultiSelectDropdown selectedStr={specialties} onChange={setSpecialties} />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={handleNext}>Save & Continue</Button>
      </div>
    </div>
  );
}

const specialismOptions = [
  "Personal Care",
  "Companion Care",
  "Dementia Care",
  "Alzheimer's Care",
  "Parkinson's Care",
  "Stroke Care",
  "Palliative Care",
  "End-of-Life Care",
  "Respite Care",
  "Post-Hospital Care",
  "Disability Care",
  "Complex Care",
  "24-Hour Care",
  "Overnight Care",
  "Couples Care",
  "Chronic Disease Management Care",
  "Rehabilitation Care",
  "Elderly Care",
];

function MultiSelectDropdown({ selectedStr, onChange }: { selectedStr: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedArray = selectedStr.split(",").map(s => s.trim()).filter(Boolean);

  const toggleOption = (opt: string) => {
    let newArr;
    if (selectedArray.includes(opt)) {
      newArr = selectedArray.filter(item => item !== opt);
    } else {
      newArr = [...selectedArray, opt];
    }
    onChange(newArr.join(", "));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-2 w-full" ref={dropdownRef}>
      <label className="text-sm font-medium text-gold-200 ml-1">Care Specialisms *</label>
      <div 
        className="w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus-within:ring-2 focus-within:ring-gold-DEFAULT transition duration-300 text-sm border-gray-300/20 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-4 text-gold-100/80">
          {selectedArray.length > 0 ? selectedArray.join(", ") : "Select specialties..."}
        </span>
        <ChevronDown className="w-4 h-4 text-gold-100/60 flex-shrink-0" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-xl border border-gold-300/20 bg-navy-900 shadow-xl max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {specialismOptions.map(opt => {
              const isSelected = selectedArray.includes(opt);
              return (
                <div 
                  key={opt}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer transition-colors"
                  onClick={() => toggleOption(opt)}
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <div className={`w-4 h-4 border rounded transition-all ${isSelected ? 'bg-gold border-gold' : 'border-gold-300/30'}`} />
                    <Check className={`absolute w-3 h-3 text-navy-950 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <span className="text-sm text-gold-50">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
