import express from "express";

const router = express.Router();

const hotels = [
  {
    id: "1",
    name: "Hotel Chennai Comfort",
    city: "Chennai",
    area: "T Nagar",
    price: 1800,
    rating: 4.4,
    amenities: ["WiFi", "AC", "Parking", "Breakfast"],
    image: "/images/hotel1.jpg",
  },
  {
    id: "2",
    name: "Marina Budget Stay",
    city: "Chennai",
    area: "Marina Beach",
    price: 1200,
    rating: 4.1,
    amenities: ["WiFi", "AC"],
    image: "/images/hotel2.jpg",
  },
  {
    id: "3",
    name: "Central Railway Inn",
    city: "Chennai",
    area: "Chennai Central",
    price: 1500,
    rating: 4.2,
    amenities: ["WiFi", "AC", "Restaurant"],
    image: "/images/hotel3.jpg",
  },
  {
    id: "4",
    name: "Luxury Grand Chennai",
    city: "Chennai",
    area: "Guindy",
    price: 3500,
    rating: 4.7,
    amenities: ["WiFi", "AC", "Pool", "Gym", "Breakfast"],
    image: "/images/hotel1.jpg",
  },
];

router.post("/search", (req, res) => {
  const { query } = req.body;

  const q = String(query || "").toLowerCase();

  const results = hotels
    .filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(q) ||
        hotel.area.toLowerCase().includes(q) ||
        q.includes(hotel.city.toLowerCase())
    )
    .map((hotel) => ({
      ...hotel,
      price: `₹${hotel.price}`,
      matchScore:
        hotel.rating >= 4.5 ? 96 : hotel.rating >= 4.2 ? 90 : 84,
      why: `${hotel.name} is recommended because it matches your search, has good rating, and useful facilities like ${hotel.amenities.join(
        ", "
      )}.`,
    }));

  res.json(results.length > 0 ? results : hotels);
});

export default router;