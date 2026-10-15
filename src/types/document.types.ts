export enum FileCategory {
  IDENTITY = "IDENTITY",
  RIGHT_TO_WORK = "RIGHT_TO_WORK",
  COMPLIANCE = "COMPLIANCE",
  MEDICAL = "MEDICAL",
  MANDATORY_TRAINING = "MANDATORY_TRAINING",
  ADDITIONAL_TRAINING = "ADDITIONAL_TRAINING",
  PREVIOUS_EMPLOYMENT = "PREVIOUS_EMPLOYMENT",
  INSURANCE = "INSURANCE",
  MISC = "MISC",
}

export enum DocumentFileType {
  // Identity
  PASSPORT = "PASSPORT",
  DRIVING_LICENCE = "DRIVING_LICENCE",
  DRIVING_LICENCE_FRONT = "DRIVING_LICENCE_FRONT",
  DRIVING_LICENCE_BACK = "DRIVING_LICENCE_BACK",
  PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS",
  PROOF_OF_ADDRESS_SUPPORTING = "PROOF_OF_ADDRESS_SUPPORTING",
  RIGHT_TO_WORK = "RIGHT_TO_WORK",
  RIGHT_TO_WORK_SUPPORTING = "RIGHT_TO_WORK_SUPPORTING",
  NATIONAL_INSURANCE_PROOF = "NATIONAL_INSURANCE_PROOF",

  // Mandatory Training
  SAFEGUARDING_ADULTS = "SAFEGUARDING_ADULTS",
  MOVING_AND_HANDLING = "MOVING_AND_HANDLING",
  MEDICATION_ADMINISTRATION = "MEDICATION_ADMINISTRATION",
  BASIC_LIFE_SUPPORT_FIRST_AID = "BASIC_LIFE_SUPPORT_FIRST_AID",
  INFECTION_PREVENTION_AND_CONTROL = "INFECTION_PREVENTION_AND_CONTROL",
  HEALTH_AND_SAFETY = "HEALTH_AND_SAFETY",
  FIRE_SAFETY = "FIRE_SAFETY",
  FOOD_HYGIENE = "FOOD_HYGIENE",
  GDPR_DATA_PROTECTION = "GDPR_DATA_PROTECTION",

  // Compliance
  ENHANCED_DBS_CERTIFICATE = "ENHANCED_DBS_CERTIFICATE",
  ENHANCED_DBS_SUPPORTING = "ENHANCED_DBS_SUPPORTING",
  CV_RESUME = "CV_RESUME",
  CV_SUPPORTING = "CV_SUPPORTING",
  PROFESSIONAL_REFERENCE_1 = "PROFESSIONAL_REFERENCE_1",
  PROFESSIONAL_REFERENCE_2 = "PROFESSIONAL_REFERENCE_2",
  PROFESSIONAL_REFERENCE_SUPPORTING = "PROFESSIONAL_REFERENCE_SUPPORTING",
  ADDITIONAL_REFERENCE = "ADDITIONAL_REFERENCE",

  // Insurance
  PUBLIC_LIABILITY_INSURANCE = "PUBLIC_LIABILITY_INSURANCE",
  PUBLIC_LIABILITY_SUPPORTING = "PUBLIC_LIABILITY_SUPPORTING",
  PROFESSIONAL_INDEMNITY_INSURANCE = "PROFESSIONAL_INDEMNITY_INSURANCE",
  PROFESSIONAL_INDEMNITY_SUPPORTING = "PROFESSIONAL_INDEMNITY_SUPPORTING",
  BUSINESS_INSURANCE = "BUSINESS_INSURANCE",

  // Additional Training (Step 8)
  NVQ_2 = "NVQ_2",
  NVQ_3 = "NVQ_3",
  NVQ_4 = "NVQ_4",
  NURSING_QUALIFICATION = "NURSING_QUALIFICATION",
  UNIVERSITY_QUALIFICATION = "UNIVERSITY_QUALIFICATION",
  DEMENTIA_TRAINING = "DEMENTIA_TRAINING",
  END_OF_LIFE_CARE = "END_OF_LIFE_CARE",
  CATHETER_CARE = "CATHETER_CARE",
  PEG_FEEDING = "PEG_FEEDING",
  STOMA_CARE = "STOMA_CARE",
  COMPLEX_CARE = "COMPLEX_CARE",
  MEDICATION_COMPETENCY = "MEDICATION_COMPETENCY",
  OTHER_RELEVANT = "OTHER_RELEVANT",
  OTHER = "OTHER",
}

export const DocumentFileTypeLabels: Record<string, string> = {
  // Identity
  [DocumentFileType.PASSPORT]: "Passport",
  [DocumentFileType.DRIVING_LICENCE]: "Driving Licence",
  [DocumentFileType.DRIVING_LICENCE_FRONT]: "Driving Licence (Front)",
  [DocumentFileType.DRIVING_LICENCE_BACK]: "Driving Licence (Back)",
  [DocumentFileType.PROOF_OF_ADDRESS]: "Proof of Address",
  [DocumentFileType.PROOF_OF_ADDRESS_SUPPORTING]:
    "Proof of Address (Supporting Evidence)",
  [DocumentFileType.RIGHT_TO_WORK]: "Right to Work in the UK",
  [DocumentFileType.RIGHT_TO_WORK_SUPPORTING]:
    "Right to Work (Home Office / GOV.UK Verification)",
  [DocumentFileType.NATIONAL_INSURANCE_PROOF]:
    "Proof of National Insurance Number",

  // Mandatory Training
  [DocumentFileType.SAFEGUARDING_ADULTS]: "Safeguarding Adults",
  [DocumentFileType.MOVING_AND_HANDLING]: "Moving and Handling",
  [DocumentFileType.MEDICATION_ADMINISTRATION]: "Medication Administration",
  [DocumentFileType.BASIC_LIFE_SUPPORT_FIRST_AID]:
    "Basic Life Support / First Aid",
  [DocumentFileType.INFECTION_PREVENTION_AND_CONTROL]:
    "Infection Prevention and Control",
  [DocumentFileType.HEALTH_AND_SAFETY]: "Health and Safety",
  [DocumentFileType.FIRE_SAFETY]: "Fire Safety",
  [DocumentFileType.FOOD_HYGIENE]: "Food Hygiene",
  [DocumentFileType.GDPR_DATA_PROTECTION]: "GDPR / Data Protection",

  // Compliance
  [DocumentFileType.ENHANCED_DBS_CERTIFICATE]: "Enhanced DBS Certificate",
  [DocumentFileType.ENHANCED_DBS_SUPPORTING]:
    "Enhanced DBS (Verification / Check Confirmation)",
  [DocumentFileType.CV_RESUME]: "CV / Employment History",
  [DocumentFileType.CV_SUPPORTING]: "CV (Supporting Employment Documentation)",
  [DocumentFileType.PROFESSIONAL_REFERENCE_1]: "Professional Reference 1",
  [DocumentFileType.PROFESSIONAL_REFERENCE_2]: "Professional Reference 2",
  [DocumentFileType.PROFESSIONAL_REFERENCE_SUPPORTING]:
    "Professional Reference (Verification Confirmation)",
  [DocumentFileType.ADDITIONAL_REFERENCE]: "Additional Reference",

  // Insurance
  [DocumentFileType.PUBLIC_LIABILITY_INSURANCE]: "Public Liability Insurance",
  [DocumentFileType.PUBLIC_LIABILITY_SUPPORTING]:
    "Public Liability (Policy Schedule / Supporting Doc)",
  [DocumentFileType.PROFESSIONAL_INDEMNITY_INSURANCE]:
    "Professional Indemnity Insurance",
  [DocumentFileType.PROFESSIONAL_INDEMNITY_SUPPORTING]:
    "Professional Indemnity (Supporting Policy Doc)",
  [DocumentFileType.BUSINESS_INSURANCE]: "Business Use Insurance Cover",

  // Additional Training (Step 8)
  [DocumentFileType.NVQ_2]: "NVQ Level 2",
  [DocumentFileType.NVQ_3]: "NVQ Level 3",
  [DocumentFileType.NVQ_4]: "NVQ Level 4",
  [DocumentFileType.NURSING_QUALIFICATION]: "Nursing Qualifications",
  [DocumentFileType.UNIVERSITY_QUALIFICATION]: "University Qualifications",
  [DocumentFileType.DEMENTIA_TRAINING]: "Dementia Training",
  [DocumentFileType.END_OF_LIFE_CARE]: "End of Life Care Training",
  [DocumentFileType.CATHETER_CARE]: "Catheter Care Training",
  [DocumentFileType.PEG_FEEDING]: "PEG Feeding Training",
  [DocumentFileType.STOMA_CARE]: "Stoma Care Training",
  [DocumentFileType.COMPLEX_CARE]: "Complex Care Training",
  [DocumentFileType.MEDICATION_COMPETENCY]: "Medication Competency Assessments",
  [DocumentFileType.OTHER_RELEVANT]: "Any Other Relevant Certificates",
  [DocumentFileType.OTHER]: "Other Certificate",
};

export const getDocumentFileLabel = (
  type: DocumentFileType | string,
): string => {
  return DocumentFileTypeLabels[type as DocumentFileType] || type;
};

