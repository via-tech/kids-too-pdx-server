const generator = require('generate-password');
const { hash } = require('../utils/hash');
const User = require('../models/User');
const { sendEmail } = require('../services/emails/sendEmail');
const recoverPassMail = require('../services/emails/recoverPassMail');

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
          
          sendEmail(recoverPassMail({ email, name, password }))
            .then(({ password }) => {
              req.body = {
                message: `Temporary password has been sent to ${updatedUser.email}`,
                password
              };
              next();
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { recoverPass };
