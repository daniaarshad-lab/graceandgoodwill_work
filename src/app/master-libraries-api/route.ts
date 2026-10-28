import { NextRequest, NextResponse } from "next/server";
import {
  executeMasterLibraryMutation,
  getMasterLibrariesSnapshot,
  MasterLibraryMutationPayload,
  resolveVerifiedAdminRole,
} from "@/lib/masterLibrariesService";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const roleHeader = req.headers.get("x-admin-role") || "admin";
  const verifiedRole = resolveVerifiedAdminRole(authHeader, roleHeader);

  if (!verifiedRole) {
    return NextResponse.json(
      { error: "Unauthorised: Admin or Super Admin access is required to view Master Libraries." },
      { status: 403 }
    );
  }

  const snapshot = getMasterLibrariesSnapshot();
  return NextResponse.json({
    role: verifiedRole,
    ...snapshot,
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const roleHeader = req.headers.get("x-admin-role");
  const actorHeader = req.headers.get("x-admin-actor") || "";
  const verifiedRole = resolveVerifiedAdminRole(authHeader, roleHeader);

  let payload: MasterLibraryMutationPayload | null = null;
  try {
    payload = (await req.json()) as MasterLibraryMutationPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || !("action" in payload)) {
    return NextResponse.json({ error: "Invalid Master Library action payload." }, { status: 400 });
  }

  const actorName =
    actorHeader || (verifiedRole === "super_admin" ? "Super Admin" : "Jessica Smith (Admin)");

  const result = executeMasterLibraryMutation(verifiedRole, actorName, payload);
  if (result.status >= 400) {
    return NextResponse.json(
      {
        error: result.error || "Permission denied.",
        libraries: result.libraries,
        approvalRequests: result.approvalRequests,
      },
      { status: result.status }
    );
  }

  return NextResponse.json(
    {
      message: result.message,
      libraries: result.libraries,
      approvalRequests: result.approvalRequests,
    },
    { status: result.status }
  );
}
