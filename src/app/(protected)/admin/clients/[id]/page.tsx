"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  History,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import InternalNotes from "../../components/shared/InternalNotes/InternalNotes";

// Define strict types for client detail view
interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientSince: string; // ISO date
  status: string; // PENDING, UNDER_REVIEW, VERIFIED, REJECTED, APPROVED
  agreedWeeklyFee: number;
  totalPaidSoFar: number;
  placementHistory: {
    startDate: string;
    carerName: string;
    status: string; // Active, Matched, Completed
  }[];
}

export default function ClientDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 py-10 text-gold-100 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gold-100/60 font-semibold">
            Loading client records...
          </p>
        </main>
      }
    >
      <ClientDetailsContent />
    </Suspense>
  );
}

function ClientDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fee input and action states
  const [weeklyFeeInput, setWeeklyFeeInput] = useState<string>("");
  const [savingFee, setSavingFee] = useState(false);
  const [approvingClient, setApprovingClient] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function loadClientData() {
    setError(null);
    try {
      const res = await adminService.getClientDetails(id);
      if (res) {
        const userObj = res.user || res;
        const firstName = userObj.firstName || res.firstName || "";
        const lastName = userObj.lastName || res.lastName || "";
        const email = userObj.email || res.email || "No email listed";
        const phoneNumber = userObj.phoneNumber || res.phoneNumber || "No phone listed";

        const history = (res.placements || []).map((p: any) => {
          const carerUser = p.carerProfile?.user || {};
          const carerName = p.carerName ||
            `${carerUser.firstName || "Unknown"} ${carerUser.lastName || "Carer"}`.trim() ||
            "Assigned Carer";

          return {
            startDate: p.startDate || p.createdAt || "Pending",
            carerName: carerName,
            status: p.status || "Active",
          };
        });

        // Compute total paid from invoices if available
        const totalPaidSoFar = (res.invoices || []).reduce((acc: number, inv: any) => {
          if (inv.status?.toUpperCase() === "PAID") {
            return acc + (parseFloat(inv.amount) || 0);
          }
          return acc;
        }, 0) || 0.0;

        let agreedWeeklyFee = 0.0;
        if (res.weeklyFee !== undefined && res.weeklyFee !== null) {
          const parsed = parseFloat(res.weeklyFee);
          if (!isNaN(parsed)) {
            agreedWeeklyFee = parsed;
          }
        }

        setClient({
          id: res.id || id,
          name: `${firstName} ${lastName}`.trim() || "Registered Client",
          email: email,
          phone: phoneNumber,
          address:
            res.address || "No address listed",
          clientSince: res.createdAt || new Date().toISOString(),
          status: res.status || "PENDING",
          agreedWeeklyFee: agreedWeeklyFee,
          totalPaidSoFar: totalPaidSoFar,
          placementHistory: history,
        });

        // Set initial weekly fee input value
        setWeeklyFeeInput(agreedWeeklyFee > 0 ? String(agreedWeeklyFee) : "");
      } else {
        setError("Requested client profile could not be found.");
      }
    } catch (err: any) {
      console.error("Failed to load client details:", err);
      setError(
        err.message || "An unexpected error occurred while loading client details.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      loadClientData();
    }
  }, [id]);

  // Action to save weekly fee
  const handleSaveWeeklyFee = async () => {
    setValidationError(null);
    if (!weeklyFeeInput || weeklyFeeInput.trim() === "") {
      setValidationError("Weekly fee is required.");
      return;
    }
    const feeVal = parseFloat(weeklyFeeInput);
    if (isNaN(feeVal) || feeVal <= 0) {
      setValidationError("Weekly fee must be greater than 0.");
      return;
    }
    setSavingFee(true);
    try {
      await adminService.updateClientWeeklyFee(id, feeVal);
      showSuccessToast("Weekly Fee Saved", "The weekly fee has been successfully updated.");
      await loadClientData();
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Failed to save weekly fee.");
    } finally {
      setSavingFee(false);
    }
  };

  // Action to approve client
  const handleApproveClient = async () => {
    setValidationError(null);
    if (!client || client.agreedWeeklyFee <= 0) {
      setValidationError("Weekly fee must be set and saved before approving the client.");
      return;
    }
    setApprovingClient(true);
    try {
      await adminService.approveClient(id);
      showSuccessToast("Client Approved", "The client account has been successfully approved.");
      await loadClientData();
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Failed to approve client.");
    } finally {
      setApprovingClient(false);
    }
  };

  // Duration calculation for "How long client has been with Grace & Goodwill"
  const getDurationWithUs = (dateString: string) => {
    if (!dateString) return "N/A";
    const start = new Date(dateString);
    const now = new Date();

    const totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    if (totalMonths < 1) {
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} Month${months === 1 ? "" : "s"}`;
    }

    return `${years} Year${years === 1 ? "" : "s"}${
      months > 0 ? ` ${months} Month${months === 1 ? "" : "s"}` : ""
    }`;
  };

  const getStatusBadgeStyles = (status: string) => {
    const cleanStatus = status?.toUpperCase() || "PENDING";
    switch (cleanStatus) {
      case "VERIFIED":
      case "APPROVED":
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "UNDER_REVIEW":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "PENDING":
      default:
        return "bg-gold/10 text-gold border border-gold/20";
    }
  };

  const getCurrentPlacementStatus = (history: ClientDetail["placementHistory"]) => {
    if (history.length === 0) return "NEW_ENQUIRY";
    const activePlacement = history.find((p) => p.status === "PLACEMENT_STARTED" || p.status === "ONGOING");
    if (activePlacement) return activePlacement.status;
    const matchedPlacement = history.find((p) => p.status === "PLACEMENT_CONFIRMED");
    if (matchedPlacement) return "PLACEMENT_CONFIRMED";
    return "COMPLETED";
  };

  const getPlacementStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PLACEMENT_STARTED":
      case "ONGOING":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "PLACEMENT_CONFIRMED":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "NEW_ENQUIRY":
        return "bg-navy-900 border border-gold-300/10 text-gold-200/50";
      case "COMPLETED":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-navy-950 text-gold-100/40 border border-gold-300/5";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold animate-pulse">
          Fetching client records...
        </p>
      </main>
    );
  }

  if (error || !client) {
    return (
      <main className="min-h-screen bg-navy-950 py-12 text-gold-100 flex flex-col items-center justify-center space-y-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 max-w-xl space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold">Failed to Load Client Record</h2>
          <p className="text-xs text-red-500/80">
            {error || "The requested client could not be found."}
          </p>
          <button
            onClick={() => router.push("/admin?tab=requests")}
            className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Client Requests
          </button>
        </div>
      </main>
    );
  }

  const currentPlacementStatus = getCurrentPlacementStatus(client.placementHistory);

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100">
      <div className="container-wrapper space-y-8 max-w-7xl mx-auto px-4">
        {/* --- PORTAL HEADER --- */}
        <header className="rounded-2xl border border-gold-300/10 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 shadow-soft backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin?tab=requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Client Requests
            </Link>
            <h1 className="text-xl tracking-tight text-gold-200 sm:text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold" /> Client Details
            </h1>
            <p className="text-xs text-gold-100/50">
              View and audit client records, weekly fees, registration status, and care placements
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy-900/40 px-4 py-3 rounded-xl border border-gold-300/5">
            <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gold-200">{client.name}</p>
              <p className="text-[10px] text-gold-100/40 uppercase tracking-wider font-semibold">
                Status:{" "}
                <span
                  className={`font-bold ml-1 px-1.5 py-0.5 rounded ${getStatusBadgeStyles(
                    client.status,
                  )}`}
                >
                  {client.status === "PLACEMENT_STARTED" ? "Active" : client.status === "PLACEMENT_CONFIRMED" ? "Matched" : client.status}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* --- CORE CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* LEFT SIDEBAR: STATUS & FINANCIAL CARD ROW */}
          <aside className="lg:col-span-1 space-y-6 flex flex-col">
            {/* CLIENT STATUS CARD */}
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3">
                Client Status Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold-100/40 font-semibold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gold/60" /> Registered Since:
                  </span>
                  <span className="text-gold-200 font-bold font-mono">
                    {new Date(client.clientSince).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gold-100/40 font-semibold flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gold/60" /> Duration With Grace & Goodwill:
                  </span>
                  <span className="text-gold-200 font-bold italic">
                    {getDurationWithUs(client.clientSince)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-gold-300/5 pt-4">
                  <span className="text-gold-100/40 font-semibold flex items-center gap-1.5">
                    <History className="h-4 w-4 text-gold/60" /> Placement Status:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPlacementStatusBadgeStyles(
                      currentPlacementStatus,
                    )}`}
                  >
                    {currentPlacementStatus === "PLACEMENT_STARTED" ? "ACTIVE" : currentPlacementStatus === "PLACEMENT_CONFIRMED" ? "MATCHED" : currentPlacementStatus}
                  </span>
                </div>

                {/* Approve Client action button */}
                {client.status !== "APPROVED" && (
                  <button
                    onClick={handleApproveClient}
                    disabled={approvingClient}
                    className="w-full mt-4 px-4 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 disabled:opacity-40 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {approvingClient ? (
                      <div className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Approve Client
                  </button>
                )}
              </div>
            </div>

            {/* FINANCIAL INFORMATION CARD */}
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3">
                Financial Summary
              </h3>

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-100/40 block mb-1">
                    Agreed Weekly Fee
                  </span>
                  <div className="text-3xl font-black text-gold flex items-center gap-1">
                    {client.agreedWeeklyFee && client.agreedWeeklyFee > 0 ? (
                      <>
                        £
                        {client.agreedWeeklyFee.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </>
                    ) : (
                      "Not Assigned"
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-100/40 block mb-1">
                    Total Amount Paid So Far
                  </span>
                  <div className="text-3xl font-black text-gold-200 flex items-center gap-1">
                    £
                    {client.totalPaidSoFar.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {/* Weekly Fee admin management input controls */}
                <div className="space-y-3 pt-4 border-t border-gold-300/5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-gold-200/50 block">
                    Weekly Fee Management
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold-100/40 font-mono text-xs pointer-events-none">
                        £
                      </span>
                      <input
                        type="number"
                        value={weeklyFeeInput}
                        onChange={(e) => {
                          setWeeklyFeeInput(e.target.value);
                          setValidationError(null);
                        }}
                        placeholder="Enter fee..."
                        className={`w-full bg-navy-950 border rounded-xl pl-7 pr-3 py-2 text-xs text-gold-100 placeholder-gold-100/20 outline-none transition duration-200 ${
                          validationError
                            ? "border-rose-500/80 focus:border-rose-500"
                            : "border-gold-300/10 focus:border-gold-300/30"
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleSaveWeeklyFee}
                      disabled={savingFee}
                      className="px-4 py-2 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 disabled:opacity-40 rounded-xl transition duration-300 flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      {savingFee ? (
                        <div className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                  {validationError && (
                    <p className="text-[10px] text-rose-400 font-semibold mt-1">
                      {validationError}
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-navy-950/50 p-3 border border-gold-300/5">
                  <p className="text-[10px] text-gold-100/40 italic leading-relaxed">
                    Fees are calculated according to care service category contracts and billing cycle updates.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN PANEL: CLIENT PROFILE DETAILS & PLACEMENT LOG */}
          <section className="lg:col-span-2 space-y-6 flex flex-col justify-between">
            {/* CLIENT INFORMATION CARD */}
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3">
                Client Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-950/40 border border-gold-300/5">
                  <User className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                      Full Name
                    </span>
                    <span className="text-sm font-semibold text-gold-200 truncate block">
                      {client.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-950/40 border border-gold-300/5">
                  <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                      Email Address
                    </span>
                    <span
                      className="text-sm font-semibold text-gold-200 truncate block"
                      title={client.email}
                    >
                      {client.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-950/40 border border-gold-300/5">
                  <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                      Phone Number
                    </span>
                    <span className="text-sm font-semibold text-gold-200 block">
                      {client.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-950/40 border border-gold-300/5">
                  <MapPin className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/40 block">
                      Physical Care Address
                    </span>
                    <span
                      className="text-sm font-semibold text-gold-200 truncate block"
                      title={client.address}
                    >
                      {client.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PLACEMENT HISTORY TABLE/LIST */}
            <div className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md space-y-4 flex-1 flex flex-col">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-200/50 border-b border-gold-300/5 pb-3">
                  Care Placement History
                </h3>
              </div>

              <div className="flex-1 overflow-x-auto min-h-[200px]">
                <table className="w-full text-left text-xs text-gold-100/70 border-collapse">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-[10px] font-bold uppercase tracking-wider text-gold-100/40">
                      <th className="py-2.5 px-2">Placement Date</th>
                      <th className="py-2.5 px-2">Carer Name</th>
                      <th className="py-2.5 px-2 text-right">Placement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5">
                    {client.placementHistory.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-gold-100/30 font-semibold"
                        >
                          No placement history available
                        </td>
                      </tr>
                    ) : (
                      client.placementHistory.map((hist, idx) => (
                        <tr
                          key={`${hist.carerName}-${hist.startDate}-${idx}`}
                          className="hover:bg-navy-900/20 transition duration-150"
                        >
                          <td className="py-3 px-2 font-mono font-semibold text-gold-200">
                            {hist.startDate !== "Pending" ? new Date(hist.startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }) : "Pending"}
                          </td>
                          <td className="py-3 px-2 font-semibold text-gold-100">
                            {hist.carerName}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getPlacementStatusBadgeStyles(
                                hist.status,
                              )}`}
                            >
                              {hist.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
        
        {/* INTERNAL NOTES MODULE */}
        <section className="rounded-2xl border border-gold-300/10 bg-navy-900/60 p-6 shadow-soft backdrop-blur-md">
          {client?.id ? (
            <InternalNotes entityId={client.id} entityType="CLIENT" />
          ) : (
            <p className="text-sm text-gold-100/50">Client profile ID not found for notes.</p>
          )}
        </section>
      </div>
    </main>
  );
}
