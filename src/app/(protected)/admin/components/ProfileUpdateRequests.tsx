import { useState, useEffect } from "react";
import { Check, X, FileVideo, Image as ImageIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Button from "@/components/Button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getFullMediaUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCarers, setExpandedCarers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProfileUpdateRequests();
      // Show pending first, then sort by date
      const sorted = data.sort((a: any, b: any) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setRequests(sorted);
    } catch (err: any) {
      showErrorToast("Error", "Failed to fetch profile update requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.updateProfileUpdateRequestStatus(id, "APPROVED");
      showSuccessToast("Approved", "The profile update request has been approved.");
      fetchRequests();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to approve request.");
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (!rejectionReason.trim()) {
      showErrorToast("Error", "Please provide a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.updateProfileUpdateRequestStatus(rejectingId, "REJECTED", rejectionReason);
      showSuccessToast("Rejected", "The profile update request has been rejected.");
      setRejectingId(null);
      setRejectionReason("");
      fetchRequests();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to reject request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gold-100/60 font-semibold">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gold-200">Carer Profile Updates</h2>
          <p className="text-sm text-gold-100/60 mt-1">
            Review and approve requests for profile picture or introduction video changes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-gold-300/10 bg-navy-900/40 p-12 flex flex-col items-center text-center">
            <ImageIcon className="w-12 h-12 text-gold-100/20 mb-4" />
            <h3 className="text-lg font-semibold text-gold-100 mb-2">No Requests Found</h3>
            <p className="text-sm text-gold-100/50">There are currently no profile update requests.</p>
          </div>
        ) : (
          (() => {
            // Group requests by carer
            const groupedRequests = requests.reduce((acc, req) => {
              const carerId = req.carerProfile?.id || req.carerId || req.id; 
              if (!acc[carerId]) {
                acc[carerId] = {
                  carerName: `${req.carerProfile?.user?.firstName || "Unknown"} ${req.carerProfile?.user?.lastName || "Carer"}`.trim(),
                  requests: []
                };
              }
              acc[carerId].requests.push(req);
              return acc;
            }, {} as Record<string, { carerName: string, requests: any[] }>);

            const toggleCarer = (carerId: string) => {
              setExpandedCarers(prev => ({ ...prev, [carerId]: !prev[carerId] }));
            };

            return Object.entries(groupedRequests).map(([carerId, groupValue]) => {
              const group = groupValue as { carerName: string; requests: any[] };
              // Default to expanded if there is any pending request, otherwise check state
              const hasPending = group.requests.some((r: any) => r.status === "PENDING");
              const isExpanded = expandedCarers[carerId] !== undefined ? expandedCarers[carerId] : hasPending;
              const pendingCount = group.requests.filter((r: any) => r.status === "PENDING").length;

              return (
                <div key={carerId} className="rounded-2xl border border-gold-300/10 bg-navy-900 overflow-hidden transition-all shadow-soft">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gold-300/5 transition-colors"
                    onClick={() => toggleCarer(carerId)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <h3 className="text-lg font-bold text-gold-50">{group.carerName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gold-100/50">{group.requests.length} Total Request{group.requests.length !== 1 ? 's' : ''}</span>
                        {pendingCount > 0 && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {pendingCount} Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gold-100/50" /> : <ChevronDown className="w-5 h-5 text-gold-100/50" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6 pt-4 border-t border-gold-300/10 bg-navy-900/40">
                      <div className="flex flex-col gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {group.requests.map((req: any, index: number) => {
                        const hasRequestedPhoto = req.isChangeProfilePic && req.pendingProfilePhotoUrl;
                        const hasRequestedVideo = req.isChangeIntroVideo && req.pendingIntroVideoUrl;
                        
                        return (
                          <div key={req.id} className="relative rounded-xl border border-gold-300/10 bg-navy-950 p-6 flex flex-col gap-6">
                            
                            {/* Header block for specific request */}
                            <div className="flex items-center justify-between border-b border-gold-300/10 pb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gold-200">Request #{group.requests.length - index}</span>
                                {getStatusBadge(req.status)}
                              </div>
                              <span className="text-xs text-gold-100/50 text-right">
                                Submitted: {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                              </span>
                            </div>

                            {/* CURRENT APPROVED MEDIA */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-100/60 mb-4">CURRENT APPROVED MEDIA</h4>
                              <div className="flex flex-wrap gap-6">
                                <div className="flex flex-col gap-2">
                                  <span className="text-[10px] font-semibold text-gold-200/50 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" /> Profile Photo
                                  </span>
                                  {req.carerProfile?.profilePhotoUrl ? (
                                    <a href={getFullMediaUrl(req.carerProfile.profilePhotoUrl)} target="_blank" rel="noreferrer" className="block w-20 h-20 rounded-xl overflow-hidden border border-navy-800 hover:opacity-80 transition">
                                      <img src={getFullMediaUrl(req.carerProfile.profilePhotoUrl)} alt="Current profile" className="w-full h-full object-cover" />
                                    </a>
                                  ) : (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-navy-800 bg-navy-950 flex items-center justify-center">
                                      <span className="text-[9px] text-gold-100/30">No Photo</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <span className="text-[10px] font-semibold text-gold-200/50 flex items-center gap-1">
                                    <FileVideo className="w-3 h-3" /> Introduction Video
                                  </span>
                                  {req.carerProfile?.introVideoUrl ? (
                                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-navy-800 bg-black flex items-center justify-center">
                                      <video src={getFullMediaUrl(req.carerProfile.introVideoUrl)} className="w-full h-full object-cover" controls controlsList="nodownload" />
                                    </div>
                                  ) : (
                                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-navy-800 bg-navy-950 flex items-center justify-center">
                                      <span className="text-[9px] text-gold-100/30">No Video</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <hr className="border-gold-300/10" />

                            {/* REQUESTED UPDATE */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                                REQUESTED UPDATE
                                <div className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</div>
                              </h4>
                              <div className="flex flex-wrap gap-6">
                                {hasRequestedPhoto && (
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold text-emerald-200/80 flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" /> Pending Profile Photo
                                    </span>
                                    <a href={getFullMediaUrl(req.pendingProfilePhotoUrl)} target="_blank" rel="noreferrer" className="block w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500/40 shadow-lg hover:opacity-80 transition">
                                      <img src={getFullMediaUrl(req.pendingProfilePhotoUrl)} alt="New profile" className="w-full h-full object-cover" />
                                    </a>
                                  </div>
                                )}
                                
                                {hasRequestedVideo && (
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold text-emerald-200/80 flex items-center gap-1">
                                      <FileVideo className="w-3 h-3" /> Pending Intro Video
                                    </span>
                                    <div className="w-40 h-24 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-black shadow-lg flex items-center justify-center">
                                      <video src={getFullMediaUrl(req.pendingIntroVideoUrl)} className="w-full h-full object-cover" controls controlsList="nodownload" />
                                    </div>
                                  </div>
                                )}

                                {!hasRequestedPhoto && !hasRequestedVideo && (
                                  <p className="text-sm text-gold-100/50">No new media uploaded.</p>
                                )}
                              </div>
                            </div>

                            <hr className="border-gold-300/10" />

                            {/* Request Summary */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-100/60 mb-3">Request Summary</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center justify-between p-3.5 rounded-xl border border-gold-300/10 bg-navy-900/60 shadow-sm">
                                  <span className="text-sm font-medium text-gold-100/90">Photo Change</span>
                                  {hasRequestedPhoto ? (
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-sm"><Check className="w-4 h-4 text-emerald-400" /></div>
                                  ) : (
                                    <div className="w-7 h-7 rounded-lg bg-navy-800/80 flex items-center justify-center border border-gold-300/10"><X className="w-4 h-4 text-gold-100/30" /></div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between p-3.5 rounded-xl border border-gold-300/10 bg-navy-900/60 shadow-sm">
                                  <span className="text-sm font-medium text-gold-100/90">Video Change</span>
                                  {hasRequestedVideo ? (
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-sm"><Check className="w-4 h-4 text-emerald-400" /></div>
                                  ) : (
                                    <div className="w-7 h-7 rounded-lg bg-navy-800/80 flex items-center justify-center border border-gold-300/10"><X className="w-4 h-4 text-gold-100/30" /></div>
                                  )}
                                </div>
                              </div>
                              
                              {req.reason && (
                                <div className="mt-4 p-3 rounded-lg bg-navy-900/80 border border-gold-300/10">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-200/50 block mb-1">Reason provided by carer:</span>
                                  <p className="text-sm text-gold-50 italic">"{req.reason}"</p>
                                </div>
                              )}

                              {req.status === "REJECTED" && req.rejectionReason && (
                                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200/90 text-sm">
                                  <span className="font-semibold text-rose-300 block mb-1 text-[10px] uppercase tracking-wider">Rejection Reason:</span> 
                                  {req.rejectionReason}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            {req.status === "PENDING" && (
                              <>
                                <hr className="border-gold-300/10" />
                                <div className="flex gap-3">
                                  <Button
                                    variant="primary"
                                    className="flex-1 flex justify-center items-center gap-2"
                                    onClick={() => handleApprove(req.id)}
                                  >
                                    <Check className="w-4 h-4" /> Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 flex justify-center items-center gap-2 text-rose-400 hover:text-rose-300 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10"
                                    onClick={() => setRejectingId(req.id)}
                                  >
                                    <X className="w-4 h-4" /> Reject
                                  </Button>
                                </div>
                              </>
                            )}

                          </div>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()
        )}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-navy-900 border border-gold-300/20 rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-rose-400 mb-2">Reject Request</h3>
            <p className="text-sm text-gold-100/70 mb-4">
              Please provide a reason for rejecting this media update. This will be shown to the carer.
            </p>
            
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. The photo is too blurry, or the video contains inappropriate content."
              className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-rose-500/50 transition text-sm mb-6"
            />
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                disabled={isSubmitting || !rejectionReason.trim()}
                className="bg-rose-600 hover:bg-rose-500 text-white"
              >
                {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
