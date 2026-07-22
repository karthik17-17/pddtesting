import mongoose from "mongoose";

export interface IOtp extends mongoose.Document {
  email: string;
  otp: string;
  verified: boolean;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // MongoDB TTL index: Automatically deletes document after 10 minutes (600 seconds)
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
