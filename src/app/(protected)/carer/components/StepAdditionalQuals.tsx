import FullScreenLoader from "@/components/FullScreenLoader";
import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
import { DocumentFileType } from "@/types/document.types";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAdditionalQuals({ portal, onNext, onBack }: Props) {
  const [isLocalSaving, setIsLocalSaving] = useState(false);

  const { complianceDocs, handleUpdateDoc } = portal;
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Validate OTHER_RELEVANT
  const isOtherDocStaged =
    !!portal.selectedFiles?.[DocumentFileType.OTHER_RELEVANT.toLowerCase()];
  const hasOtherDocUploaded = !!portal.complianceDocs.find(
    (d: ComplianceDoc) => d.type === DocumentFileType.OTHER_RELEVANT,
  );

  const hasFile = isOtherDocStaged || hasOtherDocUploaded;
  const hasName = !!portal.otherRelevantName?.trim();

  let error: string | null = null;
  if (hasAttemptedSubmit) {
    if (hasName && !hasFile) error = "Please upload the certificate file.";
    else if (hasFile && !hasName) error = "Please enter the certificate name.";
  }

  const handleNext = async () => {
    setHasAttemptedSubmit(true);

    if (hasName && !hasFile) return;
    if (hasFile && !hasName) return;

    setIsLocalSaving(true);
    const success = await portal.handleStepBatchUpload(8);
    setIsLocalSaving(false);
    if (success) {
      onNext();
    }
  };

  const optionalDocs = [
    { type: DocumentFileType.NVQ_2, label: "NVQ Level 2" },
    { type: DocumentFileType.NVQ_3, label: "NVQ Level 3" },
    { type: DocumentFileType.NVQ_4, label: "NVQ Level 4" },
    {
      type: DocumentFileType.NURSING_QUALIFICATION,
      label: "Nursing Qualifications",
    },
    {
      type: DocumentFileType.UNIVERSITY_QUALIFICATION,
      label: "University Qualifications",
    },
    { type: DocumentFileType.DEMENTIA_TRAINING, label: "Dementia Training" },
    {
      type: DocumentFileType.END_OF_LIFE_CARE,
      label: "End of Life Care Training",
    },
    { type: DocumentFileType.CATHETER_CARE, label: "Catheter Care Training" },
    { type: DocumentFileType.PEG_FEEDING, label: "PEG Feeding Training" },
    { type: DocumentFileType.STOMA_CARE, label: "Stoma Care Training" },
    { type: DocumentFileType.COMPLEX_CARE, label: "Complex Care Training" },
    {
      type: DocumentFileType.MEDICATION_COMPETENCY,
      label: "Medication Competency Assessments",
    },
    {
      type: DocumentFileType.OTHER_RELEVANT,
      label: "Any Other Relevant Certificates",
    },
  ];

  if (isLocalSaving) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        <FullScreenLoader isVisible={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Additional Qualifications (Optional)
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          Upload any additional training certificates like NVQ Level 2/3/4,
          Nursing Qualifications, Dementia Training, Medication Competency, etc.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionalDocs.map((docItem) => (
            <DocUploadRow
              key={docItem.type}
              label={docItem.label}
              type={docItem.type}
              portal={portal}
              error={
                docItem.type === DocumentFileType.OTHER_RELEVANT
                  ? error
                  : undefined
              }
            />
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack} disabled={isLocalSaving || portal.isProfileSaving}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isLocalSaving || portal.isProfileSaving}
        >
          "Save & Continue"
        </Button>
      </div>
      </div>
  );
}

function DocUploadRow({
  label,
  type,
  portal,
  error,
}: {
  label: string;
  type: string;
  portal: any;
  error?: string | null;
}) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } =
    portal;
  const doc = complianceDocs.find((d: ComplianceDoc) => d.type === type);
  const isStaged = !!selectedFiles[type.toLowerCase()];

  const isOther = type === DocumentFileType.OTHER_RELEVANT;
  const [certName, setCertName] = React.useState(doc?.name || "");

  return (
    <div
      className={`p-4 rounded-xl border ${error && isOther ? "border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.15)]" : "border-gold-300/10"} bg-navy-950/40 flex flex-col gap-2 h-full`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium text-gold-50">{label}</span>
        {doc ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap ml-2">
            Uploaded
          </span>
        ) : isStaged ? (
          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20 whitespace-nowrap ml-2">
            Selected
          </span>
        ) : null}
      </div>

      {isOther && (doc || isStaged) && (
        <div className="mb-2">
          <input
            type="text"
            value={certName}
            onChange={(e) => {
              setCertName(e.target.value);
              if (portal.setOtherRelevantName) {
                portal.setOtherRelevantName(e.target.value);
              }
            }}
            placeholder="Enter certificate name"
            className={`w-full rounded-lg border ${error && !certName ? "border-red-500/50 focus:ring-red-500" : "border-gray-300/20 focus:ring-gold-DEFAULT"} bg-navy-900 px-3 py-2 text-gold-100 outline-none focus:ring-1 transition duration-300 text-xs`}
          />
        </div>
      )}

      <div className="mt-auto">
        <label className="cursor-pointer text-xs font-semibold text-gold-DEFAULT hover:text-gold-200 inline-block">
          {doc ? "Update File" : isStaged ? "Change Selected" : "Choose File"}
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              if (doc) {
                handleUpdateDoc(doc.id, type, e);
              } else {
                portal.stageDocUpload(type, e);
              }
            }}
          />
        </label>
      </div>

      {isOther && error && (
        <p className="text-[11px] text-red-400 mt-2 font-medium">{error}</p>
      )}
      </div>
  );
}