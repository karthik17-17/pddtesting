import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet default icons in react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to update the map view when coordinates change
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

// Custom icon using red marker to highlight the hotel
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  hotel: any;
}

export default function MapView({ hotel }: MapViewProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotel) return;

    // Use hotel coordinates if available
    if (hotel.latitude && hotel.longitude) {
      setCoords([hotel.latitude, hotel.longitude]);
      setError(null);
      return;
    }

    // Geocode if missing
    let queryStr = hotel.name;
    if (queryStr.includes("Grand Stay") || queryStr.includes("Comfort Stay")) {
      queryStr = queryStr.replace(/Grand Stay \d+/gi, "").replace(/Comfort Stay \d+/gi, "").trim();
    }
    
    // Clean up city string (e.g. "Hyderabad Location" -> "Hyderabad")
    const rawCity = hotel.city || hotel.address || '';
    const cleanCity = rawCity.replace(/ Location$/i, '').trim();
    
    const query = `${queryStr}, ${cleanCity}`;
    
    setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setError(null);
        } else {
          // Fallback 1: Just the hotel name
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=1`)
            .then(res => res.json())
            .then(nameData => {
              if (nameData && nameData.length > 0) {
                setCoords([parseFloat(nameData[0].lat), parseFloat(nameData[0].lon)]);
                setError(null);
              } else if (cleanCity) {
                // Fallback 2: Just the city
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanCity)}&limit=1`)
                  .then(res => res.json())
                  .then(cityData => {
                     if (cityData && cityData.length > 0) {
                        setCoords([parseFloat(cityData[0].lat), parseFloat(cityData[0].lon)]);
                        // Don't show error, just center on city
                        setError(null);
                     } else {
                        setError("Specific location not found. Showing default map.");
                     }
                  })
                  .catch(() => setError("Specific location not found."));
              } else {
                setError("Specific location not found.");
              }
            })
            .catch(() => setError("Specific location not found."));
        }
      })
      .catch(err => {
        console.error("Geocoding error", err);
        setError("Network error while geocoding");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [hotel]);

  if (!hotel) return <div className="w-full h-full flex items-center justify-center text-slate-400">Select a hotel</div>;

  return (
    <div className="w-full h-full relative">
       {loading && (
         <div className="absolute inset-0 z-[400] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
           <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
       )}
       {error && !loading && !coords && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
           <p className="text-red-300 bg-red-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-red-900/50 shadow-lg text-sm font-medium">
             {error}
           </p>
         </div>
       )}
       
       <MapContainer 
         center={coords || [20.5937, 78.9629]} // Default to India if no coords
         zoom={coords ? 15 : 5} 
         style={{ width: '100%', height: '100%', zIndex: 10, background: '#071028' }}
       >
         {/* Google Maps standard tiles */}
         <TileLayer
           url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
           attribution='&copy; Google Maps'
         />
         {coords && (
           <>
             <MapUpdater center={coords} />
             <Marker position={coords} icon={customIcon}>
               <Popup>
                 <div className="text-slate-900 font-bold">{hotel.name}</div>
                 <div className="text-slate-600 text-sm">{hotel.city}</div>
                 <a
                   href={hotel.latitude && hotel.longitude ? `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}` : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hotel.name + ' ' + (hotel.address || hotel.city || ''))}`}
                   target="_blank"
                   rel="noreferrer"
                   className="mt-2 block text-center bg-cyan-600 text-white px-3 py-1.5 rounded text-xs font-semibold no-underline hover:bg-cyan-700"
                 >
                   Get Directions
                 </a>
               </Popup>
             </Marker>
           </>
         )}
       </MapContainer>
    </div>
  );
}