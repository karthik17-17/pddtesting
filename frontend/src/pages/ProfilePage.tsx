import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "https://neurostay-ai.onrender.com";

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  const [totalBookings, setTotalBookings] = useState(0);
  const [savedHotels, setSavedHotels] = useState(0);

  const rawSearches: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    } catch {
      return [];
    }
  })();
  const uniqueSearches = Array.from(new Set(rawSearches)).slice(0, 5);

  useEffect(() => {
    fetch(`${API_URL}/api/bookings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTotalBookings(data.bookings.length);
      })
      .catch(() => {});

    fetch(`${API_URL}/api/saved`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSavedHotels(data.hotels.length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen w-full bg-[#071028] text-white p-4 md:p-8 lg:p-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Profile Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage your account and view your activity</p>
        </div>

        {/* Top Row: Account Details + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">

          {/* Account Details */}
          <div className="md:col-span-1 bg-gradient-to-b from-[#1F2937] to-[#162032] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-4">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                {getInitials(user?.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name || "User"}</h2>
                <p className="text-xs text-slate-400 break-all">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <button
                id="edit-profile-btn"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold transition text-sm"
                onClick={() => info("Coming Soon", "Edit Profile feature will be available soon!")}
              >
                ✏️ Edit Profile
              </button>
              <button
                id="change-password-btn"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-semibold transition text-sm"
                onClick={() => info("Coming Soon", "Change Password feature will be available soon!")}
              >
                🔒 Change Password
              </button>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="w-full bg-red-600/80 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition text-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            {/* Total Bookings */}
            <div className="bg-[#1F2937] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
              <div className="text-3xl mb-2">🧾</div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Bookings</p>
                <p className="text-5xl font-extrabold text-cyan-400 mt-1">{totalBookings}</p>
              </div>
            </div>

            {/* Saved Hotels */}
            <div className="bg-[#1F2937] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
              <div className="text-3xl mb-2">❤️</div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Saved Hotels</p>
                <p className="text-5xl font-extrabold text-cyan-400 mt-1">{savedHotels}</p>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-[#1F2937] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
              <div className="text-3xl mb-2">✅</div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Account Status</p>
                <p className="text-3xl font-extrabold text-green-400 mt-1">Active</p>
                <span className="inline-block mt-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-[#1F2937] border border-white/10 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">🔍 Recent Searches</h2>
            {uniqueSearches.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem("recentSearches");
                  window.location.reload();
                }}
                className="text-xs text-red-400 hover:text-red-300 transition font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {uniqueSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-3">
              <div className="text-4xl">🔍</div>
              <p className="text-sm">No recent searches yet</p>
              <p className="text-xs text-slate-600">Your search history will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {uniqueSearches.map((search: string, index: number) => (
                <button
                  key={index}
                  onClick={() => navigate(`/loading?query=${encodeURIComponent(search)}`)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 px-4 py-3 rounded-xl text-left text-slate-200 text-sm transition-all duration-200 group"
                >
                  <span className="text-slate-500 group-hover:text-cyan-400 transition">🕐</span>
                  <span className="flex-1">{search}</span>
                  <span className="text-slate-600 group-hover:text-cyan-400 text-xs transition">Search again →</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}