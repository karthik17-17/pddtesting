import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Booking = {
  _id: string;
  hotelName: string;
  hotelImage?: string;
  price: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    const res = await fetch(`${API_URL}/api/bookings`);
    const data = await res.json();

    if (data.success) {
      setBookings(data.bookings);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id: string) => {
    const res = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Booking cancelled");
      fetchBookings();
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-5xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-slate-800 rounded-2xl overflow-hidden">
              {booking.hotelImage && (
                <img
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold">{booking.hotelName}</h2>
                <p className="text-cyan-400 font-bold mt-2">{booking.price}</p>
                <p className="mt-3">Guest: {booking.guestName}</p>
                <p>Phone: {booking.phone}</p>
                <p>Check-In: {booking.checkIn}</p>
                <p>Check-Out: {booking.checkOut}</p>
                <p>Guests: {booking.guests}</p>

                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="mt-5 bg-red-500 px-5 py-2 rounded-lg font-bold"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}