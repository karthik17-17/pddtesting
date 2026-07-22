"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const recommendation_routes_1 = __importDefault(require("./routes/recommendation.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
const serpapi_routes_1 = __importDefault(require("./routes/serpapi.routes"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:19006",
    "http://127.0.0.1:5173",
    "https://neurostay-web.vercel.app",
    process.env.CLIENT_URL,
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
}));
app.use(express_1.default.json());
const path_1 = __importDefault(require("path"));
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
const hotel_routes_1 = __importDefault(require("./routes/hotel.routes"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/recommendations", recommendation_routes_1.default);
app.use("/api/saved", saved_routes_1.default);
app.use("/api/serpapi", serpapi_routes_1.default);
app.use("/api/hotels", hotel_routes_1.default);
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
exports.default = app;
