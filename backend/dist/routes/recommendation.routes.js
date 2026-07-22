"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_middleware_1 = require("../middleware/validation.middleware");
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const recommendationsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
router.post("/search", validation_middleware_1.validateSearch, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    const q = String(query || "").trim();
    if (!q) {
        return res.json([]);
    }
    const cacheKey = q.toLowerCase();
    const cached = recommendationsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`CACHE HIT: Returning cached recommendations for "${cacheKey}"`);
        return res.json(cached.data);
    }
    const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
    const headers = {
        "User-Agent": "NeuroStayAI/1.0 (contact: support@neurostay.ai)"
    };
    try {
        console.log(`Recommendations API: Searching Nominatim for "hotels in ${q}"...`);
        const osmResponse = yield axios_1.default.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('hotels in ' + q)}&limit=15&addressdetails=1`, { headers, timeout: 8000 });
        const data = osmResponse.data || [];
        console.log(`Recommendations API: Found ${data.length} records.`);
        if (data && data.length > 0) {
            const results = data.map((result, index) => ({
                id: index + 1,
                name: result.name || result.display_name.split(',')[0],
                city: q,
                address: result.display_name,
                price: "Price not available",
                rating: parseFloat((4.0 + (index % 10) * 0.1).toFixed(1)),
                amenities: ["WiFi", "AC"],
                image: defaultImage,
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                source: "OpenStreetMap",
                website: "",
                matchScore: Math.max(60, 90 - index * 2),
                why: `Recommended based on location proximity in ${q}.`,
                mapLink: `https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=18/${result.lat}/${result.lon}`
            }));
            recommendationsCache.set(cacheKey, { timestamp: Date.now(), data: results });
            return res.json(results);
        }
        recommendationsCache.set(cacheKey, { timestamp: Date.now(), data: [] });
        return res.json([]);
    }
    catch (error) {
        console.error("Recommendation search error:", error);
        return res.json([]);
    }
}));
exports.default = router;
