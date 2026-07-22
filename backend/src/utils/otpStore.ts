interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const otpMap = new Map<string, OtpEntry>();

export const storeOtp = (email: string, otp: string, ttlMs: number = 15 * 60 * 1000): void => {
  const normalizedEmail = email.trim().toLowerCase();
  otpMap.set(normalizedEmail, {
    otp,
    expiresAt: Date.now() + ttlMs,
  });
  console.log(`[OTP-STORE] Stored OTP for ${normalizedEmail}. Total stored: ${otpMap.size}`);
};

export const verifyAndClearOtp = (email: string, otp: string): boolean => {
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

export const getOtp = (email: string): string | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = otpMap.get(normalizedEmail);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.otp;
};
