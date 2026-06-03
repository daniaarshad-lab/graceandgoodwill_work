import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { Enquiry } from "../types/client.types";

interface SupportEnquiryFormProps {
  subject: string;
  setSubject: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  preference: string;
  setPreference: (val: string) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  success: boolean;
  onSubmit: (e: React.FormEvent) => void;
  enquiries: Enquiry[];
  setActiveTab: (
    tab: "overview" | "request" | "carers" | "tracking" | "enquiry",
  ) => void;
}

export default function SupportEnquiryForm({
  subject,
  setSubject,
  message,
  setMessage,
  preference,
  setPreference,
  errors,
  isSubmitting,
  success,
  onSubmit,
  enquiries,
  setActiveTab,
}: SupportEnquiryFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard className="md:col-span-2 space-y-6">
        <div className="border-b border-gold-300/10 pb-4">
          <h3 className="text-lg font-bold text-gold-200">
            Submit Support Enquiries
          </h3>
          <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
            Send general inquiries or medical companion queries directly to our
            operations office.
          </p>
        </div>

        {success && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            Enquiry message transmitted successfully! Tracking initialized.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Subject / Topic"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter short descriptive subject"
            error={errors.subject}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold-200">
              Message Details
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your questions, queries, or assistance requests..."
              className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                errors.message ? "border-red-500" : "border-gray-300/20"
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-xs text-red-500 font-medium">
                {errors.message}
              </p>
            )}
          </div>

          <Select
            label="Preferred Contact Preference"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            options={[
              { value: "Email", label: "Email" },
              { value: "Phone Call", label: "Phone Call" },
              { value: "Text Message", label: "SMS Text" },
            ]}
          />

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
              {isSubmitting ? "Transmitting..." : "Send Enquiry"}
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard className="space-y-4">
        <h3 className="text-lg font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Enquiry Log Book
        </h3>

        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 space-y-2"
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs font-bold text-gold-50 truncate max-w-[140px]">
                  {enq.subject}
                </h4>
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    enq.status === "Responded"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-gold-DEFAULT/10 text-gold-DEFAULT"
                  }`}
                >
                  {enq.status}
                </span>
              </div>

              <p className="text-[10px] text-gold-100/60 leading-relaxed line-clamp-2">
                {enq.message}
              </p>

              <div className="flex justify-between items-center text-[8px] font-semibold text-gold-100/30 pt-1 border-t border-gold-300/5">
                <span>Pref: {enq.preference}</span>
                <span>Date: {enq.date}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
