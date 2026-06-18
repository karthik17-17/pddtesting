import { useState, useEffect } from "react";
import MapView from "../components/map/MapView";

export default function MapPage() {
  const getDirectionsUrl = (hotel: any) => {
    if (hotel.latitude && hotel.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hotel.name + ' ' + (hotel.address || hotel.city || ''))}`;
  };

  const savedHotels = (() => {
    try {
      const data = localStorage.getItem("lastSearchResults");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  })();

  const [selectedHotel, setSelectedHotel] = useState<any>(savedHotels[0] || null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);



  return (
    <div className="flex flex-col w-full bg-[#071028] text-white" style={{ height: "calc(100vh - 0px)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Hotel Location Map
        </h1>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          Interactive Google Maps view of your NeuroStay AI hotel search results.
        </p>
      </div>

      {/* Main content — flex row that fills remaining height */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 px-6 md:px-8 pb-6 overflow-hidden min-h-0">
        
        {!selectedHotel ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
             <span className="text-6xl mb-4">🗺️</span>
             <h2 className="text-2xl font-bold text-white">No hotels to map</h2>
             <p className="mt-2">Please search for hotels first to see their locations.</p>
          </div>
        ) : (
          <>
            {/* Hotel List Panel */}
            <div className="lg:w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex-shrink-0">
                Select a Hotel
              </h2>

              {savedHotels.map((hotel: any) => {
                const isSelected = selectedHotel.id === hotel.id;
                return (
                  <div
                    key={hotel.id}
                    onClick={() => setSelectedHotel(hotel)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-950/80 to-indigo-950/80 border-cyan-500/80 shadow-lg shadow-cyan-950/50 scale-[1.01]"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base text-white">{hotel.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 ml-2 flex-shrink-0 truncate max-w-[100px]">
                        {hotel.city || "Location"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">⭐ {hotel.rating} Rating</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-cyan-400 font-bold text-sm">
                        {hotel.price} <span className="text-xs text-slate-500">/ night</span>
                      </span>
                      {isSelected && (
                        <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          On map
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHotel(hotel);
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        View Location
                      </button>
                      <a 
                        href={getDirectionsUrl(hotel)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-1.5 rounded-lg text-xs font-semibold text-center transition block"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Directions Card */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex-shrink-0">
                <h4 className="font-semibold text-slate-300 text-xs mb-0.5">Active Hotel</h4>
                <p className="text-sm text-white font-medium mb-3">
                  {selectedHotel.name}{" "}
                  <span className="text-slate-400 text-xs">({selectedHotel.city || selectedHotel.address?.split(',').pop()?.trim() || "Location"})</span>
                </p>
                <a
                  href={getDirectionsUrl(selectedHotel)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200"
                >
                  📍 Get Directions
                </a>
              </div>
            </div>

            {/* Map — fills remaining space */}
            <div className="flex-1 min-h-[300px] lg:min-h-0 relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center">
              {!isOnline ? (
                <div className="text-center p-8 z-20">
                  <span className="text-6xl mb-4 block">📡</span>
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">You are currently offline</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    The interactive map cannot be loaded without an active internet connection. Please connect to the internet to view the map.
                  </p>
                </div>
              ) : (
                <MapView hotel={selectedHotel} />
              )}
              {/* Hotel name overlay */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-xs px-3 py-1.5 rounded-lg text-slate-300 pointer-events-none shadow-lg z-[1000]">
                📍 {selectedHotel.name} Location
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}