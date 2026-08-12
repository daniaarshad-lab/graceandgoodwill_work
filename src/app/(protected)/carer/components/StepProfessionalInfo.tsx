import FullScreenLoader from "@/components/FullScreenLoader";
import React, { useState, useRef, useEffect } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Check, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepProfessionalInfo({
  portal,
  onNext,
  onBack,
}: Props) {
  const [isLocalSaving, setIsLocalSaving] = useState(false);

  const {
    bio,
    setBio,
    experience,
    setExperience,
    specialties,
    setSpecialties,
  } = portal;

  const [submitted, setSubmitted] = useState(false);

  const parsedExp = parseInt(experience, 10);
  const rawSpecialties = ((specialties as string) || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const predefinedSelected = rawSpecialties.filter((s) =>
    PREDEFINED_SPECIALISMS.includes(s),
  );
  let customSelected = rawSpecialties
    .filter((s) => !PREDEFINED_SPECIALISMS.includes(s))
    .join(", ");

  const hasOther =
    customSelected.length > 0 || rawSpecialties.includes("Other");
  if (customSelected === "Other") {
    customSelected = "";
  }

  const dropdownStr = [...predefinedSelected, hasOther ? "Other" : ""]
    .filter(Boolean)
    .join(", ");

  const handleDropdownChange = (valStr: string) => {
    const selected = valStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newHasOther = selected.includes("Other");

    const newPredefined = selected.filter((s) => s !== "Other");
    const newTotal = [...newPredefined];

    if (newHasOther) {
      if (customSelected.trim()) {
        newTotal.push(customSelected.trim());
      } else {
        newTotal.push("Other");
      }
    }

    setSpecialties(newTotal.join(", "));
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newTotal = [...predefinedSelected];
    if (val.trim()) {
      newTotal.push(val.trim());
    } else {
      newTotal.push("Other");
    }
    setSpecialties(newTotal.join(", "));
  };

  const errors = {
    bio:
      !bio || bio.trim().length < 50
        ? "Professional Profile is required (minimum 50 characters)."
        : "",
    experience:
      experience === undefined ||
      experience === null ||
      experience === "" ||
      isNaN(parsedExp) ||
      parsedExp < 0 ||
      parsedExp > 99
        ? "Years of Care Experience must be a number between 0 and 99."
        : "",
    specialtiesDropdown:
      rawSpecialties.length === 0
        ? "Please select at least one Care Specialism."
        : "",
    specialtiesOther:
      hasOther && !customSelected.trim()
        ? "Please specify your other specialism."
        : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      return;
    }

    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    setIsLocalSaving(true);
    const success = await portal.handleSaveProfile(syntheticEvent, 4);
    setIsLocalSaving(false);
    if (success) {
      onNext();
    }
  };

  if (isLocalSaving) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        <FullScreenLoader isVisible={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Professional Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-base font-bold text-gold-200 flex items-center gap-2">
              Carer Professional Profile <span className="text-red-400">*</span>
            </label>

            <div className="bg-navy-900/50 p-4 rounded-xl border border-gold-300/10 shadow-inner">
              <p className="text-[13px] font-semibold text-gold-100 mb-2">
                Helpful tips for a great summary:
              </p>
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
              className={`w-full rounded-xl border bg-navy-950/80 px-4 py-4 text-gold-100 outline-none focus:ring-2 focus:ring-gold-400/50 transition duration-300 text-sm shadow-inner hover:border-gold-300/40 resize-y ${submitted && errors.bio ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-gold-300/20"}`}
            />
            {submitted && errors.bio && (
              <p className="text-xs text-red-500 font-semibold">{errors.bio}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Years of Care Experience *"
              type="number"
              value={experience}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,2}$/.test(val)) {
                  setExperience(val);
                }
              }}
              min="0"
              max="99"
              placeholder="e.g. 5"
              error={
                submitted && errors.experience ? errors.experience : undefined
              }
            />
            <div className="flex flex-col gap-4">
              <MultiSelectDropdown
                selectedStr={dropdownStr}
                onChange={handleDropdownChange}
                error={
                  submitted && errors.specialtiesDropdown
                    ? errors.specialtiesDropdown
                    : undefined
                }
              />
              {hasOther && (
                <Input
                  label="Specify Other Specialism *"
                  value={customSelected}
                  onChange={handleOtherChange}
                  placeholder="Enter specialism"
                  error={
                    submitted && errors.specialtiesOther
                      ? errors.specialtiesOther
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack} disabled={isLocalSaving || portal.isProfileSaving}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isLocalSaving || portal.isProfileSaving}
        >
          "Save & Continue"
        </Button>
      </div>
      </div>
  );
}

const PREDEFINED_SPECIALISMS = [
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
  "Spinal Injury Care",
  "Complex Care",
  "24-Hour Care",
  "Overnight Care",
  "Couples Care",
  "Chronic Disease Management Care",
  "Rehabilitation Care",
  "Elderly Care",
];

const specialismOptions = [...PREDEFINED_SPECIALISMS, "Other"];

function MultiSelectDropdown({
  selectedStr,
  onChange,
  error,
}: {
  selectedStr: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const selectedArray = selectedStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const toggleOption = (opt: string) => {
    let newArr;
    if (selectedArray.includes(opt)) {
      newArr = selectedArray.filter((item) => item !== opt);
    } else {
      newArr = [...selectedArray, opt];
    }
    onChange(newArr.join(", "));
  };

  const updatePosition = () => {
    if (!isOpen || !dropdownRef.current) return;
    const triggerEl = dropdownRef.current.querySelector(".dropdown-trigger");
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    
    const desiredHeight = 240; // equivalent to max-h-60
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    let top = 0;
    let maxH = desiredHeight;
    
    if (spaceBelow >= desiredHeight || spaceBelow >= spaceAbove) {
      // Open downward
      top = rect.bottom + 8;
      if (spaceBelow < desiredHeight) {
        maxH = Math.max(spaceBelow - 16, 100); // Leave 16px buffer
      }
    } else {
      // Open upward
      if (spaceAbove < desiredHeight) {
        maxH = Math.max(spaceAbove - 16, 100);
      }
      top = rect.top - maxH - 8;
    }
    
    setMenuStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${maxH}px`,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      if (isOutsideTrigger && isOutsideMenu) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative space-y-2 w-full" ref={dropdownRef}>
      <label className="text-sm font-medium text-gold-200 ml-1">
        Care Specialisms *
      </label>
      <div
        className={`dropdown-trigger w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus-within:ring-2 focus-within:ring-gold-DEFAULT transition duration-300 text-sm cursor-pointer flex justify-between items-center ${error ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-gray-300/20"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-4 text-gold-100/80">
          {selectedArray.length > 0
            ? selectedArray.join(", ")
            : "Select specialties..."}
        </span>
        <ChevronDown className="w-4 h-4 text-gold-100/60 flex-shrink-0" />
      </div>

      {isOpen && typeof document !== 'undefined' &&
        createPortal(
          <div 
            ref={menuRef}
            className="rounded-xl border border-gold-300/20 bg-navy-900 shadow-xl overflow-y-auto"
            style={menuStyle}
          >
            <div className="p-2 space-y-1">
              {specialismOptions.map((opt) => {
                const isSelected = selectedArray.includes(opt);
                return (
                  <div
                    key={opt}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer transition-colors"
                    onClick={() => toggleOption(opt)}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <div
                        className={`w-4 h-4 border rounded transition-all ${isSelected ? "bg-gold border-gold" : "border-gold-300/30"}`}
                      />
                      <Check
                        className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                    <span className="text-sm text-gold-50">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
