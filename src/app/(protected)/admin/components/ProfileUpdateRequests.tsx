import { useState, useEffect } from "react";
import { Check, X, FileVideo, Image as ImageIcon, Clock } from "lucide-react";
import { adminService } from "@/services/admin/admin.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import Button from "@/components/Button";

export default function ProfileUpdateRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          requests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-gold-300/10 bg-navy-900 p-6 flex flex-col md:flex-row gap-6 justify-between transition-all hover:border-gold-300/30">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gold-50">
                    {req.carerProfile?.user?.firstName} {req.carerProfile?.user?.lastName}
                  </h3>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-gold-100/50 mb-4">
                  Submitted on {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                </p>
                
                <div className="flex gap-4">
                  {req.hasPhoto && req.photoUrl && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-gold-200 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> New Photo
                      </span>
                      <a href={req.photoUrl} target="_blank" rel="noreferrer" className="block w-24 h-24 rounded-xl overflow-hidden border-2 border-navy-950 shadow hover:opacity-80 transition">
                        <img src={req.photoUrl} alt="New profile" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  )}
                  
                  {req.hasVideo && req.videoUrl && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-gold-200 flex items-center gap-1">
                        <FileVideo className="w-3.5 h-3.5" /> New Video
                      </span>
                      <div className="w-40 h-24 rounded-xl overflow-hidden border-2 border-navy-950 bg-black shadow flex items-center justify-center">
                        <video src={req.videoUrl} className="w-full h-full object-cover" controls controlsList="nodownload" />
                      </div>
                    </div>
                  )}
                </div>
                
                {req.status === "REJECTED" && req.rejectionReason && (
                  <div className="mt-4 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-200/90 rounded p-3">
                    <span className="font-semibold text-rose-300 block mb-1">Rejection Reason:</span> 
                    {req.rejectionReason}
                  </div>
                )}
              </div>

              {req.status === "PENDING" && (
                <div className="flex flex-col gap-2 shrink-0 md:w-32 justify-center border-t md:border-t-0 md:border-l border-gold-300/10 pt-4 md:pt-0 md:pl-6">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full flex justify-center items-center gap-1.5"
                    onClick={() => handleApprove(req.id)}
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex justify-center items-center gap-1.5 text-rose-400 hover:text-rose-300 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10"
                    onClick={() => setRejectingId(req.id)}
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))
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
