"use client";

import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  employees: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  employees?: string;
  service?: string;
  message?: string;
}

export default function ContactSalesForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    employees: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const checkValidity = () => {
      if (!formData.name.trim()) return false;
      if (!formData.company.trim()) return false;
      if (
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      )
        return false;
      if (
        !formData.phone.trim() ||
        !/^[\d\s\-\+\(\)]+$/.test(formData.phone.trim())
      )
        return false;
      if (!formData.employees.trim()) return false;
      if (!formData.service.trim()) return false;
      if (!formData.message.trim() || formData.message.trim().length < 10)
        return false;
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

    if (!formData.company.trim()) {
      newErrors.company = "Company Name is required.";
      formIsValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
      formIsValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    // Basic phone validation allowing UK formats (+44, 07, etc.)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      formIsValid = false;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
      formIsValid = false;
    }

    if (!formData.employees.trim()) {
      newErrors.employees = "Number of Employees is required.";
      formIsValid = false;
    }

    if (!formData.service.trim()) {
      newErrors.service = "Service Interest is required.";
      formIsValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message / Requirements is required.";
      formIsValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
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
        // Placeholder for API integration
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showSuccessToast(
          "Inquiry Received",
          "Thank you for your inquiry. Our team will contact you shortly.",
        );

        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          employees: "",
          service: "",
          message: "",
        });
        setErrors({});
      } catch (error) {
        showErrorToast(
          "Submission Failed",
          "Something went wrong. Please try again later.",
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
    `w-full bg-navy-950/50 border rounded-xl px-4 py-3 text-gold-100 outline-none transition duration-300 text-sm placeholder:text-gold-100/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] ${
      hasError
        ? "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
        : "border-gold-400/20 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/20"
    }`;

  const darkSelect = (hasError: boolean) => darkInput(hasError);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-gold-200/80 ml-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={darkInput(!!errors.name)}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-400 text-xs ml-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm text-gold-200/80 ml-1">
            Company Name *
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className={darkInput(!!errors.company)}
            disabled={isSubmitting}
          />
          {errors.company && (
            <p className="text-red-400 text-xs ml-1">{errors.company}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {fieldLabel("Email Address")}
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={darkInput(!!errors.email)}
            disabled={isSubmitting}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs ml-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          {fieldLabel("Phone Number")}
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={darkInput(!!errors.phone)}
            disabled={isSubmitting}
            placeholder="Enter contact number"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs ml-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {fieldLabel("Number of Employees")}
          <select
            id="employees"
            value={formData.employees}
            onChange={(e) =>
              setFormData({ ...formData, employees: e.target.value })
            }
            className={darkSelect(!!errors.employees)}
            disabled={isSubmitting}
          >
            <option value="" disabled className="bg-navy-900 text-gold-200/50">
              Select company size
            </option>
            <option value="1-10" className="bg-navy-900">
              1 - 10
            </option>
            <option value="11-50" className="bg-navy-900">
              11 - 50
            </option>
            <option value="51-200" className="bg-navy-900">
              51 - 200
            </option>
            <option value="201+" className="bg-navy-900">
              201+
            </option>
          </select>
          {errors.employees && (
            <p className="text-red-400 text-xs ml-1">{errors.employees}</p>
          )}
        </div>
        <div className="space-y-2">
          {fieldLabel("Primary Service of Interest")}
          <select
            id="service"
            value={formData.service}
            onChange={(e) =>
              setFormData({ ...formData, service: e.target.value })
            }
            className={darkSelect(!!errors.service)}
            disabled={isSubmitting}
          >
            <option value="" disabled className="bg-navy-900 text-gold-200/50">
              Select an option
            </option>
            <option value="carer_management" className="bg-navy-900">
              Carer Management Platform
            </option>
            <option value="agency_crm" className="bg-navy-900">
              Agency CRM
            </option>
            <option value="white_label" className="bg-navy-900">
              White-label Solution
            </option>
            <option value="other" className="bg-navy-900">
              Other
            </option>
          </select>
          {errors.service && (
            <p className="text-red-400 text-xs ml-1">{errors.service}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {fieldLabel("How can we help?")}
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`${darkInput(!!errors.message)} resize-none`}
          disabled={isSubmitting}
          placeholder="Please share details about your business requirements..."
        />
        {errors.message && (
          <p className="text-red-400 text-xs ml-1">{errors.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
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
