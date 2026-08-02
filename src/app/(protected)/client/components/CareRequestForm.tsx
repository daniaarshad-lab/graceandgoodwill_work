import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import MultiSelect from "@/components/MultiSelect";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import EmergencyButton from "@/components/EmergencyButton";

interface CareRequestFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  careType: string[];
  setCareType: (val: string[]) => void;
  support: string;
  setSupport: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  isOngoing: boolean;
  setIsOngoing: (val: boolean) => void;
  weeklyPayRange: { min: number; max: number } | null;
  setWeeklyPayRange: (val: { min: number; max: number } | null) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setActiveTab: (
    tab:
      | "overview"
      | "request"
      | "carers"
      | "tracking"
      | "enquiry"
      | "applications",
  ) => void;
}

export default function CareRequestForm({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  careType,
  setCareType,
  support,
  setSupport,
  startDate,
  setStartDate,
  duration,
  setDuration,
  address,
  setAddress,
  notes,
  setNotes,
  isOngoing,
  setIsOngoing,
  weeklyPayRange,
  setWeeklyPayRange,
  errors,
  isSubmitting,
  onSubmit,
  setActiveTab,
}: CareRequestFormProps) {
  return (
    <SectionCard className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Submit Care Requirements
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Specify details about the care needed. Start browsing carer profiles,
          comparing qualifications, experience, specialist skills and
          availability before creating your own shortlist. Explore at your own
          pace while benefiting from verified profiles and the support of Grace
          & Goodwill whenever you need assistance.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Full Name of Requestor"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            error={errors.fullName}
          />

          <Input
            label="Contact Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter contact email"
            type="email"
            error={errors.email}
          />

          <PhoneInput
            label="Contact Phone"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
            error={errors.phone}
          />

          <MultiSelect
            label="Care Type Required"
            value={careType}
            onChange={setCareType}
            error={errors.careType}
            options={[
              {
                value: "Companion Support",
                label: "Companion Live-in Care",
              },
              {
                value: "24/7 Live-in Companion Support",
                label: "24/7 Live-in Care",
              },
              {
                value: "Post-Operative Rehabilitation",
                label: "Rehabilitation Live-in Care",
              },
              {
                value: "Elderly Dementia Support",
                label: "Dementia Live-in Care",
              },
              {
                value: "Palliative Care",
                label: "Palliative Live-in Care",
              },
              {
                value: "Couple Care",
                label: "Couple Live-in Care",
              },
              {
                value: "Respite Care",
                label: "Respite Live-in Care",
              },
            ]}
          />

          <Input
            label="Preferred Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            error={errors.startDate}
          />

          <div className="flex flex-col space-y-2">
            <Input
              label="End Date"
              type="date"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Select end date"
              error={errors.duration}
              disabled={isOngoing}
              min={
                startDate
                  ? (() => {
                      const start = new Date(startDate);
                      start.setDate(start.getDate() + 2);
                      return start.toISOString().split("T")[0];
                    })()
                  : undefined
              }
            />
            <label className="flex items-center gap-2 text-sm text-gold-200 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={(e) => {
                  setIsOngoing(e.target.checked);
                  if (e.target.checked) {
                    setDuration("");
                  }
                }}
                className="w-4 h-4 rounded border-gold-300/20 bg-navy-950 text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-offset-navy-950"
              />
              Ongoing (Endless)
            </label>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Weekly Pay Range - Minimum (£)"
            value={weeklyPayRange?.min?.toString() || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setWeeklyPayRange({ min: val, max: weeklyPayRange?.max || val });
            }}
            placeholder="e.g. 800"
            type="number"
          />
          <Input
            label="Weekly Pay Range - Maximum (£)"
            value={weeklyPayRange?.max?.toString() || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setWeeklyPayRange({ min: weeklyPayRange?.min || 0, max: val });
            }}
            placeholder="e.g. 1200"
            type="number"
          />
        </div> */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Describe the Required Support
          </label>
          <textarea
            rows={4}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="Describe specific client details, medication support, mobility support, and daily routines..."
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
              errors.support ? "border-red-500" : "border-gray-300/20"
            }`}
          ></textarea>
          {errors.support && (
            <p className="text-xs text-red-500 font-medium">{errors.support}</p>
          )}
        </div>

        <Input
          label="Care recipients home address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full physical address where care will take place"
          error={errors.address}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Additional Family Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special dietary preferences, pets, or hobbies..."
            className="w-full rounded-xl border border-gray-300/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
          ></textarea>
        </div>

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
            disabled={isSubmitting}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            {isSubmitting ? "Submitting Request..." : "Submit Care Request"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
