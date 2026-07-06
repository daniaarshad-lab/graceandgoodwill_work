import React, { useState, useRef } from "react";
import Input from "@/components/Input";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { toast } from "sonner";

interface ReferralFormCarerProps {
  onSubmit: (formData: FormData) => Promise<boolean>;
  submitting: boolean;
}

export default function ReferralFormCarer({
  onSubmit,
  submitting,
}: ReferralFormCarerProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      tempErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        tempErrors.email = "Please enter a valid email address";
      }
    }

    if (!phone.trim()) {
      tempErrors.phone = "Phone number is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.firstName;
        return copy;
      });
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.lastName;
        return copy;
      });
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const trimmed = val.trim();
    if (trimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(trimmed)) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.email;
          return copy;
        });
      } else {
        if (errors.email) {
          setErrors((prev) => ({
            ...prev,
            email: "Please enter a valid email address",
          }));
        }
      }
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (errors.phone && val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.phone;
        return copy;
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("email", email.trim());
    formData.append("phoneNumber", phone.trim());
    if (notes.trim()) {
      formData.append("notes", notes.trim());
    }

    const success = await onSubmit(formData);
    if (success) {
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setErrors({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col rounded-3xl border border-gold-300/10 bg-navy-900/40 p-4 sm:p-6 lg:p-8 shadow-elegant backdrop-blur-md space-y-6"
    >
      <div className="space-y-6 flex flex-col">
        <div>
          <h3 className="text-xl font-bold text-gold-200 tracking-tight">
            Refer a Carer          </h3>
          <p className="text-xs text-gold-100/50 mt-1">
            Introduce qualified carer candidates to Grace & Goodwill and track
            their onboard progress.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="First Name *"
            placeholder="e.g. Robert"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            disabled={submitting}
            error={errors.firstName}
          />

          <Input
            label="Last Name *"
            placeholder="e.g. Downey"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            disabled={submitting}
            error={errors.lastName}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. robert.d@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={submitting}
            error={errors.email}
          />

          <PhoneInput
            label="Phone Number *"
            placeholder="e.g. +44 7700 900088"
            value={phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            disabled={submitting}
          />
        </div>


        {/* Additional Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">
            Additional Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Enter details about their credentials, experience, or relationship..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={submitting}
            className="w-full rounded-xl bg-navy-950/80 border border-gold-300/15 focus:border-gold px-4 py-3 text-xs text-gold-100 focus:outline-none transition duration-300 resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="md"
          fullWidth
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent animate-spin rounded-full"></span>
              Submitting...
            </span>
          ) : (
            "Submit Referral"
          )}
        </Button>
      </div>
    </form>
  );
}
