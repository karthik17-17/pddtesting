import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true },
    hotelImage: String,
    price: String,
    guestName: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);