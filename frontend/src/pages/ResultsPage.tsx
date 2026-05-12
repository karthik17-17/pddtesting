import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "hotels in Chennai";

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/places/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          }
        );

        const data = await response.json();
        setHotels(data.results || []);
      } catch (error) {
        console.log("Frontend fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [query]);

  const saveHotel = (hotel: Hotel) => {
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

  const compareHotel = (hotel: Hotel) => {
    const otherHotel =
      hotels.find((item) => item.id !== hotel.id) || hotel;

    localStorage.setItem(
      "compareHotels",
      JSON.stringify([hotel, otherHotel])
    );

    window.location.href = "/compare";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        <h1 className="text-5xl font-bold text-cyan-400">
          Fetching hotels...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-7xl font-bold mb-4">
        Hotel Results
      </h1>

      <p className="text-2xl text-gray-300 mb-10">
        Showing AI results for:{" "}
        <span className="text-cyan-400 font-bold">
          "{query}"
        </span>
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-[#1E293B] border border-gray-700 rounded-3xl overflow-hidden"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="border border-cyan-400 text-cyan-400 px-4 py-2 rounded-xl font-bold">
                  AI Match: {hotel.aiMatch}%
                </div>

                <div
                  className={`px-4 py-2 rounded-xl font-bold ${
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

              <h2 className="text-4xl font-bold">
                {hotel.name}
              </h2>

              <p className="text-gray-400 text-lg mt-3">
                📍 {hotel.location}
              </p>

              <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-4 mt-5">
                <h3 className="text-cyan-400 font-bold text-xl">
                  Why this hotel?
                </h3>

                <p className="text-gray-300 mt-2">
                  Matches your search based on location,
                  rating, facilities, and travel needs.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {hotel.facilities?.slice(0, 4).map((facility) => (
                  <span
                    key={facility}
                    className="bg-[#0F172A] border border-gray-700 px-3 py-2 rounded-xl text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-7">
                <p className="text-cyan-400 text-3xl font-bold">
                  {hotel.price}
                </p>

                <p className="bg-cyan-500 text-black px-4 py-3 rounded-xl font-bold">
                  ⭐ {hotel.rating}
                </p>
              </div>

              {hotel.reviewCount !== undefined && (
                <p className="text-gray-400 mt-3">
                  {hotel.reviewCount} public reviews
                </p>
              )}

              <Link
                to={`/hotel/${hotel.id}`}
                className="block text-center w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl mt-6"
              >
                View Details
              </Link>

              <button
                onClick={() => saveHotel(hotel)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl mt-4"
              >
                💗 Save Hotel
              </button>

              <button
                onClick={() => compareHotel(hotel)}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl mt-4"
              >
                Compare Hotel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;