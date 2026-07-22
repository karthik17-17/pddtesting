import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import savedRoutes from "./routes/saved.routes";
import serpapiRoutes from "./routes/serpapi.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8081",
  "http://localhost:19006",
  "http://127.0.0.1:5173",
  "https://neurostay-web.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

import path from "path";
import fs from "fs";

app.use("/download", express.static(path.join(process.cwd(), "download")));
app.use("/download", express.static(path.join(process.cwd(), "backend/download")));
app.use("/download", express.static(path.join(__dirname, "../../download")));
app.use("/download", express.static(path.join(__dirname, "../download")));
app.use("/download", express.static(path.join(__dirname, "download")));

app.get("/download/neurostay-ai.apk", (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), "download/neurostay-ai.apk"),
    path.join(process.cwd(), "backend/download/neurostay-ai.apk"),
    path.join(__dirname, "../../download/neurostay-ai.apk"),
    path.join(__dirname, "../download/neurostay-ai.apk"),
    path.join(__dirname, "download/neurostay-ai.apk"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`[APK-DOWNLOAD] Serving APK from path: ${p}`);
      return res.download(p, "neurostay-ai.apk");
    }
  }
  console.warn("[APK-DOWNLOAD] File not found in candidate paths.");
  return res.status(404).send("APK file not found on server.");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/serpapi", serpapiRoutes);

app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "ok",
    database: isDbConnected ? "connected" : "connecting",
    server: "running",
  });
});

app.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "ok",
    database: isDbConnected ? "connected" : "connecting",
    server: "running",
  });
});

app.get("/", (req, res) => {
  res.send("NeuroStay AI Backend Running");
});

export default app;