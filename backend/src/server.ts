import "./loadEnv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import otpRoutes from "./routes/otp.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import serpapiRoutes from "./routes/serpapi.routes";
import savedRoutes from "./routes/saved.routes";
import { createTransporter } from "./services/email.service";

// Ensure critical environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in environment variables. Application requires a database connection to start.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables. Application requires a signing secret to start.");
  process.exit(1);
}

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// Enable GZIP compression
app.use(compression());

// Secure application by setting various HTTP headers
app.use(helmet());

import fs from "fs";

app.use("/download", express.static(path.join(process.cwd(), "download")));
app.use("/download", express.static(path.join(process.cwd(), "backend/download")));
app.use("/download", express.static(path.join(__dirname, "../../download")));
app.use("/download", express.static(path.join(__dirname, "../download")));
app.use("/download", express.static(path.join(__dirname, "download")));

app.get("/download*", (req, res, next) => {
  if (req.originalUrl.includes(".apk") || req.path.includes(".apk") || req.path === "/download" || req.path === "/download/") {
    const possiblePaths = [
      path.join(process.cwd(), "download/NeuroStayAI.apk"),
      path.join(process.cwd(), "download/neurostay-ai.apk"),
      path.join(process.cwd(), "backend/download/NeuroStayAI.apk"),
      path.join(process.cwd(), "backend/download/neurostay-ai.apk"),
      path.join(__dirname, "../../download/NeuroStayAI.apk"),
      path.join(__dirname, "../../download/neurostay-ai.apk"),
      path.join(__dirname, "../download/NeuroStayAI.apk"),
      path.join(__dirname, "../download/neurostay-ai.apk"),
      path.join(__dirname, "download/NeuroStayAI.apk"),
      path.join(__dirname, "download/neurostay-ai.apk"),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        console.log(`[APK-DOWNLOAD-WILDCARD] Serving APK from path: ${p} for requested URL: ${req.originalUrl}`);
        return res.download(p, "NeuroStayAI.apk");
      }
    }
  }
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8081",
  "http://localhost:19006",
  "http://127.0.0.1:5173",
  "https://neurostay-web.vercel.app",
  process.env.CLIENT_URL,
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : []),
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log("CORS enabled for allowed origins:", allowedOrigins);

app.options(/(.*)/, cors());

app.use(express.json());

// Rate Limiting for Auth & OTP routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

import hotelRoutes from "./routes/hotel.routes";

app.use("/api/otp", authRateLimiter, otpRoutes);
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/serpapi", serpapiRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/saved", savedRoutes);

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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

// Verify SMTP connection on startup
try {
  const transporter = createTransporter();
  transporter.verify().then(() => {
    console.log("SMTP connected");
  }).catch((err: any) => {
    console.warn("SMTP connection notice:", err.message || err);
  });
} catch (err: any) {
  console.warn("SMTP initialization notice:", err.message || err);
}

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server started on 0.0.0.0:${PORT}`);
});