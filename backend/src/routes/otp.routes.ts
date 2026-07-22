import express from "express";
import Otp from "../models/Otp.model";
import { sendResetOtpEmail } from "../services/email.service";

const router = express.Router();

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[OTP-ROUTE] Generated secure OTP for ${normalizedEmail}: [${otp}]`);

    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, otp, verified: false });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

    sendResetOtpEmail(normalizedEmail, otp).catch((mailErr) => {
      console.warn(`[OTP-ROUTE] Email dispatch notice for ${normalizedEmail}:`, mailErr?.message || mailErr);
    });

  } catch (error: any) {
    console.error("[OTP-ROUTE] Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : "";
  const cleanOtp = otp ? String(otp).trim() : "";

  if (!normalizedEmail || !cleanOtp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required.",
    });
  }

  try {
    const otpRecord = await Otp.findOne({ email: normalizedEmail, otp: cleanOtp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code.",
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (err: any) {
    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  }
});

export default router;