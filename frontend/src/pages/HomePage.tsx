import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;

    try {
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const updated = [searchQuery, ...recent.filter((r: string) => r !== searchQuery)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save search query:", e);
    }

    navigate(`/loading?query=${encodeURIComponent(searchQuery)}`);
  };

  const suggestions = [
    { icon: "🏙️", text: "Cheap AC hotel near Chennai railway station" },
    { icon: "💎", text: "Luxury hotels in Hyderabad with pool" },
    { icon: "💰", text: "Budget rooms in Bangalore under ₹1500" },
    { icon: "✈️", text: "5-star hotels near Mumbai airport" },
    { icon: "🏖️", text: "Beach resorts in Goa under ₹5000" },
    { icon: "🗺️", text: "Hotels near Agra Taj Mahal with AC" },
  ];

  const features = [
    { icon: "🏨", label: "Hotels", desc: "1000+ Properties", color: "from-cyan-500/20 to-cyan-600/10" },
    { icon: "🤖", label: "AI Powered", desc: "Smart Match Score", color: "from-purple-500/20 to-purple-600/10" },
    { icon: "📍", label: "Map View", desc: "Live Location", color: "from-blue-500/20 to-blue-600/10" },
    { icon: "❤️", label: "Wishlist", desc: "Save & Compare", color: "from-pink-500/20 to-pink-600/10" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#071028] flex flex-col relative overflow-hidden">

      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[130px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section — full width */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 py-12 md:py-16">

        {/* Greeting */}
        {user?.name && (
          <div className="mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 backdrop-blur-sm">
            👋 Welcome back, <span className="text-cyan-400 font-semibold">{user.name}</span>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-500 bg-clip-text text-transparent leading-none pb-3 tracking-tight">
            NeuroStay AI
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl mt-4 max-w-2xl mx-auto leading-relaxed">
            Find your perfect hotel with <span className="text-cyan-400 font-semibold">AI-powered</span> smart recommendations
          </p>
        </div>

        {/* Search bar — full width with max */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/30">
            <input
              id="home-search-input"
              type="text"
              placeholder="Try: Cheap AC hotel near Chennai railway station..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              className="flex-1 bg-[#071028] text-white px-5 py-4 rounded-xl outline-none border border-white/10 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600 text-base"
            />
            <button
              id="home-search-btn"
              onClick={() => handleSearch()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-base hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/30 whitespace-nowrap"
            >
              Search with AI ✨
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s.text}
                onClick={() => handleSearch(s.text)}
                className="flex items-center gap-1.5 text-xs md:text-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-all duration-200"
              >
                <span>{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature cards — full width grid */}
        <div className="w-full max-w-5xl mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.label}
              className={`bg-gradient-to-br ${f.color} border border-white/10 hover:border-white/20 rounded-2xl p-5 md:p-6 text-center transition-all duration-300 hover:scale-[1.03] cursor-default backdrop-blur-sm group`}
            >
              <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <p className="text-white font-bold text-sm md:text-base">{f.label}</p>
              <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="w-full max-w-5xl mt-8 flex flex-wrap gap-4 justify-center md:justify-between items-center px-4 py-5 bg-white/3 border border-white/8 rounded-2xl">
          {[
            { label: "Hotels Listed", value: "1,200+" },
            { label: "Cities Covered", value: "50+" },
            { label: "AI Recommendations", value: "Real-time" },
            { label: "User Ratings", value: "4.8 ⭐" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl md:text-2xl font-extrabold text-cyan-400">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}