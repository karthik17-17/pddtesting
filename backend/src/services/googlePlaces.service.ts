const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export const searchRealHotels = async (query: string) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error("Google API key missing");
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types",
        },
        body: JSON.stringify({
          textQuery: query,
          includedType: "lodging",
          languageCode: "en",
          regionCode: "IN",
          maxResultCount: 20,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Google API failed");
    }

    const data = await response.json();

    return (
      data.places?.map((place: any, index: number) => {
        const photoName = place.photos?.[0]?.name;

        return {
          id: place.id || index,
          name: place.displayName?.text || "Hotel",
          location: place.formattedAddress || "India",
          rating: place.rating || 4.2,
          reviewCount: place.userRatingCount || 0,
          price: "Price not available",
          image: photoName
            ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=900&key=${GOOGLE_PLACES_API_KEY}`
            : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
          facilities: place.types || ["Hotel"],
          aiMatch: place.rating
            ? Math.min(Math.round(place.rating * 20), 98)
            : 80,
          source: "google",
        };
      }) || []
    );
  } catch (error) {
    console.log("Using fallback hotel data");

    return [
      {
        id: 1,
        name: "Grand Palace Hotel",
        location: "Chennai",
        rating: 4.5,
        reviewCount: 1200,
        price: "₹2500",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
        facilities: ["WiFi", "AC", "Breakfast"],
        aiMatch: 95,
        source: "demo",
      },
      {
        id: 2,
        name: "Sea View Resort",
        location: "Goa",
        rating: 4.7,
        reviewCount: 980,
        price: "₹4200",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        facilities: ["Pool", "WiFi", "Beach Access"],
        aiMatch: 97,
        source: "demo",
      },
      {
        id: 3,
        name: "Mountain Stay Inn",
        location: "Ooty",
        rating: 4.3,
        reviewCount: 750,
        price: "₹3100",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        facilities: ["Heater", "WiFi", "Parking"],
        aiMatch: 90,
        source: "demo",
      },
    ];
  }
};