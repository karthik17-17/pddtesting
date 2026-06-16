import express from "express";
import { searchHotelsFromOSM } from "../services/osmHotel.service";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "OSM route working",
  });
});

router.post("/hotels", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const hotels = await searchHotelsFromOSM(query);

    res.json({
      success: true,
      query,
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error("OSM hotel route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    });
  }
});

export default router;