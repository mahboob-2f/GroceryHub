import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;