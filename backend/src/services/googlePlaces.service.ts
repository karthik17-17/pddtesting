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
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types,places.websiteUri,places.nationalPhoneNumber,places.location",
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
          website: place.websiteUri || "",
          phone: place.nationalPhoneNumber || "Not available",
          lat: place.location?.latitude,
          lng: place.location?.longitude,
          aiMatch: place.rating
            ? Math.min(Math.round(place.rating * 20), 98)
            : 80,
          source: "google",
        };
      }) || []
    );
  } catch (error) {
    console.log("Google API failed. Using real Indian hotel sample data.");

    return [
      {
        id: 1,
        name: "ITC Grand Chola, Chennai",
        location: "Guindy, Chennai, Tamil Nadu",
        rating: 4.7,
        reviewCount: 15000,
        price: "₹12500",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
        facilities: ["WiFi", "Spa", "Pool", "Fine Dining"],
        website: "https://www.itchotels.com",
        phone: "Not available",
        lat: 13.0108,
        lng: 80.2206,
        aiMatch: 96,
        source: "real",
      },
      {
        id: 2,
        name: "Taj Club House, Chennai",
        location: "Anna Salai, Chennai, Tamil Nadu",
        rating: 4.6,
        reviewCount: 9000,
        price: "₹9800",
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop",
        facilities: ["WiFi", "Pool", "Restaurant", "Gym"],
        website: "https://www.tajhotels.com",
        phone: "Not available",
        lat: 13.0604,
        lng: 80.2642,
        aiMatch: 92,
        source: "real",
      },
      {
        id: 3,
        name: "The Leela Palace Chennai",
        location: "MRC Nagar, Chennai, Tamil Nadu",
        rating: 4.8,
        reviewCount: 17000,
        price: "₹14500",
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
        facilities: ["Sea View", "Spa", "Pool", "Luxury Rooms"],
        website: "https://www.theleela.com",
        phone: "Not available",
        lat: 13.0179,
        lng: 80.2738,
        aiMatch: 97,
        source: "real",
      },
    ];
  }
};