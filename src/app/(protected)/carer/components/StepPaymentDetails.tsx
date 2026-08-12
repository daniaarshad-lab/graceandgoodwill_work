import FullScreenLoader from "@/components/FullScreenLoader";
import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Info } from "lucide-react";
import { isValidNINumber } from "../utils/validation";

interface Props {
  portal: any;
  onNext: () => void;
  onBack?: () => void;
}

export default function StepPaymentDetails({ portal, onNext, onBack }: Props) {
  const [isLocalSaving, setIsLocalSaving] = useState(false);

  const {
    bankName,
    setBankName,
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    sortCode,
    setSortCode,
    nationalInsuranceNumber,
    setNationalInsuranceNumber,
    handleSaveProfile,
  } = portal;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatSortCode = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Add dashes
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}`;
    }
    if (digits.length > 4) {
      formatted += `-${digits.slice(4, 6)}`;
    }
    return formatted;
  };

  const handleSortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSortCode(formatSortCode(val));
    if (errors.sortCode) {
      setErrors((prev) => ({ ...prev, sortCode: "" }));
    }
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setAccountNumber(val);
    if (errors.accountNumber) {
      setErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  };

  const validateNiNumber = (val: string) => {
    if (!val?.trim()) {
      return "National Insurance Number is required";
    }
    if (!isValidNINumber(val)) {
      return "Enter a valid NI Number: 2 letters, 6 numbers, and 1 letter (e.g. AB123456C)";
    }
    return "";
  };

  const handleNiNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();

    // Filter input character by character based on expected positions
    let filtered = "";
    for (const char of raw) {
      if (filtered.length < 2) {
        if (/[A-Z]/.test(char)) filtered += char;
      } else if (filtered.length < 8) {
        if (/[0-9]/.test(char)) filtered += char;
      } else if (filtered.length === 8) {
        if (/[A-Z]/.test(char)) filtered += char;
      }
    }

    setNationalInsuranceNumber(filtered);

    if (errors.nationalInsuranceNumber) {
      // Clear error immediately if it becomes valid
      const errorMsg = validateNiNumber(filtered);
      if (!errorMsg) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.nationalInsuranceNumber;
          return newErrors;
        });
      }
    }
  };

  const handleNiNumberBlur = () => {
    const errorMsg = validateNiNumber(nationalInsuranceNumber);
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, nationalInsuranceNumber: errorMsg }));
    } else if (errors.nationalInsuranceNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.nationalInsuranceNumber;
        return newErrors;
      });
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!bankName?.trim()) newErrors.bankName = "Bank Name is required";
    if (!accountName?.trim())
      newErrors.accountName = "Name on the Account is required";

    if (!accountNumber?.trim()) {
      newErrors.accountNumber = "Account Number is required";
    } else if (!/^\d{8}$/.test(accountNumber)) {
      newErrors.accountNumber = "Account Number must be exactly 8 digits";
    }

    if (!sortCode?.trim()) {
      newErrors.sortCode = "Sort Code is required";
    } else if (!/^\d{2}-\d{2}-\d{2}$/.test(sortCode)) {
      newErrors.sortCode = "Sort Code must be in XX-XX-XX format";
    }

    const niError = validateNiNumber(nationalInsuranceNumber);
    if (niError) {
      newErrors.nationalInsuranceNumber = niError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit payload via handleSaveProfile
    setIsLocalSaving(true);
    const success = await portal.handleSaveProfile(undefined, 10);
    setIsLocalSaving(false);
    if (success) {
      onNext();
    }
  };

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
          Supplemental Details
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          Please provide your bank details. These will be used for your future
          payments. All items marked with * are compulsory.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name *"
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
                if (errors.bankName)
                  setErrors((prev) => ({ ...prev, bankName: "" }));
              }}
              placeholder="e.g. Barclays, HSBC"
              error={errors.bankName}
            />

            <Input
              label="Name on the Account *"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                if (errors.accountName)
                  setErrors((prev) => ({ ...prev, accountName: "" }));
              }}
              placeholder="e.g. John Smith"
              error={errors.accountName}
            />

            <Input
              label="Account Number *"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="8-digit Account Number"
              error={errors.accountNumber}
            />

            <Input
              label="Sort Code *"
              value={sortCode}
              onChange={handleSortCodeChange}
              placeholder="XX-XX-XX"
              error={errors.sortCode}
            />

            <div className="md:col-span-2">
              <Input
                label={
                  <div className="flex items-center gap-1.5">
                    <span>National Insurance Number *</span>
                    <div className="relative group flex items-center">
                      <Info className="w-3.5 h-3.5 text-gold-200/50 hover:text-gold-200 cursor-help transition-colors" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                        <div className="bg-navy-950 text-gold-100 text-[11px] font-normal leading-relaxed p-3 rounded-lg border border-gold-300/10 shadow-xl relative whitespace-normal">
                          This would be reviewed by admin first, and after it's
                          accepted, if you want to change it, please contact an
                          administrator.
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gold-300/10"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-navy-950 -mt-[1px]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                value={nationalInsuranceNumber}
                onChange={handleNiNumberChange}
                onBlur={handleNiNumberBlur}
                placeholder="e.g. AB123456C"
                error={errors.nationalInsuranceNumber}
                helperText="Format: 2 letters, 6 numbers, and 1 letter (e.g. AB123456C)"
                maxLength={9}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        {onBack ? (
          <Button type="button" variant="ghost-gold" onClick={onBack} disabled={isLocalSaving || portal.isProfileSaving}>
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isLocalSaving || portal.isProfileSaving}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}