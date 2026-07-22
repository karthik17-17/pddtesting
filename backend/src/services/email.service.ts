import nodemailer from "nodemailer";

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
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  if (!emailUser || !emailPass) {
    console.warn("[SMTP-SERVICE] EMAIL_USER or EMAIL_PASS not set in environment.");
    return false;
  }

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
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 6000,
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

  console.error(`[SMTP-SERVICE] Could not deliver email to ${toEmail}. All transports failed or timed out.`);
  return false;
};
