import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import { Camera, Video, CheckCircle2, AlertCircle, X, Clock } from "lucide-react";
import Button from "@/components/Button";
import { showSuccessToast } from "@/utils/toast";

interface ProfileMediaProps {
  profilePhotoUrl?: string | null;
  introVideoUrl?: string | null;
}

export default function ProfileMedia({
  profilePhotoUrl,
  introVideoUrl,
}: ProfileMediaProps) {
  const [modalType, setModalType] = useState<"" | "Profile Picture" | "Introduction Video">("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const [photoUpdatePending, setPhotoUpdatePending] = useState(false);
  const [videoUpdatePending, setVideoUpdatePending] = useState(false);

  const handleSendRequest = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for the update.");
      return;
    }
    
    // Set pending state locally
    if (modalType === "Profile Picture") {
      setPhotoUpdatePending(true);
    } else if (modalType === "Introduction Video") {
      setVideoUpdatePending(true);
    }

    showSuccessToast("Your media update request has been submitted successfully.");

    setModalType("");
    setReason("");
    setError("");
  };

  const handleCloseModal = () => {
    setModalType("");
    setReason("");
    setError("");
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture Card */}
          <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center group transition-all duration-300 hover:border-gold-300/20 shadow-soft">
            <h4 className="text-sm font-semibold text-gold-50 mb-6">Profile Picture</h4>
            
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

            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-xs mb-6 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`w-full max-w-[200px] ${photoUpdatePending ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !photoUpdatePending && setModalType("Profile Picture")}
              disabled={photoUpdatePending}
            >
              {photoUpdatePending ? (
                <>
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> Request Pending
                </>
              ) : (
                "Request Update"
              )}
            </Button>
          </div>

          {/* Introduction Video Card */}
          <div className="bg-navy-900/40 p-6 rounded-2xl border border-gold-300/10 flex flex-col items-center text-center group transition-all duration-300 hover:border-gold-300/20 shadow-soft">
            <h4 className="text-sm font-semibold text-gold-50 mb-6">Introduction Video</h4>
            
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

            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-xs mb-6 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`w-full max-w-[200px] ${videoUpdatePending ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !videoUpdatePending && setModalType("Introduction Video")}
              disabled={videoUpdatePending}
            >
              {videoUpdatePending ? (
                <>
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> Request Pending
                </>
              ) : (
                "Request Update"
              )}
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* Informational Modal */}
      {modalType && (
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
                <AlertCircle className="w-6 h-6 text-gold-DEFAULT" />
              </div>
              <h3 className="text-xl font-serif text-gold-50 mb-3">
                Request Media Update
              </h3>
              <p className="text-sm text-gold-100/70 leading-relaxed mb-6">
                Changing your profile picture or introduction video requires administrator approval. Please tell us why you need to update your media.
              </p>

              <div className="w-full text-left space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    Media Type
                  </label>
                  <div className="w-full rounded-xl border border-gold-300/10 bg-navy-950/50 px-4 py-3 text-gold-100/70 text-sm font-medium cursor-not-allowed">
                    {modalType}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold-200">
                    Reason for Update *
                  </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Please explain why you would like to update your profile picture or introduction video."
                  className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
                    error ? "border-red-500" : "border-gray-300/20"
                  }`}
                ></textarea>
                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSendRequest}
                  disabled={!reason.trim()}
                >
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
