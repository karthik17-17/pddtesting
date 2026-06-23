const API_URL = import.meta.env.VITE_API_URL;

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