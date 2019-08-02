const nodemailer = require('nodemailer');
const { configureMail } = require('../services/emails/configureMail');

const sendMail = (req, res, next) => {
  const { mailOptions } = req.body;

  configureMail()
    .then(transporter => {
      transporter.sendMail(mailOptions)
        .then(info => {
          req.body.previewUrl = nodemailer.getTestMessageUrl(info);

          next();
        })
        .catch(next);  
    })
    .catch(next);
};

module.exports = { sendMail };
