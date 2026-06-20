"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const recommendation_routes_1 = __importDefault(require("./routes/recommendation.routes"));
const serpapi_routes_1 = __importDefault(require("./routes/serpapi.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
dotenv_1.default.config();
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
// Secure application by setting various HTTP headers
app.use((0, helmet_1.default)());
app.use("/download", express_1.default.static(path_1.default.join(__dirname, "../../download")));
// Safe CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:8081",
        "http://localhost:19006"
    ];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
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
app.get("/", (req, res) => {
    res.send("NeuroStay AI Backend Running");
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
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
