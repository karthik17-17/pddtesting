import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "https://neurostay-ai.onrender.com";

type Hotel = {
  id: number;
  name: string;
  address: string;
  rating: number;
  price: string;
  image: string;
  matchScore: number;
  why: string;
  mapLink: string;
};


export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  const rawQuery = searchParams.get("query") || "";

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const res = await fetch(`${API_URL}/api/serpapi/hotels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: rawQuery }),
        });

        if (!res.ok) {
          setHasError(true);
          setHotels([]);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success === true && Array.isArray(data.hotels)) {
          setHotels(data.hotels);
          localStorage.setItem("lastSearchResults", JSON.stringify(data.hotels));
        } else {
          setHasError(true);
          setHotels([]);
        }
      } catch (error) {
        console.error("ResultsPage error:", error);
        setHasError(true);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [rawQuery]);

  const openDetails = (hotel: Hotel) => {
    localStorage.setItem("selectedHotel", JSON.stringify(hotel));
    navigate(`/hotel/${hotel.id}`);
  };

  const saveHotel = async (hotel: Hotel) => {
    try {
      const res = await fetch(`${API_URL}/api/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelName: hotel.name,
          hotelImage: hotel.image,
          price: hotel.price,
          address: hotel.address,
          rating: hotel.rating,
          matchScore: hotel.matchScore,
          why: hotel.why,
          mapLink: hotel.mapLink,
        }),
      });

      if (!res.ok) {
        error("Save Failed", "Could not save hotel. Please try again.");
        return;
      }

      success("Hotel Saved! ❤️", `${hotel.name} has been added to your saved list.`);
    } catch (err) {
      console.error("Save hotel error:", err);
      error("Save Failed", "Could not connect to server. Please try again.");
    }
  };

  const addToCompare = (hotel: Hotel) => {
    const compareHotels = JSON.parse(
      localStorage.getItem("compareHotels") || "[]"
    );

    if (compareHotels.find((item: Hotel) => item.name === hotel.name)) {
      warning("Already Added", `${hotel.name} is already in your compare list.`);
      return;
    }

    localStorage.setItem(
      "compareHotels",
      JSON.stringify([...compareHotels, hotel])
    );

    success("Added to Compare 📊", `${hotel.name} added. Go to Compare page to view.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading real hotels...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#071028] text-white p-4 md:p-8 lg:p-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hotel Recommendations</h1>

      <p className="mb-8">
        Search: <span className="text-cyan-400">{rawQuery}</span>
      </p>

      {hasError ? (
        <p className="text-red-400">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={`${hotel.id}-${hotel.name}`}
              className="bg-slate-800 rounded-2xl overflow-hidden"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">{hotel.name}</h2>
                <p className="text-slate-400 mt-2">{hotel.address}</p>
                <p className="mt-3">⭐ {hotel.rating}</p>
                <p className="text-cyan-400 font-bold mt-2">{hotel.price}</p>

                <p className="mt-3 bg-cyan-500 text-black inline-block px-3 py-2 rounded-lg font-bold">
                  Match Score: {hotel.matchScore}%
                </p>

                <p className="mt-3 text-slate-300">{hotel.why}</p>

                <div className="flex gap-3 mt-5 flex-wrap">
                  <button
                    onClick={() => openDetails(hotel)}
                    className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => saveHotel(hotel)}
                    className="bg-slate-700 px-4 py-2 rounded-lg font-bold"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => addToCompare(hotel)}
                    className="bg-purple-500 px-4 py-2 rounded-lg font-bold"
                  >
                    Compare
                  </button>

                  {hotel.mapLink && (
                    <a
                      href={hotel.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-cyan-500 px-4 py-2 rounded-lg font-bold"
                    >
                      Map
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}