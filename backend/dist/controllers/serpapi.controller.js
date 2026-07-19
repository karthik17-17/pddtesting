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
exports.searchHotels = searchHotels;
const serpapi_service_1 = require("../services/serpapi.service");
function searchHotels(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: "Query is required",
                });
            }
            const hotels = yield (0, serpapi_service_1.searchHotelsFromSerpApi)(query);
            return res.status(200).json({
                success: true,
                query,
                hotels,
            });
        }
        catch (error) {
            console.error("SerpApi error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Unable to load hotel recommendations",
                error: error.message,
            });
        }
    });
}
