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

    // 1. Prefer lat/lng from backend hotel object
    const hotelLat = hotel.lat !== undefined && hotel.lat !== null ? parseFloat(hotel.lat) : (hotel.latitude !== undefined && hotel.latitude !== null ? parseFloat(hotel.latitude) : null);
    const hotelLng = hotel.lng !== undefined && hotel.lng !== null ? parseFloat(hotel.lng) : (hotel.longitude !== undefined && hotel.longitude !== null ? parseFloat(hotel.longitude) : null);

    if (hotelLat && hotelLng && !isNaN(hotelLat) && !isNaN(hotelLng)) {
      setCoords([hotelLat, hotelLng]);
      setError(null);
      return;
    }

    // 2. Geocode if coordinates are missing
    setLoading(true);
    setError(null);

    const cleanAddress = (hotel.address || "").replace("Address not available", "").trim();
    
    // Attempt 1: hotel.name + ", " + hotel.address + ", India"
    const query1 = `${hotel.name}, ${cleanAddress}, India`.replace(/,+/g, ',').replace(/\s+/g, ' ').trim();
    
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query1)}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // Attempt 2: hotel.address + ", India"
          const query2 = `${cleanAddress}, India`.replace(/,+/g, ',').replace(/\s+/g, ' ').trim();
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query2)}&limit=1`)
            .then(res => res.json())
            .then(data2 => {
              if (data2 && data2.length > 0) {
                setCoords([parseFloat(data2[0].lat), parseFloat(data2[0].lon)]);
              } else {
                // Attempt 3: Just the city name
                const city = hotel.city || (cleanAddress ? cleanAddress.split(',').pop()?.trim() : "") || "Mumbai";
                const query3 = `${city}, India`;
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query3)}&limit=1`)
                  .then(res => res.json())
                  .then(data3 => {
                    if (data3 && data3.length > 0) {
                      setCoords([parseFloat(data3[0].lat), parseFloat(data3[0].lon)]);
                    } else {
                      // Fallback to Mumbai coords if everything fails
                      setCoords([19.0760, 72.8777]);
                    }
                  })
                  .catch(() => {
                    setCoords([19.0760, 72.8777]);
                  });
              }
            })
            .catch(() => {
              const city = hotel.city || "Mumbai";
              fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', India')}&limit=1`)
                .then(res => res.json())
                .then(data3 => {
                  if (data3 && data3.length > 0) {
                    setCoords([parseFloat(data3[0].lat), parseFloat(data3[0].lon)]);
                  } else {
                    setCoords([19.0760, 72.8777]);
                  }
                })
                .catch(() => setCoords([19.0760, 72.8777]));
            });
        }
      })
      .catch(err => {
        console.error("Geocoding error", err);
        setCoords([19.0760, 72.8777]);
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
         center={coords || [19.0760, 72.8777]} 
         zoom={coords ? 15 : 12} 
         style={{ width: '100%', height: '100%', zIndex: 10, background: '#071028' }}
       >
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
                 <div className="text-slate-600 text-sm">{hotel.address}</div>
                 <a
                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + (hotel.address || ''))}`}
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