import axios from "axios";

export async function searchHotelsFromOSM(query: string) {
  // 1. Convert city name to latitude/longitude using Nominatim
  const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "NeuroStayAI/1.0",
    },
  });

  if (!geoRes.data || geoRes.data.length === 0) {
    return [];
  }

  const lat = geoRes.data[0].lat;
  const lon = geoRes.data[0].lon;

  // 2. Search hotels nearby using Overpass API
  const overpassQuery = `
    [out:json];
    (
      node["tourism"="hotel"](around:5000,${lat},${lon});
      way["tourism"="hotel"](around:5000,${lat},${lon});
      relation["tourism"="hotel"](around:5000,${lat},${lon});
      node["tourism"="guest_house"](around:5000,${lat},${lon});
      node["tourism"="hostel"](around:5000,${lat},${lon});
    );
    out center;
  `;

  const hotelRes = await axios.post(
    "https://overpass-api.de/api/interpreter",
    overpassQuery,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  const hotels = hotelRes.data.elements.map((item: any, index: number) => {
    const tags = item.tags || {};

    return {
      id: item.id || index,
      name: tags.name || `Hotel ${index + 1}`,
      address:
        tags["addr:street"] ||
        tags["addr:full"] ||
        geoRes.data[0].display_name,
      latitude: item.lat || item.center?.lat,
      longitude: item.lon || item.center?.lon,
      type: tags.tourism || "hotel",
      phone: tags.phone || "Not available",
      website: tags.website || "Not available",
      rating: Number((3.8 + Math.random() * 1.1).toFixed(1)),
      price: Math.floor(1200 + Math.random() * 3000),
      matchScore: Math.floor(80 + Math.random() * 18),
      whyThisHotel: [
        "Located near your searched area",
        "Suitable for budget-friendly stay",
        "Good option based on distance and hotel type",
      ],
    };
  });

  return hotels;
}