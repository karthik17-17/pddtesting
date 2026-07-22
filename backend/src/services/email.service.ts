import nodemailer from "nodemailer";

/**
 * Configure Nodemailer Transporter using Gmail SMTP credentials
 * Supports environment variables:
 * - SMTP_HOST / EMAIL_HOST (Default: smtp.gmail.com)
 * - SMTP_PORT / EMAIL_PORT (Default: 587)
 * - SMTP_USER / EMAIL_USER (Default: munil8215@gmail.com)
 * - SMTP_PASS / EMAIL_PASS (Google App Password)
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "munil8215@gmail.com").trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "btybrjkgewttuxot").replace(/\s+/g, "");

  console.log(`[SMTP-CONFIG] Initializing Nodemailer transporter for host: ${host}:${port}, user: ${user}`);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // True for port 465 (SSL), false for port 587 (STARTTLS)
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

export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("[SMTP-SERVICE] Connection verified successfully.");
    return true;
  } catch (error: any) {
    console.error("[SMTP-SERVICE] Connection verification failed:", error.message);
    return false;
  }
};

export const sendResetOtpEmail = async (toEmail: string, otp: string): Promise<boolean> => {
  const normalizedEmail = toEmail.trim().toLowerCase();
  console.log(`[SMTP-SERVICE] Initiating email dispatch to: ${normalizedEmail}`);

  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "munil8215@gmail.com").trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || "btybrjkgewttuxot").replace(/\s+/g, "");

  if (!user || !pass) {
    const errMsg = "SMTP Credentials missing. Please set SMTP_USER and SMTP_PASS in environment variables.";
    console.error(`[SMTP-SERVICE] ${errMsg}`);
    throw new Error(errMsg);
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"NeuroStay AI Support" <${user}>`,
    to: normalizedEmail,
    subject: "NeuroStay AI - Your Password Reset OTP",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #071028; color: #ffffff; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #22d3ee; margin: 0; font-size: 28px; font-weight: 800;">NeuroStay AI</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Hotel Booking & Recovery</p>
        </div>

        <div style="background-color: #0f172a; border-radius: 12px; padding: 24px; border: 1px solid rgba(34, 211, 238, 0.2);">
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 12px; text-align: center;">Password Recovery Code</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your account associated with <strong>${normalizedEmail}</strong>. Please enter the 6-digit OTP code below to complete your reset:
          </p>

          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 1px dashed #38bdf8;">
            <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; font-family: monospace;">${otp}</span>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
            ⚠️ This OTP code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} NeuroStay AI. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP-SERVICE] Email sent successfully to ${normalizedEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(`[SMTP-SERVICE] Failed to send email to ${normalizedEmail}:`, error.message);
    throw new Error(`SMTP Email Error: ${error.message}`);
  }
};
