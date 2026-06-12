import React from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { ComplianceDoc } from "../types/carer.types";
import { Check } from "lucide-react";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepIdentityVerification({ portal, onNext, onBack }: Props) {
  const {
    drivingPreferences, setDrivingPreferences,
    complianceDocs, handleUpdateDoc, selectedFiles
  } = portal;

  const drivingOptions = [
    "I am happy to transport clients in my own vehicle",
    "I am happy to drive a client's vehicle (subject to the client's insurance arrangements)"
  ];

  const safePreferences = drivingPreferences || [];
  const hasOwnVehiclePref = safePreferences.includes(drivingOptions[0]);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Save driving preferences
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    await portal.handleSaveProfile(syntheticEvent);

    const success = await portal.handleStepBatchUpload(2);
    if (success) {
      onNext();
    }
  };

  // const drivingOptions = [
  //   "I am happy to transport clients in my own vehicle",
  //   "I am happy to drive a client's vehicle (subject to the client's insurance arrangements)"
  // ];

  // const safePreferences = drivingPreferences || [];

  const handlePreferenceToggle = (pref: string) => {
    setDrivingPreferences((prev: string[]) => {
      const current = prev || [];
      return current.includes(pref) ? current.filter(p => p !== pref) : [...current, pref];
    });
  };

  const hasDrivingLicence = complianceDocs.some((d: ComplianceDoc) => d.type === "DRIVERS_LICENSE") || !!selectedFiles["drivers_license"];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Identity Verification
        </h3>
        
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-gold-300/10 bg-navy-900/30 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gold-50">Passport or Driving Licence *</h4>
              <p className="text-xs text-gold-100/60 mt-1">Please upload EITHER your Passport OR your Driving Licence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocUploadRow label="Passport" type="PASSPORT" portal={portal} />
              <DocUploadRow label="Driving Licence" type="DRIVERS_LICENSE" portal={portal} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocUploadRow label="Proof of Address (issued within last 3 months) *" type="PROOF_OF_ADDRESS" portal={portal}>
              <div className="mt-2">
                <p className="text-gold-100/80 mb-1.5 font-medium">Accepted Proof of Address Documents:</p>
                <ul className="list-disc pl-4 space-y-1 text-gold-100/60">
                  <li>Utility Bill (Gas, Electricity or Water)</li>
                  <li>Council Tax Bill</li>
                  <li>Bank Statement</li>
                  <li>Credit Card Statement</li>
                  <li>HMRC Letter</li>
                  <li>Tenancy Agreement</li>
                  <li>Mortgage Statement</li>
                </ul>
              </div>
            </DocUploadRow>

            <div className="space-y-4">
              <DocUploadRow label="Right to Work in the UK *" type="RIGHT_TO_WORK" portal={portal} />
              
              <DocUploadRow label="Proof of National Insurance Number *" type="NI_PROOF" portal={portal}>
                <div className="mt-2">
                  <p className="text-gold-100/80 mb-1.5 font-medium">Accepted Documents:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gold-100/60">
                    <li>HMRC Letter</li>
                    <li>Payslip</li>
                    <li>P60</li>
                    <li>National Insurance Confirmation Letter</li>
                  </ul>
                </div>
              </DocUploadRow>
            </div>
          </div>

          {hasDrivingLicence && (
            <div className="mt-6 p-5 rounded-xl border border-gold-300/20 bg-navy-900/50">
              <h4 className="text-md font-semibold text-gold-100 mb-2">Driving Preferences</h4>
              <p className="text-xs text-gold-100/60 mb-4">You can select either option or both options.</p>
              <div className="space-y-3">
                {drivingOptions.map((opt) => (
                  <div 
                    key={opt} 
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => handlePreferenceToggle(opt)}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <div className={`w-5 h-5 border-2 rounded transition-all ${safePreferences.includes(opt) ? 'bg-gold border-gold' : 'border-gold-300/30'}`} />
                      <Check className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${safePreferences.includes(opt) ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <span className="text-sm text-gold-100/80 group-hover:text-gold-50">{opt}</span>
                  </div>
                ))}
              </div>

              {hasOwnVehiclePref && (
                <div className="mt-5 pt-5 border-t border-gold-300/10">
                  <h5 className="text-sm font-medium text-gold-200 mb-2">Business Use Insurance Cover *</h5>
                  <div className="bg-navy-950/40 p-4 rounded-xl border border-gold-300/10">
                    <DocUploadRow label="Upload Certificate" type="BUSINESS_INSURANCE" portal={portal} />
                    <p className="text-xs text-red-400 mt-3 leading-relaxed bg-red-950/20 p-2 rounded border border-red-900/30">
                      Social, Domestic & Pleasure insurance alone is not accepted where a carer intends to transport clients in their own vehicle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button type="button" variant="ghost-gold" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" onClick={handleNext}>Save & Continue</Button>
      </div>
    </div>
  );
}

function DocUploadRow({ label, type, portal, children }: { label: string, type: string, portal: any, children?: React.ReactNode }) {
  const { complianceDocs, stageDocUpload, handleUpdateDoc, selectedFiles } = portal;
  const doc = complianceDocs.find((d: ComplianceDoc) => d.type === type);
  const isStaged = !!selectedFiles[type.toLowerCase()];
  
  return (
    <div className="p-4 rounded-xl border border-gold-300/10 bg-navy-950/40 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gold-50">{label}</span>
        {doc ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0 ml-2">
            Uploaded
          </span>
        ) : isStaged ? (
          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20 shrink-0 ml-2">
            Selected
          </span>
        ) : null}
      </div>
      {children && <div className="text-[11px] leading-relaxed">{children}</div>}
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
