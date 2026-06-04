import { ComplianceDoc } from "../types/carer.types";

export const defaultComplianceDocs: ComplianceDoc[] = [
  {
    id: "doc-1",
    name: "Driver_License_2026.pdf",
    type: "Driver's License",
    uploadDate: "2026-05-20",
    status: "verified",
    size: "1.2 MB",
    previewUrl: "/api/placeholder/license",
  },
  {
    id: "doc-2",
    name: "CRB_Background_Check.pdf",
    type: "Criminal Record Check",
    uploadDate: "2026-05-22",
    status: "pending",
    size: "2.4 MB",
    previewUrl: "/api/placeholder/crb",
  },
];
