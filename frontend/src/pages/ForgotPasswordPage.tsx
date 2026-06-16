import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        alert("ForgotPasswordPage #1");
        return;
      }

      const data = await res.json();
      alert(data.message || "Password reset request sent");
    } catch (error) {
      console.error("ForgotPasswordPage error:", error);
      alert("ForgotPasswordPage #2");
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleForgotPassword}
        className="w-full max-w-md bg-slate-800 p-8 rounded-2xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-cyan-500 text-black py-3 rounded-lg font-bold">
          Send Reset Link
        </button>

        <p className="text-center mt-4">
          <Link to="/login" className="text-cyan-400">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}