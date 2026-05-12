import { Request, Response } from "express";
import { searchRealHotels } from "../services/googlePlaces.service";

export const searchPlacesHotels = async (
  req: Request,
  res: Response
) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const hotels = await searchRealHotels(query);

    res.json({
      message: "Real hotels fetched successfully",
      results: hotels,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch real hotels",
      error: error.message,
    });
  }
};