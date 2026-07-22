import nodemailer from "nodemailer";

// Create production Nodemailer transporter using Gmail SMTP with 587/STARTTLS support
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS via STARTTLS
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
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
  console.log(`[SMTP-SERVICE] Initiating background email dispatch to: ${toEmail}`);
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"NeuroStay AI Support" <${process.env.EMAIL_USER || "support@neurostay.com"}>`,
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP-SERVICE] Email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(`[SMTP-SERVICE] Failed to send email to ${toEmail}:`, error.message);
    return false;
  }
};
