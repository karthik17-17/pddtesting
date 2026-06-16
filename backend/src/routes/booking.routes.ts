import express from "express";
import Booking from "../models/Booking.model";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    console.log("Booking error:", error.message);

    res.status(500).json({
      success: false,
      message: "Booking failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    bookings,
  });
});

router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Booking cancelled",
  });
});

export default router;