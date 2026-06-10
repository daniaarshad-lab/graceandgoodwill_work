import { useEffect, useState } from "react";

import {
  CarerDocument,
  ComplianceDoc,
  DayAvailability,
  WeeklyAvailability,
} from "../types/carer.types";
import {
  validateProfileForm,
  validateAvailabilitySchedule,
} from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchCarerDocuments,
  updateCarerProfile,
  updateCarerAvailability,
  deleteCarerDocument,
} from "@/store/slices/carerSlice";
import { carerService } from "@/services/carer/carer.service";
import {
  CarerProfile,
  AvailabilityDay,
  AvailabilitySlot,
} from "@/types/carer.types";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface UseCarerPortalProps {
  user: any;
  profile: CarerProfile | null;
  documents: CarerDocument[];
}

const DAY_NUMBER_TO_NAME: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyAvailability: WeeklyAvailability = Object.fromEntries(
  DAYS_OF_WEEK.map((day) => [
    day,
    {
      enabled: false,
      shifts: { morning: false, afternoon: false, night: false },
    } as DayAvailability,
  ]),
);

export function useCarerPortal({
  user,
  profile,
  documents,
}: UseCarerPortalProps) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [canDrive, setCanDrive] = useState<"yes" | "no" | "">("");
  const [hasBusinessInsurance, setHasBusinessInsurance] = useState<"yes" | "no" | "">("");

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setSpecialties(profile.careSpecialties ?? "");
      setExperience(profile.experience ?? "");
      setAddress(profile.address ?? "");
      setCanDrive(profile.canDrive === true ? "yes" : profile.canDrive === false ? "no" : "");
      setHasBusinessInsurance(profile.hasBusinessInsurance === true ? "yes" : profile.hasBusinessInsurance === false ? "no" : "");

      // Hydrate availability from API — convert AvailabilityDay[] → WeeklyAvailability
      const apiAvailability = profile.availability;
      if (apiAvailability && apiAvailability.length > 0) {
        const weekly: WeeklyAvailability = Object.fromEntries(
          [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => [
            day,
            {
              enabled: false,
              shifts: { morning: false, afternoon: false, night: false },
            } as DayAvailability,
          ]),
        );
        for (const apiDay of apiAvailability) {
          const dayName = DAY_NUMBER_TO_NAME[apiDay.dayOfWeek];
          if (!dayName) continue;
          const shifts = { morning: false, afternoon: false, night: false };
          for (const slot of apiDay.slots ?? []) {
            const shift = slot.shiftType as "morning" | "afternoon" | "night";
            if (shift in shifts) shifts[shift] = true;
          }
          weekly[dayName] = { enabled: apiDay.enabled, shifts };
        }
        setAvailability(weekly);
      }
      // If availability is null/empty from API, state stays as all-disabled (emptyAvailability)
    }
  }, [profile]);

  // Profile errors state
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Application status — mock until API is available
  const [applicationStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [membershipActive] = useState(true);
  const [membershipExpiry] = useState("");

  // Compliance documents — derived from Redux documents state
  const complianceDocs: ComplianceDoc[] = documents.map((doc) => ({
    id: doc.id,
    name: doc.fileName,
    type: doc.fileCategory,
    uploadDate: doc.createdAt,
    status:
      doc.status === "VERIFIED"
        ? "verified"
        : doc.status === "FAILED"
          ? "failed"
          : "pending",
    size: `${(doc.fileSize / (1024 * 1024)).toFixed(1)} MB`,
    previewUrl: doc.fileUrl,
  }));

  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);

  // Compliance Upload Validation States
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const [availability, setAvailability] =
    useState<WeeklyAvailability>(emptyAvailability);

  // Availability Save Validation States
  const [isAvailabilitySaving, setIsAvailabilitySaving] = useState(false);

  const dispatch = useAppDispatch();

  const handleSaveProfile = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    const formData = {
      experience,
      bio,
      address,
    };

    const errors = validateProfileForm(formData);

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      showErrorToast(
        "Validation Error",
        "Please correct the errors in the profile form before saving.",
      );
      return false;
    }

    setProfileErrors({});

    const payload = {
      bio,
      careSpecialties: specialties,
      experience,
      address,
      canDrive: canDrive === "yes" ? true : canDrive === "no" ? false : undefined,
      hasBusinessInsurance: hasBusinessInsurance === "yes" ? true : hasBusinessInsurance === "no" ? false : undefined,
    };

    try {
      setIsProfileSaving(true);
      await dispatch(updateCarerProfile(payload)).unwrap();
      showSuccessToast(
        "Profile Updated",
        "Profile successfully updated and saved!",
      );
      return true;
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to update profile.";
      showErrorToast("Error", errorMsg);
      return false;
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleDocUpload = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      showErrorToast(
        "Invalid Format",
        "Invalid file type. Only PDF, PNG, and JPG/JPEG document uploads are allowed.",
      );
      return;
    }

    const maxDocSize = 10 * 1024 * 1024;

    if (file.size > maxDocSize) {
      showErrorToast(
        "File Too Large",
        `File "${file.name}" is too large. Maximum allowed size is 10 MB.`,
      );
      return;
    }

    const categoryMap: Record<string, string> = {
      "Driver's License": "DRIVERS_LICENSE",
      "Criminal Record Check": "CRIMINAL_RECORD_CHECK",
      "Dementia Support Certificate": "DEMENTIA_SUPPORT",
      "Nurses Registry License": "NURSES_REGISTRY",
      "Business Insurance": "BUSINESS_INSURANCE",
    };

    let progressInterval: any;
    try {
      setUploadingDocType(type);
      setUploadProgress(0);

      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const category = categoryMap[type];

      await carerService.uploadDocument(file, category);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Refresh documents list from Redux after successful upload
      dispatch(fetchCarerDocuments());

      showSuccessToast(
        "Document Uploaded",
        `Document "${file.name}" uploaded successfully!`,
      );

      setTimeout(() => {
        setUploadProgress(0);
      }, 4000);
    } catch (error: any) {
      clearInterval(progressInterval);
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to upload document.";
      showErrorToast("Upload Failed", errorMsg);
    } finally {
      setUploadingDocType(null);
    }
  };
  const handleDeleteDoc = async (id: string) => {
    try {
      await dispatch(deleteCarerDocument(id)).unwrap();
      showSuccessToast("Document Deleted", "Document successfully deleted.");
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete document. Please try again.";
      showErrorToast("Delete Failed", errorMsg);
    }
  };

  const DAY_OF_WEEK: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  const SHIFT_SLOTS = {
    morning: {
      shiftType: "morning",
      startTime: "08:00",
      endTime: "12:00",
    },
    afternoon: {
      shiftType: "afternoon",
      startTime: "12:00",
      endTime: "17:00",
    },
    night: {
      shiftType: "night",
      startTime: "17:00",
      endTime: "22:00",
    },
  };

  function buildAvailabilityPayload(
    weekly: typeof availability,
  ): AvailabilityDay[] {
    return Object.entries(weekly).map(([day, config]) => {
      const slots: AvailabilitySlot[] = config.enabled
        ? (["morning", "afternoon", "night"] as const)
            .filter((shift) => config.shifts[shift])
            .map((shift) => SHIFT_SLOTS[shift])
        : [];

      return {
        dayOfWeek: DAY_OF_WEEK[day],
        enabled: config.enabled,
        slots,
      };
    });
  }

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSchedulePopulated = validateAvailabilitySchedule(availability);

    if (!isSchedulePopulated) {
      showErrorToast(
        "Validation Error",
        "Please configure at least one active day and time slot before saving.",
      );
      return;
    }

    const payload = buildAvailabilityPayload(availability);

    try {
      setIsAvailabilitySaving(true);
      await dispatch(updateCarerAvailability(payload)).unwrap();
      showSuccessToast(
        "Availability Updated",
        "Availability schedule successfully updated!",
      );
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to save availability. Please try again.";
      showErrorToast("Update Failed", errorMsg);
    } finally {
      setIsAvailabilitySaving(false);
    }
  };

  const handleToggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        shifts: !prev[day].enabled
          ? { morning: true, afternoon: true, night: false }
          : { morning: false, afternoon: false, night: false },
      },
    }));
  };

  const handleToggleShift = (
    day: string,
    shift: "morning" | "afternoon" | "night",
  ) => {
    if (!availability[day].enabled) return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        shifts: {
          ...prev[day].shifts,
          [shift]: !prev[day].shifts[shift],
        },
      },
    }));
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    bio,
    setBio,
    specialties,
    setSpecialties,
    experience,
    setExperience,
    address,
    setAddress,
    canDrive,
    setCanDrive,
    hasBusinessInsurance,
    setHasBusinessInsurance,

    profileErrors,
    isProfileSaving,
    handleSaveProfile,

    applicationStatus,
    membershipActive,
    membershipExpiry,

    complianceDocs,
    uploadingDocType,
    uploadProgress,
    previewDoc,
    setPreviewDoc,
    docToDelete,
    setDocToDelete,
    handleDocUpload,
    handleDeleteDoc,

    availability,
    isAvailabilitySaving,
    handleSaveAvailability,
    handleToggleDay,
    handleToggleShift,
  };
}
