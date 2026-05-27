import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  source?: string;
};

function ResultsPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const query =
    searchParams.get("query") || "hotels in Chennai";

  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, [query]);

  const fetchHotels = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/places/search",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      setHotels(data.results || []);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const openHotel = (hotel: Hotel) => {
    localStorage.setItem(
      "selectedHotel",
      JSON.stringify(hotel)
    );

    navigate(`/hotel/${hotel.id}`);
  };

  const saveHotel = (hotel: Hotel) => {
    const savedHotels = JSON.parse(
      localStorage.getItem("savedHotels") || "[]"
    );

    const exists = savedHotels.find(
      (item: Hotel) => item.id === hotel.id
    );

    if (exists) {
      alert("Already saved");
      return;
    }

    localStorage.setItem(
      "savedHotels",
      JSON.stringify([
        ...savedHotels,
        hotel,
      ])
    );

    alert("Hotel saved");
  };

  const compareHotel = (hotel: Hotel) => {
    const compare = JSON.parse(
      localStorage.getItem(
        "compareHotels"
      ) || "[]"
    );

    localStorage.setItem(
      "compareHotels",
      JSON.stringify([
        ...compare,
        hotel,
      ])
    );

    navigate("/compare");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold text-cyan-400">
          Loading hotels...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">

      <h1 className="text-7xl font-bold">
        Hotel Results
      </h1>

      <p className="text-2xl mt-4 mb-10">

        Showing AI results for:

        <span className="text-cyan-400 font-bold">
          {" "}
          "{query}"
        </span>

      </p>

      <div className="grid md:grid-cols-3 gap-8">

        {hotels.map((hotel) => (

          <div
            key={hotel.id}
            className="bg-[#1E293B] rounded-3xl overflow-hidden border border-gray-700"
          >

            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">

              <div className="flex justify-between mb-5">

                <div className="border border-cyan-400 text-cyan-400 px-4 py-2 rounded-xl font-bold">
                  AI Match:
                  {hotel.aiMatch}%
                </div>

                <div className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold">

                  {hotel.source ===
                  "google"
                    ? "Google Places"
                    : "Real Hotel"}

                </div>

              </div>

              <h2 className="text-4xl font-bold">
                {hotel.name}
              </h2>

              <p className="text-gray-400 mt-3">
                📍 {hotel.location}
              </p>

              <div className="bg-[#0F172A] border border-gray-700 rounded-2xl p-4 mt-5">

                <h3 className="text-cyan-400 text-xl font-bold">

                  Why this hotel?

                </h3>

                <p className="text-gray-300 mt-3">

                  Matches your search
                  based on location,
                  facilities, rating
                  and travel needs.

                </p>

              </div>

              <div className="flex flex-wrap gap-2 mt-5">

                {hotel.facilities
                  ?.slice(0, 4)
                  .map(
                    (
                      facility
                    ) => (

                      <span
                        key={
                          facility
                        }
                        className="bg-[#0F172A] px-3 py-2 rounded-xl border border-gray-700 text-sm"
                      >

                        {
                          facility
                        }

                      </span>
                    )
                  )}

              </div>

              <div className="flex justify-between items-center mt-6">

                <p className="text-cyan-400 text-3xl font-bold">

                  {hotel.price}

                </p>

                <div className="bg-cyan-500 text-black px-4 py-3 rounded-xl font-bold">

                  ⭐
                  {
                    hotel.rating
                  }

                </div>

              </div>

              <p className="text-gray-400 mt-3">

                {
                  hotel.reviewCount
                }{" "}

                reviews

              </p>

              <button
                onClick={() =>
                  openHotel(
                    hotel
                  )
                }
                className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-bold mt-5"
              >

                View Details

              </button>

              <button
                onClick={() =>
                  saveHotel(
                    hotel
                  )
                }
                className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-bold mt-4"
              >

                Save Hotel

              </button>

              <button
                onClick={() =>
                  compareHotel(
                    hotel
                  )
                }
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold mt-4"
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