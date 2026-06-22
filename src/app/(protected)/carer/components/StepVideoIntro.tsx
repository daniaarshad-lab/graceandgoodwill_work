import React, { useRef, useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import { FileVideo, Video, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadProfileMedia } from "@/store/slices/carerSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepVideoIntro({
  portal: _portal,
  onNext,
  onBack,
}: Props) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.carer.profile);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmittingMedia, setIsSubmittingMedia] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const existingVideoUrl = profile?.introVideoUrl;

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
      setSelectionError(
        "Only MP4, WebM, OGG and QuickTime videos are allowed.",
      );
      setVideoFile(null);
      e.target.value = "";
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;

      if (duration < 45 || duration > 60) {
        setSelectionError(
          `Your video duration is ${Math.round(
            duration,
          )} seconds. It must be between 45 seconds and 60 seconds (1 minute) maximum.`,
        );
        setVideoFile(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      setSelectionError(null);
      setVideoFile(file);
    };
    video.src = URL.createObjectURL(file);
  };

  const uploadVideo = async (): Promise<boolean> => {
    if (!videoFile) return true;
    setIsSubmittingMedia(true);
    try {
      const response = await dispatch(uploadProfileMedia({ video: videoFile })).unwrap();
      console.log("[Video Upload debug] response from uploadProfileMedia:", response);
      showSuccessToast("Success", "Video uploaded successfully!");
      return true;
    } catch (err: unknown) {
      showErrorToast(
        "Upload Failed",
        typeof err === "string" ? err : "Failed to upload video",
      );
      return false;
    } finally {
      setIsSubmittingMedia(false);
    }
  };

  const hasVideo = !!videoFile || !!existingVideoUrl;
  const errorMsg =
    selectionError ||
    (submitted && !hasVideo
      ? "Please upload a video introduction to continue."
      : "");

  const handleNext = async () => {
    setSubmitted(true);
    if (selectionError || !hasVideo) {
      return;
    }

    if (videoFile) {
      const success = await uploadVideo();
      if (!success) return;
    }

    onNext();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Video Introduction
        </h3>

        <div
          className={`flex flex-col md:flex-row gap-6 items-center bg-navy-950/40 p-6 rounded-2xl border transition-all ${errorMsg
              ? "border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : "border-gold-300/5"
            }`}
        >
          <div
            onClick={() => !isSubmittingMedia && videoInputRef.current?.click()}
            className={`h-32 w-full max-w-[200px] border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${videoFile || existingVideoUrl
                ? "bg-gold-DEFAULT/5 border-gold-DEFAULT text-gold-DEFAULT"
                : errorMsg
                  ? "border-red-500/50 text-red-500 bg-red-950/5"
                  : "border-gold-muted/20 hover:border-gold-DEFAULT/50 text-gold-muted/40"
              }`}
          >
            {videoFile ? (
              <div className="flex flex-col items-center space-y-2">
                <FileVideo className="w-8 h-8 text-gold-DEFAULT" />
                <span className="text-[10px] font-bold text-emerald-400 text-center px-2 truncate w-full">
                  {videoFile.name}
                </span>
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
            disabled={isSubmittingMedia}
          />

          <div className="flex-1 space-y-3">
            <h4 className="text-sm font-semibold text-gold-50">
              Upload Video Introduction (Maximum 1 minute)*
            </h4>
            <p className="text-xs text-gold-100/60 mt-1">
              Videos longer than 1 minute should not be accepted by the system.
            </p>
            {errorMsg && (
              <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
            )}
            <div className="flex items-start gap-1.5 text-left">
              <AlertCircle className="w-4 h-4 text-gold-DEFAULT shrink-0 mt-0.5" />
              <p className="text-xs text-gold-100/60 leading-relaxed">
                Briefly introduce yourself, discuss your experience,
                personality, interests, and the type of people you enjoy
                supporting.
                <br />
                <br />
                This video will be visible to prospective clients and families
                as part of the matching process and help families get a better
                understanding of your communication style, personality, values,
                and experience before arranging an interview.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        <Button
          type="button"
          variant="ghost-gold"
          onClick={onBack}
          disabled={isSubmittingMedia}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isSubmittingMedia}
        >
          {isSubmittingMedia ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
