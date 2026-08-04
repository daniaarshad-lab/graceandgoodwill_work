import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadProfileMedia } from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import SectionCard from "./shared/SectionCard";
import {
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Video,
  FileVideo,
} from "lucide-react";

interface OnboardingProfileSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function OnboardingProfileSetup({
  onComplete,
  onBack,
}: OnboardingProfileSetupProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.carer.profile);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);

  const existingPhotoUrl = profile?.profilePhotoUrl;
  const existingVideoUrl = profile?.introVideoUrl;

  const displayPhotoUrl =
    photoPreview ||
    (existingPhotoUrl
      ? getFullPhotoUrl(existingPhotoUrl, profile?.updatedAt)
      : null);

  function getFullPhotoUrl(url: string | null | undefined, updatedAt?: string) {
    if (!url) return "";
    let finalUrl = url;
    if (!url.startsWith("http")) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      let baseUrl = apiUrl;
      try {
        baseUrl = new URL(apiUrl).origin;
      } catch (e) {
        baseUrl = apiUrl.replace(/\/api\/?$/, "");
      }
      const cleanPath = url.startsWith("/") ? url : `/${url}`;
      finalUrl = `${baseUrl}${cleanPath}`;
    }

    if (
      updatedAt &&
      !finalUrl.startsWith("blob:") &&
      !finalUrl.includes("X-Amz-Signature") &&
      !finalUrl.includes("Signature=") &&
      !finalUrl.includes("Amz-Credential") &&
      !finalUrl.includes("X-Amz-")
    ) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl += `${separator}t=${new Date(updatedAt).getTime()}`;
    }
    return finalUrl;
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      showErrorToast(
        "Invalid Format",
        "Only JPEG, PNG, WEBP and GIF images are allowed.",
      );
      e.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    const validExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      showErrorToast(
        "Invalid Format",
        "Only MP4, WebM, OGG and QuickTime videos are allowed.",
      );
      e.target.value = "";
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;

      if (duration < 45 || duration > 60) {
        showErrorToast(
          "Invalid Video Duration",
          `Your video duration is ${Math.round(
            duration,
          )} seconds. It must be between 45 seconds and 60 seconds (1 minute) maximum.`,
        );
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      setVideoFile(file);
      setVideoDuration(duration);
      setVideoUploaded(true);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleSaveAndContinue = async () => {
    if (!photoFile && !videoFile) {
      if (existingPhotoUrl && existingVideoUrl) {
        onComplete();
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        uploadProfileMedia({
          photo: photoFile || undefined,
          video: videoFile || undefined,
        }),
      ).unwrap();

      showSuccessToast("Success", "Profile media uploaded successfully!");
      onComplete();
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "string" ? err : "Failed to upload profile media";
      showErrorToast("Upload Failed", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    (!!photoFile || !!existingPhotoUrl) && (!!videoFile || !!existingVideoUrl);

  return (
    <div className="space-y-6">
      {/* Navigation Row */}
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gold-300/10 bg-navy-900/30 backdrop-blur-md text-gold-200/80 text-[12.5px] font-medium tracking-wide hover:bg-navy-800/40 hover:border-gold-300/20 hover:text-gold-50 hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(212,175,55,0.05)] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gold-DEFAULT/30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          disabled={!isFormValid || isSubmitting}
          className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-gradient-to-b from-gold-200 to-gold-200/80 border border-gold-200/20 text-navy-950 text-[12.5px] font-semibold tracking-wide shadow-[0_2px_8px_rgba(245,212,160,0.15)] hover:shadow-[0_4px_12px_rgba(245,212,160,0.25)] hover:-translate-y-[1px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gold-200/50 disabled:opacity-50 disabled:hover:transform-none disabled:hover:shadow-none ml-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </span>
          ) : (
            <>
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <SectionCard className="max-w-3xl mx-auto space-y-8 p-6 md:p-8 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
        <div className="text-center md:text-left border-b border-gold-300/10 pb-4">
          <h3 className="text-xl font-bold text-gold-200">
            Upload Profile Media
          </h3>
          <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
            Families and clients love matching with carers they can see and
            hear. Provide a professional photo and a short introductory video.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo Upload Zone */}
          <div className="flex flex-col items-center p-6 rounded-2xl bg-navy-950/40 border border-gold-300/5 text-center space-y-4">
            <h4 className="text-sm font-semibold text-gold-50">
              Profile Picture
            </h4>

            <label className="relative group cursor-pointer block">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT transition-transform duration-300 group-hover:scale-105 shadow-soft">
                {displayPhotoUrl ? (
                  <img
                    src={displayPhotoUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gold-DEFAULT/55" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">
                    CHANGE PHOTO
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={isSubmitting}
              />
            </label>

            <p className="text-[11px] text-gold-100/40 leading-normal max-w-xs">
              Upload a professional, friendly, high-resolution headshot.
              <br />
              Supported formats: JPEG, PNG, WEBP and GIF.
            </p>
            {(photoFile || existingPhotoUrl) && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check className="w-3 h-3" /> Photo Selected
              </span>
            )}
          </div>

          {/* Video Upload Zone */}
          <div className="flex flex-col items-center p-6 rounded-2xl bg-navy-950/40 border border-gold-300/5 text-center space-y-4">
            <h4 className="text-sm font-semibold text-gold-50">
              Introduction Video
            </h4>

            <div
              onClick={() => !isSubmitting && videoInputRef.current?.click()}
              className={`h-32 w-full max-w-[200px] border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                videoUploaded || existingVideoUrl
                  ? "bg-gold-DEFAULT/5 border-gold-DEFAULT text-gold-DEFAULT"
                  : "border-gold-muted/20 hover:border-gold-DEFAULT/50 text-gold-muted/40"
              }`}
            >
              {videoUploaded ? (
                <div className="flex flex-col items-center space-y-2">
                  <FileVideo className="w-8 h-8 text-gold-DEFAULT" />
                  <span className="text-[10px] font-bold text-emerald-400 text-center px-2 truncate w-full">
                    {videoFile?.name || "Video Selected"}
                  </span>
                  {videoDuration && (
                    <span className="text-[9px] text-gold-200/60">
                      Duration: {Math.round(videoDuration)}s
                    </span>
                  )}
                </div>
              ) : existingVideoUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <FileVideo className="w-8 h-8 text-gold-DEFAULT" />
                  <span className="text-[10px] font-bold text-emerald-400">
                    Video Uploaded
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Video className="w-8 h-8 text-gold-DEFAULT/55 animate-pulse" />
                  <span className="text-[10px] font-bold">Select Video</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              className="hidden"
              onChange={handleVideoChange}
              disabled={isSubmitting}
            />

            <div className="flex items-start gap-1.5 text-left max-w-xs">
              <AlertCircle className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0 mt-0.5" />
              <p className="text-[10px] text-gold-100/40 leading-normal">
                Self-record a short profile introduction.
                <br />
                Supported formats: MP4, WebM, OGG and QuickTime.
                <br />
                Video length must be exactly{" "}
                <strong className="text-gold-300">45 to 60 seconds</strong>.
              </p>
            </div>
            {(videoUploaded || existingVideoUrl) && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check className="w-3 h-3" /> Video Selected
              </span>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
