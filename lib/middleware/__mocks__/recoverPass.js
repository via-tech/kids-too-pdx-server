const generator = require('generate-password');
const { hash } = require('../../utils/hash');
const User = require('../../models/User');
const { configureMail } = require('../../services/emails/configureMail');
const nodemailer = require('nodemailer');

const mailOptions = ({ email, name, password }) => {
  const html = `
    <p>Hello ${name},</p>

    <p>You have requested a new password. Your new password is ${password}. You may change your password in profile settings after login.</p>

    <p>Thank you!</p>
  `;

  return {
    from: 'Kids2 <donotreply@viamt.com>',
    replyTo: 'donotreply@viamt.com',
    to: email,
    subject: 'Password Recovery',
    html
  };
};

const recoverPass = (req, res, next) => {
  const { username } = req.body;

  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: false,
    uppercase: true,
    strict: true
  });

  hash(password)
    .then(passwordHash => {
      User
        .findOneAndUpdate({ $or: [{ username }, { email: username }] }, { passwordHash }, { new: true })
        .then(updatedUser => {
          const { email, name } = updatedUser;
          
          configureMail()
            .then(transporter => {
              transporter.sendMail(mailOptions({ email, name, password }))
                .then(info => {
                  req.body.mail = {
                    message: `Temporary password has been sent to ${updatedUser.email}`,
                    password,
                    previewUrl: nodemailer.getTestMessageUrl(info)
                  };
    
                  next();
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { recoverPass };
