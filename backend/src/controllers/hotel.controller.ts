import { Request, Response } from "express";
import hotels from "../data/hotels";

export const searchHotels = (req: Request, res: Response) => {
  const { query } = req.body;

  const searchText = String(query || "").toLowerCase();

  const results = hotels.map((hotel) => {
    let matchScore = 75;
    const reasons: string[] = [];

    if (searchText.includes(hotel.location.toLowerCase())) {
      matchScore += 10;
      reasons.push(`Located in ${hotel.location}, matching your search location.`);
    }

    hotel.facilities.forEach((facility) => {
      if (searchText.includes(facility.toLowerCase())) {
        matchScore += 5;
        reasons.push(`Includes ${facility}, which you requested.`);
      }
    });

    if (hotel.rating >= 4.5) {
      matchScore += 5;
      reasons.push("Highly rated by guests.");
    }

    if (reasons.length === 0) {
      reasons.push("Recommended based on overall price, rating, and facilities.");
    }

    return {
      ...hotel,
      price: `₹${hotel.price}`,
      rating: String(hotel.rating),
      matchScore: Math.min(matchScore, 98),
      reasons,
    };
  });

  res.json({
    message: "AI hotel results generated",
    results,
  });
};