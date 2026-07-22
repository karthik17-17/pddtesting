"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtp = exports.verifyAndClearOtp = exports.storeOtp = void 0;
const otpMap = new Map();
const storeOtp = (email, otp, ttlMs = 15 * 60 * 1000) => {
    const normalizedEmail = email.trim().toLowerCase();
    otpMap.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + ttlMs,
    });
    console.log(`[OTP-STORE] Stored OTP for ${normalizedEmail}. Total stored: ${otpMap.size}`);
};
exports.storeOtp = storeOtp;
const verifyAndClearOtp = (email, otp) => {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = otpMap.get(normalizedEmail);
    if (!entry) {
        console.log(`[OTP-STORE] No OTP found for ${normalizedEmail}`);
        return false;
    }
    if (Date.now() > entry.expiresAt) {
        console.log(`[OTP-STORE] Expired OTP for ${normalizedEmail}`);
        otpMap.delete(normalizedEmail);
        return false;
    }
    if (entry.otp === otp) {
        console.log(`[OTP-STORE] OTP verified successfully for ${normalizedEmail}`);
        otpMap.delete(normalizedEmail);
        return true;
    }
    console.log(`[OTP-STORE] Mismatched OTP for ${normalizedEmail}. Received: ${otp}`);
    return false;
};
exports.verifyAndClearOtp = verifyAndClearOtp;
const getOtp = (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = otpMap.get(normalizedEmail);
    if (!entry || Date.now() > entry.expiresAt)
        return null;
    return entry.otp;
};
exports.getOtp = getOtp;
