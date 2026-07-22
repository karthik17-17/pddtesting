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
exports.sendResetOtpEmail = exports.createTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Creates and configures Nodemailer SMTP transporter for Gmail / Custom SMTP
 */
const createTransporter = () => {
    const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com").trim();
    const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "munil8215@gmail.com").trim();
    const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "btybrjkgewttuxot").replace(/\s+/g, "");
    console.log(`[SMTP-CONFIG] Initializing Nodemailer transporter (Host: ${host}, Port: ${port}, Secure: ${secure}, User: ${user})`);
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
    });
};
exports.createTransporter = createTransporter;
/**
 * Sends 6-digit OTP email to specified recipient using Nodemailer
 * @param toEmail Recipient email address
 * @param otp 6-digit verification code
 */
const sendResetOtpEmail = (toEmail, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedEmail = toEmail.trim().toLowerCase();
    console.log(`[SMTP-ATTEMPT] Preparing email dispatch for target: ${normalizedEmail}`);
    const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "munil8215@gmail.com").trim();
    const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "btybrjkgewttuxot").replace(/\s+/g, "");
    if (!user || !pass) {
        const errMsg = "SMTP Credentials missing. Please configure SMTP_USER and SMTP_PASS environment variables.";
        console.error(`[SMTP-ERROR] ${errMsg}`);
        throw new Error(errMsg);
    }
    const transporter = (0, exports.createTransporter)();
    // Verify SMTP connection before attempting email dispatch
    try {
        console.log("[SMTP-VERIFY] Testing SMTP connection configuration...");
        yield transporter.verify();
        console.log("[SMTP-VERIFY] SMTP server connection verified successfully!");
    }
    catch (verifyErr) {
        console.error("[SMTP-VERIFY-ERROR] Failed to verify SMTP connection:", verifyErr.message || verifyErr);
        // Continue attempt but log error
    }
    const mailOptions = {
        from: `"NeuroStay AI Support" <${user}>`,
        to: normalizedEmail,
        subject: "NeuroStay AI - Password Reset OTP",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #071028; color: #ffffff; border-radius: 16px;">
        <h2 style="color: #22d3ee; text-align: center; font-size: 28px; margin-bottom: 8px;">NeuroStay AI</h2>
        <p style="text-align: center; color: #94a3b8; margin-top: 0;">Security Verification Code</p>
        
        <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px dashed #38bdf8;">
          <p style="font-size: 14px; color: #94a3b8; margin-bottom: 8px;">Your 6-Digit Password Reset OTP:</p>
          <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">
          You requested a password reset for your NeuroStay AI account associated with <strong>${normalizedEmail}</strong>.
        </p>
        <p style="font-size: 13px; color: #f59e0b; margin-top: 16px;">
          ⏱️ This OTP code is valid for <strong>10 minutes</strong> only. Do not share this code with anyone.
        </p>
        <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          If you did not request a password reset, please ignore this message. Your account remains secure.
        </p>
      </div>
    `,
    };
    try {
        console.log(`[SMTP-SENDING] Sending OTP email to ${normalizedEmail}...`);
        const info = yield transporter.sendMail(mailOptions);
        console.log(`[SMTP-SUCCESS] Email delivered to ${normalizedEmail}! Message ID: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error(`[SMTP-FAILURE] Email delivery failed for ${normalizedEmail}:`, error.message || error);
        throw new Error(`SMTP Email Error: ${error.message || "Unknown mail error"}`);
    }
});
exports.sendResetOtpEmail = sendResetOtpEmail;
