import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";



interface SavedHotel {
  _id: string;
  hotelName: string;
  hotelImage: string;
  price: string;
  rating: number;
}

export default function AdminDashboardPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [savedHotels, setSavedHotels] = useState<SavedHotel[]>([]);

  useEffect(() => {

    fetchSavedHotels();
  }, []);



  const fetchSavedHotels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setSavedHotels(data.hotels);
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-8 rounded-3xl">
          <h2 className="text-xl">Saved Hotels</h2>

          <p className="text-5xl text-green-400 font-bold mt-4 pl-1">
            {savedHotels.length}
          </p>
        </div>
      </div>



      {/* Saved Hotels */}
      <h2 className="text-3xl font-bold mb-6">
        Saved Hotels
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {savedHotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-slate-800 rounded-3xl overflow-hidden"
          >
            <img
              src={hotel.hotelImage}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-2xl font-bold">
                {hotel.hotelName}
              </h2>

              <p className="mt-3">
                ⭐ {hotel.rating}
              </p>

              <p className="text-cyan-400 font-bold mt-2">
                {hotel.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}