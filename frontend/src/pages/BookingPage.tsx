import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "https://neurostay-ai.onrender.com";

export default function BookingPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const hotel =
    JSON.parse(localStorage.getItem("bookingHotel") || "null") ||
    JSON.parse(localStorage.getItem("selectedHotel") || "null");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [guestName, setGuestName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#071028] text-white p-8">
        <h1 className="text-4xl font-bold mb-4">No hotel selected</h1>
        <button
          onClick={() => navigate("/results?query=hotels%20in%20Chennai")}
          className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold"
        >
          Go to Hotels
        </button>
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hotelName: hotel.name,
        hotelImage: hotel.image,
        price: hotel.price,
        guestName,
        phone,
        checkIn,
        checkOut,
        guests,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      error("Booking Failed", data.message || "Could not confirm booking. Please try again.");
      return;
    }

    success("Booking Confirmed! 🎉", `Your stay at ${hotel.name} has been booked successfully.`);
    navigate("/bookings");
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-8">Confirm Booking</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-3xl overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-72 object-cover"
          />

          <div className="p-6">
            <h2 className="text-3xl font-bold">{hotel.name}</h2>
            <p className="text-slate-300 mt-2">{hotel.address}</p>
            <p className="mt-3">⭐ {hotel.rating}</p>
            <p className="text-cyan-400 font-bold mt-2">{hotel.price}</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="bg-slate-800 p-8 rounded-3xl">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Guest Name"
            className="w-full p-4 mb-4 rounded-xl text-black"
            required
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-4 mb-4 rounded-xl text-black"
            required
          />

          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl text-black"
            required
          />

          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full p-4 mb-4 rounded-xl text-black"
            required
          />

          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full p-4 mb-6 rounded-xl text-black"
            required
          />

          <button className="w-full bg-cyan-500 text-black py-4 rounded-xl font-bold">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}