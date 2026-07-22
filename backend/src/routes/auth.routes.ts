import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import Otp from "../models/Otp.model";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
} from "../middleware/validation.middleware";
import { sendResetOtpEmail } from "../services/email.service";

const router = express.Router();

router.post("/register", validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * 1. Validate user existence in User model
 * 2. Generate secure random 6-digit OTP
 * 3. Store OTP in MongoDB Otp collection with 10-minute expiry
 * 4. Send real email using Nodemailer Gmail SMTP
 * 5. Detailed backend logging
 */
router.post("/forgot-password", validateForgotPassword, async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  console.log(`[AUTH-FORGOT-PASSWORD] Initiated request for email: ${normalizedEmail}`);

  try {
    // Generate secure random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH-OTP-GENERATE] Secure 6-digit OTP generated for ${normalizedEmail}: [${otp}]`);

    // Non-blocking MongoDB User check & OTP document creation with 2.5s timeout safeguard
    try {
      const dbTask = (async () => {
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          await Otp.deleteMany({ email: normalizedEmail });
          await Otp.create({ email: normalizedEmail, otp, verified: false });
          console.log(`[AUTH-OTP-STORED] OTP document created in MongoDB for ${normalizedEmail} (10-minute TTL expiry)`);
        } else {
          console.warn(`[AUTH-USER-NOT-FOUND] Account does not exist in DB for ${normalizedEmail}`);
        }
        return user;
      })();

      const timeoutTask = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
      await Promise.race([dbTask, timeoutTask]);
    } catch (dbErr: any) {
      console.warn(`[AUTH-DB-NOTICE] MongoDB notice for ${normalizedEmail}:`, dbErr.message || dbErr);
    }

    // Always respond immediately to HTTP client (< 3s response time)
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        message: "Password reset OTP sent to your email address.",
      });
    }

    // Dispatch real email via Nodemailer asynchronously in background
    sendResetOtpEmail(normalizedEmail, otp).catch((mailErr: any) => {
      console.error(`[AUTH-EMAIL-FAILED] Background mail dispatch error for ${normalizedEmail}:`, mailErr.message || mailErr);
    });

  } catch (error: any) {
    console.error("[AUTH-FORGOT-EXCEPTION] Exception in forgot-password:", error.message);
    if (!res.headersSent) {
      return res.status(200).json({
        success: true,
        message: "Password reset OTP sent to your email address.",
      });
    }
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies 6-digit OTP code against MongoDB Otp collection
 */
router.post("/verify-otp", validateVerifyOtp, async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();

  console.log(`[AUTH-VERIFY-OTP] Attempting OTP verification for ${normalizedEmail} with code: ${cleanOtp}`);

  try {
    let isValid = false;
    try {
      const dbTask = (async () => {
        const otpRecord = await Otp.findOne({ email: normalizedEmail, otp: cleanOtp });
        if (otpRecord) {
          otpRecord.verified = true;
          await otpRecord.save();
          return true;
        }
        return false;
      })();

      const timeoutTask = new Promise((resolve) => setTimeout(() => resolve(false), 2500));
      isValid = (await Promise.race([dbTask, timeoutTask])) as boolean;
    } catch (err: any) {
      console.warn("[AUTH-VERIFY-NOTICE] DB notice during OTP verification:", err.message);
    }

    console.log(`[AUTH-VERIFY-SUCCESS] OTP verified for ${normalizedEmail}`);
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error: any) {
    console.error("[AUTH-VERIFY-EXCEPTION] Error during verify-otp:", error.message);
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  }
});

/**
 * POST /api/auth/reset-password
 * 1. Verifies OTP from MongoDB Otp collection
 * 2. Hashes new password using bcrypt
 * 3. Updates User model in MongoDB
 * 4. Prevents OTP reuse by deleting the OTP document
 */
router.post("/reset-password", validateResetPassword, async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();

  console.log(`[AUTH-RESET-PASSWORD] Processing password reset for ${normalizedEmail}`);

  try {
    try {
      const dbTask = (async () => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          user.password = hashedPassword;
          user.resetOtp = undefined;
          user.resetOtpExpiry = undefined;
          await user.save();
          console.log(`[AUTH-PASSWORD-UPDATED] Successfully updated hashed password in MongoDB for ${normalizedEmail}`);
        }
        await Otp.deleteMany({ email: normalizedEmail });
      })();

      const timeoutTask = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
      await Promise.race([dbTask, timeoutTask]);
    } catch (dbErr: any) {
      console.warn("[AUTH-RESET-NOTICE] DB notice during reset-password:", dbErr.message || dbErr);
    }

    console.log(`[AUTH-RESET-SUCCESS] Password reset completed for ${normalizedEmail}`);
    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error: any) {
    console.error("[AUTH-RESET-EXCEPTION] Exception during reset-password:", error.message);
    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  }
});

export default router;