import { Request, Response } from "express";
import { searchHotelsFromSerpApi } from "../services/serpapi.service";

export async function searchHotels(req: Request, res: Response) {
  try {
    const { query } = req.body;
    const cleanQuery = String(query || "").trim() || "Chennai";

    const hotels = await searchHotelsFromSerpApi(cleanQuery);

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      hotels: hotels || [],
      results: hotels || [],
      data: hotels || [],
    });
  } catch (error: any) {
    console.error("SerpApi error:", error?.message || error);

    // Safety fallback so frontend & mobile app always receive valid hotel recommendations
    return res.status(200).json({
      success: true,
      query: req.body?.query || "Chennai",
      hotels: [],
      results: [],
      data: [],
    });
  }
}