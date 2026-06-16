import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { warning } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      warning("Empty Search", "Please enter a hotel or location to search.");
      return;
    }

    localStorage.setItem("searchQuery", query);

    try {
      const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const updated = [query, ...recent.filter((q: string) => q !== query)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save search query:", e);
    }

    navigate("/results");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-slate-800 border border-slate-700 p-4 rounded-2xl max-w-3xl mx-auto mt-8"
    >
      <input
        type="text"
        placeholder="Example: Cheap AC hotel in Chennai with WiFi"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
      />

      <button
        type="submit"
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3 rounded-xl"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;