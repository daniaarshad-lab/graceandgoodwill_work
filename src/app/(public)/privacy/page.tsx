import React from "react";
import { Metadata } from "next";
import { PRIVACY_POLICY_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Grace & Goodwill Ltd",
  description: "Official Privacy Policy governing the collection, processing, and protection of personal data for Clients and Care Workers under UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPageClient
      agreementType="PRIVACY_POLICY"
      fallbackText={PRIVACY_POLICY_TEXT}
      documentTitle="Privacy Policy"
      documentSubtitle="GRACE & GOODWILL LTD - PRIVACY POLICY"
      lastUpdated="August 2026"
    />
  );
}
