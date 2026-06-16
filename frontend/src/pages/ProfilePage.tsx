import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [totalBookings, setTotalBookings] = useState(0);
  const [savedHotels, setSavedHotels] = useState(0);

  const recentSearches = JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );

  useEffect(() => {
    fetch(`${API_URL}/api/bookings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTotalBookings(data.bookings.length);
      });

    fetch(`${API_URL}/api/saved`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSavedHotels(data.hotels.length);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-8">Profile Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg text-slate-300">Total Bookings</h2>
          <p className="text-4xl font-bold text-cyan-400">{totalBookings}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg text-slate-300">Saved Hotels</h2>
          <p className="text-4xl font-bold text-cyan-400">{savedHotels}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg text-slate-300">Account Status</h2>
          <p className="text-4xl font-bold text-green-400">Active</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-5">Account Details</h2>

          <p className="mb-3">
            <span className="text-cyan-400 font-bold">Name:</span>{" "}
            {user?.name}
          </p>

          <p className="mb-3">
            <span className="text-cyan-400 font-bold">Email:</span>{" "}
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 px-6 py-3 rounded-xl font-bold"
          >
            Logout
          </button>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-5">Recent Searches</h2>

          {recentSearches.length === 0 ? (
            <p className="text-slate-400">No recent searches yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSearches.slice(0, 6).map((search: string, index: number) => (
                <div
                  key={index}
                  className="bg-slate-700 p-3 rounded-xl text-slate-200"
                >
                  🔍 {search}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}