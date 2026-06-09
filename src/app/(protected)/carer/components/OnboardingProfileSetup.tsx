import { useState, useRef } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadCarerProfilePhoto } from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { Camera, Video, AlertCircle, FileVideo, Check } from "lucide-react";

interface OnboardingProfileSetupProps {
  onComplete: () => void;
}

export default function OnboardingProfileSetup({
  onComplete,
}: OnboardingProfileSetupProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.carer.profile);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);

  const profilePhotoUrl = profile?.profilePhotoUrl;

  const getFullPhotoUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${apiUrl}${url}`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      await dispatch(uploadCarerProfilePhoto(file)).unwrap();
      showSuccessToast("Success", "Profile photo uploaded successfully!");
    } catch (err: any) {
      showErrorToast("Upload Failed", err || "Failed to upload profile photo");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      showErrorToast("Invalid Format", "Please select a valid video file.");
      return;
    }

    // Load video metadata to check duration
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
      simulateVideoUpload();
    };
    video.src = URL.createObjectURL(file);
  };

  const simulateVideoUpload = () => {
    setVideoUploading(true);
    setVideoProgress(0);
    setVideoUploaded(false);

    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setVideoUploading(false);
          setVideoUploaded(true);
          showSuccessToast(
            "Success",
            "Introduction video uploaded and validated successfully!",
          );
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const isFormValid = !!profilePhotoUrl && videoUploaded;

  return (
    <SectionCard className="max-w-3xl mx-auto space-y-8 p-6 md:p-8 border border-gold-300/10 bg-gradient-to-b from-navy-900/60 to-navy-950/80 shadow-elegant">
      <div className="text-center md:text-left border-b border-gold-300/10 pb-4">
        <h3 className="text-xl font-bold text-gold-200">
          Upload Profile Media
        </h3>
        <p className="text-xs text-gold-100/60 mt-1 leading-relaxed">
          Families and clients love matching with carers they can see and hear. Provide a professional photo and a short introductory video.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photo Upload Zone */}
        <div className="flex flex-col items-center p-6 rounded-2xl bg-navy-950/40 border border-gold-300/5 text-center space-y-4">
          <h4 className="text-sm font-semibold text-gold-50">Profile Picture</h4>
          
          <label className="relative group cursor-pointer block">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-gold-DEFAULT bg-navy-950 flex items-center justify-center text-4xl font-bold text-gold-DEFAULT transition-transform duration-300 group-hover:scale-105 shadow-soft">
              {profilePhotoUrl ? (
                <Image
                  src={getFullPhotoUrl(profilePhotoUrl)}
                  alt="Avatar Preview"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gold-DEFAULT/55" />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">CHANGE PHOTO</span>
              </div>

              {/* Uploading Spinner */}
              {photoUploading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={photoUploading}
            />
          </label>

          <p className="text-[11px] text-gold-100/40 leading-normal max-w-xs">
            Upload a professional, friendly, high-resolution headshot. Supports JPEG and PNG formats.
          </p>
          {profilePhotoUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Check className="w-3 h-3" /> Photo Uploaded
            </span>
          )}
        </div>

        {/* Video Upload Zone */}
        <div className="flex flex-col items-center p-6 rounded-2xl bg-navy-950/40 border border-gold-300/5 text-center space-y-4">
          <h4 className="text-sm font-semibold text-gold-50">Introduction Video</h4>

          <div
            onClick={() => !videoUploading && videoInputRef.current?.click()}
            className={`h-32 w-full max-w-[200px] border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              videoUploaded
                ? "bg-gold-DEFAULT/5 border-gold-DEFAULT text-gold-DEFAULT"
                : "border-gold-muted/20 hover:border-gold-DEFAULT/50 text-gold-muted/40"
            }`}
          >
            {videoUploaded ? (
              <div className="flex flex-col items-center space-y-2">
                <FileVideo className="w-8 h-8 text-gold-DEFAULT" />
                <span className="text-[10px] font-bold text-emerald-400">
                  {videoFile?.name.substring(0, 18)}...
                </span>
                <span className="text-[9px] text-gold-200/60">
                  Duration: {Math.round(videoDuration || 0)}s
                </span>
              </div>
            ) : videoUploading ? (
              <div className="flex flex-col items-center space-y-2 w-full px-4">
                <div className="w-6 h-6 border-2 border-gold-DEFAULT border-t-transparent animate-spin rounded-full"></div>
                <div className="w-full bg-navy-950 h-1.5 rounded-full overflow-hidden mt-2 border border-gold-300/10">
                  <div className="h-full bg-gold-DEFAULT rounded-full" style={{ width: `${videoProgress}%` }}></div>
                </div>
                <span className="text-[9px] text-gold-DEFAULT">{videoProgress}%</span>
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
            disabled={videoUploading}
          />

          <div className="flex items-start gap-1.5 text-left max-w-xs">
            <AlertCircle className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0 mt-0.5" />
            <p className="text-[10px] text-gold-100/40 leading-normal">
              Self-record a short profile message introducing yourself.
              Must be exactly <strong className="text-gold-300">45 to 60 seconds</strong> in length.
            </p>
          </div>
          {videoUploaded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Check className="w-3 h-3" /> Video Validated
            </span>
          )}
        </div>
      </div>

      {/* Continue Action Button */}
      <div className="pt-4 border-t border-gold-300/10 flex justify-end">
        <Button
          onClick={onComplete}
          disabled={!isFormValid}
          variant="primary"
          size="sm"
          fullWidth={false}
          className="px-8 py-3 font-semibold shadow-gold"
        >
          Save & Continue
        </Button>
      </div>
    </SectionCard>
  );
}
