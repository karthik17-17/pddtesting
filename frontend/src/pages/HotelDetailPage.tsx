import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/map/MapView";

type Hotel = {
  id: string | number;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviewCount?: number;
  image: string;
  facilities: string[];
  aiMatch: number;
  source?: "google" | "demo";
};

function HotelDetailPage() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const selectedHotel = JSON.parse(
      localStorage.getItem("selectedHotel") || "null"
    );

    setHotel(selectedHotel);
  }, []);

  const saveHotel = () => {
    if (!hotel) return;

    const savedHotels = JSON.parse(
      localStorage.getItem("savedHotels") || "[]"
    );

    const alreadySaved = savedHotels.find(
      (item: Hotel) => item.id === hotel.id
    );

    if (alreadySaved) {
      alert("Hotel already saved");
      return;
    }

    localStorage.setItem(
      "savedHotels",
      JSON.stringify([...savedHotels, hotel])
    );

    alert("Hotel saved successfully");
  };

  const compareHotel = () => {
    if (!hotel) return;

    const compareHotels = JSON.parse(
      localStorage.getItem("compareHotels") || "[]"
    );

    localStorage.setItem(
      "compareHotels",
      JSON.stringify([hotel, ...compareHotels].slice(0, 2))
    );

    navigate("/compare");
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">
          Hotel details not found
        </h1>

        <button
          onClick={() => navigate("/results")}
          className="mt-6 bg-cyan-500 text-black font-bold px-8 py-4 rounded-2xl"
        >
          Back to Results
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-[430px] object-cover rounded-3xl"
      />

      <div className="flex justify-between items-start mt-8">
        <div>
          <h1 className="text-6xl font-bold">{hotel.name}</h1>

          <p className="text-gray-400 text-xl mt-3">
            📍 {hotel.location}
          </p>
        </div>

        <div className="text-right">
          <div className="bg-cyan-500 text-black px-6 py-3 rounded-2xl font-bold text-xl">
            ⭐ {hotel.rating} Rating
          </div>

          <div
            className={`mt-3 px-5 py-2 rounded-xl font-bold ${
              hotel.source === "google"
                ? "bg-green-500 text-black"
                : "bg-yellow-500 text-black"
            }`}
          >
            {hotel.source === "google"
              ? "Google Places"
              : "Demo Data"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={() => navigate(`/booking/${hotel.id}`)}
          className="bg-cyan-500 hover:bg-cyan-400 px-8 py-4 rounded-2xl text-black font-bold"
        >
          Book Now
        </button>

        <button
          onClick={saveHotel}
          className="bg-yellow-500 hover:bg-yellow-400 px-8 py-4 rounded-2xl text-black font-bold"
        >
          💗 Save Hotel
        </button>

        <button
          onClick={compareHotel}
          className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl text-white font-bold"
        >
          Compare Hotel
        </button>

        <button
          onClick={() => navigate("/results")}
          className="bg-slate-700 hover:bg-slate-600 px-8 py-4 rounded-2xl text-white font-bold"
        >
          Back to Results
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-5">
            Facilities
          </h2>

          <ul className="space-y-3 text-gray-300">
            {hotel.facilities.map((facility) => (
              <li key={facility}>✅ {facility}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-5">
            About Hotel
          </h2>

          <p className="text-gray-300 leading-8">
            {hotel.name} is recommended by NeuroStay AI because it
            matches your search preferences based on location,
            facilities, rating, comfort, and travel needs.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-5">
              <p className="text-gray-400">Price</p>
              <h3 className="text-3xl font-bold text-cyan-400">
                {hotel.price}
              </h3>
            </div>

            <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-5">
              <p className="text-gray-400">AI Match</p>
              <h3 className="text-3xl font-bold text-cyan-400">
                {hotel.aiMatch}%
              </h3>
            </div>

            <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-5">
              <p className="text-gray-400">Reviews</p>
              <h3 className="text-3xl font-bold text-cyan-400">
                {hotel.reviewCount || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6 mt-10">
        <h2 className="text-3xl font-bold mb-5">
          Why this hotel?
        </h2>

        <p className="text-gray-300 leading-8">
          This hotel has a strong AI match score because it fits your
          search intent, expected facilities, rating, destination
          preference, and travel needs.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-5">
          Public Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
            <h3 className="text-2xl font-bold">Rahul</h3>
            <p className="text-cyan-400 mt-2">⭐ 4.5</p>
            <p className="text-gray-300 mt-4">
              Clean rooms and good service.
            </p>
          </div>

          <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
            <h3 className="text-2xl font-bold">Priya</h3>
            <p className="text-cyan-400 mt-2">⭐ 4.8</p>
            <p className="text-gray-300 mt-4">
              Great location and comfortable stay.
            </p>
          </div>

          <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
            <h3 className="text-2xl font-bold">Arjun</h3>
            <p className="text-cyan-400 mt-2">⭐ 4.3</p>
            <p className="text-gray-300 mt-4">
              Nice facilities and peaceful environment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-5">
          Hotel Location
        </h2>

        <MapView />
      </div>
    </div>
  );
}

export default HotelDetailPage;