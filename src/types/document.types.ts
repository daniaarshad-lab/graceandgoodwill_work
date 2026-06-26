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
  PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS",
  RIGHT_TO_WORK = "RIGHT_TO_WORK",
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
  CV_RESUME = "CV_RESUME",
  PROFESSIONAL_REFERENCE_1 = "PROFESSIONAL_REFERENCE_1",
  PROFESSIONAL_REFERENCE_2 = "PROFESSIONAL_REFERENCE_2",
  ADDITIONAL_REFERENCE = "ADDITIONAL_REFERENCE",

  // Insurance
  PUBLIC_LIABILITY_INSURANCE = "PUBLIC_LIABILITY_INSURANCE",
  PROFESSIONAL_INDEMNITY_INSURANCE = "PROFESSIONAL_INDEMNITY_INSURANCE",

  // Additional Training
  NVQ_LEVEL_2 = "NVQ_LEVEL_2",
  NVQ_LEVEL_3 = "NVQ_LEVEL_3",
  NVQ_LEVEL_4 = "NVQ_LEVEL_4",
  NURSING_QUALIFICATIONS = "NURSING_QUALIFICATIONS",
  UNIVERSITY_QUALIFICATIONS = "UNIVERSITY_QUALIFICATIONS",
  DEMENTIA_TRAINING = "DEMENTIA_TRAINING",
  END_OF_LIFE_CARE_TRAINING = "END_OF_LIFE_CARE_TRAINING",
  CATHETER_CARE_TRAINING = "CATHETER_CARE_TRAINING",
  PEG_FEEDING_TRAINING = "PEG_FEEDING_TRAINING",
  STOMA_CARE_TRAINING = "STOMA_CARE_TRAINING",
  COMPLEX_CARE_TRAINING = "COMPLEX_CARE_TRAINING",
  MEDICATION_COMPETENCY_ASSESSMENT = "MEDICATION_COMPETENCY_ASSESSMENT",
  OTHER_RELEVANT_CERTIFICATE = "OTHER_RELEVANT_CERTIFICATE",
}

export const DocumentFileTypeLabels: Record<string, string> = {
  // Identity
  [DocumentFileType.PASSPORT]: "Passport",
  [DocumentFileType.DRIVING_LICENCE]: "Driving Licence",
  [DocumentFileType.PROOF_OF_ADDRESS]: "Proof of Address",
  [DocumentFileType.RIGHT_TO_WORK]: "Right to Work in the UK",
  [DocumentFileType.NATIONAL_INSURANCE_PROOF]: "Proof of National Insurance Number",

  // Mandatory Training
  [DocumentFileType.SAFEGUARDING_ADULTS]: "Safeguarding Adults",
  [DocumentFileType.MOVING_AND_HANDLING]: "Moving and Handling",
  [DocumentFileType.MEDICATION_ADMINISTRATION]: "Medication Administration",
  [DocumentFileType.BASIC_LIFE_SUPPORT_FIRST_AID]: "Basic Life Support / First Aid",
  [DocumentFileType.INFECTION_PREVENTION_AND_CONTROL]: "Infection Prevention and Control",
  [DocumentFileType.HEALTH_AND_SAFETY]: "Health and Safety",
  [DocumentFileType.FIRE_SAFETY]: "Fire Safety",
  [DocumentFileType.FOOD_HYGIENE]: "Food Hygiene",
  [DocumentFileType.GDPR_DATA_PROTECTION]: "GDPR / Data Protection",

  // Compliance
  [DocumentFileType.ENHANCED_DBS_CERTIFICATE]: "Enhanced DBS Certificate",
  [DocumentFileType.CV_RESUME]: "CV / Resume",
  [DocumentFileType.PROFESSIONAL_REFERENCE_1]: "Professional Reference 1",
  [DocumentFileType.PROFESSIONAL_REFERENCE_2]: "Professional Reference 2",
  [DocumentFileType.ADDITIONAL_REFERENCE]: "Additional Reference",

  // Insurance
  [DocumentFileType.PUBLIC_LIABILITY_INSURANCE]: "Public Liability Insurance",
  [DocumentFileType.PROFESSIONAL_INDEMNITY_INSURANCE]: "Professional Indemnity Insurance",

  // Additional Training
  [DocumentFileType.NVQ_LEVEL_2]: "NVQ Level 2",
  [DocumentFileType.NVQ_LEVEL_3]: "NVQ Level 3",
  [DocumentFileType.NVQ_LEVEL_4]: "NVQ Level 4",
  [DocumentFileType.NURSING_QUALIFICATIONS]: "Nursing Qualifications",
  [DocumentFileType.UNIVERSITY_QUALIFICATIONS]: "University Qualifications",
  [DocumentFileType.DEMENTIA_TRAINING]: "Dementia Training",
  [DocumentFileType.END_OF_LIFE_CARE_TRAINING]: "End of Life Care Training",
  [DocumentFileType.CATHETER_CARE_TRAINING]: "Catheter Care Training",
  [DocumentFileType.PEG_FEEDING_TRAINING]: "PEG Feeding Training",
  [DocumentFileType.STOMA_CARE_TRAINING]: "Stoma Care Training",
  [DocumentFileType.COMPLEX_CARE_TRAINING]: "Complex Care Training",
  [DocumentFileType.MEDICATION_COMPETENCY_ASSESSMENT]: "Medication Competency Assessment",
  [DocumentFileType.OTHER_RELEVANT_CERTIFICATE]: "Other Relevant Certificate",
};

export const getDocumentFileLabel = (type: DocumentFileType | string): string => {
  return DocumentFileTypeLabels[type as DocumentFileType] || type;
};
