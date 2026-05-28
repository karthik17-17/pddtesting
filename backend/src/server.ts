import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import otpRoutes from "./routes/otp.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("NeuroStay Backend Running");
});

app.post("/api/hotels/search", (req, res) => {
  const { query } = req.body;

  res.json([
    {
      id: 1,
      name: "Hotel Paradise",
      city: query || "India",
      price: "₹1200",
      rating: 4.5,
      matchScore: 95,
      why: "Budget friendly hotel with WiFi and AC",
    },
    {
      id: 2,
      name: "NeuroStay Inn",
      city: query || "India",
      price: "₹1500",
      rating: 4.2,
      matchScore: 90,
      why: "Good location and affordable",
    },
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.log("MongoDB connection failed:", err.message)
  );