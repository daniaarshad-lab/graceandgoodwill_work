"use client";

import React, { useEffect, useState } from "react";
import LegalDocumentViewer from "@/components/LegalDocumentViewer";
import { publicService } from "@/services/public.service";

interface LegalDocumentPageClientProps {
  agreementType: string;
  fallbackText: string;
  documentTitle: string;
  documentSubtitle: string;
  lastUpdated: string;
}

export default function LegalDocumentPageClient({
  agreementType,
  fallbackText,
  documentTitle: initialTitle,
  documentSubtitle,
  lastUpdated: initialLastUpdated,
}: LegalDocumentPageClientProps) {
  const [content, setContent] = useState<string>(fallbackText);
  const [docTitle, setDocTitle] = useState<string>(initialTitle);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>(initialLastUpdated);

  useEffect(() => {
    let isMounted = true;

    async function fetchAgreement() {
      const data = await publicService.getPublicAgreement(agreementType);
      if (isMounted && data && data.content) {
        setContent(data.content);
        if (data.title) {
          setDocTitle(data.title);
        }
        if (data.updatedAt) {
          try {
            const formatted = new Date(data.updatedAt).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            });
            setLastUpdatedDate(formatted);
          } catch {
            // Keep initial last updated date if parsing fails
          }
        }
      }
    }

    fetchAgreement();

    return () => {
      isMounted = false;
    };
  }, [agreementType]);

  const paragraphs = content.split("\n\n").filter(Boolean);

  // The first paragraph in each document is the full document title (e.g. "GRACE & GOODWILL LTD - ..."),
  // which is already displayed in the hero header via documentTitle/documentSubtitle props.
  // Skip it to avoid a duplicate heading on the page.
  const isDuplicateTitle = (para: string) =>
    para.startsWith("GRACE & GOODWILL LTD") ||
    para.startsWith("PRIVACY POLICY") ||
    para.startsWith("WEBSITE AND PLATFORM TERMS AND CONDITIONS") ||
    para.startsWith("PLATFORM / AGENCY INTRODUCTION TERMS");

  const filteredParagraphs = paragraphs.filter(
    (para, idx) => !(idx === 0 && isDuplicateTitle(para))
  );

  return (
    <LegalDocumentViewer
      documentTitle={docTitle}
      documentSubtitle={documentSubtitle}
      lastUpdated={lastUpdatedDate}
      sections={[]}
    >
      <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
        {filteredParagraphs.map((para, idx) => {
          const isHeading =
            para.match(/^[0-9]+\.\s+[A-Z\s&/]+$/) ||
            para.startsWith("GRACE & GOODWILL LTD") ||
            para.startsWith("PRIVACY POLICY") ||
            para.startsWith("WEBSITE AND PLATFORM TERMS AND CONDITIONS") ||
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
