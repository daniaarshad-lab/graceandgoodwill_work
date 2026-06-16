import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepInsuranceDocs({ portal, onNext, onBack }: Props) {
  const { complianceDocs, selectedFiles } = portal;
  const [submitted, setSubmitted] = useState(false);

  const hasPublicLiability =
    complianceDocs.some((d: ComplianceDoc) => d.type === "PUBLIC_LIABILITY") ||
    !!selectedFiles["public_liability"];
  const hasProfessionalIndemnity =
    complianceDocs.some(
      (d: ComplianceDoc) => d.type === "PROFESSIONAL_INDEMNITY",
    ) || !!selectedFiles["professional_indemnity"];

  const errors = {
    publicLiability: !hasPublicLiability
      ? "Public Liability Insurance is required."
      : "",
    professionalIndemnity: !hasProfessionalIndemnity
      ? "Professional Indemnity Insurance is required."
      : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      return;
    }

    const success = await portal.handleStepBatchUpload(7);
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Insurance Documents
        </h3>

        <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30">
          <p className="text-xs text-red-400 leading-relaxed font-medium">
            * Important: Please ensure your insurance certificates are in-date
            and have not expired. Out-of-date documents will not be accepted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div
              className={`transition-all rounded-xl border ${
                submitted && errors.publicLiability
                  ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                  : "border-transparent"
              }`}
            >
              <DocUploadRow
                label="Public Liability Insurance *"
                type="PUBLIC_LIABILITY"
                portal={portal}
              />
            </div>
            {submitted && errors.publicLiability && (
              <p className="text-xs text-red-500 font-semibold px-1">
                {errors.publicLiability}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div
              className={`transition-all rounded-xl border ${
                submitted && errors.professionalIndemnity
                  ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                  : "border-transparent"
              }`}
            >
              <DocUploadRow
                label="Professional Indemnity Insurance *"
                type="PROFESSIONAL_INDEMNITY"
                portal={portal}
              />
            </div>
            {submitted && errors.professionalIndemnity && (
              <p className="text-xs text-red-500 font-semibold px-1">
                {errors.professionalIndemnity}
              </p>
            )}
          </div>
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

function DocUploadRow({
  label,
  type,
  portal,
}: {
  label: string;
  type: string;
  portal: any;
}) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } =
    portal;
  const doc = complianceDocs.find((d: ComplianceDoc) => d.type === type);
  const isStaged = !!selectedFiles[type.toLowerCase()];

  return (
    <div className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex flex-col gap-2">
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
              handleUpdateDoc(doc.id, type, e);
            } else {
              stageDocUpload(type, e);
            }
          }}
        />
      </label>
    </div>
  );
}
