function ProfilePage() {
  const user = JSON.parse(
    localStorage.getItem("neurostayUser") || "{}"
  );

  const savedHotels = JSON.parse(
    localStorage.getItem("savedHotels") || "[]"
  );

  const searchHistory = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-7xl font-bold mb-10">
        My Profile
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* PROFILE CARD */}
        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8">
          <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center text-5xl font-bold text-black mx-auto">
            {user.name?.charAt(0) || "U"}
          </div>

          <h2 className="text-4xl font-bold text-center mt-6">
            {user.name || "User"}
          </h2>

          <p className="text-gray-400 text-center mt-3 text-lg">
            {user.email || "No Email"}
          </p>

          <div className="bg-cyan-500 text-black font-bold text-center py-3 rounded-2xl mt-8">
            AI Premium Member
          </div>
        </div>

        {/* STATS */}
        <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
          <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8">
            <h3 className="text-3xl font-bold">
              Saved Hotels
            </h3>

            <p className="text-6xl font-bold text-cyan-400 mt-6">
              {savedHotels.length}
            </p>
          </div>

          <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8">
            <h3 className="text-3xl font-bold">
              Search History
            </h3>

            <p className="text-6xl font-bold text-cyan-400 mt-6">
              {searchHistory.length}
            </p>
          </div>

          {/* RECENT SEARCHES */}
          <div className="md:col-span-2 bg-[#1E293B] border border-gray-700 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold">
                Recent Searches
              </h3>

              <button
                onClick={clearHistory}
                className="bg-red-500 hover:bg-red-400 text-white font-bold px-5 py-3 rounded-2xl"
              >
                Clear History
              </button>
            </div>

            {searchHistory.length === 0 ? (
              <p className="text-gray-400">
                No searches yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {searchHistory.map((item: string) => (
                  <div
                    key={item}
                    className="bg-[#0F172A] border border-gray-700 px-5 py-3 rounded-2xl"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;