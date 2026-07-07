import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface Props {
  portal: any;
  onNext: () => void;
  onBack?: () => void;
}

export default function StepPaymentDetails({ portal, onNext, onBack }: Props) {
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

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
    setAccountNumber(val);
    if (errors.accountNumber) {
      setErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  };

  const handleNiNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNationalInsuranceNumber(e.target.value.toUpperCase());
    if (errors.nationalInsuranceNumber) {
      setErrors((prev) => ({ ...prev, nationalInsuranceNumber: "" }));
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!bankName?.trim()) newErrors.bankName = "Bank Name is required";
    if (!accountName?.trim()) newErrors.accountName = "Name on the Account is required";

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

    if (!nationalInsuranceNumber?.trim()) {
      newErrors.nationalInsuranceNumber = "National Insurance Number is required";
    } else if (!/^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]$/i.test(nationalInsuranceNumber.replace(/\s/g, ""))) {
      newErrors.nationalInsuranceNumber = "Please enter a valid UK National Insurance Number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit payload via handleSaveProfile
    const success = await portal.handleSaveProfile(undefined, 10);
    if (success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Payment Details
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          Please provide your bank details. These will be used for your future payments. Your National Insurance Number is required for identity and tax verification. All items marked with * are compulsory.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name *"
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
                if (errors.bankName) setErrors((prev) => ({ ...prev, bankName: "" }));
              }}
              placeholder="e.g. Barclays, HSBC"
              error={errors.bankName}
            />

            <Input
              label="Name on the Account *"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                if (errors.accountName) setErrors((prev) => ({ ...prev, accountName: "" }));
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
                label="National Insurance Number *"
                value={nationalInsuranceNumber}
                onChange={handleNiNumberChange}
                placeholder="e.g. AB123456C"
                error={errors.nationalInsuranceNumber}
              />
              <p className="text-[11px] text-gold-200/50 mt-2">
                National Insurance Number cannot be changed after registration.
              </p>
            </div>
          </div>

        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        {onBack ? (
          <Button type="button" variant="ghost-gold" onClick={onBack}>
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button type="button" variant="primary" onClick={handleNext} disabled={portal.isProfileSaving}>
          {portal.isProfileSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
