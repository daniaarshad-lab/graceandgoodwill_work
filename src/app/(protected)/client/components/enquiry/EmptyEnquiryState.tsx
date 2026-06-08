import { MessageSquare, Inbox, Plus } from "lucide-react";

interface EmptyEnquiryStateProps {
  variant: "no-enquiries" | "no-selection";
  onCreateNew?: () => void;
}

export default function EmptyEnquiryState({
  variant,
  onCreateNew,
}: EmptyEnquiryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="h-20 w-20 rounded-full bg-navy-900/60 border border-gold-300/10 flex items-center justify-center mb-6">
        {variant === "no-enquiries" ? (
          <MessageSquare className="h-9 w-9 text-gold-DEFAULT/40" />
        ) : (
          <Inbox className="h-9 w-9 text-gold-DEFAULT/40" />
        )}
      </div>

      {/* Text */}
      <h4 className="text-lg font-bold text-gold-50 mb-2">
        {variant === "no-enquiries" ? "No Enquiries Yet" : "Select an Enquiry"}
      </h4>
      <p className="text-sm text-gold-100/50 max-w-sm leading-relaxed">
        {variant === "no-enquiries"
          ? "Create your first enquiry to contact Grace & Goodwill support. Our team is here to help."
          : "Select an enquiry from the list to view the conversation history and details."}
      </p>

      {/* CTA for no-enquiries variant */}
      {variant === "no-enquiries" && onCreateNew && (
        <button
          onClick={onCreateNew}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 px-5 py-2.5 text-sm font-semibold text-gold-DEFAULT transition-all duration-300 hover:bg-gold-DEFAULT/20 hover:border-gold-DEFAULT/50 hover:-translate-y-[1px]"
        >
          <Plus className="h-4 w-4" />
          Create New Enquiry
        </button>
      )}
    </div>
  );
}
