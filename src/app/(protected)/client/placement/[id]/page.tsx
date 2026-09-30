"use client";

import { useParams, useRouter } from "next/navigation";
import PlacementDetailModal from "../../components/PlacementDetailModal";
import ThinSpinner from "@/components/ThinSpinner";

export default function ClientPlacementRoutePage() {
  const params = useParams();
  const router = useRouter();
  const placementId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  if (!placementId) {
    return <ThinSpinner fullScreen size="xl" text="Loading placement workspace..." />;
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
