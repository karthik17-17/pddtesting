"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const recommendation_routes_1 = __importDefault(require("./routes/recommendation.routes"));
const serpapi_routes_1 = __importDefault(require("./routes/serpapi.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
const email_service_1 = require("./services/email.service");
// Ensure critical environment variables are loaded
if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in environment variables. Application requires a database connection to start.");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables. Application requires a signing secret to start.");
    process.exit(1);
}
const app = (0, express_1.default)();
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
    });
    next();
});
// Enable GZIP compression
app.use((0, compression_1.default)());
// Secure application by setting various HTTP headers
app.use((0, helmet_1.default)());
const fs_1 = __importDefault(require("fs"));
app.use("/download", express_1.default.static(path_1.default.join(process.cwd(), "download")));
app.use("/download", express_1.default.static(path_1.default.join(process.cwd(), "backend/download")));
app.use("/download", express_1.default.static(path_1.default.join(__dirname, "../../download")));
app.use("/download", express_1.default.static(path_1.default.join(__dirname, "../download")));
app.use("/download", express_1.default.static(path_1.default.join(__dirname, "download")));
app.get(["/download/NeuroStayAI.apk", "/download/neurostay-ai.apk"], (req, res) => {
    const possiblePaths = [
        path_1.default.join(process.cwd(), "download/NeuroStayAI.apk"),
        path_1.default.join(process.cwd(), "download/neurostay-ai.apk"),
        path_1.default.join(process.cwd(), "backend/download/NeuroStayAI.apk"),
        path_1.default.join(process.cwd(), "backend/download/neurostay-ai.apk"),
        path_1.default.join(__dirname, "../../download/NeuroStayAI.apk"),
        path_1.default.join(__dirname, "../../download/neurostay-ai.apk"),
        path_1.default.join(__dirname, "../download/NeuroStayAI.apk"),
        path_1.default.join(__dirname, "../download/neurostay-ai.apk"),
        path_1.default.join(__dirname, "download/NeuroStayAI.apk"),
        path_1.default.join(__dirname, "download/neurostay-ai.apk"),
    ];
    for (const p of possiblePaths) {
        if (fs_1.default.existsSync(p)) {
            console.log(`[APK-DOWNLOAD] Serving APK from path: ${p}`);
            return res.download(p, "NeuroStayAI.apk");
        }
    }
    console.warn("[APK-DOWNLOAD] File not found in candidate paths.");
    return res.status(404).send("APK file not found on server.");
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
console.log("CORS enabled for allowed origins:", allowedOrigins);
app.options(/(.*)/, (0, cors_1.default)());
app.use(express_1.default.json());
// Rate Limiting for Auth & OTP routes
const authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/otp", authRateLimiter, otp_routes_1.default);
app.use("/api/auth", authRateLimiter, auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/recommendations", recommendation_routes_1.default);
app.use("/api/serpapi", serpapi_routes_1.default);
app.use("/api/saved", saved_routes_1.default);
app.get("/api/health", (req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
    res.status(200).json({
        status: "ok",
        database: isDbConnected ? "connected" : "connecting",
        server: "running",
    });
});
app.get("/health", (req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
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
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
});
// Verify SMTP connection on startup
try {
    const transporter = (0, email_service_1.createTransporter)();
    transporter.verify().then(() => {
        console.log("SMTP connected");
    }).catch((err) => {
        console.warn("SMTP connection notice:", err.message || err);
    });
}
catch (err) {
    console.warn("SMTP initialization notice:", err.message || err);
}
const PORT = process.env.PORT || 5000;
app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server started on 0.0.0.0:${PORT}`);
});
