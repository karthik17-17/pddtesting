import { Request, Response } from "express";
import { searchHotelsFromSerpApi } from "../services/serpapi.service";

export async function searchHotels(req: Request, res: Response) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const hotels = await searchHotelsFromSerpApi(query);

    return res.status(200).json({
      success: true,
      query,
      hotels,
    });
  } catch (error: any) {
    console.error("SerpApi error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load hotel recommendations",
      error: error.message,
    });
  }
}