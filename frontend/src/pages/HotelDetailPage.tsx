import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  rating: number;
  price: string;
  image: string;
  latitude: number | null;
  longitude: number | null;
  source: string;
  website: string;
  matchScore: number;
  why: string;
  mapLink: string;
}

export default function HotelDetailPage() {
  const navigate = useNavigate();
  const { success, error, warning } = useToast();
  const { token } = useAuth();

  const hotel: Hotel | null = JSON.parse(
    localStorage.getItem("selectedHotel") || "null"
  );

  if (!hotel) {
    return (
      <div className="min-h-screen w-full bg-[#071028] text-white p-6 md:p-8">
        <h1 className="text-4xl font-bold mb-4">Hotel not found</h1>

        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 font-bold bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
        >
          ← Back to Results
        </button>
      </div>
    );
  }

  const saveHotel = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}/api/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

    const data = await res.json();

    if (!res.ok) {
      error("Save Failed", data.message || "Could not save hotel.");
      return;
    }

    success("Hotel Saved! ❤️", `${hotel.name} added to your saved list.`);
  };

  const addToCompare = () => {
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

  return (
    <div className="min-h-screen w-full bg-[#071028] text-white p-6 md:p-8 lg:p-10">
      <button
        onClick={() => navigate(-1)}
        className="text-cyan-400 font-bold bg-transparent border-none p-0 cursor-pointer outline-none hover:underline"
      >
        ← Back to Results
      </button>

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-[430px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-[430px] bg-slate-800 flex flex-col items-center justify-center text-slate-500 ${hotel.image ? 'hidden' : ''}`}>
             <span className="text-6xl mb-4">🏨</span>
             <p className="text-xl font-semibold">Image not available</p>
          </div>

          {/* Removed fake image thumbnail grid here to prevent showing hallucinations */}

          <div className="p-8">
            <h1 className="text-5xl font-bold">{hotel.name}</h1>

            <p className="text-slate-300 mt-4 text-lg">
              📍 {hotel.address || "Address not available"}
            </p>

            <div className="flex flex-wrap gap-4 mt-5">
              <span className="bg-slate-700 px-4 py-2 rounded-xl">
                ⭐ {hotel.rating} Rating
              </span>

              <span className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-bold">
                AI Match {hotel.matchScore}%
              </span>

              <span className="bg-slate-700 px-4 py-2 rounded-xl">
                Best for budget stay
              </span>
            </div>

            <p className="text-4xl text-cyan-400 font-bold mt-8">
              {hotel.price}
            </p>

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-4">Facilities</h2>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-slate-700 p-4 rounded-xl">✅ Free WiFi</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ AC Rooms</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ Parking</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ Safe Stay</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ Restaurant</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ Room Service</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ Family Stay</div>
                <div className="bg-slate-700 p-4 rounded-xl">✅ 24/7 Support</div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl mt-8">
              <h2 className="text-3xl font-bold mb-3">Why this hotel?</h2>

              <p className="text-slate-300 text-lg">
                {hotel.why ||
                  "Recommended based on location, price, rating and guest preference."}
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl mt-8">
              <h2 className="text-3xl font-bold mb-4">Guest Reviews</h2>

              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl">
                  ⭐⭐⭐⭐⭐ Excellent location and comfortable stay.
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  ⭐⭐⭐⭐ Good value for money and friendly staff.
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  ⭐⭐⭐⭐ Clean rooms and easy access to transport.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl p-6 h-fit sticky top-8">
          <h2 className="text-3xl font-bold mb-4">Booking Summary</h2>

          <p className="text-slate-300">Price per night</p>
          <p className="text-4xl text-cyan-400 font-bold mt-2">
            {hotel.price}
          </p>

          <div className="bg-slate-900 rounded-2xl p-5 mt-6">
            <p>⭐ Rating: {hotel.rating}</p>
            <p className="mt-2">🧠 AI Match: {hotel.matchScore}%</p>
            <p className="mt-2">🏨 Recommended Stay</p>
          </div>

          <button
            onClick={saveHotel}
            className="w-full bg-slate-700 hover:bg-slate-600 py-4 rounded-xl font-bold mt-4"
          >
            Save Hotel
          </button>

          <button
            onClick={addToCompare}
            className="w-full bg-purple-500 hover:bg-purple-400 py-4 rounded-xl font-bold mt-4"
          >
            Add to Compare
          </button>

          {hotel.website && (
            <a
              href={hotel.website}
              target="_blank"
              rel="noreferrer"
              className="block text-center border border-cyan-500 py-4 rounded-xl font-bold mt-4"
            >
              Visit Website
            </a>
          )}

          {hotel.mapLink && (
            <a
              href={hotel.mapLink}
              target="_blank"
              rel="noreferrer"
              className="block text-center border border-slate-500 py-4 rounded-xl font-bold mt-4"
            >
              Open Map
            </a>
          )}

          <div className="mt-8 text-sm text-slate-500 text-center">
            Data sourced via: <span className="font-semibold">{hotel.source || "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}