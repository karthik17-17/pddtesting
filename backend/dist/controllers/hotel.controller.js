"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHotels = void 0;
const hotels_1 = require("../data/hotels");
const searchHotels = (req, res) => {
    const { query } = req.body;
    const searchText = String(query || "").toLowerCase();
    const results = hotels_1.hotels.map((hotel) => {
        let matchScore = 75;
        const reasons = [];
        if (searchText.includes(hotel.city.toLowerCase()) ||
            searchText.includes(hotel.area.toLowerCase())) {
            matchScore += 10;
            reasons.push(`Located in ${hotel.city} (${hotel.area}), matching your search location.`);
        }
        hotel.amenities.forEach((facility) => {
            if (searchText.includes(facility.toLowerCase())) {
                matchScore += 5;
                reasons.push(`Includes ${facility}, which you requested.`);
            }
        });
        if (hotel.rating >= 4.5) {
            matchScore += 5;
            reasons.push("Highly rated by guests.");
        }
        if (reasons.length === 0) {
            reasons.push("Recommended based on overall price, rating, and facilities.");
        }
        return Object.assign(Object.assign({}, hotel), { price: `₹${hotel.price}`, rating: String(hotel.rating), matchScore: Math.min(matchScore, 98), reasons });
    });
    res.json({
        message: "AI hotel results generated",
        results,
    });
};
exports.searchHotels = searchHotels;
