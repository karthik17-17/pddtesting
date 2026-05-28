import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import otpRoutes from "./routes/otp.routes.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);

app.get("/", (req, res) => {
  res.send("NeuroStay Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});