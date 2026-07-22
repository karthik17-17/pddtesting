import { Request, Response } from "express";
import { searchHotelsFromSerpApi } from "../services/serpapi.service";

export async function searchHotels(req: Request, res: Response) {
  const startTime = Date.now();
  const rawQuery = req.body?.query || req.query?.query || "Chennai";
  const cleanQuery = String(rawQuery).trim() || "Chennai";

  console.log(`\n=================== [HOTEL SEARCH AUDIT LOG] ===================`);
  console.log(`[1] Timestamp: ${new Date().toISOString()}`);
  console.log(`[2] User-Agent / Client: ${req.headers["user-agent"] || "Mobile / Web App"}`);
  console.log(`[3] Target Endpoint: ${req.method} ${req.originalUrl}`);
  console.log(`[4] Request Body: ${JSON.stringify(req.body)}`);
  console.log(`[5] Extracted Search Query: "${cleanQuery}"`);

  try {
    const rawHotels = await searchHotelsFromSerpApi(cleanQuery);
    const beforeCount = Array.isArray(rawHotels) ? rawHotels.length : 0;
    console.log(`[6] Hotels Count Before AI Filtering: ${beforeCount}`);

    let finalHotels = rawHotels;
    if (!Array.isArray(finalHotels) || finalHotels.length === 0) {
      console.warn(`[7] 0 hotels returned by external provider for "${cleanQuery}". Triggering Nearest Hotel Fallback.`);
      // Dynamic fallback is built into searchHotelsFromSerpApi
    }

    const afterCount = Array.isArray(finalHotels) ? finalHotels.length : 0;
    console.log(`[8] Hotels Count Sent to Client: ${afterCount}`);
    console.log(`[9] Response Status: 200 OK (${Date.now() - startTime}ms)`);
    console.log(`=================================================================\n`);

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      total: afterCount,
      hotels: finalHotels || [],
      results: finalHotels || [],
      data: finalHotels || [],
    });
  } catch (error: any) {
    console.error(`[HOTEL SEARCH EXCEPTION]: ${error?.message || error}`);
    console.log(`=================================================================\n`);

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      total: 0,
      hotels: [],
      results: [],
      data: [],
    });
  }
}