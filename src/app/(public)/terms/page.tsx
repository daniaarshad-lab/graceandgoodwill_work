import React from "react";
import { Metadata } from "next";
import { WEBSITE_TERMS_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata: Metadata = {
  title: "Website & Platform Terms and Conditions | Grace & Goodwill Ltd",
  description: "Official Website and Platform Terms and Conditions governing access and account registration for Clients and Care Workers.",
};

export default function WebsiteTermsPage() {
  return (
    <LegalDocumentPageClient
      agreementType="TERMS_AND_CONDITIONS"
      fallbackText={WEBSITE_TERMS_TEXT}
      documentTitle="Website & Platform Terms and Conditions"
      documentSubtitle="GRACE & GOODWILL LTD - WEBSITE AND PLATFORM TERMS AND CONDITIONS"
      lastUpdated="August 2026"
    />
  );
}
