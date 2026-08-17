"use client";

import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { apiFetch } from "@/lib/api";
import { validateEmail, validatePhone } from "@/lib/validation";

interface FormData {
  name: string;
  email: string;
  phone: string;
  whoRequiresSupport: string;
  whenIsSupportRequired: string;
  location: string;
  typeOfSupport: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  whoRequiresSupport?: string;
  whenIsSupportRequired?: string;
  location?: string;
  typeOfSupport?: string;
  message?: string;
}

export default function ContactSalesForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    whoRequiresSupport: "",
    whenIsSupportRequired: "",
    location: "",
    typeOfSupport: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[\d\s\-\+\(\)]+$/.test(val)) {
      handleChange("phone", val);
    }
  };

  useEffect(() => {
    const checkValidity = () => {
      if (!formData.name.trim()) return false;
      if (validateEmail(formData.email)) return false;
      if (validatePhone(formData.phone)) return false;
      if (!formData.whoRequiresSupport) return false;
      if (!formData.whenIsSupportRequired) return false;
      if (!formData.location.trim()) return false;
      if (!formData.typeOfSupport) return false;
      
      const wordCount = formData.message.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount < 10) return false;
      
      return true;
    };
    checkValidity();
  }, [formData]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let formIsValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
      formIsValid = false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      formIsValid = false;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
      formIsValid = false;
    }

    if (!formData.whoRequiresSupport) {
      newErrors.whoRequiresSupport = "Please select who requires support.";
      formIsValid = false;
    }

    if (!formData.whenIsSupportRequired) {
      newErrors.whenIsSupportRequired = "Please select when support is required.";
      formIsValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location/Postcode is required.";
      formIsValid = false;
    }

    if (!formData.typeOfSupport) {
      newErrors.typeOfSupport = "Please select the type of support.";
      formIsValid = false;
    }

    const wordCount = formData.message.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount === 0) {
      newErrors.message = "Care requirements are required.";
      formIsValid = false;
    } else if (wordCount < 10) {
      newErrors.message = "Message must be at least 10 words.";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          phoneNumber: formData.phone.trim(),
          
          whoRequiresSupport: formData.whoRequiresSupport,
          whenIsSupportRequired: formData.whenIsSupportRequired,
          location: formData.location.trim(),
          postcode: formData.location.trim(),
          typeOfSupport: formData.typeOfSupport,
          
          message: formData.message.trim(),
          careRequirements: formData.message.trim(),

          // Keeping legacy fields empty to prevent breaking strictly-typed older endpoints
          company: "",
          companyName: "",
          employees: "",
          numberOfEmployees: "",
          service: formData.typeOfSupport,
          serviceOfInterest: formData.typeOfSupport,
          primaryService: formData.typeOfSupport,
          businessRequirements: formData.message.trim(),
        };

        await apiFetch("/quote-enquiry", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showSuccessToast(
          "Inquiry Received",
          "Thank you for your inquiry. Our team will contact you shortly.",
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          whoRequiresSupport: "",
          whenIsSupportRequired: "",
          location: "",
          typeOfSupport: "",
          message: "",
        });
        setErrors({});
      } catch (error: any) {
        showErrorToast(
          "Submission Failed",
          error.message || "Something went wrong. Please try again later.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ── Label helper ──────────────────────────────────────────────────────
  const fieldLabel = (text: string) => (
    <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/70 ml-1 block mb-2">
      {text}
    </span>
  );

  // ── Input overrides for dark theme ────────────────────────────────────
  const darkInput = (hasError: boolean) =>
    `w-full bg-navy-950/50 border rounded-xl px-4 py-3 text-gold-100 outline-none transition duration-300 text-sm placeholder:text-gold-100/20 shadow-none ${
      hasError
        ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
        : "border-gold-muted/10 focus:border-gold-muted/30 focus:ring-1 focus:ring-gold-muted/10"
    }`;

  const darkSelect = (hasError: boolean) => darkInput(hasError);

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {fieldLabel("Full Name *")}
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={darkInput(!!errors.name)}
            disabled={isSubmitting}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-400 text-xs ml-1">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          {fieldLabel("Email Address *")}
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={darkInput(!!errors.email)}
            disabled={isSubmitting}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs ml-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          {fieldLabel("Phone Number *")}
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={darkInput(!!errors.phone)}
            disabled={isSubmitting}
            placeholder="Enter contact number"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs ml-1">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          {fieldLabel("Who requires support? *")}
          <select
            id="whoRequiresSupport"
            value={formData.whoRequiresSupport}
            onChange={(e) => handleChange("whoRequiresSupport", e.target.value)}
            className={darkSelect(!!errors.whoRequiresSupport)}
            disabled={isSubmitting}
          >
            <option value="" disabled className="bg-navy-900 text-gold-200/50">
              Select an option
            </option>
            <option value="Myself" className="bg-navy-900">Myself</option>
            <option value="My Partner" className="bg-navy-900">My Partner</option>
            <option value="My Parent" className="bg-navy-900">My Parent</option>
            <option value="A Relative" className="bg-navy-900">A Relative</option>
            <option value="A Friend" className="bg-navy-900">A Friend</option>
            <option value="Other" className="bg-navy-900">Other</option>
          </select>
          {errors.whoRequiresSupport && (
            <p className="text-red-400 text-xs ml-1">{errors.whoRequiresSupport}</p>
          )}
        </div>

        <div className="space-y-2">
          {fieldLabel("When is support required? *")}
          <select
            id="whenIsSupportRequired"
            value={formData.whenIsSupportRequired}
            onChange={(e) => handleChange("whenIsSupportRequired", e.target.value)}
            className={darkSelect(!!errors.whenIsSupportRequired)}
            disabled={isSubmitting}
          >
            <option value="" disabled className="bg-navy-900 text-gold-200/50">
              Select an option
            </option>
            <option value="Immediately" className="bg-navy-900">Immediately</option>
            <option value="Within 1-2 weeks" className="bg-navy-900">Within 1-2 weeks</option>
            <option value="Within 1 month" className="bg-navy-900">Within 1 month</option>
            <option value="Researching for the future" className="bg-navy-900">Researching for the future</option>
          </select>
          {errors.whenIsSupportRequired && (
            <p className="text-red-400 text-xs ml-1">{errors.whenIsSupportRequired}</p>
          )}
        </div>

        <div className="space-y-2">
          {fieldLabel("Location / Postcode *")}
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={darkInput(!!errors.location)}
            disabled={isSubmitting}
            placeholder="e.g. London, SW1A 1AA"
          />
          {errors.location && (
            <p className="text-red-400 text-xs ml-1">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2 lg:col-span-3">
          {fieldLabel("Type of support required *")}
          <select
            id="typeOfSupport"
            value={formData.typeOfSupport}
            onChange={(e) => handleChange("typeOfSupport", e.target.value)}
            className={darkSelect(!!errors.typeOfSupport)}
            disabled={isSubmitting}
          >
            <option value="" disabled className="bg-navy-900 text-gold-200/50">
              Select an option
            </option>
            <option value="Live-in Care" className="bg-navy-900">Live-in Care</option>
            <option value="Respite Care" className="bg-navy-900">Respite Care</option>
            <option value="Dementia Care" className="bg-navy-900">Dementia Care</option>
            <option value="Companionship" className="bg-navy-900">Companionship</option>
            <option value="Other" className="bg-navy-900">Other</option>
          </select>
          {errors.typeOfSupport && (
            <p className="text-red-400 text-xs ml-1">{errors.typeOfSupport}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {fieldLabel("Tell us a little about your care requirements *")}
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className={`${darkInput(!!errors.message)} resize-none`}
          disabled={isSubmitting}
          placeholder="Please share any relevant details about the care needed..."
        />
        {errors.message && (
          <p className="text-red-400 text-xs ml-1">{errors.message}</p>
        )}
      </div>

      <div className="pt-4 flex justify-center">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full md:w-1/2 lg:w-1/3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Contact Support Team"
          )}
        </Button>
      </div>
    </form>
  );
}
