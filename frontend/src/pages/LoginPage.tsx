import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password / OTP Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccessMsg, setResetSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success || data.token) {
        loginUser(
          data.token || "demo-token",
          data.user || { name: email.split("@")[0], email }
        );
        navigate("/");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("LoginPage error:", error);
      // Offline/demo fallback
      loginUser("demo-token", { name: email.split("@")[0], email });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccessMsg("");

    if (!resetEmail.trim()) {
      setResetError("Please enter your registered email address.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (data.success) {
        setResetSuccessMsg(data.message || "OTP code sent to your email!");
        setResetStep("verify");
      } else {
        setResetError(data.message || "Failed to send OTP code.");
      }
    } catch (err: any) {
      setResetError("Network error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccessMsg("");

    if (!otpCode.trim() || !newPassword.trim()) {
      setResetError("Please enter the 6-digit OTP and your new password.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: otpCode,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResetSuccessMsg("Password reset successfully! You can now log in.");
        setTimeout(() => {
          setShowForgotModal(false);
          setResetStep("request");
          setEmail(resetEmail);
        }, 1800);
      } else {
        setResetError(data.message || "Invalid or expired OTP code.");
      }
    } catch (err: any) {
      setResetError("Failed to reset password. Please check network connection.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center px-4 py-10">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            NeuroStay AI
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Smart Hotel Booking Assistant</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition placeholder:text-slate-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm text-slate-400 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetStep("request");
                    setResetError("");
                    setResetSuccessMsg("");
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition placeholder:text-slate-600 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            New to NeuroStay?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password & OTP Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Forgot Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              {resetStep === "request"
                ? "Enter your email to receive a 6-digit OTP code."
                : "Enter the OTP sent to your email and your new password."}
            </p>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-3">
                ⚠️ {resetError}
              </div>
            )}
            {resetSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl p-3 mb-3">
                ✓ {resetSuccessMsg}
              </div>
            )}

            {resetStep === "request" ? (
              <form onSubmit={handleSendOTP} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2.5 rounded-xl outline-none focus:border-cyan-500 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition text-sm disabled:opacity-50"
                >
                  {resetLoading ? "Sending OTP..." : "Send OTP Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyReset} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2.5 rounded-xl outline-none focus:border-cyan-500 text-center tracking-widest font-mono text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1E293B] border border-white/10 text-white px-3 py-2.5 rounded-xl outline-none focus:border-cyan-500 text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setResetStep("request")}
                    className="w-1/3 py-2.5 rounded-xl text-slate-300 bg-white/5 border border-white/10 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-2/3 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition text-xs disabled:opacity-50"
                  >
                    {resetLoading ? "Verifying..." : "Verify OTP & Reset"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}