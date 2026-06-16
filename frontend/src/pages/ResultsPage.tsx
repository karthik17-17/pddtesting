import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://10.115.33.17:5000";

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

function buildHotelQuery(input: string) {
  const text = input.toLowerCase();

  const cities = ["chennai", "hyderabad", "bangalore", "mumbai", "delhi", "pune", "kolkata", "goa"];
  const city = cities.find((c) => text.includes(c)) || input;

  let budget = "";
  if (text.includes("high cost") || text.includes("luxury") || text.includes("premium")) {
    budget = "luxury";
  } else if (text.includes("low cost") || text.includes("cheap") || text.includes("budget")) {
    budget = "budget";
  }

  return `${budget} hotels in ${city}`.trim();
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawQuery = searchParams.get("query") || "Chennai";
  const query = buildHotelQuery(rawQuery);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${API_URL}/api/serpapi/hotels`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) {
          alert("ResultsPage #1");
          setHotels([]);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success === true && Array.isArray(data.hotels) && data.hotels.length > 0) {
          setHotels(data.hotels);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error("ResultsPage error:", error);
        alert("ResultsPage #2");
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [query]);

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
        alert("ResultsPage save #1");
        return;
      }

      alert("Hotel saved");
    } catch (error) {
      console.error("Save hotel error:", error);
      alert("ResultsPage save #2");
    }
  };

  const addToCompare = (hotel: Hotel) => {
    const compareHotels = JSON.parse(
      localStorage.getItem("compareHotels") || "[]"
    );

    if (compareHotels.find((item: Hotel) => item.name === hotel.name)) {
      alert("Hotel already added");
      return;
    }

    localStorage.setItem(
      "compareHotels",
      JSON.stringify([...compareHotels, hotel])
    );

    alert("Hotel added to compare");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading real hotels...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">Hotel Recommendations</h1>

      <p className="mb-8">
        Search: <span className="text-cyan-400">{query}</span>
      </p>

      {hotels.length === 0 ? (
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