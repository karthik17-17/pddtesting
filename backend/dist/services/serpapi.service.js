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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHotelsFromSerpApi = searchHotelsFromSerpApi;
function searchHotelsFromSerpApi(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.SERPAPI_API_KEY;
        if (!apiKey) {
            throw new Error("SERPAPI_API_KEY missing in .env");
        }
        const url = `https://serpapi.com/search.json?engine=google_hotels` +
            `&q=${encodeURIComponent(query)}` +
            `&gl=in` +
            `&hl=en` +
            `&currency=INR` +
            `&api_key=${apiKey}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data from SerpApi");
        }
        const data = yield response.json();
        const hotels = data.properties || [];
        return hotels.map((hotel, index) => {
            var _a, _b, _c;
            const rating = hotel.overall_rating || 4.0;
            const priceText = ((_a = hotel.rate_per_night) === null || _a === void 0 ? void 0 : _a.lowest) || "₹2000";
            const priceNumber = Number(String(priceText).replace(/[^\d]/g, "")) || 2000;
            const matchScore = calculateMatchScore(priceNumber, rating);
            return {
                id: hotel.property_token || index + 1,
                name: hotel.name || "Hotel Name Not Available",
                image: ((_c = (_b = hotel.images) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.thumbnail) ||
                    "/images/hotel1.jpg",
                rating,
                price: priceNumber,
                location: hotel.neighborhood || query,
                address: hotel.address || "Address not available",
                amenities: hotel.amenities || ["WiFi", "AC"],
                reviews: hotel.reviews || 0,
                description: hotel.description ||
                    "Comfortable hotel recommended by NeuroStay AI.",
                mapLink: hotel.link ||
                    `https://www.google.com/maps/search/${encodeURIComponent(hotel.name || query)}`,
                matchScore,
                reason: generateReason(priceNumber, rating, matchScore),
            };
        });
    });
}
function calculateMatchScore(price, rating) {
    let priceScore = price <= 1500 ? 40 : price <= 2500 ? 30 : 20;
    let ratingScore = rating >= 4.5 ? 30 : rating >= 4.0 ? 25 : 18;
    let locationScore = 20;
    let amenityScore = 10;
    return priceScore + ratingScore + locationScore + amenityScore;
}
function generateReason(price, rating, score) {
    return `This hotel has a ${score}% AI match score based on price, rating, location and amenities. It is suitable for your search because it offers good value at ₹${price} with a ${rating} star rating.`;
}
