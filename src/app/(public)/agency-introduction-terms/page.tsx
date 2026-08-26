import React from "react";
import { Metadata } from "next";
import { AGENCY_INTRO_TERMS_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata = {
  title: "Agency Introduction Terms | Grace & Goodwill",
  description: "Review Grace & Goodwill's agency introduction terms, covering the conditions and responsibilities involved when introducing clients and live-in carers.",
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
