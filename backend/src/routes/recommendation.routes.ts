import express from "express";
import { searchHotels } from "../controllers/serpapi.controller";

const router = express.Router();

router.post("/search", searchHotels);
router.post("/", searchHotels);
router.get("/search", searchHotels);
router.get("/", searchHotels);

export default router;