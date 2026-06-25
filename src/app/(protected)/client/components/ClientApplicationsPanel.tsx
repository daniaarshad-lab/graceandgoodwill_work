"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCareRequests,
  fetchClientCareRequestApplications,
  clearApplications,
} from "@/store/slices/clientSlice";
import { CareRequest, CareRequestApplication } from "@/types/client.types";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import {
  AlertCircle,
  RefreshCw,
  Users,
  Calendar,
  Clock,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronRight,
  UserCircle
} from "lucide-react";

export default function ClientApplicationsPanel() {
  const dispatch = useAppDispatch();
  const {
    careRequests,
    loading: careRequestsLoading,
    applications,
    applicationsLoading,
    applicationsError,
  } = useAppSelector((state) => state.client);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCareRequests());
  }, [dispatch]);

  // Only show client-managed care requests (adminMatching = false)
  const clientManagedRequests = careRequests.filter(
    (req) => !req.adminMatching
  );

  useEffect(() => {
    if (selectedRequestId) {
      dispatch(fetchClientCareRequestApplications(selectedRequestId));
    } else {
      dispatch(clearApplications());
    }
  }, [selectedRequestId, dispatch]);

  const handleSelectRequest = (id: string) => {
    if (selectedRequestId === id) {
      setSelectedRequestId(null);
    } else {
      setSelectedRequestId(id);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (careRequestsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-DEFAULT"></div>
        <p className="text-sm text-gold-100/60">Loading care requests...</p>
      </div>
    );
  }

  return (
    <SectionCard className="space-y-6">
      <div className="flex items-start justify-between border-b border-gold-300/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gold-200">
            Carer Applications
          </h3>
          <p className="text-xs text-gold-100/50 mt-1">
            View applications for your Client-Managed care requests. Grace & Goodwill
            managed requests will have their matches handled by our team.
          </p>
        </div>
        <Button
          variant="ghost-gold"
          size="sm"
          fullWidth={false}
          onClick={() => {
            dispatch(fetchCareRequests());
            if (selectedRequestId) {
              dispatch(fetchClientCareRequestApplications(selectedRequestId));
            }
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {clientManagedRequests.length === 0 ? (
        <div className="rounded-2xl border border-gold-300/10 p-12 text-center text-gold-100/50">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-medium">
            You do not have any active client-managed care requests.
          </p>
          <p className="text-xs mt-1 opacity-60">
            Create a new care request and set "Grace & Goodwill Managed" to false to manage applications directly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {clientManagedRequests.map((req) => (
            <div
              key={req.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                selectedRequestId === req.id
                  ? "border-gold-300/30 bg-navy-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  : "border-gold-300/10 bg-navy-900/40 hover:border-gold-300/20 hover:bg-navy-900/60"
              }`}
            >
              {/* Request Header (Clickable) */}
              <div
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => handleSelectRequest(req.id)}
              >
                <div>
                  <h4 className="text-base font-bold text-gold-200">
                    {req.careCategory || "Care Request"}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gold-100/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-200/40" />
                      <span>{formatDate(req.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-200/40" />
                      <span>{req.duration || "Ongoing"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        req.status === "ACTIVE" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : req.status === "FULFILLED"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-200 bg-navy-950 px-3 py-1.5 rounded-lg border border-gold-300/10">
                    <Users className="w-3.5 h-3.5 text-gold-DEFAULT" />
                    View Applications
                  </div>
                  {selectedRequestId === req.id ? (
                    <ChevronDown className="w-5 h-5 text-gold-200/60" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gold-200/60" />
                  )}
                </div>
              </div>

              {/* Applications List */}
              {selectedRequestId === req.id && (
                <div className="border-t border-gold-300/10 bg-navy-950/30 p-5">
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-DEFAULT mr-3"></div>
                      <p className="text-sm text-gold-100/60">Loading applications...</p>
                    </div>
                  ) : applicationsError ? (
                    <div className="flex items-center justify-center py-8 text-red-400">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <p className="text-sm">{applicationsError}</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <UserCircle className="w-10 h-10 mx-auto mb-3 text-gold-100/20" />
                      <p className="text-sm text-gold-100/50">No applications received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-start justify-between rounded-xl bg-navy-900 border border-gold-300/5 p-4 hover:border-gold-300/15 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {app.carerProfile?.profilePhotoUrl ? (
                              <img
                                src={app.carerProfile.profilePhotoUrl}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border border-gold-300/20"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-navy-800 border border-gold-300/10 flex items-center justify-center shrink-0">
                                <UserCircle className="w-6 h-6 text-gold-100/30" />
                              </div>
                            )}
                            <div>
                              <h5 className="text-sm font-bold text-gold-100">
                                {app.carerProfile?.user?.firstName || "Carer"}{" "}
                                {app.carerProfile?.user?.lastName || ""}
                              </h5>
                              <p className="text-xs text-gold-100/50 mt-1 line-clamp-2">
                                {app.carerProfile?.bio || "No bio provided."}
                              </p>
                              
                              <div className="flex items-center gap-3 mt-2 text-[10px] text-gold-100/40">
                                <span>Applied: {formatDate(app.createdAt)}</span>
                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  app.status === "PENDING"
                                    ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                    : app.status === "SHORTLISTED"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : app.status === "ACCEPTED"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button
                              variant="ghost-gold"
                              size="sm"
                              fullWidth={false}
                              onClick={() => {
                                // In a real implementation, this might open a modal with the carer's full profile
                                alert("View Full Profile functionality to be implemented");
                              }}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
