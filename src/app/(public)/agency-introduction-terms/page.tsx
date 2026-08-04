import React from "react";
import LegalDocumentViewer from "@/components/LegalDocumentViewer";
import { Metadata } from "next";
import { AGENCY_INTRO_TERMS_TEXT } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Platform / Agency Introduction Terms | Grace & Goodwill Ltd",
  description: "Official Platform and Agency Introduction Terms governing matching, introduction rules, care worker requirements, placement fees, replacement policy, and non-circumvention rules.",
};

export default function AgencyIntroductionTermsPage() {
  const paragraphs = AGENCY_INTRO_TERMS_TEXT.split("\n\n").filter(Boolean);

  return (
    <LegalDocumentViewer
      documentTitle="Platform / Agency Introduction Terms"
      documentSubtitle="GRACE & GOODWILL LTD - PLATFORM / AGENCY INTRODUCTION TERMS"
      lastUpdated="August 2026"
      sections={[]}
    >
      <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
        {paragraphs.map((para, idx) => {
          const isHeading =
            para.match(/^[0-9]+\.\s+[A-Z\s&/]+$/) ||
            para.startsWith("GRACE & GOODWILL LTD") ||
            para.startsWith("PLATFORM / AGENCY INTRODUCTION TERMS");

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
