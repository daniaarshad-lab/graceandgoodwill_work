import React from "react";
import { Metadata } from "next";
import { PRIVACY_POLICY_TEXT } from "@/lib/legal-documents";
import LegalDocumentPageClient from "@/components/LegalDocumentPageClient";

export const metadata = {
  alternates: {
    canonical: "/privacy",
  },
  title: "Privacy Policy | Grace & Goodwill",
  description: "Read Grace & Goodwill's privacy policy to understand how we collect, use and protect your personal information across our platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPageClient
      agreementType="PRIVACY_POLICY"
      fallbackText={PRIVACY_POLICY_TEXT}
      documentTitle="Privacy Policy"
      lastUpdated="August 2026"
    />
  );
}
