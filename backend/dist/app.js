"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/recommendations", recommendation_routes_1.default);
app.use("/api/saved", saved_routes_1.default);
app.use("/api/serpapi", serpapi_routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/", (req, res) => {
    res.send("NeuroStay AI Backend Running");
});
exports.default = app;
