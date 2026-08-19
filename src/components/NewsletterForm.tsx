"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/Button";
import { Mail } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { subscribeToNewsletter } from "@/store/slices/newsletterSlice";

interface FormData {
  fullName: string;
  email: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

export default function NewsletterForm() {
  const dispatch = useAppDispatch();
  const { isSubscribing } = useAppSelector((state) => state.newsletter);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let formIsValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
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
      try {
        const payload = {
          fullName: formData.fullName.trim(),
          firstName: formData.fullName.trim().split(" ")[0],
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          source: "STAY_CONNECTED",
        };

        const resultAction = await dispatch(subscribeToNewsletter(payload));

        if (subscribeToNewsletter.fulfilled.match(resultAction)) {
          showSuccessToast(
            "Subscribed Successfully",
            "Thank you for subscribing!",
          );
          setFormData({ fullName: "", email: "" });
          setErrors({});
        } else {
          throw new Error(resultAction.payload as string);
        }
      } catch (error: any) {
        showErrorToast(
          "Subscription Failed",
          error?.message || "Something went wrong. Please try again later.",
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col gap-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <div className="space-y-2">
          <label className="text-sm text-gold-200/80 ml-1 text-left block">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) {
                setErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
            className={`w-full bg-navy-900/60 border rounded-xl px-4 py-3 text-gold-50 focus:outline-none focus:ring-1 transition-colors ${
              errors.fullName
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
                : "border-gold-muted/20 focus:border-gold-400/50 focus:ring-gold-400/50"
            }`}
            disabled={isSubscribing}
          />
          {errors.fullName && (
            <p className="form-help text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gold-200/80 ml-1 text-left block">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            className={`w-full bg-navy-900/60 border rounded-xl px-4 py-3 text-gold-50 focus:outline-none focus:ring-1 transition-colors ${
              errors.email
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50"
                : "border-gold-muted/20 focus:border-gold-400/50 focus:ring-gold-400/50"
            }`}
            disabled={isSubscribing}
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
          disabled={isSubscribing}
        >
          {isSubscribing ? (
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
