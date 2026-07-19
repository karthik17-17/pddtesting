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
exports.searchPlacesHotels = void 0;
const googlePlaces_service_1 = require("../services/googlePlaces.service");
const searchPlacesHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }
        const hotels = yield (0, googlePlaces_service_1.searchRealHotels)(query);
        res.json({
            message: "Real hotels fetched successfully",
            results: hotels,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch real hotels",
            error: error.message,
        });
    }
});
exports.searchPlacesHotels = searchPlacesHotels;
