"use client";

import { useState, FormEvent, useEffect } from "react";
import Button from "@/components/Button";
import { Mail } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

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

    if (validate()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        showSuccessToast("Subscribed Successfully", "Thank you for subscribing!");
        
        setFormData({ firstName: "", email: "" });
        setErrors({});
      } catch (error) {
        showErrorToast("Subscription Failed", "Something went wrong. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <div className="space-y-2">
          <label className="text-sm text-gold-200/80 ml-1 text-left block">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={`w-full bg-navy-900/60 border rounded-xl px-4 py-3 text-gold-50 focus:outline-none focus:ring-1 transition-colors ${
              errors.firstName
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
                : "border-gold-muted/20 focus:border-gold-400/50 focus:ring-gold-400/50"
            }`}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="form-help text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gold-200/80 ml-1 text-left block">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full bg-navy-900/60 border rounded-xl px-4 py-3 text-gold-50 focus:outline-none focus:ring-1 transition-colors ${
              errors.email
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
                : "border-gold-muted/20 focus:border-gold-400/50 focus:ring-gold-400/50"
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="form-help text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-1">
        <Button
          type="submit"
          variant="primary"
          className="rounded-xl px-10 py-3.5 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Subscribing...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Subscribe
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
