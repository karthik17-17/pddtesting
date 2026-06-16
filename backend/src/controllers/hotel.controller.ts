import { Request, Response } from "express";
import { hotels } from "../data/hotels";

interface HotelInput {
  id: number;
  name: string;
  city: string;
  area: string;
  price: number;
  rating: number;
  amenities: string[];
}

export const searchHotels = (req: Request, res: Response) => {
  const { query } = req.body;

  const searchText = String(query || "").toLowerCase();

  const results = hotels.map((hotel: HotelInput) => {
    let matchScore = 75;
    const reasons: string[] = [];

    if (
      searchText.includes(hotel.city.toLowerCase()) ||
      searchText.includes(hotel.area.toLowerCase())
    ) {
      matchScore += 10;
      reasons.push(`Located in ${hotel.city} (${hotel.area}), matching your search location.`);
    }

    hotel.amenities.forEach((facility: string) => {
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