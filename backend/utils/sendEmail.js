const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("EMAIL TRANSPOTER ERROR:", error.message);
  } else {
    console.log("EMAIL SERVER READY");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"DocVerify System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("EMAIL SENT:", info.messageId);
    return info;
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
