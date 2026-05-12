import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter your hotel search");
      return;
    }

    const history = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );

    const updatedHistory = [
      query,
      ...history.filter((item: string) => item !== query),
    ].slice(0, 5);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedHistory)
    );

    navigate(`/loading?query=${encodeURIComponent(query)}`);
  };

  const suggestions = [
    "Budget hotels",
    "WiFi",
    "AC rooms",
    "Near railway station",
    "Family stay",
  ];

  return (
    <div className="min-h-screen bg-[#071028] text-white overflow-hidden">
      <div className="absolute top-32 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      <section className="relative max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-5 py-3 rounded-full text-cyan-300 mb-8">
          ✨ AI-powered hotel discovery
        </div>

        <h1 className="text-7xl md:text-8xl font-bold leading-tight">
          Find Your Perfect Stay with{" "}
          <span className="text-cyan-400">NeuroStay AI</span>
        </h1>

        <p className="text-gray-300 text-xl mt-8 max-w-3xl mx-auto leading-8">
          Describe your ideal hotel in natural language.
          NeuroStay AI understands your budget, location,
          facilities, ratings, and travel needs.
        </p>

        <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Example: Cheap AC hotel in Chennai with WiFi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#0F172A] border border-gray-700 rounded-2xl px-6 py-5 text-white text-lg outline-none focus:border-cyan-400"
            />

            <button
              onClick={handleSearch}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-5 rounded-2xl text-lg"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className="bg-[#0F172A]/80 border border-gray-700 hover:border-cyan-400 px-5 py-3 rounded-full text-gray-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-cyan-400">
              92%
            </h3>
            <p className="text-gray-300 mt-2">
              AI Match Scoring
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-cyan-400">
              Smart
            </h3>
            <p className="text-gray-300 mt-2">
              Natural Language Search
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-cyan-400">
              Fast
            </h3>
            <p className="text-gray-300 mt-2">
              Hotel Recommendations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;