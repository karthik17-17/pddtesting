import { useParams, useNavigate } from "react-router-dom";
import MapView from "../components/map/MapView";
import ReviewCard from "../components/hotel/ReviewCard";

const hotels = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    location: "Chennai",
    price: "2500",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    facilities: ["Free WiFi", "AC", "Parking", "Restaurant"],
    about:
      "Grand Palace Hotel is a comfortable hotel with modern rooms, excellent facilities, and easy access to important city locations.",
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Goa",
    price: "4200",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1200&auto=format&fit=crop",
    facilities: ["Free WiFi", "Swimming Pool", "Restaurant", "Beach Access"],
    about:
      "Ocean View Resort is ideal for beach lovers and luxury stays with beautiful rooms and relaxing surroundings.",
  },
  {
    id: 3,
    name: "Mountain Stay Inn",
    location: "Ooty",
    price: "3100",
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
    facilities: ["Free WiFi", "Parking", "Mountain View", "Room Service"],
    about:
      "Mountain Stay Inn gives a peaceful hill-station experience with scenic views and cozy rooms.",
  },
];

function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const hotel = hotels.find((item) => item.id === Number(id)) || hotels[0];

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-[420px] object-cover rounded-3xl"
      />

      <div className="flex justify-between items-center mt-8">
        <div>
          <h1 className="text-6xl font-bold">{hotel.name}</h1>
          <p className="text-gray-400 text-xl mt-3">📍 {hotel.location}</p>
        </div>

        <div className="bg-cyan-500 text-black px-6 py-3 rounded-2xl font-bold text-xl">
          ⭐ {hotel.rating} Rating
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-10">
        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-5">Facilities</h2>

          <ul className="space-y-3 text-gray-300">
            {hotel.facilities.map((facility) => (
              <li key={facility}>✅ {facility}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-5">About Hotel</h2>

          <p className="text-gray-300 leading-8">{hotel.about}</p>

          <p className="text-cyan-400 text-4xl font-bold mt-8">
            ₹{hotel.price}
          </p>

          <button
            onClick={() => navigate(`/booking/${hotel.id}`)}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-4 rounded-2xl"
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6 mt-10">
        <h2 className="text-3xl font-bold mb-5">Why this hotel?</h2>

        <p className="text-gray-300 leading-8">
          This hotel is recommended because it matches your search preferences
          based on location, facilities, rating, comfort, and price value.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-5">Public Reviews</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <ReviewCard
            name="Rahul"
            rating={4.5}
            comment="Clean rooms, good service, and very comfortable stay."
          />

          <ReviewCard
            name="Priya"
            rating={4.8}
            comment="Great location and friendly staff. Worth the price."
          />

          <ReviewCard
            name="Arjun"
            rating={4.3}
            comment="Nice facilities and peaceful environment."
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-5">Hotel Location</h2>
        <MapView />
      </div>
    </div>
  );
}

export default HotelDetailPage;