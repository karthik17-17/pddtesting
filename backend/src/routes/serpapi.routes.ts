import express from "express";
import axios from "axios";

const router = express.Router();

const localMockHotels: { [key: string]: any[] } = {
  tirupati: [
    {
      name: "Fortune Select Grand Ridge",
      address: "Shilparamam Theme Park, Tirupati, Andhra Pradesh 517507",
      rating: 4.5,
      price: "₹6,500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      matchScore: 95,
      why: "Excellent amenities, close to the hills, premium dining choices, and high cleanliness scores.",
      lat: 13.6285,
      lng: 79.4244
    },
    {
      name: "Taj Tirupati",
      address: "Tirupati-Renigunta Road, Tirupati, Andhra Pradesh 517501",
      rating: 4.8,
      price: "₹9,000",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      matchScore: 92,
      why: "Ultra-luxury five-star experience with stunning hill views, top-tier hospitality, and excellent spa facilities.",
      lat: 13.6373,
      lng: 79.4437
    },
    {
      name: "Marasa Sarovar Premiere",
      address: "Karakambadi Road, Upadhyaya Nagar, Tirupati, Andhra Pradesh 517507",
      rating: 4.3,
      price: "₹5,200",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      matchScore: 89,
      why: "Unique theme, great swimming pool, excellent buffet, and friendly staff.",
      lat: 13.6492,
      lng: 79.4358
    }
  ],
  tirupathi: [
    {
      name: "Fortune Select Grand Ridge",
      address: "Shilparamam Theme Park, Tirupati, Andhra Pradesh 517507",
      rating: 4.5,
      price: "₹6,500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      matchScore: 95,
      why: "Excellent amenities, close to the hills, premium dining choices, and high cleanliness scores.",
      lat: 13.6285,
      lng: 79.4244
    },
    {
      name: "Taj Tirupati",
      address: "Tirupati-Renigunta Road, Tirupati, Andhra Pradesh 517501",
      rating: 4.8,
      price: "₹9,000",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      matchScore: 92,
      why: "Ultra-luxury five-star experience with stunning hill views, top-tier hospitality, and excellent spa facilities.",
      lat: 13.6373,
      lng: 79.4437
    }
  ],
  bangalore: [
    {
      name: "The Leela Palace Bengaluru",
      address: "23 HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008",
      rating: 4.9,
      price: "₹14,500",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      matchScore: 98,
      why: "Stunning palace-style luxury, award-winning fine dining restaurants, and lush green gardens in the heart of tech hub.",
      lat: 12.9606,
      lng: 77.6485
    },
    {
      name: "ITC Gardenia, a Luxury Collection Hotel",
      address: "1 Residency Rd, Ashok Nagar, Bengaluru, Karnataka 560025",
      rating: 4.7,
      price: "₹12,000",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      matchScore: 94,
      why: "Eco-friendly luxury hotel with wind-cooled lobby, outstanding cleanliness, and premium comfort near Cubbon Park.",
      lat: 12.9678,
      lng: 77.5968
    },
    {
      name: "Radisson Blu Atria Bengaluru",
      address: "1 Palace Rd, Ambedkar Veedhi, Bengaluru, Karnataka 560001",
      rating: 4.4,
      price: "₹7,200",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      matchScore: 88,
      why: "Superb central location, comfortable workspaces, fast Wi-Fi, and excellent breakfast spread.",
      lat: 12.9829,
      lng: 77.5878
    }
  ],
  chennai: [
    {
      name: "The Leela Palace Chennai",
      address: "Adyar Seaface, MRC Nagar, Chennai, Tamil Nadu 600028",
      rating: 4.8,
      price: "₹11,500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      matchScore: 97,
      why: "Chennai's only sea-facing palace hotel, with spectacular views of the Bay of Bengal, opulent decor, and exceptional dining.",
      lat: 13.0165,
      lng: 80.2762
    },
    {
      name: "Taj Connemara",
      address: "Binny Rd, Anna Salai, Chennai, Tamil Nadu 600002",
      rating: 4.6,
      price: "₹8,500",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      matchScore: 93,
      why: "A heritage property rich with history, offering colonial charm, beautiful gardens, and excellent central location.",
      lat: 13.0612,
      lng: 80.2604
    }
  ],
  mumbai: [
    {
      name: "The Taj Mahal Palace",
      address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
      rating: 4.9,
      price: "₹18,000",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      matchScore: 99,
      why: "Historic landmark overlooking the Gateway of India, legendary hospitality, and world-class luxury amenities.",
      lat: 18.9218,
      lng: 72.8333
    },
    {
      name: "Trident Nariman Point",
      address: "CR 2 Nariman Point, Netaji Subhash Chandra Bose Rd, Mumbai, Maharashtra 400021",
      rating: 4.6,
      price: "₹9,500",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      matchScore: 91,
      why: "Spectacular views of the Marine Drive Queen's Necklace, great business amenities, and outstanding breakfast service.",
      lat: 18.9269,
      lng: 72.8205
    }
  ]
};

router.get("/hotels", (req, res) => {
  res.json({
    success: true,
    message: "SerpApi route working. Use POST for hotel search.",
  });
});

const normalizeQuery = (query: string): string => {
  let q = query ? query.trim() : "";
  if (!q) return "hotels in Chennai India";

  // Spell fixes
  q = q.replace(/tirupathi/gi, "Tirupati").replace(/srikalahasthi/gi, "Srikalahasti");

  const lower = q.toLowerCase();

  // If the query does not contain "hotel" or "hotels"
  if (!lower.includes("hotel")) {
    const capitalized = q
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    q = `hotels in ${capitalized} India`;
  } else {
    // Already contains "hotel" or "hotels"
    if (!lower.includes("india")) {
      q = `${q} India`;
    }
  }

  return q.replace(/\s+/g, " ").trim();
};

const getCityName = (query: string): string => {
  if (!query) return "Chennai";
  let city = query
    .replace(/(budget|luxury|family|cheap)?\s*hotels?\s+(in|near)\s+/gi, "")
    .replace(/\b(india)\b/gi, "")
    .replace(/,/g, "")
    .trim();
  
  city = city.split(/\s+(with|under|for)\s+/i)[0].trim();
  city = city.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  return city || "Chennai";
};

const cleanImageUrl = (url: string): string => {
  if (!url) return "";
  if (url.includes("googleusercontent.com")) {
    if (url.includes("=s10000")) {
      return url.replace("=s10000", "=s800");
    }
  }
  return url;
};

const mapHotel = (hotel: any, index: number, city: string) => {
  const name = hotel.name || hotel.title || (hotel.display_name ? hotel.display_name.split(',')[0] : "Hotel");
  const address = hotel.address || hotel.display_name || "Address not available";
  const rating = parseFloat(String(hotel.overall_rating || hotel.rating || (4.0 + (index % 10) * 0.1)));
  
  // Format price
  let rawPrice = hotel.rate_per_night?.lowest || hotel.total_rate?.lowest || hotel.price || "Price not available";
  let price = "Price not available";
  if (rawPrice && rawPrice !== "Price not available") {
    let str = String(rawPrice).trim();
    if (!str.includes("₹") && !str.includes("$") && !str.includes("Rs")) {
      const digits = str.replace(/[^\d]/g, "");
      if (digits) {
        price = `₹${digits}`;
      } else {
        price = str;
      }
    } else {
      price = str;
    }
  }

  // Handle image
  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  let image = cleanImageUrl(hotel.image || hotel.thumbnail || "");
  let images: string[] = [];
  if (hotel.images && Array.isArray(hotel.images)) {
    images = hotel.images.map((img: any) => cleanImageUrl(img.thumbnail || img.original_image || "")).filter(Boolean);
  }
  if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
    const firstImg = hotel.images[0]?.thumbnail || hotel.images[0]?.original_image || "";
    if (firstImg) {
      image = cleanImageUrl(firstImg);
    }
  }
  
  if (!image) {
    image = defaultImage;
  }
  
  if (images.length === 0 && image) {
    images = [image];
  }

  // Handle coordinates
  let lat: number | null = null;
  let lng: number | null = null;
  if (hotel.gps_coordinates) {
    lat = parseFloat(hotel.gps_coordinates.latitude);
    lng = parseFloat(hotel.gps_coordinates.longitude);
  } else if (hotel.lat !== undefined && hotel.lon !== undefined) {
    lat = parseFloat(hotel.lat);
    lng = parseFloat(hotel.lon);
  } else if (hotel.latitude !== undefined && hotel.longitude !== undefined) {
    lat = parseFloat(hotel.latitude);
    lng = parseFloat(hotel.longitude);
  }

  const matchScore = hotel.matchScore || Math.max(70, 98 - index * 4);
  const why = hotel.why || `Good match in ${city} because of user preferences, ratings, and location convenience.`;
  
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;

  return {
    id: index + 1,
    name,
    address,
    rating,
    price,
    image,
    images: images.slice(0, 6),
    matchScore,
    why,
    mapLink,
    lat,
    lng
  };
};

router.post("/hotels", async (req, res) => {
  const { query } = req.body;
  console.log("-----------------------------------------");
  console.log("Hotel search API called. Raw Query:", query);

  const normalizedQuery = normalizeQuery(query);
  const city = getCityName(query);
  console.log(`Normalized Query: "${normalizedQuery}", City Name: "${city}"`);

  let rawHotels: any[] = [];
  let source = "serpapi";

  const headers = {
    "User-Agent": "NeuroStayAI/1.0 (contact: support@neurostay.ai)"
  };

  // 1. Try google_hotels if SERPAPI_KEY exists
  if (process.env.SERPAPI_KEY) {
    try {
      console.log("SerpAPI: Searching Google Hotels for query:", normalizedQuery);
      const response = await axios.get("https://serpapi.com/search.json", {
        params: {
          engine: "google_hotels",
          q: normalizedQuery,
          check_in_date: "2026-06-20",
          check_out_date: "2026-06-21",
          adults: 1,
          currency: "INR",
          gl: "in",
          hl: "en",
          api_key: process.env.SERPAPI_KEY,
        },
        timeout: 15000,
      });

      const properties = response.data.properties || [];
      if (properties.length > 0) {
        rawHotels = properties;
        console.log(`SerpAPI: Found ${rawHotels.length} hotels on initial search.`);
      }
    } catch (error: any) {
      console.log("SerpAPI google_hotels error:", error.message);
    }

    // 2. Retry with "hotels in {query}" if first search returned empty
    if (rawHotels.length === 0) {
      const retryQuery = `hotels in ${query}`;
      try {
        console.log(`SerpAPI Retry: Searching Google Hotels for: "${retryQuery}"`);
        const response = await axios.get("https://serpapi.com/search.json", {
          params: {
            engine: "google_hotels",
            q: retryQuery,
            check_in_date: "2026-06-20",
            check_out_date: "2026-06-21",
            adults: 1,
            currency: "INR",
            gl: "in",
            hl: "en",
            api_key: process.env.SERPAPI_KEY,
          },
          timeout: 15000,
        });

        const properties = response.data.properties || [];
        if (properties.length > 0) {
          rawHotels = properties;
          console.log(`SerpAPI Retry: Found ${rawHotels.length} hotels.`);
        }
      } catch (error: any) {
        console.log("SerpAPI retry error:", error.message);
      }
    }

    // 3. Try organic Google Places search fallback
    if (rawHotels.length === 0) {
      try {
        console.log("SerpAPI Fallback: Searching organic Google Places for:", normalizedQuery);
        const response = await axios.get("https://serpapi.com/search.json", {
          params: {
            engine: "google",
            q: normalizedQuery,
            location: "India",
            gl: "in",
            hl: "en",
            api_key: process.env.SERPAPI_KEY,
          },
          timeout: 15000,
        });

        const placesResults = response.data.local_results || response.data.places_results || [];
        if (placesResults.length > 0) {
          rawHotels = placesResults;
          console.log(`SerpAPI Fallback: Found ${rawHotels.length} places.`);
        }
      } catch (error: any) {
        console.log("SerpAPI organic place search error:", error.message);
      }
    }
  } else {
    console.log("SerpAPI: No SERPAPI_KEY found in environment. Skipping to OpenStreetMap fallback.");
  }

  // 4. Try OpenStreetMap Nominatim API as fallback
  if (rawHotels.length === 0) {
    source = "osm_fallback";
    let osmData = [];
    const queries = [
      `hotels in ${city}`,
      `lodging in ${city}`,
      `guest houses in ${city}`,
      `lodges in ${city}`
    ];
    
    for (const q of queries) {
      try {
        console.log(`OSM Fallback: Querying Nominatim for "${q}"...`);
        const osmResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=30&addressdetails=1`,
          { headers, timeout: 8000 }
        );
        
        if (osmResponse.data && osmResponse.data.length > 0) {
          osmData = osmResponse.data;
          console.log(`OSM Fallback: Found ${osmData.length} records matching "${q}"`);
          break; // Use the first successful list of accommodations
        }
      } catch (error: any) {
        console.log(`OSM Nominatim query "${q}" failed:`, error.message);
      }
    }
    
    if (osmData.length > 0) {
      rawHotels = osmData;
    }
  }

  // Filter out forbidden keywords
  const forbiddenKeywords = [
    "closest hotels", "budget hotels near", "hotels near", "top hotels", "best hotels",
    "goibibo", "makemytrip", "tripadvisor", "list", "search results", "agoda", "booking.com"
  ];

  let filtered = rawHotels.filter(h => {
    const name = h.name || h.title || (h.display_name ? h.display_name.split(',')[0] : "");
    if (!name || name.toLowerCase() === "hotel") return false;
    const nameLower = name.toLowerCase();
    for (const keyword of forbiddenKeywords) {
      if (nameLower.includes(keyword)) return false;
    }
    return true;
  });

  // Filter Safety Check: If filtering removed ALL hotels, bypass the filters
  if (filtered.length === 0 && rawHotels.length > 0) {
    console.log(`Filters safety warning: Filters removed all ${rawHotels.length} raw results. Bypassing keyword filters.`);
    filtered = rawHotels.filter(h => {
      const name = h.name || h.title || (h.display_name ? h.display_name.split(',')[0] : "");
      return name && name.toLowerCase() !== "hotel";
    });
  }

  // Map to exact required format
  let hotels = filtered.map((h, index) => mapHotel(h, index, city));

  // Fallback: If no hotels are found, try local mock hotels fallback to keep live systems responsive
  if (hotels.length === 0) {
    const key = city.toLowerCase();
    const mockList = localMockHotels[key] || localMockHotels["tirupati"]; // Default to Tirupati if city has no specific mock list
    if (mockList) {
      console.log(`Fallback: Using local mock hotels list for key "${key}"`);
      source = "mock_fallback";
      hotels = mockList.map((m, index) => ({
        id: index + 1,
        name: m.name,
        address: m.address,
        rating: m.rating,
        price: m.price,
        image: m.image,
        images: [m.image],
        matchScore: m.matchScore,
        why: m.why,
        mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ' ' + m.address)}`,
        lat: m.lat,
        lng: m.lng
      }));
    }
  }

  console.log(`Final Response: success=true, source="${source}", hotelsCount=${hotels.length}`);
  console.log("-----------------------------------------");

  res.json({
    success: true,
    hotels,
    source,
  });
});

export default router;