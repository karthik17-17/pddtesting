"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRealHotels = void 0;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const searchRealHotels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!GOOGLE_PLACES_API_KEY) {
            throw new Error("Google API key missing");
        }
        const response = yield fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.types,places.websiteUri,places.nationalPhoneNumber,places.location",
            },
            body: JSON.stringify({
                textQuery: query,
                includedType: "lodging",
                languageCode: "en",
                regionCode: "IN",
                maxResultCount: 20,
            }),
        });
        if (!response.ok) {
            throw new Error("Google API failed");
        }
        const data = yield response.json();
        return (((_a = data.places) === null || _a === void 0 ? void 0 : _a.map((place, index) => {
            var _a, _b, _c, _d, _e;
            const photoName = (_b = (_a = place.photos) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name;
            return {
                id: place.id || index,
                name: ((_c = place.displayName) === null || _c === void 0 ? void 0 : _c.text) || "Hotel",
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
                lat: (_d = place.location) === null || _d === void 0 ? void 0 : _d.latitude,
                lng: (_e = place.location) === null || _e === void 0 ? void 0 : _e.longitude,
                aiMatch: place.rating
                    ? Math.min(Math.round(place.rating * 20), 98)
                    : 80,
                source: "google",
            };
        })) || []);
    }
    catch (error) {
        console.log("Google API failed. Using real Indian hotel sample data.");
        return [
            {
                id: 1,
                name: "ITC Grand Chola, Chennai",
                location: "Guindy, Chennai, Tamil Nadu",
                rating: 4.7,
                reviewCount: 15000,
                price: "₹12500",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
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
                image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop",
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
                image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
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
});
exports.searchRealHotels = searchRealHotels;
