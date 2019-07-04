const generator = require('generate-password');
const { hash } = require('../utils/hash');
const User = require('../models/User');

const recoverPass = (req, res, next) => {
  const { username } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    strict: true
  });

  hash(password)
    .then(passwordHash => {
      User
        .findOneAndUpdate({ $or: [{ username }, { email: username }] }, { passwordHash }, { new: true })
        .then(updatedUser => {
          // send email
          req.body.message = `Temporary password has been sent to ${updatedUser.email}`;
          next();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { recoverPass };
