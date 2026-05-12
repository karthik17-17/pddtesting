import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const hotels = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    location: "Chennai",
    price: "₹2500",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Goa",
    price: "₹4200",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    id: 3,
    name: "Mountain Stay Inn",
    location: "Ooty",
    price: "₹3100",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
];

function SavedPage() {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedHotels") || "[]");
    setSavedIds(saved);
  }, []);

  const savedHotels = hotels.filter((hotel) => savedIds.includes(hotel.id));

  const removeHotel = (id: number) => {
    const updated = savedIds.filter((hotelId) => hotelId !== id);
    setSavedIds(updated);
    localStorage.setItem("savedHotels", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white px-8 py-10">
      <h1 className="text-6xl font-bold mb-10">Saved Hotels</h1>

      {savedHotels.length === 0 ? (
        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold">No saved hotels yet</h2>
          <p className="text-gray-400 mt-4">
            Save hotels from the Results page.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {savedHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-[#1E293B] rounded-3xl overflow-hidden border border-gray-700"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-[240px] object-cover"
              />

              <div className="p-6">
                <h2 className="text-3xl font-bold">{hotel.name}</h2>

                <p className="text-gray-400 mt-2">📍 {hotel.location}</p>

                <div className="flex justify-between items-center mt-6">
                  <p className="text-cyan-400 text-2xl font-bold">
                    {hotel.price}
                  </p>

                  <div className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-bold">
                    ⭐ {hotel.rating}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl"
                >
                  View Details
                </button>

                <button
                  onClick={() => removeHotel(hotel.id)}
                  className="w-full mt-4 bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-2xl"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPage;