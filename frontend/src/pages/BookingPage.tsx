import { useEffect, useState } from "react";

type Booking = {
  id: number;
  hotelName: string;
  location: string;
  price: string;
  status: string;
};

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );

    setBookings(savedBookings);
  }, []);

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <h1 className="text-6xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8">
          <h2 className="text-3xl font-bold">
            No bookings yet
          </h2>

          <p className="text-gray-400 mt-3">
            Book a hotel to see it here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#1E293B] border border-gray-700 rounded-3xl p-6"
            >
              <h2 className="text-3xl font-bold">
                {booking.hotelName}
              </h2>

              <p className="text-gray-400 mt-3">
                📍 {booking.location}
              </p>

              <p className="text-cyan-400 text-3xl font-bold mt-5">
                ₹{booking.price}
              </p>

              <p className="mt-5 bg-green-500 text-black font-bold px-4 py-2 rounded-xl inline-block">
                {booking.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;