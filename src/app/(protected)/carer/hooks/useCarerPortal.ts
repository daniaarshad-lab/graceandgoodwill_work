import { useEffect, useState } from "react";

import {
  ComplianceDoc,
} from "../types/carer.types";
import {
  validateProfileForm,
} from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import {
  updateCarerProfile,
  deleteCarerDocument,
  uploadCarerDocument,
  updateCarerDocument,
  uploadCarerDocuments,
  fetchCarerDocuments,
} from "@/store/slices/carerSlice";
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
  const [canDrive, setCanDrive] = useState<"yes" | "no" | "">("");
  const [hasBusinessInsurance, setHasBusinessInsurance] = useState<"yes" | "no" | "">("");

  // New Fields
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [drivingPreferences, setDrivingPreferences] = useState<string[]>([]);
  const [dbsUpdateServiceNumber, setDbsUpdateServiceNumber] = useState("");
  const [employmentHistory, setEmploymentHistory] = useState("");
  const [declarations, setDeclarations] = useState({
    accuracy: false,
    checks: false,
    share: false,
  });


  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setSpecialties(profile.careSpecialties ?? "");
      setExperience(profile.experience ?? "");
      setAddress(profile.address ?? "");
      setCanDrive(profile.canDrive === true ? "yes" : profile.canDrive === false ? "no" : "");
      
      if (profile.emergencyContactName) setEmergencyContactName(profile.emergencyContactName);
      if (profile.emergencyContactNumber) setEmergencyContactNumber(profile.emergencyContactNumber);
      if (profile.emergencyContactRelation) setEmergencyContactRelation(profile.emergencyContactRelation);
      if (profile.drivingPreferences) setDrivingPreferences(profile.drivingPreferences);
      if (profile.dbsUpdateServiceNumber) setDbsUpdateServiceNumber(profile.dbsUpdateServiceNumber);
      if (profile.employmentHistory) setEmploymentHistory(profile.employmentHistory as string);
      if (profile.declarations) setDeclarations(profile.declarations as any);

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
    fileType: doc.fileType,
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

  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  
  // Batch Upload States
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

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
      dateOfBirth,
      emergencyContactName,
      emergencyContactNumber,
      emergencyContactRelation,
      drivingPreferences,
      dbsUpdateServiceNumber,
      employmentHistory,
      declarations,
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
      "Mandatory Care Certificate": "CARE_CERTIFICATE",
      "Business Insurance Certificate": "BUSINESS_INSURANCE",
    };

    const categoryMapForBatch: Record<string, string> = {
      "Driver's License": "drivers_license",
      "Criminal Record Check": "criminal_record_check",
      "Dementia Support Certificate": "dementia_support",
      "Mandatory Care Certificate": "care_certificate",
      "Business Insurance Certificate": "business_insurance",
    };

    const key = categoryMapForBatch[type];
    if (key) {
      setSelectedFiles((prev) => ({ ...prev, [key]: file }));
    }

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

      const category = categoryMap[type] || type;

      await dispatch(uploadCarerDocument({ file, category })).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      showSuccessToast(
        "Document Uploaded",
        `Document "${file.name}" uploaded successfully!`,
      );
      
      dispatch(fetchCarerDocuments());

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

  const handleBatchUpload = async () => {
    if (Object.keys(selectedFiles).length === 0) return false;
    try {
      await dispatch(uploadCarerDocuments(selectedFiles)).unwrap();
      showSuccessToast(
        "Documents Uploaded",
        "All documents were successfully uploaded.",
      );
      setSelectedFiles({});
      dispatch(fetchCarerDocuments());
      return true;
    } catch (error: any) {
      showErrorToast("Upload Failed", error || "Failed to upload documents.");
      return false;
    }
  };

  const handleDeleteDoc = async (id: string) => {
    const docInfo = complianceDocs.find((d) => d.id === id);

    try {
      await dispatch(deleteCarerDocument(id)).unwrap();
      showSuccessToast("Document Deleted", "Document successfully deleted.");
      dispatch(fetchCarerDocuments());

      if (docInfo) {
        const backendToBatchKey: Record<string, string> = {
          DRIVERS_LICENSE: "drivers_license",
          CRIMINAL_RECORD_CHECK: "criminal_record_check",
          DEMENTIA_SUPPORT: "dementia_support",
          CARE_CERTIFICATE: "care_certificate",
          BUSINESS_INSURANCE: "business_insurance",
        };
        const key = backendToBatchKey[docInfo.type];
        if (key) {
          setSelectedFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[key];
            return newFiles;
          });
        }
      }
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to delete document. Please try again.";
      showErrorToast("Delete Failed", errorMsg);
    }
  };

  const handleUpdateDoc = async (
    id: string,
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
      "Business Insurance Certificate": "BUSINESS_INSURANCE",
      "Mandatory Care Certificate": "CARE_CERTIFICATE",
      DRIVERS_LICENSE: "DRIVERS_LICENSE",
      CRIMINAL_RECORD_CHECK: "CRIMINAL_RECORD_CHECK",
      DEMENTIA_SUPPORT: "DEMENTIA_SUPPORT",
      BUSINESS_INSURANCE: "BUSINESS_INSURANCE",
      CARE_CERTIFICATE: "CARE_CERTIFICATE",
    };

    const category = categoryMap[type] || type;

    try {
      await dispatch(updateCarerDocument({ id, file, category })).unwrap();
      showSuccessToast(
        "Document Replaced",
        `Document "${file.name}" replaced successfully!`,
      );
      dispatch(fetchCarerDocuments());
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to replace document.";
      showErrorToast("Replace Failed", errorMsg);
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
    canDrive,
    setCanDrive,
    hasBusinessInsurance,
    setHasBusinessInsurance,

    dateOfBirth,
    setDateOfBirth,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactNumber,
    setEmergencyContactNumber,
    emergencyContactRelation,
    setEmergencyContactRelation,
    drivingPreferences,
    setDrivingPreferences,
    dbsUpdateServiceNumber,
    setDbsUpdateServiceNumber,
    employmentHistory,
    setEmploymentHistory,
    declarations,
    setDeclarations,

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
    handleBatchUpload,
    selectedFiles,
    handleDeleteDoc,
    handleUpdateDoc,
  };
}
