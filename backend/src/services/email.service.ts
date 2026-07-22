import nodemailer from "nodemailer";
import axios from "axios";

export const verifySmtpConnection = async (): Promise<boolean> => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  if (!emailUser || !emailPass) {
    console.warn("[SMTP-SERVICE] Credentials missing.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 5000,
    });
    await transporter.verify();
    console.log("[SMTP-SERVICE] Verification successful.");
    return true;
  } catch (error: any) {
    console.warn("[SMTP-SERVICE] Connection verification warning:", error.message);
    return false;
  }
};

export const sendResetOtpEmail = async (toEmail: string, otp: string): Promise<boolean> => {
  console.log(`[SMTP-SERVICE] Initiating background email dispatch to: ${toEmail}`);
  const emailUser = process.env.EMAIL_USER || "munil8215@gmail.com";
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  // 1. Try Resend HTTPS API if RESEND_API_KEY is present
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("[SMTP-SERVICE] Attempting email dispatch via Resend HTTPS API...");
      const res = await axios.post(
        "https://api.resend.com/emails",
        {
          from: "NeuroStay AI <onboarding@resend.dev>",
          to: [toEmail],
          subject: "NeuroStay AI - Password Reset OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #071028; color: #ffffff; border-radius: 12px;">
              <h2 style="color: #22d3ee; text-align: center;">NeuroStay AI</h2>
              <h3 style="text-align: center;">Password Recovery OTP</h3>
              <p>You requested a password reset for your NeuroStay AI account.</p>
              <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${otp}</span>
              </div>
              <p style="font-size: 13px; color: #94a3b8;">This OTP is valid for 15 minutes.</p>
            </div>
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 8000,
        }
      );
      console.log("[SMTP-SERVICE] Email delivered successfully via Resend HTTPS API:", res.data);
      return true;
    } catch (resendErr: any) {
      console.warn("[SMTP-SERVICE] Resend HTTPS API notice:", resendErr?.response?.data || resendErr.message);
    }
  }

  // 2. Try Nodemailer Gmail Transports (Port 465 SSL, Port 587 STARTTLS, Service Gmail)
  if (emailUser && emailPass) {
    const transportConfigs = [
      { host: "smtp.gmail.com", port: 465, secure: true },
      { host: "smtp.gmail.com", port: 587, secure: false },
      { service: "gmail" },
    ];

    for (const config of transportConfigs) {
      try {
        const transporter = nodemailer.createTransport({
          ...config,
          auth: { user: emailUser, pass: emailPass },
          connectionTimeout: 6000,
          greetingTimeout: 6000,
          socketTimeout: 8000,
          tls: { rejectUnauthorized: false },
        });

        const info = await transporter.sendMail({
          from: `"NeuroStay AI Support" <${emailUser}>`,
          to: toEmail,
          subject: "NeuroStay AI - Password Reset OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #071028; color: #ffffff; border-radius: 12px;">
              <h2 style="color: #22d3ee; text-align: center;">NeuroStay AI</h2>
              <h3 style="text-align: center;">Password Recovery OTP</h3>
              <p>You requested a password reset for your NeuroStay AI account.</p>
              <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${otp}</span>
              </div>
              <p style="font-size: 13px; color: #94a3b8;">This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
            </div>
          `,
        });

        console.log(`[SMTP-SERVICE] Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
        return true;
      } catch (err: any) {
        console.warn(`[SMTP-SERVICE] Transport attempt failed:`, err.message);
      }
    }
  }

  console.error(`[SMTP-SERVICE] Could not deliver email to ${toEmail}. All transports failed or timed out.`);
  return false;
};
