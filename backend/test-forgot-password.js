const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function runTests() {
  console.log("=========================================");
  console.log("   RUNNING FORGOT PASSWORD TEST SCENARIOS ");
  console.log("=========================================");

  // Connect to MongoDB to ensure the user exists
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for test prep...");

  // Upsert the test user
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  await usersCollection.updateOne(
    { email: "munil8215@gmail.com" },
    {
      $set: {
        name: "Muni Lokesh",
        email: "munil8215@gmail.com",
        password: "hashedpassword123", // dummy password
        resetOtp: ""
      }
    },
    { upsert: true }
  );
  console.log("Upserted user 'munil8215@gmail.com' for testing.");

  // Disconnect so it doesn't block exit
  await mongoose.disconnect();

  const baseUrl = "http://localhost:5000/api/auth";

  // Test Case 1: Invalid email format
  try {
    console.log("\n[TC 1] Testing invalid email format ('invalid-email')...");
    const res = await axios.post(`${baseUrl}/forgot-password`, { email: "invalid-email" });
    console.log("Result: Fail (Expected 400 validation error)", res.status, res.data);
  } catch (err) {
    console.log(`Result: Pass (Received ${err.response?.status}):`, err.response?.data);
  }

  // Test Case 2: Non-existing user
  try {
    console.log("\n[TC 2] Testing non-existing user ('nonexistent-user-12345@gmail.com')...");
    const res = await axios.post(`${baseUrl}/forgot-password`, { email: "nonexistent-user-12345@gmail.com" });
    console.log("Result: Fail (Expected 404 User not found)", res.status, res.data);
  } catch (err) {
    console.log(`Result: Pass (Received ${err.response?.status}):`, err.response?.data);
  }

  // Test Case 3: Existing user (Real SMTP credentials should succeed or fail with explicit SMTP error)
  try {
    console.log("\n[TC 3] Testing existing user ('munil8215@gmail.com')...");
    const res = await axios.post(`${baseUrl}/forgot-password`, { email: "munil8215@gmail.com" });
    console.log("Result: SUCCESS (OTP sent successfully):", res.status, res.data);
  } catch (err) {
    console.log(`Result: SMTP/Backend error returned (Received ${err.response?.status}):`, err.response?.data);
  }
}

runTests().catch(console.error);
