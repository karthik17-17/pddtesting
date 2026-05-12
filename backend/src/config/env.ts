import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/neurostay-ai",
  JWT_SECRET: process.env.JWT_SECRET || "neurostay_secret_key_123",
};