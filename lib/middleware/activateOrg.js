require('dotenv').config();
const { createHttpError } = require('./error');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createCustomer = ({ stripeToken, user }) => {
  return stripe.customers.create({
    description: `Customer: ${user.name}`,
    email: user.email,
    source: stripeToken
  })
    .catch(error => ({ error }));
};

const createSubscription = ({ stripeToken, user }) => {
  return createCustomer({ stripeToken, user })
    .then(customer => {
      return stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: process.env.STRIPE_PLAN
          }
        ]
      });
    })
    .catch(error => ({ error }));
};

const activateOrg = (req, res, next) => {
  const { stripeToken, token } = req.body;
  
  if(!token) return next(createHttpError(401, 'Sign in to activate account'));

  if(!stripeToken) return next(createHttpError(401, 'Missing payment information'));

  return User
    .findByToken(req.body.token)
    .then(user => {
      if(!user) return next(createHttpError(401, 'No user with that token'));

      req.body.user = user;

      return createSubscription({ stripeToken, user })
        .then(({ error }) => {
          if(error) return next(createHttpError(401, error.message));
    
          return next();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { activateOrg };
