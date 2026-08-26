import React from "react";
import { Metadata } from "next";
import { WEBSITE_TERMS_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata = {
  title: "Terms & Conditions | Grace & Goodwill",
  description: "Read Grace & Goodwill's terms and conditions to understand the rules, responsibilities, and conditions that apply when using our website and services.",
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
