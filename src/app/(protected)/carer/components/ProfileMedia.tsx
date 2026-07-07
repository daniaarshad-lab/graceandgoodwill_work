import { useState, useEffect, useRef } from "react";
import SectionCard from "./shared/SectionCard";
import { Camera, Video, CheckCircle2, AlertCircle, X, Clock, Upload, XCircle, FileVideo, Image as ImageIcon } from "lucide-react";
import Button from "@/components/Button";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { carerService } from "@/services/carer/carer.service";

interface ProfileMediaProps {
  profilePhotoUrl?: string | null;
  introVideoUrl?: string | null;
}

export default function ProfileMedia({
  profilePhotoUrl,
  introVideoUrl,
}: ProfileMediaProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await carerService.getProfileUpdateRequests();
      // Sort by newest first
      const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(sorted);
    } catch (err: any) {
      console.error("Failed to fetch profile update requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const hasPendingRequest = requests.some((req) => req.status === "PENDING");

  const handleSendRequest = async () => {
    if (!photoFile && !videoFile) {
      showErrorToast("Validation Error", "Please select at least a photo or video to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      await carerService.submitProfileUpdateRequest(photoFile || undefined, videoFile || undefined);
      showSuccessToast("Request Submitted", "Your media update request has been submitted successfully.");

      setModalOpen(false);
      setPhotoFile(null);
      setVideoFile(null);

      await fetchRequests();
    } catch (err: any) {
      showErrorToast("Update Failed", err.message || "Failed to submit profile update request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPhotoFile(null);
    setVideoFile(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "REJECTED": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "REJECTED": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <SectionCard className="w-full space-y-6 mt-6">
        <div className="border-b border-gold-300/10 pb-4 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold text-gold-200">Media</h3>
            <p className="text-xs text-gold-100/60 mt-1">
              Your profile picture and introduction video
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            disabled={hasPendingRequest || loadingRequests}
            className={hasPendingRequest ? "opacity-50 cursor-not-allowed" : ""}
          >
            {hasPendingRequest ? (
              <>
                <Clock className="w-3.5 h-3.5 mr-1.5" /> Request Pending
              </>
            ) : (
              "Request Update"
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture Card */}
          <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center shadow-soft">
            <h4 className="text-sm font-semibold text-gold-50 mb-6">Current Profile Picture</h4>

            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gold-DEFAULT/10 rounded-full animate-pulse-slow"></div>
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-navy-950 shadow-xl z-10 relative"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-navy-950 flex flex-col items-center justify-center border-4 border-navy-950 shadow-xl z-10 relative">
                  <Camera className="w-8 h-8 text-gold-DEFAULT/40" />
                  <span className="text-[10px] text-gold-DEFAULT/40 mt-2 font-medium tracking-wider">NO PHOTO</span>
                </div>
              )}
            </div>
          </div>

          {/* Introduction Video Card */}
          <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center shadow-soft">
            <h4 className="text-sm font-semibold text-gold-50 mb-6">Current Introduction Video</h4>

            <div className="w-full max-w-[240px] h-32 mb-6 rounded-2xl border-2 border-dashed border-gold-DEFAULT/20 bg-navy-950/50 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-gold-DEFAULT/40 transition-colors">
              {introVideoUrl ? (
                <video
                  src={introVideoUrl}
                  className="w-full h-full object-cover opacity-80"
                  controlsList="nodownload"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Video className="w-8 h-8 text-gold-DEFAULT/40 mb-2" />
                  <span className="text-[10px] text-gold-DEFAULT/40 font-medium tracking-wider">NO VIDEO</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previous Requests Section */}
        {requests.length > 0 && (
          <div className="pt-6 border-t border-gold-300/10 space-y-4">
            <h4 className="text-sm font-semibold text-gold-200">Request History</h4>
            <div className="grid grid-cols-1 gap-3">
              {requests.map((req) => (
                <div key={req.id} className="bg-navy-950/60 rounded-xl border border-gold-300/10 p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <p className="text-sm text-gold-50 font-medium flex items-center gap-2">
                      Media Update Request
                      {req.hasPhoto && <ImageIcon className="w-3.5 h-3.5 text-gold-300/70" />}
                      {req.hasVideo && <FileVideo className="w-3.5 h-3.5 text-gold-300/70" />}
                    </p>
                    <p className="text-[11px] text-gold-100/50 mt-1">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    {req.status === "REJECTED" && req.rejectionReason && (
                      <div className="mt-2 text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-200/90 rounded p-2">
                        <span className="font-semibold text-rose-300">Reason:</span> {req.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center justify-center gap-1.5 font-medium text-[11px] px-3 py-1.5 rounded-full border ${getStatusColor(req.status)} shrink-0`}>
                    {getStatusIcon(req.status)} {req.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-navy-900 border border-gold-300/20 rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gold-100/50 hover:text-gold-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-gold-DEFAULT" />
              </div>
              <h3 className="text-xl font-serif text-gold-50 mb-3">
                Update Profile Media
              </h3>
              <p className="text-sm text-gold-100/70 leading-relaxed mb-6">
                Please upload your new profile picture and/or introduction video. An admin will review and approve your request.
              </p>

              <div className="w-full text-left space-y-6 mb-8">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    New Profile Picture <span className="text-gold-100/50 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gold-300/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-navy-950/30 hover:bg-navy-950/60 cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={photoInputRef}
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                    <ImageIcon className="w-6 h-6 text-gold-300/40" />
                    <p className="text-xs text-gold-100/60">
                      {photoFile ? <span className="text-gold-200 font-medium">{photoFile.name}</span> : "Click to select a photo"}
                    </p>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    New Introduction Video <span className="text-gold-100/50 text-[10px] font-normal">(Optional)</span>
                  </label>
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gold-300/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-navy-950/30 hover:bg-navy-950/60 cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={videoInputRef}
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                    <FileVideo className="w-6 h-6 text-gold-300/40" />
                    <p className="text-xs text-gold-100/60">
                      {videoFile ? <span className="text-gold-200 font-medium">{videoFile.name}</span> : "Click to select a video"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSendRequest}
                  disabled={isSubmitting || (!photoFile && !videoFile)}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
