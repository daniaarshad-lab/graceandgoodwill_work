import { useEffect, useState } from "react";

import {
  ComplianceDoc,
} from "../types/carer.types";
import { getDocumentFileLabel } from "@/types/document.types";
import {
  validateProfileForm,
} from "../utils/validation";
import { useAppDispatch } from "@/store/hooks";
import {
  updateCarerProfile,
  updateCarerStep2,
  updateCarerStep3,
  updateCarerStep10,
  updateCarerStep11,
  deleteCarerDocument,
  uploadCarerDocument,
  updateCarerDocument,
  uploadCarerDocuments,
  fetchCarerDocuments,
  uploadCarerStepDocuments,
  submitCarerProfile,
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
  const [postcode, setPostcode] = useState("");
  const [canDrive, setCanDrive] = useState<"yes" | "no" | "">("");
  const [hasBusinessInsurance, setHasBusinessInsurance] = useState<"yes" | "no" | "">("");

  // New Fields
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [nationalInsuranceNumber, setNationalInsuranceNumber] = useState("");

  const [drivingPreferences, setDrivingPreferences] = useState<string[]>([]);
  const [dbsUpdateServiceNumber, setDbsUpdateServiceNumber] = useState("");
  const [employmentHistory, setEmploymentHistory] = useState("");
  const [declarations, setDeclarations] = useState({
    accuracy: false,
    checks: false,
    share: false,
  });

  const [otherRelevantName, setOtherRelevantName] = useState("");


  useEffect(() => {
    if (profile) {
      console.log("[Video Upload debug] loaded profile in useCarerPortal:", profile);
      const p = profile as any;
      const actualProfile = p.carerProfile || p;

      setBio(actualProfile.summary ?? actualProfile.bio ?? p.summary ?? p.bio ?? "");

      const spec = actualProfile.careSpecialties ?? p.careSpecialties;
      if (Array.isArray(spec)) {
        setSpecialties(spec.join(", "));
      } else {
        setSpecialties(spec ?? "");
      }

      setExperience(actualProfile.experienceYears?.toString() ?? actualProfile.experience ?? p.experienceYears?.toString() ?? p.experience ?? "");
      setAddress(actualProfile.address ?? p.address ?? "");
      setPostcode(actualProfile.postcode ?? p.postcode ?? "");
      
      const canDriveVal = actualProfile.canDrive ?? p.canDrive;
      setCanDrive(
        canDriveVal === true || canDriveVal === "yes" || canDriveVal === "true" 
          ? "yes" 
          : canDriveVal === false || canDriveVal === "no" || canDriveVal === "false" 
          ? "no" 
          : ""
      );
      
      const bizInsVal = actualProfile.hasBusinessInsurance ?? p.hasBusinessInsurance;
      setHasBusinessInsurance(
        bizInsVal === true || bizInsVal === "yes" || bizInsVal === "true" 
          ? "yes" 
          : bizInsVal === false || bizInsVal === "no" || bizInsVal === "false" 
          ? "no" 
          : ""
      );

      const emName = actualProfile.emergencyContactName ?? p.emergencyContactName;
      const emNum = actualProfile.emergencyContactNumber ?? p.emergencyContactNumber;
      const emRel = actualProfile.emergencyContactRelation ?? p.emergencyContactRelation;
      if (emName) setEmergencyContactName(emName);
      if (emNum) setEmergencyContactNumber(emNum);
      if (emRel) setEmergencyContactRelation(emRel);

      if (actualProfile.bankName ?? p.bankName) setBankName(actualProfile.bankName ?? p.bankName);
      if (actualProfile.accountName ?? p.accountName) setAccountName(actualProfile.accountName ?? p.accountName);
      if (actualProfile.accountNumber ?? p.accountNumber) setAccountNumber(actualProfile.accountNumber ?? p.accountNumber);
      if (actualProfile.sortCode ?? p.sortCode) setSortCode(actualProfile.sortCode ?? p.sortCode);
      if (actualProfile.nationalInsuranceNumber ?? p.nationalInsuranceNumber) setNationalInsuranceNumber(actualProfile.nationalInsuranceNumber ?? p.nationalInsuranceNumber);

      let dp = actualProfile.drivingPreferences ?? p.drivingPreferences;
      if (typeof dp === "string") {
        try {
          dp = JSON.parse(dp);
        } catch {
          dp = dp.split(",").map((s: string) => s.trim());
        }
      }
      if (Array.isArray(dp)) {
        setDrivingPreferences(dp);
      }

      const dbs = actualProfile.dbsUpdateServiceNumber ?? p.dbsUpdateServiceNumber;
      if (dbs) setDbsUpdateServiceNumber(dbs);

      const empHistory = actualProfile.employmentHistory ?? p.employmentHistory;
      if (empHistory) setEmploymentHistory(empHistory as string);
      if (profile.declarations) setDeclarations(profile.declarations as any);
      if (profile.user?.dateOfBirth) {
        setDateOfBirth(profile.user.dateOfBirth.split("T")[0]);
      }

    }
  }, [profile]);

  // Profile errors state
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Application status dynamically derived from profile user status
  const applicationStatus: "pending" | "approved" | "rejected" =
    profile?.user?.status === "APPROVED"
      ? "approved"
      : "pending";
  const [membershipActive] = useState(true);
  const [membershipExpiry] = useState("");

  // Compliance documents — derived from Redux documents state
  const complianceDocs: ComplianceDoc[] = documents.map((doc) => ({
    id: doc.id,
    name: doc.fileType ? getDocumentFileLabel(doc.fileType) : doc.fileName,
    type: doc.fileType,
    fileType: doc.fileType,
    category: doc.fileCategory,
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

  const handleSaveProfile = async (e?: React.FormEvent, step?: number): Promise<boolean> => {
    if (e) e.preventDefault();

    setProfileErrors({});
    setIsProfileSaving(true);

    try {
      if (step === 2) {
        const payload = {
          address,
          postcode,
          dateOfBirth,
          emergencyContactName,
          emergencyContactNumber,
          emergencyContactRelation,
        };
        await dispatch(updateCarerProfile(personalPayloadCheck(payload))).unwrap();
      } else if (step === 3) {
        const payload = {
          drivingPreferences,
          canDrive: canDrive || undefined,
          hasBusinessInsurance: hasBusinessInsurance || undefined,
        };
        await dispatch(updateCarerStep2(payload)).unwrap();
      } else if (step === 4) {
        const payload = {
          summary: bio,
          experienceYears: parseInt(experience, 10) || 0,
          careSpecialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
        };
        await dispatch(updateCarerStep3(payload)).unwrap();
      } else if (step === 10) {
        const payload = {
          bankName,
          accountName,
          accountNumber,
          sortCode,
          nationalInsuranceNumber,
        };
        await dispatch(updateCarerStep10(payload)).unwrap();
      } else if (step === 11 || step === 12) {
        const payload = {
          accuracy: declarations.accuracy ? "true" : "false",
          checks: declarations.checks ? "true" : "false",
          share: declarations.share ? "true" : "false",
        };
        await dispatch(updateCarerStep11(payload)).unwrap();
      } else {
        const personalPayload = {
          firstName,
          lastName,
          address,
          postcode,
          pincode: postcode,
          dateOfBirth,
          emergencyContactName,
          emergencyContactNumber,
          emergencyContactRelation,
          canDrive: canDrive === "yes" ? "true" : canDrive === "no" ? "false" : undefined,
          hasBusinessInsurance: hasBusinessInsurance === "yes" ? "true" : hasBusinessInsurance === "no" ? "false" : undefined,
          bankName,
          accountName,
          accountNumber,
          sortCode,
          summary: bio,
          experienceYears: parseInt(experience, 10) || 0,
          careSpecialties: specialties.split(",").map((s) => s.trim()).filter(Boolean),
        };

        await dispatch(updateCarerProfile(personalPayloadCheck(personalPayload))).unwrap();
      }

      // showSuccessToast(
      //   "Profile Saved",
      //   "Your profile information has been saved successfully.",
      // );
      return true;
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to save profile information.";
      showErrorToast("Error", errorMsg);
      return false;
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Helper to filter out undefined personal payload fields to avoid schema mismatch
  const personalPayloadCheck = (payload: any) => {
    const clean: any = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        clean[k] = v;
      }
    });
    return clean;
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
      "Driver's License": "IDENTITY",
      "Criminal Record Check": "COMPLIANCE",
      "Dementia Support Certificate": "ADDITIONAL_TRAINING",
      "Mandatory Care Certificate": "MANDATORY_TRAINING",
      "Business Insurance Certificate": "INSURANCE",
      "Business Insurance": "INSURANCE",
    };

    const typeMap: Record<string, string> = {
      "Driver's License": "DRIVING_LICENCE",
      "Criminal Record Check": "ENHANCED_DBS_CERTIFICATE",
      "Dementia Support Certificate": "DEMENTIA_TRAINING",
      "Mandatory Care Certificate": "OTHER_RELEVANT_CERTIFICATE",
      "Business Insurance Certificate": "PUBLIC_LIABILITY_INSURANCE",
      "Business Insurance": "PUBLIC_LIABILITY_INSURANCE",
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

      const category = categoryMap[type] || "MISC";
      const documentType = typeMap[type] || "OTHER_RELEVANT_CERTIFICATE";

      await dispatch(uploadCarerDocument({ file, category, type: documentType })).unwrap();

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

  const stageDocUpload = (
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

    const key = type.toLowerCase();
    setSelectedFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleStepBatchUpload = async (step: number) => {
    const hasFiles = Object.keys(selectedFiles).length > 0;
    if (!hasFiles && step !== 6) return true; // Nothing to upload, allow proceed unless step 6 (has text fields)

    try {
      let textFields: Record<string, string> | undefined = undefined;
      if (step === 6) {
        textFields = {
          dbsUpdateServiceNumber: dbsUpdateServiceNumber ?? "",
          employmentHistory: employmentHistory ?? "",
        };
      } else if (step === 8 && selectedFiles["other_relevant"]) {
        textFields = {
          customDocumentType: otherRelevantName ?? "",
        };
      }

      // @ts-ignore
      await dispatch(uploadCarerStepDocuments({ step, files: selectedFiles, textFields })).unwrap();
      if (hasFiles) {
        showSuccessToast(
          "Documents Uploaded",
          `Step ${step} documents successfully uploaded.`,
        );
      }
      setSelectedFiles({});
      dispatch(fetchCarerDocuments());
      return true;
    } catch (error: any) {
      showErrorToast("Upload Failed", error || "Failed to upload step documents.");
      return false;
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

  const submitProfile = async (): Promise<boolean> => {
    setIsProfileSaving(true);
    try {
      await dispatch(submitCarerProfile()).unwrap();
      showSuccessToast(
        "Profile Submitted",
        "Your profile has been successfully submitted for verification.",
      );
      return true;
    } catch (error: any) {
      showErrorToast("Submission Failed", error || "Failed to submit profile.");
      return false;
    } finally {
      setIsProfileSaving(false);
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
    postcode,
    setPostcode,
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
    
    bankName,
    setBankName,
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    sortCode,
    setSortCode,
    nationalInsuranceNumber,
    setNationalInsuranceNumber,

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
    stageDocUpload,
    handleBatchUpload,
    handleStepBatchUpload,
    otherRelevantName,
    setOtherRelevantName,
    selectedFiles,
    handleDeleteDoc,
    handleUpdateDoc,
    submitProfile,
    profile,
    introVideoUrl: profile?.introVideoUrl || null,
  };
}
