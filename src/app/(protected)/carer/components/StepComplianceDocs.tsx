import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
import { DocumentFileType } from "@/types/document.types";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepComplianceDocs({ portal, onNext, onBack }: Props) {
  const [additionalRefsCount, setAdditionalRefsCount] = useState(3);
  const {
    employmentHistory, setEmploymentHistory,
    dbsUpdateServiceNumber, setDbsUpdateServiceNumber,
    complianceDocs, handleUpdateDoc, selectedFiles
  } = portal;

  const [submitted, setSubmitted] = useState(false);

  const requiredDocs = [
    { type: DocumentFileType.ENHANCED_DBS_CERTIFICATE, label: "Enhanced DBS Certificate *" },
    { type: DocumentFileType.CV_RESUME, label: "CV / Resume *" },
    { type: DocumentFileType.PROFESSIONAL_REFERENCE_1, label: "Professional Reference 1 *" },
    { type: DocumentFileType.PROFESSIONAL_REFERENCE_2, label: "Professional Reference 2 *" },
  ];

  const missingDocs = requiredDocs.filter(docItem => {
    const doc = complianceDocs.find((d: ComplianceDoc) => d.type === docItem.type);
    const isStaged = !!selectedFiles[docItem.type.toLowerCase()];
    return !doc && !isStaged;
  });

  const errors = {
    missingDocs: missingDocs.length > 0 ? `Please upload: ${missingDocs.map(d => d.label.replace(" *", "")).join(", ")}` : "",
    employmentHistory: (!employmentHistory || employmentHistory.trim().length < 20) ? "Please provide your employment history details (minimum 20 characters)." : ""
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      return;
    }

    const success = await portal.handleStepBatchUpload(6);
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Required Compliance Documents
        </h3>

        <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30">
          <p className="text-xs text-red-400 leading-relaxed font-medium">
            * Important: Please ensure all uploaded documents (like your DBS certificate) are in-date and have not expired. Out-of-date documents will not be accepted.
          </p>
        </div>

        {submitted && errors.missingDocs && (
          <p className="text-xs text-red-500 font-semibold mb-4 bg-red-950/15 border border-red-900/35 p-3 rounded-xl">
            {errors.missingDocs}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocs.map((docItem) => {
            const doc = complianceDocs.find((d: ComplianceDoc) => d.type === docItem.type);
            const isStaged = !!selectedFiles[docItem.type.toLowerCase()];
            const isMissing = !doc && !isStaged;
            return (
              <DocUploadRow
                key={docItem.type}
                label={docItem.label}
                type={docItem.type}
                portal={portal}
                isMissing={submitted && isMissing}
              />
            );
          })}
        </div>

        <div className="pt-6 pb-2">
          <h4 className="text-lg font-semibold text-gold-200 mb-4">Additional References (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: additionalRefsCount }).map((_, index) => {
              const stageKey = `${DocumentFileType.ADDITIONAL_REFERENCE}_${index + 1}`;
              return (
                <DocUploadRow
                  key={stageKey}
                  label={`Additional Reference ${index + 1}`}
                  type={DocumentFileType.ADDITIONAL_REFERENCE}
                  stageKey={stageKey}
                  index={index}
                  portal={portal}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setAdditionalRefsCount(prev => prev + 1)}
            className="mt-4 text-sm font-semibold text-gold-DEFAULT hover:text-gold-200 transition-colors inline-block"
          >
            + Add Another Reference
          </button>
        </div>

        <div className="space-y-4 pt-4 border-t border-gold-300/10">
          <Input
            label="DBS Update Service Number (if subscribed)"
            value={dbsUpdateServiceNumber}
            onChange={(e) => setDbsUpdateServiceNumber(e.target.value)}
            placeholder="Enter DBS Update Service Number"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gold-200">
              Employment History (Last 5 Years) *
            </label>
            <p className="text-xs text-gold-100/60 mb-2">
              Please provide your employment history covering the last 5 years, including an explanation for any employment gaps.
            </p>
            <textarea
              rows={6}
              value={employmentHistory}
              onChange={(e) => setEmploymentHistory(e.target.value)}
              placeholder="e.g. 2020-2023: Care Assistant at ABC Care Home. 2023-Present: Independent Carer. Gap in 2019 due to travel..."
              className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${submitted && errors.employmentHistory ? 'border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]' : 'border-gray-300/20'}`}
            />
            {submitted && errors.employmentHistory && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.employmentHistory}</p>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={handleNext}>Save & Continue</Button>
      </div>
    </div>
  );
}

function DocUploadRow({ label, type, portal, isMissing, stageKey, index }: { label: string, type: string, portal: any, isMissing?: boolean, stageKey?: string, index?: number }) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } = portal;
  
  // For multiple documents of the same type (like ADDITIONAL_REFERENCE)
  let doc;
  if (index !== undefined) {
    const docsOfType = complianceDocs.filter((d: ComplianceDoc) => d.type === type);
    doc = docsOfType[index];
  } else {
    doc = complianceDocs.find((d: ComplianceDoc) => d.type === type);
  }

  const sKey = stageKey ? stageKey.toLowerCase() : type.toLowerCase();
  const isStaged = !!selectedFiles[sKey];

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${isMissing ? 'border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)] bg-red-950/5' : 'border-gold-300/10 bg-navy-950/40'}`}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gold-50">{label}</span>
        {doc ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Uploaded
          </span>
        ) : isStaged ? (
          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
            Selected
          </span>
        ) : null}
      </div>
      <label className="cursor-pointer text-xs font-semibold text-gold-DEFAULT hover:text-gold-200 inline-block mt-1">
        {doc ? "Update File" : isStaged ? "Change Selected" : "Choose File"}
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            if (doc) {
              handleUpdateDoc(doc.id, stageKey || type, e);
            } else {
              stageDocUpload(stageKey || type, e);
            }
          }}
        />
      </label>
    </div>
  );
}
