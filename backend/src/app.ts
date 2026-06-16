import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import savedRoutes from "./routes/saved.routes";
import serpapiRoutes from "./routes/serpapi.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/serpapi", serpapiRoutes);

app.get("/", (req, res) => {
  res.send("NeuroStay AI Backend Running");
});

export default app;