import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const otpStore: Record<string, string> = {};

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NeuroStay AI OTP Verification",
      text: `Your OTP is: ${otp}`,
    });

    console.log("OTP SENT:", otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP required",
    });
  }

  if (otpStore[email] !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  delete otpStore[email];

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export default router;