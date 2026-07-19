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
exports.searchHotelsFromOSM = searchHotelsFromOSM;
const axios_1 = __importDefault(require("axios"));
function searchHotelsFromOSM(query) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Convert city name to latitude/longitude using Nominatim
        const geoRes = yield axios_1.default.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: query,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "NeuroStayAI/1.0",
            },
        });
        if (!geoRes.data || geoRes.data.length === 0) {
            return [];
        }
        const lat = geoRes.data[0].lat;
        const lon = geoRes.data[0].lon;
        // 2. Search hotels nearby using Overpass API
        const overpassQuery = `
    [out:json];
    (
      node["tourism"="hotel"](around:5000,${lat},${lon});
      way["tourism"="hotel"](around:5000,${lat},${lon});
      relation["tourism"="hotel"](around:5000,${lat},${lon});
      node["tourism"="guest_house"](around:5000,${lat},${lon});
      node["tourism"="hostel"](around:5000,${lat},${lon});
    );
    out center;
  `;
        const hotelRes = yield axios_1.default.post("https://overpass-api.de/api/interpreter", overpassQuery, {
            headers: {
                "Content-Type": "text/plain",
            },
        });
        const hotels = hotelRes.data.elements.map((item, index) => {
            var _a, _b;
            const tags = item.tags || {};
            return {
                id: item.id || index,
                name: tags.name || `Hotel ${index + 1}`,
                address: tags["addr:street"] ||
                    tags["addr:full"] ||
                    geoRes.data[0].display_name,
                latitude: item.lat || ((_a = item.center) === null || _a === void 0 ? void 0 : _a.lat),
                longitude: item.lon || ((_b = item.center) === null || _b === void 0 ? void 0 : _b.lon),
                type: tags.tourism || "hotel",
                phone: tags.phone || "Not available",
                website: tags.website || "Not available",
                rating: Number((3.8 + Math.random() * 1.1).toFixed(1)),
                price: Math.floor(1200 + Math.random() * 3000),
                matchScore: Math.floor(80 + Math.random() * 18),
                whyThisHotel: [
                    "Located near your searched area",
                    "Suitable for budget-friendly stay",
                    "Good option based on distance and hotel type",
                ],
            };
        });
        return hotels;
    });
}
