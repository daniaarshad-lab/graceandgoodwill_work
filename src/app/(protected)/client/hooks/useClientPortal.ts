import { useState, useCallback, useEffect } from "react";
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
  const {
    profile,
    careRequests,
    carers,
    placements,
    placementsLoading,
    placementsError,
  } = useAppSelector((state) => state.client);

  // --- FORM STATES: CARE REQUEST ---
  const [careFullName, setCareFullName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
  );
  const [careEmail, setCareEmail] = useState(user?.email || "");
  const [carePhone, setCarePhone] = useState(user?.phone || "");
  const [careType, setCareType] = useState<string[]>([]);
  const [careSupport, setCareSupport] = useState("");
  const [careStartDate, setCareStartDate] = useState("");
  const [careDuration, setCareDuration] = useState("");
  const [careAddress, setCareAddress] = useState("");
  const [careCity, setCareCity] = useState("");
  const [carePostcode, setCarePostcode] = useState("");
  const [careLatitude, setCareLatitude] = useState<number | null>(null);
  const [careLongitude, setCareLongitude] = useState<number | null>(null);
  const [careNotes, setCareNotes] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);
  const [weeklyPayRange, setWeeklyPayRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  const [careErrors, setCareErrors] = useState<Record<string, string>>({});
  const [isCareSubmitting, setIsCareSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // --- HANDLERS: CLIENT PLACEMENTS ---
  const fetchPlacements = useCallback(() => {
    dispatch(getClientPlacements());
  }, [dispatch]);

  // --- REAL-TIME VALIDATION ---
  useEffect(() => {
    if (hasAttemptedSubmit) {
      const formData = {
        fullName: careFullName,
        email: careEmail,
        phone: carePhone,
        careType: careType,
        support: careSupport,
        startDate: careStartDate,
        duration: careDuration,
        address: careAddress,
        isOngoing: isOngoing,
      };
      setCareErrors(validateCareForm(formData));
    }
  }, [
    careFullName,
    careEmail,
    carePhone,
    careType,
    careSupport,
    careStartDate,
    careDuration,
    careAddress,
    isOngoing,
    hasAttemptedSubmit,
  ]);

  // --- HANDLERS: CARE REQUEST SUBMISSION ---
  const handleCareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
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
      isOngoing: isOngoing,
    };

    const errors = validateCareForm(formData);

    if (Object.keys(errors).length > 0) {
      setCareErrors(errors);
      scrollToFirstError();
      return;
    }
    const payload = {
      address: careAddress,
      city: careCity,
      postcode: carePostcode,
      latitude: careLatitude,
      longitude: careLongitude,

      careCategory: Array.isArray(careType)
        ? careType
        : careType
          ? [careType]
          : [],

      requirements: careSupport,

      requestorName: careFullName,
      requestorEmail: careEmail,
      requestorPhone: carePhone,

      startDate: careStartDate,
      endDate: isOngoing ? null : careDuration || null,
      durationCategory: isOngoing
        ? ("PERMANENT" as const)
        : ("SHORT_DURATION" as const),

      additionalNotes: careNotes,

      shiftType: "MORNING",
      
    };

    console.log("Submitting Care Request Payload:", payload);

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
      setCareType([]);
      setIsOngoing(false);
      setWeeklyPayRange(null);
      setHasAttemptedSubmit(false);
      return true;
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
      return false;
    } finally {
      setIsCareSubmitting(false);
    }
  };

  return {
    profile,
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
    careCity,
    setCareCity,
    carePostcode,
    setCarePostcode,
    careLatitude,
    setCareLatitude,
    careLongitude,
    setCareLongitude,
    careNotes,
    setCareNotes,
    careErrors,
    isCareSubmitting,
    handleCareSubmit,

    isOngoing,
    setIsOngoing,
    weeklyPayRange,
    setWeeklyPayRange,
  };
}
