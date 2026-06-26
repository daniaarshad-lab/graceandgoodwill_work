import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import { ComplianceDoc } from "../types/carer.types";
import { DocumentFileType } from "@/types/document.types";
import { Check } from "lucide-react";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepIdentityVerification({
  portal,
  onNext,
  onBack,
}: Props) {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    dateOfBirth,
    setDateOfBirth,
    address,
    setAddress,
    postcode,
    setPostcode,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactNumber,
    setEmergencyContactNumber,
    emergencyContactRelation,
    setEmergencyContactRelation,
    drivingPreferences,
    setDrivingPreferences,
    complianceDocs,
    handleUpdateDoc,
    selectedFiles,
    canDrive,
    hasBusinessInsurance,
  } = portal;

  const [submitted, setSubmitted] = useState(false);
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const drivingOptions = [
    "I am happy to transport clients in my own vehicle",
    "I am happy to drive a client's vehicle (subject to the client's insurance arrangements)",
  ];

  const safePreferences = drivingPreferences || [];
  const hasOwnVehiclePref = safePreferences.includes(drivingOptions[0]);

  const hasPassport =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.PASSPORT) ||
    !!selectedFiles[DocumentFileType.PASSPORT.toLowerCase()];
  const hasDL =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.DRIVING_LICENCE) ||
    !!selectedFiles[DocumentFileType.DRIVING_LICENCE.toLowerCase()];
  const hasPassportOrDL = hasPassport || hasDL;

  const hasProofOfAddress =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.PROOF_OF_ADDRESS) ||
    !!selectedFiles[DocumentFileType.PROOF_OF_ADDRESS.toLowerCase()];
  const hasRightToWork =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.RIGHT_TO_WORK) ||
    !!selectedFiles[DocumentFileType.RIGHT_TO_WORK.toLowerCase()];
  const hasNiProof =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.NATIONAL_INSURANCE_PROOF) ||
    !!selectedFiles[DocumentFileType.NATIONAL_INSURANCE_PROOF.toLowerCase()];
  const hasBusinessInsuranceDoc =
    complianceDocs.some(
      (d: ComplianceDoc) => d.type === DocumentFileType.PUBLIC_LIABILITY_INSURANCE,
    ) || !!selectedFiles[DocumentFileType.PUBLIC_LIABILITY_INSURANCE.toLowerCase()];

  const docErrors = {
    passportOrDL: !hasPassportOrDL
      ? "Please upload either your Passport or Driving Licence."
      : "",
    proofOfAddress: !hasProofOfAddress ? "Proof of Address is required." : "",
    rightToWork: !hasRightToWork ? "Right to Work in the UK is required." : "",
    niProof: !hasNiProof
      ? "Proof of National Insurance Number is required."
      : "",
    businessInsurance:
      hasDL && hasOwnVehiclePref && !hasBusinessInsuranceDoc
        ? "Business Use Insurance is required since you selected 'I am happy to transport clients in my own vehicle'."
        : "",
  };

  const hasDocErrors = Object.values(docErrors).some(Boolean);

  const handlePostcodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    setPostcode(val);

    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.postcode;
        return copy;
      });
    }

    if (val.length > 2) {
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${val}/autocomplete`,
        );
        const data = await res.json();
        if (data.status === 200) {
          setPostcodeSuggestions(data.result || []);
          setShowSuggestions(true);
        } else {
          setPostcodeSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Postcode fetch error", err);
      }
    } else {
      setPostcodeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getLocalYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maxDate = getLocalYesterdayDateString();

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors: Record<string, string> = {};

    // Validate Personal Info
    if (!firstName?.trim() || !lastName?.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (!address?.trim()) {
      newErrors.address = "Address is required";
    }
    if (!postcode?.trim()) {
      newErrors.postcode = "Postcode is required";
    }
    if (!email?.trim()) {
      newErrors.email = "Email Address is required";
    }
    if (!phone?.trim()) {
      newErrors.phone = "Mobile Number is required";
    }
    if (!emergencyContactName?.trim()) {
      newErrors.emergencyContactName = "Emergency Contact Name is required";
    }
    if (!emergencyContactNumber?.trim()) {
      newErrors.emergencyContactNumber = "Emergency Contact Number is required";
    }
    if (!emergencyContactRelation?.trim()) {
      newErrors.emergencyContactRelation =
        "Emergency Contact Relationship is required";
    }

    if (Object.keys(newErrors).length > 0 || hasDocErrors) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Save Personal Information (backend step 2)
    const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
    let success = await portal.handleSaveProfile(syntheticEvent, 2);
    if (!success) return;

    // Save Driving Preferences / vehicle info (backend step 3)
    await portal.handleSaveProfile(syntheticEvent, 3);

    // Upload identity documents (backend step 2)
    success = await portal.handleStepBatchUpload(2);
    if (success) {
      onNext();
    }
  };

  const handlePreferenceToggle = (pref: string) => {
    setDrivingPreferences((prev: string[]) => {
      const current = prev || [];
      return current.includes(pref)
        ? current.filter((p) => p !== pref)
        : [...current, pref];
    });
  };

  const hasDrivingLicence =
    complianceDocs.some((d: ComplianceDoc) => d.type === DocumentFileType.DRIVING_LICENCE) ||
    !!selectedFiles[DocumentFileType.DRIVING_LICENCE.toLowerCase()];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Part 1: Personal Information Card */}
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Personal Information
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          All items marked with * are compulsory.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            value={`${firstName || ""} ${lastName || ""}`.trim()}
            onChange={(e) => {
              const val = e.target.value;
              const parts = val.split(" ");
              setFirstName(parts[0] || "");
              setLastName(parts.slice(1).join(" ") || "");
              if (parts[0]?.trim() && parts.slice(1).join(" ")?.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.fullName;
                  return copy;
                });
              }
            }}
            placeholder="Full Name"
            error={errors.fullName}
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={dateOfBirth ? dateOfBirth.split("T")[0] : ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val && val > maxDate) {
                showErrorToast(
                  "Validation Error",
                  "Date of Birth cannot be today or a future date.",
                );
                return;
              }
              setDateOfBirth(val);
              if (val) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.dateOfBirth;
                  return copy;
                });
              }
            }}
            placeholder="DD/MM/YYYY"
            max={maxDate}
            error={errors.dateOfBirth}
          />
          <Input
            label="Address *"
            value={address}
            onChange={(e) => {
              const val = e.target.value;
              setAddress(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.address;
                  return copy;
                });
              }
            }}
            placeholder="Full Address"
            error={errors.address}
          />
          <div className="relative">
            <Input
              label="Postcode *"
              value={postcode}
              onChange={handlePostcodeChange}
              placeholder="Postcode"
              error={errors.postcode}
            />
            {showSuggestions && postcodeSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-navy-900 border border-gold-300/20 rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-h-48 overflow-y-auto">
                {postcodeSuggestions.map((p) => (
                  <li
                    key={p}
                    className="px-4 py-2 text-sm text-gold-100 hover:bg-gold-DEFAULT/10 cursor-pointer"
                    onClick={() => {
                      setPostcode(p);
                      setShowSuggestions(false);
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.postcode;
                        return copy;
                      });
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.email;
                  return copy;
                });
              }
            }}
            placeholder="Email"
            error={errors.email}
          />
          <PhoneInput
            label="Mobile Number *"
            value={phone}
            onChange={(val) => {
              setPhone(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.phone;
                  return copy;
                });
              }
            }}
            placeholder="Mobile Number"
            error={errors.phone}
          />
        </div>

        <div className="pt-6 mt-6 border-t border-gold-300/10">
          <h4 className="text-lg font-semibold text-gold-200 mb-4">
            Emergency Contact Details *
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Contact Name *"
              value={emergencyContactName}
              onChange={(e) => {
                const val = e.target.value;
                setEmergencyContactName(val);
                if (val.trim()) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.emergencyContactName;
                    return copy;
                  });
                }
              }}
              placeholder="Name"
              error={errors.emergencyContactName}
            />
            <PhoneInput
              label="Contact Number *"
              value={emergencyContactNumber}
              onChange={(val) => {
                setEmergencyContactNumber(val);
                if (val.trim()) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.emergencyContactNumber;
                    return copy;
                  });
                }
              }}
              placeholder="Phone"
              error={errors.emergencyContactNumber}
            />
            <Input
              label="Relationship *"
              value={emergencyContactRelation}
              onChange={(e) => {
                const val = e.target.value;
                setEmergencyContactRelation(val);
                if (val.trim()) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.emergencyContactRelation;
                    return copy;
                  });
                }
              }}
              placeholder="e.g. Spouse, Parent"
              error={errors.emergencyContactRelation}
            />
          </div>
        </div>
      </SectionCard>

      {/* Part 2: Identity Documents Card */}
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Identity Documents
        </h3>

        <div className="space-y-6">
          <div
            className={`p-5 rounded-xl border bg-navy-900/30 space-y-4 transition-all ${submitted && docErrors.passportOrDL ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-gold-300/10"}`}
          >
            <div>
              <h4 className="text-sm font-semibold text-gold-50">
                Passport or Driving Licence *
              </h4>
              <p className="text-xs text-gold-100/60 mt-1">
                Please upload EITHER your Passport OR your Driving Licence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocUploadRow label="Passport" type={DocumentFileType.PASSPORT} portal={portal} />
              <DocUploadRow
                label="Driving Licence"
                type={DocumentFileType.DRIVING_LICENCE}
                portal={portal}
              />
            </div>
            {submitted && docErrors.passportOrDL && (
              <p className="text-xs text-red-500 font-semibold">
                {docErrors.passportOrDL}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div
                className={`transition-all rounded-xl border ${submitted && docErrors.proofOfAddress ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-transparent"}`}
              >
                <DocUploadRow
                  label="Proof of Address (issued within last 3 months) *"
                  type={DocumentFileType.PROOF_OF_ADDRESS}
                  portal={portal}
                >
                  <div className="mt-2">
                    <p className="text-gold-100/80 mb-1.5 font-medium">
                      Accepted Proof of Address Documents:
                    </p>
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
              </div>
              {submitted && docErrors.proofOfAddress && (
                <p className="text-xs text-red-500 font-semibold px-1">
                  {docErrors.proofOfAddress}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div
                  className={`transition-all rounded-xl border ${submitted && docErrors.rightToWork ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-transparent"}`}
                >
                  <DocUploadRow
                    label="Right to Work in the UK *"
                    type={DocumentFileType.RIGHT_TO_WORK}
                    portal={portal}
                  />
                </div>
                {submitted && docErrors.rightToWork && (
                  <p className="text-xs text-red-500 font-semibold px-1">
                    {docErrors.rightToWork}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div
                  className={`transition-all rounded-xl border ${submitted && docErrors.niProof ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-transparent"}`}
                >
                  <DocUploadRow
                    label="Proof of National Insurance Number *"
                    type={DocumentFileType.NATIONAL_INSURANCE_PROOF}
                    portal={portal}
                  >
                    <div className="mt-2">
                      <p className="text-gold-100/80 mb-1.5 font-medium">
                        Accepted Documents:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-gold-100/60">
                        <li>HMRC Letter</li>
                        <li>Payslip</li>
                        <li>P60</li>
                        <li>National Insurance Confirmation Letter</li>
                      </ul>
                    </div>
                  </DocUploadRow>
                </div>
                {submitted && docErrors.niProof && (
                  <p className="text-xs text-red-500 font-semibold px-1">
                    {docErrors.niProof}
                  </p>
                )}
              </div>
            </div>
          </div>

          {hasDrivingLicence && (
            <div className="mt-6 p-5 rounded-xl border border-gold-300/20 bg-navy-900/50">
              <h4 className="text-md font-semibold text-gold-100 mb-2">
                Driving Preferences
              </h4>
              <p className="text-xs text-gold-100/60 mb-4">
                You can select either option or both options.
              </p>
              <div className="space-y-3">
                {drivingOptions.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => handlePreferenceToggle(opt)}
                  >
                    <div className="relative flex items-center justify-center mt-0.5">
                      <div
                        className={`w-5 h-5 border-2 rounded transition-all ${safePreferences.includes(opt) ? "bg-gold border-gold" : "border-gold-300/30"}`}
                      />
                      <Check
                        className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${safePreferences.includes(opt) ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                    <span className="text-sm text-gold-100/80 group-hover:text-gold-50">
                      {opt}
                    </span>
                  </div>
                ))}
              </div>

              {hasOwnVehiclePref && (
                <div className="mt-5 pt-5 border-t border-gold-300/10">
                  <h5 className="text-sm font-medium text-gold-200 mb-2">
                    Business Use Insurance Cover *
                  </h5>
                  <div
                    className={`bg-navy-950/40 p-4 rounded-xl border space-y-2 transition-all ${submitted && docErrors.businessInsurance ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-gold-300/10"}`}
                  >
                    <DocUploadRow
                      label="Upload Certificate"
                      type={DocumentFileType.PUBLIC_LIABILITY_INSURANCE}
                      portal={portal}
                    />
                    {submitted && docErrors.businessInsurance && (
                      <p className="text-xs text-red-500 font-semibold">
                        {docErrors.businessInsurance}
                      </p>
                    )}
                    <p className="text-xs text-red-400 mt-3 leading-relaxed bg-red-950/20 p-2 rounded border border-red-900/30">
                      Social, Domestic & Pleasure insurance alone is not
                      accepted where a carer intends to transport clients in
                      their own vehicle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
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
  children,
}: {
  label: string;
  type: string;
  portal: any;
  children?: React.ReactNode;
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
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0 ml-2">
            Uploaded
          </span>
        ) : isStaged ? (
          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20 shrink-0 ml-2">
            Selected
          </span>
        ) : null}
      </div>
      {children && (
        <div className="text-[11px] leading-relaxed">{children}</div>
      )}
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
