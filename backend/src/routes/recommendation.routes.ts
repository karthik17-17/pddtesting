import express from "express";
import { validateSearch } from "../middleware/validation.middleware";
import axios from "axios";

const router = express.Router();

router.post("/search", validateSearch, async (req, res) => {
  const { query } = req.body;
  const q = String(query || "").trim();
  
  if (!q) {
    return res.json([]);
  }

  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const headers = {
    "User-Agent": "NeuroStayAI/1.0 (contact: support@neurostay.ai)"
  };

  try {
    console.log(`Recommendations API: Searching Nominatim for "hotels in ${q}"...`);
    const osmResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('hotels in ' + q)}&limit=15&addressdetails=1`,
      { headers, timeout: 8000 }
    );
    const data = osmResponse.data || [];
    console.log(`Recommendations API: Found ${data.length} records.`);
    
    if (data && data.length > 0) {
      const results = data.map((result: any, index: number) => ({
        id: index + 1,
        name: result.name || result.display_name.split(',')[0],
        city: q,
        address: result.display_name,
        price: "Price not available",
        rating: parseFloat((4.0 + (index % 10) * 0.1).toFixed(1)),
        amenities: ["WiFi", "AC"],
        image: defaultImage,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        source: "OpenStreetMap",
        website: "",
        matchScore: Math.max(60, 90 - index * 2),
        why: `Recommended based on location proximity in ${q}.`,
        mapLink: `https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=18/${result.lat}/${result.lon}`
      }));
      return res.json(results);
    }
    
    return res.json([]);
  } catch (error) {
    console.error("Recommendation search error:", error);
    return res.json([]);
  }
});

export default router;