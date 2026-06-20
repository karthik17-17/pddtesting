import express from "express";
import { validateSearch } from "../middleware/validation.middleware";

const router = express.Router();

router.post("/search", validateSearch, async (req, res) => {
  const { query } = req.body;
  const q = String(query || "").toLowerCase();
  
  if (!q) {
    return res.json([]);
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('hotels in ' + q)}&limit=5&addressdetails=1`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const results = data.map((result: any, index: number) => ({
        id: index + 1,
        name: result.name || result.display_name.split(',')[0],
        city: q,
        address: result.display_name,
        price: "Price not available",
        rating: 4.0,
        amenities: ["WiFi", "AC"],
        image: "",
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