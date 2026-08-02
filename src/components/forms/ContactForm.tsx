"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { publicService } from "@/services/public.service";
import {
  validateEmail,
  validatePhone,
  validateFullName,
} from "@/lib/validation";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // UX & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};

    const nameError = validateFullName(name);
    if (nameError) tempErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) tempErrors.email = emailError;

    const phoneError = validatePhone(phone);
    if (phoneError) tempErrors.phone = phoneError;

    if (!message.trim()) {
      tempErrors.message = "Message is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await publicService.submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phone,
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      showSuccessToast(
        "Message Sent",
        "Your message has been sent successfully. Our team will contact you shortly.",
      );
      resetForm();
    } catch (err: any) {
      showErrorToast(
        "Submission Failed",
        err.message || "Failed to submit your message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  const fieldLabel = (text: string) => (
    <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-200/90">
      {text}
    </span>
  );

  const darkInput =
    "!bg-navy-950/50 !border-gold-400/20 !text-gold-100 focus:!border-gold-400/60 focus:!ring-gold-400/20 placeholder:!text-gold-100/30 !shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={fieldLabel("Name")}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Enter your name"
          error={errors.name}
          className={darkInput}
        />

        <Input
          label={fieldLabel("Email Address")}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="name@example.com"
          error={errors.email}
          className={darkInput}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhoneInput
          label={fieldLabel("Phone Number")}
          placeholder="Enter contact number"
          value={phone}
          onChange={(val) => {
            setPhone(val);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          error={errors.phone}
          className={darkInput}
        />

        <Input
          label={fieldLabel("Subject (Optional)")}
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="General Enquiry"
          className={darkInput}
        />
      </div>

      <TextArea
        label={fieldLabel("Message")}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
        }}
        placeholder="How can we help you?"
        error={errors.message}
        className={darkInput}
      />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          fullWidth
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            <span>Submit Message</span>
          )}
        </Button>
      </div>
    </form>
  );
}
