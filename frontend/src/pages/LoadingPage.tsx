import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoadingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const messages = [
    "🧠 Understanding your request...",
    "🔍 Searching hotels...",
    "⭐ Calculating AI match scores...",
    "📍 Finding nearby locations...",
    "✨ Preparing recommendations..."
  ];

  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    const timer = setTimeout(() => {
      navigate(`/results?query=${query}`);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, query]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-10 text-center shadow-2xl">

        <div className="w-24 h-24 mx-auto rounded-full border-4 border-cyan-400 border-t-purple-500 animate-spin mb-8"></div>

        <h1 className="text-4xl font-bold text-white mb-8">
          NeuroStay AI
        </h1>

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 transition-all duration-500 ${
                index <= step
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-[#1E293B] text-slate-500"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        <p className="text-slate-400 mt-8">
          Finding the perfect hotel for you...
        </p>
      </div>
    </div>
  );
}