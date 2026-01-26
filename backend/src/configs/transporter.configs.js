import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.google.email",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});