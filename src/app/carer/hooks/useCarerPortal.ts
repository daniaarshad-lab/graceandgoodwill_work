import { useState } from "react";
import { defaultComplianceDocs } from "../data/mockCompliance";
import { defaultAvailability } from "../data/mockAvailability";
import {
  defaultBio,
  defaultSpecialties,
  defaultExperience,
  defaultAddress,
} from "../data/mockProfile";
import { ComplianceDoc, WeeklyAvailability } from "../types/carer.types";
import {
  validateProfileForm,
  validateAvailabilitySchedule,
} from "../utils/validation";

interface UseCarerPortalProps {
  user: any;
}

export function useCarerPortal({ user }: UseCarerPortalProps) {
  // Mock State 1: Profile Information
  const [firstName, setFirstName] = useState(user?.firstName || "Alex");
  const [lastName, setLastName] = useState(user?.lastName || "Mercer");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 123-4567");
  const [email, setEmail] = useState(
    user?.email || "alex.mercer@graceandgoodwill.com",
  );
  const [bio, setBio] = useState(defaultBio);
  const [specialties, setSpecialties] = useState(defaultSpecialties);
  const [experience, setExperience] = useState(defaultExperience);
  const [address, setAddress] = useState(defaultAddress);

  // States for Profile photo upload
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Validation States for Profile Form
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Mock State 2: Application Review Status & Membership Card
  const [applicationStatus, setApplicationStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [membershipActive, setMembershipActive] = useState(true);
  const [membershipExpiry, setMembershipExpiry] = useState("2027-05-25");

  // Mock State 3: Compliance Documents Vault
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>(
    () => defaultComplianceDocs,
  );
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);

  // Compliance Upload Validation States
  const [complianceError, setComplianceError] = useState<string | null>(null);
  const [complianceSuccess, setComplianceSuccess] = useState<string | null>(
    null,
  );
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Mock State 4: Weekly Availability Grid
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    () => defaultAvailability,
  );

  // Availability Save Validation States
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [availabilitySuccess, setAvailabilitySuccess] = useState(false);
  const [isAvailabilitySaving, setIsAvailabilitySaving] = useState(false);

  // Action 1: Save Profile Form Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(false);

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      experience,
      bio,
      address,
    };

    const errors = validateProfileForm(formData);

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setProfileErrorMsg(
        "Please correct the errors in the profile form before saving.",
      );
      return;
    }

    setProfileErrors({});
    setIsProfileSaving(true);

    setTimeout(() => {
      setIsProfileSaving(false);
      setProfileSuccessMsg(true);
      setTimeout(() => setProfileSuccessMsg(false), 4000);
    }, 1200);
  };

  // Action 2: Simulate Photo Upload with Validation
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setPhotoError(
          "Unsupported format. Please upload JPG, JPEG, or PNG headshots.",
        );
        return;
      }

      const maxPhotoSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxPhotoSize) {
        setPhotoError("File too large. Maximum size allowed is 5 MB.");
        return;
      }

      setPhotoUploading(true);
      setPhotoProgress(0);

      const interval = setInterval(() => {
        setPhotoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhotoUploading(false);
            setProfilePhoto(URL.createObjectURL(file));
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
  };

  // Action 3: Document Upload Simulator with Validation
  const handleDocUpload = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    setComplianceError(null);
    setComplianceSuccess(null);

    if (file) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setComplianceError(
          "Invalid file type. Only PDF document uploads are allowed.",
        );
        return;
      }

      const maxDocSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxDocSize) {
        setComplianceError(
          `File "${file.name}" is too large. Maximum allowed size is 10 MB.`,
        );
        return;
      }

      setUploadingDocType(type);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingDocType(null);

            const newDoc: ComplianceDoc = {
              id: `doc-${Date.now()}`,
              name: file.name,
              type: type,
              uploadDate: new Date().toISOString().split("T")[0],
              status: "pending",
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              previewUrl: "/api/placeholder/custom",
            };
            setComplianceDocs((prevDocs) => [...prevDocs, newDoc]);
            setComplianceSuccess(
              `Document "${file.name}" uploaded successfully!`,
            );
            setTimeout(() => setComplianceSuccess(null), 4000);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    }
  };

  // Action 4: Delete Document
  const handleDeleteDoc = (id: string) => {
    setComplianceDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Action 5: Save Availability Schedule with Validation
  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityError(null);
    setAvailabilitySuccess(false);

    const isSchedulePopulated = validateAvailabilitySchedule(availability);

    if (!isSchedulePopulated) {
      setAvailabilityError(
        "Validation Failed: Please configure at least one active day and time slot before saving.",
      );
      return;
    }

    setIsAvailabilitySaving(true);

    setTimeout(() => {
      setIsAvailabilitySaving(false);
      setAvailabilitySuccess(true);
      setTimeout(() => setAvailabilitySuccess(false), 4000);
    }, 1200);
  };

  // Action 6: Toggle Day Availability
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

  // Action 7: Toggle Day Shift Slot
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
    // Profile info
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

    // Photo uploads
    profilePhoto,
    photoUploading,
    photoProgress,
    photoError,
    setPhotoError,
    handlePhotoChange,

    // Form controls
    profileErrors,
    profileErrorMsg,
    isProfileSaving,
    profileSuccessMsg,
    handleSaveProfile,

    // Application state
    applicationStatus,
    membershipActive,
    membershipExpiry,

    // Compliance vault
    complianceDocs,
    uploadingDocType,
    uploadProgress,
    previewDoc,
    setPreviewDoc,
    complianceError,
    complianceSuccess,
    setComplianceSuccess,
    docToDelete,
    setDocToDelete,
    handleDocUpload,
    handleDeleteDoc,

    // Availability
    availability,
    availabilityError,
    availabilitySuccess,
    isAvailabilitySaving,
    handleSaveAvailability,
    handleToggleDay,
    handleToggleShift,
  };
}
