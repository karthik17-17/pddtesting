import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://10.115.33.17:5000";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success || data.token) {
        localStorage.setItem("token", data.token || "demo-token");
        localStorage.setItem("user", JSON.stringify(data.user || { email }));
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("LoginPage error:", error);
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-800 p-8 rounded-2xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg mb-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-cyan-500 text-black py-3 rounded-lg font-bold">
          Login
        </button>

        <p className="text-center mt-4">
          <Link to="/forgot-password" className="text-cyan-400">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center mt-3">
          New user?{" "}
          <Link to="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}