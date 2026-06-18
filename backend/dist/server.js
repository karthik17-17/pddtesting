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
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const recommendation_routes_1 = __importDefault(require("./routes/recommendation.routes"));
const serpapi_routes_1 = __importDefault(require("./routes/serpapi.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use("/download", express_1.default.static(path_1.default.join(__dirname, "../../download")));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/otp", otp_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
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
