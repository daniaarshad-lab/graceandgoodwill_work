let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Normalize API_URL so it does not contain the /api prefix, as we add it to the endpoint.
if (API_URL.endsWith("/api")) {
  API_URL = API_URL.slice(0, -4);
}
if (API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { headers: callerHeaders, ...restOptions } = options;

  // For FormData bodies the browser must set Content-Type itself (with the
  // multipart boundary), so we only inject the JSON header for all other calls.
  const isFormData = restOptions.body instanceof FormData;

  // Ensure the endpoint starts with /api
  const apiPath = endpoint.startsWith("/api") ? endpoint : `/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(`${API_URL}${apiPath}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
    throw new Error(data?.message || `HTTP Error ${response.status}: ${response.statusText}`);
  }

  return data;
}
