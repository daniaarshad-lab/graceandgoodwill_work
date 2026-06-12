import React from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTrainingCertificates({ portal, onNext, onBack }: Props) {
  const { complianceDocs, handleDocUpload, handleUpdateDoc } = portal;

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Mandatory Care Training Certificates
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">Please upload your valid training certificates for the following compulsory modules:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingDocs.map((docItem) => {
            const doc = complianceDocs.find((d: ComplianceDoc) => d.type === docItem.type);
            return (
              <div key={docItem.type} className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gold-50">{docItem.label} (*)</span>
                  {doc && (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      Uploaded
                    </span>
                  )}
                </div>
                <label className="cursor-pointer text-[11px] font-semibold text-gold-DEFAULT hover:text-gold-200 inline-block mt-auto pt-2">
                  {doc ? "Update File" : "Choose File"}
                  <input 
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg" 
                    className="hidden" 
                    onChange={(e) => {
                      if (doc) {
                        handleUpdateDoc(doc.id, docItem.type, e);
                      } else {
                        handleDocUpload(docItem.type, e);
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
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={onNext}>Save & Continue</Button>
      </div>
    </div>
  );
}
