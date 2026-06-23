import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

type Hotel = {
  id: number;
  name: string;
  address: string;
  city?: string;
  rating: number;
  price: string;
  image: string;
  lat: number | null;
  lng: number | null;
  latitude?: number | null;
  longitude?: number | null;
  source?: string;
  website?: string;
  matchScore: number;
  why: string;
  mapLink: string;
};

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();
  const { token } = useAuth();

  const urlQuery = searchParams.get("query");
  const storedQuery = localStorage.getItem("lastSearchQuery") || "";
  const rawQuery = urlQuery || storedQuery || "Mumbai";

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setHasError(false);
      setErrorMessage("");
      try {
        const targetUrl = `${API_URL}/api/serpapi/hotels`;
        console.log("ResultsPage: Initiating hotel search for query:", rawQuery);
        console.log("ResultsPage: Fetching from URL:", targetUrl);
        
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: rawQuery }),
        });

        console.log("ResultsPage: API response received. Status:", response.status);
        
        if (!response.ok) {
          const errText = await response.text();
          console.error("ResultsPage: Server returned error response:", {
            status: response.status,
            statusText: response.statusText,
            body: errText,
          });
          throw new Error(`Server responded with status ${response.status}: ${errText || response.statusText}`);
        }

        const data = await response.json();
        console.log("ResultsPage: API response body:", data);

        if (data && data.success === true && Array.isArray(data.hotels)) {
          console.log(`ResultsPage: Success! Hotels count: ${data.hotels.length} (source: ${data.source})`);
          setHotels(data.hotels);
          localStorage.setItem("lastSearchResults", JSON.stringify(data.hotels));
          if (urlQuery) {
            localStorage.setItem("lastSearchQuery", urlQuery);
          }
        } else {
          console.error("ResultsPage: API returned success=false or invalid format", data);
          setErrorMessage(data?.message || "Invalid response format from server.");
          setHasError(true);
          setHotels([]);
        }
      } catch (err: any) {
        console.error("ResultsPage: Hotel fetch caught error:", {
          message: err.message,
          stack: err.stack,
          errorObject: err,
        });
        const msg = err.message || "Unable to fetch hotels.";
        setErrorMessage(msg);
        setHasError(true);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [rawQuery, retryTrigger]);

  const openDetails = (hotel: Hotel) => {
    localStorage.setItem("selectedHotel", JSON.stringify(hotel));
    navigate(`/hotel/${hotel.id}`);
  };

  const saveHotel = async (hotel: Hotel) => {
    try {
      console.log("ResultsPage: Saving hotel:", hotel.name);
      
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
        throw new Error(data.message || "Could not save hotel.");
      }

      success("Hotel Saved! ❤️", `${hotel.name} has been added to your saved list.`);
    } catch (err: any) {
      console.error("Save hotel error:", err);
      error("Save Failed", err.message || "Could not connect to server. Please try again.");
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
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-3xl border border-slate-700">
          <span className="text-6xl mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-slate-300">Unable to fetch hotels.</h2>
          <p className="text-slate-450 mt-2 max-w-md mx-auto">{errorMessage || "Please try again later."}</p>
          <button
            onClick={() => setRetryTrigger(prev => prev + 1)}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      ) : hotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-3xl border border-slate-700">
          <span className="text-6xl mb-4">🏨</span>
          <h2 className="text-2xl font-bold text-slate-300">No hotels found for this search.</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Try adjusting your search terms, changing the city, or removing filters like "luxury" or "budget" to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={`${hotel.id}-${hotel.name}`}
              className="bg-slate-800 rounded-2xl overflow-hidden"
            >
              {hotel.image ? (
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-56 object-cover bg-slate-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-56 bg-slate-800 border-b border-slate-700 flex flex-col items-center justify-center text-slate-500 ${hotel.image ? 'hidden' : ''}`}>
                <span className="text-4xl mb-2">🏨</span>
                <p className="text-sm font-semibold">Image not available</p>
              </div>

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
                      className="border border-cyan-500 px-4 py-2 rounded-lg font-bold text-center block"
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