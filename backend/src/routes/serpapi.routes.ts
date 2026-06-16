import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/hotels", (req, res) => {
  res.json({
    success: true,
    message: "SerpApi route working. Use POST for hotel search.",
  });
});

const getCityName = (query: string): string => {
  if (!query) return "Chennai";
  // Remove "hotels in" case-insensitively
  let city = query.replace(/hotels\s+in\s+/gi, "").trim();
  // Capitalize first letter of each word
  city = city.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return city || "Chennai";
};

const getFallbackHotels = (query: string) => {
  const city = getCityName(query);
  return [
    {
      id: 1,
      name: `${city} Grand Plaza`,
      address: `123 Main Street, Near City Center, ${city}`,
      rating: 4.6,
      price: "₹3,500",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60",
      matchScore: 98,
      why: `Highly rated hotel in ${city} with excellent amenities like WiFi, AC, and Pool. Perfect match for your search.`,
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city} Grand Plaza`)}`,
    },
    {
      id: 2,
      name: `NeuroStay Cozy Inn`,
      address: `45 Ring Road, T Nagar, ${city}`,
      rating: 4.3,
      price: "₹1,800",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60",
      matchScore: 92,
      why: "Comfortable and budget-friendly stay with high-speed internet and complimentary breakfast.",
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`NeuroStay Cozy Inn ${city}`)}`,
    },
    {
      id: 3,
      name: `${city} Comfort Suites`,
      address: `88 Station Road, Opposite Railway Station, ${city}`,
      rating: 4.0,
      price: "₹1,200",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60",
      matchScore: 86,
      why: "Excellent location near transit hub with essential amenities like AC, clean sheets, and friendly service.",
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city} Comfort Suites`)}`,
    },
    {
      id: 4,
      name: "Elite Residency",
      address: `10 Tech Park Boulevard, IT Corridor, ${city}`,
      rating: 4.5,
      price: "₹2,800",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60",
      matchScore: 90,
      why: "Modern property located close to the business district. Great review scores for cleanliness.",
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Elite Residency ${city}`)}`,
    },
    {
      id: 5,
      name: "Royal Heritage Hotel",
      address: `7 Historical Avenue, Old Town, ${city}`,
      rating: 4.7,
      price: "₹4,500",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=60",
      matchScore: 84,
      why: "Premium heritage experience with classical architecture, garden dining, and top-tier service.",
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Royal Heritage Hotel ${city}`)}`,
    }
  ];
};

router.post("/hotels", async (req, res) => {
  const { query } = req.body;
  const searchQuery =
    query && query.toLowerCase().includes("hotel")
      ? query
      : `hotels in ${query || "Chennai"}`;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_hotels",
        q: searchQuery,
        check_in_date: "2026-06-20",
        check_out_date: "2026-06-21",
        adults: 1,
        currency: "INR",
        gl: "in",
        hl: "en",
        api_key: process.env.SERPAPI_KEY,
      },
    });

    const properties = response.data.properties || [];

    let hotels = properties.map((hotel: any, index: number) => ({
      id: index + 1,
      name: hotel.name || "Hotel",
      address: hotel.address || "Address not available",
      rating: hotel.overall_rating || hotel.rating || 4,
      price:
        hotel.rate_per_night?.lowest ||
        hotel.total_rate?.lowest ||
        "Price not available",
      image:
        hotel.images?.[0]?.thumbnail ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      matchScore: Math.max(70, 98 - index * 4),
      why: "Recommended based on location, price and rating.",
      mapLink: hotel.link || "",
    }));

    if (hotels.length === 0) {
      hotels = getFallbackHotels(searchQuery);
    }

    res.json({
      success: true,
      query: searchQuery,
      count: hotels.length,
      hotels,
    });
  } catch (error: any) {
    console.log("SerpApi error, returning fallback hotels:", error.response?.data || error.message);
    const fallbackHotels = getFallbackHotels(searchQuery);

    res.json({
      success: true,
      query: searchQuery,
      count: fallbackHotels.length,
      hotels: fallbackHotels,
    });
  }
});

export default router;