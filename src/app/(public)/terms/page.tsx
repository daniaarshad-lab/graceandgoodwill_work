import React from "react";
import LegalDocumentViewer from "@/components/LegalDocumentViewer";
import { Metadata } from "next";
import { WEBSITE_TERMS_TEXT } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Website & Platform Terms and Conditions | Grace & Goodwill Ltd",
  description: "Official Website and Platform Terms and Conditions governing access and account registration for Clients and Care Workers.",
};

export default function WebsiteTermsPage() {
  const paragraphs = WEBSITE_TERMS_TEXT.split("\n\n").filter(Boolean);

  return (
    <LegalDocumentViewer
      documentTitle="Website & Platform Terms and Conditions"
      documentSubtitle="GRACE & GOODWILL LTD - WEBSITE AND PLATFORM TERMS AND CONDITIONS"
      lastUpdated="August 2026"
      sections={[]}
    >
      <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
        {paragraphs.map((para, idx) => {
          const isHeading =
            para.match(/^[0-9]+\.\s+[A-Z\s&/]+$/) ||
            para.startsWith("GRACE & GOODWILL LTD") ||
            para.startsWith("WEBSITE AND PLATFORM TERMS AND CONDITIONS");

          if (isHeading) {
            return (
              <h2
                key={idx}
                className="text-lg font-bold text-gold-200 mt-8 mb-3 uppercase tracking-wide border-b border-navy-800 pb-1"
              >
                {para}
              </h2>
            );
          }

          return (
            <p key={idx} className="whitespace-pre-line text-slate-300">
              {para}
            </p>
          );
        })}
      </div>
    </LegalDocumentViewer>
  );
}
