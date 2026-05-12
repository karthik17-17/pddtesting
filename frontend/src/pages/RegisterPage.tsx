import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "neurostayUser",
      JSON.stringify(user)
    );

    localStorage.setItem("isLoggedIn", "true");

    alert("Registration successful!");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#071028] flex items-center justify-center px-6">
      <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-5xl font-bold text-white text-center">
          Register
        </h1>

        <form onSubmit={handleRegister} className="mt-8">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none mt-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl px-5 py-4 text-white outline-none mt-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl mt-8"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-cyan-400 ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;