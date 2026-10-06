"use client";

import { useParams, useRouter } from "next/navigation";
import AdminPlacementDetailModal from "../../components/AdminPlacementDetailModal";
import ThinSpinner from "@/components/ThinSpinner";

export default function AdminPlacementRoutePage() {
  const params = useParams();
  const router = useRouter();
  const placementId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  if (!placementId) {
    return <ThinSpinner fullScreen size="xl" text="Loading placement workspace..." />;
  }

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
