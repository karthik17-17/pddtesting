function SuggestionChips() {
  const chips = [
    "Budget hotels",
    "WiFi",
    "AC rooms",
    "Near railway station",
    "Family stay",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-5">
      {chips.map((chip) => (
        <button
          key={chip}
          className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

export default SuggestionChips;