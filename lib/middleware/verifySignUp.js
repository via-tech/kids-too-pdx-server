require('dotenv').config();
const { createHttpError } = require('./error');
const User = require('../models/User');

const roles = ['org', 'admin'];

const chargeCard = (cardInfo, amount) => Promise.resolve({ cardInfo, amount });

const verifySignUp = (req, res, next) => {
  const { role, username, password, name, email, phone, payment, adminPassCode } = req.body;

  if(!roles.includes(role)
    || !username
    || !password
    || !name
    || !email
    || !phone
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

      return chargeCard(payment, 1)
        .then(() => next())
        .catch(next);
    })
    .catch(next);
};

module.exports = { verifySignUp };
