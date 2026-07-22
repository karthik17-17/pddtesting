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

savedHotelSchema.index({ userId: 1 });
savedHotelSchema.index({ userId: 1, hotelName: 1 });
savedHotelSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("SavedHotel", savedHotelSchema);