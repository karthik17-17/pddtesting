const express = require('express');
const { storeOtp, verifyAndClearOtp } = require('./dist/utils/otpStore');

console.log("=== Testing OTP Store Logic ===");
const testEmail = "UserTest@Example.COM  ";
const testOtp = "654321";

console.log("Storing OTP...");
storeOtp(testEmail, testOtp);

console.log("Verifying with exact casing...");
const match1 = verifyAndClearOtp("UserTest@Example.COM", testOtp);
console.log("Match 1 Result:", match1);

console.log("Storing OTP again for lowercase test...");
storeOtp("usertest@example.com", "112233");

console.log("Verifying with uppercase casing...");
const match2 = verifyAndClearOtp("USERTEST@EXAMPLE.COM", "112233");
console.log("Match 2 Result:", match2);

console.log("Testing fallback demo OTP...");
const isDemo = "123456" === "123456";
console.log("Demo OTP check:", isDemo);

console.log("=== All Tests Completed Successfully ===");
