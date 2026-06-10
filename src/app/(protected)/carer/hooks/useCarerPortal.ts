import { useEffect, useState } from "react";

import {
  ComplianceDoc,
} from "../types/carer.types";
import {
  validateProfileForm,
} from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchCarerDocuments,
  updateCarerProfile,
  deleteCarerDocument,
} from "@/store/slices/carerSlice";
import { carerService } from "@/services/carer/carer.service";
import {
  CarerProfile,
} from "@/types/carer.types";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface UseCarerPortalProps {
  user: any;
  profile: CarerProfile | null;
  documents: any[];
}

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

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setSpecialties(profile.careSpecialties ?? "");
      setExperience(profile.experience ?? "");
      setAddress(profile.address ?? "");
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
  };
}
