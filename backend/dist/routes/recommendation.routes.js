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
const router = express_1.default.Router();
router.post("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    const q = String(query || "").toLowerCase();
    if (!q) {
        return res.json([]);
    }
    try {
        const response = yield fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('hotels in ' + q)}&limit=5&addressdetails=1`);
        const data = yield response.json();
        if (data && data.length > 0) {
            const results = data.map((result, index) => ({
                id: index + 1,
                name: result.name || result.display_name.split(',')[0],
                city: q,
                address: result.display_name,
                price: "Price not available",
                rating: 4.0,
                amenities: ["WiFi", "AC"],
                image: "",
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                source: "OpenStreetMap",
                website: "",
                matchScore: Math.max(60, 90 - index * 2),
                why: `Recommended based on location proximity in ${q}.`,
                mapLink: `https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=18/${result.lat}/${result.lon}`
            }));
            return res.json(results);
        }
        return res.json([]);
    }
    catch (error) {
        console.error("Recommendation search error:", error);
        return res.json([]);
    }
}));
exports.default = router;
