import React, { useRef, useState } from "react";
import SectionCard from "./shared/SectionCard";
import Button from "@/components/Button";
import {
  FileVideo,
  Video,
  Camera,
  Check,
  Info,
  Trash2,
  UploadCloud,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadProfileMedia, updateCarerProfile } from "@/store/slices/carerSlice";
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

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoSelectionError, setPhotoSelectionError] = useState<string | null>(
    null,
  );

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSelectionError, setVideoSelectionError] = useState<string | null>(
    null,
  );

  const [isSubmittingMedia, setIsSubmittingMedia] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initialConsent = profile?.declarations?.mediaVisibilityConsent ?? false;
  const [hasConsented, setHasConsented] = useState(initialConsent);

  React.useEffect(() => {
    if (profile?.declarations?.mediaVisibilityConsent !== undefined) {
      setHasConsented(profile.declarations.mediaVisibilityConsent);
    }
  }, [profile?.declarations?.mediaVisibilityConsent]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const existingPhotoUrl = profile?.profilePhotoUrl;
  const existingVideoUrl = profile?.introVideoUrl;

  const getFullPhotoUrl = (url: string | null | undefined) => {
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
    return finalUrl;
  };

  const displayPhotoUrl =
    photoPreview ||
    (existingPhotoUrl ? getFullPhotoUrl(existingPhotoUrl) : null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPhotoSelectionError(
        "Only JPEG, PNG, WEBP and GIF images are allowed.",
      );
      setPhotoFile(null);
      setPhotoPreview(null);
      e.target.value = "";
      return;
    }

    setPhotoSelectionError(null);
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
      setVideoSelectionError(
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
      const exactDuration = video.duration;
      const duration = Math.round(exactDuration);

      if (duration < 45 || duration > 60) {
        setVideoSelectionError(
          `Your video duration is ${duration} seconds. It must be between 45 seconds and 60 seconds (1 minute) maximum.`,
        );
        setVideoFile(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      setVideoSelectionError(null);

      setVideoFile(file);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoSelectionError(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleRemoveVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoFile(null);
    setVideoSelectionError(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const uploadMedia = async (): Promise<boolean> => {
    setIsSubmittingMedia(true);
    try {
      await dispatch(
        uploadProfileMedia({
          photo: photoFile || undefined,
          video: videoFile || undefined,
          hasConsented: hasConsented,
        }),
      ).unwrap();
      showSuccessToast("Success", "Profile media saved successfully!");
      return true;
    } catch (err: unknown) {
      showErrorToast(
        "Upload Failed",
        typeof err === "string" ? err : "Failed to upload media",
      );
      setIsSubmittingMedia(false);
      return false;
    }
  };

  const hasPhoto = !!photoFile || !!existingPhotoUrl;
  const hasVideo = !!videoFile || !!existingVideoUrl;

  const photoErrorMsg =
    photoSelectionError ||
    (submitted && !hasPhoto ? "Please upload your profile picture." : "");
  const videoErrorMsg =
    videoSelectionError ||
    (submitted && !hasVideo ? "Please upload your introduction video." : "");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionCard className="p-8 md:p-10 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto border-b border-gold-300/10 pb-6 relative">
          <h3 className="text-xl font-bold text-gold-200 tracking-tight flex items-center justify-center gap-2">
            Profile Media Upload
            <div className="relative group flex items-center">
              <Info className="w-4 h-4 text-gold-200/50 hover:text-gold-200 cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none text-left">
                <div className="bg-navy-950 text-gold-100 text-[11px] font-normal leading-relaxed p-3 rounded-lg border border-gold-300/10 shadow-xl relative whitespace-normal">
                  Your profile picture and video will be reviewed by an
                  administrator. Once accepted, if you wish to change them,
                  please contact an administrator.
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gold-300/10"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-navy-950 -mt-[1px]"></div>
                </div>
              </div>
            </div>
          </h3>
          <p className="text-sm text-gold-100/60 leading-relaxed">
            Provide a professional photo and a short introductory video. Both
            are required before continuing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Photo Upload Card */}
          <div
            className={`flex flex-col items-center bg-navy-900/40 p-8 rounded-3xl border transition-all duration-300 ${photoErrorMsg
              ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              : "border-gold-300/10 hover:border-gold-300/20 shadow-soft"
              }`}
          >
            <div className="text-center mb-8 flex flex-col justify-end h-8">
              <h4 className="text-sm font-semibold text-gold-50">
                Profile Picture *
              </h4>
            </div>

            <div
              onClick={() =>
                !isSubmittingMedia && photoInputRef.current?.click()
              }
              className={`relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-[3px] bg-navy-950 flex flex-col items-center justify-center transition-transform duration-300 group cursor-pointer ${photoErrorMsg
                ? "border-red-500/50"
                : displayPhotoUrl
                  ? "border-emerald-500/50"
                  : "border-gold-DEFAULT/40 hover:border-gold-DEFAULT group-hover:scale-[1.02]"
                }`}
            >
              {displayPhotoUrl ? (
                <img
                  src={displayPhotoUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Camera
                    className={`w-10 h-10 mb-2 ${photoErrorMsg ? "text-red-500/50" : "text-gold-DEFAULT/50"}`}
                  />
                  <span className="text-[10px] font-bold text-gold-DEFAULT/60 tracking-wider">
                    BROWSE
                  </span>
                </>
              )}

              {!isSubmittingMedia && displayPhotoUrl && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={photoInputRef}
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isSubmittingMedia}
            />

            <div className="mt-8 text-center min-h-[60px] flex flex-col items-center justify-start w-full">
              {photoErrorMsg ? (
                <p className="text-sm text-red-500 font-semibold">
                  {photoErrorMsg}
                </p>
              ) : hasPhoto ? (
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-sm">
                    <Check className="w-4 h-4" /> Uploaded successfully
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() =>
                        !isSubmittingMedia && photoInputRef.current?.click()
                      }
                      className="text-gold-DEFAULT hover:text-gold-300 transition-colors"
                      disabled={isSubmittingMedia}
                    >
                      Replace
                    </button>
                    {photoFile && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        disabled={isSubmittingMedia}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gold-100/40">No photo selected</p>
              )}
            </div>
          </div>

          {/* Video Upload Card */}
          <div
            className={`flex flex-col items-center bg-navy-900/40 p-8 rounded-3xl border transition-all duration-300 ${videoErrorMsg
              ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              : "border-gold-300/10 hover:border-gold-300/20 shadow-soft"
              }`}
          >
            <div className="text-center mb-8 flex flex-col justify-end">
              <h4 className="text-sm font-semibold text-gold-50">
                Upload Video Introduction (Maximum 1 minute)*
              </h4>
              <p className="text-xs text-gold-100/60 mt-2">
                Videos longer than 1 minute should not be accepted by the
                system.
              </p>
            </div>

            <div
              onClick={() =>
                !isSubmittingMedia && videoInputRef.current?.click()
              }
              className={`h-40 w-full max-w-[200px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${videoErrorMsg
                ? "border-red-500/50 bg-red-950/10"
                : hasVideo
                  ? "border-emerald-500/50 bg-emerald-950/5"
                  : "border-gold-DEFAULT/30 hover:border-gold-DEFAULT/60 bg-navy-950 group-hover:bg-navy-900/50"
                }`}
            >
              {hasVideo ? (
                <div className="flex flex-col items-center space-y-3 px-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <FileVideo className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400/90 text-center truncate w-full max-w-[180px]">
                    {videoFile ? videoFile.name : "Video Uploaded"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <Video
                    className={`w-10 h-10 ${videoErrorMsg ? "text-red-500/50" : "text-gold-DEFAULT/50 group-hover:scale-110 transition-transform"}`}
                  />
                  <span className="text-[10px] font-bold text-gold-DEFAULT/60 tracking-wider">
                    BROWSE VIDEO
                  </span>
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

            <div className="mt-8 text-center min-h-[60px] flex flex-col items-center justify-start w-full">
              {videoErrorMsg ? (
                <p className="text-sm text-red-500 font-semibold">
                  {videoErrorMsg}
                </p>
              ) : hasVideo ? (
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-sm">
                    <Check className="w-4 h-4" /> Uploaded successfully
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() =>
                        !isSubmittingMedia && videoInputRef.current?.click()
                      }
                      className="text-gold-DEFAULT hover:text-gold-300 transition-colors"
                      disabled={isSubmittingMedia}
                    >
                      Replace
                    </button>
                    {videoFile && (
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                        disabled={isSubmittingMedia}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gold-100/40">No video selected</p>
              )}
            </div>
          </div>
        </div>

        {/* Original Texts Section */}
        <div className="bg-navy-950/60 rounded-2xl p-6 border border-gold-300/10 flex gap-4 items-start mt-4">
          <div className="p-2 bg-gold-DEFAULT/10 rounded-full shrink-0">
            <Info className="w-5 h-5 text-gold-DEFAULT" />
          </div>
          <div className="space-y-4 pt-1 w-full">
            <div>
              <p className="text-[13px] text-gold-100/80 leading-relaxed font-medium">
                Your profile picture will be visible to prospective clients and
                families. Please upload a clear, professional, and
                natural-looking photo with your face clearly visible. Avoid
                group photos, filters, or low-quality images.
              </p>
              <p className="text-xs text-gold-100/60 leading-relaxed mt-2">
                Upload a professional, friendly, high-resolution headshot.
                <br />
                Supported formats: JPEG, PNG, WEBP and GIF.
              </p>
            </div>
            <div className="w-full h-px bg-gold-300/10"></div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-gold-DEFAULT shrink-0 mt-0.5" />
              <div className="space-y-4">
                <p className="text-xs text-gold-100/60 leading-relaxed">
                  Briefly introduce yourself, discuss your experience,
                  personality, interests, and the type of people you enjoy
                  supporting.
                </p>
                <p className="text-xs text-gold-100/60 leading-relaxed">
                  This video will be visible to prospective clients and families
                  as part of the matching process and help families get a better
                  understanding of your communication style, personality,
                  values, and experience before arranging an interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="bg-navy-900/40 border border-gold-300/10 rounded-2xl p-6 shadow-inner">
        <div
          className="flex items-start gap-4 cursor-pointer group"
          onClick={() => setHasConsented(!hasConsented)}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <div
              className={`w-5 h-5 border-2 rounded transition-all ${hasConsented
                ? "bg-gold border-gold"
                : submitted && !hasConsented
                  ? "border-red-500 bg-red-950/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                  : "border-gold-300/30"
                }`}
            />
            <Check
              className={`absolute w-3.5 h-3.5 text-navy-950 transition-opacity ${hasConsented ? "opacity-100" : "opacity-0"
                }`}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gold-50 group-hover:text-gold-200 transition-colors">
              I understand and consent that my profile media will be visible to
              clients and administrators.
            </p>
            <p className="text-xs text-gold-100/60 leading-relaxed">
              By checking this box, you agree that your photo and video
              introduction will be shared with families and care seekers on the
              platform to help them find the best match.
            </p>
            {submitted && !hasConsented && (
              <p className="text-xs font-bold text-red-400 pt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Your consent is
                important. You must agree to proceed.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 gap-4">
        <Button
          type="button"
          variant="ghost-gold"
          onClick={onBack}
          disabled={isSubmittingMedia}
          className="px-8"
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={async () => {
            setSubmitted(true);
            if (
              photoSelectionError ||
              videoSelectionError ||
              !hasPhoto ||
              !hasVideo ||
              !hasConsented
            ) {
              return;
            }
            setIsSubmittingMedia(true);

            if (photoFile || videoFile || hasConsented !== initialConsent) {
              const success = await uploadMedia();
              if (!success) {
                setIsSubmittingMedia(false);
                return;
              }
            } else {
              // Small delay for smooth UI feedback if no changes were made
              await new Promise((resolve) => setTimeout(resolve, 600));
            }
            onNext();
          }}
          disabled={isSubmittingMedia}
          className="px-8"
        >
          {isSubmittingMedia ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
