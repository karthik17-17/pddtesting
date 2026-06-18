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
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.get("/hotels", (req, res) => {
    res.json({
        success: true,
        message: "SerpApi route working. Use POST for hotel search.",
    });
});
const normalizeQuery = (query) => {
    let q = query ? query.trim() : "";
    if (!q)
        return "hotels in Chennai India";
    // Spell fixes
    q = q.replace(/tirupathi/gi, "Tirupati").replace(/srikalahasthi/gi, "Srikalahasti");
    const lower = q.toLowerCase();
    // If the query does not contain "hotel" or "hotels"
    if (!lower.includes("hotel")) {
        const capitalized = q
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        q = `hotels in ${capitalized} India`;
    }
    else {
        // Already contains "hotel" or "hotels"
        if (!lower.includes("india")) {
            q = `${q} India`;
        }
    }
    return q.replace(/\s+/g, " ").trim();
};
const getCityName = (query) => {
    if (!query)
        return "Chennai";
    let city = query
        .replace(/(budget|luxury|family|cheap)?\s*hotels?\s+(in|near)\s+/gi, "")
        .replace(/\b(india)\b/gi, "")
        .replace(/,/g, "")
        .trim();
    city = city.split(/\s+(with|under|for)\s+/i)[0].trim();
    city = city.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    return city || "Chennai";
};
const mapHotel = (hotel, index, city) => {
    var _a, _b, _c, _d;
    const name = hotel.name || hotel.title || "Hotel";
    const address = hotel.address || hotel.display_name || "Address not available";
    const rating = parseFloat(String(hotel.overall_rating || hotel.rating || 4.2));
    // Format price
    let rawPrice = ((_a = hotel.rate_per_night) === null || _a === void 0 ? void 0 : _a.lowest) || ((_b = hotel.total_rate) === null || _b === void 0 ? void 0 : _b.lowest) || hotel.price || "Price not available";
    let price = "Price not available";
    if (rawPrice && rawPrice !== "Price not available") {
        let str = String(rawPrice).trim();
        if (!str.includes("₹") && !str.includes("$") && !str.includes("Rs")) {
            const digits = str.replace(/[^\d]/g, "");
            if (digits) {
                price = `₹${digits}`;
            }
            else {
                price = str;
            }
        }
        else {
            price = str;
        }
    }
    // Handle image
    let image = "";
    if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
        image = ((_c = hotel.images[0]) === null || _c === void 0 ? void 0 : _c.thumbnail) || ((_d = hotel.images[0]) === null || _d === void 0 ? void 0 : _d.original_image) || "";
    }
    else {
        image = hotel.image || hotel.thumbnail || "";
    }
    // Handle coordinates
    let lat = null;
    let lng = null;
    if (hotel.gps_coordinates) {
        lat = parseFloat(hotel.gps_coordinates.latitude);
        lng = parseFloat(hotel.gps_coordinates.longitude);
    }
    else if (hotel.lat !== undefined && hotel.lon !== undefined) {
        lat = parseFloat(hotel.lat);
        lng = parseFloat(hotel.lon);
    }
    else if (hotel.latitude !== undefined && hotel.longitude !== undefined) {
        lat = parseFloat(hotel.latitude);
        lng = parseFloat(hotel.longitude);
    }
    const matchScore = hotel.matchScore || Math.max(70, 98 - index * 4);
    const why = hotel.why || `Good match in ${city} because of user preferences, ratings, and location convenience.`;
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
    return {
        id: index + 1,
        name,
        address,
        rating,
        price,
        image,
        matchScore,
        why,
        mapLink,
        lat,
        lng
    };
};
router.post("/hotels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    console.log("Hotel search query:", query);
    const normalizedQuery = normalizeQuery(query);
    const city = getCityName(query);
    let rawHotels = [];
    // 1. Try google_hotels if SERPAPI_KEY exists
    if (process.env.SERPAPI_KEY) {
        try {
            const response = yield axios_1.default.get("https://serpapi.com/search.json", {
                params: {
                    engine: "google_hotels",
                    q: normalizedQuery,
                    check_in_date: "2026-06-20",
                    check_out_date: "2026-06-21",
                    adults: 1,
                    currency: "INR",
                    gl: "in",
                    hl: "en",
                    api_key: process.env.SERPAPI_KEY,
                },
                timeout: 15000,
            });
            const properties = response.data.properties || [];
            if (properties.length > 0) {
                rawHotels = properties;
            }
        }
        catch (error) {
            console.log("SerpAPI error:", error.message);
        }
        // 2. Try organic Google search fallback if google_hotels returned nothing
        if (rawHotels.length === 0) {
            try {
                const response = yield axios_1.default.get("https://serpapi.com/search.json", {
                    params: {
                        engine: "google",
                        q: normalizedQuery,
                        location: "India",
                        gl: "in",
                        hl: "en",
                        api_key: process.env.SERPAPI_KEY,
                    },
                    timeout: 15000,
                });
                const placesResults = response.data.local_results || response.data.places_results || [];
                if (placesResults.length > 0) {
                    rawHotels = placesResults;
                }
            }
            catch (error) {
                console.log("SerpAPI error:", error.message);
            }
        }
    }
    // 3. Try OpenStreetMap Nominatim API as fallback
    if (rawHotels.length === 0) {
        try {
            const nominatimQuery = encodeURIComponent(`hotels in ${city}`);
            const osmResponse = yield axios_1.default.get(`https://nominatim.openstreetmap.org/search?format=json&q=${nominatimQuery}&limit=30&addressdetails=1`);
            if (osmResponse.data && osmResponse.data.length > 0) {
                rawHotels = osmResponse.data;
            }
        }
        catch (error) {
            console.log("OpenStreetMap fallback failed:", error.message);
        }
    }
    // Filter out forbidden keywords
    const forbiddenKeywords = [
        "closest hotels", "budget hotels near", "hotels near", "top hotels", "best hotels",
        "goibibo", "makemytrip", "tripadvisor", "list", "search results", "agoda", "booking.com"
    ];
    let filtered = rawHotels.filter(h => {
        const name = h.name || h.title || (h.display_name ? h.display_name.split(',')[0] : "");
        if (!name || name.toLowerCase() === "hotel")
            return false;
        const nameLower = name.toLowerCase();
        for (const keyword of forbiddenKeywords) {
            if (nameLower.includes(keyword))
                return false;
        }
        return true;
    });
    // Map to exact required format
    const hotels = filtered.map((h, index) => mapHotel(h, index, city));
    console.log("Hotels found:", hotels.length);
    res.json({
        success: true,
        query: normalizedQuery,
        count: hotels.length,
        hotels,
    });
}));
exports.default = router;
