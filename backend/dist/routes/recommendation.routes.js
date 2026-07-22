"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serpapi_controller_1 = require("../controllers/serpapi.controller");
const router = express_1.default.Router();
router.post("/search", serpapi_controller_1.searchHotels);
router.post("/", serpapi_controller_1.searchHotels);
router.get("/search", serpapi_controller_1.searchHotels);
router.get("/", serpapi_controller_1.searchHotels);
exports.default = router;
