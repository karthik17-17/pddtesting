const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

console.log("Environment variables:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "******** (Length: " + process.env.EMAIL_PASS.length + ")" : "undefined");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

// Strip any spaces in Gmail App Password
const cleanPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: cleanPass,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized: false
  }
});

async function verify() {
  try {
    console.log("\nVerifying SMTP connection via Port 587 (STARTTLS)...");
    const success = await transporter.verify();
    console.log("SMTP Configuration is correct:", success);
    
    console.log("\nAttempting to send a test email to:", process.env.EMAIL_USER);
    const info = await transporter.sendMail({
      from: `"NeuroStay AI Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "SMTP Verification Test - Port 587",
      text: "This is a verification test to check if the OTP SMTP system is working correctly via Port 587."
    });
    console.log("Email Sent Successfully! Response info:", info.messageId || info.response);
  } catch (error) {
    console.error("Verification failed with error:", error.message);
    if (error.response) console.error("SMTP Response:", error.response);
  }
}

verify();
