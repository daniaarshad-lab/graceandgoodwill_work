"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PlacementDetailModal from "@/app/(protected)/client/components/PlacementDetailModal";
import AdminPlacementDetailModal from "@/app/(protected)/admin/components/AdminPlacementDetailModal";
import ThinSpinner from "@/components/ThinSpinner";

export default function PlacementDetailsRoutePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const placementId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  if (isLoading || !user) {
    return <ThinSpinner fullScreen size="xl" text="Loading placement workspace..." />;
  }

  if (!placementId) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-rose-400 font-semibold mb-4">No placement ID specified.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-navy-900 border border-gold-300/30 text-gold-200 rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <AdminPlacementDetailModal
        placementId={placementId}
        onClose={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/admin?tab=placements");
          }
        }}
      />
    );
  }

  return (
    <PlacementDetailModal
      placementId={placementId}
      isPage={true}
      onClose={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/client?tab=applications");
        }
      }}
    />
  );
}
