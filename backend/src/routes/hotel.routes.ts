import express from "express";
import { searchHotels } from "../controllers/hotel.controller";

const router = express.Router();

router.post("/search", searchHotels);

export default router;