"use client";

import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/Button";

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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Re-validate silently when form data changes to enable/disable button
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
    setSubmitStatus("idle");

    if (validate()) {
      setIsSubmitting(true);
      try {
        // Placeholder for API integration
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus("success");
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
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputClass = (hasError: boolean) =>
    `w-full bg-navy-900/60 border rounded-xl px-4 py-3 text-gold-50 focus:outline-none focus:ring-1 transition-colors ${
      hasError
        ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
        : "border-gold-muted/20 focus:border-gold-400/50 focus:ring-gold-400/50"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-navy-950/80 p-8 md:p-12 rounded-3xl border border-gold-400/10 shadow-xl space-y-6 backdrop-blur-sm"
    >
      {submitStatus === "success" && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          Thank you for your inquiry. Our team will contact you shortly.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          Something went wrong. Please try again later.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-gold-200/80 ml-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={getInputClass(!!errors.name)}
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
            className={getInputClass(!!errors.company)}
            disabled={isSubmitting}
          />
          {errors.company && (
            <p className="text-red-400 text-xs ml-1">{errors.company}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-gold-200/80 ml-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={getInputClass(!!errors.email)}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-400 text-xs ml-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm text-gold-200/80 ml-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={getInputClass(!!errors.phone)}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs ml-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="employees" className="text-sm text-gold-200/80 ml-1">
            Number of Employees *
          </label>
          <input
            type="text"
            id="employees"
            value={formData.employees}
            onChange={(e) =>
              setFormData({ ...formData, employees: e.target.value })
            }
            className={getInputClass(!!errors.employees)}
            disabled={isSubmitting}
          />
          {errors.employees && (
            <p className="text-red-400 text-xs ml-1">{errors.employees}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="service" className="text-sm text-gold-200/80 ml-1">
            Service Interest *
          </label>
          <input
            type="text"
            id="service"
            value={formData.service}
            onChange={(e) =>
              setFormData({ ...formData, service: e.target.value })
            }
            className={getInputClass(!!errors.service)}
            disabled={isSubmitting}
          />
          {errors.service && (
            <p className="text-red-400 text-xs ml-1">{errors.service}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm text-gold-200/80 ml-1">
          Message / Requirements *
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`${getInputClass(!!errors.message)} resize-none`}
          disabled={isSubmitting}
        ></textarea>
        {errors.message && (
          <p className="text-red-400 text-xs ml-1">{errors.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="py-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </div>
    </form>
  );
}
