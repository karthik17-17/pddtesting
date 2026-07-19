const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && (window.location.hostname.includes("vercel.app") || window.location.hostname.includes("neurostay-web"))) {
    return "https://neurostay-ai.onrender.com";
  }
  return envUrl || "http://localhost:5000";
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