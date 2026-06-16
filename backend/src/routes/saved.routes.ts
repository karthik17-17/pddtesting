import express from "express";
import SavedHotel from "../models/SavedHotel.model";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const exists = await SavedHotel.findOne({
      hotelName: req.body.hotelName,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Hotel already saved",
      });
    }

    const savedHotel = await SavedHotel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hotel saved successfully",
      savedHotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Save hotel failed",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const hotels = await SavedHotel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      hotels,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved hotels",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SavedHotel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Hotel removed",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Remove failed",
    });
  }
});

export default router;