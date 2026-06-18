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
const SavedHotel_model_1 = __importDefault(require("../models/SavedHotel.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// In-memory array to store saved hotels when MongoDB is offline
const mockSavedHotels = [];
router.post("/", auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const exists = yield SavedHotel_model_1.default.findOne({
            userId: req.user._id,
            hotelName: req.body.hotelName,
        });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Hotel already saved",
            });
        }
        const savedHotel = yield SavedHotel_model_1.default.create(Object.assign(Object.assign({}, req.body), { userId: req.user._id }));
        res.status(201).json({
            success: true,
            message: "Hotel saved successfully",
            savedHotel,
        });
    }
    catch (error) {
        console.log("MongoDB save failed, using mock fallback:", error);
        const mockHotel = Object.assign(Object.assign({}, req.body), { _id: "mock-id-" + Math.random().toString(36).substring(7), userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "demo-user-id", createdAt: new Date().toISOString() });
        // Check if already in mock
        const exists = mockSavedHotels.find(h => h.hotelName === req.body.hotelName && h.userId === mockHotel.userId);
        if (!exists) {
            mockSavedHotels.push(mockHotel);
        }
        res.status(201).json({
            success: true,
            message: "Hotel saved (Offline Mock)",
            savedHotel: mockHotel
        });
    }
}));
router.get("/", auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield SavedHotel_model_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            hotels,
        });
    }
    catch (error) {
        console.log("MongoDB fetch failed, returning mock array:", error);
        const userHotels = mockSavedHotels.filter(h => { var _a; return h.userId === (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "demo-user-id"); });
        res.json({
            success: true,
            hotels: userHotels.reverse(),
        });
    }
}));
router.delete("/:id", auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotel = yield SavedHotel_model_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!hotel) {
            return res.status(404).json({ success: false, message: "Not found or unauthorized" });
        }
        res.json({
            success: true,
            message: "Hotel removed",
        });
    }
    catch (error) {
        console.log("MongoDB delete failed, using mock array:", error);
        const index = mockSavedHotels.findIndex(h => { var _a; return h._id === req.params.id && h.userId === (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "demo-user-id"); });
        if (index !== -1) {
            mockSavedHotels.splice(index, 1);
        }
        res.json({
            success: true,
            message: "Hotel removed (Offline Mock)",
        });
    }
}));
exports.default = router;
