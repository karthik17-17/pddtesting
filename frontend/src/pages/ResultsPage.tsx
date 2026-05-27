import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Hotel {
  name: string;
  location: string;
  rating: number;
  price: string;
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/hotels/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
      })
      .catch(console.error);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-6xl font-bold mb-5">
        Hotel Results
      </h1>

      <p className="mb-10">
        Showing AI results for:
        <span className="text-cyan-400">
          {" "}
          "{query}"
        </span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="bg-slate-800 p-5 rounded-xl"
          >
            <h2 className="text-2xl font-bold">
              {hotel.name}
            </h2>

            <p>{hotel.location}</p>

            <p>⭐ {hotel.rating}</p>

            <p>{hotel.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}