import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;

    navigate(`/loading?query=${query}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-screen flex flex-col justify-start md:justify-center bg-[#0F172A] px-4 md:px-6 py-6 md:py-0">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl">

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            NeuroStay AI
          </h1>

          <p className="text-slate-300 text-xl mb-10">
            Discover hotels with AI-powered recommendations
          </p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl p-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Cheap AC hotel near Chennai railway station..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 bg-[#0F172A] text-white px-5 py-4 rounded-xl outline-none border border-white/10"
          />

          <button
            onClick={handleSearch}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:scale-105 duration-300"
          >
            Search with AI
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="bg-[#1E293B] rounded-2xl p-4 text-center">
            🏨
            <p className="mt-2 text-slate-300">Hotels</p>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-4 text-center">
            ⭐
            <p className="mt-2 text-slate-300">AI Match Score</p>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-4 text-center">
            📍
            <p className="mt-2 text-slate-300">Map View</p>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-4 text-center">
            ❤️
            <p className="mt-2 text-slate-300">Wishlist</p>
          </div>
        </div>
      </div>
    </div>
  );
}