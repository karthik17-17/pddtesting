import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

const mapContainerStyle = {
  width: "100%",
  height: "620px",
};

const center = {
  lat: 13.0827,
  lng: 80.2707,
};

export default function MapPage() {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="min-h-screen bg-[#071028] text-white p-8">
        <h1 className="text-4xl font-bold">Google Maps API key missing</h1>
        <p className="mt-4">
          Add VITE_GOOGLE_MAPS_API_KEY in frontend/.env
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#071028] text-white flex items-center justify-center">
        Loading Google Map...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-4">Hotel Location Map</h1>

      <p className="text-slate-300 mb-8">
        Google Maps view of NeuroStay AI hotel locations.
      </p>

      <div className="rounded-2xl overflow-hidden border border-slate-700">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={11}
        >
          {hotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={{ lat: hotel.lat, lng: hotel.lng }}
              onClick={() => setSelectedHotel(hotel)}
            />
          ))}

          {selectedHotel && (
            <InfoWindow
              position={{
                lat: selectedHotel.lat,
                lng: selectedHotel.lng,
              }}
              onCloseClick={() => setSelectedHotel(null)}
            >
              <div style={{ color: "black", minWidth: "220px" }}>
                <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {selectedHotel.name}
                </h2>

                <p>{selectedHotel.city}</p>
                <p>⭐ {selectedHotel.rating}</p>
                <p>{selectedHotel.price} / night</p>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHotel.lat},${selectedHotel.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    background: "#06b6d4",
                    color: "black",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Open Route
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}