import React from "react";
import LegalDocumentViewer from "@/components/LegalDocumentViewer";
import { Metadata } from "next";
import { PRIVACY_POLICY_TEXT } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Privacy Policy | Grace & Goodwill Ltd",
  description: "Official Privacy Policy governing the collection, processing, and protection of personal data for Clients and Care Workers under UK GDPR.",
};

export default function PrivacyPolicyPage() {
  const paragraphs = PRIVACY_POLICY_TEXT.split("\n\n").filter(Boolean);

  return (
    <LegalDocumentViewer
      documentTitle="Privacy Policy"
      documentSubtitle="GRACE & GOODWILL LTD - PRIVACY POLICY"
      lastUpdated="August 2026"
      sections={[]}
    >
      <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
        {paragraphs.map((para, idx) => {
          const isHeading =
            para.match(/^[0-9]+\.\s+[A-Z\s]+$/) ||
            para.startsWith("GRACE & GOODWILL LTD") ||
            para.startsWith("PRIVACY POLICY");

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
