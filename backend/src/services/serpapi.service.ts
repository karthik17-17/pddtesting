export async function searchHotelsFromSerpApi(query: string) {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    throw new Error("SERPAPI_API_KEY missing in .env");
  }

  const url =
    `https://serpapi.com/search.json?engine=google_hotels` +
    `&q=${encodeURIComponent(query)}` +
    `&gl=in` +
    `&hl=en` +
    `&currency=INR` +
    `&api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data from SerpApi");
  }

  const data = await response.json();

  const hotels = data.properties || [];

  return hotels.map((hotel: any, index: number) => {
    const rating = hotel.overall_rating || 4.0;
    const priceText = hotel.rate_per_night?.lowest || "₹2000";
    const priceNumber =
      Number(String(priceText).replace(/[^\d]/g, "")) || 2000;

    const matchScore = calculateMatchScore(priceNumber, rating);

    return {
      id: hotel.property_token || index + 1,
      name: hotel.name || "Hotel Name Not Available",
      image:
        hotel.images?.[0]?.thumbnail ||
        "/images/hotel1.jpg",
      rating,
      price: priceNumber,
      location: hotel.neighborhood || query,
      address: hotel.address || "Address not available",
      amenities: hotel.amenities || ["WiFi", "AC"],
      reviews: hotel.reviews || 0,
      description:
        hotel.description ||
        "Comfortable hotel recommended by NeuroStay AI.",
      mapLink:
        hotel.link ||
        `https://www.google.com/maps/search/${encodeURIComponent(
          hotel.name || query
        )}`,
      matchScore,
      reason: generateReason(priceNumber, rating, matchScore),
    };
  });
}

function calculateMatchScore(price: number, rating: number) {
  let priceScore = price <= 1500 ? 40 : price <= 2500 ? 30 : 20;
  let ratingScore = rating >= 4.5 ? 30 : rating >= 4.0 ? 25 : 18;
  let locationScore = 20;
  let amenityScore = 10;

  return priceScore + ratingScore + locationScore + amenityScore;
}

function generateReason(price: number, rating: number, score: number) {
  return `This hotel has a ${score}% AI match score based on price, rating, location and amenities. It is suitable for your search because it offers good value at ₹${price} with a ${rating} star rating.`;
}