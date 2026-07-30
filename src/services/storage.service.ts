import { apiFetch } from "@/lib/api";

/**
 * Checks if a key or URL refers to a profile picture or introductory video.
 * Exception rule: Profile pics and intro videos use direct URLs and do not require pre-signed URLs.
 */
export function isProfilePicOrIntroVideo(keyOrUrl: string): boolean {
  if (!keyOrUrl) return false;
  const lower = keyOrUrl.toLowerCase();
  return (
    lower.includes("/photos/") ||
    lower.includes("/pending-photos/") ||
    lower.includes("/videos/") ||
    lower.includes("/pending-videos/") ||
    lower.includes("profilephoto") ||
    lower.includes("introvideo") ||
    lower.includes("avatar")
  );
}

/**
 * Helper to extract S3 object key from full S3 URLs, local host URLs, or key paths.
 */
export function extractS3Key(keyOrUrl: string): string {
  if (!keyOrUrl) return "";

  // If Amazon S3 URL
  if (keyOrUrl.includes(".amazonaws.com/")) {
    const key = keyOrUrl.split(".amazonaws.com/")[1];
    return key ? key.split("?")[0] : "";
  }

  // If full HTTP/HTTPS URL
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    try {
      const urlObj = new URL(keyOrUrl);
      const path = urlObj.pathname.replace(/^\//, "");
      return path.split("?")[0];
    } catch {
      const parts = keyOrUrl.split("/");
      const uploadIdx = parts.findIndex((p) =>
        ["carers", "clients", "internal-notes", "referrals", "documents", "uploads"].includes(p)
      );
      if (uploadIdx !== -1) {
        return parts.slice(uploadIdx).join("/").split("?")[0];
      }
    }
  }

  // If relative path
  return keyOrUrl.replace(/^\//, "").split("?")[0];
}

/**
 * Service for managing cloud S3 object presigned URLs
 */
export const storageService = {
  /**
   * Fetches a short-lived presigned URL for any document preview.
   * EXCEPTION: Profile pictures and intro videos are returned directly as un-signed URLs.
   */
  async getPresignedUrl(keyOrUrl: string, expiresIn?: number): Promise<string> {
    if (!keyOrUrl) return "";

    // If it's already a blob URL or signed URL with signature query params, return as-is
    if (
      keyOrUrl.startsWith("blob:") ||
      keyOrUrl.includes("X-Amz-Signature") ||
      keyOrUrl.includes("Signature=") ||
      keyOrUrl.includes("Amz-Credential")
    ) {
      return keyOrUrl;
    }

    const key = extractS3Key(keyOrUrl);
    if (!key) return keyOrUrl;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;

    try {
      const queryParams = new URLSearchParams({ key });
      if (expiresIn) {
        queryParams.append("expiresIn", expiresIn.toString());
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await apiFetch(`/storage/presigned-url?${queryParams.toString()}`, {
        headers,
      });
      return response?.presignedUrl || keyOrUrl;
    } catch (error) {
      console.error("[storageService] Error fetching presigned URL for key:", key, error);
      return keyOrUrl;
    }
  },
};
