import { useState, useCallback } from "react";
import { validateCareForm, scrollToFirstError } from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import {
  createCareRequest,
  fetchCareRequests,
  getClientPlacements,
} from "@/store/slices/clientSlice";
import { useAppSelector } from "@/store/hooks";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface UseClientPortalProps {
  user: any;
}

export function useClientPortal({ user }: UseClientPortalProps) {
  const dispatch = useAppDispatch();

  // --- CORE DATA STATES ---
  const { careRequests, carers, placements, placementsLoading, placementsError } = useAppSelector((state) => state.client);

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
  const [adminMatching, setAdminMatching] = useState(true);
  const [isOngoing, setIsOngoing] = useState(false);
  const [weeklyPayRange, setWeeklyPayRange] = useState<{ min: number; max: number } | null>(null);

  const [careErrors, setCareErrors] = useState<Record<string, string>>({});
  const [isCareSubmitting, setIsCareSubmitting] = useState(false);

  // --- HANDLERS: CLIENT PLACEMENTS ---
  const fetchPlacements = useCallback(() => {
    dispatch(getClientPlacements());
  }, [dispatch]);

  // --- HANDLERS: CARE REQUEST SUBMISSION ---
  const handleCareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCareErrors({});

    const formData = {
      fullName: careFullName,
      email: careEmail,
      phone: carePhone,
      careType: careType,
      support: careSupport,
      startDate: careStartDate,
      duration: careDuration,
      address: careAddress,
    };

    const errors = validateCareForm(formData);

    if (Object.keys(errors).length > 0) {
      setCareErrors(errors);
      scrollToFirstError();
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
      isOngoing,
      weeklyPayRange: weeklyPayRange ? `£${weeklyPayRange.min} - £${weeklyPayRange.max} per week` : undefined,
    };

    setIsCareSubmitting(true);
    try {
      await dispatch(createCareRequest(payload)).unwrap();
      await dispatch(fetchCareRequests());

      showSuccessToast(
        "Care Request Submitted",
        "Care request submitted successfully! Tracking initiated in dashboard.",
      );

      setCareSupport("");
      setCareStartDate("");
      setCareDuration("");
      setCareAddress("");
      setCareNotes("");
      setIsOngoing(false);
      setWeeklyPayRange(null);
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to submit care request.";
      
      const isValidationError = 
        errorMsg.toLowerCase().includes("validation") ||
        errorMsg.toLowerCase().includes("required") ||
        errorMsg.toLowerCase().includes("missing") ||
        errorMsg.toLowerCase().includes("please select");

      if (!isValidationError) {
        showErrorToast("Error", errorMsg);
      }
    } finally {
      setIsCareSubmitting(false);
    }
  };

  return {
    careRequests,
    carers,
    placements,
    placementsLoading,
    placementsError,
    fetchPlacements,

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
    handleCareSubmit,

    adminMatching,
    setAdminMatching,
    isOngoing,
    setIsOngoing,
    weeklyPayRange,
    setWeeklyPayRange,
  };
}
