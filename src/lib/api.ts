let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Normalize API_URL so it does not contain the /api prefix, as we add it to the endpoint.
if (API_URL.endsWith("/api")) {
  API_URL = API_URL.slice(0, -4);
}
if (API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const localToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");
    if (localToken) return localToken;

    const sessionToken =
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("auth_token");
    if (sessionToken) return sessionToken;

    if (typeof document !== "undefined" && document.cookie) {
      const match = document.cookie.match(
        /(?:^|;\s*)(?:accessToken|token|auth_token)=([^;]+)/,
      );
      if (match) return decodeURIComponent(match[1]);
    }
  } catch (err) {
    console.error("Error retrieving auth token:", err);
  }

  return null;
}

export function getRequiredAuthToken(): string {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No token found");
  }
  return token;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { headers: callerHeaders, ...restOptions } = options;

  // For FormData bodies the browser must set Content-Type itself (with the
  // multipart boundary), so we only inject the JSON header for all other calls.
  const isFormData = restOptions.body instanceof FormData;

  // Inject Authorization token if present and not explicitly set by caller
  const token = getAuthToken();
  const authHeader: Record<string, string> = {};
  if (
    token &&
    (!callerHeaders ||
      !(callerHeaders as Record<string, string>)["Authorization"])
  ) {
    authHeader["Authorization"] = `Bearer ${token}`;
  }

  // Ensure the endpoint starts with /api
  const apiPath = endpoint.startsWith("/api")
    ? endpoint
    : `/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(`${API_URL}${apiPath}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...authHeader,
      ...(callerHeaders || {}),
    },
    ...restOptions,
  });

  // Safely parse JSON — the server may return HTML on 500 errors
  let data: any = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const rawMessage = data?.message;
    const formattedMessage = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : typeof rawMessage === "string"
        ? rawMessage
        : `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(formattedMessage);
  }

  return data;
}
