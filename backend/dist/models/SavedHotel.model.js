"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savedHotelSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    hotelName: String,
    hotelImage: String,
    price: String,
    address: String,
    rating: Number,
    matchScore: Number,
    why: String,
    mapLink: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("SavedHotel", savedHotelSchema);
