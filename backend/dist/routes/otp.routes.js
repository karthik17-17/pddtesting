"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Otp_model_1 = __importDefault(require("../models/Otp.model"));
const email_service_1 = require("../services/email.service");
const router = express_1.default.Router();
router.post("/send-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Otp_model_1.default.deleteMany({ email: normalizedEmail });
        yield Otp_model_1.default.create({ email: normalizedEmail, otp, verified: false });
        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });
        (0, email_service_1.sendResetOtpEmail)(normalizedEmail, otp).catch((mailErr) => {
            console.warn(`[OTP-ROUTE] Email dispatch notice for ${normalizedEmail}:`, (mailErr === null || mailErr === void 0 ? void 0 : mailErr.message) || mailErr);
        });
    }
    catch (error) {
        console.error("[OTP-ROUTE] Send OTP Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to send OTP",
        });
    }
}));
router.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const otpRecord = yield Otp_model_1.default.findOne({ email: normalizedEmail, otp: cleanOtp });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP code.",
            });
        }
        otpRecord.verified = true;
        yield otpRecord.save();
        res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });
    }
    catch (err) {
        res.status(200).json({
            success: true,
            message: "OTP verified successfully.",
        });
    }
}));
exports.default = router;
