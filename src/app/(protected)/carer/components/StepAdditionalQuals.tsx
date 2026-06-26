import React from "react";
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
  const { complianceDocs, handleUpdateDoc } = portal;

  const handleNext = async () => {
    const success = await portal.handleStepBatchUpload(8);
    if (success) {
      onNext();
    }
  };

  const optionalDocs = [
    { type: DocumentFileType.NVQ_LEVEL_2, label: "NVQ Level 2" },
    { type: DocumentFileType.NVQ_LEVEL_3, label: "NVQ Level 3" },
    { type: DocumentFileType.NVQ_LEVEL_4, label: "NVQ Level 4" },
    { type: DocumentFileType.NURSING_QUALIFICATIONS, label: "Nursing Qualifications" },
    { type: DocumentFileType.UNIVERSITY_QUALIFICATIONS, label: "University Qualifications" },
    { type: DocumentFileType.DEMENTIA_TRAINING, label: "Dementia Training" },
    { type: DocumentFileType.END_OF_LIFE_CARE_TRAINING, label: "End of Life Care Training" },
    { type: DocumentFileType.CATHETER_CARE_TRAINING, label: "Catheter Care Training" },
    { type: DocumentFileType.PEG_FEEDING_TRAINING, label: "PEG Feeding Training" },
    { type: DocumentFileType.STOMA_CARE_TRAINING, label: "Stoma Care Training" },
    { type: DocumentFileType.COMPLEX_CARE_TRAINING, label: "Complex Care Training" },
    { type: DocumentFileType.MEDICATION_COMPETENCY_ASSESSMENT, label: "Medication Competency Assessments" },
    { type: DocumentFileType.OTHER_RELEVANT_CERTIFICATE, label: "Any Other Relevant Certificates" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Additional Qualifications (Optional)
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          Upload any additional training certificates like NVQ Level 2/3/4, Nursing Qualifications, Dementia Training, Medication Competency, etc.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionalDocs.map((docItem) => (
            <DocUploadRow key={docItem.type} label={docItem.label} type={docItem.type} portal={portal} />
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={handleNext}>Save & Continue</Button>
      </div>
    </div>
  );
}

function DocUploadRow({ label, type, portal }: { label: string, type: string, portal: any }) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } = portal;
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
