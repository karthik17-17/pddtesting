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
const osmHotel_service_1 = require("../services/osmHotel.service");
const router = express_1.default.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "OSM route working",
    });
});
router.post("/hotels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required",
            });
        }
        const hotels = yield (0, osmHotel_service_1.searchHotelsFromOSM)(query);
        res.json({
            success: true,
            query,
            count: hotels.length,
            hotels,
        });
    }
    catch (error) {
        console.error("OSM hotel route error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotels",
        });
    }
}));
exports.default = router;
