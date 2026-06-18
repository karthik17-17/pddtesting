import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Intercept all fetch requests to automatically bypass localtunnel warning page
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === "string" ? input : (input instanceof Request ? input.url : "");
  if (url && (url.includes("loca.lt") || url.includes("localtunnel"))) {
    init = init || {};
    const headers = new Headers(init.headers || {});
    headers.set("Bypass-Tunnel-Reminder", "true");
    init.headers = headers;
  }
  return originalFetch.call(this, input, init);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);