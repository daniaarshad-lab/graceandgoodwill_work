"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCarers, fetchCareRequests, requestIntroduction, fetchInterestList, addToInterestList, removeFromInterestList } from "@/store/slices/clientSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { Carer } from "../types/client-ui.types";

import Button from "@/components/Button";
import IntroductionModal from "../components/IntroductionModal";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Award, 
  Search, 
  X, 
  Play, 
  Video,
  User, 
  Calendar,
  Sparkles,
  Check,
  Heart
} from "lucide-react";

const SafeImage = ({ src, alt, fallback, className }: { src: string, alt: string, fallback: React.ReactNode, className?: string }) => {
  const [error, setError] = useState(false);
  if (error) return <>{fallback}</>;
  return <Image src={src} alt={alt} fill className={className} onError={() => setError(true)} />;
};

export default function BrowseCarersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const { carers, careRequests, interestList, loading } = useAppSelector((state) => state.client);
  
  // Local UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedCarer, setSelectedCarer] = useState<Carer | null>(null);
  const [introCarer, setIntroCarer] = useState<Carer | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"bio" | "experience" | "qualifications">("bio");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCarers());
    dispatch(fetchCareRequests());
    dispatch(fetchInterestList());
  }, [dispatch]);

  // Extract all unique specialties for filter chips
  const allSpecialties = useMemo(() => {
    const list = new Set<string>();
    carers.forEach((carer) => {
      if (carer.specialties) {
        carer.specialties.split(",").forEach((s) => list.add(s.trim()));
      }
    });
    return ["All", ...Array.from(list)];
  }, [carers]);

  // Filtered carers list
  const filteredCarers = useMemo(() => {
    return carers.filter((carer) => {
      const matchesSearch = carer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carer.specialties.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (carer.location && carer.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialty = selectedSpecialty === "All" || 
        carer.specialties.toLowerCase().includes(selectedSpecialty.toLowerCase());
      
      return matchesSearch && matchesSpecialty;
    });
  }, [carers, searchTerm, selectedSpecialty]);

  const handleOpenIntro = (carer: Carer) => {
    setIntroCarer(carer);
  };

  const handleConfirmIntro = async (careRequestId: string) => {
    if (!introCarer) return;
    try {
      await dispatch(
        requestIntroduction({
          careRequestId,
          carerProfileId: introCarer.id,
        })
      ).unwrap();
      
      showSuccessToast(
        "Introduction Requested",
        `Your request to be introduced to ${introCarer.name} was successfully submitted. Our team will contact you shortly.`
      );
    } catch (err: any) {
      showErrorToast("Request Failed", err?.message || "Failed to submit introduction request.");
    } finally {
      setIntroCarer(null);
    }
  };

  const handleWishlistToggle = async (carer: Carer) => {
    const isWishlisted = interestList.some((w: Carer) => w.id === carer.id);
    
    if (!isWishlisted && interestList.length >= 8) {
      showErrorToast("Limit Reached", "Maximum 8 carers allowed in Interest List.");
      return;
    }

    setProcessingId(carer.id);
    try {
      if (isWishlisted) {
        await dispatch(removeFromInterestList(carer.id)).unwrap();
        showSuccessToast("Removed", "Removed from Interest List");
      } else {
        await dispatch(addToInterestList(carer.id)).unwrap();
        showSuccessToast("Added", "Added to Interest List");
      }
    } catch (error: any) {
      showErrorToast("Action failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  const renderFallbackAvatar = (name: string, bg: string) => {
    const initials = name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className={`h-full w-full rounded-full flex items-center justify-center font-bold ${bg}`}>
        {initials}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-navy-950 py-10 text-gold-100 font-sans">
      <div className="container-wrapper max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-300/10 pb-6">
          <div className="space-y-2">
            <button
              onClick={() => router.push("/client")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gold-50">
              Browse Professional Carers
            </h1>
            <p className="text-sm text-gold-100/60 font-light">
              Select and review profiles of our pre-screened healthcare specialists.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-navy-900/40 border border-gold-300/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm text-[11px] font-medium tracking-wide uppercase text-gold-300">
              Active Care Requests: <span className="text-white font-bold">{careRequests?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Search and Filters panel */}
        <div className="bg-navy-900/20 border border-gold-300/10 p-5 rounded-3xl space-y-4 backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gold-300/50" />
            <input
              type="text"
              placeholder="Search carers by name, location, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-navy-950/60 border border-gold-300/10 rounded-2xl text-sm text-gold-50 outline-none focus:ring-2 focus:ring-gold-DEFAULT/20 focus:border-gold-DEFAULT/30 transition-all placeholder:text-gold-100/30"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 text-gold-300/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Specialty chips */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-gold-300/80">
              Filter by Specialty
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allSpecialties.slice(0, 10).map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selectedSpecialty === specialty
                      ? "bg-[#b59469] border-[#b59469] text-navy-950 shadow-soft"
                      : "bg-navy-950/40 border-gold-300/10 text-gold-200/70 hover:border-gold-300/30 hover:text-white"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Results display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gold-100/50">Fetching available carer profiles...</p>
          </div>
        ) : filteredCarers.length === 0 ? (
          <div className="text-center py-20 bg-navy-900/10 border border-dashed border-gold-300/10 rounded-3xl space-y-4">
            <p className="text-sm text-gold-100/50">No carers match your current search criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("All");
              }}
              variant="outline"
              size="sm"
              className="font-medium"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarers.map((carer) => {
              const isWishlisted = interestList.some((w: Carer) => w.id === carer.id);
              const isMaxReached = interestList.length >= 8;
              const isProcessing = processingId === carer.id;

              return (
              <div
                key={carer.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-gold-300/10 bg-navy-900/30 p-5 hover:border-gold-DEFAULT/30 hover:bg-navy-900/55 transition-all duration-300 shadow-soft backdrop-blur-sm"
              >
                <div className="space-y-4">
                  {/* Top: Avatar/Image & Status */}
                  <div className="flex justify-between items-start">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-300/20 shadow-inner shrink-0 bg-navy-950">
                      {carer.profilePhotoUrl ? (
                        <SafeImage
                          src={carer.profilePhotoUrl}
                          alt={carer.name}
                          fallback={renderFallbackAvatar(carer.name, carer.avatarBg)}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        renderFallbackAvatar(carer.name, carer.avatarBg)
                      )}
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                        carer.availability === "Available"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {carer.availability}
                    </span>
                  </div>

                  {/* Name and Basic Info */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gold-50 tracking-tight group-hover:text-white transition-colors">
                      {carer.name}
                    </h3>
                    
                    {carer.location && (
                      <div className="flex items-center gap-1 text-[11px] text-gold-100/50">
                        <MapPin className="w-3.5 h-3.5 text-gold-DEFAULT/60" />
                        <span>{carer.location}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gold-300/80 font-medium">
                      Experience: {carer.experience}
                    </p>
                  </div>

                  {/* Summary / Bio */}
                  <p className="text-xs text-gold-100/60 leading-relaxed line-clamp-3 pt-2 border-t border-gold-300/5 font-light">
                    {carer.bio}
                  </p>

                  {/* Specialties List */}
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold tracking-wider text-gold-300/60">
                      Core Specialties
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {carer.specialties.split(",").slice(0, 3).map((spec) => (
                        <span 
                          key={spec} 
                          className="text-[9px] font-medium bg-gold-DEFAULT/5 text-gold-200 px-2 py-0.5 rounded border border-gold-300/5"
                        >
                          {spec.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2.5 pt-5 mt-4 border-t border-gold-300/5">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedCarer(carer);
                        setActiveModalTab("bio");
                        setIsVideoPlaying(false);
                      }}
                      className="flex-1 px-4 py-2 bg-navy-950/50 hover:bg-navy-950/80 border border-gold-300/10 hover:border-gold-300/20 text-gold-100 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition-all text-center cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleOpenIntro(carer)}
                      className="flex-1 px-4 py-2 bg-[#b59469] hover:bg-[#b59469]/90 text-navy-950 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition-all text-center cursor-pointer"
                    >
                      Request Intro
                    </button>
                  </div>
                  <button
                    onClick={() => handleWishlistToggle(carer)}
                    disabled={isProcessing || (!isWishlisted && isMaxReached)}
                    className={`w-full px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
                      isWishlisted 
                        ? "bg-transparent border border-gold-300/30 text-gold-200 hover:bg-gold-300/10" 
                        : "bg-navy-950/50 border border-gold-300/10 text-gold-100 hover:text-white hover:bg-navy-950/80 hover:border-gold-300/20"
                    } ${isProcessing || (!isWishlisted && isMaxReached) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-gold-200" : ""}`} />
                    {isProcessing 
                      ? "Updating..." 
                      : isWishlisted 
                        ? "Remove from Interest List" 
                        : isMaxReached 
                          ? "Maximum 8 allowed" 
                          : "Add to Interest List"}
                  </button>
                </div>

              </div>
            )})}
          </div>
        )}

        {/* Detailed Profile View Modal */}
        {selectedCarer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-3xl border border-gold-300/20 bg-navy-900 shadow-elegant overflow-hidden my-auto max-h-[90vh] flex flex-col">
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedCarer(null);
                  setIsVideoPlaying(false);
                }}
                className="absolute right-5 top-5 z-10 p-2 rounded-full bg-navy-950/80 hover:bg-navy-950 border border-gold-300/10 text-gold-300 hover:text-white cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content Container (Scrollable) */}
              <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
                
                {/* Header section inside modal */}
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center border-b border-gold-300/10 pb-5">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold-DEFAULT shadow-soft shrink-0 bg-navy-950">
                    {selectedCarer.profilePhotoUrl ? (
                      <SafeImage
                        src={selectedCarer.profilePhotoUrl}
                        alt={selectedCarer.name}
                        fallback={renderFallbackAvatar(selectedCarer.name, selectedCarer.avatarBg)}
                        className="object-cover"
                      />
                    ) : (
                      renderFallbackAvatar(selectedCarer.name, selectedCarer.avatarBg)
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-2xl font-bold text-gold-50 tracking-tight">
                        {selectedCarer.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                          selectedCarer.availability === "Available"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {selectedCarer.availability}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-gold-100/60">
                      {selectedCarer.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-DEFAULT" />
                          <span>{selectedCarer.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold-DEFAULT" />
                        <span>Experience: {selectedCarer.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Layout containing Profile fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column (Biography, Experience Summary, Credentials) */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Biography */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300">
                        Biography & Summary
      </h3>
                      <p className="text-xs leading-relaxed text-gold-100/80 font-light whitespace-pre-line">
                        {selectedCarer.fullBiography || selectedCarer.bio}
                      </p>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-2 pt-4 border-t border-gold-300/5">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300">
                        Core Specialties
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCarer.specialties.split(",").map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-gold-DEFAULT/5 text-gold-200 rounded border border-gold-300/10 text-[10px] font-medium">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience Summary */}
                    <div className="space-y-2 pt-4 border-t border-gold-300/5">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300">
                        Experience Summary
                      </h3>
                      <div className="whitespace-pre-line text-xs text-gold-100/80 leading-relaxed font-light">
                        {selectedCarer.experienceDetails || "• Over 5 years of verified healthcare and client support history.\n• Experience in personal home care and medical companion support."}
                      </div>
                    </div>

                    {/* Qualifications / Credentials */}
                    <div className="space-y-2 pt-4 border-t border-gold-300/5">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300">
                        Qualifications & Credentials
                      </h3>
                      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-navy-950/40 border border-gold-300/10">
                        <Award className="w-5 h-5 text-gold-DEFAULT shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-gold-100 text-xs mb-1">Certifications & Training</h4>
                          <p className="text-gold-100/70 text-xs leading-relaxed">{selectedCarer.qualifications}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Video Player + Availability) */}
                  <div className="space-y-6">
                    {/* Video Presentation */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-gold-DEFAULT" />
                        Introduction Video
                      </h3>
                      {selectedCarer.introVideoUrl ? (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gold-300/10 bg-navy-950 relative shadow-inner group">
                          {!isVideoPlaying ? (
                            <div className="absolute inset-0 bg-navy-900/65 flex flex-col items-center justify-center z-10 transition-colors p-4">
                              <button
                                onClick={() => setIsVideoPlaying(true)}
                                className="w-12 h-12 rounded-full bg-[#b59469] hover:bg-gold-DEFAULT text-navy-950 hover:text-white flex items-center justify-center shadow-elegant cursor-pointer transition-all hover:scale-105"
                              >
                                <Play className="w-5 h-5 fill-current translate-x-0.5" />
                              </button>
                              <p className="text-[9px] text-white/70 uppercase tracking-widest font-semibold mt-2.5">
                                Play Intro Video
                              </p>
                            </div>
                          ) : (
                            <video
                              src={selectedCarer.introVideoUrl}
                              controls
                              autoPlay
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-2xl border border-dashed border-gold-300/20 bg-navy-950/40 flex flex-col items-center justify-center p-4 text-center space-y-2">
                          <Video className="w-7 h-7 text-gold-300/30 animate-pulse" />
                          <div>
                            <p className="text-[11px] font-semibold text-gold-200">Video Preview Pending</p>
                            <p className="text-[9px] text-gold-100/40 max-w-[160px] mx-auto leading-relaxed mt-0.5">
                              The carer is finalizing their video upload. It will become active once complete.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Availability details */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gold-300 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold-DEFAULT" />
                        Availability Details
                      </h3>
                      {selectedCarer.availabilityDetails && selectedCarer.availabilityDetails.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {selectedCarer.availabilityDetails.map((slot, i) => (
                            <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-950/40 border border-gold-300/10 text-gold-100 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{slot}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gold-300/20 bg-navy-950/40 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gold-200">
                            <Clock className="w-4 h-4 text-gold-300/40" />
                            <span>Standard Shifts</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 text-[10px] text-gold-100/50">
                            <div className="p-2 rounded-lg bg-navy-950/20 border border-gold-300/5">Weekdays: morning / day coverage</div>
                            <div className="p-2 rounded-lg bg-navy-950/20 border border-gold-300/5">Weekends: night / call coverage</div>
                          </div>
                          <p className="text-[9px] text-gold-100/30 leading-relaxed italic">
                            * Schedule configuration is pending real-time connection.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Footer / CTA */}
              <div className="bg-navy-950 border-t border-gold-300/10 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gold-300/70">Matching Assessment</p>
                  <p className="text-xs text-gold-100/90 font-medium">Verify compatibility & proceed to intro call.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => handleWishlistToggle(selectedCarer)}
                    disabled={processingId === selectedCarer.id || (!interestList.some((w: Carer) => w.id === selectedCarer.id) && interestList.length >= 8)}
                    variant={interestList.some((w: Carer) => w.id === selectedCarer.id) ? "outline" : "secondary"}
                    size="sm"
                    className="flex-1 sm:flex-none font-semibold flex items-center justify-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${interestList.some((w: Carer) => w.id === selectedCarer.id) ? "fill-gold-200" : ""}`} />
                    {processingId === selectedCarer.id 
                      ? "Updating..." 
                      : interestList.some((w: Carer) => w.id === selectedCarer.id) 
                        ? "Remove from List" 
                        : interestList.length >= 8 
                          ? "Maximum 8 allowed" 
                          : "Interest List"}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCarer(null);
                      setIsVideoPlaying(false);
                      handleOpenIntro(selectedCarer);
                    }}
                    variant="primary"
                    size="sm"
                    className="flex-1 sm:flex-none font-semibold"
                  >
                    Request Introduction
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Request Introduction Modal Dialog */}
        {introCarer && (
          <IntroductionModal
            carer={introCarer}
            careRequests={careRequests}
            onCancel={() => setIntroCarer(null)}
            onConfirm={handleConfirmIntro}
          />
        )}

      </div>
    </main>
  );
}
