require('dotenv').config();
const nodemailer = require('nodemailer');

const configureMail = () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  return Promise.resolve(transporter);
};

module.exports = { configureMail };
