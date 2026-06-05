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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-gold-DEFAULT/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-gold-DEFAULT/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        )}
      </div>

      {/* Text */}
      <h4 className="text-lg font-bold text-gold-50 mb-2">
        {variant === "no-enquiries"
          ? "No Enquiries Yet"
          : "Select an Enquiry"}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create New Enquiry
        </button>
      )}
    </div>
  );
}
