const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { headers: callerHeaders, ...restOptions } = options;

  // For FormData bodies the browser must set Content-Type itself (with the
  // multipart boundary), so we only inject the JSON header for all other calls.
  const isFormData = restOptions.body instanceof FormData;

  const fullUrl = `${API_URL}${endpoint}`;

  const response = await fetch(fullUrl, {
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
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return data;
}
