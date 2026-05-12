import express from "express";
import { searchPlacesHotels } from "../controllers/places.controller";

const router = express.Router();

router.post("/search", searchPlacesHotels);

export default router;