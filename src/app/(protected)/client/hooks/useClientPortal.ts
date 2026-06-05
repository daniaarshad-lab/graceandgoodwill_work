import { useState } from "react";
import { Carer } from "../types/client-ui.types";
import { validateCareForm } from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import { createCareRequest, fetchCareRequests } from "@/store/slices/clientSlice";
import { useAppSelector } from "@/store/hooks";

interface UseClientPortalProps {
  user: any;
}

export function useClientPortal({ user }: UseClientPortalProps) {
  const dispatch = useAppDispatch();
  const userFullName = `${user?.firstName || "Jane"} ${user?.lastName || "Doe"}`;

  // --- CORE DATA STATES ---
  const careRequests = useAppSelector(
    (state) => state.client.careRequests
  );


  // --- FORM STATES: CARE REQUEST ---
  const [careFullName, setCareFullName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
  );
  const [careEmail, setCareEmail] = useState(user?.email || "");
  const [carePhone, setCarePhone] = useState(user?.phone || "");
  const [careType, setCareType] = useState("");
  const [careSupport, setCareSupport] = useState("");
  const [careStartDate, setCareStartDate] = useState("");
  const [careDuration, setCareDuration] = useState("");
  const [careAddress, setCareAddress] = useState("");
  const [careNotes, setCareNotes] = useState("");

  const [careErrors, setCareErrors] = useState<Record<string, string>>({});
  const [isCareSubmitting, setIsCareSubmitting] = useState(false);
  const [careSuccess, setCareSuccess] = useState(false);



  // --- STATE FOR REQUEST INTRODUCTION ---
  const [selectedCarer, setSelectedCarer] = useState<Carer | null>(null);
  const [introSuccessMsg, setIntroSuccessMsg] = useState<string | null>(null);

  // --- HANDLERS: CARE REQUEST SUBMISSION ---
  const handleCareSubmit = async (e: React.FormEvent) => {
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
    const payload = {
      address: careAddress,

      careCategory: careType,

      requirements: careSupport,

      requestorName: careFullName,
      requestorEmail: careEmail,
      requestorPhone: carePhone,

      startDate: careStartDate,
      duration: careDuration,

      additionalNotes: careNotes,

      shiftType: "MORNING",
    };

    setIsCareSubmitting(true);
    try {
      await dispatch(createCareRequest(payload)).unwrap();
      await dispatch(fetchCareRequests());
    } catch (error) {
      console.error("CARE REQUEST ERROR:", error);
    }

    setTimeout(() => {
      setIsCareSubmitting(false);
      setCareSuccess(true);

      setCareSupport("");
      setCareStartDate("");
      setCareDuration("");
      setCareAddress("");
      setCareNotes("");

      setTimeout(() => setCareSuccess(false), 5000);
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

    selectedCarer,
    setSelectedCarer,
    introSuccessMsg,
    handleRequestIntro,
    confirmIntroRequest,
  };
}
