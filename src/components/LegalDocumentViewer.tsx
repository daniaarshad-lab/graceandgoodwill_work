"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft, Printer, CheckCircle2, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalDocumentViewerProps {
  documentTitle: string;
  documentSubtitle: string;
  lastUpdated: string;
  companyName?: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalDocumentViewer({
  documentTitle,
  documentSubtitle,
  lastUpdated,
  companyName = "Grace & Goodwill Ltd",
  sections,
  children,
}: LegalDocumentViewerProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200">
      {/* ── Top Hero Header ────────────────────────────────────────────── */}
      <div className="relative border-b border-gold-400/15 bg-gradient-to-b from-navy-900/80 to-navy-950 py-12 md:py-16">
        <div className="container-wrapper max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-gold-200/70 hover:text-gold-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-gold-400/20 text-xs font-medium text-gold-100 hover:bg-gold-500/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Document
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Legal Policy
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-3">
              {documentTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-light mb-4">
              {documentSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gold-200/50 pt-2 border-t border-gold-400/10">
              <span>{companyName}</span>
              <span>•</span>
              <span>Company No. 16011465</span>
              <span>•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="container-wrapper max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Table of Contents Sidebar */}
          {sections.length > 0 && (
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 rounded-2xl bg-navy-900/60 border border-navy-800 p-5 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-300 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-400" />
                  Table of Contents
                </h3>
                <nav className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`group flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                        activeSection === sec.id
                          ? "bg-gold-500/15 text-gold-200 font-semibold border-l-2 border-gold-400 pl-2.5"
                          : "text-slate-400 hover:text-slate-200 hover:bg-navy-800/50"
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Document Content */}
          <main className={sections.length > 0 ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12"}>
            <div className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-headings:font-bold prose-h2:border-b prose-h2:border-navy-800 prose-h2:pb-3 prose-h2:mt-10 prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg prose-h3:text-gold-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-slate-100">
              {children}
            </div>

            {/* Bottom Affirmation Banner */}
            <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-gold-400/20 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
              <div>
                <h4 className="text-base font-semibold text-slate-100 mb-1 flex items-center justify-center sm:justify-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-400" />
                  Legal Binding Agreement
                </h4>
                <p className="text-xs text-slate-400">
                  By accessing or registering on Grace &amp; Goodwill, you acknowledge having read and accepted these terms.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold tracking-wide transition-colors whitespace-nowrap"
              >
                Contact Legal Team
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
