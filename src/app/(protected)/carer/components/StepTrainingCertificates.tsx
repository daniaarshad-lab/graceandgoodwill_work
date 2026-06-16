import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTrainingCertificates({
  portal,
  onNext,
  onBack,
}: Props) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } =
    portal;

  const [submitted, setSubmitted] = useState(false);

  const trainingDocs = [
    { type: "SAFEGUARDING_ADULTS", label: "Safeguarding Adults" },
    { type: "MOVING_AND_HANDLING", label: "Moving and Handling" },
    { type: "MEDICATION_ADMINISTRATION", label: "Medication Administration" },
    { type: "BASIC_LIFE_SUPPORT", label: "Basic Life Support / First Aid" },
    { type: "INFECTION_PREVENTION", label: "Infection Prevention and Control" },
    { type: "HEALTH_AND_SAFETY", label: "Health and Safety" },
    { type: "FIRE_SAFETY", label: "Fire Safety" },
    { type: "FOOD_HYGIENE", label: "Food Hygiene" },
    { type: "GDPR", label: "GDPR / Data Protection" },
  ];

  const missingDocs = trainingDocs.filter((docItem) => {
    const doc = complianceDocs.find(
      (d: ComplianceDoc) => d.type === docItem.type,
    );
    const isStaged = !!selectedFiles[docItem.type.toLowerCase()];
    return !doc && !isStaged;
  });

  const hasErrors = missingDocs.length > 0;

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      return;
    }

    const success = await portal.handleStepBatchUpload(5);
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Mandatory Care Training Certificates
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          Please upload your valid training certificates for the following
          compulsory modules:
        </p>

        <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30 mb-6">
          <p className="text-xs text-red-400 leading-relaxed font-medium">
            * Important: Please ensure all uploaded certificates are in-date and
            have not expired. Out-of-date documents will not be accepted.
          </p>
        </div>

        {submitted && hasErrors && (
          <p className="text-xs text-red-500 font-semibold mb-4 bg-red-950/15 border border-red-900/35 p-3 rounded-xl">
            Please upload certificates for:{" "}
            {missingDocs.map((d) => d.label).join(", ")}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingDocs.map((docItem) => {
            const doc = complianceDocs.find(
              (d: ComplianceDoc) => d.type === docItem.type,
            );
            const isStaged = !!selectedFiles[docItem.type.toLowerCase()];
            const isMissing = !doc && !isStaged;
            return (
              <div
                key={docItem.type}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  submitted && isMissing
                    ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)] bg-red-950/5"
                    : "border-gold-300/10 bg-navy-950/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gold-50">
                    {docItem.label} *
                  </span>
                  {doc ? (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      Uploaded
                    </span>
                  ) : isStaged ? (
                    <span className="text-[9px] font-bold text-gold-400 bg-gold-500/10 px-1.5 py-0.5 rounded-full border border-gold-500/20">
                      Selected
                    </span>
                  ) : null}
                </div>
                <label className="cursor-pointer text-[11px] font-semibold text-gold-DEFAULT hover:text-gold-200 inline-block mt-auto pt-2">
                  {doc
                    ? "Update File"
                    : isStaged
                      ? "Change Selected"
                      : "Choose File"}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (doc) {
                        handleUpdateDoc(doc.id, docItem.type, e);
                      } else {
                        stageDocUpload(docItem.type, e);
                      }
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={handleNext}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
