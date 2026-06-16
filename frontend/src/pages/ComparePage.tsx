import { useEffect, useState } from "react";

interface Hotel {
  id: number;
  name: string;
  address: string;
  rating: number;
  price: string;
  image: string;
  matchScore: number;
  why: string;
}

export default function ComparePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const compareHotels = JSON.parse(
      localStorage.getItem("compareHotels") || "[]"
    );

    setHotels(compareHotels);
  }, []);

  const removeHotel = (name: string) => {
    const updated = hotels.filter((hotel) => hotel.name !== name);
    setHotels(updated);
    localStorage.setItem("compareHotels", JSON.stringify(updated));
  };

  const clearAll = () => {
    localStorage.removeItem("compareHotels");
    setHotels([]);
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-4">Compare Hotels</h1>

      <p className="text-slate-300 mb-8">
        Compare price, rating, AI match score and location.
      </p>

      {hotels.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-3">No hotels selected</h2>

          <p className="text-slate-300">
            Go to Hotels page and click Compare on hotels.
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={clearAll}
            className="bg-red-500 px-5 py-3 rounded-xl font-bold mb-6"
          >
            Clear All
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-slate-800 rounded-2xl overflow-hidden"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-bold">{hotel.name}</h2>

                  <p className="text-slate-400 mt-2">{hotel.address}</p>

                  <p className="mt-3">
                    <span className="text-cyan-400 font-bold">Price:</span>{" "}
                    {hotel.price}
                  </p>

                  <p className="mt-2">
                    <span className="text-cyan-400 font-bold">Rating:</span> ⭐{" "}
                    {hotel.rating}
                  </p>

                  <p className="mt-2">
                    <span className="text-cyan-400 font-bold">AI Match:</span>{" "}
                    {hotel.matchScore}%
                  </p>

                  <p className="text-slate-300 mt-3">{hotel.why}</p>

                  <button
                    onClick={() => removeHotel(hotel.name)}
                    className="mt-5 bg-red-500 px-4 py-2 rounded-lg font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}