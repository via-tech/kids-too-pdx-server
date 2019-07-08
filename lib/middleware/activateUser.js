const { createHttpError } = require('./error');
const User = require('../models/User');

const chargeCard = ({ stripeToken }) => {
  return Promise.resolve({ stripeToken, chargeSuccess: true });
};

const activateUser = (req, res, next) => {
  const { stripeToken, token } = req.body;
  
  if(!token) return next(createHttpError(401, 'Sign in to activate account'));

  if(!stripeToken) return next(createHttpError(401, 'Missing payment information'));

  return User
    .findByToken(req.body.token)
    .then(user => {
      if(!user) return next(createHttpError(401, 'No user with that token'));

      req.body.user = user;

      return chargeCard({ stripeToken })
        .then(({ chargeSuccess, message }) => {
          if(!chargeSuccess) return next(createHttpError(401, message));
    
          return next();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { activateUser };
