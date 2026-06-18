import express from "express";
import SavedHotel from "../models/SavedHotel.model";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// In-memory array to store saved hotels when MongoDB is offline
const mockSavedHotels: any[] = [];

router.post("/", protect, async (req: any, res) => {
  try {
    const exists = await SavedHotel.findOne({
      userId: req.user._id,
      hotelName: req.body.hotelName,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Hotel already saved",
      });
    }

    const savedHotel = await SavedHotel.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Hotel saved successfully",
      savedHotel,
    });
  } catch (error) {
    console.log("MongoDB save failed, using mock fallback:", error);
    const mockHotel = {
      ...req.body,
      _id: "mock-id-" + Math.random().toString(36).substring(7),
      userId: req.user?._id || "demo-user-id",
      createdAt: new Date().toISOString()
    };
    
    // Check if already in mock
    const exists = mockSavedHotels.find(h => h.hotelName === req.body.hotelName && h.userId === mockHotel.userId);
    if (!exists) {
      mockSavedHotels.push(mockHotel);
    }

    res.status(201).json({
      success: true,
      message: "Hotel saved (Offline Mock)",
      savedHotel: mockHotel
    });
  }
});

router.get("/", protect, async (req: any, res) => {
  try {
    const hotels = await SavedHotel.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    console.log("MongoDB fetch failed, returning mock array:", error);
    const userHotels = mockSavedHotels.filter(h => h.userId === (req.user?._id || "demo-user-id"));
    res.json({
      success: true,
      hotels: userHotels.reverse(),
    });
  }
});

router.delete("/:id", protect, async (req: any, res) => {
  try {
    const hotel = await SavedHotel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: "Not found or unauthorized" });
    }

    res.json({
      success: true,
      message: "Hotel removed",
    });
  } catch (error) {
    console.log("MongoDB delete failed, using mock array:", error);
    const index = mockSavedHotels.findIndex(h => h._id === req.params.id && h.userId === (req.user?._id || "demo-user-id"));
    if (index !== -1) {
      mockSavedHotels.splice(index, 1);
    }
    res.json({
      success: true,
      message: "Hotel removed (Offline Mock)",
    });
  }
});

export default router;