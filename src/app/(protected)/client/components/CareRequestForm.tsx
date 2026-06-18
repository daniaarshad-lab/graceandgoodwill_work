import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
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
  careType: string;
  setCareType: (val: string) => void;
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
  adminMatching: boolean;
  setAdminMatching: (val: boolean) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setActiveTab: (
    tab: "overview" | "request" | "carers" | "tracking" | "enquiry",
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
  adminMatching,
  setAdminMatching,
  errors,
  isSubmitting,
  onSubmit,
  setActiveTab,
}: CareRequestFormProps) {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  // TODO: The client needs to provide the actual WhatsApp number for emergency care.
  const WHATSAPP_NUMBER = "<TO_BE_PROVIDED_BY_CLIENT>";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hello, I need emergency care support within the next 24 hours."
  );

  const handleWhatsAppRedirect = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, "_blank");
  };

  return (
    <SectionCard className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Submit Care Requirements
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Specify details about the care needed. Our matching system
          automatically aligns compatible profiles.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <Select
            label="Care Type Required"
            value={careType}
            onChange={(e) => setCareType(e.target.value)}
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
            ]}
          />

          <Input
            label="Preferred Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            error={errors.startDate}
          />

          <Input
            label="Expected Duration of Care"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 3 Months, Ongoing"
            error={errors.duration}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Describe the Required Support
          </label>
          <textarea
            rows={4}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="Describe specific client details, medication support, mobility support, and daily routines..."
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${errors.support ? "border-red-500" : "border-gray-300/20"
              }`}
          ></textarea>
          {errors.support && (
            <p className="text-xs text-red-500 font-medium">{errors.support}</p>
          )}
        </div>

        <Input
          label="Physical Care Address"
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

        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-gold-200">
            Carer Matching Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Match Card */}
            <div
              onClick={() => setAdminMatching(true)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${adminMatching
                ? "bg-gold-500/5 border-gold-300/40 shadow-[0_0_15px_rgba(245,212,160,0.08)]"
                : "bg-navy-950 border-gray-300/10 hover:border-gold-300/20 hover:bg-navy-900/40"
                }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gold-100 flex items-center gap-1.5">
                    🌟 Automatic Matching
                  </h4>
                  {adminMatching && (
                    <span className="text-[10px] bg-gold-200/20 text-gold-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gold-100/60 leading-relaxed pt-1">
                  Let our care coordinators hand-pick and introduce the most compatible and qualified carers for your specific needs.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${adminMatching ? "border-gold-300" : "border-gray-500"
                  }`}>
                  {adminMatching && <div className="w-2 h-2 rounded-full bg-gold-300" />}
                </div>
                <span className="text-[11px] font-medium text-gold-100/80">Select this preference</span>
              </div>
            </div>

            {/* Self Select Card */}
            <div
              onClick={() => setAdminMatching(false)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${!adminMatching
                ? "bg-gold-500/5 border-gold-300/40 shadow-[0_0_15px_rgba(245,212,160,0.08)]"
                : "bg-navy-950 border-gray-300/10 hover:border-gold-300/20 hover:bg-navy-900/40"
                }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gold-100 flex items-center gap-1.5">
                    🔍 Browse Independently
                  </h4>
                </div>
                <p className="text-xs text-gold-100/60 leading-relaxed pt-1">
                  Explore available carer profiles in your area, view their expertise, and request introductions yourself.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${!adminMatching ? "border-gold-300" : "border-gray-500"
                  }`}>
                  {!adminMatching && <div className="w-2 h-2 rounded-full bg-gold-300" />}
                </div>
                <span className="text-[11px] font-medium text-gold-100/80">Select this preference</span>
              </div>
            </div>
          </div>
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

      {/* Emergency Care Section */}
      <div className="mt-8 border-t border-gold-300/10 pt-6">
        <div className="rounded-xl border border-gold-300/20 bg-navy-950 shadow-[0_0_15px_rgba(160,128,84,0.05)] hover:border-gold-300/30 hover:bg-navy-900/60 transition-all duration-300 overflow-hidden">
          <div
            className="p-5 flex justify-between items-center cursor-pointer group"
            onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
          >
            <div>
              <h3 className="text-base font-bold text-gold-100 flex items-center gap-2">
                <span className="text-red-500">🚨</span> Emergency Care
              </h3>
              {!isEmergencyOpen && (
                <p className="text-sm text-gold-100/60 mt-1 pr-4">
                  Need urgent support within the next 24 hours? Our emergency team is here to help.
                </p>
              )}
            </div>
            <div className="text-gold-200/50 group-hover:text-gold-100 transition-colors shrink-0 ml-4">
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${isEmergencyOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out px-5 ${isEmergencyOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="pt-4 border-t border-gold-300/10">
              <div className="bg-navy-900/50 rounded-lg p-4 border border-gold-300/5 mb-5">
                <p className="text-sm text-gold-100/80 leading-relaxed">
                  If care is needed urgently within the next 24 hours, our emergency support team can help you arrange care as quickly as possible. Contact us immediately using the button below.
                </p>
              </div>
              <EmergencyButton
                onClick={handleWhatsAppRedirect}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
