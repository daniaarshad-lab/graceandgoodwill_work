import { useState } from "react";
import { defaultCareRequests, defaultEnquiries } from "../data/mockRequests";
import { CareRequest, Enquiry, Carer } from "../types/client.types";
import { validateCareForm, validateEnquiryForm } from "../utils/validation";

interface UseClientPortalProps {
  user: any;
}

export function useClientPortal({ user }: UseClientPortalProps) {
  const userFullName = `${user?.firstName || "Jane"} ${user?.lastName || "Doe"}`;

  // --- CORE DATA STATES ---
  const [careRequests, setCareRequests] = useState<CareRequest[]>(() =>
    defaultCareRequests(userFullName),
  );
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => defaultEnquiries);

  // --- FORM STATES: CARE REQUEST ---
  const [careFullName, setCareFullName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`,
  );
  const [careEmail, setCareEmail] = useState(user?.email || "");
  const [carePhone, setCarePhone] = useState(user?.phone || "");
  const [careType, setCareType] = useState("Companion Support");
  const [careSupport, setCareSupport] = useState("");
  const [careStartDate, setCareStartDate] = useState("");
  const [careDuration, setCareDuration] = useState("");
  const [careAddress, setCareAddress] = useState("");
  const [careNotes, setCareNotes] = useState("");

  const [careErrors, setCareErrors] = useState<Record<string, string>>({});
  const [isCareSubmitting, setIsCareSubmitting] = useState(false);
  const [careSuccess, setCareSuccess] = useState(false);

  // --- FORM STATES: GENERAL ENQUIRIES ---
  const [enquirySubject, setEnquirySubject] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryPreference, setEnquiryPreference] = useState("Email");

  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>(
    {},
  );
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // --- STATE FOR REQUEST INTRODUCTION ---
  const [selectedCarer, setSelectedCarer] = useState<Carer | null>(null);
  const [introSuccessMsg, setIntroSuccessMsg] = useState<string | null>(null);

  // --- HANDLERS: CARE REQUEST SUBMISSION ---
  const handleCareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCareErrors({});
    setCareSuccess(false);

    const formData = {
      fullName: careFullName,
      email: careEmail,
      phone: carePhone,
      support: careSupport,
      startDate: careStartDate,
      duration: careDuration,
      address: careAddress,
    };

    const errors = validateCareForm(formData);

    if (Object.keys(errors).length > 0) {
      setCareErrors(errors);
      return;
    }

    setIsCareSubmitting(true);

    setTimeout(() => {
      setIsCareSubmitting(false);
      setCareSuccess(true);

      const newReq: CareRequest = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        fullName: careFullName,
        careType: careType,
        startDate: careStartDate,
        duration: careDuration,
        status: "Pending",
        progress: 15,
      };

      setCareRequests((prev) => [newReq, ...prev]);

      // Reset form fields
      setCareSupport("");
      setCareStartDate("");
      setCareDuration("");
      setCareAddress("");
      setCareNotes("");

      setTimeout(() => setCareSuccess(false), 5000);
    }, 1200);
  };

  // --- HANDLERS: ENQUIRY SUBMISSION ---
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryErrors({});
    setEnquirySuccess(false);

    const formData = {
      subject: enquirySubject,
      message: enquiryMessage,
    };

    const errors = validateEnquiryForm(formData);

    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      return;
    }

    setIsEnquirySubmitting(true);

    setTimeout(() => {
      setIsEnquirySubmitting(false);
      setEnquirySuccess(true);

      const newEnq: Enquiry = {
        id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
        subject: enquirySubject,
        message: enquiryMessage,
        preference: enquiryPreference,
        date: new Date().toISOString().split("T")[0],
        status: "Received",
      };

      setEnquiries((prev) => [newEnq, ...prev]);

      setEnquirySubject("");
      setEnquiryMessage("");

      setTimeout(() => setEnquirySuccess(false), 5000);
    }, 1200);
  };

  // --- HANDLERS: REQUEST INTRODUCTION ---
  const handleRequestIntro = (carer: Carer) => {
    setSelectedCarer(carer);
  };

  const confirmIntroRequest = () => {
    if (!selectedCarer) return;

    setIntroSuccessMsg(
      `Your introduction request for ${selectedCarer.name} has been submitted! Our care coordinator will contact you shortly.`,
    );
    setSelectedCarer(null);

    setTimeout(() => setIntroSuccessMsg(null), 6000);
  };

  return {
    careRequests,
    enquiries,

    // Care Form
    careFullName,
    setCareFullName,
    careEmail,
    setCareEmail,
    carePhone,
    setCarePhone,
    careType,
    setCareType,
    careSupport,
    setCareSupport,
    careStartDate,
    setCareStartDate,
    careDuration,
    setCareDuration,
    careAddress,
    setCareAddress,
    careNotes,
    setCareNotes,
    careErrors,
    isCareSubmitting,
    careSuccess,
    handleCareSubmit,

    // Enquiry Form
    enquirySubject,
    setEnquirySubject,
    enquiryMessage,
    setEnquiryMessage,
    enquiryPreference,
    setEnquiryPreference,
    enquiryErrors,
    isEnquirySubmitting,
    enquirySuccess,
    handleEnquirySubmit,

    // Intro Request
    selectedCarer,
    setSelectedCarer,
    introSuccessMsg,
    handleRequestIntro,
    confirmIntroRequest,
  };
}
