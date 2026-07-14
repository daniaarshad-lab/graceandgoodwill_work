"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCarers } from "@/store/slices/clientSlice";
import { Carer } from "../../types/client-ui.types";
import { 
  ArrowLeft, MapPin, Calendar, Mail, Phone, Heart, 
  Award, ShieldCheck, Clock, Star, Info, User
} from "lucide-react";
import ReadOnlyAvailabilityCalendar from "@/components/ReadOnlyAvailabilityCalendar";

export default function CarerDetailsPage() {
  const { carerId } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { carers, loading } = useAppSelector((state) => state.client);
  const [carer, setCarer] = useState<Carer | null>(null);

  useEffect(() => {
    if (carers.length === 0 && !loading) {
      dispatch(fetchCarers());
    }
  }, [dispatch, carers.length, loading]);

  useEffect(() => {
    if (carers.length > 0) {
      const found = carers.find((c) => c.id === carerId);
      if (found) {
        setCarer(found);
      }
    }
  }, [carers, carerId]);

  if (loading || (!carer && carers.length === 0)) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(181,148,105,0.5)]" />
        <p className="text-gold-100/60 font-medium animate-pulse tracking-wide">
          Loading Carer Profile...
        </p>
      </div>
    );
  }

  if (!carer && carers.length > 0) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md w-full backdrop-blur-md">
          <Info className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-300">Profile Not Found</h2>
          <p className="text-red-400/80 mt-2 text-sm">
            We couldn't find the requested carer profile. It may have been removed or you don't have access.
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
    const [error, setError] = useState(false);
    if (error) {
      return (
        <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${carer.avatarBg}`}>
          {carer.name.split(" ").map((n) => n.charAt(0)).join("")}
        </div>
      );
    }
    return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />;
  };

  const getInitials = () => carer.name.split(" ").map((n) => n.charAt(0)).join("");

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

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-navy-900/50 backdrop-blur-xl border border-gold-300/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent z-0" />
          
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-center gap-6">
            {/* Avatar Profile */}
            <div className="shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-gold-300 to-gold-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className={`relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-navy-950 overflow-hidden shadow-2xl bg-navy-800 ${!carer.profilePhotoUrl ? carer.avatarBg : ''}`}>
                {carer.profilePhotoUrl ? (
                  <SafeImage src={carer.profilePhotoUrl} alt={carer.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/90">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-navy-950 p-1.5 rounded-full border border-gold-300/20 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-gold-300" />
              </div>
            </div>

            {/* Title & Badges */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-50 tracking-tight">
                  {carer.name}
                </h1>
                <p className="text-sm text-gold-100/70 font-medium">
                  {carer.specialties}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm
                  ${carer.availability === "Available" 
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-emerald-500/10" 
                    : "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-amber-500/10"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${carer.availability === "Available" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {carer.availability}
                </span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-8 h-full">
            
            {/* Biography */}
            <section className="bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-gold-300/20 transition-colors shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-300/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <h2 className="text-lg font-bold text-gold-100 flex items-center mb-6">
                <User className="w-5 h-5 mr-3 text-gold-300" /> Professional Overview
              </h2>
              <div className="prose prose-invert prose-gold max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                  {carer.fullBiography || carer.bio || "No professional overview provided."}
                </p>
              </div>
            </section>

            {/* Client Feedback */}
            <section className="flex-1 bg-navy-900/40 backdrop-blur-md border border-gold-300/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-gold-300/20 transition-colors">
              <h2 className="text-lg font-bold text-gold-100 flex items-center mb-6">
                <Heart className="w-5 h-5 mr-3 text-gold-300" /> Client Feedback & Reviews
              </h2>
              
              {!carer.feedbacks || carer.feedbacks.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center bg-navy-950/30 rounded-2xl border border-dashed border-gold-300/10">
                  <Heart className="w-10 h-10 text-gold-300/20 mb-3" />
                  <p className="text-gold-100/50 font-medium">No feedback has been submitted for this carer yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {carer.feedbacks.map((fb, idx) => {
                    const clientName = `${fb.clientProfile?.user?.firstName || "Unknown"} ${fb.clientProfile?.user?.lastName || "Client"}`;
                    return (
                      <div key={idx} className="bg-navy-950/50 rounded-2xl p-6 border border-gold-300/5 hover:border-gold-300/10 hover:bg-navy-900/50 transition-all duration-300 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-navy-800 border border-gold-300/20 flex items-center justify-center text-xs font-bold text-gold-100">
                              {clientName.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-sm font-bold text-gold-50">{clientName}</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-navy-900 px-3 py-1 rounded-full border border-gold-300/10">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < fb.rating ? "text-amber-400 fill-amber-400" : "text-gray-600 fill-gray-800"}`} 
                              />
                            ))}
                            <span className="text-xs font-bold text-gold-100/70 ml-1.5">{fb.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-slate-300/90 italic leading-relaxed text-sm">
                          "{fb.message}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8 h-full">
            
            {/* Contact Card */}
            <div className="bg-navy-900/60 backdrop-blur-md border border-gold-300/10 rounded-3xl p-6 shadow-lg shrink-0">
              <h3 className="text-xs uppercase tracking-widest font-bold text-gold-300/70 mb-6">Contact & Location</h3>
              
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-gold-300/10 text-gold-300 shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gold-100/50 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm text-gold-50 font-medium leading-tight">
                      {carer.location || "Location hidden"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-gold-300/0 via-gold-300/10 to-gold-300/0" />

                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-gold-300/10 text-gold-300 shrink-0 shadow-inner">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-gold-100/50 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm text-gold-50 font-medium truncate">
                      {(carer as any).email || "Email hidden"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-gold-300/10 text-gold-300 shrink-0 shadow-inner">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gold-100/50 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm text-gold-50 font-medium leading-tight">
                      {(carer as any).phone || "Phone hidden"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <ReadOnlyAvailabilityCalendar availability={carer.rawAvailability} />
            
          </div>
        </div>

      </div>
    </div>
  );
}
