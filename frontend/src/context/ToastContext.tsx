import { createContext, useContext, useState, useCallback, useRef } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message, duration }]);

      timersRef.current[id] = setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss]
  );

  const success = useCallback((title: string, message?: string) => toast("success", title, message), [toast]);
  const error = useCallback((title: string, message?: string) => toast("error", title, message), [toast]);
  const warning = useCallback((title: string, message?: string) => toast("warning", title, message), [toast]);
  const info = useCallback((title: string, message?: string) => toast("info", title, message), [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

// ─── Toast Container & Item ────────────────────────────────────────────────────

const TOAST_STYLES: Record<ToastType, { bar: string; icon: string; bg: string; title: string; ring: string }> = {
  success: {
    bar: "bg-emerald-500",
    icon: "✅",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    title: "text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  error: {
    bar: "bg-red-500",
    icon: "❌",
    bg: "bg-red-500/10 border-red-500/30",
    title: "text-red-400",
    ring: "ring-red-500/20",
  },
  warning: {
    bar: "bg-amber-500",
    icon: "⚠️",
    bg: "bg-amber-500/10 border-amber-500/30",
    title: "text-amber-400",
    ring: "ring-amber-500/20",
  },
  info: {
    bar: "bg-cyan-500",
    icon: "ℹ️",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    title: "text-cyan-400",
    ring: "ring-cyan-500/20",
  },
};

function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      style={{ zIndex: 99999 }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
  const s = TOAST_STYLES[toast.type];

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto w-full
        flex items-start gap-3
        rounded-2xl border backdrop-blur-xl shadow-2xl
        px-4 py-3.5
        ${s.bg}
        ring-1 ${s.ring}
        animate-slide-in
      `}
      style={{
        animation: "slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      }}
    >
      {/* Accent bar */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${s.bar}`} />

      {/* Icon */}
      <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-tight ${s.title}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-slate-500 hover:text-white transition-colors mt-0.5 p-0.5 rounded-lg hover:bg-white/10"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
