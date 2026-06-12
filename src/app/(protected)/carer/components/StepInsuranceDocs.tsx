import React from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepInsuranceDocs({ portal, onNext, onBack }: Props) {
  const { complianceDocs, handleUpdateDoc, selectedFiles } = portal;

  const insuranceDocs = [
    { type: "PUBLIC_LIABILITY", label: "Public Liability Insurance *" },
    { type: "PROFESSIONAL_INDEMNITY", label: "Professional Indemnity Insurance *" },
  ];

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

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
            * Important: Please ensure your insurance certificates are in-date and have not expired. Out-of-date documents will not be accepted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insuranceDocs.map((docItem) => (
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
