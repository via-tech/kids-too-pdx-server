require('dotenv').config();
const { createHttpError } = require('./error');
const User = require('../models/User');

const roles = ['org', 'admin'];

const verifySignUp = (req, res, next) => {
  const { role, username, password, name, email, phone, address, payment, adminPassCode } = req.body;

  if(!roles.includes(role)
    || !username
    || !password
    || !name
    || !email
    || !phone
    || !address
    || !payment) return next(createHttpError(400, 'Incomplete or invalid registration info'));

  return User
    .findOne({ $or: [
      { username },
      { email },
      { name },
      { 'payment.cardName': payment.cardName },
      { name: payment.cardName }
    ] })
    .then(foundUser => {
      if(foundUser) return next(createHttpError(400, 'User already exists'));

      if(role === 'admin' && adminPassCode === process.env.ADMIN_PASS_CODE) {
        return next();
      } else if(role === 'admin') {
        return next(createHttpError(403, 'Inauthentic admin'));
      }

      if(role === 'org') req.body.role = 'inactive';

      // return chargeCard({ cardInfo: payment, amount: 1 })
      //   .then(() => next())
      //   .catch(next);

      return next();
    })
    .catch(next);
};

module.exports = { verifySignUp };
