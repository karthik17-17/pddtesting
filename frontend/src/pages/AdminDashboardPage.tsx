import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  hotelName: string;
  hotelImage: string;
  price: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
}

interface SavedHotel {
  _id: string;
  hotelName: string;
  hotelImage: string;
  price: string;
  rating: number;
}

export default function AdminDashboardPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedHotels, setSavedHotels] = useState<SavedHotel[]>([]);

  useEffect(() => {
    fetchBookings();
    fetchSavedHotels();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSavedHotels = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saved`);
      const data = await res.json();

      if (data.success) {
        setSavedHotels(data.hotels);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Delete booking?")) return;

    await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "DELETE",
    });

    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-8 rounded-3xl">
          <h2 className="text-xl">Total Bookings</h2>

          <p className="text-5xl text-cyan-400 font-bold mt-4">
            {bookings.length}
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl">
          <h2 className="text-xl">Saved Hotels</h2>

          <p className="text-5xl text-green-400 font-bold mt-4">
            {savedHotels.length}
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl">
          <h2 className="text-xl">Revenue</h2>

          <p className="text-5xl text-yellow-400 font-bold mt-4">
            ₹{bookings.length * 1500}
          </p>
        </div>
      </div>

      {/* Bookings */}
      <h2 className="text-3xl font-bold mb-6">
        Booking Management
      </h2>

      <div className="grid gap-6 mb-12">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-slate-800 rounded-3xl p-6 flex gap-6"
          >
            <img
              src={booking.hotelImage}
              className="w-52 h-40 rounded-2xl object-cover"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {booking.hotelName}
              </h2>

              <p className="mt-2">
                Guest: {booking.guestName}
              </p>

              <p>Phone: {booking.phone}</p>

              <p>
                {booking.checkIn} → {booking.checkOut}
              </p>

              <p>Guests: {booking.guests}</p>

              <p>Status: {booking.status}</p>

              <p className="text-cyan-400 font-bold mt-2">
                {booking.price}
              </p>

              <button
                onClick={() => deleteBooking(booking._id)}
                className="mt-4 bg-red-500 px-5 py-3 rounded-xl"
              >
                Delete Booking
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Hotels */}
      <h2 className="text-3xl font-bold mb-6">
        Saved Hotels
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {savedHotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-slate-800 rounded-3xl overflow-hidden"
          >
            <img
              src={hotel.hotelImage}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-2xl font-bold">
                {hotel.hotelName}
              </h2>

              <p className="mt-3">
                ⭐ {hotel.rating}
              </p>

              <p className="text-cyan-400 font-bold mt-2">
                {hotel.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}