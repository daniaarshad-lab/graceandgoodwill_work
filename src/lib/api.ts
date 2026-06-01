const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { headers: callerHeaders, ...restOptions } = options;

  // For FormData bodies the browser must set Content-Type itself (with the
  // multipart boundary), so we only inject the JSON header for all other calls.
  const isFormData = restOptions.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(callerHeaders || {}),
    },
    ...restOptions,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
