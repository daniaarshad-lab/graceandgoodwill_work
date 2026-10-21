"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarers } from "@/store/slices/clientSlice";
import { clientService } from "@/services/client/client.service";
import { mapCarerProfileToUICarer } from "@/utils/mappers/carerMapper";
import { Carer } from "../../types/client-ui.types";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Star,
  Info,
  User,
  Car,
  Video,
  Briefcase,
  X,
  CheckCircle2,
} from "lucide-react";
import ReadOnlyAvailabilityCalendar from "@/components/ReadOnlyAvailabilityCalendar";
import ThinSpinner from "@/components/ThinSpinner";
import { storageService } from "@/services/storage.service";

export default function CarerDetailsPage() {
  const { carerId } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { carers, loading } = useAppSelector((state) => state.client);
  const [carer, setCarer] = useState<Carer | null>(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isSpecialtiesModalOpen, setIsSpecialtiesModalOpen] = useState(false);

  useEffect(() => {
    if (carers.length === 0 && !loading) {
      dispatch(fetchCarers());
    }
  }, [dispatch, carers.length, loading]);

  useEffect(() => {
    if (carers.length > 0) {
      const found = carers.find(
        (c) =>
          c.id === carerId ||
          (c as any).userId === carerId ||
          (c as any).carerProfileId === carerId,
      );
      if (found) {
        setCarer(found);
        return;
      }
    }

    if (!carer && typeof carerId === "string" && !loading) {
      setDirectLoading(true);
      clientService
        .getCarerById(carerId)
        .then((res) => {
          if (res) {
            setCarer(mapCarerProfileToUICarer(res));
          }
        })
        .catch(() => {
          setFetchError(true);
        })
        .finally(() => {
          setDirectLoading(false);
        });
    }
  }, [carers, carerId, loading]);

  if (loading || directLoading || (!carer && !fetchError && carers.length === 0)) {
    return (
      <ThinSpinner
        fullScreen
        size="xl"
        text="Loading Carer Profile..."
      />
    );
  }

  if (!carer && carers.length > 0) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md w-full backdrop-blur-md">
          <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-300">Profile Not Found</h2>
          <p className="text-red-400/80 mt-2 text-sm">
            We couldn't find the requested carer profile. It may have been
            removed or you don't have access.
          </p>
          <button
            onClick={() => router.push("/client?tab=carers")}
            className="mt-6 px-6 py-2.5 bg-navy-900 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/10 transition-colors font-medium text-sm w-full"
          >
            Back to Carers
          </button>
        </div>
      </div>
    );
  }

  if (!carer) return null;

  const SafeImage = ({ src, alt }: { src: string; alt: string }) => {
    const [imgSrc, setImgSrc] = useState<string>(src);
    const [error, setError] = useState(false);

    useEffect(() => {
      let isMounted = true;
      if (!src) {
        setImgSrc("");
        return;
      }

      // If it's a raw un-presigned S3 URL, fetch a signed URL on the fly
      if (
        src.includes(".amazonaws.com/") &&
        !src.includes("X-Amz-Signature") &&
        !src.includes("Signature=")
      ) {
        storageService
          .getPresignedUrl(src)
          .then((presigned) => {
            if (isMounted && presigned) {
              setImgSrc(presigned);
            }
          })
          .catch(() => {
            if (isMounted) setImgSrc(src);
          });
      } else {
        setImgSrc(src);
      }

      return () => {
        isMounted = false;
      };
    }, [src]);

    if (error || !imgSrc) {
      return (
        <div
          className={`w-full h-full flex items-center justify-center text-4xl font-bold ${carer.avatarBg}`}
        >
          {carer.name
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")}
        </div>
      );
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const imageSrc = imgSrc.startsWith("http")
      ? imgSrc
      : `${API_BASE_URL}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`;

    return (
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    );
  };

  const SafeVideo = ({ src }: { src: string }) => {
    const [videoSrc, setVideoSrc] = useState<string>(src);
    const [error, setError] = useState(false);

    useEffect(() => {
      let isMounted = true;
      if (!src) {
        setVideoSrc("");
        return;
      }

      if (
        src.includes(".amazonaws.com/") &&
        !src.includes("X-Amz-Signature") &&
        !src.includes("Signature=")
      ) {
        storageService
          .getPresignedUrl(src)
          .then((presigned) => {
            if (isMounted && presigned) {
              setVideoSrc(presigned);
            }
          })
          .catch(() => {
            if (isMounted) setVideoSrc(src);
          });
      } else {
        setVideoSrc(src);
      }

      return () => {
        isMounted = false;
      };
    }, [src]);

    if (error || !videoSrc) {
      return (
        <div className="w-full h-48 bg-navy-950 flex items-center justify-center text-gold-300/50 rounded-2xl border border-gold-300/10">
          Video not available
        </div>
      );
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const finalSrc = videoSrc.startsWith("http")
      ? videoSrc
      : `${API_BASE_URL}${videoSrc.startsWith("/") ? "" : "/"}${videoSrc}`;

    return (
      <video
        src={finalSrc}
        controls
        className="w-full rounded-2xl border border-gold-300/10 shadow-lg object-cover"
        onError={() => setError(true)}
      />
    );
  };

  const getInitials = () =>
    carer.name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("");

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-gold/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-navy-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="container-wrapper py-8 relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Navigation */}
        <button
          onClick={() => router.push("/client?tab=carers")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gold/60 hover:text-gold transition duration-200 mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Carers Directory
        </button>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
          
          {/* Left Column (Hero + Info Cards) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-navy-900/50 backdrop-blur-xl border border-gold-300/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent z-0" />

              <div className="relative z-10 p-8 flex flex-col md:flex-row items-center md:items-center gap-8">
                {/* Avatar Profile */}
                <div className="shrink-0 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-gold-300 to-gold-600 rounded-full blur opacity-30 transition duration-500" />
                  <div
                    className={`relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-[3px] border-navy-800 overflow-hidden shadow-2xl bg-navy-800 ${!carer.profilePhotoUrl ? carer.avatarBg : ""}`}
                  >
                    {carer.profilePhotoUrl ? (
                      <SafeImage src={carer.profilePhotoUrl} alt={carer.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/90">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-navy-900 p-2 rounded-full border border-gold-300/20 shadow-lg">
                    <ShieldCheck className="w-5 h-5 text-gold-300" />
                  </div>
                </div>

                {/* Title & Badges */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {carer.name}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    {carer.experience && carer.experience !== "Profile information pending" && (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-purple-500/10">
                        <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                        {carer.experience}
                      </span>
                    )}
                    {carer.canDrive && (
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-blue-500/10">
                        <Car className="w-4 h-4 mr-2 text-blue-400" />
                        Driver
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Overview */}
            <section className="bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors shrink-0">
              <h2 className="text-xl font-bold text-gold-50 flex items-center mb-5">
                <User className="w-5 h-5 mr-3 text-gold-300" /> Professional Overview
              </h2>
              <div className="prose prose-invert prose-gold max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[15px] line-clamp-5">
                  {carer.fullBiography !== "Profile information pending"
                    ? carer.fullBiography
                    : "No professional overview provided."}
                </p>
              </div>
            </section>
            {/* Care Specialties */}
            {carer.specialties && carer.specialties !== "Profile information pending" && (
              <section className="bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors shrink-0">
                <h2 className="text-xl font-bold text-gold-50 flex items-center mb-5">
                  <Star className="w-5 h-5 mr-3 text-gold-300" /> Care Specialties
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {carer.specialties.split(', ').slice(0, 5).map((specialty, idx) => (
                    <span key={idx} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-navy-950/60 border border-gold-300/20 text-gold-50 shadow-sm hover:border-gold-300/40 transition-colors">
                      {specialty}
                    </span>
                  ))}
                  {carer.specialties.split(', ').length > 5 && (
                    <button 
                      onClick={() => setIsSpecialtiesModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gold-500/10 border border-gold-500/30 text-gold-400 shadow-sm hover:bg-gold-500/20 transition-colors cursor-pointer"
                    >
                      +{carer.specialties.split(', ').length - 5} View More
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Verified Compliance & Vetting Badges */}
            <section className="bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <h2 className="text-xl font-bold text-gold-50 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-3 text-gold-DEFAULT" /> Verified Compliance & Vetting
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Background Vetted & Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-gold-300/10">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gold-100">Enhanced DBS Certificate</p>
                    <p className="text-[11px] text-gold-100/50">
                      {carer.dbsCertificateNumber ? `Ref #${carer.dbsCertificateNumber} • Verified` : "Official Criminal Record Check Verified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-gold-300/10">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gold-100">Right to Work in the UK</p>
                    <p className="text-[11px] text-gold-100/50">Identity & Residency Confirmed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-gold-300/10">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gold-100">Public Liability Insurance</p>
                    <p className="text-[11px] text-gold-100/50">Policy Active & In Force</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-gold-300/10">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gold-100">Mandatory Care Training</p>
                    <p className="text-[11px] text-gold-100/50">Safeguarding, First Aid & Moving/Handling</p>
                  </div>
                </div>

                {carer.verifiedCredentials && carer.verifiedCredentials.length > 0 &&
                  carer.verifiedCredentials.map((cred, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-navy-950/60 border border-gold-300/10">
                      <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gold-100">{cred.title}</p>
                        <p className="text-[11px] text-gold-100/50">{cred.category} • Verified Document</p>
                      </div>
                    </div>
                  ))
                }
              </div>

              <p className="text-[11px] text-gold-100/40 mt-4 italic">
                * All documents and credentials undergo rigorous review and verification by the Grace & Goodwill Quality & Compliance team before carer placement eligibility.
              </p>
            </section>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="flex flex-col gap-6">
            {/* Intro Video Card */}
            {carer.introVideoUrl && (
              <div className="bg-navy-900/60 backdrop-blur-md border border-gold-300/10 rounded-3xl p-6 shadow-xl shrink-0">
                <h3 className="text-xl font-bold text-gold-50 flex items-center mb-5">
                  <Video className="w-5 h-5 mr-3 text-gold-300" /> Introduction Video
                </h3>
                <SafeVideo src={carer.introVideoUrl} />
              </div>
            )}

            {/* Schedule Card */}
            <div className="bg-navy-900/40 backdrop-blur-xl border border-gold-300/10 rounded-[1.5rem] shadow-xl overflow-hidden shrink-0">
               <ReadOnlyAvailabilityCalendar
                availability={carer.rawAvailability}
              />
            </div>
          </div>

          {/* Full Width Grid for Bio and Driving */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Short Bio */}
            <section className="w-full bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors">
              <h2 className="text-xl font-bold text-gold-50 flex items-center mb-5">
                <Info className="w-5 h-5 mr-3 text-gold-300" /> Biography
              </h2>
              <div className="prose prose-invert prose-gold max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[15px]">
                  {carer.bio && carer.bio !== "Profile information pending"
                    ? carer.bio
                    : "No short bio provided."}
                </p>
              </div>
            </section>

            {/* Driving Preferences */}
            <section className="w-full bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors">
              <h2 className="text-xl font-bold text-gold-50 flex items-center mb-5">
                <Car className="w-5 h-5 mr-3 text-gold-300" /> Driving Preferences
              </h2>
              <div className="prose prose-invert prose-gold max-w-none">
                <p className="text-slate-300 leading-relaxed text-[15px]">
                  {carer.drivingPreferences && carer.drivingPreferences.length > 0
                    ? `Client has chosen ${carer.drivingPreferences.join(', ')} as their driving preferences.`
                    : "No driving preferences have been specified."}
                </p>
              </div>
            </section>
          </div>

          {/* Full Width Bottom Row (Client Feedback) */}
          <div className="lg:col-span-3">
            <section className="w-full bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:bg-navy-900/50 transition-colors">
              <h2 className="text-xl font-bold text-gold-50 flex items-center mb-6">
                <Heart className="w-5 h-5 mr-3 text-gold-300" /> Client Feedback & Reviews
              </h2>

              {!carer.feedbacks || carer.feedbacks.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-navy-950/30 rounded-2xl border border-dashed border-gold-300/10">
                  <Heart className="w-10 h-10 text-gold-300/20 mb-3" />
                  <p className="text-gold-100/50 font-medium">
                    No feedback has been submitted for this carer yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {carer.feedbacks.map((fb, idx) => {
                    const clientName = `${fb.clientProfile?.user?.firstName || "Unknown"} ${fb.clientProfile?.user?.lastName || "Client"}`;
                    return (
                      <div
                        key={idx}
                        className="bg-navy-950/50 rounded-2xl p-6 border border-gold-300/10 hover:border-gold-300/30 hover:bg-navy-900/40 transition-all duration-300 shadow-sm flex flex-col"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-navy-800 border border-gold-300/20 flex items-center justify-center text-sm font-bold text-gold-100 shrink-0">
                              {clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-sm font-bold text-gold-50 truncate max-w-[120px]">
                              {clientName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 bg-navy-900 px-3 py-1.5 rounded-full border border-gold-300/10 shadow-sm shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < fb.rating ? "text-amber-400 fill-amber-400" : "text-gray-600 fill-gray-800"}`}
                              />
                            ))}
                            <span className="text-xs font-bold text-gold-100/80 ml-1.5">
                              {fb.rating}.0
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-300/90 italic leading-relaxed text-[15px] flex-1">
                          "{fb.message}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Specialties Modal */}
      {isSpecialtiesModalOpen && carer?.specialties && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm cursor-pointer" 
            onClick={() => setIsSpecialtiesModalOpen(false)} 
          />
          <div className="relative bg-navy-900 border border-gold-300/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-gold-50 flex items-center">
                <Star className="w-5 h-5 mr-3 text-gold-300" /> All Care Specialties
              </h2>
              <button 
                onClick={() => setIsSpecialtiesModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                {carer.specialties.split(', ').map((specialty, idx) => (
                  <span key={idx} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-navy-950/60 border border-gold-300/20 text-gold-50 shadow-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
