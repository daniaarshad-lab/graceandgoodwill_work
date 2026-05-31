import { useEffect, useState } from "react";
import { defaultAvailability } from "../data/mockAvailability";
import {
  defaultBio,
  defaultSpecialties,
  defaultExperience,
  defaultAddress,
} from "../data/mockProfile";
import { CarerDocument, ComplianceDoc, WeeklyAvailability } from "../types/carer.types";
import {
  validateProfileForm,
  validateAvailabilitySchedule,
} from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import { fetchCarerDocuments, updateCarerProfile } from "@/store/slices/carerSlice";
import { carerService } from "@/services/carer/carer.service";
import { CarerProfile } from "@/types/carer.types";

interface UseCarerPortalProps {
  user: any;
  profile: CarerProfile | null;
  documents: CarerDocument[];
}

export function useCarerPortal({ user, profile, documents }: UseCarerPortalProps) {
  const [firstName, setFirstName] = useState(user?.firstName || "Alex");
  const [lastName, setLastName] = useState(user?.lastName || "Mercer");
  const [phone, setPhone] = useState(user?.phoneNumber || "+1 (555) 123-4567");
  const [email, setEmail] = useState(
    user?.email || "alex.mercer@graceandgoodwill.com",
  );
  const [bio, setBio] = useState(defaultBio);
  const [specialties, setSpecialties] = useState(defaultSpecialties);
  const [experience, setExperience] = useState(defaultExperience);
  const [address, setAddress] = useState(defaultAddress);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setSpecialties(profile.careSpecialties ?? "");
      setExperience(profile.experience ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

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

  // Application status — mock until API is available
  const [applicationStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [membershipActive] = useState(true);
  const [membershipExpiry] = useState("2027-05-25");

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
  const [complianceError, setComplianceError] = useState<string | null>(null);
  const [complianceSuccess, setComplianceSuccess] = useState<string | null>(
    null,
  );
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Availability — mock until API is available
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    () => defaultAvailability,
  );

  // Availability Save Validation States
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [availabilitySuccess, setAvailabilitySuccess] = useState(false);
  const [isAvailabilitySaving, setIsAvailabilitySaving] = useState(false);

  const dispatch = useAppDispatch();

  // Action 1: Save Profile Form Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(false);

    const formData = {
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

    const payload = {
      bio,
      careSpecialties: specialties,
      experience,
      address,
    };

    try {
      setIsProfileSaving(true);
      await dispatch(updateCarerProfile(payload)).unwrap();
      setProfileSuccessMsg(true);
      setTimeout(() => {
        setProfileSuccessMsg(false);
      }, 4000);
    } catch (error) {
      console.error(error);
      setProfileErrorMsg("Failed to update profile.");
    } finally {
      setIsProfileSaving(false);
    }
  };

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

  const handleDocUpload = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    setComplianceError(null);
    setComplianceSuccess(null);

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setComplianceError(
        "Invalid file type. Only PDF document uploads are allowed.",
      );
      return;
    }

    const maxDocSize = 10 * 1024 * 1024;

    if (file.size > maxDocSize) {
      setComplianceError(
        `File "${file.name}" is too large. Maximum allowed size is 10 MB.`,
      );
      return;
    }

    const categoryMap: Record<string, string> = {
      "Driver's License": "DRIVERS_LICENSE",
      "Criminal Record Check": "CRIMINAL_RECORD_CHECK",
      "Dementia Support Certificate": "DEMENTIA_SUPPORT",
      "Nurses Registry License": "NURSES_REGISTRY",
    };

    try {
      setUploadingDocType(type);

      const category = categoryMap[type];

      await carerService.uploadDocument(file, category);

      // Refresh documents list from Redux after successful upload
      dispatch(fetchCarerDocuments());

      setComplianceSuccess(
        `Document "${file.name}" uploaded successfully!`,
      );

      setTimeout(() => {
        setComplianceSuccess(null);
      }, 4000);
    } catch (error) {
      console.error(error);

      setComplianceError("Failed to upload document.");
    } finally {
      setUploadingDocType(null);
    }
  };
  // TODO: Integrate DELETE API — placeholder until endpoint is available
  const handleDeleteDoc = (_id: string) => {
    console.warn("Delete document API not yet integrated. ID:", _id);
  };

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
