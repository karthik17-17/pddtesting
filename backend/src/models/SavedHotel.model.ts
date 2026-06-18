import mongoose from "mongoose";

const savedHotelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelName: String,
    hotelImage: String,
    price: String,
    address: String,
    rating: Number,
    matchScore: Number,
    why: String,
    mapLink: String,
  },
  { timestamps: true }
);

export default mongoose.model("SavedHotel", savedHotelSchema);