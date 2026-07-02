"use client";

import { useState, useEffect } from "react";
import SectionCard from "./shared/SectionCard";
import { ClientRequest, CarerApplication } from "../types/admin.types";
import Button from "@/components/Button";
import { adminService } from "@/services/admin/admin.service";
import {
  User,
  MapPin,
  Clock,
  Eye,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface MatchingPanelProps {
  requests: ClientRequest[];
  carers: CarerApplication[];
  selectedRequest: ClientRequest | null;
  setSelectedRequest: (request: ClientRequest | null) => void;
  onAssign: (
    requestId: string,
    carerUserId: string,
    carerName: string,
    clientName: string,
  ) => Promise<void>;
}

export default function MatchingPanel({
  requests,
  carers,
  selectedRequest,
  setSelectedRequest,
  onAssign,
}: MatchingPanelProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingCarer, setViewingCarer] = useState<any | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const loadSuggestions = async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getSuggestions(requestId);
      setSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch suggestions from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRequest?.id) {
      loadSuggestions(selectedRequest.id);
    } else {
      setSuggestions([]);
    }
  }, [selectedRequest?.id]);

  const handleAssign = async (carerUserId: string, carerName: string) => {
    if (!selectedRequest) return;
    setAssigningId(carerUserId);
    try {
      await onAssign(
        selectedRequest.id,
        carerUserId,
        carerName,
        selectedRequest.clientName,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAssigningId(null);
    }
  };

  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${apiUrl}${url}`;
  };

  // Cross-reference suggestion carer with the approved carers pool to get deep details
  const getFullCarerDetails = (carerId: string) => {
    return carers.find((c) => c.id === carerId);
  };

  const SuggestionSkeleton = () => (
    <div className="rounded-xl border border-gold-300/10 bg-navy-950/40 p-5 space-y-4 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-12 w-12 rounded-full bg-gold-300/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gold-300/10 rounded" />
          <div className="h-3 w-24 bg-gold-300/10 rounded" />
        </div>
        <div className="h-6 w-16 bg-gold-300/10 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="h-10 bg-gold-300/5 rounded-lg" />
        <div className="h-10 bg-gold-300/5 rounded-lg" />
        <div className="h-10 bg-gold-300/5 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gold-200 mb-1.5">
          Matching Assistant Panel
        </h3>
        <p className="text-xs text-gold-100/50 max-w-xl leading-relaxed">
          Verify matching metrics, review scoring breakdown, and assign carers
          to client care requests.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
        {/* Left Side: Client Care Requests list */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <SectionCard
            className="flex flex-col overflow-hidden w-full h-[400px] lg:h-[700px] lg:min-h-[700px] lg:max-h-[700px]"
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200 border-b border-gold-300/10 pb-3 mb-4 flex-shrink-0">
              Client Care Requests
            </h4>

            {requests.length === 0 ? (
              <div className="text-center py-8 text-gold-100/30 text-xs flex-1 flex items-center justify-center">
                No active care requests found.
              </div>
            ) : (
              <div
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 match-scroll space-y-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,128,84,0.18) transparent" }}
              >
                <style>{`
                  .match-scroll::-webkit-scrollbar { width: 4px; }
                  .match-scroll::-webkit-scrollbar-track { background: transparent; }
                  .match-scroll::-webkit-scrollbar-thumb { background-color: rgba(160,128,84,0.18); border-radius: 20px; }
                  .match-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(160,128,84,0.36); }
                `}</style>
                {requests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.08)]"
                          : "bg-navy-950/40 border-gold-300/5 hover:border-gold-300/20"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div>
                          <h5 className="font-bold text-gold-200 text-sm">
                            {req.clientName}
                          </h5>
                          <span className="text-[10px] text-gold-100/50 font-medium">
                            {Array.isArray(req.careType) ? req.careType.join(", ") : req.careType}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                            req.urgency === "Emergency"
                              ? "bg-rose-500/25 text-rose-400 border border-rose-500/30"
                              : req.urgency === "High"
                                ? "bg-amber-500/25 text-amber-400 border border-amber-500/30"
                                : "bg-gold/10 text-gold-DEFAULT border border-gold-300/10"
                          }`}
                        >
                          {req.urgency}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-gold-100/70 mb-4 border-t border-gold-300/5 pt-2">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-gold/60 shrink-0" />
                          <span>Date: {req.startDate || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-gold/60 shrink-0" />
                          <span className="truncate">
                            Location: {req.location}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-gold/60 shrink-0" />
                          <span>Status: {req.status}</span>
                        </p>
                      </div>

                      <Button
                        onClick={() => setSelectedRequest(req)}
                        variant={isSelected ? "ghost-gold" : "primary"}
                        size="sm"
                        fullWidth
                      >
                        {isSelected ? "Selected" : "Find Matches"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Side: Carer Suggestions Panel */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <SectionCard
            className="flex flex-col overflow-hidden w-full h-[500px] lg:h-[700px] lg:min-h-[700px] lg:max-h-[700px]"
          >
            <div className="border-b border-gold-300/10 pb-3 mb-4 flex-shrink-0">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gold-200">
                Carer Recommendations
              </h4>
              {selectedRequest && (
                <p className="text-[11px] text-gold-100/50 mt-1">
                  Showing suggestions for{" "}
                  <span className="text-gold font-semibold">
                    {selectedRequest.clientName}
                  </span>{" "}
                  ({Array.isArray(selectedRequest.careType) ? selectedRequest.careType.join(", ") : selectedRequest.careType})
                </p>
              )}
            </div>

            <div className="flex-1 min-h-0 flex flex-col justify-center">
              {!selectedRequest ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-gold-300/10 rounded-2xl bg-navy-950/10">
                  <Sparkles className="h-10 w-10 text-gold-100/20 mb-3 animate-pulse" />
                  <h5 className="font-bold text-gold-200 text-sm mb-1">
                    Run Match Pairing
                  </h5>
                  <p className="text-xs text-gold-100/40 max-w-sm">
                    Please select &ldquo;Find Matches&rdquo; on any care request
                    in the left list to load candidate compatibility suggestions.
                  </p>
                </div>
              ) : loading ? (
                <div
                  className="flex-1 overflow-y-auto pr-1 match-scroll space-y-4"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,128,84,0.18) transparent" }}
                >
                  <SuggestionSkeleton />
                  <SuggestionSkeleton />
                  <SuggestionSkeleton />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-500/15 rounded-2xl bg-rose-500/5">
                  <AlertCircle className="h-8 w-8 text-rose-400 mb-2" />
                  <p className="text-xs text-rose-300 mb-4">{error}</p>
                  <Button
                    onClick={() => loadSuggestions(selectedRequest.id)}
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                  >
                    Retry Load
                  </Button>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-gold-300/10 rounded-2xl bg-navy-950/20 space-y-3">
                  <User className="h-10 w-10 text-gold-100/20" />
                  <h5 className="font-bold text-gold-200 text-sm">
                    No Suggestions Found
                  </h5>
                  <p className="text-xs text-gold-100/40 max-w-md leading-relaxed">
                    No suitable carers found for this care request. Please review
                    the request details or wait for additional carers to become
                    available.
                  </p>
                </div>
              ) : (
                <div
                  className="flex-1 overflow-y-auto pr-1 match-scroll space-y-4"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(160,128,84,0.18) transparent" }}
                >
                  {suggestions.map((suggestion) => {
                    const { carer, scoreBreakdown, totalScore } = suggestion;
                    const fullName = `${carer.firstName} ${carer.lastName}`;
                    const photoUrl = getFullUrl(carer.profilePhotoUrl);

                    return (
                      <div
                        key={carer.id}
                        className="rounded-xl border border-gold-300/10 bg-navy-950/30 p-5 transition-all hover:border-gold-300/20 hover:bg-navy-950/50 flex flex-col md:flex-row gap-5 items-start justify-between"
                      >
                        {/* Left: Carer Profile Details */}
                        <div className="flex gap-4 items-start flex-1 min-w-0">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={fullName}
                              className="h-14 w-14 rounded-full object-cover border border-gold-300/20 shrink-0 shadow"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT shrink-0 shadow">
                              <User className="h-6 w-6" />
                            </div>
                          )}

                          <div className="space-y-2 min-w-0 flex-1">
                            <div>
                              <h5 className="font-bold text-gold-50 text-base leading-tight truncate">
                                {fullName}
                              </h5>
                              <p className="text-xs text-gold-100/50 mt-0.5">
                                {carer.city} •{" "}
                                {carer.experience || "No experience listed"}{" "}
                                Experience
                              </p>
                            </div>

                            {/* Matching Scores Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gold-300/5">
                              <div className="rounded-lg bg-gold-DEFAULT/5 border border-gold-DEFAULT/15 px-3 py-1.5 text-center">
                                <span className="block text-[8px] font-bold text-gold/60 uppercase">
                                  Total Match
                                </span>
                                <span className="text-sm font-black text-gold">
                                  {totalScore}%
                                </span>
                              </div>
                              <div className="rounded-lg bg-blue-500/5 border border-blue-500/15 px-3 py-1.5 text-center">
                                <span className="block text-[8px] font-bold text-blue-400/60 uppercase">
                                  Location
                                </span>
                                <span className="text-sm font-black text-blue-400">
                                  {scoreBreakdown.location || 0}%
                                </span>
                              </div>
                              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-3 py-1.5 text-center">
                                <span className="block text-[8px] font-bold text-emerald-400/60 uppercase">
                                  Specialty
                                </span>
                                <span className="text-sm font-black text-emerald-400">
                                  {scoreBreakdown.specialty || 0}%
                                </span>
                              </div>
                              <div className="rounded-lg bg-purple-500/5 border border-purple-500/15 px-3 py-1.5 text-center">
                                <span className="block text-[8px] font-bold text-purple-400/60 uppercase">
                                  Availability
                                </span>
                                <span className="text-sm font-black text-purple-400">
                                  {scoreBreakdown.availability || 0}%
                                </span>
                              </div>
                            </div>

                            {/* Specialties */}
                            {carer.careSpecialties &&
                              carer.careSpecialties.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-[10px] uppercase font-bold text-gold-200/40 tracking-wider">
                                    Care Specialties
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {carer.careSpecialties.map((spec: string) => (
                                      <span
                                        key={spec}
                                        className="rounded bg-navy-950 px-2 py-0.5 text-[10px] text-gold-200/80 border border-gold-300/5"
                                      >
                                        {spec}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                          <Button
                            onClick={() => setViewingCarer(suggestion)}
                            variant="ghost-gold"
                            size="sm"
                            fullWidth
                            className="flex items-center justify-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Profile
                          </Button>
                          <Button
                            onClick={() => handleAssign(carer.userId, fullName)}
                            disabled={assigningId !== null}
                            variant="primary"
                            size="sm"
                            fullWidth
                            className="flex items-center justify-center gap-1.5"
                          >
                            {assigningId === carer.userId ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Assign
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* --- DETAILED CARER PROFILE VIEW MODAL OVERLAY --- */}
      {viewingCarer &&
        (() => {
          const { carer, scoreBreakdown, totalScore } = viewingCarer;
          const fullName = `${carer.firstName} ${carer.lastName}`;
          const photoUrl = getFullUrl(carer.profilePhotoUrl);
          const deepDetails = getFullCarerDetails(carer.id);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-xl rounded-2xl border border-gold-300/20 bg-navy-900 p-6 shadow-elegant space-y-4">
                <div className="flex justify-between items-center border-b border-gold-300/10 pb-4">
                  <div className="flex gap-3 items-center">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={fullName}
                        className="h-10 w-10 rounded-full object-cover border border-gold-300/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-DEFAULT">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-bold text-gold-50">
                        {fullName}
                      </h4>
                      <p className="text-xs text-gold-100/50">
                        Carer Profile Dossier
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingCarer(null)}
                    className="text-lg text-gold-200 hover:text-gold-50"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-[450px] overflow-y-auto pr-1 space-y-5 scrollbar-thin">
                  {/* Matching Scores Section */}
                  <div className="bg-navy-950/60 p-4 rounded-xl border border-gold-300/5 space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-gold-300/5 pb-2 text-xs font-bold text-gold uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      Compatibility Scores
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center p-2 rounded-lg bg-gold-DEFAULT/5 border border-gold-DEFAULT/10">
                        <span className="block text-[8px] text-gold-100/40 uppercase font-black">
                          Total
                        </span>
                        <span className="text-lg font-black text-gold">
                          {totalScore}%
                        </span>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <span className="block text-[8px] text-blue-400/40 uppercase font-black">
                          Location
                        </span>
                        <span className="text-lg font-black text-blue-400">
                          {scoreBreakdown.location || 0}%
                        </span>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <span className="block text-[8px] text-emerald-400/40 uppercase font-black">
                          Specialty
                        </span>
                        <span className="text-lg font-black text-emerald-400">
                          {scoreBreakdown.specialty || 0}%
                        </span>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                        <span className="block text-[8px] text-purple-400/40 uppercase font-black">
                          Availability
                        </span>
                        <span className="text-lg font-black text-purple-400">
                          {scoreBreakdown.availability || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* General Specifications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gold-100/40 uppercase font-semibold">
                        City / Location
                      </span>
                      <p className="text-sm font-medium text-gold-100">
                        {carer.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gold-100/40 uppercase font-semibold">
                        Experience Level
                      </span>
                      <p className="text-sm font-medium text-gold-100">
                        {carer.experience || "Not listed"}
                      </p>
                    </div>
                    {carer.pincode && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-gold-100/40 uppercase font-semibold">
                          Postcode
                        </span>
                        <p className="text-sm font-medium text-gold-100">
                          {carer.pincode}
                        </p>
                      </div>
                    )}
                    {deepDetails && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-gold-100/40 uppercase font-semibold">
                          DBS Background
                        </span>
                        <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          {deepDetails.dbsStatus}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact info from deep details (if cross referenced successfully) */}
                  {deepDetails && (
                    <div className="bg-navy-950/20 p-4 rounded-xl border border-gold-300/5 space-y-3">
                      <div className="text-xs font-bold text-gold-200/60 uppercase tracking-wider pb-2 border-b border-gold-300/5">
                        Verification & Contacts
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <p className="flex items-center gap-2 text-gold-100/80">
                          <Mail className="w-4 h-4 text-gold/60 shrink-0" />
                          <span className="truncate">{deepDetails.email}</span>
                        </p>
                        <p className="flex items-center gap-2 text-gold-100/80">
                          <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                          <span>{deepDetails.phone}</span>
                        </p>
                        <p className="col-span-1 sm:col-span-2 flex items-center gap-2 text-gold-100/80">
                          <Clock className="w-4 h-4 text-gold/60 shrink-0" />
                          <span>Schedule: {deepDetails.availability}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Specialties List */}
                  {carer.careSpecialties &&
                    carer.careSpecialties.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-gold-100/40 uppercase font-semibold">
                          Practitioner Specialties
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {carer.careSpecialties.map((spec: string) => (
                            <span
                              key={spec}
                              className="rounded-lg bg-navy-950 px-3 py-1 text-xs text-gold-200 border border-gold-300/5"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-gold-300/10">
                  <Button
                    onClick={() => setViewingCarer(null)}
                    variant="primary"
                    size="sm"
                    fullWidth={false}
                  >
                    Close Profile
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
