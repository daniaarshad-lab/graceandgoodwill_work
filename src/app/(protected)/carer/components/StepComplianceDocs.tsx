import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
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

  const requiredDocs = [
    { type: "ENHANCED_DBS", label: "Enhanced DBS Certificate *" },
    { type: "CV", label: "CV / Resume *" },
    { type: "REFERENCE_1", label: "Professional Reference 1 *" },
    { type: "REFERENCE_2", label: "Professional Reference 2 *" },
  ];

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    await portal.handleSaveProfile(syntheticEvent);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocs.map((docItem) => (
            <DocUploadRow key={docItem.type} label={docItem.label} type={docItem.type} portal={portal} />
          ))}
        </div>

        <div className="pt-6 pb-2">
          <h4 className="text-lg font-semibold text-gold-200 mb-4">Additional References (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: additionalRefsCount }).map((_, index) => (
              <DocUploadRow 
                key={`ADDITIONAL_REFERENCE_${index + 1}`} 
                label="Upload Additional Reference" 
                type={`ADDITIONAL_REFERENCE_${index + 1}`} 
                portal={portal} 
              />
            ))}
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
              className="w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm border-gray-300/20"
            />
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
