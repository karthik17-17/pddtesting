import express from "express";
import cors from "cors";

import hotelRoutes from "./routes/hotel.routes";
import authRoutes from "./routes/auth.routes";
import placesRoutes from "./routes/places.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NeuroStay Backend Running");
});

app.use("/api/hotels", hotelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/places", placesRoutes);

export default app;