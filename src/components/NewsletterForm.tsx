"use client";

import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/Button";

interface FormData {
  firstName: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
}

export default function NewsletterForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkValidity = () => {
      if (!formData.firstName.trim()) return false;
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return false;
      return true;
    };
    setIsValid(checkValidity());
  }, [formData]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let formIsValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
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

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");

    if (validate()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus("success");
        setFormData({ firstName: "", email: "" });
        setErrors({});
      } catch (error) {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {submitStatus === "success" && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          Thank you for subscribing!
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          Something went wrong. Please try again later.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1 flex flex-col items-start">
          <input 
            type="text" 
            placeholder="First Name" 
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full bg-navy-900/80 border rounded-full px-6 py-3.5 text-gold-50 focus:outline-none focus:ring-1 transition-colors placeholder:text-gold-200/40 ${
              errors.firstName ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50" : "border-gold-muted/30 focus:border-gold-400/60 focus:ring-gold-400/60"
            }`}
            disabled={isSubmitting}
          />
          {errors.firstName && <p className="text-red-400 text-xs ml-4 mt-1">{errors.firstName}</p>}
        </div>

        <div className="flex-1 flex flex-col items-start">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full bg-navy-900/80 border rounded-full px-6 py-3.5 text-gold-50 focus:outline-none focus:ring-1 transition-colors placeholder:text-gold-200/40 ${
              errors.email ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50" : "border-gold-muted/30 focus:border-gold-400/60 focus:ring-gold-400/60"
            }`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-400 text-xs ml-4 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <Button type="submit" variant="primary" className="rounded-full px-10 py-3.5 h-[54px] w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
