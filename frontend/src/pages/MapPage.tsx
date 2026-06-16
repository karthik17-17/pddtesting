import { useState } from "react";

const hotels = [
  {
    id: 1,
    name: "Hotel Paradise",
    city: "Chennai",
    price: "₹1200",
    rating: 4.5,
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: 2,
    name: "NeuroStay Inn",
    city: "Chennai",
    price: "₹1500",
    rating: 4.2,
    lat: 13.0418,
    lng: 80.2341,
  },
  {
    id: 3,
    name: "Budget Comfort Stay",
    city: "Hyderabad",
    price: "₹900",
    rating: 4.0,
    lat: 17.385,
    lng: 78.4867,
  },
];

export default function MapPage() {
  const [selectedHotel, setSelectedHotel] = useState<any>(hotels[0]);

  const delta = 0.02;
  const bbox = `${selectedHotel.lng - delta},${selectedHotel.lat - delta},${selectedHotel.lng + delta},${selectedHotel.lat + delta}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${selectedHotel.lat},${selectedHotel.lng}`;

  return (
    <div className="flex flex-col w-full bg-[#071028] text-white" style={{ height: "calc(100vh - 0px)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Hotel Location Map
        </h1>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          Interactive OpenStreetMap view of NeuroStay AI hotel locations.
        </p>
      </div>

      {/* Main content — flex row that fills remaining height */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 px-6 md:px-8 pb-6 overflow-hidden min-h-0">

        {/* Hotel List Panel */}
        <div className="lg:w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex-shrink-0">
            Select a Hotel
          </h2>

          {hotels.map((hotel) => {
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
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 ml-2 flex-shrink-0">
                    {hotel.city}
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
              </div>
            );
          })}

          {/* Directions Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex-shrink-0">
            <h4 className="font-semibold text-slate-300 text-xs mb-0.5">Active Hotel</h4>
            <p className="text-sm text-white font-medium mb-3">
              {selectedHotel.name}{" "}
              <span className="text-slate-400 text-xs">({selectedHotel.city})</span>
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHotel.lat},${selectedHotel.lng}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>

        {/* Map — fills remaining space */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <iframe
            title="OpenStreetMap"
            width="100%"
            height="100%"
            style={{
              border: "none",
              filter: "invert(90%) hue-rotate(190deg) brightness(85%) contrast(90%)",
              position: "absolute",
              inset: 0,
            }}
            src={mapUrl}
          />
          {/* Hotel name overlay */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-xs px-3 py-1.5 rounded-lg text-slate-300 pointer-events-none shadow-lg z-10">
            📍 {selectedHotel.name} Location
          </div>
        </div>
      </div>
    </div>
  );
}