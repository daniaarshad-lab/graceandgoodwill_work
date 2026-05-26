import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Select from "@/components/Select";

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
  errors: Record<string, string>;
  isSubmitting: boolean;
  success: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setActiveTab: (tab: any) => void;
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
  errors,
  isSubmitting,
  success,
  onSubmit,
  setActiveTab,
}: CareRequestFormProps) {
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

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          Care request submitted successfully! Tracking initiated in dashboard.
        </div>
      )}

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

          <Input
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            type="tel"
            error={errors.phone}
          />

          <Select
            label="Care Type Required"
            value={careType}
            onChange={(e) => setCareType(e.target.value)}
            options={[
              { value: "Companion Support", label: "Companion Support" },
              {
                value: "24/7 Live-in Companion Support",
                label: "24/7 Live-in Care",
              },
              {
                value: "Post-Operative Rehabilitation",
                label: "Rehabilitation Care",
              },
              {
                value: "Elderly Dementia Support",
                label: "Dementia Support",
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
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
              errors.support ? "border-red-500" : "border-gray-300/20"
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

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className="rounded-xl border border-gold-DEFAULT/20 px-6 py-3 text-xs font-semibold text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gold-DEFAULT px-6 py-3 text-xs font-semibold text-navy-950 hover:bg-gold-300 transition duration-300 shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting Request..." : "Submit Care Request"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
