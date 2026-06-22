const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || "https://neurostay-ai.onrender.com/api";
  if (url.includes("localhost") || url.includes("127.0.0.1") || url.includes("10.34.36.17")) {
    url = "https://neurostay-ai.onrender.com/api";
  }
  if (url.endsWith("/api")) {
    url = url.substring(0, url.length - 4);
  }
  return url;
};

const API_URL = getApiUrl();

export async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error("api.ts backend not connected");
  }

  return response.json();
}

export default API_URL;