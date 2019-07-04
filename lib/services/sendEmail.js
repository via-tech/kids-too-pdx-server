require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = mailOptions => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  return transporter.sendMail(mailOptions)
    .catch(err => err);
};

module.exports = { sendEmail };
