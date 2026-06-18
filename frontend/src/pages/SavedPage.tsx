import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface SavedHotel {
  _id: string;
  hotelName: string;
  hotelImage: string;
  price: string;
  address: string;
  rating: number;
  matchScore: number;
  why: string;
  mapLink: string;
}

export default function SavedPage() {
  const [hotels, setHotels] = useState<SavedHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const { token } = useAuth();

  const fetchSavedHotels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setHotels(data.hotels);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedHotels();
  }, []);

  const removeHotel = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/saved/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        success("Hotel Removed", "Hotel has been removed from your saved list.");
        fetchSavedHotels();
      }
    } catch (err) {
      console.error(err);
      error("Remove Failed", "Could not remove hotel. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#071028] text-white flex justify-center items-center">
        <h1 className="text-3xl font-bold">Loading Saved Hotels...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#071028] text-white p-6 md:p-8 lg:p-10">
      <h1 className="text-5xl font-bold mb-8">
        Saved Hotels
      </h1>

      {hotels.length === 0 ? (
        <p className="text-gray-400 text-xl">
          No saved hotels found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={hotel.hotelImage}
                alt={hotel.hotelName}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">
                  {hotel.hotelName}
                </h2>

                <p className="text-slate-400 mt-2">
                  {hotel.address}
                </p>

                <p className="mt-3">
                  ⭐ {hotel.rating}
                </p>

                <p className="text-cyan-400 font-bold mt-2">
                  {hotel.price}
                </p>

                <div className="mt-4 bg-cyan-500 text-black px-3 py-2 rounded-lg inline-block font-bold">
                  Match Score: {hotel.matchScore}%
                </div>

                <p className="mt-4 text-gray-300">
                  {hotel.why}
                </p>

                <div className="flex gap-3 mt-5">
                  <a
                    href={hotel.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-cyan-500 px-4 py-2 rounded-lg text-black font-bold"
                  >
                    Open Map
                  </a>

                  <button
                    onClick={() => removeHotel(hotel._id)}
                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}