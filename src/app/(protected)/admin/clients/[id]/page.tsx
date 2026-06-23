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
  CreditCard,
  History,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "@/services/admin/admin.service";

// Define strict types for client detail view
interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientSince: string; // ISO date
  status: string; // PENDING, UNDER_REVIEW, VERIFIED, REJECTED
  agreedWeeklyFee: number;
  totalPaidSoFar: number;
  placementHistory: {
    startDate: string;
    carerName: string;
    status: string; // Active, Matched, Completed
  }[];
}

// Complete mock database for fallbacks based on UI specifications and mock files
const mockClientsDb: Record<string, ClientDetail> = {
  "req-5": {
    id: "req-5",
    name: "Winston Churchill",
    email: "w.churchill@downingstreet.gov.uk",
    phone: "+44 7700 910777",
    address: "10 Downing Street, London, SW1A 2AA",
    clientSince: "2025-10-12",
    status: "VERIFIED",
    agreedWeeklyFee: 600.0,
    totalPaidSoFar: 19200.0,
    placementHistory: [
      {
        startDate: "2026-05-29",
        carerName: "Helena Rostova",
        status: "Active",
      },
    ],
  },
  "req-1": {
    id: "req-1",
    name: "Arthur Pendelton",
    email: "a.pendelton@gmail.com",
    phone: "+44 7700 910901",
    address: "42 Baker Street, London, NW1 6XE",
    clientSince: "2026-01-15",
    status: "VERIFIED",
    agreedWeeklyFee: 450.0,
    totalPaidSoFar: 9450.0,
    placementHistory: [
      {
        startDate: "2026-06-01",
        carerName: "Eleanor Vance",
        status: "Matched",
      },
    ],
  },
  "req-2": {
    id: "req-2",
    name: "Margaret Thatcher (Family)",
    email: "thatcher.family@yahoo.com",
    phone: "+44 7700 910344",
    address: "12 Belgrave Square, London, SW1X 8PG",
    clientSince: "2026-04-01",
    status: "VERIFIED",
    agreedWeeklyFee: 350.0,
    totalPaidSoFar: 4200.0,
    placementHistory: [],
  },
  "req-3": {
    id: "req-3",
    name: "Jonathan Harker",
    email: "harker.j@harker-solicitors.co.uk",
    phone: "+44 7700 910112",
    address: "Carfax Abbey, London, SE1 9SG",
    clientSince: "2026-05-20",
    status: "UNDER_REVIEW",
    agreedWeeklyFee: 550.0,
    totalPaidSoFar: 0.0,
    placementHistory: [],
  },
  "req-4": {
    id: "req-4",
    name: "Penelope Featherington",
    email: "p.featherington@whistledown.com",
    phone: "+44 7700 910887",
    address: "14 Royal Crescent, Bath, BA1 2LS",
    clientSince: "2026-03-10",
    status: "PENDING",
    agreedWeeklyFee: 280.0,
    totalPaidSoFar: 1120.0,
    placementHistory: [],
  },
};

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

  useEffect(() => {
    async function loadClientData() {
      setLoading(true);
      setError(null);
      try {
        let backendClient = null;
        try {
          const clients = await adminService.getClients();
          backendClient = clients.find(
            (c: any) => c.id === id || c.clientProfile?.id === id,
          );
        } catch (fetchErr) {
          console.warn("Backend getClients failed, using mock path:", fetchErr);
        }

        let clientPlacements: any[] = [];
        try {
          const placements = await adminService.getPlacements();
          clientPlacements = placements.filter(
            (p: any) =>
              p.clientProfileId === id ||
              p.clientProfile?.userId === id ||
              (backendClient &&
                p.clientProfileId === backendClient.clientProfile?.id),
          );
        } catch (fetchPlacementsErr) {
          console.warn("Backend getPlacements failed:", fetchPlacementsErr);
        }

        if (backendClient) {
          const profile = backendClient.clientProfile || {};
          const user = backendClient;
          const createdAtDate =
            profile.createdAt || user.createdAt || new Date().toISOString();
          const status = profile.status || user.status || "PENDING";

          const history = clientPlacements.map((p: any) => {
            const carerUser = p.carerProfile?.user || {};
            let pStatus = "Matched";
            if (p.status === "ACTIVE") pStatus = "Active";
            else if (p.status === "COMPLETED") pStatus = "Completed";

            return {
              startDate: p.startDate
                ? new Date(p.startDate).toISOString().split("T")[0]
                : "Pending",
              carerName: `${carerUser.firstName || "Unknown"} ${carerUser.lastName || "Carer"}`.trim(),
              status: pStatus,
            };
          });

          const activePlacement = clientPlacements.find(
            (p: any) => p.status === "ACTIVE" || p.status === "CREATED",
          );
          const agreedWeeklyFee = activePlacement
            ? parseFloat(activePlacement.hourlyRate) * 40
            : mockClientsDb[id]?.agreedWeeklyFee || 500.0;

          const totalPaidSoFar =
            mockClientsDb[id]?.totalPaidSoFar || 0.0;

          setClient({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phoneNumber || "No phone listed",
            address:
              profile.address ||
              (profile.city ? `${profile.city}, UK` : "No address listed"),
            clientSince: createdAtDate,
            status: status,
            agreedWeeklyFee: agreedWeeklyFee,
            totalPaidSoFar: totalPaidSoFar,
            placementHistory:
              history.length > 0
                ? history
                : mockClientsDb[id]?.placementHistory || [],
          });
        } else {
          const mockClient = mockClientsDb[id];
          if (mockClient) {
            setClient(mockClient);
          } else {
            setClient({
              id: id,
              name: "Registered Client",
              email: "client@graceandgoodwill.co.uk",
              phone: "+44 7700 900000",
              address: "London, UK",
              clientSince: new Date().toISOString(),
              status: "PENDING",
              agreedWeeklyFee: 400.0,
              totalPaidSoFar: 0.0,
              placementHistory: [],
            });
          }
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

    if (id) {
      loadClientData();
    }
  }, [id]);

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
    if (history.length === 0) return "Unmatched";
    const activePlacement = history.find((p) => p.status === "Active");
    if (activePlacement) return "Active";
    const matchedPlacement = history.find((p) => p.status === "Matched");
    if (matchedPlacement) return "Matched";
    return "Completed";
  };

  const getPlacementStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Matched":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Unmatched":
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
            onClick={() => router.push("/admin?tab=placements")}
            className="px-5 py-2.5 text-xs font-bold text-navy-950 bg-gold hover:bg-gold-200 rounded-xl transition duration-300 flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
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
              href="/admin?tab=placements"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard Overview
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
                  {client.status}
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
                  <span className="text-gold-200 font-bold">
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
                    {currentPlacementStatus}
                  </span>
                </div>
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
                    £
                    {client.agreedWeeklyFee.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
                            {new Date(hist.startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
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
      </div>
    </main>
  );
}
