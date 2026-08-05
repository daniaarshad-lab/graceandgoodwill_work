import React from "react";
import { Metadata } from "next";
import { AGENCY_INTRO_TERMS_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata: Metadata = {
  title: "Platform / Agency Introduction Terms | Grace & Goodwill Ltd",
  description: "Official Platform and Agency Introduction Terms governing matching, introduction rules, care worker requirements, placement fees, replacement policy, and non-circumvention rules.",
};

export default function AgencyIntroductionTermsPage() {
  return (
    <LegalDocumentPageClient
      agreementType="PLATFORM_INTRODUCTION_TERMS"
      fallbackText={AGENCY_INTRO_TERMS_TEXT}
      documentTitle="Platform / Agency Introduction Terms"
      documentSubtitle="GRACE & GOODWILL LTD - PLATFORM / AGENCY INTRODUCTION TERMS"
      lastUpdated="August 2026"
    />
  );
}
