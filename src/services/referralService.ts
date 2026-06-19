import { Referral } from "@/types/referral";

// In-memory mock storage for referrals to allow dynamic additions during session
let mockReferrals: Referral[] = [
  {
    id: "ref-1",
    firstName: "Alexander",
    lastName: "Hamilton",
    email: "alexander.h@example.com",
    phone: "+44 7700 900077",
    type: "CARER",
    status: "APPROVED",
    submittedDate: "2026-06-05T10:30:00.000Z",
    notes: "Highly experienced live-in carer.",
    resumeName: "alexander_cv.pdf",
  },
  {
    id: "ref-2",
    firstName: "Sarah",
    lastName: "Connor",
    email: "sarah.c@example.com",
    phone: "+44 7700 900123",
    type: "CLIENT",
    status: "EMAIL_SENT",
    submittedDate: "2026-06-12T14:15:00.000Z",
  },
  {
    id: "ref-3",
    firstName: "Bruce",
    lastName: "Wayne",
    email: "bruce.w@example.com",
    phone: "+44 7700 900999",
    type: "CARER",
    status: "REGISTERED",
    submittedDate: "2026-06-15T09:00:00.000Z",
    resumeName: "wayne_resume.docx",
  },
  {
    id: "ref-4",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.p@example.com",
    phone: "+44 7700 900456",
    type: "CLIENT",
    status: "PENDING",
    submittedDate: "2026-06-18T16:45:00.000Z",
  },
];

export const referralService = {
  async getReferrals(): Promise<Referral[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...mockReferrals];
  },

  async submitCarerReferral(formData: FormData): Promise<Referral> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const resume = formData.get("resume") as File;

    if (!firstName || !lastName || !email || !phone || !resume) {
      throw new Error("Missing required referral fields");
    }

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      type: "CARER",
      status: "PENDING",
      submittedDate: new Date().toISOString(),
      notes: notes || undefined,
      resumeName: resume.name,
    };

    mockReferrals = [newReferral, ...mockReferrals];
    return newReferral;
  },

  async submitClientReferral(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<Referral> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { firstName, lastName, email, phone } = data;

    if (!firstName || !lastName || !email) {
      throw new Error("Missing required referral fields");
    }

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      type: "CLIENT",
      status: "EMAIL_SENT",
      submittedDate: new Date().toISOString(),
    };

    mockReferrals = [newReferral, ...mockReferrals];
    return newReferral;
  },
};
