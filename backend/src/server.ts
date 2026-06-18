import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import otpRoutes from "./routes/otp.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import serpapiRoutes from "./routes/serpapi.routes";
import savedRoutes from "./routes/saved.routes";

dotenv.config();

const app = express();

app.use("/download", express.static(path.join(__dirname, "../../download")));

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/serpapi", serpapiRoutes);
app.use("/api/saved", savedRoutes);

app.get("/", (req, res) => {
  res.send("NeuroStay AI Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});